import { html } from 'lit'
import { HostPanel } from '@mofang/lit-host'
import { panelStyles, productSummary, sectionHeading, statusNote } from '@mofang/lit-ui'
import type { Product } from '@mofang/contracts/business'
export default class BusinessPanel extends HostPanel {
  static override styles = panelStyles

  override render() {
    const resource = this.contextResource.state
    const context = resource?.data ?? this.context
    const values = Array.isArray(context?.output?.values?.items) ? context.output.values.items : []
    const status = context?.state.status ?? 'waiting'
    if (resource?.error) return statusNote('读取失败', resource.error.message, 'error')
    if (resource?.loading && !resource.data) return statusNote('正在读取', '等待宿主提供节点数据。')
    return html`${sectionHeading('执行结果', '显示宿主提供的正式输出，不改变执行状态。')}
    ${statusNote('当前状态', status)}
    ${values.length
      ? values.map((value) => productSummary(value as Product))
      : statusNote('暂无商品', '当前没有可展示的正式输出。')}`
  }
}
