import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { chromium } from 'playwright'
import { bundle } from '../build/bundle.mjs'
import { cache, root } from '../paths.mjs'
import { ensureUpstream } from '../upstream/index.mjs'

await ensureUpstream()
const directory = path.join(cache, 'transitions')
await mkdir(directory, { recursive: true })
const runtime = await build({
    stdin: { contents: "export * from 'lit'", resolveDir: root },
    conditions: ['production'],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    minify: true,
})
const lit =
    'data:text/javascript;base64,' + Buffer.from(runtime.outputFiles[0].text).toString('base64')
const browser = await chromium.launch({
    headless: true,
    ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
})
try {
    for (const minify of [false, true]) {
        const result = await bundle(
            path.join(root, 'tests/fixtures/transition-preview.ts'),
            'panel',
            {
                minify,
            },
        )
        const file = path.join(directory, minify ? 'preview.html' : 'preview-readable.html')
        await writeFile(
            file,
            `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>动画过渡组件预览</title><style>body{margin:0;padding:32px;background:#f4f6f9}@media(max-width:650px){body{padding:16px}}</style><body><mf-transition-preview></mf-transition-preview><script type="importmap">${JSON.stringify({ imports: { lit } })}</script><script type="module">${result.code}</script></body></html>`,
        )
        const page = await browser.newPage({
            viewport: { width: 1100, height: 920 },
            reducedMotion: 'no-preference',
        })
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        await page.goto(pathToFileURL(file).href)
        const host = page.locator('mf-transition-preview')
        await host.locator('#fade input').waitFor()
        const set = async (values) => {
            await host.evaluate(async (element, values) => {
                Object.assign(element, values)
                await element.updateComplete
                await Promise.resolve()
            }, values)
        }
        const toggle = async (effect) => {
            await host.evaluate(async (element, effect) => {
                element.toggle(effect)
                await element.updateComplete
                await Promise.resolve()
            }, effect)
        }
        const wrapper = (effect) => host.locator(`#${effect} .mf-transition`)
        const finish = async (effect) => {
            await wrapper(effect).evaluate((element) => {
                element.getAnimations().forEach((animation) => animation.finish())
            })
            await page.waitForFunction((effect) => {
                const element = document
                    .querySelector('mf-transition-preview')
                    .shadowRoot.querySelector(`#${effect} .mf-transition`)
                return element.getAnimations().length === 0
            }, effect)
        }
        const animationCount = (effect) =>
            wrapper(effect).evaluate((element) => element.getAnimations().length)
        const hidden = (effect) => wrapper(effect).evaluate((element) => element.hidden)
        for (const effect of ['fade', 'slide', 'scale', 'collapse']) {
            assert.equal(await animationCount(effect), 0, '首次渲染不播放动画')
            const input = host.locator(`#${effect} input`)
            await input.fill(`${effect} 保留输入`)
            await input.evaluate((element) => {
                element.dataset.original = 'true'
            })
            await toggle(effect)
            assert.equal(await wrapper(effect).evaluate((element) => element.inert), true)
            assert.equal(await wrapper(effect).getAttribute('aria-hidden'), 'true')
            const before = await wrapper(effect).evaluate((element) => {
                const animation = element.getAnimations()[0]
                animation.pause()
                animation.currentTime = 90
                element.savedAnimation = animation
                const style = getComputedStyle(element)
                return {
                    opacity: Number(style.opacity),
                    transform: style.transform,
                    height: style.height,
                }
            })
            await host.evaluate(async (element) => {
                element.requestUpdate()
                await element.updateComplete
            })
            assert.equal(
                await wrapper(effect).evaluate(
                    (element) => element.savedAnimation === element.getAnimations()[0],
                ),
                true,
                '普通重绘不重启动画',
            )
            await toggle(effect)
            const after = await wrapper(effect).evaluate((element) => {
                const animation = element.getAnimations()[0]
                animation.pause()
                animation.currentTime = 0
                const style = getComputedStyle(element)
                return {
                    opacity: Number(style.opacity),
                    transform: style.transform,
                    height: style.height,
                }
            })
            assert.ok(
                Math.abs(before.opacity - after.opacity) < 0.01,
                effect + ' 反向切换透明度连续',
            )
            assert.equal(before.transform, after.transform, effect + ' 反向切换位移连续')
            if (effect === 'collapse') assert.equal(before.height, after.height)
            await finish(effect)
            assert.equal(await hidden(effect), false)
            await toggle(effect)
            await finish(effect)
            assert.equal(await hidden(effect), true)
            assert.equal(
                await wrapper(effect).evaluate((element) => element.getBoundingClientRect().height),
                0,
            )
            await toggle(effect)
            await finish(effect)
            assert.equal(await input.inputValue(), `${effect} 保留输入`)
            assert.equal(await input.getAttribute('data-original'), 'true')
        }

        // 高度过渡中追加内容也要更新终点，结束后继续使用自然布局。
        await toggle('collapse')
        await finish('collapse')
        await toggle('collapse')
        await wrapper('collapse').evaluate((element) => {
            const animation = element.getAnimations()[0]
            animation.pause()
            animation.currentTime = 60
        })
        await set({ extra: 3 })
        await page.waitForFunction(() => {
            const element = document
                .querySelector('mf-transition-preview')
                .shadowRoot.querySelector('#collapse .mf-transition')
            const animation = element.getAnimations()[0]
            if (!animation) return !element.hidden
            return (
                Number.parseFloat(animation.effect.getKeyframes().at(-1).height) ===
                element.firstElementChild.offsetHeight
            )
        })
        await finish('collapse')
        const oldHeight = await wrapper('collapse').evaluate((element) => element.offsetHeight)
        await set({ extra: 5 })
        assert.ok(
            (await wrapper('collapse').evaluate((element) => element.offsetHeight)) > oldHeight,
        )
        assert.equal(await wrapper('collapse').evaluate((element) => element.style.height), '')

        // 四个进入方向对应实际位置；动画完成后不残留 transform。
        for (const direction of ['up', 'down', 'left', 'right']) {
            await set({ direction })
            await toggle('slide')
            await finish('slide')
            await toggle('slide')
            const offset = await wrapper('slide').evaluate((element) => {
                const animation = element.getAnimations()[0]
                animation.pause()
                animation.currentTime = 0
                const matrix = new DOMMatrix(getComputedStyle(element).transform)
                return { x: matrix.m41, y: matrix.m42 }
            })
            assert.deepEqual(offset, {
                x: direction === 'left' ? 12 : direction === 'right' ? -12 : 0,
                y: direction === 'up' ? 12 : direction === 'down' ? -12 : 0,
            })
            await finish('slide')
            assert.equal(
                await wrapper('slide').evaluate((element) => getComputedStyle(element).transform),
                'none',
            )
        }

        await set({ duration: 0 })
        await toggle('fade')
        assert.equal(await hidden('fade'), true)
        assert.equal(await animationCount('fade'), 0)
        await toggle('fade')
        await set({ duration: 1000 })
        await toggle('fade')
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.waitForFunction(
            () =>
                document
                    .querySelector('mf-transition-preview')
                    .shadowRoot.querySelector('#fade .mf-transition').hidden,
        )
        assert.equal(await animationCount('fade'), 0, '偏好变化立即结束进行中的动画')
        await toggle('fade')
        assert.equal(await animationCount('fade'), 0)
        await page.emulateMedia({ reducedMotion: 'no-preference' })

        // 暂时移除宿主：取消动画、断开监听，重连不回放旧动画。
        await toggle('fade')
        await host.evaluate((element) => {
            element.savedAnimation = element.shadowRoot
                .querySelector('#fade .mf-transition')
                .getAnimations()[0]
            element.remove()
            document.body.append(element)
        })
        assert.equal(await host.evaluate((element) => element.savedAnimation.playState), 'idle')
        assert.equal(await hidden('fade'), true)
        await toggle('fade')
        await finish('fade')
        // 父模板清除时，也必须取消正在运行的子指令资源。
        await toggle('collapse')
        await host.evaluate((element) => {
            element.savedAnimation = element.shadowRoot
                .querySelector('#collapse .mf-transition')
                .getAnimations()[0]
        })
        await set({ mounted: false })
        assert.equal(await host.evaluate((element) => element.savedAnimation.playState), 'idle')
        await set({ mounted: true })
        assert.equal(await hidden('collapse'), true, '初始隐藏不闪现或播放动画')
        assert.equal(await animationCount('collapse'), 0)
        await toggle('collapse')
        await finish('collapse')

        await set({ duration: 180, extra: 0 })
        // 不调用 finish，验证浏览器自然播放结束后的隐藏、交互和资源清理。
        for (const effect of ['fade', 'slide', 'scale', 'collapse']) {
            await toggle(effect)
            await page.waitForFunction((effect) => {
                const element = document
                    .querySelector('mf-transition-preview')
                    .shadowRoot.querySelector(`#${effect} .mf-transition`)
                return element.hidden && element.getAnimations().length === 0
            }, effect)
            assert.equal(
                await wrapper(effect).evaluate((element) => {
                    const input = element.querySelector('input')
                    input.focus()
                    return input.matches(':focus')
                }),
                false,
                '隐藏内容不能接收焦点',
            )
            await toggle(effect)
            await page.waitForFunction((effect) => {
                const element = document
                    .querySelector('mf-transition-preview')
                    .shadowRoot.querySelector(`#${effect} .mf-transition`)
                return !element.hidden && !element.inert && element.getAnimations().length === 0
            }, effect)
        }
        await toggle('fade')
        await wrapper('fade').evaluate((element) => element.getAnimations()[0].cancel())
        await page.waitForFunction(
            () =>
                document
                    .querySelector('mf-transition-preview')
                    .shadowRoot.querySelector('#fade .mf-transition').hidden,
        )
        await toggle('fade')
        await finish('fade')
        await page.screenshot({
            path: path.join(directory, minify ? 'preview.png' : 'preview-readable.png'),
            fullPage: true,
        })
        await page.setViewportSize({ width: 360, height: 920 })
        assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
        )
        assert.deepEqual(errors, [])
        await page.close()
        console.log(
            `PASS ${minify ? '压缩' : '可读'}产物：四种效果、快速反向、输入保留、自然高度、四向滑动、零时长、减少动态效果、断开重连、清除模板、窄屏；浏览器无运行错误`,
        )
    }
} finally {
    await browser.close()
}
