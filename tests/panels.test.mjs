import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import os from 'node:os'
import { mkdtemp, mkdir, writeFile, readFile, cp, symlink, rm } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readNodePanels, resolvePanelPath } from '../tooling/panels/manifest.mjs'
import { skeletonFiles } from '../tooling/init/skeleton.mjs'
import { validateAuthoringPackage } from '@mofang/low-code-page/authoring'
import { verifyNodeArtifacts } from '../tooling/verify/artifacts.mjs'
import { prepareSave } from '../tooling/panels/prepare-save.mjs'
import { root } from '../tooling/paths.mjs'

async function temporary(t) {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'mf-panel-'))
    t.after(() => rm(directory, { recursive: true, force: true }))
    return directory
}

async function writeNode(rootDir, code, files) {
    for (const [name, content] of Object.entries(files)) {
        const file = path.join(rootDir, 'nodes', code, name)
        await mkdir(path.dirname(file), { recursive: true })
        await writeFile(file, content)
    }
}

test('面板清单保留旧 Lit，并拒绝无效清单和入口逃逸', async (t) => {
    const rootDir = await temporary(t)
    await writeNode(rootDir, 'legacy', {
        'settings.ts': 'export default 1',
        'view.ts': 'export default 2',
    })
    assert.equal((await readNodePanels('legacy', { rootDir })).legacy, true)
    const filename = path.join(rootDir, 'nodes/legacy/panels.json')
    await writeFile(filename, '{')
    await assert.rejects(readNodePanels('legacy', { rootDir }), SyntaxError)
    const valid = {
        version: 1,
        settings: { renderer: 'lit', entry: 'settings.ts' },
        business: { renderer: 'lit', entry: 'view.ts' },
    }
    for (const value of [
        { ...valid, version: 2 },
        { ...valid, settings: { renderer: 'unknown', entry: 'settings.ts' } },
        { ...valid, settings: { renderer: 'puck', entry: 'settings.ts' } },
        { ...valid, settings: { renderer: 'lit', entry: '../settings.ts' } },
        { ...valid, settings: { renderer: 'lit', entry: 'C:/settings.ts' } },
        { ...valid, settings: { renderer: 'lit', entry: 'sub\\settings.ts' } },
        { ...valid, business: valid.settings },
    ]) {
        await writeFile(filename, JSON.stringify(value))
        await assert.rejects(readNodePanels('legacy', { rootDir }))
    }
    await writeFile(filename, JSON.stringify(valid))
    assert.equal(
        await resolvePanelPath('legacy', 'settings', { rootDir }),
        path.join(rootDir, 'nodes/legacy/settings.ts'),
    )
    await assert.rejects(resolvePanelPath('legacy', 'invalid', { rootDir }))
    await assert.rejects(readNodePanels('../legacy', { rootDir }))
    await mkdir(path.join(rootDir, 'outside'))
    await writeFile(path.join(rootDir, 'outside/settings.ts'), 'export default 3')
    await symlink(
        path.join(rootDir, 'outside'),
        path.join(rootDir, 'nodes/legacy/escaped'),
        'junction',
    )
    await writeFile(
        filename,
        JSON.stringify({ ...valid, settings: { renderer: 'lit', entry: 'escaped/settings.ts' } }),
    )
    await assert.rejects(readNodePanels('legacy', { rootDir }), /escapes/)
})

test('骨架的四种渲染组合生成共享校验通过的完整页面', () => {
    for (const settingsRenderer of ['lit', 'puck'])
        for (const businessRenderer of ['lit', 'puck']) {
            const files = skeletonFiles('example', { settingsRenderer, businessRenderer })
            const panels = JSON.parse(files['panels.json'])
            for (const [surface, renderer] of [
                ['settings', settingsRenderer],
                ['business', businessRenderer],
            ]) {
                assert.equal(panels[surface].renderer, renderer)
                assert.ok(files[panels[surface].entry])
                if (renderer === 'puck') {
                    const value = JSON.parse(files[panels[surface].entry])
                    const validation = validateAuthoringPackage(value, {
                        nodeCode: 'example',
                        surface,
                    })
                    assert.equal(validation.valid, true, JSON.stringify(validation))
                    assert.ok(value.logic)
                    assert.ok(value.cells)
                    assert.ok(value.dialogs)
                }
            }
            assert.equal(Boolean(files['settings.ts']), settingsRenderer === 'lit')
            assert.equal(Boolean(files['view.ts']), businessRenderer === 'lit')
            assert.match(files['node.ts'], /code: 'example'/)
        }
    assert.throws(() => skeletonFiles('bad', { businessRenderer: 'unknown' }))
})

test('真实构建四种组合，离线保存严格检查当前源码、产物及目录身份', async (t) => {
    const rootDir = await temporary(t)
    for (const name of [
        'tooling',
        'lib',
        'tsconfig.json',
        'tsconfig.base.json',
        'tsconfig.goja.json',
        'tsconfig.page-program.json',
        'package.json',
    ])
        await cp(path.join(root, name), path.join(rootDir, name), { recursive: true })
    await symlink(path.join(root, 'node_modules'), path.join(rootDir, 'node_modules'), 'junction')
    for (const settingsRenderer of ['lit', 'puck'])
        for (const businessRenderer of ['lit', 'puck']) {
            const code = settingsRenderer + '-' + businessRenderer
            const files = skeletonFiles(code, { settingsRenderer, businessRenderer })
            if (code === 'lit-lit') {
                files['page.ts'] =
                    'import {helper} from "./page-helper";export {helper as prepareInput}'
                files['page-helper.ts'] =
                    'export function helper(){return {kind:"prepared",values:{},usedRefs:[],fieldSources:{}}}'
            }
            await writeNode(rootDir, code, files)
        }
    // 缺少 panels.json 的旧工程也必须在同一次真实构建中保留行为。
    const legacy = skeletonFiles('legacy')
    delete legacy['panels.json']
    await writeNode(rootDir, 'legacy', legacy)
    const built = spawnSync(process.execPath, [path.join(rootDir, 'tooling/build/index.mjs')], {
        cwd: rootDir,
        encoding: 'utf8',
    })
    assert.equal(built.status, 0, built.stdout + built.stderr)
    for (const code of ['lit-lit', 'lit-puck', 'puck-lit', 'puck-puck', 'legacy']) {
        const { manifest } = await verifyNodeArtifacts(code, { rootDir })
        assert.equal(Boolean(manifest.artifacts.pageProgram), !code.endsWith('puck'))
        const node = JSON.parse(
            await readFile(path.join(rootDir, 'dist', code, 'node.json'), 'utf8'),
        )
        assert.equal(node.code, code)
        assert.equal('panels' in node, false)
        assert.equal('rendererKey' in node, false)
    }
    const code = 'puck-puck'
    const catalogFile = path.join(rootDir, 'catalog.json')
    await writeFile(
        catalogFile,
        JSON.stringify({
            ok: true,
            data: { nodeCode: code, catalogInstanceId: 'catalog-fixture', catalogRevision: '3' },
        }),
    )
    const out = path.join(rootDir, 'save.json')
    const body = await prepareSave({ code, surface: 'business', catalogFile, out, rootDir })
    assert.equal(body.renderMode, 'lowcode')
    assert.equal(body.rendererKey, 'puck')
    assert.equal(body.expectedCatalogRevision, '3')
    assert.equal('viewSource' in body, false)
    assert.equal('programSource' in body, false)
    assert.deepEqual(JSON.parse(await readFile(out, 'utf8')), body)
    // 旧目录源码快照仍可使用 code，但不允许用别名掩盖身份冲突。
    const legacyCatalog = path.join(rootDir, 'legacy-catalog.json')
    await writeFile(
        legacyCatalog,
        JSON.stringify({ code, catalogInstanceId: 'catalog-fixture', catalogRevision: '3' }),
    )
    assert.deepEqual(
        await prepareSave({ code, surface: 'business', catalogFile: legacyCatalog, rootDir }),
        body,
    )
    for (const snapshot of [
        { nodeCode: 'other', code },
        { nodeCode: code, code: 'other' },
        { nodeCode: '', code },
    ]) {
        await writeFile(
            legacyCatalog,
            JSON.stringify({
                ...snapshot,
                catalogInstanceId: 'catalog-fixture',
                catalogRevision: '3',
            }),
        )
        await assert.rejects(
            prepareSave({ code, surface: 'business', catalogFile: legacyCatalog, rootDir }),
            /catalog/,
        )
    }
    await assert.rejects(prepareSave({ code, surface: 'business', catalogFile, out, rootDir }), {
        code: 'EEXIST',
    })
    await assert.rejects(
        prepareSave({ code: 'lit-lit', surface: 'business', catalogFile, rootDir }),
        /catalog/,
    )
    const sourceFile = path.join(rootDir, 'nodes', code, 'business.page.json')
    const originalSource = await readFile(sourceFile, 'utf8')
    await writeFile(sourceFile, originalSource + '\n')
    await assert.rejects(
        prepareSave({ code, surface: 'business', catalogFile, rootDir }),
        /source changed/,
    )
    await writeFile(sourceFile, originalSource)
    const artifactFile = path.join(rootDir, 'dist', code, 'business.page.json')
    const originalArtifact = await readFile(artifactFile, 'utf8')
    await writeFile(artifactFile, originalArtifact + '\n')
    await assert.rejects(
        prepareSave({ code, surface: 'business', catalogFile, rootDir }),
        /产物已改动/,
    )
    const manifestFile = path.join(rootDir, 'dist', code, 'manifest.json')
    const manifest = JSON.parse(await readFile(manifestFile, 'utf8'))
    // 即使重新计算 hash，错误 JSON 页面依然必须被共享 schema 拒绝。
    await writeFile(artifactFile, '{}')
    manifest.artifacts.business.sha256 = createHash('sha256').update('{}').digest('hex')
    manifest.artifacts.business.bytes = 2
    await writeFile(manifestFile, JSON.stringify(manifest))
    await assert.rejects(verifyNodeArtifacts(code, { rootDir }), /PagePackage/)
    await writeFile(
        catalogFile,
        JSON.stringify({
            code: 'lit-lit',
            catalogInstanceId: 'catalog-fixture',
            catalogRevision: '4',
        }),
    )
    await assert.rejects(
        prepareSave({ code: 'lit-lit', surface: 'business', catalogFile, rootDir }),
        /supportedContextSchemas/,
    )
    const lit = await prepareSave({
        code: 'lit-lit',
        surface: 'business',
        catalogFile,
        rootDir,
        supportedContextSchemas: ['fixture-explicit-context'],
    })
    assert.equal(lit.renderMode, 'lit')
    assert.ok(lit.viewSource)
    assert.ok(lit.viewCompiled)
    assert.match(lit.viewHash, /^[0-9a-f]{64}$/)
    assert.ok(lit.programSource)
    assert.ok(lit.programCompiled)
    assert.match(lit.programHash, /^[0-9a-f]{64}$/)
    assert.equal('config' in lit, false)
    // 入口与其 hash 未变，只修改真实本地依赖，也不能提交旧产物。
    await writeFile(
        path.join(rootDir, 'nodes/lit-lit/page-helper.ts'),
        'export function helper(){return {kind:"requires_input",fields:["item"],reason:"changed"}}',
    )
    await assert.rejects(
        prepareSave({
            code: 'lit-lit',
            surface: 'business',
            catalogFile,
            rootDir,
            supportedContextSchemas: ['fixture-explicit-context'],
        }),
        /依赖或构建条件已变化/,
    )
})
