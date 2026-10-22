import { html } from 'lit'
import { HostPanel, NodeFlowController } from '@mofang/lit-host'
import { panelStyles, productSummary, sectionHeading, statusNote } from '@mofang/lit-ui'
import type { Product } from '@mofang/contracts/business'
export default class BusinessPanel extends HostPanel {
  static override styles = panelStyles
  private readonly flow = new NodeFlowController(this, () => ({
    sdk: this.sdk,
    target: this.target,
  }))
  override render() {
    const resource = this.flow.state
    const page = resource?.data?.nodeOutput ?? this.nodeOutput
    const values =
      page?.items.flatMap((candidate) =>
        Array.isArray(candidate.value.items) ? candidate.value.items : [],
      ) ?? []
    const status = resource?.data?.status ?? 'waiting'
    if (resource?.error) return statusNote('读取失败', resource.error.message, 'error')
    if (resource?.loading && !resource.data) return statusNote('正在读取', '等待宿主提供节点数据。')
    return html`${sectionHeading('候选商品', '候选与已流转输出分别保留；本示例只展示。')}
    ${statusNote('当前状态', status)}
    ${values.length
      ? values.map((value) => productSummary(value as Product))
      : statusNote('暂无商品', '当前没有可展示的候选。')}`
  }
}
