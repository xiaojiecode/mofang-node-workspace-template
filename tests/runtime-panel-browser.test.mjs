import assert from 'node:assert/strict'
import test from 'node:test'
import { build } from 'esbuild'
import { chromium } from 'playwright'

for (const minify of [false, true])
    test(`运行面板真实 SDK 接口、权限与解绑（压缩=${minify}）`, async (t) => {
        const js = await build({
            stdin: {
                contents: `import {LitElement,html} from 'lit'; import {nodeRuntimePanel} from './lib/browser/runtime-panel'; class App extends LitElement { static properties={sdk:{attribute:false},target:{attribute:false}}; render(){return html\`${'${nodeRuntimePanel({sdk:this.sdk,target:this.target})}'}\`} } customElements.define('test-app',App)`,
                resolveDir: process.cwd(),
                loader: 'ts',
            },
            bundle: true,
            write: false,
            format: 'iife',
            platform: 'browser',
            minify,
            loader: { '.svg': 'text' },
            tsconfig: 'tsconfig.base.json',
        })
        const browser = await chromium.launch({
            headless: true,
            ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
        })
        t.after(() => browser.close())
        const page = await browser.newPage()
        await page.route('http://127.0.0.1:39193/', (route) =>
            route.fulfill({ contentType: 'text/html', body: '<html></html>' }),
        )
        await page.goto('http://127.0.0.1:39193/')
        await page.addScriptTag({ content: js.outputFiles[0].text })
        await page.evaluate(async () => {
            const calls = []
            const taskCalls = []
            const pageReads = []
            let released = 0
            const node = {
                runId: 'run',
                nodeInstanceId: 'node',
                sessionId: 's',
                revision: '4',
                status: 'waiting',
                permissions: {
                    canAct: true,
                    canRelease: true,
                    canDiscard: false,
                    canEndReview: true,
                    canControl: false,
                    canResolveUnknown: false,
                },
                composition: {
                    projection: {
                        status: 'ready',
                        nodeView: {},
                        actions: [
                            {
                                name: 'finish',
                                label: '完成生产',
                                presentation: 'host',
                                availability: { enabled: true },
                            },
                        ],
                    },
                },
            }
            const state = { data: node, refreshing: false, stale: false }
            const sdk = {
                context: { subscribe: () => () => {}, getState: () => ({}) },
                messages: {
                    subscribe: () => () => {
                        released++
                    },
                },
                nodes: { tasks: async () => ({ items: [], total: 0, page: 1, pageSize: 20 }) },
                nodeFlow: {
                    watch: () => ({
                        subscribe: () => () => {
                            released++
                        },
                        getSnapshot: () => state,
                    }),
                    listCandidates: async (q) => {
                        pageReads.push(q)
                        return {
                            items: [
                                { id: 'c', revision: '3', state: 'pending', value: { items: [] } },
                                { id: 'd', revision: '5', state: 'pending', value: { items: [] } },
                            ],
                            total: 21,
                            page: q.page,
                            pageSize: 20,
                        }
                    },
                    tasks: async () => ({
                        items: [
                            {
                                id: 'task',
                                revision: '7',
                                sessionId: 's',
                                handler: '人工确认',
                                status: 'waiting',
                                inputRefs: [],
                                waiting: {
                                    turn: 1,
                                    reason: 'question',
                                    waitingToolCallId: 'wait',
                                    prompt: '请回答',
                                },
                            },
                        ],
                        total: 1,
                        page: 1,
                        pageSize: 20,
                    }),
                    listTaskOperations: async () => ({
                        items: [],
                        snapshotUpperSequence: '0',
                        nextAfterSequence: '',
                    }),
                    replyTask: async (body) => {
                        taskCalls.push(body)
                        return {
                            status: 'accepted',
                            taskId: body.taskId,
                            operationId: body.operationId,
                        }
                    },
                    getTaskOperation: async (q) => ({
                        operationId: q.operationId,
                        taskId: q.taskId,
                        sequence: '1',
                        revision: '1',
                        kind: 'reply',
                        status: 'applied',
                        createdAt: '',
                    }),
                    listActions: async () => ({
                        items: [],
                        snapshotUpperSequence: '0',
                        hasMore: false,
                    }),
                    release: async (body) => {
                        calls.push(body)
                        return {
                            items: [
                                { id: 'c', status: 'applied' },
                                { id: 'd', status: 'rejected', error: { message: '修订冲突' } },
                            ],
                        }
                    },
                    discard: async () => {
                        throw Error('无权')
                    },
                    endReview: async (body) => {
                        calls.push(body)
                    },
                    action: async (body) => {
                        calls.push(body)
                        return { eventId: 'event', sequence: '1', status: 'accepted' }
                    },
                    watchActionResult: () => ({
                        subscribe: () => () => {
                            released++
                        },
                        getSnapshot: () => ({
                            data: {
                                eventId: 'event',
                                sequence: '1',
                                name: 'finish',
                                status: 'applied',
                            },
                        }),
                    }),
                },
            }
            const app = document.createElement('test-app')
            app.sdk = sdk
            app.target = { runId: 'run', nodeInstanceId: 'node', view: 'current' }
            document.body.append(app)
            window.testRuntime = { app, calls, taskCalls, pageReads, released: () => released }
            await app.updateComplete
        })
        const panel = page.locator('test-app').locator('section[aria-label="节点执行与审核"]')
        await panel.getByText('c pending').waitFor()
        assert.equal(await panel.getByRole('button', { name: '丢弃所选' }).isDisabled(), true)
        await panel.getByRole('checkbox', { name: 'c pending' }).check()
        await panel.getByRole('checkbox', { name: 'd pending' }).check()
        await panel.getByRole('button', { name: '放行所选' }).click()
        await page.waitForFunction(() => window.testRuntime.calls.length === 1)
        assert.deepEqual(await page.evaluate(() => window.testRuntime.calls[0].candidates), [
            { id: 'c', expectedRevision: '3' },
            { id: 'd', expectedRevision: '5' },
        ])
        await panel.getByText(/修订冲突/).waitFor()
        assert.equal(await panel.getByRole('checkbox', { name: 'c pending' }).isChecked(), false)
        assert.equal(await panel.getByRole('checkbox', { name: 'd pending' }).isChecked(), true)
        await panel.getByRole('button', { name: '完成生产' }).click()
        await page.waitForFunction(() => window.testRuntime.calls.length === 2)
        assert.equal(
            await page.evaluate(() => window.testRuntime.calls[1].expectedSessionRevision),
            '4',
        )
        await panel.getByLabel('任务回答').fill('确认')
        await panel.getByRole('button', { name: '提交回答' }).click()
        await page.waitForFunction(() => window.testRuntime.taskCalls.length === 1)
        await panel.getByText(/操作 .*：applied/).waitFor()
        assert.equal(
            await page.evaluate(() => window.testRuntime.taskCalls[0].waitingToolCallId),
            'wait',
        )
        await panel.getByRole('button', { name: '候选下一页' }).click()
        await page.waitForFunction(() => window.testRuntime.pageReads.some((q) => q.page === 2))
        await page.evaluate(async () => {
            window.testRuntime.app.target = {
                runId: 'run',
                nodeInstanceId: 'node',
                view: 'history',
            }
            await window.testRuntime.app.updateComplete
        })
        await page.waitForFunction(() => window.testRuntime.released() >= 1)
        await page.waitForFunction(() =>
            window.testRuntime.pageReads.some((q) => q.view === 'history' && q.page === 1),
        )
        await panel.getByText('c pending').waitFor()
        assert.equal(await panel.getByRole('button', { name: '完成生产' }).isDisabled(), true)
        assert.equal(await panel.getByRole('checkbox', { name: 'c pending' }).isDisabled(), true)
        await page.evaluate(() => window.testRuntime.app.remove())
        assert.ok((await page.evaluate(() => window.testRuntime.released())) >= 2)
    })

test('不同冻结模块不会复用彼此自定义元素类', async (t) => {
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    t.after(() => browser.close())
    const page = await browser.newPage()
    for (const name of ['one', 'two']) {
        const js = await build({
            stdin: {
                contents: `import {LitElement,html} from 'lit';import {nodeRuntimePanel} from './lib/browser/runtime-panel';class App extends LitElement{render(){return html\`${'${nodeRuntimePanel({sdk:undefined,target:undefined})}'}\`}}customElements.define('frozen-${name}',App)`,
                resolveDir: process.cwd(),
                loader: 'ts',
            },
            bundle: true,
            write: false,
            format: 'iife',
            platform: 'browser',
            minify: true,
            loader: { '.svg': 'text' },
            tsconfig: 'tsconfig.base.json',
        })
        await page.addScriptTag({ content: js.outputFiles[0].text })
        await page.evaluate(async (name) => {
            const el = document.createElement('frozen-' + name)
            document.body.append(el)
            await el.updateComplete
        }, name)
    }
    const tags = await page.evaluate(() =>
        ['one', 'two'].map(
            (name) =>
                document.querySelector('frozen-' + name).shadowRoot.firstElementChild.localName,
        ),
    )
    assert.notEqual(tags[0], tags[1])
})

test('正式面板打包产物使用宿主 Lit 并可挂载', async (t) => {
    const { bundle } = await import('../tooling/build/bundle.mjs')
    const litBundle = await build({
        stdin: { contents: "export * from 'lit'", resolveDir: process.cwd() },
        bundle: true,
        write: false,
        format: 'esm',
        platform: 'browser',
        minify: true,
    })
    const lit =
        'data:text/javascript;base64,' +
        Buffer.from(litBundle.outputFiles[0].text).toString('base64')
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    t.after(() => browser.close())
    for (const minify of [false, true]) {
        const result = await bundle('tests/fixtures/runtime-panel-entry.ts', 'panel', { minify })
        const page = await browser.newPage()
        await page.setContent(
            `<script type="importmap">${JSON.stringify({ imports: { lit } })}</script>`,
        )
        const source = 'data:text/javascript;base64,' + Buffer.from(result.code).toString('base64')
        const mounted = await page.evaluate(async (url) => {
            const { default: Panel } = await import(url)
            customElements.define('official-test', Panel)
            const element = document.createElement('official-test')
            document.body.append(element)
            await element.updateComplete
            const count = element.shadowRoot.querySelectorAll('*').length
            element.remove()
            return count
        }, source)
        assert.ok(mounted > 0)
        await page.close()
    }
})

for (const minify of [false, true])
    test(`断线卸载后只查询原任务操作（压缩=${minify}）`, async (t) => {
        const js = await build({
            stdin: {
                contents: `import {LitElement,html} from 'lit';import {nodeRuntimePanel} from './lib/browser/runtime-panel';class App extends LitElement{static properties={sdk:{attribute:false},target:{attribute:false}};render(){return html\`${'${nodeRuntimePanel({sdk:this.sdk,target:this.target})}'}\`}}customElements.define('retry-app',App)`,
                resolveDir: process.cwd(),
                loader: 'ts',
            },
            bundle: true,
            write: false,
            format: 'iife',
            platform: 'browser',
            minify,
            loader: { '.svg': 'text' },
            tsconfig: 'tsconfig.base.json',
        })
        const browser = await chromium.launch({
            headless: true,
            ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
        })
        t.after(() => browser.close())
        const page = await browser.newPage()
        await page.route('http://127.0.0.1:39193/', (route) =>
            route.fulfill({ contentType: 'text/html', body: '<html></html>' }),
        )
        await page.goto('http://127.0.0.1:39193/')
        await page.addScriptTag({ content: js.outputFiles[0].text })
        await page.evaluate(async () => {
            let writes = 0
            const reads = []
            const node = {
                runId: 'r',
                nodeInstanceId: 'n',
                sessionId: 's',
                revision: '1',
                status: 'waiting',
                permissions: {
                    canAct: true,
                    canRelease: false,
                    canDiscard: false,
                    canEndReview: false,
                    canControl: false,
                    canResolveUnknown: false,
                },
                composition: { projection: { status: 'ready', nodeView: {}, actions: [] } },
            }
            const sdk = {
                context: { subscribe: () => () => {}, getState: () => ({}) },
                messages: { subscribe: () => () => {} },
                nodes: { tasks: async () => ({ items: [], total: 0, page: 1, pageSize: 20 }) },
                nodeFlow: {
                    watch: () => ({
                        subscribe: () => () => {},
                        getSnapshot: () => ({ data: node, refreshing: false, stale: false }),
                    }),
                    listCandidates: async () => ({ items: [], total: 0, page: 1, pageSize: 20 }),
                    tasks: async () => ({
                        items: [
                            {
                                id: 't',
                                revision: '1',
                                sessionId: 's',
                                handler: '问答',
                                status: 'waiting',
                                inputRefs: [],
                                waiting: {
                                    turn: 1,
                                    reason: 'question',
                                    waitingToolCallId: 'w',
                                    prompt: '回答',
                                },
                            },
                        ],
                        total: 1,
                        page: 1,
                        pageSize: 20,
                    }),
                    listActions: async () => ({
                        items: [],
                        snapshotUpperSequence: '0',
                        hasMore: false,
                    }),
                    listTaskOperations: async () => ({
                        items: [],
                        snapshotUpperSequence: '0',
                        nextAfterSequence: '',
                    }),
                    replyTask: async () => {
                        writes++
                        throw Error('断线')
                    },
                    getTaskOperation: async (q) => {
                        reads.push(q.operationId)
                        return {
                            taskId: 't',
                            operationId: q.operationId,
                            sequence: '1',
                            revision: '1',
                            kind: 'reply',
                            status: 'applied',
                            createdAt: '',
                        }
                    },
                },
            }
            const mount = () => {
                const app = document.createElement('retry-app')
                app.sdk = sdk
                app.target = { runId: 'r', nodeInstanceId: 'n', view: 'current' }
                document.body.append(app)
                return app
            }
            window.fixture = { mount, sdk, reads, writes: () => writes, app: mount() }
        })
        let panel = page.locator('retry-app section[aria-label="节点执行与审核"]')
        await panel.getByRole('button', { name: '提交回答' }).click()
        await page.waitForFunction(() => window.fixture.writes() === 1)
        const original = await page.evaluate(() =>
            sessionStorage.getItem('workflow-task-operation:r:n:t'),
        )
        assert.ok(original)
        await page.evaluate(() => {
            window.fixture.app.remove()
            window.fixture.app = window.fixture.mount()
        })
        await page.waitForFunction((id) => window.fixture.reads.includes(id), original)
        await page.waitForFunction(
            () => sessionStorage.getItem('workflow-task-operation:r:n:t') === null,
        )
        assert.equal(await page.evaluate(() => window.fixture.writes()), 1)
    })
