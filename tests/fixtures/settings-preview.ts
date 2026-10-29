import { html } from 'lit'
import { HostPanel } from '@mofang/browser'
import { panelStyles, textField, sectionHeading, statusNote } from '@mofang/browser'
// noinspection JSUnusedGlobalSymbols
export default class SettingsPreviewFixture extends HostPanel {
    static override styles = panelStyles
    /**
     * 由 Lit 在宿主属性或订阅状态变化后调用，仅负责生成视图。
     * 读取宿主注入的数据，显式展示加载、空态和错误；不要在 render 中写配置、提交动作或触发后台业务。
     */
    override render() {
        const editor = this.settings
        const noteDisabled =
            !editor ||
            editor.readOnly ||
            editor.disabledFields?.includes('note') ||
            !editor.onFieldChange
        return html`${sectionHeading('节点设置', '修改立即写入宿主草稿，由工作流统一保存。')}
        ${textField({
            name: 'note',
            label: '备注',
            value: typeof editor?.values.note === 'string' ? editor.values.note : '',
            readOnly: noteDisabled,
            onChange: (value) => {
                if (!noteDisabled) editor?.onFieldChange?.('note', value)
            },
            hint: '仅用于验证宿主受控草稿，不随节点骨架生成。',
        })}
        ${statusNote(
            editor?.readOnly ? '只读模式' : '统一草稿',
            editor?.readOnly ? '当前上下文不能修改设置。' : '本面板不会单独提交配置。',
        )}`
    }
}
