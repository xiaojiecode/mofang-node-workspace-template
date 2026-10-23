import { html, nothing } from 'lit'
import { live } from 'lit/directives/live.js'

export type SelectOption = Readonly<{ value: string; label: string }>

export type SelectFieldProps = Readonly<{
    name: string
    label: string
    value: string
    options: readonly SelectOption[]
    hint?: string
    readOnly?: boolean
    /** 选择空值时传 undefined，表示删除显式配置并回到默认值。 */
    onChange?: (value: string | undefined) => void
}>

/** 受控下拉：宿主持有草稿，选择立即回调，不另存第二份配置。 */
export function selectField(p: SelectFieldProps) {
    return html`<label class="mf-field"
        ><span class="mf-label">${p.label}</span>
        <select
            class="mf-input"
            name=${p.name}
            .value=${live(p.value)}
            ?disabled=${p.readOnly || !p.onChange}
            @change=${(event: Event) => {
                if (p.readOnly) return
                const value = (event.currentTarget as HTMLSelectElement).value
                p.onChange?.(value === '' ? undefined : value)
            }}
        >
            ${p.options.map((o) => html`<option value=${o.value}>${o.label}</option>`)}
        </select>
        ${p.hint ? html`<span class="mf-hint">${p.hint}</span>` : nothing}</label
    >`
}

export type NumberFieldProps = Readonly<{
    name: string
    label: string
    /** 显式配置值；未配置时传 undefined，用 placeholder 展示默认值，不把默认值写入输入框。 */
    value: number | undefined
    placeholder?: string
    min?: number
    max?: number
    step?: number
    integer?: boolean
    hint?: string
    readOnly?: boolean
    /** 清空时传 undefined 删除显式配置；非法输入不回调，避免静默变成 0。 */
    onChange?: (value: number | undefined) => void
}>

/**
 * 受控数字输入；越界或非数字时不写入宿主草稿，并在字段下显示错误，直到输入合法或清空。
 * 输入框只在宿主值变化时回写，因此宿主因其它字段重绘时不会抹掉用户正在输入的非法内容。
 */
export function numberField(p: NumberFieldProps) {
    return html`<label class="mf-field"
        ><span class="mf-label">${p.label}</span>
        <input
            class="mf-input"
            type="number"
            name=${p.name}
            min=${p.min ?? nothing}
            max=${p.max ?? nothing}
            step=${p.step ?? (p.integer ? 1 : 'any')}
            placeholder=${p.placeholder ?? nothing}
            .value=${p.value === undefined ? '' : String(p.value)}
            ?disabled=${p.readOnly || !p.onChange}
            @input=${(event: Event) => {
                if (p.readOnly) return
                const input = event.currentTarget as HTMLInputElement
                const error = input.parentElement?.querySelector<HTMLElement>('[data-number-error]')
                const raw = input.value.trim()
                const value = Number(raw)
                const invalid =
                    input.validity.badInput ||
                    (raw !== '' &&
                        (!Number.isFinite(value) ||
                            (p.integer && !Number.isInteger(value)) ||
                            (p.min !== undefined && value < p.min) ||
                            (p.max !== undefined && value > p.max)))
                const message = invalid
                    ? `请输入${p.integer ? '整数' : '数字'}${p.min !== undefined ? `，不小于 ${p.min}` : ''}${p.max !== undefined ? `，不大于 ${p.max}` : ''}；未修正前不会保存`
                    : ''
                input.setCustomValidity(message)
                input.setAttribute('aria-invalid', String(invalid))
                if (error) {
                    error.textContent = message
                    error.hidden = !invalid
                }
                if (invalid) return
                p.onChange?.(raw === '' ? undefined : value)
            }}
        />
        <span class="mf-hint" data-number-error data-kind="error" role="alert" hidden></span>
        ${p.hint ? html`<span class="mf-hint">${p.hint}</span>` : nothing}</label
    >`
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

export type ButtonProps = Readonly<{
    label: string
    onClick: () => void
    variant?: ButtonVariant
    disabled?: boolean
    title?: string
}>

/** 通用按钮；disabled 同时阻断回调，权限与业务校验由调用方决定。 */
export function button(p: ButtonProps) {
    const disabled = Boolean(p.disabled)
    return html`<button
        class="mf-button"
        data-variant=${p.variant ?? 'secondary'}
        type="button"
        title=${p.title ?? ''}
        ?disabled=${disabled}
        @click=${() => {
            if (!disabled) p.onClick()
        }}
    >
        ${p.label}
    </button>`
}
