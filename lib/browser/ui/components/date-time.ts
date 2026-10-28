import { css, html, nothing } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'
import { ref } from 'lit/directives/ref.js'
import { fieldLabel } from './form'
import type { FieldProps } from './form'
import { button, numberField } from './controls'
import { selectField } from './select'
import { popoverViewport, trackPopoverAnchor } from './popover-anchor'

export type DateTimeFieldProps = FieldProps &
    Readonly<{
        value: string
        mode?: 'date' | 'datetime-local'
        min?: string
        max?: string
        readOnly?: boolean
        disabled?: boolean
        onChange?: (value: string) => void
    }>

type CalendarDate = Readonly<{ year: number; month: number; day: number }>
const pad = (value: number) => String(value).padStart(2, '0')
const dateValue = (date: CalendarDate) =>
    `${String(date.year).padStart(4, '0')}-${pad(date.month)}-${pad(date.day)}`
const monthDays = (year: number, month: number) =>
    [
        31,
        year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ][month - 1]!

/** 标准日期按公历字段校验，绝不将受控字符串交给时区解析。 */
function parseDate(value: string): CalendarDate | undefined {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!match) return
    const year = Number(match[1]),
        month = Number(match[2]),
        day = Number(match[3])
    if (year < 1 || month < 1 || month > 12 || day < 1 || day > monthDays(year, month)) return
    return { year, month, day }
}
function shiftMonth(date: CalendarDate, delta: number): CalendarDate {
    const index = (date.year - 1) * 12 + date.month - 1 + delta
    const bounded = Math.max(0, Math.min(9999 * 12 - 1, index))
    const year = Math.floor(bounded / 12) + 1,
        month = (bounded % 12) + 1
    return { year, month, day: Math.min(date.day, monthDays(year, month)) }
}
function shiftDay(date: CalendarDate, delta: number): CalendarDate {
    let { year, month, day } = date
    day += delta
    while (day > monthDays(year, month)) {
        if (year === 9999 && month === 12) return { year, month, day: 31 }
        day -= monthDays(year, month)
        if (month === 12) {
            year++
            month = 1
        } else month++
    }
    while (day < 1) {
        if (year === 1 && month === 1) return { year, month, day: 1 }
        if (month === 1) {
            year--
            month = 12
        } else month--
        day += monthDays(year, month)
    }
    return { year, month, day }
}
/** 公历星期以周一为0，仅使用整数计算。 */
function weekday(date: CalendarDate) {
    const year = date.year - 1
    let days = year * 365 + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400)
    for (let month = 1; month < date.month; month++) days += monthDays(date.year, month)
    return (days + date.day - 1) % 7
}
function localNow() {
    const now = new Date()
    return {
        date: { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() },
        hour: pad(now.getHours()),
        minute: pad(now.getMinutes()),
    }
}
let sequence = 0

/** 日历只持有未确认草稿；关闭、卸载和受控值改变时都丢弃该草稿。 */
class DateTimeDirective extends AsyncDirective {
    private readonly id = `mf-calendar-${++sequence}`
    private props!: DateTimeFieldProps
    private trigger: HTMLButtonElement | undefined
    private menu: HTMLElement | undefined
    private opened = false
    private draftDate = ''
    private hour = '00'
    private minute = '00'
    private view: CalendarDate = { year: 2000, month: 1, day: 1 }
    private focusedDate = ''
    private stopTracking: (() => void) | undefined
    private closingContent: ReturnType<typeof html> | undefined
    private closeTimer: number | undefined
    private closeOwner: Window | undefined
    private motionQuery: MediaQueryList | undefined
    private monthAnimation: Animation | undefined
    private pendingMonth = 0
    private confirmedValue: string | undefined
    private readonly bindTrigger = (element?: Element) => {
        this.trigger = element as HTMLButtonElement | undefined
    }
    private readonly bindMenu = (element?: Element) => {
        this.menu = element as HTMLElement | undefined
    }

    override render(props: DateTimeFieldProps) {
        const confirmation =
            !this.opened &&
            Boolean(this.closingContent) &&
            this.confirmedValue !== undefined &&
            props.value === this.confirmedValue &&
            props.mode === this.props?.mode &&
            props.name === this.props?.name
        const changed =
            this.props &&
            (props.value !== this.props.value ||
                props.mode !== this.props.mode ||
                props.name !== this.props.name)
        this.props = props
        this.confirmedValue = undefined
        if ((changed && !confirmation) || this.disabled) this.discard()
        queueMicrotask(() => this.sync())
        return this.template()
    }
    private get disabled() {
        return Boolean(this.props.disabled || this.props.readOnly || !this.props.onChange)
    }
    private get mode() {
        return this.props.mode ?? 'datetime-local'
    }
    private get minimum() {
        return parseDate(this.props.min?.slice(0, 10) ?? '')
    }
    private get maximum() {
        return parseDate(this.props.max?.slice(0, 10) ?? '')
    }
    private allowed(date: CalendarDate) {
        const value = dateValue(date)
        return (
            (!this.minimum || value >= dateValue(this.minimum)) &&
            (!this.maximum || value <= dateValue(this.maximum))
        )
    }
    private bounded(date: CalendarDate) {
        if (this.minimum && dateValue(date) < dateValue(this.minimum)) return this.minimum
        if (this.maximum && dateValue(date) > dateValue(this.maximum)) return this.maximum
        return date
    }
    private candidate() {
        if (!this.draftDate) return ''
        return this.mode === 'date'
            ? this.draftDate
            : `${this.draftDate}T${this.hour}:${this.minute}`
    }
    private validation(value: string) {
        const label = this.mode === 'date' ? '日期' : '日期时间'
        const native = this.trigger?.ownerDocument.createElement('input')
        if (!native) return ''
        native.type = this.mode
        native.required = Boolean(this.props.required)
        if (this.props.min) native.min = this.props.min
        if (this.props.max) native.max = this.props.max
        native.value = value
        if (!value) return ''
        if (!parseDate(value.slice(0, 10)) || !native.value || !native.validity.valid)
            return `请输入有效${label}${this.props.min ? `，不早于 ${this.props.min}` : ''}${this.props.max ? `，不晚于 ${this.props.max}` : ''}；未修正前不会保存`
        return ''
    }
    private open() {
        if (this.disabled || (this.opened && this.menu?.matches(':popover-open'))) return
        this.clearExit()
        this.confirmedValue = undefined
        this.cancelMonth()
        this.watchMotion()
        const value = this.props.value
        const parsed = parseDate(value.slice(0, 10))
        this.draftDate = value ? value.slice(0, 10) : ''
        this.hour = /^\d{2}:\d{2}/.test(value.slice(11)) ? value.slice(11, 13) : '00'
        this.minute = /^\d{2}:\d{2}/.test(value.slice(11)) ? value.slice(14, 16) : '00'
        this.view = this.bounded(parsed ?? localNow().date)
        this.focusedDate = dateValue(this.view)
        this.opened = true
        this.repaint(true)
    }
    private resetDraft() {
        this.opened = false
        this.draftDate = ''
        this.hour = '00'
        this.minute = '00'
        this.focusedDate = ''
        this.release()
        this.cancelMonth()
    }
    private discard() {
        this.resetDraft()
        this.clearExit()
        this.stopMotion()
    }
    private clearExit() {
        if (this.closeTimer !== undefined) this.closeOwner?.clearTimeout(this.closeTimer)
        this.closeTimer = undefined
        this.closeOwner = undefined
        this.closingContent = undefined
    }
    private finishClose() {
        if (this.opened) return
        this.clearExit()
        this.stopMotion()
        this.repaint()
    }
    private readonly motionChanged = () => {
        if (!this.motionQuery?.matches) return
        this.cancelMonth()
        if (this.closingContent) this.finishClose()
    }
    private watchMotion() {
        if (this.motionQuery) return
        this.motionQuery = this.trigger?.ownerDocument.defaultView?.matchMedia(
            '(prefers-reduced-motion: reduce)',
        )
        this.motionQuery?.addEventListener('change', this.motionChanged)
    }
    private stopMotion() {
        this.motionQuery?.removeEventListener('change', this.motionChanged)
        this.motionQuery = undefined
    }
    private cancelMonth() {
        this.pendingMonth = 0
        if (this.monthAnimation) {
            this.monthAnimation.onfinish = null
            this.monthAnimation.cancel()
            this.monthAnimation = undefined
        }
    }
    /** 仅用户实际换月时登记动效，宿主重绘和同月选择不重复播放。 */
    private setView(date: CalendarDate) {
        const delta = (date.year - this.view.year) * 12 + date.month - this.view.month
        if (delta) {
            this.cancelMonth()
            this.pendingMonth = Math.sign(delta)
        }
        this.view = date
    }
    private animateMonth() {
        const direction = this.pendingMonth
        this.pendingMonth = 0
        const grid = this.menu?.querySelector<HTMLElement>('.mf-date-time-grid')
        if (!direction || !grid || !this.opened || this.motionQuery?.matches) return
        const animation = grid.animate(
            [
                { opacity: 0.35, transform: `translateX(${direction * 5}px)` },
                { opacity: 1, transform: 'none' },
            ],
            { duration: 140, easing: 'ease-out' },
        )
        this.monthAnimation = animation
        animation.onfinish = () => {
            if (this.monthAnimation === animation) this.monthAnimation = undefined
        }
    }
    private close(focus: boolean) {
        if (!this.opened) return
        // 退场保留最后一帧内容，但草稿和可操作语义立即结束。
        const content = this.calendar()
        this.resetDraft()
        this.clearExit()
        if (!this.motionQuery?.matches) {
            this.closingContent = content
            this.closeOwner = this.trigger?.ownerDocument.defaultView ?? undefined
            this.closeTimer = this.closeOwner?.setTimeout(() => this.finishClose(), 180)
        } else this.stopMotion()
        this.repaint()
        if (focus) this.trigger?.focus()
    }
    private confirm() {
        if (this.disabled || this.validation(this.candidate())) return
        const value = this.candidate(),
            change = this.props.onChange
        this.close(true)
        // 本次确认的受控回显属于同一关闭事务，沿用已冻结的退场画面。
        this.confirmedValue = value
        change?.(value)
    }
    private repaint(focusDate = false) {
        if (!this.isConnected) return
        this.setValue(this.template())
        queueMicrotask(() => {
            this.sync()
            this.animateMonth()
            if (focusDate && this.opened)
                this.menu
                    ?.querySelector<HTMLButtonElement>(`[data-calendar-date="${this.focusedDate}"]`)
                    ?.focus()
        })
    }
    private browse(monthDelta: number) {
        const next = shiftMonth(this.view, monthDelta)
        this.setView(next)
        this.focusedDate = dateValue(this.bounded(next))
        this.repaint()
    }
    private choose(date: CalendarDate) {
        if (!this.allowed(date)) return
        this.draftDate = dateValue(date)
        this.focusedDate = this.draftDate
        this.setView(date)
        this.repaint()
    }
    private gridKey(event: KeyboardEvent, date: CalendarDate) {
        const deltas: Record<string, number> = {
            ArrowLeft: -1,
            ArrowRight: 1,
            ArrowUp: -7,
            ArrowDown: 7,
            Home: -weekday(date),
            End: 6 - weekday(date),
        }
        let next: CalendarDate | undefined
        if (event.key in deltas) next = shiftDay(date, deltas[event.key]!)
        else if (event.key === 'PageUp' || event.key === 'PageDown')
            next = shiftMonth(date, (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1))
        if (!next) return
        event.preventDefault()
        this.setView(this.bounded(next))
        this.focusedDate = dateValue(this.view)
        this.repaint(true)
    }
    private readonly position = () => {
        if (!this.opened || !this.trigger || !this.menu) return
        const owner = this.trigger.ownerDocument.defaultView
        if (!owner) return
        const rect = this.trigger.getBoundingClientRect(),
            viewport = popoverViewport(owner)
        if (
            rect.bottom <= viewport.top ||
            rect.top >= viewport.bottom ||
            rect.right <= viewport.left ||
            rect.left >= viewport.right
        ) {
            this.close(false)
            return
        }
        const split = this.mode === 'datetime-local' && viewport.width >= 480
        const preferredWidth = split ? 448 : 304
        const preferredHeight = this.mode === 'date' ? 350 : split ? 360 : 440
        const width = Math.max(0, Math.min(preferredWidth, viewport.width - 16))
        this.menu.dataset.layout = split ? 'split' : 'stacked'
        Object.assign(this.menu.style, {
            width: `${width}px`,
            maxHeight: `${Math.max(0, Math.min(preferredHeight, viewport.height - 16))}px`,
        })
        // 浮层缩放期间仍按布局高度定位，避免动画帧反向影响上翻位置。
        const height = this.menu.offsetHeight
        const below = viewport.bottom - rect.bottom - 6,
            above = rect.top - viewport.top - 6
        const desired = below < height && above > below ? rect.top - height - 6 : rect.bottom + 6
        Object.assign(this.menu.style, {
            left: `${Math.max(viewport.left + 8, Math.min(rect.left, viewport.right - width - 8))}px`,
            top: `${Math.max(viewport.top + 8, Math.min(desired, viewport.bottom - height - 8))}px`,
        })
    }
    private sync() {
        if (!this.isConnected || !this.menu?.isConnected) return
        if (!this.opened) {
            if (this.menu.matches(':popover-open')) this.menu.hidePopover()
            if (!this.closingContent)
                this.menu.getAnimations().forEach((animation) => animation.cancel())
            this.release()
            return
        }
        if (!this.stopTracking && this.trigger)
            this.stopTracking = trackPopoverAnchor(this.trigger, this.position)
        if (!this.menu.matches(':popover-open')) this.menu.showPopover()
        this.position()
    }
    private release() {
        this.stopTracking?.()
        this.stopTracking = undefined
    }
    protected override disconnected() {
        this.discard()
        if (this.menu?.matches(':popover-open')) this.menu.hidePopover()
        this.menu?.getAnimations().forEach((animation) => animation.cancel())
    }
    protected override reconnected() {
        this.repaint()
    }
    private days() {
        const first = { year: this.view.year, month: this.view.month, day: 1 }
        const start = shiftDay(first, -weekday(first))
        return Array.from({ length: 42 }, (_, index) => shiftDay(start, index))
    }
    private monthAllowed(delta: number) {
        const next = shiftMonth(this.view, delta)
        if (next.year === this.view.year && next.month === this.view.month) return false
        const first = dateValue({ ...next, day: 1 }),
            last = dateValue({ ...next, day: monthDays(next.year, next.month) })
        return (
            (!this.minimum || last >= dateValue(this.minimum)) &&
            (!this.maximum || first <= dateValue(this.maximum))
        )
    }
    private calendar() {
        const p = this.props,
            today = localNow(),
            selected = this.draftDate
        const nowValue =
            this.mode === 'date'
                ? dateValue(today.date)
                : `${dateValue(today.date)}T${today.hour}:${today.minute}`
        const error = this.validation(this.candidate())
        return html`<div class="mf-date-time-body">
                <section class="mf-date-time-calendar">
                    <header class="mf-date-time-header">
                        ${button({
                            label: '上个月',
                            size: 'small',
                            disabled: !this.monthAllowed(-1),
                            onClick: () => this.browse(-1),
                        })}
                        <div class="mf-date-time-month">
                            ${numberField({
                                name: this.id + '-year',
                                label: '年份',
                                value: this.view.year,
                                min: 1,
                                max: 9999,
                                integer: true,
                                compact: true,
                                onChange: (year) => {
                                    if (year !== undefined) {
                                        this.setView({ year, month: this.view.month, day: 1 })
                                        this.focusedDate = dateValue(this.bounded(this.view))
                                        this.repaint()
                                    }
                                },
                            })}${selectField({
                                name: this.id + '-month',
                                label: '月份',
                                value: String(this.view.month),
                                compact: true,
                                options: Array.from({ length: 12 }, (_, index) => ({
                                    value: String(index + 1),
                                    label: `${index + 1}月`,
                                })),
                                onChange: (month) => {
                                    if (month) {
                                        this.setView({
                                            year: this.view.year,
                                            month: Number(month),
                                            day: 1,
                                        })
                                        this.focusedDate = dateValue(this.bounded(this.view))
                                        this.repaint()
                                    }
                                },
                            })}
                        </div>
                        ${button({
                            label: '下个月',
                            size: 'small',
                            disabled: !this.monthAllowed(1),
                            onClick: () => this.browse(1),
                        })}
                    </header>
                    <div class="mf-date-time-week" aria-hidden="true">
                        ${['一', '二', '三', '四', '五', '六', '日'].map(
                            (day) => html`<span>${day}</span>`,
                        )}
                    </div>
                    <div
                        class="mf-date-time-grid"
                        role="grid"
                        aria-label=${`${this.view.year}年${this.view.month}月`}
                    >
                        ${Array.from(
                            { length: 6 },
                            (_, row) =>
                                html`<div role="row">
                                    ${this.days()
                                        .slice(row * 7, row * 7 + 7)
                                        .map(
                                            (date) =>
                                                html`<span
                                                    role="gridcell"
                                                    aria-selected=${selected === dateValue(date)}
                                                    ><button
                                                        type="button"
                                                        data-calendar-date=${dateValue(date)}
                                                        data-adjacent=${date.month !==
                                                        this.view.month}
                                                        data-today=${dateValue(date) ===
                                                        dateValue(today.date)}
                                                        aria-label=${`${date.year}年${date.month}月${date.day}日`}
                                                        aria-current=${dateValue(date) ===
                                                        dateValue(today.date)
                                                            ? 'date'
                                                            : nothing}
                                                        ?disabled=${!this.allowed(date)}
                                                        tabindex=${dateValue(date) ===
                                                            this.focusedDate && this.allowed(date)
                                                            ? 0
                                                            : -1}
                                                        @click=${() => this.choose(date)}
                                                        @keydown=${(event: KeyboardEvent) =>
                                                            this.gridKey(event, date)}
                                                    >
                                                        ${date.day}
                                                    </button></span
                                                >`,
                                        )}
                                </div>`,
                        )}
                    </div>
                </section>
                <section class="mf-date-time-inputs">
                    <div class="mf-date-time-draft">
                        <label class="mf-field" data-compact="true"
                            ><span class="mf-label">所选日期</span
                            ><input
                                class="mf-input"
                                name=${this.id + '-draft-date'}
                                aria-label="所选日期"
                                placeholder="YYYY-MM-DD"
                                inputmode="numeric"
                                .value=${this.draftDate}
                                aria-invalid=${Boolean(error)}
                                @input=${(event: Event) => {
                                    this.draftDate = (event.currentTarget as HTMLInputElement).value
                                    const date = parseDate(this.draftDate)
                                    if (date) {
                                        this.setView(date)
                                        this.focusedDate = dateValue(this.bounded(date))
                                    }
                                    this.repaint()
                                }}
                        /></label>
                        ${this.mode === 'datetime-local'
                            ? html`<div class="mf-date-time-clock" aria-label="24小时时间">
                                  ${selectField({
                                      name: this.id + '-hour',
                                      label: '小时',
                                      value: this.hour,
                                      compact: true,
                                      options: Array.from({ length: 24 }, (_, hour) => ({
                                          value: pad(hour),
                                          label: pad(hour),
                                      })),
                                      onChange: (value) => {
                                          this.hour = value ?? '00'
                                          this.repaint()
                                      },
                                  })}<span aria-hidden="true">:</span>${selectField({
                                      name: this.id + '-minute',
                                      label: '分钟',
                                      value: this.minute,
                                      compact: true,
                                      options: Array.from({ length: 60 }, (_, minute) => ({
                                          value: pad(minute),
                                          label: pad(minute),
                                      })),
                                      onChange: (value) => {
                                          this.minute = value ?? '00'
                                          this.repaint()
                                      },
                                  })}
                              </div>`
                            : nothing}
                    </div>
                    <p
                        class="mf-field-error mf-date-time-validation"
                        role="alert"
                        ?hidden=${!error}
                    >
                        ${error}
                    </p>
                    ${p.min || p.max
                        ? html`<p class="mf-hint mf-date-time-bound">
                              ${p.min ? '不早于 ' + p.min : ''}${p.min && p.max ? ' · ' : ''}${p.max
                                  ? '不晚于 ' + p.max
                                  : ''}
                          </p>`
                        : nothing}
                </section>
            </div>
            <footer class="mf-date-time-footer">
                <div>
                    ${button({
                        label: this.mode === 'date' ? '今天' : '现在',
                        size: 'small',
                        disabled: Boolean(this.validation(nowValue)),
                        onClick: () => {
                            this.draftDate = dateValue(today.date)
                            this.hour = today.hour
                            this.minute = today.minute
                            this.setView(today.date)
                            this.focusedDate = this.draftDate
                            this.repaint()
                        },
                    })}${button({
                        label: '清空',
                        size: 'small',
                        onClick: () => {
                            this.draftDate = ''
                            this.repaint()
                        },
                    })}
                </div>
                <div>
                    ${button({
                        label: '取消',
                        size: 'small',
                        onClick: () => this.close(true),
                    })}${button({
                        label: '确认',
                        variant: 'primary',
                        size: 'small',
                        disabled: Boolean(error),
                        onClick: () => this.confirm(),
                    })}
                </div>
            </footer>`
    }
    private template() {
        const p = this.props,
            describedBy = [p.hint ? `${this.id}-hint` : '', p.error ? `${this.id}-error` : '']
                .filter(Boolean)
                .join(' ')
        return html`<div class="mf-field mf-date-time" data-compact=${p.compact ?? false}>
            ${fieldLabel(p)}<button
                type="button"
                class="mf-date-time-trigger"
                role="combobox"
                aria-label=${p.label}
                aria-expanded=${this.opened}
                aria-haspopup="dialog"
                aria-controls=${this.id}
                aria-required=${Boolean(p.required)}
                aria-invalid=${Boolean(p.error)}
                aria-describedby=${describedBy || nothing}
                ?disabled=${this.disabled}
                ${ref(this.bindTrigger)}
                @click=${() => (this.opened ? this.close(true) : this.open())}
                @keydown=${(event: KeyboardEvent) => {
                    if (event.key === 'ArrowDown') {
                        event.preventDefault()
                        this.open()
                    } else if (event.key === 'Escape' && this.opened) {
                        event.preventDefault()
                        this.close(true)
                    }
                }}
            >
                <span data-placeholder=${!p.value}
                    >${p.value
                        ? p.value.replace('T', ' ')
                        : this.mode === 'date'
                          ? '请选择日期'
                          : '请选择日期时间'}</span
                ><svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M7 3v4m10-4v4M3 10h18" />
                </svg>
            </button>
            <input
                type=${this.mode}
                name=${p.name}
                .value=${p.value}
                min=${p.min ?? nothing}
                max=${p.max ?? nothing}
                ?required=${p.required}
                ?disabled=${this.disabled}
                hidden
                tabindex="-1"
                aria-hidden="true"
            />
            <div
                id=${this.id}
                class="mf-date-time-popover"
                data-mode=${this.mode}
                role="dialog"
                aria-label=${'选择' + p.label}
                popover="auto"
                aria-hidden=${this.opened ? nothing : 'true'}
                ?inert=${!this.opened}
                ${ref(this.bindMenu)}
                @transitionend=${(event: TransitionEvent) => {
                    if (event.target === this.menu && event.propertyName === 'opacity')
                        this.finishClose()
                }}
                @keydown=${(event: KeyboardEvent) => {
                    if (event.key === 'Escape') {
                        event.preventDefault()
                        event.stopPropagation()
                        this.close(true)
                    }
                }}
                @beforetoggle=${(event: Event) => {
                    if (
                        event.target === this.menu &&
                        (event as ToggleEvent).newState === 'closed' &&
                        this.opened
                    )
                        this.close(false)
                }}
                @toggle=${(event: Event) => {
                    if (
                        event.target === this.menu &&
                        (event as ToggleEvent).newState === 'closed' &&
                        this.opened &&
                        !this.menu?.matches(':popover-open')
                    )
                        this.close(false)
                }}
            >
                ${this.opened ? this.calendar() : (this.closingContent ?? nothing)}
            </div>
            ${p.error
                ? html`<span class="mf-field-error" role="alert" id=${this.id + '-error'}
                      >${p.error}</span
                  >`
                : nothing}${p.hint
                ? html`<span class="mf-hint" id=${this.id + '-hint'}>${p.hint}</span>`
                : nothing}
        </div>`
    }
}
const renderDateTime = /* @__PURE__ */ directive(DateTimeDirective)

/** 统一日历浮层：只有确认才回写标准字符串，取消或关闭保留宿主原值。 */
export function dateTimeField(props: DateTimeFieldProps) {
    return html`${renderDateTime(props)}`
}

/** 日期样式独立导出，由公共panelStyles统一收录，沿用现有主题与控件。 */
export const dateTimeStyles = /* @__PURE__ */ (() => css`
    .mf-date-time-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        box-sizing: border-box;
        width: 100%;
        height: 36px;
        min-height: 36px;
        padding: 6px 12px;
        border: 1px solid var(--mf-line);
        border-radius: var(--mf-radius, 6px);
        background: var(--mf-bg, #fff);
        color: var(--mf-fg);
        font: inherit;
        font-size: 14px;
        text-align: left;
        cursor: pointer;
    }
    .mf-date-time[data-compact='true'] .mf-date-time-trigger {
        height: 32px;
        min-height: 32px;
        padding: 4px 10px;
        font-size: 13px;
    }
    .mf-date-time-trigger [data-placeholder='true'] {
        color: var(--mf-muted);
    }
    .mf-date-time-trigger svg {
        width: 17px;
        height: 17px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.6;
        color: var(--mf-muted);
        flex: none;
    }
    .mf-date-time-trigger:focus-visible {
        outline: 2px solid var(--mf-focus, #87bbff);
        outline-offset: 2px;
    }
    .mf-date-time-trigger:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }
    .mf-date-time-trigger[aria-invalid='true'] {
        border-color: #d94848;
    }
    .mf-date-time-popover {
        position: fixed;
        inset: auto;
        margin: 0;
        box-sizing: border-box;
        padding: 0;
        border: 1px solid var(--mf-line);
        border-radius: 8px;
        background: var(--mf-bg, #fff);
        color: var(--mf-fg);
        box-shadow: 0 8px 24px #0002;
        overflow: hidden;
        font: inherit;
        font-size: 13px;
        flex-direction: column;
        opacity: 0;
        transform: translateY(-3px) scale(0.98);
        transform-origin: top center;
        transition:
            opacity 160ms ease-out,
            transform 160ms ease-out,
            display 160ms allow-discrete,
            overlay 160ms allow-discrete;
    }
    .mf-date-time-popover:popover-open {
        display: flex;
        opacity: 1;
        transform: none;
    }
    .mf-date-time-popover:not(:popover-open) {
        pointer-events: none;
    }
    @starting-style {
        .mf-date-time-popover:popover-open {
            opacity: 0;
            transform: translateY(-3px) scale(0.98);
        }
    }
    .mf-date-time-popover::backdrop {
        background: transparent;
    }
    .mf-date-time-body {
        display: grid;
        gap: 6px;
        min-height: 0;
        padding: 12px;
        overflow: auto;
        overscroll-behavior: contain;
    }
    .mf-date-time-popover[data-layout='split'] .mf-date-time-body {
        grid-template-columns: minmax(0, 1fr) 128px;
        gap: 12px;
        align-items: start;
    }
    .mf-date-time-calendar,
    .mf-date-time-inputs {
        min-width: 0;
    }
    .mf-date-time-header {
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: space-between;
    }
    .mf-date-time-header > .mf-button {
        min-width: 28px;
        height: 28px;
        min-height: 28px;
        padding: 0 6px;
        font-size: 12px;
    }
    .mf-date-time-month {
        display: grid;
        grid-template-columns: 76px 72px;
        gap: 4px;
        min-width: 0;
    }
    .mf-date-time-month .mf-label,
    .mf-date-time-popover[data-mode='date'] .mf-date-time-draft > .mf-field > .mf-label {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
        border: 0;
    }
    .mf-date-time-popover .mf-field {
        margin: 0;
        max-width: none;
        min-width: 0;
        gap: 4px;
    }
    .mf-date-time-popover .mf-input,
    .mf-date-time-popover .mf-select-trigger {
        height: 32px;
        min-height: 32px;
        padding: 4px 6px;
        font-size: 13px;
        gap: 2px;
    }
    .mf-date-time-popover .mf-select-trigger svg {
        width: 14px;
        height: 14px;
    }
    .mf-date-time-popover .mf-field .mf-label {
        font-size: 11px;
        margin-bottom: 0;
    }
    .mf-date-time-week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        margin-top: 6px;
        color: var(--mf-muted);
        font-size: 12px;
        line-height: 16px;
    }
    .mf-date-time-grid {
        margin-top: 4px;
    }
    .mf-date-time-grid [role='row'] {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
    }
    .mf-date-time-grid [role='gridcell'] {
        min-width: 0;
        display: grid;
        place-items: center;
    }
    .mf-date-time-grid button {
        display: grid;
        place-items: center;
        width: 28px;
        height: 28px;
        padding: 0;
        border: 0;
        border-radius: 5px;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
        transition:
            background-color 100ms ease-out,
            color 100ms ease-out;
    }
    .mf-date-time-grid button[data-adjacent='true'] {
        color: var(--mf-muted);
    }
    .mf-date-time-grid button[data-today='true'] {
        box-shadow: inset 0 0 0 1px var(--mf-accent, #338fff);
    }
    .mf-date-time-grid button:hover:not(:disabled) {
        background: var(--mf-hover, #f0f5ff);
    }
    .mf-date-time-grid [aria-selected='true'] button,
    .mf-date-time-grid [aria-selected='true'] button:hover:not(:disabled) {
        background: var(--mf-accent, #338fff);
        color: #fff;
    }
    .mf-date-time-grid button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
    .mf-date-time-grid button:focus-visible {
        outline: 2px solid var(--mf-focus, #87bbff);
        outline-offset: 1px;
    }
    .mf-date-time-inputs {
        display: grid;
        gap: 6px;
    }
    .mf-date-time-draft {
        display: grid;
        gap: 8px;
    }
    .mf-date-time-clock {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        gap: 4px;
        align-items: end;
    }
    .mf-date-time-clock > span {
        padding-bottom: 8px;
    }
    .mf-date-time-validation {
        margin: 0;
        line-height: 1.5;
        overflow-wrap: anywhere;
    }
    .mf-date-time-bound {
        margin: 0;
        font-size: 11px;
        line-height: 1.5;
        overflow-wrap: anywhere;
    }
    .mf-date-time-footer {
        flex: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 12px;
        border-top: 1px solid var(--mf-line);
        background: var(--mf-bg, #fff);
    }
    .mf-date-time-footer > div {
        display: flex;
        gap: 6px;
    }
    .mf-date-time-footer .mf-button[data-size='small'] {
        min-height: 28px;
        height: 28px;
        padding: 0 8px;
        font-size: 13px;
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-date-time-popover,
        .mf-date-time-popover * {
            transition: none !important;
            animation: none !important;
        }
    }
`)()
