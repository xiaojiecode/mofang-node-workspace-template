import { html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { dataTable } from '../components/table'
import { button } from '../components/controls'
import { dialog } from '../components/dialog'
import { emptyState } from '../components/content'
import {
    reportActionCard,
    reportMetricCard,
    reportMoney,
    reportNumber,
    reportOpportunityMatrix,
    reportPercent,
    reportScore,
    reportSourceBadge,
} from './parts'
import { reportTrend } from './chart'
import { reportCategoryTable } from './category-table'
import type { ReportCategory, SelectionReportProps } from './types'

function section(title: string, description: string, content: TemplateResult) {
    return html`<section class="mf-report-section" aria-label=${title}>
        <header>
            <h3>${title}</h3>
            <p>${description}</p>
        </header>
        ${content}
    </section>`
}

/** 组合报告保持受控选择与弹窗口径；不生成报告、保存结果或执行后续业务。 */
export function selectionReport(p: SelectionReportProps) {
    const data = p.data
    const vocabulary = data.vocabulary
    const labels = vocabulary?.metrics
    const performance = vocabulary?.performance
    const supply = vocabulary?.supply
    const current = data.categories.find((category) => category.id === p.selectedId)
    const source = data.platformSource
    const sourceList = html`<div class="mf-report-sources">
        ${data.sources?.map(reportSourceBadge) ?? nothing}
    </div>`
    const methods = data.methods ?? []
    const metric = (
        label: string,
        value?: string | number,
        unit?: string,
        description?: string,
        note?: string,
    ) => reportMetricCard({ label, value, unit, description, note, source })
    const concentration = (category: ReportCategory) => [
        {
            label: supply?.productConcentration?.label ?? 'Top 5 商品集中度',
            value: category.productConcentration,
            note: supply?.productConcentration?.note ?? 'Top 5 商品销量 ÷ 榜单样本销量',
        },
        {
            label: supply?.shopConcentration?.label ?? 'Top 5 店铺集中度',
            value: category.shopConcentration,
            note: supply?.shopConcentration?.note ?? 'Top 5 店铺销量 ÷ 榜单样本销量',
        },
        {
            label: supply?.promotionOverlap?.label ?? '销量 × 热推榜重合',
            value: category.promotionOverlap,
            note: supply?.promotionOverlap?.note ?? '两榜重合商品 ÷ 销量榜商品',
        },
        {
            label: supply?.newProductOverlap?.label ?? '销量 × 新品榜重合',
            value: category.newProductOverlap,
            note: supply?.promotionOverlap?.note ?? '两榜重合商品 ÷ 销量榜商品',
        },
    ]
    return html`<article class="mf-selection-report" aria-label=${data.title}>
        <header class="mf-report-header">
            <div>
                <div class="mf-report-title">
                    <h2>${data.title}</h2>
                    ${methods.length
                        ? button({
                              label: '查看计算口径',
                              onClick: () => p.onMethodOpenChange(true),
                          })
                        : nothing}
                </div>
                ${data.description ? html`<p>${data.description}</p>` : nothing}
            </div>
            ${p.onViewList ? button({ label: '查看选品列表', onClick: p.onViewList }) : nothing}
        </header>
        ${data.sampleLabel
            ? html`<div class="mf-report-sample" role="note">${data.sampleLabel}</div>`
            : nothing}
        <div class="mf-report-context">
            ${data.context.map((item) => html`<span>${item.label}<b>${item.value}</b></span>`)}
        </div>
        ${data.categories.length === 0
            ? emptyState('暂无选品报告', '报告数据就绪后将在此展示类目分析。')
            : html`
                  ${current
                      ? html`<section class="mf-report-hero" aria-label="子类目推荐">
                            <div class="mf-report-hero-main">
                                <span class="mf-report-kicker">01 · 子类目推荐</span
                                >${data.categoryPath
                                    ? html`<p class="mf-report-path">${data.categoryPath}</p>`
                                    : nothing}
                                <h3>${current.name}</h3>
                                ${current.summary
                                    ? html`<p>${current.summary}</p>`
                                    : html`<p class="mf-report-missing">暂无推荐说明</p>`}
                                <div class="mf-report-hero-facts">
                                    <span
                                        >${labels?.units ?? '销量榜样本'}
                                        <b>${reportNumber(current.units)} 件</b></span
                                    ><span
                                        >${labels?.promoters ?? '热推达人累计'}
                                        <b>${reportNumber(current.promoters)}</b></span
                                    ><span
                                        >${labels?.searchMomentum ?? '搜索动量'}
                                        <b>${reportPercent(current.searchMomentum, true)}</b></span
                                    >
                                </div>
                                <p class="mf-report-caption">
                                    同级参照：${data.categories.length} 个候选类目。
                                </p>
                            </div>
                            <aside>
                                ${reportScore({
                                    label: '综合机会分',
                                    value: current.opportunityScore,
                                    description: data.scoreDescription,
                                })}
                                <div class="mf-report-score-sources">
                                    <span>平台 <b>${reportNumber(current.platformScore)}</b></span
                                    ><span>搜索 <b>${reportNumber(current.searchScore)}</b></span>
                                </div>
                                ${sourceList}
                            </aside>
                        </section>`
                      : html`<div class="mf-report-missing-selection">
                            请选择下方类目查看完整分析。
                        </div>`}
                  ${section(
                      '子类目表现对比',
                      data.categoryPath ?? '同级候选类目',
                      reportCategoryTable({
                          categories: data.categories,
                          selectedId: p.selectedId,
                          sortKey: p.sortKey,
                          onSortChange: p.onSortChange,
                          onSelect: p.onSelect,
                          caption: data.comparisonCaption,
                          labels,
                      }),
                  )}
                  ${current
                      ? html`
                            ${section(
                                performance?.title ?? '三榜表现',
                                performance?.description ?? '成交、内容扩散、新品冷启动分别观察',
                                html`<div class="mf-report-grid mf-report-grid-three">
                                    ${metric(
                                        performance?.sales?.label ?? '销量榜',
                                        current.units,
                                        performance?.sales?.unit ?? '件',
                                        performance?.sales?.description ??
                                            '近一期榜单 Top-K 商品成交',
                                        performance?.sales?.note ??
                                            `${labels?.gmv ?? '样本 GMV'} ${reportMoney(current.gmv, current.currencyCode)} · ${labels?.growth ?? '商品增长率'} ${reportPercent(current.growth, true)}`,
                                    )}${metric(
                                        performance?.promotion?.label ?? '热推榜',
                                        current.promoters,
                                        performance?.promotion?.unit ?? '达人累计计数',
                                        performance?.promotion?.description ??
                                            '当前被达人推广的商品',
                                        performance?.promotion?.note ??
                                            `销量榜重合 ${reportPercent(current.promotionOverlap)}`,
                                    )}${metric(
                                        performance?.newProducts?.label ?? '新品榜',
                                        current.newUnits,
                                        performance?.newProducts?.unit ?? '件 / 3 日',
                                        performance?.newProducts?.description ??
                                            '上架后第 3 天榜单样本',
                                        performance?.newProducts?.note ?? '榜单样本口径 · 3 日累计',
                                    )}
                                </div>`,
                            )}
                            ${section(
                                '需求情况',
                                vocabulary?.demandDescription ?? '平台推广与站外搜索并列展示',
                                current.demand?.length
                                    ? html`<div class="mf-report-grid mf-report-grid-two">
                                          ${current.demand.map(reportTrend)}
                                      </div>`
                                    : html`<div class="mf-report-missing-panel">
                                          暂无需求趋势数据
                                      </div>`,
                            )}
                            ${section(
                                '类目机会分析',
                                '分开展示平台表现与搜索需求',
                                html`<div class="mf-report-grid mf-report-grid-two">
                                    <section class="mf-report-dual-score" aria-label="双源机会判断">
                                        <h4>双源机会判断</h4>
                                        <p>平台分与搜索分分别呈现，计算口径由报告提供。</p>
                                        <div class="mf-report-grid mf-report-grid-two">
                                            ${reportScore({
                                                label: '平台机会分',
                                                value: current.platformScore,
                                                source: data.platformSource,
                                            })}${reportScore({
                                                label: '搜索需求分',
                                                value: current.searchScore,
                                                source: data.searchSource,
                                            })}
                                        </div>
                                        ${data.scoreDescription
                                            ? html`<p>${data.scoreDescription}</p>`
                                            : nothing}
                                    </section>
                                    ${data.matrixThresholds
                                        ? reportOpportunityMatrix({
                                              title: '机会矩阵',
                                              x: {
                                                  label: '成交',
                                                  value: current.platformScore,
                                                  threshold: data.matrixThresholds.platform,
                                              },
                                              y: {
                                                  label: '搜索',
                                                  value: current.searchScore,
                                                  threshold: data.matrixThresholds.search,
                                              },
                                              description: '站内成交与站外搜索的交叉观察',
                                              conclusion: current.conclusion,
                                          })
                                        : html`<div class="mf-report-missing-panel">
                                              未提供矩阵阈值，暂不判断强弱象限。
                                          </div>`}
                                </div>`,
                            )}
                            ${section(
                                '竞争与供给结构',
                                supply?.description ?? '以下为对应榜单样本口径',
                                html`<div class="mf-report-grid mf-report-grid-four">
                                    ${concentration(current).map((item) =>
                                        metric(
                                            item.label,
                                            reportPercent(item.value),
                                            undefined,
                                            undefined,
                                            item.note,
                                        ),
                                    )}
                                </div>`,
                            )}
                            ${section(
                                '代表商品',
                                '用于理解切入方向，需继续通过商品筛选与货源核验',
                                html`<div class="mf-report-product-table">
                                    ${dataTable(
                                        current.products ?? [],
                                        (product) => product.id,
                                        [
                                            {
                                                title: '代表商品',
                                                cell: (product) =>
                                                    html`<div class="mf-report-product">
                                                        ${product.imageUrl
                                                            ? html`<img
                                                                  src=${product.imageUrl}
                                                                  alt=""
                                                                  loading="lazy"
                                                              />`
                                                            : nothing}
                                                        <div>
                                                            <b>${product.name}</b
                                                            ><small
                                                                >${product.source ??
                                                                '未提供来源'}</small
                                                            >
                                                        </div>
                                                    </div>`,
                                            },
                                            {
                                                title: '价格',
                                                align: 'right',
                                                cell: (product) =>
                                                    reportMoney(
                                                        product.price,
                                                        product.currencyCode,
                                                    ),
                                            },
                                            {
                                                title: vocabulary?.products?.units ?? '样本销量',
                                                align: 'right',
                                                cell: (product) => reportNumber(product.units),
                                            },
                                            {
                                                title: vocabulary?.products?.growth ?? '商品增长率',
                                                align: 'right',
                                                cell: (product) =>
                                                    reportPercent(product.growth, true),
                                            },
                                            {
                                                title:
                                                    vocabulary?.products?.promoters ??
                                                    '热推达人累计',
                                                align: 'right',
                                                cell: (product) => reportNumber(product.promoters),
                                            },
                                        ],
                                        { label: '代表商品', empty: '暂无代表商品' },
                                    )}
                                </div>`,
                            )}
                            ${section(
                                '建议行动',
                                '从类目判断进入具体商品验证',
                                current.actions?.length
                                    ? html`<div class="mf-report-grid mf-report-grid-three">
                                          ${current.actions.map(reportActionCard)}
                                      </div>`
                                    : html`<div class="mf-report-missing-panel">暂无行动建议</div>`,
                            )}
                        `
                      : nothing}
              `}
        ${data.notes?.length
            ? html`<footer class="mf-report-notes">
                  ${data.notes.map((note) => html`<p>${note}</p>`)}
              </footer>`
            : nothing}
        ${dialog(
            { open: p.methodOpen, title: '计算口径', onClose: () => p.onMethodOpenChange(false) },
            html`<div class="mf-report-methods">
                ${methods.length
                    ? methods.map(
                          (method) =>
                              html`<section>
                                  <h4>${method.title}</h4>
                                  ${method.formula ? html`<code>${method.formula}</code>` : nothing}
                                  <p>${method.description}</p>
                              </section>`,
                      )
                    : html`<p>尚未提供计算口径。</p>`}
            </div>`,
        )}
    </article>`
}
