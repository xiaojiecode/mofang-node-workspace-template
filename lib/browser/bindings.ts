import { html, nothing } from 'lit'
import type { SettingsPanelEditor } from '@mofang/contracts/browser'
import { selectField } from './ui/components/select'
import { statusNote } from './ui/components/status'

/** 在设置正文内展示尚未自定义的宿主受控输入绑定。 */
export function inputBindings(
    settings: SettingsPanelEditor | undefined,
    exclude: readonly string[] = [],
) {
    const bindings = settings?.inputBindings
    const messages = settings?.messages ?? []
    if (!bindings && !messages.length) return nothing
    return html`${messages.map((item) =>
        statusNote(
            item.kind === 'error' ? '配置错误' : '配置状态',
            item.message,
            item.kind === 'error' ? 'error' : 'info',
        ),
    )}${Object.entries(bindings?.fields ?? {})
        .filter(([name]) => !exclude.includes(name))
        .map(([name, field]) =>
            selectField({
                name: `binding-${name}`,
                label: field.label,
                value: field.selectedId ?? '',
                options: [
                    { value: '', label: '不绑定' },
                    ...field.options.map((option) => ({
                        value: option.id,
                        label: `${option.nodeName} / ${option.fieldName}（${option.typeName}）`,
                    })),
                ],
                readOnly: Boolean(settings?.readOnly) || field.readOnly || !bindings?.onChange,
                onChange: (value) => bindings?.onChange?.(name, value || null),
            }),
        )}`
}
