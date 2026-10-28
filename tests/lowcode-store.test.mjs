import test from 'node:test'
import assert from 'node:assert/strict'
import os from 'node:os'
import path from 'node:path'
import { mkdir, mkdtemp, writeFile, readFile, readdir, rm, symlink } from 'node:fs/promises'
import { skeletonFiles } from '../tooling/init/skeleton.mjs'
import { applyOperations } from '@mofang/low-code-page/authoring'
import { readDocument, changeDocument, restoreDocument } from '../tooling/lowcode/file-store.mjs'

async function fixture(t) {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), 'mf-author-'))
    t.after(() => rm(rootDir, { recursive: true, force: true }))
    const files = skeletonFiles('example', {
        settingsRenderer: 'puck',
        businessRenderer: 'puck',
    })
    for (const [name, content] of Object.entries(files)) {
        const file = path.join(rootDir, 'nodes/example', name)
        await mkdir(path.dirname(file), { recursive: true })
        await writeFile(file, content)
    }
    return { rootDir }
}
const titleChange = (title) => (definition) =>
    applyOperations(definition, [{ op: 'page.update', value: { title } }])

test('批量依赖修改成功才落盘；语义错误和非法最终包都保留原文件', async (t) => {
    const options = await fixture(t)
    const before = await readDocument('example', 'settings', options)
    const bytes = await readFile(before.file)
    const business = await readDocument('example', 'business', options)
    await assert.rejects(
        changeDocument(
            'example',
            'settings',
            before.revision,
            (definition) =>
                applyOperations(definition, [
                    { op: 'page.update', value: { title: '半成品不得保存' } },
                    { op: 'component.remove', componentId: 'missing-component' },
                ]),
            options,
        ),
        /组件不存在/,
    )
    assert.deepEqual(await readFile(before.file), bytes)
    await assert.rejects(
        changeDocument('example', 'settings', before.revision, () => ({ definition: {} }), options),
        { code: 'validation_failed' },
    )
    assert.deepEqual(await readFile(before.file), bytes)
    const changed = await changeDocument(
        'example',
        'settings',
        before.revision,
        (definition) =>
            applyOperations(definition, [
                {
                    op: 'field.upsert',
                    ref: 'new-field',
                    value: {
                        name: 'extra',
                        formId: 'main1',
                        label: '新增字段',
                        type: 'string',
                        defaultValue: '',
                    },
                },
                {
                    op: 'component.add',
                    ref: 'new-control',
                    type: 'TextField',
                    parentId: definition.page.content[0].props.id,
                    props: { fieldId: { $ref: 'new-field' } },
                },
            ]),
        options,
    )
    assert.notEqual(changed.revision, before.revision)
    assert.equal(changed.checkpointId, before.revision)
    assert.ok(changed.definition.logic.fields[changed.idMap['new-field']])
    assert.equal((await readDocument('example', 'business', options)).revision, business.revision)
    assert.equal(
        (await readdir(path.dirname(before.file))).some((file) => file.endsWith('.tmp')),
        false,
    )
})

test('过期 revision 和变换期间外部修改都失败，原外部内容不被覆盖', async (t) => {
    const options = await fixture(t)
    const before = await readDocument('example', 'settings', options)
    const first = await changeDocument(
        'example',
        'settings',
        before.revision,
        titleChange('第一版'),
        options,
    )
    await assert.rejects(
        changeDocument('example', 'settings', before.revision, titleChange('旧提交'), options),
        { code: 'revision_conflict' },
    )
    await assert.rejects(
        changeDocument(
            'example',
            'settings',
            first.revision,
            async (definition) => {
                const external = structuredClone(definition)
                external.title = '外部编辑'
                await writeFile(before.file, JSON.stringify(external, null, 4) + '\n')
                return titleChange('不得覆盖外部编辑')(definition)
            },
            options,
        ),
        { code: 'revision_conflict' },
    )
    assert.equal((await readDocument('example', 'settings', options)).definition.title, '外部编辑')
    assert.deepEqual(await readdir(path.join(options.rootDir, '.cache/lowcode/locks')), [])
})

test('检查点恢复只影响指定面板，损坏检查点和错误身份被拒绝', async (t) => {
    const options = await fixture(t)
    const before = await readDocument('example', 'settings', options)
    const business = await readDocument('example', 'business', options)
    const changed = await changeDocument(
        'example',
        'settings',
        before.revision,
        titleChange('修改后'),
        options,
    )
    const restored = await restoreDocument(
        'example',
        'settings',
        changed.revision,
        changed.checkpointId,
        options,
    )
    assert.deepEqual(restored.definition, before.definition)
    assert.notEqual(restored.revision, changed.revision)
    assert.equal((await readDocument('example', 'business', options)).revision, business.revision)
    await assert.rejects(
        restoreDocument('example', 'settings', restored.revision, '../escape', options),
        { code: 'invalid_checkpoint' },
    )
    await assert.rejects(
        changeDocument(
            'example',
            'settings',
            restored.revision,
            (definition) => {
                definition.extensions.workflow.nodeCode = 'another-node'
                return { definition }
            },
            options,
        ),
        { code: 'validation_failed' },
    )
    await writeFile(
        path.join(
            options.rootDir,
            '.cache/lowcode/checkpoints/example/settings',
            changed.revision + '.json',
        ),
        '{}',
    )
    await assert.rejects(
        restoreDocument('example', 'settings', restored.revision, changed.revision, options),
        { code: 'checkpoint_corrupt' },
    )
    assert.equal((await readDocument('example', 'settings', options)).revision, restored.revision)
})

test('并行操作返回忙碌且不覆盖已持锁的事务', async (t) => {
    const options = await fixture(t)
    const before = await readDocument('example', 'settings', options)
    let enter, release
    const entered = new Promise((resolve) => {
        enter = resolve
    })
    const gate = new Promise((resolve) => {
        release = resolve
    })
    const first = changeDocument(
        'example',
        'settings',
        before.revision,
        async (definition) => {
            enter()
            await gate
            return titleChange('持锁事务')(definition)
        },
        options,
    )
    await entered
    try {
        await assert.rejects(
            changeDocument(
                'example',
                'settings',
                before.revision,
                titleChange('竞争事务'),
                options,
            ),
            { code: 'document_busy' },
        )
    } finally {
        release()
    }
    await first
    assert.equal((await readDocument('example', 'settings', options)).definition.title, '持锁事务')
})

test('页面路径和缓存 junction 均不能逃逸工作区', async (t) => {
    const options = await fixture(t)
    const outside = await mkdtemp(path.join(os.tmpdir(), 'mf-outside-'))
    t.after(() => rm(outside, { recursive: true, force: true }))
    const before = await readDocument('example', 'settings', options)
    await assert.rejects(readDocument('../example', 'settings', options), /node code/)
    await symlink(outside, path.join(options.rootDir, '.cache'), 'junction')
    await assert.rejects(
        changeDocument('example', 'settings', before.revision, titleChange('不应写入'), options),
        { code: 'unsafe_cache_path' },
    )
    assert.deepEqual(await readdir(outside), [])
    assert.equal((await readDocument('example', 'settings', options)).revision, before.revision)
    await symlink(outside, path.join(options.rootDir, 'nodes/example/escaped'), 'junction')
    await writeFile(path.join(outside, 'settings.page.json'), JSON.stringify(before.definition))
    const manifestFile = path.join(options.rootDir, 'nodes/example/panels.json')
    const manifest = JSON.parse(await readFile(manifestFile, 'utf8'))
    manifest.settings.entry = 'escaped/settings.page.json'
    await writeFile(manifestFile, JSON.stringify(manifest))
    await assert.rejects(readDocument('example', 'settings', options), /escapes/)
})
