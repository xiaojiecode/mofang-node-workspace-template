import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import os from 'node:os'
import { createHash } from 'node:crypto'
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, symlink } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { runLowcode } from '../tooling/lowcode/cli.mjs'
import { guide } from '../tooling/lowcode/guide.mjs'
import { syncVendor } from '../tooling/vendor/sync.mjs'

const digest = (bytes) => createHash('sha256').update(bytes).digest('hex')
async function fixture(t, manifest = true) {
    const base = await mkdtemp(path.join(os.tmpdir(), 'mofang-vendor-test-'))
    t.after(() => rm(base, { recursive: true, force: true }))
    const workspace = path.join(base, 'workspace'),
        source = path.join(base, 'source')
    await mkdir(workspace)
    await mkdir(source)
    const pkg = {
        name: '@mofang/low-code-page',
        version: '1.0.0',
        type: 'module',
        exports: { './authoring': './index.js' },
    }
    const files = { 'package.json': JSON.stringify(pkg), 'index.js': 'export const version = 1\n' }
    for (const [name, body] of Object.entries(files)) await writeFile(path.join(source, name), body)
    if (manifest)
        await writeFile(
            path.join(source, 'manifest.json'),
            JSON.stringify({
                outputs: Object.entries(files).map(([name, body]) => ({
                    path: name,
                    sha256: digest(body),
                })),
            }),
        )
    return { base, workspace, source, files }
}

test('SDK catalog exposes all public methods and the applied-result helper', async () => {
    const catalog = await runLowcode(['catalog', '--category', 'sdk', '--limit', '100'])
    const { WORKFLOW_SDK_METHODS } = await import('../vendor/workflow-sdk/dist/lowcode.js')
    assert.equal(catalog.total, WORKFLOW_SDK_METHODS.length + 2)
    assert.equal(
        catalog.items.filter((item) => !item.path.startsWith('workflow.')).length,
        WORKFLOW_SDK_METHODS.length,
    )
    assert.ok(catalog.items.some((item) => item.path === 'configuration.save'))
    assert.equal(
        catalog.items.some((item) => item.path === 'configuration.setAutoExecute'),
        false,
    )
    const helper = await runLowcode([
        'catalog',
        '--category',
        'sdk',
        '--id',
        'workflow.nodeAction.run',
    ])
    assert.equal(helper.items[0].path, 'workflow.nodeAction.run')
    assert.match(helper.items[0].description, /applied/)
    assert.ok(helper.items[0].parameters.length)
    const reset = await runLowcode([
        'catalog',
        '--category',
        'sdk',
        '--id',
        'workflow.settings.resetField',
    ])
    assert.ok(reset.items[0].parametersSchema.anyOf)
    assert.match(reset.items[0].description, /undefined/)
    const original = await runLowcode([
        'catalog',
        '--category',
        'sdk',
        '--id',
        'sdk.nodeFlow.action',
    ])
    assert.equal(original.items[0].path, 'nodeFlow.action')
    await assert.rejects(
        runLowcode(['catalog', '--category', 'sdk', '--id', 'invented']),
        (error) => error.code === 'unsupported_capability',
    )
})

test('catalog rejects invalid pagination and guide points at real categories/schema', async () => {
    for (const category of ['sdk', 'material'])
        for (const [flag, value] of [
            ['offset', '-1'],
            ['offset', '1.2'],
            ['offset', 'NaN'],
            ['limit', '0'],
            ['limit', '101'],
            ['limit', 'Infinity'],
        ]) {
            await assert.rejects(
                runLowcode(['catalog', '--category', category, `--${flag}=${value}`]),
                (error) => error.code === 'invalid_pagination',
            )
        }
    assert.equal(guide.tools.catalog.category, 'material|logic|schema|sdk')
    const operations = await runLowcode(['catalog', '--id', 'operations'])
    assert.ok(operations.items[0].parameters)
    await assert.rejects(runLowcode(['unknown']), (error) => error.code === 'unknown_tool')
})

test('stdin requests are parsed as objects with structured errors', () => {
    const cli = path.resolve(import.meta.dirname, '../tooling/lowcode/cli.mjs')
    const result = spawnSync(process.execPath, [cli, 'apply', '--file', '-'], {
        input: '[]',
        encoding: 'utf8',
    })
    assert.equal(result.status, 1)
    assert.equal(JSON.parse(result.stdout).error.code, 'invalid_request')
})

test('sync replaces vendor and installed copies and removes stale output files', async (t) => {
    const { workspace, source } = await fixture(t)
    for (const folder of ['vendor/low-code-page', 'node_modules/@mofang/low-code-page']) {
        const destination = path.join(workspace, folder)
        await mkdir(destination, { recursive: true })
        await writeFile(
            path.join(destination, 'package.json'),
            JSON.stringify({ name: '@mofang/low-code-page' }),
        )
        await writeFile(path.join(destination, 'old-chunk.js'), 'old')
    }
    const result = await syncVendor({ 'low-code': source }, { rootDir: workspace })
    assert.equal(result.ok, true)
    assert.equal(result.packages['@mofang/low-code-page'].outputCount, 3)
    for (const folder of ['vendor/low-code-page', 'node_modules/@mofang/low-code-page']) {
        assert.deepEqual((await readdir(path.join(workspace, folder))).sort(), [
            'index.js',
            'manifest.json',
            'package.json',
        ])
    }
    assert.deepEqual((await readdir(path.join(workspace, 'vendor'))).sort(), [
        'low-code-page',
        'lowcode-lock.json',
    ])
})

test('sync rejects changed or unlisted outputs before modifying a previous package', async (t) => {
    const { workspace, source } = await fixture(t)
    await syncVendor({ 'low-code': source }, { rootDir: workspace })
    const lock = await readFile(path.join(workspace, 'vendor/lowcode-lock.json'), 'utf8')
    await writeFile(path.join(source, 'index.js'), 'tampered')
    await assert.rejects(syncVendor({ 'low-code': source }, { rootDir: workspace }), /hash 不一致/)
    assert.equal(await readFile(path.join(workspace, 'vendor/lowcode-lock.json'), 'utf8'), lock)
    assert.equal(
        await readFile(path.join(workspace, 'vendor/low-code-page/index.js'), 'utf8'),
        'export const version = 1\n',
    )
    await writeFile(path.join(source, 'index.js'), 'export const version = 1\n')
    await writeFile(path.join(source, 'unlisted.js'), 'extra')
    await assert.rejects(syncVendor({ 'low-code': source }, { rootDir: workspace }), /输出清单/)
})

test('manifestless SDK-style inventory pins all file content', async (t) => {
    const { workspace, source } = await fixture(t, false)
    const first = await syncVendor({ 'low-code': source }, { rootDir: workspace })
    await writeFile(path.join(source, 'index.js'), 'export const version = 2\n')
    const second = await syncVendor({ 'low-code': source }, { rootDir: workspace })
    assert.notEqual(
        first.packages['@mofang/low-code-page'].manifestSha256,
        second.packages['@mofang/low-code-page'].manifestSha256,
    )
})

test('sync preserves npm-owned nested dependencies while removing generated leftovers', async (t) => {
    const { workspace, source } = await fixture(t)
    const target = path.join(workspace, 'vendor/low-code-page')
    await mkdir(path.join(target, 'node_modules/example'), { recursive: true })
    await writeFile(path.join(target, 'node_modules/example/package.json'), '{"name":"example"}')
    await writeFile(path.join(target, 'obsolete.js'), 'obsolete')
    await syncVendor({ 'low-code': source }, { rootDir: workspace })
    assert.equal(
        await readFile(path.join(target, 'node_modules/example/package.json'), 'utf8'),
        '{"name":"example"}',
    )
    assert.ok(!(await readdir(target)).includes('obsolete.js'))
})

test('sync rejects traversal manifests, absent export targets and junction destinations', async (t) => {
    const { workspace, source, base } = await fixture(t)
    await writeFile(
        path.join(source, 'manifest.json'),
        JSON.stringify({ outputs: [{ path: '../outside', sha256: '0'.repeat(64) }] }),
    )
    await assert.rejects(
        syncVendor({ 'low-code': source }, { rootDir: workspace }),
        /manifest 路径/,
    )
    await rm(path.join(source, 'manifest.json'))
    await writeFile(
        path.join(source, 'package.json'),
        JSON.stringify({
            name: '@mofang/low-code-page',
            version: '1',
            exports: { '.': './missing.js' },
        }),
    )
    await assert.rejects(syncVendor({ 'low-code': source }, { rootDir: workspace }), /包导出不存在/)
    await writeFile(
        path.join(source, 'package.json'),
        JSON.stringify({
            name: '@mofang/low-code-page',
            version: '1',
            exports: { '.': './index.js' },
        }),
    )
    const outside = path.join(base, 'outside')
    await mkdir(outside)
    await symlink(outside, path.join(workspace, 'vendor/low-code-page'), 'junction')
    await assert.rejects(syncVendor({ 'low-code': source }, { rootDir: workspace }), /不能是链接/)
    assert.deepEqual(await readdir(outside), [])
})
