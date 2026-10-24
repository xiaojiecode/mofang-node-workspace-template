import { html, nothing } from 'lit'
import { live } from 'lit/directives/live.js'

export { selectField } from './select'
export type { SelectOption, SelectFieldProps } from './select'

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

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export type ButtonProps = Readonly<{
    label: string
    onClick?: (event: MouseEvent) => void
    variant?: ButtonVariant
    disabled?: boolean
    title?: string
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    size?: 'small' | 'normal' | 'panel'
    expanded?: boolean
    controls?: string
}>

/** 通用按钮；disabled 同时阻断回调，权限与业务校验由调用方决定。 */
export function button(p: ButtonProps) {
    const disabled = Boolean(p.disabled || p.loading)
    return html`<button
        class="mf-button"
        data-variant=${p.variant ?? 'secondary'}
        type=${p.type ?? 'button'}
        data-size=${p.size ?? 'normal'}
        aria-busy=${p.loading ? 'true' : nothing}
        data-loading=${Boolean(p.loading)}
        aria-expanded=${p.expanded === undefined ? nothing : String(p.expanded)}
        aria-controls=${p.controls ?? nothing}
        title=${p.title ?? ''}
        ?disabled=${disabled}
        @click=${(event: MouseEvent) => {
            if (!disabled) p.onClick?.(event)
        }}
    >
        ${p.loading
            ? html`<span class="mf-button-loading" aria-hidden="true"></span>`
            : nothing}<span class="mf-button-label">${p.label}</span>
    </button>`
}

export type CheckboxProps = Readonly<{
    label: string
    checked: boolean
    indeterminate?: boolean
    disabled?: boolean
    /** 表格中只显示方框，名称仍供辅助技术使用。 */
    labelHidden?: boolean
    title?: string
    onChange: (checked: boolean) => void
}>

/** 受控复选框，部分选中独立于 checked；禁用时不派发修改。 */
export function checkbox(p: CheckboxProps) {
    return html`<label class="mf-checkbox" title=${p.title ?? ''}>
        <input
            type="checkbox"
            aria-label=${p.label}
            .checked=${live(p.checked)}
            .indeterminate=${p.indeterminate ?? false}
            ?disabled=${p.disabled}
            @change=${(event: Event) => {
                if (!p.disabled) p.onChange((event.target as HTMLInputElement).checked)
            }}
        />
        ${p.labelHidden ? nothing : html`<span>${p.label}</span>`}
    </label>`
}
