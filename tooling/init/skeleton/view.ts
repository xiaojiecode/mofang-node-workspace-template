import { html } from 'lit'
import {
    HostPanel,
    NodeFlowController,
    panelStyles,
    sectionHeading,
    statusNote,
} from '@mofang/browser'

// noinspection JSUnusedGlobalSymbols
export default class BusinessPanel extends HostPanel {
    static override styles = panelStyles
    private readonly flow = new NodeFlowController(this, () => ({
        sdk: this.sdk,
        target: this.target,
    }))

    /** 业务面板只展示宿主状态；具体内容由节点作者补充。 */
    override render() {
        const resource = this.flow.state
        if (resource?.error) return statusNote('读取失败', resource.error.message, 'error')
        if (!resource?.data) return statusNote('等待节点数据', '正式页面等待宿主提供节点资源。')
        const node = resource.data
        return html`${sectionHeading(
            '节点业务',
            '这是空白骨架，请按业务输出和动作补充页面。',
        )}${statusNote('平台状态', node.status)}${statusNote(
            '业务投影',
            node.composition.projection.status === 'ready'
                ? '已接通宿主投影。'
                : node.composition.projection.message,
            node.composition.projection.status === 'ready' ? 'info' : 'error',
        )}`
    }
}
