import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import path from 'node:path'
import { root, cache, nodeCodes } from '../paths.mjs'
import { mkdir, readFile } from 'node:fs/promises'
const server = await createServer({
    configFile: path.join(root, 'playground/vite.config.mjs'),
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
        await page.locator('#settings input').fill('abc ')
        await page.waitForFunction(
            () =>
                document
                    .querySelector('#settings')
                    .firstElementChild.shadowRoot.querySelector('input').value === 'abc',
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
        await page.locator('#settings input').fill('rejected')
        await page.waitForFunction(
            () =>
                document
                    .querySelector('#settings')
                    .firstElementChild.shadowRoot.querySelector('input').value === 'locked',
        )
        await page.getByRole('button', { name: '有商品', exact: true }).click()
        await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
        await page.locator('#settings input').fill('草稿回写验证')
        await page.waitForFunction(() =>
            document.querySelector('#draft').textContent.includes('草稿回写验证'),
        )
        await page.locator('#readonly').click()
        assert.equal(await page.locator('#settings input').isDisabled(), true)
        await page.locator('#readonly').click()
        assert.equal(await page.locator('#settings input').isDisabled(), false)
        // 共同Mock宿主区域仅渲染真实声明，不为copy等节点猜造finish。
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
        for (const code of await nodeCodes()) {
            await page.getByRole('button', { name: code, exact: true }).click()
            await page.waitForFunction(() =>
                Boolean(document.querySelector('#app').dataset.mounted),
            )
            const fixture = JSON.parse(
                await readFile(path.join(root, 'nodes', code, 'fixtures/input.json'), 'utf8'),
            )
            let title = fixture.item?.basic?.title
            if (!title) {
                const preview = JSON.parse(
                    await readFile(path.join(root, 'nodes', code, 'fixtures/preview.json'), 'utf8'),
                )
                title = preview.composition.projection.nodeView.rows?.[0]?.product?.basic?.title
            }
            assert.ok(title, 'business fixture needs a real visible Product title')
            await page.locator('#business').getByText(title, { exact: true }).first().waitFor()
            await page.getByRole('button', { name: '空结果', exact: true }).click()
            await page.waitForFunction(() =>
                Boolean(document.querySelector('#app').dataset.mounted),
            )
            await page
                .locator('#business')
                .getByText(/暂无商品|没有符合条件/)
                .first()
                .waitFor()
            // 使用节点随附的真实静态预览声明，不通过DOM注入制造可用入口。
            let declaredPreview
            try {
                declaredPreview = JSON.parse(
                    await readFile(path.join(root, 'nodes', code, 'fixtures/preview.json'), 'utf8'),
                )
            } catch (error) {
                if (error.code !== 'ENOENT') throw error
            }
            const declaredFinish = declaredPreview?.composition?.projection?.actions?.find(
                (action) => action.name === 'finish' && action.presentation === 'host',
            )
            if (declaredFinish) {
                const realFinish = page
                    .locator('#host-actions')
                    .getByRole('button', { name: declaredFinish.label, exact: true })
                await realFinish.waitFor()
                await page.waitForFunction(
                    (label) =>
                        ![...document.querySelectorAll('#host-actions button')].find(
                            (button) => button.textContent === label,
                        ).disabled,
                    declaredFinish.label,
                )
                await realFinish.click()
                await page.waitForFunction(() =>
                    document
                        .querySelector('#host-actions')
                        .textContent.includes('finish · applied'),
                )
                assert.equal(
                    await page.evaluate(() => window.preview.current.nodeView.nodeOutput.total),
                    0,
                )
                assert.equal(
                    await page.evaluate(() => window.preview.current.nodeView.productionFinished),
                    true,
                )
            }
            await page.getByRole('button', { name: '读取失败', exact: true }).click()
            await page.waitForFunction(() =>
                Boolean(document.querySelector('#app').dataset.mounted),
            )
            await page.locator('#business [role=alert]').waitFor()
            await page.getByRole('button', { name: '有商品', exact: true }).click()
            await page.waitForFunction(() =>
                Boolean(document.querySelector('#app').dataset.mounted),
            )
            await page.locator('#business').getByText(title, { exact: true }).first().waitFor()
        }
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
    console.log('浏览器：源码及最终产物、两类面板、草稿、只读、空态、错误、SDK 重绑及清理通过。')
} finally {
    await browser?.close()
    await server.close()
}
