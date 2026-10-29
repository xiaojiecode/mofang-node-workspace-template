import { html, nothing } from 'lit'
import { numberField } from './controls'
import type { NumberFieldProps } from './controls'
import { fieldLabel } from './form'

export type RangeValue = Readonly<{ min?: number; max?: number }>
export type RangeFieldProps = Omit<NumberFieldProps, 'value' | 'onChange'> &
    Readonly<{
        value: RangeValue
        minReadOnly?: boolean
        maxReadOnly?: boolean
        minPlaceholder?: string
        maxPlaceholder?: string
        separator?: string
        onChange?: (value: RangeValue) => void
    }>

/** 区间不交换上下界，也不把空值变为零；跨字段错误留给调用方阻止提交。 */
export function rangeError(value: RangeValue): string | undefined {
    return value.min !== undefined && value.max !== undefined && value.min > value.max
        ? '最低值不能大于最高值，请修改区间'
        : undefined
}

/** 分别保留区间两端的宿主锁定，未声明时沿用原行为。 */
export function rangeField(p: RangeFieldProps) {
    const error = p.error ?? rangeError(p.value)
    const {
        minReadOnly: _minReadOnly,
        maxReadOnly: _maxReadOnly,
        value: _value,
        onChange: _onChange,
        hint: _hint,
        error: _error,
        required: _required,
        optional: _optional,
        ...child
    } = p
    const change = (key: 'min' | 'max', value: number | undefined) => {
        if (p.readOnly || (key === 'min' ? p.minReadOnly : p.maxReadOnly)) return
        const next = { ...p.value }
        if (value === undefined) delete next[key]
        else next[key] = value
        p.onChange?.(next)
    }
    return html`<div class="mf-field" data-compact=${p.compact ?? false}>
        ${fieldLabel(p)}
        <div class="mf-range" role="group" aria-label=${p.label}>
            ${(['min', 'max'] as const).map(
                (key, index) =>
                    html`${index
                        ? html`<span class="mf-range-separator">${p.separator ?? '至'}</span>`
                        : nothing}${numberField({
                        ...child,
                        readOnly:
                            p.readOnly ||
                            !p.onChange ||
                            (key === 'min' ? p.minReadOnly : p.maxReadOnly) === true,
                        name: `${p.name}-${key}`,
                        label: key === 'min' ? `${p.label}最低值` : `${p.label}最高值`,
                        value: p.value[key],
                        placeholder:
                            (key === 'min' ? p.minPlaceholder : p.maxPlaceholder) ??
                            (key === 'min' ? '最低值' : '最高值'),
                        onChange: (value) => change(key, value),
                        compact: true,
                    })}`,
            )}
        </div>
        ${error ? html`<span class="mf-field-error" role="alert">${error}</span>` : nothing}${p.hint
            ? html`<span class="mf-hint">${p.hint}</span>`
            : nothing}
    </div>`
}
