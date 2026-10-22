import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import path from 'node:path'
import { root, cache, nodeCodes } from '../paths.mjs'
import { mkdir } from 'node:fs/promises'
const server = await createServer({
  configFile: path.join(root, 'apps/playground/vite.config.mjs'),
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
          element.settings = { ...element.settings, values: { note: String(value).trim() } }
        },
      }
    })
    await page.locator('#settings input').fill('abc ')
    await page.waitForFunction(
      () =>
        document.querySelector('#settings').firstElementChild.shadowRoot.querySelector('input')
          .value === 'abc',
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
        document.querySelector('#settings').firstElementChild.shadowRoot.querySelector('input')
          .value === 'locked',
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
    for (const code of await nodeCodes()) {
      await page.getByRole('button', { name: code, exact: true }).click()
      await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
      await page.locator('#business .mf-product').waitFor()
      await page.getByRole('button', { name: '空结果', exact: true }).click()
      await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
      await page.locator('#business').getByText('暂无商品').waitFor()
      await page.getByRole('button', { name: '读取失败', exact: true }).click()
      await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
      await page.locator('#business [role=alert]').waitFor()
      await page.getByRole('button', { name: '有商品', exact: true }).click()
      await page.waitForFunction(() => Boolean(document.querySelector('#app').dataset.mounted))
      await page.locator('#business .mf-product').waitFor()
    }
    await page.locator('#replace').click()
    await page.waitForFunction(() => window.preview.previous.every((f) => f.listeners.size === 0))
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
