import { css, html } from 'lit'
import {
    HostPanel,
    NodeFlowController,
    panelStyles,
    nodeCard,
    sectionHeading,
    statusNote,
} from '@mofang/browser'

// noinspection JSUnusedGlobalSymbols
export default class BusinessPanel extends HostPanel {
    static override styles = [
        panelStyles,
        css`
            :host {
                display: block;
                height: 100%;
                min-height: 0;
            }
            .node-body {
                height: 100%;
                overflow: auto;
                padding: 20px;
                box-sizing: border-box;
            }
        `,
    ]
    private readonly flow = new NodeFlowController(this, () => ({
        sdk: this.sdk,
        target: this.target,
    }))

    /** 业务面板按原型补充内容，不自动附加平台运行区。 */
    override render() {
        return nodeCard({}, html`<main class="node-body">${this.renderBusiness()}</main>`)
    }

    /** 投影不可用时显示真实错误，就绪后呈现中性骨架。 */
    private renderBusiness() {
        const resource = this.flow.state
        if (resource?.error) return statusNote('读取失败', resource.error.message, 'error')
        if (!resource?.data) return statusNote('等待节点数据', '正式页面等待宿主提供节点资源。')
        const node = resource.data
        if (node.composition.projection.status !== 'ready')
            return statusNote('业务投影不可用', node.composition.projection.message, 'error')
        return sectionHeading('节点业务', '这是空白骨架，请按原型和已确认交互补充页面。')
    }
}
