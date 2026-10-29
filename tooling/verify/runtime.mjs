import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { parseArgs } from 'node:util'
import { build, loadConfigFromFile } from 'vite'
import { transform } from 'esbuild'
import { bundle } from '../build/bundle.mjs'
import { cache, prepareCache, root } from '../paths.mjs'
const { values } = parseArgs({ options: { workspace: { type: 'string' } } })
if (!values.workspace) throw new Error('用法：verify:runtime -- --workspace <mofangv6>')
const workspace = path.resolve(values.workspace)
const { JSDOM } = createRequire(path.join(workspace, 'mf-client/package.json'))('jsdom')
const task = cache
await prepareCache()
const panels = []
for (const minify of [true, false]) {
    const result = await bundle(path.join(root, 'tests/fixtures/settings-preview.ts'), 'panel', {
        minify,
    })
    panels.push((await transform(result.code, { format: 'cjs', target: 'es2022' })).code)
}
// 在真实 Vite 配置下比较所有宿主：模板压缩与可读面板必须使用同一浏览器语义。
const reports = []
for (const [name, file] of [
    ['client', 'mf-client/vite.config.ts'],
    ['admin', 'mofang-server/web/admin/vite.config.ts'],
    ['template', path.join(root, 'playground/vite.config.mjs')],
])
    for (const command of ['serve', 'build']) {
        // runner 避免 Vite 在 node_modules 写入临时配置；旧配置仍使用 __dirname。
        globalThis.__dirname = path.dirname(
            path.isAbsolute(file) ? file : path.join(workspace, file),
        )
        const loaded = await loadConfigFromFile(
            { command, mode: command === 'serve' ? 'dev' : 'prod' },
            path.isAbsolute(file) ? file : path.join(workspace, file),
            undefined,
            'silent',
            undefined,
            'runner',
        )
        const entry = workspace + '/mf-client/__runtime_matrix__.js'
        const result = await build({
            root: workspace + '/mf-client',
            configFile: false,
            publicDir: false,
            logLevel: 'silent',
            resolve: {
                ...loaded.config.resolve,
                conditions: [
                    'module',
                    'browser',
                    command === 'serve' ? 'development' : 'production',
                ],
            },
            plugins: [
                {
                    name: 'runtime-fixture',
                    resolveId: (id) => (id === entry ? entry : undefined),
                    load: (id) =>
                        id === entry ? `import * as lit from 'lit';window.hostLit=lit;` : undefined,
                },
            ],
            build: {
                write: false,
                minify: false,
                lib: { entry, formats: ['iife'], name: 'RuntimeFixture' },
            },
        })
        const runtime = (Array.isArray(result) ? result[0] : result).output.find(
            (o) => o.type === 'chunk',
        ).code

        for (const [index, panel] of panels.entries()) {
            const dom = new JSDOM('<main></main>', {
                runScripts: 'outside-only',
                url: 'http://localhost/',
            })
            const errors = []
            dom.window.addEventListener('error', (e) => errors.push(e.message))
            dom.window.eval(runtime)
            const lit = dom.window.hostLit,
                module = { exports: {} }
            assert.equal(lit.isServer, false, name + '/' + command + ' must use browser Lit')
            assert.ok(
                !runtime.includes('ssr-dom-shim'),
                name + '/' + command + ' must not contain SSR shim',
            )
            dom.window.Function(
                'require',
                'module',
                'exports',
                panel,
            )(
                (name) => {
                    assert.equal(name, 'lit')
                    return lit
                },
                module,
                module.exports,
            )
            assert.ok(module.exports.default.prototype instanceof lit.LitElement)
            dom.window.customElements.define('test-panel', class extends module.exports.default {})
            const element = dom.window.document.createElement('test-panel')
            let changed = ''
            element.settings = {
                values: { note: '初始' },
                readOnly: false,
                onFieldChange: (_name, value) => {
                    changed = value
                    element.settings = { ...element.settings, values: { note: value.trim() } }
                },
            }
            dom.window.document.querySelector('main').append(element)
            await element.updateComplete
            const input = element.shadowRoot.querySelector('input')
            assert.equal(input.value, '初始')
            input.value = '更新 '
            input.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
            await element.updateComplete
            assert.equal(changed, '更新 ')
            assert.equal(input.value, '更新')
            element.settings = { ...element.settings, disabledFields: ['note'] }
            await element.updateComplete
            assert.equal(input.disabled, true)
            input.value = '禁止写回'
            input.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
            await element.updateComplete
            assert.equal(changed, '更新 ')
            element.settings = { ...element.settings, disabledFields: [], readOnly: true }
            await element.updateComplete
            assert.equal(input.disabled, true)
            assert.deepEqual(errors, [])
            dom.window.close()
            reports.push({
                host: name,
                command,
                panel: index === 0 ? 'compressed' : 'readable',
                render: true,
                controlledInput: true,
                readOnly: true,
                disabledFields: true,
            })
        }
    }
await writeFile(task + '/matrix-results.json', JSON.stringify(reports, null, 2) + '\n')
console.log(
    `PASS: ${reports.length} host/resolve-condition combinations in JSDOM, browser runtime + render + live controlled input + readOnly + disabledFields`,
)
