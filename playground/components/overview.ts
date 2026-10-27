import { html } from 'lit'
import type { TemplateResult } from 'lit'
import { reportOverviewData, reportDefaultCategoryId, reportDemoData } from './report'
import {
    card,
    formGroup,
    textField,
    numberField,
    fieldLabel,
    selectField,
    cascaderField,
    rangeField,
    radioGroup,
    switchField,
    capabilityCard,
    flow,
    footer,
    button,
    tabs,
    progressBar,
    nodePlaceholder,
    placeholder,
    nodeStatus,
    warningCard,
    executionAccordion,
    timeline,
    cockpit,
    activityIcon,
    uiIcon,
    currencyIcon,
    platformIcon,
    platformLinks,
    platforms,
    dataTable,
    badge,
    text,
    image,
    reportMetricCard,
    reportScore,
    reportTrend,
    reportOpportunityMatrix,
    reportCategoryTable,
    reportSourceBadge,
    reportActionCard,
} from '@mofang/browser'

const noop = () => {}
const rows = [
    { id: '1', name: '保湿精华液', price: '$18.90', sales: '1,286' },
    { id: '2', name: '随行保温杯', price: '$12.50', sales: '946' },
]
const table = () =>
    dataTable(rows, (row) => row.id, [
        { title: '商品', cell: (row) => row.name },
        { title: '价格', cell: (row) => row.price },
        { title: '7日销量', cell: (row) => row.sales },
    ])
const field = () =>
    textField({
        name: 'overview-keywords',
        label: '关键词',
        value: '保湿修护',
        suffixIcon: uiIcon('search'),
        onChange: noop,
    })
const metrics = () => reportMetricCard(reportOverviewData.metric)
const trend = () => reportTrend(reportOverviewData.trend)
const tableCategories = () =>
    reportCategoryTable({
        categories: reportOverviewData.categories.slice(0, 2),
        labels: reportDemoData.vocabulary?.metrics,
        sortKey: 'score',
        selectedId: reportDefaultCategoryId,
        onSortChange: noop,
        onSelect: noop,
    })
const dialogBody = (title: string, body: TemplateResult) =>
    html`<div class="overview-dialog">
        <h3>${title}</h3>
        <div class="overview-dialog-body">${body}</div>
        ${footer({
            actions: html`${button({ label: '取消', onClick: noop })}${button({
                label: '确认',
                variant: 'accent',
                onClick: noop,
            })}`,
        })}
    </div>`

/** 总览复用实际模板函数，只放一组代表状态，交互由卡片直链统一接管。 */
export function overviewPreview(id: string): TemplateResult {
    switch (id) {
        case 'combined':
            return card(
                { title: '选品调研', selected: true, description: '锁定适合当前市场的商品' },
                html`${field()}${progressBar({ label: '设置进度', value: 80 })}`,
            )
        case 'runtime':
            return html`${progressBar({ label: '选品调研', value: 68 })}${timeline({
                label: '运行进度',
                items: [
                    { id: 'complete', title: '已确定调研范围', tone: 'complete' },
                    { id: 'current', title: '筛选候选商品', tone: 'active', current: true },
                ],
                running: false,
            })}`
        case 'products':
        case 'table':
            return table()
        case 'report':
        case 'report-metric':
            return html`${metrics()}${reportScore(reportOverviewData.score)}`
        case 'report-parts':
        case 'report-trend':
            return trend()
        case 'report-schema':
            return card(
                { title: 'SelectionReportData', description: 'Draft-07 · 纯 JSON 数据结构' },
                html`<div class="overview-stack">
                    <code>title · context · categories</code
                    ><span class="mf-hint">字段类型 · 必填项 · 完整示例</span>
                </div>`,
            )
        case 'report-score':
            return reportScore(reportOverviewData.score)
        case 'report-opportunity':
            return reportOpportunityMatrix(reportOverviewData.matrix)
        case 'report-category':
            return tableCategories()
        case 'report-source':
            return html`<div class="overview-stack">
                ${reportSourceBadge(reportOverviewData.source)}
            </div>`
        case 'report-action':
            return reportActionCard(reportOverviewData.action)
        case 'publish-shop':
            return dialogBody(
                '选择发布店铺',
                html`${card(
                    {
                        title: 'Glow Beauty US',
                        selected: true,
                        description: 'TikTok Shop · 美国站',
                    },
                    html`${badge('已选择')}`,
                )}`,
            )
        case 'card':
            return card(
                {
                    title: '选品调研',
                    description: '明确市场范围，发现机会商品',
                    icon: uiIcon('search'),
                    selected: true,
                },
                html`${badge('当前步骤')}
                    <p>依据平台与地区配置调研范围。</p>`,
            )
        case 'dialog':
            return dialogBody(
                '确认调研范围',
                html`<p>将依据当前平台、站点和关键词筛选候选商品。</p>`,
            )
        case 'tabs':
            return tabs({
                id: 'overview-tabs',
                label: '结果内容',
                value: 'products',
                onChange: noop,
                items: [
                    { value: 'products', label: '商品列表', content: html`${table()}` },
                    { value: 'report', label: '调研报告', content: html`` },
                ],
            })
        case 'flow':
            return flow(
                { wrap: true, gap: 10 },
                html`${['平台选择', '类目筛选', '调研参数', '能力配置', '执行结果'].map((label) =>
                    badge(label),
                )}`,
            )
        case 'footer':
            return html`<div class="overview-footer-spacer">已完成设置，等待确认</div>
                ${footer({
                    leading: html`<span class="mf-hint">本地草稿</span>`,
                    actions: button({ label: '保存配置', variant: 'accent', onClick: noop }),
                })}`
        case 'form':
            return formGroup({ title: '调研设置' }, html`${field()}`)
        case 'input':
            return html`${field()}${numberField({
                name: 'overview-number',
                label: '商品数量',
                value: 30,
                min: 1,
                max: 100,
                onChange: noop,
                compact: true,
            })}`
        case 'required':
            return html`<div class="overview-stack">
                ${fieldLabel({ label: '平台', required: true })}${fieldLabel({
                    label: '补充说明',
                    optional: true,
                })}
            </div>`
        case 'select':
            return selectField({
                name: 'overview-platform',
                label: '平台',
                value: 'tiktok',
                options: [
                    { value: 'tiktok', label: 'TikTok Shop' },
                    { value: 'amazon', label: 'Amazon' },
                ],
                onChange: noop,
            })
        case 'cascader':
            return cascaderField({
                name: 'overview-category',
                label: '类目',
                value: ['beauty', 'skin'],
                options: [
                    {
                        value: 'beauty',
                        label: '美妆个护',
                        children: [{ value: 'skin', label: '护肤' }],
                    },
                ],
                onChange: noop,
            })
        case 'range':
            return rangeField({
                name: 'overview-range',
                label: '价格区间',
                value: { min: 10, max: 80 },
                suffixText: '$',
                onChange: noop,
            })
        case 'radio':
            return radioGroup({
                name: 'overview-radio',
                label: '排序方式',
                value: 'sales',
                options: [
                    { value: 'sales', label: '销量优先' },
                    { value: 'growth', label: '增速优先' },
                ],
                onChange: noop,
            })
        case 'switch':
            return html`<div class="overview-stack">
                ${switchField({ label: '自动筛选', checked: true, onChange: noop })}${switchField({
                    label: '保留候选',
                    checked: false,
                    onChange: noop,
                })}
            </div>`
        case 'capability':
            return capabilityCard({
                title: '数据筛选',
                description: '过滤低销量与低评分商品',
                enabled: true,
                onToggle: noop,
                onConfigure: noop,
            })
        case 'capability-panel':
            return dialogBody(
                '数据筛选配置',
                rangeField({
                    name: 'overview-capability-range',
                    label: '价格范围',
                    value: { min: 10, max: 80 },
                    onChange: noop,
                }),
            )
        case 'progress':
            return progressBar({ label: '正在调研候选商品', value: 68 })
        case 'placeholder':
            return nodePlaceholder({ title: '选品调研中', animate: false })
        case 'placeholders':
            return placeholder({
                title: '还没有候选商品',
                description: '完成调研设置后，可在这里查看结果。',
                icon: uiIcon('search'),
                actions: button({ label: '开始调研', variant: 'accent', onClick: noop }),
            })
        case 'node-status':
            return nodeStatus({
                title: '配置已就绪',
                description: '可继续执行选品调研',
                tone: 'success',
                action: { label: '查看配置', onClick: noop },
            })
        case 'warning':
            return warningCard({
                title: '运行已暂停',
                description: '核对当前参数后可继续执行。',
                actions: button({ label: '重新配置', onClick: noop }),
            })
        case 'accordion':
        case 'states':
            return executionAccordion({
                id: `overview-${id}`,
                title: '筛选候选商品',
                tag: '执行',
                open: true,
                onOpenChange: noop,
                rows: [
                    { id: '1', tag: '分析', text: '已确定市场与类目范围', tone: 'reason' },
                    { id: '2', tag: '工具', text: '获取商品数据并核对价格', tone: 'tool' },
                ],
            })
        case 'timeline':
            return timeline({
                label: '选品流程',
                running: false,
                items: [
                    {
                        id: '1',
                        title: '调研范围已确认',
                        description: 'TikTok Shop · 美国站',
                        tone: 'complete',
                    },
                    {
                        id: '2',
                        title: '正在筛选商品',
                        description: '结合销量与增长趋势',
                        tone: 'active',
                        current: true,
                    },
                ],
            })
        case 'cockpit':
            return html`<div class="overview-cockpit">
                ${cockpit({
                    id: 'overview-cockpit',
                    collapsed: false,
                    onCollapsedChange: noop,
                    nodes: [
                        {
                            id: 'research',
                            title: '选品调研',
                            status: '运行中',
                            controlLabel: '查看调研进度',
                        },
                    ],
                })}
            </div>`
        case 'svg':
            return html`<div class="overview-icons">
                ${activityIcon({ kind: 'loading', running: false })}${activityIcon({
                    kind: 'execute',
                    running: false,
                })}${activityIcon({ kind: 'activity', running: true })}${activityIcon({
                    kind: 'sparkle',
                    running: false,
                })}
            </div>`
        case 'icons':
            return html`<div class="overview-icons">
                ${uiIcon('search')}${uiIcon('search')}${currencyIcon('USD')}${currencyIcon(
                    'EUR',
                )}${platformIcon('tiktok_shop')}${platformIcon('amazon')}
            </div>`
        case 'platforms':
            return platformLinks({
                label: '支持平台',
                items: platforms
                    .slice(0, 4)
                    .map((p) => ({ id: p.id, label: p.name, icon: platformIcon(p.id) })),
            })
        case 'catalog':
            return html`<div class="overview-stack">
                ${platformIcon('tiktok_shop')}<strong>TikTok Shop</strong
                ><span>美国站 · ${currencyIcon('USD')} 美元 USD</span>
            </div>`
        case 'controls':
            return html`<div class="overview-stack">
                ${button({ label: '开始调研', variant: 'accent', onClick: noop })}${button({
                    label: '查看详情',
                    onClick: noop,
                })}
            </div>`
        case 'text':
            return html`${text({ value: '调研概览', size: 'title', weight: 'medium' })}
                <div class="overview-stack">
                    ${badge('已完成')}<span class="mf-hint">数据说明与辅助文案</span>
                </div>`
        case 'images':
            return html`${image({
                alt: '商品示例',
                width: '110px',
                height: '110px',
                preview: false,
            })}`
        case 'summary':
            return card(
                { title: '保湿修护精华液', description: '美妆个护 / 护肤' },
                html`<strong>$18.90</strong>
                    <p class="mf-hint">30ml · 玻璃瓶装 · 保湿修护</p>`,
            )
        case 'transitions':
            return html`<div class="overview-transition">
                ${card(
                    { title: '内容已展开', description: '淡入与高度变化保持自然' },
                    html`${badge('平滑过渡')}`,
                )}
            </div>`
        default:
            return card({ title: '组件示例' }, html`<p>查看完整交互与边界状态</p>`)
    }
}
