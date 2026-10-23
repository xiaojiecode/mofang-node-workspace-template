import { html } from 'lit'
import type { Product } from '@mofang/contracts/business'
import {
    HostPanel,
    NodeFlowController,
    panelStyles,
    sectionHeading,
    statusNote,
    productSummary,
} from '@mofang/browser'
// noinspection JSUnusedGlobalSymbols
export default class BusinessPanel extends HostPanel {
    static override styles = panelStyles
    private readonly flow = new NodeFlowController(this, () => ({
        sdk: this.sdk,
        target: this.target,
    }))
    /** 读取宿主真实节点资源；渲染和订阅均不执行后台程序。 */
    override render() {
        const resource = this.flow.state
        const node = resource?.data
        if (resource?.error) return statusNote('读取失败', resource.error.message, 'error')
        if (!node)
            return statusNote('等待节点数据', '预览使用明确标注的 fixture，正式页面等待宿主数据。')
        const projection = node.composition.projection
        if (projection.status !== 'ready')
            return html`${statusNote('平台状态', node.status)}${statusNote(
                '业务投影不可用',
                projection.message,
                'error',
            )}`
        const items = node.nodeOutput.items.flatMap((candidate) =>
            Array.isArray(candidate.value.items) ? candidate.value.items : [],
        )
        return html`${sectionHeading(
                '节点业务',
                '生产结束后，候选仍需按运行模式处理。',
            )}${statusNote('平台状态', node.status)}
            <pre>${JSON.stringify(projection.nodeView, null, 2)}</pre>
            ${items.length
                ? items.map((item) => productSummary(item as Product))
                : statusNote('暂无商品', '尚无候选商品；按页面提示完成必要动作。')}`
    }
}
