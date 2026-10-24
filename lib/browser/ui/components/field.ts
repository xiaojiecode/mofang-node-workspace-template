import { html, nothing } from 'lit'
import { live } from 'lit/directives/live.js'
export type TextFieldProps = Readonly<{
    name: string
    label: string
    value: string
    placeholder?: string
    /** 前端输入提示；后台仍按冻结 Schema 校验长度。 */
    maxLength?: number
    hint?: string
    readOnly?: boolean
    onChange?: (value: string) => void
    error?: string
    ariaLabel?: string
}>
/** 受控文本输入；宿主持有草稿，组件即时回写，不保留第二份配置。 */
export function textField(p: TextFieldProps) {
    const id = `mf-field-${encodeURIComponent(p.name)}`
    return html`<label class="mf-field"
        ><span class="mf-label">${p.label}</span>
        <input
            class="mf-input"
            name=${p.name}
            aria-label=${p.ariaLabel ?? nothing}
            aria-invalid=${p.error ? 'true' : nothing}
            aria-describedby=${[p.hint ? `${id}-hint` : '', p.error ? `${id}-error` : '']
                .filter(Boolean)
                .join(' ') || nothing}
            placeholder=${p.placeholder ?? ''}
            maxlength=${p.maxLength ?? nothing}
            .value=${live(p.value)}
            ?disabled=${p.readOnly || !p.onChange}
            @input=${(event: Event) => {
                if (!p.readOnly) p.onChange?.((event.currentTarget as HTMLInputElement).value)
            }}
        />
        ${p.error
            ? html`<span id=${`${id}-error`} class="mf-field-error" role="alert">${p.error}</span>`
            : nothing}
        ${p.hint ? html`<span id=${`${id}-hint`} class="mf-hint">${p.hint}</span>` : nothing}</label
    >`
}

export type TextareaProps = TextFieldProps & Readonly<{ rows?: number }>

/** 受控多行输入，保留调用方草稿与即时回写，不建立第二份状态。 */
export function textarea(p: TextareaProps) {
    const id = `mf-field-${encodeURIComponent(p.name)}`
    return html`<label class="mf-field"
        ><span class="mf-label">${p.label}</span>
        <textarea
            class="mf-input"
            name=${p.name}
            rows=${p.rows ?? 4}
            aria-label=${p.ariaLabel ?? nothing}
            aria-invalid=${p.error ? 'true' : nothing}
            aria-describedby=${[p.hint ? `${id}-hint` : '', p.error ? `${id}-error` : '']
                .filter(Boolean)
                .join(' ') || nothing}
            placeholder=${p.placeholder ?? ''}
            maxlength=${p.maxLength ?? nothing}
            .value=${live(p.value)}
            ?disabled=${p.readOnly || !p.onChange}
            @input=${(event: Event) => {
                if (!p.readOnly) p.onChange?.((event.target as HTMLTextAreaElement).value)
            }}
        ></textarea>
        ${p.error
            ? html`<span id=${`${id}-error`} class="mf-field-error" role="alert">${p.error}</span>`
            : nothing}
        ${p.hint ? html`<span id=${`${id}-hint`} class="mf-hint">${p.hint}</span>` : nothing}</label
    >`
}
