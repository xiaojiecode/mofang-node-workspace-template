import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdir, mkdtemp, writeFile, cp, symlink, rm } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { transform } from 'esbuild'
import { root, cache } from '../tooling/paths.mjs'
import { skeletonFiles } from '../tooling/init/skeleton.mjs'

const source = await readFile(
    new URL('../playground/src/panel-routing.ts', import.meta.url),
    'utf8',
)
const compiled = await transform(source, { loader: 'ts', format: 'esm' })
const { panelPreviewUrl } = await import(
    'data:text/javascript;base64,' + Buffer.from(compiled.code).toString('base64')
)

test('四种渲染组合的面板 URL 保留节点、场景、只读和产物模式', () => {
    for (const settings of ['lit', 'puck']) {
        for (const business of ['lit', 'puck']) {
            for (const surface of ['settings', 'business']) {
                const renderer = { settings, business }[surface]
                const url = new URL(
                    panelPreviewUrl(
                        'http://localhost:5188/lowcode.html?node=old&scene=error&readonly=true&artifacts',
                        'mixed-demo',
                        surface,
                        renderer,
                    ),
                )
                assert.equal(url.pathname, renderer === 'lit' ? '/index.html' : '/lowcode.html')
                assert.equal(url.searchParams.get('node'), 'mixed-demo')
                assert.equal(url.searchParams.get('surface'), surface)
                assert.equal(url.searchParams.get('scene'), 'error')
                assert.equal(url.searchParams.get('readonly'), 'true')
                assert.equal(url.searchParams.has('artifacts'), true)
            }
        }
    }
})

test('预览清单 GET 独立于页面 renderer，POST 被拒绝且不创建服务', async (t) => {
    await mkdir(cache, { recursive: true })
    const project = await mkdtemp(path.join(cache, 'routing-'))
    t.after(() => rm(project, { recursive: true, force: true }))
    await cp(path.join(root, 'tooling'), path.join(project, 'tooling'), { recursive: true })
    await symlink(path.join(root, 'node_modules'), path.join(project, 'node_modules'), 'junction')
    const code = 'routing-node'
    for (const [name, content] of Object.entries(skeletonFiles(code))) {
        const file = path.join(project, 'nodes', code, name)
        await mkdir(path.dirname(file), { recursive: true })
        await writeFile(file, content)
    }
    const { lowcodePreviewPlugin } = await import(
        pathToFileURL(path.join(project, 'tooling/lowcode/preview-server.mjs')).href
    )
    let handler
    lowcodePreviewPlugin().configureServer({
        watcher: { add() {}, on() {} },
        ws: { send() {} },
        middlewares: {
            use(route, callback) {
                assert.equal(route, '/__lowcode')
                handler = callback
            },
        },
    })
    const request = async (method, url) => {
        const response = {
            statusCode: 200,
            body: '',
            setHeader() {},
            end(body) {
                this.body = body
            },
        }
        await handler({ method, url }, response)
        return { status: response.statusCode, body: JSON.parse(response.body) }
    }
    const result = await request('GET', `/${code}/manifest`)
    assert.equal(result.status, 200)
    assert.equal(result.body.version, 1)
    assert.ok(['lit', 'puck'].includes(result.body.settings.renderer))
    assert.ok(['lit', 'puck'].includes(result.body.business.renderer))
    const rejected = await request('POST', `/${code}/manifest`)
    assert.equal(rejected.status, 405)
    assert.match(rejected.body.error, /只读/)
})
