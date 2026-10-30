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
            const originalInterval = window.setInterval
            let intervals = 0
            window.setInterval = (...args) => {
                intervals++
                return originalInterval(...args)
            }
            const calls = []
            const flowListeners = new Set()
            const taskCalls = []
            const pageReads = []
            const taskReads = []
            const failedReads = []
            const edits = []
            let releaseReview = () => {}
            let candidateRevision = '3'
            let candidateTotal = 21
            let taskTotal = 21
            let waitReason = 'user_confirmation'
            let taskStatus = 'waiting'
            let waitId = 'wait'
            let failedTotal = 21
            let messageListener = () => {}
            let released = 0
            let messageSubscriptions = 0
            const node = {
                runId: 'run',
                nodeInstanceId: 'node',
                sessionId: 's',
                revision: '4',
                status: 'waiting',
                summary: { pending: 2 },
                permissions: {
                    canAct: true,
                    canEdit: true,
                    canRelease: true,
                    canDiscard: false,
                    canEndReview: true,
                    canControl: true,
                    canResolveUnknown: true,
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
                    subscribe: (_filter, listener) => {
                        messageListener = listener
                        messageSubscriptions++
                        return () => {
                            released++
                        }
                    },
                },
                nodes: {
                    tasks: async (q) => {
                        failedReads.push(q)
                        return { items: [], total: failedTotal, page: q.page, pageSize: 20 }
                    },
                },
                nodeFlow: {
                    watch: () => ({
                        subscribe: (fn) => {
                            flowListeners.add(fn)
                            return () => {
                                flowListeners.delete(fn)
                                released++
                            }
                        },
                        getSnapshot: () => state,
                    }),
                    listCandidates: async (q) => {
                        pageReads.push(q)
                        return {
                            items: [
                                {
                                    id: 'c',
                                    revision: candidateRevision,
                                    state: 'pending',
                                    value: { items: [] },
                                },
                                { id: 'd', revision: '5', state: 'pending', value: { items: [] } },
                            ],
                            total: candidateTotal,
                            page: q.page,
                            pageSize: 20,
                        }
                    },
                    tasks: async (q) => {
                        taskReads.push(q)
                        return {
                            items: [
                                {
                                    id: 'task',
                                    revision: '7',
                                    sessionId: 's',
                                    handler: '人工确认',
                                    status: taskStatus,
                                    inputRefs: [],
                                    waiting: {
                                        turn: 1,
                                        reason: waitReason,
                                        waitingToolCallId: waitId,
                                        prompt: '请回答',
                                    },
                                },
                            ],
                            total: taskTotal,
                            page: q.page,
                            pageSize: 20,
                        }
                    },
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
                    editCandidate: async (body) => {
                        edits.push(body)
                        candidateRevision = '4'
                        throw Object.assign(Error('修订冲突'), { kind: 'conflict' })
                    },
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
                        await new Promise((resolve) => {
                            releaseReview = resolve
                        })
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
            window.testRuntime = {
                app,
                calls,
                intervals: () => intervals,
                setWait: (reason, status, nodeStatus, id = 'wait') => {
                    waitReason = reason
                    taskStatus = status
                    waitId = id
                    node.status = nodeStatus
                    for (const fn of flowListeners) fn()
                    messageListener()
                },
                releaseReview: () => releaseReview(),
                changeRevision: (revision) => {
                    node.revision = revision
                    for (const fn of flowListeners) fn()
                },
                shrink: () => {
                    candidateTotal = 1
                    taskTotal = 1
                    failedTotal = 1
                    messageListener()
                },
                taskCalls,
                edits,
                pageReads,
                taskReads,
                failedReads,
                subscriptions: () => messageSubscriptions,
                released: () => released,
            }
            await app.updateComplete
        })
        const panel = page.locator('test-app').locator('section[aria-label="节点执行与审核"]')
        await panel.getByText('c pending').waitFor()
        assert.equal(await panel.getByRole('button', { name: '丢弃所选' }).isDisabled(), true)
        await panel.getByRole('checkbox', { name: 'c pending' }).check()
        await panel.getByRole('button', { name: '编辑候选' }).first().click()
        await panel.getByLabel('候选内容').fill('{"items":[{"title":"编辑值"}]}')
        assert.equal(await panel.getByRole('button', { name: '放行所选' }).isDisabled(), true)
        await panel.getByRole('button', { name: '保存候选' }).click()
        await panel.getByText(/修订冲突/).waitFor()
        assert.equal(await page.evaluate(() => window.testRuntime.edits[0].expectedRevision), '3')
        assert.match(await panel.getByLabel('候选内容').inputValue(), /编辑值/)
        await panel.getByRole('button', { name: '重载候选' }).click()
        await page.waitForFunction(() => window.testRuntime.pageReads.length >= 2)
        await panel.getByRole('button', { name: '取消编辑' }).click()
        await panel.getByRole('checkbox', { name: 'c pending' }).check()
        await panel.getByRole('checkbox', { name: 'd pending' }).check()
        await panel.getByRole('button', { name: '放行所选' }).click()
        await page.waitForFunction(() => window.testRuntime.calls.length === 1)
        assert.deepEqual(await page.evaluate(() => window.testRuntime.calls[0].candidates), [
            { id: 'c', expectedRevision: '4' },
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
        await panel.getByRole('button', { name: '结束审核', exact: true }).click()
        const confirm = panel.getByRole('dialog', { name: '结束审核' })
        await confirm.waitFor()
        assert.match(await confirm.locator('p').first().textContent(), /剩余\s*2\s*个待流转候选/)
        assert.equal(
            await confirm.evaluate((el) => el.contains(el.getRootNode().activeElement)),
            true,
        )
        await page.keyboard.press('Escape')
        await confirm.waitFor({ state: 'hidden' })
        assert.equal(await page.evaluate(() => window.testRuntime.calls.length), 2)
        await panel.getByRole('button', { name: '结束审核', exact: true }).click()
        await confirm.waitFor()
        await page.evaluate(() => window.testRuntime.changeRevision('5'))
        await confirm.getByText('节点内容已更新').waitFor()
        assert.equal(
            await confirm.getByRole('button', { name: '丢弃剩余候选并结束审核' }).isDisabled(),
            true,
        )
        assert.equal(await page.evaluate(() => window.testRuntime.calls.length), 2)
        await confirm.getByRole('button', { name: '取消', exact: true }).click()
        await panel.getByRole('button', { name: '结束审核', exact: true }).click()
        await confirm.getByRole('button', { name: '丢弃剩余候选并结束审核' }).click()
        await page.waitForFunction(() => window.testRuntime.calls.length === 3)
        assert.equal(await page.evaluate(() => window.testRuntime.calls[2].expectedRevision), '5')
        await page.keyboard.press('Escape')
        assert.equal(await confirm.isVisible(), true)
        await page.evaluate(() => window.testRuntime.releaseReview())
        await confirm.waitFor({ state: 'hidden' })
        await panel.getByLabel('任务回答').fill('确认')
        await panel.getByRole('button', { name: '提交回答' }).click()
        await page.waitForFunction(() => window.testRuntime.taskCalls.length === 1)
        await panel.getByText(/操作 .*：applied/).waitFor()
        assert.equal(
            await page.evaluate(() => window.testRuntime.taskCalls[0].waitingToolCallId),
            'wait',
        )
        await panel.getByRole('checkbox', { name: '按 JSON 提交' }).check()
        await panel.getByLabel('任务回答').fill('{bad')
        await panel.getByRole('button', { name: '提交回答' }).click()
        await panel.getByText('回复不是有效 JSON，请修正后提交。').waitFor()
        assert.equal(await page.evaluate(() => window.testRuntime.taskCalls.length), 1)
        await panel.getByLabel('任务回答').fill('{"approved":true}')
        await panel.getByRole('button', { name: '提交回答' }).click()
        await page.waitForFunction(() => window.testRuntime.taskCalls.length === 2)
        assert.deepEqual(await page.evaluate(() => window.testRuntime.taskCalls[1].answer), {
            approved: true,
        })
        await page.evaluate(() =>
            window.testRuntime.setWait('user_requested', 'waiting', 'waiting'),
        )
        await panel.getByText('此执行有独立暂停，需通过原暂停入口恢复。').waitFor()
        assert.equal(await panel.getByRole('button', { name: '继续任务' }).count(), 0)
        assert.equal(await panel.getByRole('button', { name: '提交回答' }).count(), 0)
        await page.evaluate(() =>
            window.testRuntime.setWait('insufficient_balance', 'waiting', 'waiting'),
        )
        await panel.getByRole('button', { name: '继续任务' }).waitFor()
        assert.equal(await panel.getByRole('button', { name: '提交回答' }).count(), 0)
        await page.evaluate(() =>
            window.testRuntime.setWait('user_confirmation', 'waiting', 'waiting', ''),
        )
        await panel.getByRole('button', { name: '继续任务' }).waitFor({ state: 'detached' })
        assert.equal(await panel.getByRole('button', { name: '提交回答' }).count(), 0)
        await page.evaluate(() =>
            window.testRuntime.setWait('user_confirmation', 'unknown', 'cancelled'),
        )
        await panel.getByLabel('核对证据').waitFor()
        assert.equal(await panel.getByRole('button', { name: '提交回答' }).count(), 0)
        assert.equal(await panel.getByRole('button', { name: '继续任务' }).count(), 0)
        assert.equal(await panel.getByRole('button', { name: '暂停节点' }).count(), 0)
        assert.equal(await panel.getByRole('button', { name: '提交核对结论' }).isDisabled(), true)
        await panel.getByRole('radio', { name: '已成功' }).check()
        await panel.getByLabel('核对证据').fill('已核对原操作')
        assert.equal(await panel.getByRole('button', { name: '提交核对结论' }).isDisabled(), false)
        await page.evaluate(() =>
            window.testRuntime.setWait('user_confirmation', 'waiting', 'waiting'),
        )
        await panel.getByRole('button', { name: '候选下一页' }).click()
        await page.waitForFunction(() => window.testRuntime.pageReads.some((q) => q.page === 2))
        await panel.getByRole('button', { name: '任务下一页', exact: true }).click()
        await panel.getByRole('button', { name: '失败任务下一页', exact: true }).click()
        await page.waitForFunction(
            () =>
                window.testRuntime.taskReads.some((q) => q.page === 2) &&
                window.testRuntime.failedReads.some((q) => q.page === 2),
        )
        const taskBefore = await page.evaluate(() => window.testRuntime.taskReads.length)
        const failedBefore = await page.evaluate(() => window.testRuntime.failedReads.length)
        const beforeShrink = await page.evaluate(() => window.testRuntime.pageReads.length)
        await page.evaluate(() => window.testRuntime.shrink())
        await page.waitForFunction(
            (n) => window.testRuntime.pageReads.slice(n).some((q) => q.page === 1),
            beforeShrink,
        )
        await page.waitForFunction(
            (n) => window.testRuntime.taskReads.slice(n).some((q) => q.page === 1),
            taskBefore,
        )
        await page.waitForFunction(
            (n) => window.testRuntime.failedReads.slice(n).some((q) => q.page === 1),
            failedBefore,
        )
        await page.evaluate(async () => {
            window.testRuntime.app.target = {
                runId: 'run',
                nodeInstanceId: 'node',
                view: 'history',
            }
            await window.testRuntime.app.updateComplete
        })
        await page.waitForFunction(() => window.testRuntime.released() >= 1)
        assert.equal(await page.evaluate(() => window.testRuntime.subscriptions()), 1)
        assert.equal(await page.evaluate(() => window.testRuntime.intervals()), 1)
        await page.waitForFunction(() =>
            window.testRuntime.pageReads.some((q) => q.view === 'history' && q.page === 1),
        )
        await panel.getByText('c pending').waitFor()
        assert.equal(await panel.getByRole('button', { name: '完成生产' }).isDisabled(), true)
        assert.equal(
            await panel.getByRole('button', { name: '结束审核', exact: true }).isDisabled(),
            true,
        )
        assert.equal(await page.evaluate(() => window.testRuntime.calls.length), 3)
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
            const factory = async () => ({})
            const node = {
                runId: 'r',
                nodeInstanceId: 'n',
                sessionId: 's',
                revision: '1',
                status: 'waiting',
                summary: { pending: 0 },
                permissions: {
                    canAct: false,
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
                    tasks: async () => ({ items: [], total: 0, page: 1, pageSize: 20 }),
                    listActions: async () => ({
                        items: [],
                        snapshotUpperSequence: '0',
                        hasMore: false,
                    }),
                },
            }
            Object.assign(element, {
                sdk,
                target: { runId: 'r', nodeInstanceId: 'n', view: 'current' },
                createRecordSdk: factory,
                panelContext: { createRecordSdk: factory },
            })
            document.body.append(element)
            await element.updateComplete
            const count = element.shadowRoot.querySelectorAll('*').length
            const preserved =
                element.createRecordSdk === factory &&
                element.panelContext.createRecordSdk === factory
            return { count, preserved }
        }, source)
        assert.ok(mounted.count > 0)
        assert.equal(mounted.preserved, true)
        await page.locator('official-test').getByText('节点状态：waiting').waitFor()
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
                    canControl: true,
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
                                    reason: 'user_confirmation',
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
        await panel.getByLabel('任务回答').fill('确认')
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
