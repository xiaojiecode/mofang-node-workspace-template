import { html } from 'lit'
import { HostPanel, panelStyles, sectionHeading, statusNote } from '@mofang/browser'

// noinspection JSUnusedGlobalSymbols
export default class SettingsPanel extends HostPanel {
    static override styles = panelStyles

    /** 设置面板只提供宿主接线位置；业务字段由节点作者按契约补充。 */
    override render() {
        return html`${sectionHeading(
            '节点设置',
            '这是空白骨架，请按业务需求增加受控设置字段。',
        )}${statusNote('待实现', '当前节点没有业务配置。')}`
    }
}
