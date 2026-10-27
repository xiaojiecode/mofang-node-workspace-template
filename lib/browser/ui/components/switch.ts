import { css, html, nothing } from 'lit'

export type SwitchProps = Readonly<{
    label: string
    checked: boolean
    disabled?: boolean
    description?: string
    onChange?: (checked: boolean) => void
}>

/** 开关只报告用户选择，业务启停仍由调用方处理。 */
export function switchField(p: SwitchProps) {
    return html`<label class="mf-switch-label"
        ><button
            class="mf-switch"
            type="button"
            role="switch"
            aria-label=${p.label}
            aria-checked=${p.checked}
            ?disabled=${p.disabled || !p.onChange}
            @click=${() => {
                if (!p.disabled) p.onChange?.(!p.checked)
            }}
        >
            <span></span></button
        ><span>${p.label}</span>${p.description
            ? html`<small class="mf-hint">${p.description}</small>`
            : nothing}</label
    >`
}

export const switchStyles = /* @__PURE__ */ (() => css`
    .mf-switch-label {
        display: inline-flex;
        align-items: center;
        gap: 10px;
    }
    .mf-switch {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        width: 34px;
        height: 19px;
        border-radius: 10px;
        padding: 2px;
        border: 0;
        background: #b8bec7;
        cursor: pointer;
    }
    .mf-switch span {
        display: block;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #fff;
        transform: translateX(0);
        transition: transform 140ms ease-out;
    }
    .mf-switch[aria-checked='true'] {
        background: #338fff;
    }
    .mf-switch[aria-checked='true'] span {
        transform: translateX(15px);
    }
    .mf-switch:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
    .mf-switch:focus-visible {
        outline: 2px solid #87bbff;
        outline-offset: 3px;
    }
    @media (prefers-reduced-motion: reduce) {
        .mf-switch span {
            transition: none;
        }
    }
`)()
