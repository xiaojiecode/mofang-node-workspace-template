import { html, nothing, css } from 'lit'
import type { TemplateResult } from 'lit'

export type FieldProps = Readonly<{
    name: string
    label: string
    required?: boolean
    optional?: boolean
    hint?: string
    error?: string
    compact?: boolean
}>

/** 字段标签和必填提示；必填与可选由调用方明确声明。 */
export function fieldLabel(p: Pick<FieldProps, 'label' | 'required' | 'optional'>) {
    return html`<span class="mf-label"
        >${p.required
            ? html`<span class="mf-required" aria-hidden="true">*</span>`
            : nothing}${p.label}${p.optional && !p.required
            ? html`<span class="mf-optional">（可选）</span>`
            : nothing}</span
    >`
}

/** 表单分组只负责排布，提交、校验与草稿由宿主维护。 */
export function formGroup(
    p: { title?: string; description?: string; columns?: 1 | 2 },
    content: TemplateResult,
) {
    return html`<fieldset class="mf-form-group" data-columns=${p.columns ?? 1}>
        ${p.title ? html`<legend>${p.title}</legend>` : nothing}${p.description
            ? html`<p class="mf-hint mf-form-description">${p.description}</p>`
            : nothing}
        <div class="mf-form-grid">${content}</div>
    </fieldset>`
}

export const formStyles = /* @__PURE__ */ (() => css`
    .mf-required {
        color: #e14d4d;
        margin-right: 5px;
    }
    .mf-optional {
        font-size: 12px;
        color: var(--mf-muted);
        font-weight: 400;
    }
    .mf-form-group {
        margin: 0;
        padding: 16px;
        border: 1px solid var(--mf-line);
        border-radius: 6px;
        min-width: 0;
    }
    .mf-form-group legend {
        font-size: 15px;
        font-weight: 600;
        padding: 0 4px;
    }
    .mf-form-description {
        margin-bottom: 12px;
    }
    .mf-form-grid {
        display: grid;
        gap: 20px 24px;
    }
    .mf-form-group[data-columns='2'] .mf-form-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .mf-form-grid > .mf-field {
        margin: 0;
        max-width: none;
    }
    .mf-field[data-compact='true'] {
        max-width: none;
        gap: 6px;
    }
    .mf-field[data-compact='true'] .mf-label {
        font-size: 13px;
        font-weight: 400;
        color: #71757d;
    }
    .mf-field[data-compact='true'] .mf-input,
    .mf-field[data-compact='true'] .mf-select-trigger {
        border-radius: 3px;
        min-height: 32px;
        height: 32px;
        box-shadow: none;
        font-size: 13px;
    }
    .mf-input-wrap {
        display: flex;
        min-width: 0;
        align-items: stretch;
        position: relative;
    }
    .mf-input-wrap .mf-input {
        flex: 1;
        min-width: 0;
    }
    .mf-input-wrap:has(.mf-input-addon) .mf-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .mf-input-addon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        min-width: 32px;
        background: #fafafa;
        border: 1px solid var(--mf-input-border);
        border-left: 0;
        border-radius: 0 3px 3px 0;
        color: #555;
    }
    .mf-input-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        display: inline-flex;
        color: #8c929b;
        pointer-events: none;
    }
    .mf-input-wrap:has(.mf-input-icon) .mf-input {
        padding-right: 34px;
    }
    .mf-input-icon svg {
        width: 16px;
        height: 16px;
    }
    .mf-number-steppers {
        width: 25px;
        display: grid;
        grid-template-rows: 1fr 1fr;
        border: 1px solid var(--mf-input-border);
        border-left: 0;
        border-radius: 0 3px 3px 0;
        overflow: hidden;
    }
    .mf-number-steppers button {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0;
        padding: 0;
        background: #fafafa;
        color: #666;
        cursor: pointer;
    }
    .mf-number-steppers button + button {
        border-top: 1px solid var(--mf-line);
    }
    .mf-number-steppers button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    .mf-number-steppers svg {
        width: 11px;
        height: 9px;
    }
    .mf-input-wrap:has(.mf-number-steppers) .mf-input {
        appearance: textfield;
        border-radius: 3px 0 0 3px;
    }
    .mf-input-wrap:has(.mf-number-steppers) .mf-input::-webkit-inner-spin-button {
        appearance: none;
    }
    .mf-range {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        align-items: center;
        gap: 10px;
    }
    .mf-range > .mf-field {
        margin: 0;
    }
    .mf-range > .mf-field > .mf-label {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
    }
    .mf-range-separator {
        color: #8b8f97;
    }
`)()
