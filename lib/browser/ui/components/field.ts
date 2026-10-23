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
}>
/** Controlled field: the host owns the draft; no second copy or delayed flush. */
export function textField(p: TextFieldProps) {
    return html`<label class="mf-field"
        ><span class="mf-label">${p.label}</span>
        <input
            class="mf-input"
            name=${p.name}
            placeholder=${p.placeholder ?? ''}
            maxlength=${p.maxLength ?? nothing}
            .value=${live(p.value)}
            ?disabled=${p.readOnly || !p.onChange}
            @input=${(event: Event) => {
                if (!p.readOnly) p.onChange?.((event.currentTarget as HTMLInputElement).value)
            }}
        />
        ${p.hint ? html`<span class="mf-hint">${p.hint}</span>` : nothing}</label
    >`
}
