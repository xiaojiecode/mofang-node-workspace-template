import { css, html, nothing } from 'lit'
import { live } from 'lit/directives/live.js'
import { fieldLabel } from './form'
import type { FieldProps } from './form'

export type RadioGroupProps = FieldProps &
    Readonly<{
        value: string
        options: readonly Readonly<{
            value: string
            label: string
            description?: string
            disabled?: boolean
        }>[]
        disabled?: boolean
        onChange?: (value: string) => void
    }>

/** 原生单选组保持受控值，方向键与 Tab 使用浏览器原生语义。 */
export function radioGroup(p: RadioGroupProps) {
    return html`<fieldset class="mf-radio-group" ?disabled=${p.disabled || !p.onChange}>
        <legend>${fieldLabel(p)}</legend>
        <div class="mf-radio-options">
            ${p.options.map(
                (item) =>
                    html`<label class="mf-radio"
                        ><input
                            type="radio"
                            name=${p.name}
                            value=${item.value}
                            .checked=${live(item.value === p.value)}
                            ?disabled=${item.disabled}
                            ?required=${p.required}
                            @change=${() => {
                                if (!p.disabled && !item.disabled) p.onChange?.(item.value)
                            }}
                        /><span>${item.label}</span>${item.description
                            ? html`<small class="mf-hint">${item.description}</small>`
                            : nothing}</label
                    >`,
            )}
        </div>
        ${p.error
            ? html`<span class="mf-field-error" role="alert">${p.error}</span>`
            : nothing}${p.hint ? html`<p class="mf-hint">${p.hint}</p>` : nothing}
    </fieldset>`
}

export const radioStyles = /* @__PURE__ */ (() => css`
    .mf-radio-group {
        border: 0;
        margin: 0;
        padding: 0;
        min-width: 0;
    }
    .mf-radio-group legend {
        padding: 0;
        margin-bottom: 10px;
    }
    .mf-radio-options {
        display: flex;
        flex-wrap: wrap;
        gap: 12px 22px;
    }
    .mf-radio {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        cursor: pointer;
        font-size: 14px;
    }
    .mf-radio input {
        width: 16px;
        height: 16px;
        margin: 0;
        accent-color: #168aff;
    }
    .mf-radio input:focus-visible {
        outline: 2px solid #87bbff;
        outline-offset: 3px;
    }
    .mf-radio:has(input:disabled) {
        opacity: 0.5;
        cursor: not-allowed;
    }
`)()
