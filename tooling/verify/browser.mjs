import os from 'node:os'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import path from 'node:path'
import { root, cache, nodeCodes } from '../paths.mjs'
import { mkdir, mkdtemp, cp, symlink } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { readNodePanels } from '../panels/manifest.mjs'
// 在隔离冷工程中验证骨架和宿主草稿，不向作者的 nodes/ 写入测试节点。
await mkdir(cache, { recursive: true })
const projectBase = cache === root || cache.startsWith(root + path.sep) ? os.tmpdir() : cache
const area = await mkdtemp(path.join(projectBase, 'browser-'))
const project = path.join(area, 'project')
function run(script, args = [], cwd = root) {
    const result = spawnSync(process.execPath, [path.join(cwd, script), ...args], {
        cwd,
        encoding: 'utf8',
        env: process.env,
    })
    if (result.error) throw result.error
    assert.equal(result.status, 0, result.stdout + result.stderr)
}
run('tooling/init/project.mjs', ['--dir', project, '--name', 'browser-fixture'])
await symlink(path.join(root, 'node_modules'), path.join(project, 'node_modules'), 'junction')
run('tooling/init/node.mjs', ['--code', 'blank-node'], project)
// 草稿输入只属于测试夹具，骨架设置面板保持无业务字段。
await cp(
    path.join(root, 'tests/fixtures/settings-preview.ts'),
    path.join(project, 'nodes/blank-node/settings.ts'),
)
run(
    'tooling/build/index.mjs',
    process.argv.includes('--development') ? ['--development'] : [],
    project,
)
const server = await createServer({
    configFile: path.join(project, 'playground/vite.config.mjs'),
    server: { port: 0, strictPort: false },
})
let browser
try {
    await server.listen()
    browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } }),
        errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    const url = server.resolvedUrls.local[0]
    for (const mode of ['', '?artifacts']) {
        await page.goto(url + mode)
        await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
        // 设置与业务面板共用底部抽屉，同一时间只显示一个。
        await page.locator('#open-settings').click()
        await page.locator('#settings input[name=note]').waitFor()
        await page.evaluate(() => {
            const element = window.preview.elements.find((e) => e.surface === 'settings')
            const editor = element.settings
            element.settings = {
                ...editor,
                values: { note: 'abc' },
                onFieldChange: (_name, value) => {
                    element.settings = {
                        ...element.settings,
                        values: { note: String(value).trim() },
                    }
                },
            }
        })
        await page.locator('#settings input[name=note]').fill('abc ')
        await page.waitForFunction(
            () =>
                document
                    .querySelector('#settings')
                    .firstElementChild.shadowRoot.querySelector('input[name=note]').value === 'abc',
        )
        await page.evaluate(() => {
            const element = window.preview.elements.find((e) => e.surface === 'settings')
            element.settings = {
                ...element.settings,
                values: { note: 'locked' },
                onFieldChange: () => {
                    element.settings = { ...element.settings, values: { note: 'locked' } }
                },
            }
        })
        await page.locator('#settings input[name=note]').fill('rejected')
        await page.waitForFunction(
            () =>
                document
                    .querySelector('#settings')
                    .firstElementChild.shadowRoot.querySelector('input[name=note]').value ===
                'locked',
        )
        await page.getByRole('button', { name: '有商品', exact: true }).click()
        await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
        await page.locator('#settings input[name=note]').fill('草稿回写验证')
        await page.waitForFunction(() =>
            document.querySelector('#draft').textContent.includes('草稿回写验证'),
        )
        await page.locator('#readonly').click()
        assert.equal(await page.locator('#settings input[name=note]').isDisabled(), true)
        await page.locator('#readonly').click()
        assert.equal(await page.locator('#settings input[name=note]').isDisabled(), false)
        await page.locator('#open-business').click()
        // 共同 Mock 宿主区域仅渲染真实声明，不为骨架猜造 finish。
        assert.equal(await page.locator('#host-actions button').count(), 0)
        await page.getByRole('button', { name: '空结果', exact: true }).click()
        await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
        const installHostFixture = async (enabled = true, unavailable = false) =>
            page.evaluate(
                ({ enabled, unavailable }) => {
                    const fixture = window.preview.current,
                        view = fixture.nodeView
                    view.permissions.canAct = true
                    view.productionFinished = false
                    view.composition.projection = unavailable
                        ? { status: 'unavailable', code: 'MOCK_PROJECT', message: 'Mock投影失败' }
                        : {
                              status: 'ready',
                              nodeView: { phase: 'ready', rows: [], total: 0 },
                              actions: [
                                  {
                                      name: 'finish',
                                      label: 'Mock不提交商品结束',
                                      description: 'Mock无参数必要事件',
                                      presentation: 'host',
                                      payloadSchema: {
                                          $ref: '#/$defs/empty',
                                          $defs: {
                                              empty: {
                                                  type: 'object',
                                                  properties: {},
                                                  additionalProperties: false,
                                              },
                                          },
                                      },
                                      payloadSchemaDigest: 'fixture',
                                      availability: enabled
                                          ? { enabled: true }
                                          : { enabled: false, reason: 'Mock等待搜索结清' },
                                  },
                              ],
                          }
                    fixture.notify()
                },
                { enabled, unavailable },
            )
        await installHostFixture()
        const finish = page
            .locator('#host-actions')
            .getByRole('button', { name: 'Mock不提交商品结束' })
        await finish.waitFor()
        await page.waitForFunction(
            () =>
                ![...document.querySelectorAll('#host-actions button')].find(
                    (button) => button.textContent === 'Mock不提交商品结束',
                ).disabled,
        )
        await page.locator('#readonly').click()
        assert.equal(await finish.isDisabled(), true)
        await page.locator('#readonly').click()
        await page.waitForFunction(
            () =>
                ![...document.querySelectorAll('#host-actions button')].find(
                    (button) => button.textContent === 'Mock不提交商品结束',
                ).disabled,
        )
        await finish.click()
        await page.waitForFunction(() =>
            document.querySelector('#host-actions').textContent.includes('finish · applied'),
        )
        assert.equal(
            await page.evaluate(
                () => window.preview.current.nodeView.composition.projection.nodeView.phase,
            ),
            'closed',
        )
        assert.equal(await page.evaluate(() => window.preview.current.nodeView.nodeOutput.total), 0)
        assert.equal(await finish.isDisabled(), true)
        await page.getByRole('button', { name: '空结果', exact: true }).click()
        await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
        await installHostFixture(false)
        assert.equal(await finish.isDisabled(), true)
        assert.ok((await page.locator('#host-actions').textContent()).includes('Mock等待搜索结清'))
        await installHostFixture(true, true)
        assert.equal(await page.locator('#host-actions button').count(), 0)
        assert.ok((await page.locator('#host-actions').textContent()).includes('Mock投影失败'))
        await page.getByRole('button', { name: '有商品', exact: true }).click()
        await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
        await page.getByRole('button', { name: 'blank-node', exact: true }).click()
        await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
        await page.locator('#business').getByText('已接通宿主投影。', { exact: true }).waitFor()
        await page.getByRole('button', { name: '空结果', exact: true }).click()
        await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
        await page.locator('#business').getByText('已接通宿主投影。', { exact: true }).waitFor()
        assert.equal(await page.locator('#host-actions button').count(), 0)
        await page.getByRole('button', { name: '读取失败', exact: true }).click()
        await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
        await page.locator('#business [role=alert]').waitFor()
        await page.getByRole('button', { name: '有商品', exact: true }).click()
        await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
        await page.locator('#business').getByText('已接通宿主投影。', { exact: true }).waitFor()
        await page.locator('#replace').click()
        await page.waitForFunction(() =>
            window.preview.previous.every((f) => f.listeners.size === 0),
        )
        if (mode) {
            await mkdir(cache, { recursive: true })
            await page.screenshot({ path: path.join(cache, 'playground.png'), fullPage: true })
        }
        await page.evaluate(() => window.preview.unmount())
        assert.equal(await page.evaluate(() => window.preview.current.listeners.size), 0)
    }
    assert.deepEqual(errors, [])
    await server.close()
    await verifyCurrentProject(browser)
    console.log('浏览器：源码及最终产物、两类面板、草稿、只读、空态、错误、SDK 重绑及清理通过。')
} finally {
    await browser?.close()
    await server.close()
}

/** 检查作者当前工程的实际源码和最终产物，不以骨架回归代替业务面板挂载。 */
async function verifyCurrentProject(browser) {
    const currentServer = await createServer({
        configFile: path.join(root, 'playground/vite.config.mjs'),
        server: { port: 0, strictPort: false },
    })
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    try {
        await currentServer.listen()
        const url = currentServer.resolvedUrls.local[0]
        const codes = await nodeCodes()
        if (codes.length === 0) {
            const requests = []
            page.on('request', (request) => {
                if (request.url().includes('/__lowcode/')) requests.push(request.url())
            })
            for (const mode of ['', '?artifacts']) {
                await page.goto(url + mode)
                await page.getByRole('heading', { name: '当前工程没有节点' }).waitFor()
                assert.equal(
                    await page.locator('.preview-empty code').textContent(),
                    'npm run node:new -- --code my-node',
                )
                assert.equal(await page.locator('#app').getAttribute('data-mounted'), 'empty')
                assert.equal(await page.locator('#open-business').count(), 0)
            }
            assert.deepEqual(requests, [])
            await page.screenshot({ path: path.join(cache, 'empty-project.png'), fullPage: true })
        }
        for (const code of codes) {
            const panels = await readNodePanels(code)
            for (const artifacts of [false, true]) {
                for (const surface of ['settings', 'business']) {
                    const renderer = panels[surface].renderer
                    const target = new URL(renderer === 'puck' ? 'lowcode.html' : 'index.html', url)
                    target.searchParams.set('node', code)
                    target.searchParams.set('surface', surface)
                    if (artifacts) target.searchParams.set('artifacts', '')
                    await page.goto(target.href)
                    if (renderer === 'puck') {
                        await page.locator('[data-revision]').waitFor()
                        assert.equal(
                            await page.locator('.lowcode-panel [role=alert]').count(),
                            0,
                            code + '/' + surface + ': 低代码面板渲染失败',
                        )
                    } else {
                        await page.waitForFunction(() =>
                            Boolean(document.querySelector('#app').dataset.mounted),
                        )
                        assert.equal(
                            await page.locator('#' + surface + ' > *').count(),
                            1,
                            code + '/' + surface + ': 面板未挂载',
                        )
                    }
                }
            }
            console.log(code + ': 当前工程源码及最终产物的双面板挂载通过')
        }
        assert.deepEqual(errors, [])
    } finally {
        await page.close()
        await currentServer.close()
    }
}
