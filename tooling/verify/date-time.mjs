import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { chromium } from 'playwright'
import { root, cache } from '../paths.mjs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

/** 独立挂载受控字段，所有选择都经真实浮层完成，不以隐藏表单值替代用户交互。 */
test('统一日历保留确认事务、日期时间边界、键盘焦点及浮层生命周期', async () => {
    const bundle = await build({
        stdin: {
            resolveDir: root,
            contents: `import {LitElement,html} from 'lit';
                import {dateTimeField,panelStyles,dialog,button} from '@mofang/browser';
                class Example extends LitElement {
                    static properties={date:{state:true},time:{state:true},minimum:{state:true},maximum:{state:true},error:{state:true},readonly:{state:true},disabled:{state:true},modal:{state:true},note:{state:true}};
                    static styles=panelStyles;
                    constructor(){super();this.date='2026-10-28';this.time='2026-10-28T12:15';this.minimum='2026-10-01';this.maximum='2026-12-31';this.error='';this.readonly=false;this.disabled=false;this.modal=false;this.calls=[];this.note='';}
                    fields(){return html\`<div style="max-width:360px;margin:16px">\${dateTimeField({name:'date',label:'日期',mode:'date',required:true,value:this.date,min:this.minimum,max:this.maximum,error:this.error,readOnly:this.readonly,disabled:this.disabled,onChange:value=>{this.calls.push(['date',value]);this.date=value}})}\${dateTimeField({name:'time',label:'本地时间',value:this.time,min:this.minimum?this.minimum+'T09:30':'',max:this.maximum?this.maximum+'T17:45':'',onChange:value=>{this.calls.push(['time',value]);this.time=value}})}\${dateTimeField({name:'unbound',label:'未绑定日期',value:'',mode:'date',compact:true})}<button id="outside" style="position:fixed;right:20px;bottom:20px">外部按钮</button><span>\${this.note}</span></div>\`}
                    render(){return this.modal?dialog({open:true,title:'父模态',onClose:()=>{this.modal=false}},this.fields()):this.fields()}
                }
                customElements.define('mf-date-test',Example);const element=document.createElement('mf-date-test');document.body.append(element);window.example=element;`,
        },
        bundle: true,
        write: false,
        format: 'iife',
        platform: 'browser',
        loader: { '.svg': 'text' },
    })
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.MF_CHROME_PATH ? { executablePath: process.env.MF_CHROME_PATH } : {}),
    })
    try {
        const page = await browser.newPage({
            viewport: { width: 960, height: 800 },
            timezoneId: 'Asia/Shanghai',
        })
        page.setDefaultTimeout(10000)
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        await page.route('https://calendar.test/', (route) =>
            route.fulfill({
                body: '<!doctype html><html><body></body></html>',
                contentType: 'text/html',
            }),
        )
        await page.goto('https://calendar.test/')
        await page.addScriptTag({ content: bundle.outputFiles[0].text })
        const host = page.locator('mf-date-test')
        const date = host.getByRole('combobox', { name: '日期', exact: true })
        const time = host.getByRole('combobox', { name: '本地时间', exact: true })
        const calendar = host.getByRole('dialog', { name: '选择日期', exact: true })
        const clock = host.getByRole('dialog', { name: '选择本地时间', exact: true })
        const state = () =>
            host.evaluate((element) => ({
                date: element.date,
                time: element.time,
                calls: [...element.calls],
            }))
        const choose = async (dialog, label, value) => {
            await dialog.getByRole('combobox', { name: label, exact: true }).click()
            await host.getByRole('option', { name: value, exact: true }).click()
        }
        const settle = (element) =>
            element.evaluate((element) =>
                Promise.all(
                    element
                        .getAnimations({ subtree: true })
                        .map((animation) => animation.finished.catch(() => {})),
                ),
            )
        const motion = async (reducedMotion) => {
            await page.emulateMedia({ reducedMotion })
            // 浏览器在渲染帧分发媒体变更事件，给监听器两个帧完成取消。
            await page.evaluate(
                () =>
                    new Promise((resolve) =>
                        requestAnimationFrame(() => requestAnimationFrame(resolve)),
                    ),
            )
        }
        const rawCalendar = host.locator('.mf-date-time-popover[aria-label="选择日期"]')
        await date.evaluate((element) => element.click())
        const entering = await rawCalendar.evaluate((element) => {
            const animations = element.getAnimations()
            for (const animation of animations) {
                animation.pause()
                animation.currentTime = 80
            }
            return {
                count: animations.length,
                opacity: Number(getComputedStyle(element).opacity),
                transform: getComputedStyle(element).transform,
                duration: animations.map((animation) => animation.effect.getTiming().duration),
            }
        })
        assert.ok(entering.count >= 2, '打开浮层同时淡入与缩放')
        assert.ok(entering.opacity > 0 && entering.opacity < 1, '打开中间帧具有真实透明度')
        assert.notEqual(entering.transform, 'none', '打开中间帧具有轻缩放')
        assert.ok(entering.duration.every((duration) => duration === 160))
        await rawCalendar.evaluate((element) => element.getAnimations().forEach((a) => a.finish()))
        await calendar
            .getByRole('button', { name: '下个月', exact: true })
            .evaluate((e) => e.click())
        const monthMotion = await calendar.getByRole('grid').evaluate((element) => {
            const [animation] = element.getAnimations()
            animation.pause()
            animation.currentTime = 70
            window.calendarMonthAnimation = animation
            return {
                opacity: Number(getComputedStyle(element).opacity),
                transform: getComputedStyle(element).transform,
                duration: animation.effect.getTiming().duration,
            }
        })
        assert.ok(monthMotion.opacity > 0.35 && monthMotion.opacity < 1)
        assert.notEqual(monthMotion.transform, 'none')
        assert.equal(monthMotion.duration, 140)
        await host.evaluate((element) => {
            element.note = '月份动效中宿主重绘'
        })
        assert.equal(
            await calendar
                .getByRole('grid')
                .evaluate(
                    (element) => element.getAnimations()[0] === window.calendarMonthAnimation,
                ),
            true,
            '宿主重绘保留当前月份动效，不重新播放',
        )
        await calendar
            .getByRole('button', { name: '上个月', exact: true })
            .evaluate((e) => e.click())
        assert.equal(
            await page.evaluate(() => window.calendarMonthAnimation.playState),
            'idle',
            '快速反向切月取消旧动画',
        )
        assert.equal(await calendar.getByRole('grid').getAttribute('aria-label'), '2026年10月')
        assert.equal(await calendar.getByRole('grid').evaluate((e) => e.getAnimations().length), 1)
        await settle(calendar)
        await calendar.getByRole('button', { name: '2026年10月29日', exact: true }).click()
        assert.equal(
            await calendar.getByRole('grid').evaluate((e) => e.getAnimations().length),
            0,
            '选择同月日期不重播月份动效',
        )
        await calendar.getByRole('button', { name: '取消', exact: true }).evaluate((e) => e.click())
        const leaving = await rawCalendar.evaluate((element) => {
            element.getAnimations().forEach((animation) => {
                animation.pause()
                animation.currentTime = 80
            })
            return {
                open: element.matches(':popover-open'),
                inert: element.inert,
                ariaHidden: element.getAttribute('aria-hidden'),
                opacity: Number(getComputedStyle(element).opacity),
                direction: getComputedStyle(element).flexDirection,
                body: Boolean(element.querySelector('.mf-date-time-body')),
                footer: Boolean(element.querySelector('.mf-date-time-footer')),
                draft: element.querySelector('[aria-label="所选日期"]').value,
                footerBelow:
                    element.querySelector('.mf-date-time-footer').offsetTop >=
                    element.querySelector('.mf-date-time-body').offsetHeight,
            }
        })
        assert.deepEqual(
            { ...leaving, opacity: undefined },
            {
                open: false,
                inert: true,
                ariaHidden: 'true',
                opacity: undefined,
                direction: 'column',
                body: true,
                footer: true,
                draft: '2026-10-29',
                footerBelow: true,
            },
            '退场保留完整草稿画面与纵向结构，同时退出交互和可访问树',
        )
        assert.ok(leaving.opacity > 0 && leaving.opacity < 1)
        await date.evaluate((element) => element.click())
        await settle(calendar)
        assert.equal(await date.getAttribute('aria-expanded'), 'true', '迟到关闭事件不关闭新会话')
        assert.equal(
            await calendar.getByRole('textbox', { name: '所选日期', exact: true }).inputValue(),
            '2026-10-28',
            '快速重开丢弃旧草稿并恢复受控值',
        )
        await calendar
            .getByRole('button', { name: '下个月', exact: true })
            .evaluate((e) => e.click())
        await motion('reduce')
        assert.equal(await calendar.getByRole('grid').evaluate((e) => e.getAnimations().length), 0)
        assert.equal(await rawCalendar.evaluate((e) => e.getAnimations().length), 0)
        await calendar.getByRole('button', { name: '取消', exact: true }).evaluate((e) => e.click())
        assert.equal(
            await rawCalendar.locator('.mf-date-time-body').count(),
            0,
            '减少动效时立即清理退场',
        )
        await motion('no-preference')
        await date.evaluate((element) => {
            Object.assign(element.parentElement.style, {
                position: 'fixed',
                top: '700px',
                width: '280px',
            })
            element.click()
        })
        const upper = await rawCalendar.evaluate((element) => {
            element.getAnimations().forEach((animation) => {
                animation.pause()
                animation.currentTime = 80
            })
            const top = Number.parseFloat(element.style.top)
            window.visualViewport.dispatchEvent(new Event('resize'))
            return { top, height: element.offsetHeight }
        })
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)))
        assert.equal(
            await rawCalendar.evaluate((element) => Number.parseFloat(element.style.top)),
            upper.top,
            '缩放中重定位使用布局高度，上翻坐标不随动画反馈跳动',
        )
        assert.ok(upper.top + upper.height < (await date.boundingBox()).y)
        await rawCalendar.evaluate((element) => element.getAnimations().forEach((a) => a.finish()))
        await calendar.getByRole('button', { name: '取消', exact: true }).evaluate((e) => e.click())
        await motion('reduce')
        assert.equal(
            await rawCalendar.locator('.mf-date-time-body').count(),
            0,
            '退场中启用减少动态立即清理',
        )
        assert.equal(await rawCalendar.evaluate((e) => e.getAnimations().length), 0)
        await date.evaluate((element) => element.parentElement.removeAttribute('style'))
        await motion('no-preference')
        for (const key of ['readonly', 'disabled', 'date']) {
            await date.evaluate((element) => element.click())
            await calendar
                .getByRole('button', { name: '下个月', exact: true })
                .evaluate((e) => e.click())
            await host.evaluate((element, key) => {
                element[key] = key === 'date' ? '2026-10-27' : true
            }, key)
            assert.equal(await rawCalendar.locator('.mf-date-time-body').count(), 0)
            assert.equal(
                await rawCalendar.evaluate((e) => e.getAnimations({ subtree: true }).length),
                0,
            )
            await host.evaluate((element, key) => {
                element[key] = key === 'date' ? '2026-10-28' : false
            }, key)
        }
        await date.click()
        await settle(calendar)
        const dateProportions = await calendar.evaluate((element) => {
            const rect = element.getBoundingClientRect()
            const day = element.querySelector('[data-calendar-date]').getBoundingClientRect()
            const controls = [
                ...element.querySelectorAll(
                    '.mf-date-time-month input:not([type=hidden]),.mf-date-time-month .mf-select-trigger',
                ),
            ].map((control) => control.getBoundingClientRect().height)
            return {
                width: rect.width,
                height: rect.height,
                day: { width: day.width, height: day.height },
                controls,
                layout: element.dataset.layout,
            }
        })
        assert.equal(dateProportions.width, 304, '普通日期使用304px宽紧凑浮层')
        assert.ok(
            dateProportions.height >= 280 && dateProportions.height <= 350,
            '普通日期自然高度控制在350px内',
        )
        assert.deepEqual(dateProportions.day, { width: 28, height: 28 }, '日期按钮为28px方形')
        assert.ok(
            dateProportions.controls.every((height) => height === 32),
            '年月控件统一32px高',
        )
        assert.equal(dateProportions.layout, 'stacked')
        assert.equal((await date.boundingBox()).height, 36, '正常触发框沿用36px控件高度')
        assert.equal(
            (await host.getByRole('combobox', { name: '未绑定日期', exact: true }).boundingBox())
                .height,
            32,
            'compact触发框沿用32px控件高度',
        )
        await calendar.getByRole('button', { name: '2026年10月29日', exact: true }).click()
        const selectedDay = calendar.getByRole('button', { name: '2026年10月29日', exact: true })
        await settle(selectedDay)
        const selectedBackground = await selectedDay.evaluate(
            (element) => getComputedStyle(element).backgroundColor,
        )
        await selectedDay.hover()
        assert.equal(
            await selectedDay.evaluate((element) => getComputedStyle(element).backgroundColor),
            selectedBackground,
            '选中日期悬停保留选中背景',
        )
        assert.equal((await state()).calls.length, 0, '选择日期不得提前回写')
        await calendar.getByRole('button', { name: '取消', exact: true }).click()
        assert.equal((await state()).date, '2026-10-28')
        assert.equal(
            await date.evaluate((element) => element === element.getRootNode().activeElement),
            true,
            '取消后恢复触发器焦点',
        )
        await date.click()
        await calendar.getByRole('button', { name: '2026年10月29日', exact: true }).click()
        await calendar.getByRole('button', { name: '确认', exact: true }).evaluate((e) => e.click())
        assert.deepEqual((await state()).calls, [['date', '2026-10-29']])
        assert.equal(
            await rawCalendar.locator('.mf-date-time-footer').count(),
            1,
            '确认受控值回显后仍保留完整退场内容',
        )
        assert.equal(await rawCalendar.evaluate((e) => e.inert), true)
        await date.click()
        await calendar.getByRole('button', { name: '2026年10月30日', exact: true }).click()
        await page.keyboard.press('Escape')
        assert.equal((await state()).date, '2026-10-29')
        await date.click()
        await calendar.getByRole('button', { name: '2026年10月30日', exact: true }).click()
        await host.locator('#outside').click()
        await calendar.waitFor({ state: 'hidden' })
        assert.equal((await state()).date, '2026-10-29')
        assert.equal(
            await host
                .locator('#outside')
                .evaluate((element) => element === element.getRootNode().activeElement),
            true,
            '外点关闭不抢回焦点',
        )
        await date.focus()
        await date.press('ArrowDown')
        const focusedDay = calendar.locator('[data-calendar-date="2026-10-29"]')
        assert.equal(
            await focusedDay.evaluate((element) => element === element.getRootNode().activeElement),
            true,
        )
        await focusedDay.press('ArrowRight')
        const nextDay = calendar.locator('[data-calendar-date="2026-10-30"]')
        assert.equal(
            await nextDay.evaluate((element) => element === element.getRootNode().activeElement),
            true,
        )
        await nextDay.press('Enter')
        assert.equal((await state()).calls.length, 1)
        await nextDay.press('PageDown')
        await calendar.getByRole('grid', { name: '2026年11月', exact: true }).waitFor()
        await page.keyboard.press('Home')
        await page.keyboard.press('End')
        await page.keyboard.press('Escape')
        await date.click()
        await calendar.getByRole('spinbutton', { name: '年份', exact: true }).fill('2099')
        await calendar.getByRole('grid', { name: '2099年10月', exact: true }).waitFor()
        await calendar.getByRole('spinbutton', { name: '年份', exact: true }).fill('2026')
        await choose(calendar, '月份', '12月')
        await calendar.getByRole('button', { name: '2026年12月31日', exact: true }).click()
        await calendar.getByRole('button', { name: '确认', exact: true }).click()
        assert.equal((await state()).date, '2026-12-31')
        await date.click()
        await choose(calendar, '月份', '10月')
        assert.equal(
            await calendar.getByRole('button', { name: '上个月', exact: true }).isDisabled(),
            true,
        )
        assert.equal(
            await calendar.getByRole('button', { name: '2026年9月30日', exact: true }).isDisabled(),
            true,
        )
        const draft = calendar.getByRole('textbox', { name: '所选日期', exact: true })
        await draft.fill('2026-09-30')
        assert.equal(
            await calendar.getByRole('button', { name: '确认', exact: true }).isDisabled(),
            true,
        )
        assert.match(await calendar.getByRole('alert').innerText(), /不早于 2026-10-01/)
        await host.evaluate((element) => {
            element.note = '仅触发其它字段刷新'
        })
        assert.equal(await draft.inputValue(), '2026-09-30', '普通重绘保留未修正草稿')
        assert.equal((await state()).date, '2026-12-31')
        await draft.fill('2026-02-30')
        assert.match(await calendar.getByRole('alert').innerText(), /有效日期/)
        await host.evaluate((element) => {
            element.date = '2026-11-01'
        })
        await calendar.waitFor({ state: 'hidden' })
        await date.click()
        assert.equal(
            await calendar.getByRole('textbox', { name: '所选日期', exact: true }).inputValue(),
            '2026-11-01',
        )
        assert.equal(
            await calendar.getByRole('button', { name: '确认', exact: true }).isEnabled(),
            true,
        )
        await calendar.getByRole('button', { name: '清空', exact: true }).click()
        assert.equal((await state()).date, '2026-11-01', '清空按钮仅清草稿')
        await calendar.getByRole('button', { name: '确认', exact: true }).click()
        assert.equal((await state()).date, '', '必填标记不改变既有清空回传合同')
        await time.click()
        await settle(clock)
        const timeProportions = await clock.evaluate((element) => {
            const rect = element.getBoundingClientRect()
            const calendar = element.querySelector('.mf-date-time-calendar').getBoundingClientRect()
            const inputs = element.querySelector('.mf-date-time-inputs').getBoundingClientRect()
            return {
                width: rect.width,
                height: rect.height,
                layout: element.dataset.layout,
                calendar: { right: calendar.right, top: calendar.top },
                inputs: { left: inputs.left, top: inputs.top, width: inputs.width },
            }
        })
        assert.equal(timeProportions.width, 448, '宽屏日期时间使用448px浮层')
        assert.ok(
            timeProportions.height >= 260 && timeProportions.height <= 360,
            '宽屏日期时间保留自然紧凑高度',
        )
        assert.equal(timeProportions.layout, 'split')
        assert.equal(timeProportions.inputs.width, 128, '右侧日期时间输入区宽128px')
        assert.ok(
            timeProportions.inputs.left - timeProportions.calendar.right >= 11,
            '日历与输入区分列且保留间隔',
        )
        assert.equal(timeProportions.inputs.top, timeProportions.calendar.top, '双区顶部对齐')
        console.log(
            '紧凑日历实际比例',
            JSON.stringify({ date: dateProportions, time: timeProportions }),
        )
        await clock.getByRole('textbox', { name: '所选日期', exact: true }).fill('2026-10-01')
        await choose(clock, '小时', '09')
        await choose(clock, '分钟', '29')
        assert.equal(
            await clock.getByRole('grid').evaluate((e) => e.getAnimations().length),
            0,
            '小时和分钟变更不重播月份动效',
        )
        assert.equal(
            await clock.getByRole('button', { name: '确认', exact: true }).isDisabled(),
            true,
        )
        assert.equal((await state()).time, '2026-10-28T12:15')
        await choose(clock, '分钟', '30')
        await clock.getByRole('button', { name: '确认', exact: true }).click()
        assert.equal((await state()).time, '2026-10-01T09:30')
        await time.click()
        await clock.getByRole('textbox', { name: '所选日期', exact: true }).fill('2026-12-31')
        await choose(clock, '小时', '17')
        await choose(clock, '分钟', '46')
        assert.equal(
            await clock.getByRole('button', { name: '确认', exact: true }).isDisabled(),
            true,
        )
        await choose(clock, '分钟', '45')
        await clock.getByRole('button', { name: '确认', exact: true }).click()
        assert.equal((await state()).time, '2026-12-31T17:45')
        for (const key of ['readonly', 'disabled']) {
            await host.evaluate((element, key) => {
                element[key] = true
            }, key)
            assert.equal(await date.isDisabled(), true)
            await host.evaluate((element, key) => {
                element[key] = false
            }, key)
        }
        assert.equal(
            await host.getByRole('combobox', { name: '未绑定日期', exact: true }).isDisabled(),
            true,
        )
        await host.evaluate((element) => {
            element.error = '调用方日期错误'
        })
        assert.equal(await date.getAttribute('aria-invalid'), 'true')
        await host.getByRole('alert').getByText('调用方日期错误', { exact: true }).waitFor()
        await host.evaluate((element) => {
            element.error = ''
        })
        await date.click()
        await host.evaluate((element) => {
            element.remove()
            document.body.append(element)
        })
        await calendar.waitFor({ state: 'hidden' })
        assert.equal(
            await rawCalendar.locator('.mf-date-time-body').count(),
            0,
            '卸载重挂清空退场画面',
        )
        assert.equal(
            await rawCalendar.evaluate((e) => e.getAnimations({ subtree: true }).length),
            0,
        )
        await host.evaluate((element) => {
            element.modal = true
        })
        await date.click()
        await calendar.getByRole('button', { name: '今天', exact: true }).click()
        await calendar.getByRole('button', { name: '确认', exact: true }).click()
        const localDate = await page.evaluate(() => {
            const value = new Date()
            return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
        })
        assert.equal((await state()).date, localDate, '父模态内日历仍可交互')
        await host.evaluate((element) => {
            element.modal = false
            element.minimum = ''
            element.maximum = ''
        })
        await time.click()
        await clock.getByRole('spinbutton', { name: '年份', exact: true }).fill('2099')
        await choose(clock, '月份', '10月')
        await clock.getByRole('button', { name: '2099年10月28日', exact: true }).click()
        await choose(clock, '小时', '09')
        await choose(clock, '分钟', '30')
        await clock.getByRole('button', { name: '确认', exact: true }).click()
        assert.equal((await state()).time, '2099-10-28T09:30', '不进行时区转换')
        for (const reducedMotion of ['no-preference', 'reduce']) {
            await page.emulateMedia({ reducedMotion })
            await page.setViewportSize({ width: 320, height: 420 })
            await time.click()
            await settle(clock)
            const bounds = await clock.boundingBox()
            assert.ok(
                bounds.x >= 7 &&
                    bounds.y >= 7 &&
                    bounds.x + bounds.width <= 313 &&
                    bounds.y + bounds.height <= 413,
                '小视口浮层应完整钳位',
            )
            assert.equal(
                await clock.getAttribute('data-layout'),
                'stacked',
                '可见视口窄于480时回单列',
            )
            assert.equal(bounds.width, 304, '窄屏日期时间回退304px宽')
            const stacked = await clock.evaluate((element) => ({
                calendar: element.querySelector('.mf-date-time-calendar').getBoundingClientRect()
                    .bottom,
                inputs: element.querySelector('.mf-date-time-inputs').getBoundingClientRect().top,
            }))
            assert.ok(stacked.inputs >= stacked.calendar, '窄屏输入区位于日历下方')
            const footerBounds = await clock.locator('.mf-date-time-footer').boundingBox()
            assert.ok(
                footerBounds.y >= bounds.y &&
                    footerBounds.y + footerBounds.height <= bounds.y + bounds.height + 1,
                '短屏底部操作始终在浮层内可见',
            )
            const monthText = clock
                .getByRole('combobox', { name: '月份', exact: true })
                .locator('span')
                .first()
            assert.equal(
                await monthText.evaluate((element) => element.scrollWidth <= element.clientWidth),
                true,
                '月份文字不应截断',
            )
            const bodyScroll = await clock.locator('.mf-date-time-body').evaluate((element) => ({
                scroll: element.scrollWidth,
                client: element.clientWidth,
            }))
            assert.ok(bodyScroll.scroll <= bodyScroll.client + 1, '单列正文不产生横向溢出')
            await clock.getByRole('button', { name: '取消', exact: true }).click()
        }
        for (const [width, layout, expectedWidth] of [
            [480, 'split', 448],
            [479, 'stacked', 304],
        ]) {
            await page.setViewportSize({ width, height: 800 })
            await time.click()
            await settle(clock)
            assert.equal(await clock.getAttribute('data-layout'), layout, '480px可见宽作为双区边界')
            assert.equal((await clock.boundingBox()).width, expectedWidth)
            await clock.getByRole('button', { name: '取消', exact: true }).click()
        }
        await page.setViewportSize({ width: 960, height: 800 })
        await page.evaluate(() =>
            Object.defineProperty(window.visualViewport, 'width', {
                configurable: true,
                value: 320,
            }),
        )
        await time.click()
        await settle(clock)
        assert.equal(await page.evaluate(() => innerWidth), 960)
        assert.equal(
            await clock.getAttribute('data-layout'),
            'stacked',
            'VisualViewport变窄时也应回单列',
        )
        assert.equal((await clock.boundingBox()).width, 304)
        await page.evaluate(() => {
            delete window.visualViewport.width
            window.visualViewport.dispatchEvent(new Event('resize'))
        })
        await page.waitForFunction(
            () =>
                document
                    .querySelector('mf-date-test')
                    .shadowRoot.querySelector('.mf-date-time-popover[data-mode="datetime-local"]')
                    .dataset.layout === 'split',
        )
        assert.equal((await clock.boundingBox()).width, 448, '可见宽恢复后实时重排双区')
        await clock.getByRole('button', { name: '取消', exact: true }).click()
        await time.click()
        await settle(clock)
        await mkdir(path.join(cache, 'date-time'), { recursive: true })
        await page.screenshot({ path: path.join(cache, 'date-time', 'calendar.png') })
        assert.deepEqual(errors, [])
    } finally {
        await browser.close()
    }
})
