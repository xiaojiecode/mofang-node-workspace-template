import { reportDemoInputSchema } from './schema/report'
import providedReportRaw from './fixtures/selection-report.json?raw'
import { workbench } from './inspector'
import {
    reportDebugData,
    applyReportDebug,
    validateReportPartsDebug,
    validateReportDebug,
    restoreSource,
} from './report-debug'
import strollerImage from './assets/report/pet-stroller.png'
import backpackImage from './assets/report/pet-carrier-backpack.png'
import carseatImage from './assets/report/pet-carseat.png'
import { LitElement, css, html } from 'lit'
import {
    panelStyles,
    selectionReport,
    reportMetricCard,
    reportScore,
    reportTrend,
    reportOpportunityMatrix,
    reportCategoryTable,
    reportSourceBadge,
    reportActionCard,
    tiktokShopIcon,
    radioGroup,
    button,
} from '@mofang/browser'
import type {
    ReportCategory,
    ReportSortKey,
    ReportSource,
    SelectionReportData,
    ReportMetricCardProps,
    ReportScoreProps,
    ReportTrendProps,
    ReportOpportunityMatrixProps,
    ReportActionCardProps,
} from '@mofang/browser'

type ReportPartsInput = Readonly<{
    metric: ReportMetricCardProps
    score: ReportScoreProps
    trend: ReportTrendProps
    matrix: ReportOpportunityMatrixProps
    categories: readonly ReportCategory[]
    source: ReportSource
    action: ReportActionCardProps
}>
const providedReportInput = JSON.parse(providedReportRaw) as ReportPartsInput
const inputProblem = validateReportPartsDebug(providedReportInput)
if (inputProblem) throw new Error(`选品报告演示输入无效：${inputProblem}`)
const reportImages: Readonly<Record<string, string>> = {
    '/assets/report/pet-stroller.png': strollerImage,
    '/assets/report/pet-carrier-backpack.png': backpackImage,
    '/assets/report/pet-carseat.png': carseatImage,
}
/** 原始 JSON 原样保留；只把三张已存在的本地图导入映射到 Vite 实际地址。 */
function mappedCategories(categories: readonly ReportCategory[]): readonly ReportCategory[] {
    return categories.map((category) => ({
        ...category,
        products: category.products?.map((product) => ({
            ...product,
            imageUrl: product.imageUrl
                ? (reportImages[product.imageUrl] ?? product.imageUrl)
                : undefined,
        })),
    }))
}
/** 本页专用输入映射，不扩展公共报告协议，不计算或改写用户提供的指标。 */
export function mapReportFixture(input: ReportPartsInput): SelectionReportData {
    const selected =
        input.categories.find((category) => category.id === 'feeding') ?? input.categories[0]
    const searchSource = selected?.demand?.find((trend) => trend.title === '外部搜索需求')?.source
    const currencies = new Set(input.categories.map((category) => category.currencyCode))
    const currency = currencies.size === 1 ? input.categories[0]?.currencyCode : undefined
    return {
        title: '选品报告',
        description: '美国 TikTok Shop · 宠物用品 · 用户提供的选品报告演示',
        sampleLabel: '用户提供的选品报告演示 · 包含第三方估算和搜索研究指数，未在本轮独立核验。',
        context: [
            { label: '分析范围', value: '宠物用品细分类目' },
            { label: '站点', value: '美国 TikTok Shop' },
            { label: '时间', value: '2026年9月' },
        ],
        categoryPath: '宠物用品 › 细分类目对比',
        vocabulary: {
            metrics: {
                units: '报告销量',
                gmv: `月度类目成交额${currency ? `（${currency}）` : ''}`,
                growth: '报告增长率',
                promoters: '达人计数',
                newUnits: '新品销量（窗口未提供）',
                sortUnits: '报告销量',
                sortGmv: '月度成交额',
            },
            performance: {
                title: '成交与内容表现',
                description: '用户提供指标；不同字段的统计窗口分别说明',
                sales: {
                    label: '报告销量',
                    unit: '件',
                    description: '原输入提供的销量计数，统计窗口未提供',
                },
                promotion: {
                    label: '报告达人计数',
                    unit: '计数',
                    description: '统计窗口与去重方式未提供',
                    note: '按原输入计数展示，不推断达人覆盖与推广窗口。',
                },
                newProducts: {
                    label: '报告新品销量',
                    unit: '件',
                    description: '原输入未提供新品销量的统计窗口',
                    note: '窗口未提供，不推断累计天数。',
                },
            },
            supply: {
                description: '按用户输入百分值展示；集中范围、分母和重合统计口径未提供',
                productConcentration: {
                    label: '商品集中度（口径未提供）',
                    note: '按原输入百分值展示；集中范围与分母待补充。',
                },
                shopConcentration: {
                    label: '店铺集中度（口径未提供）',
                    note: '按原输入百分值展示；集中范围与分母待补充。',
                },
                promotionOverlap: {
                    label: '推广重合度（口径未提供）',
                    note: '按原输入百分值展示，重合对象和分母未提供。',
                },
                newProductOverlap: {
                    label: '新品重合度（口径未提供）',
                    note: '按原输入百分值展示，重合对象和分母未提供。',
                },
            },
            products: {
                units: '报告商品销量',
                growth: '报告商品增长率',
                promoters: '报告达人计数',
            },
            demandDescription: '平台月度类目成交额与外部搜索研究指数并列展示',
        },
        categories: mappedCategories(input.categories),
        sources: [input.source, ...(searchSource ? [searchSource] : [])],
        platformSource: input.source,
        searchSource,
        matrixThresholds: { platform: input.matrix.x.threshold, search: input.matrix.y.threshold },
        scoreDescription: input.score.description,
        comparisonCaption:
            '用户提供的演示汇总指标；销售额为第三方整理/估算，商品销量与达人数据按原输入说明另行核验。',
        methods: [
            { title: '综合机会分口径', description: input.score.description ?? '未提供评分口径。' },
            { title: '成交数据来源', description: input.source.description ?? '未提供来源说明。' },
            ...(searchSource?.description
                ? [{ title: '搜索数据来源', description: searchSource.description }]
                : []),
        ],
        notes: [
            input.source.description ?? '',
            ...(searchSource?.description ? [searchSource.description] : []),
        ],
    }
}
export const reportOverviewData = providedReportInput
export const reportDefaultCategoryId = 'feeding'
export const reportDemoData = mapReportFixture(providedReportInput)
const platform = providedReportInput.source
const google = providedReportInput.categories
    .find((category) => category.id === reportDefaultCategoryId)
    ?.demand?.find((trend) => trend.title === '外部搜索需求')?.source ?? { label: '未提供搜索来源' }
const reportDebugDefaults = providedReportInput

/** 完整报告采用受控状态展示；空值、长内容和缺失指标可直接切换验收。 */
class SelectionReportDemo extends LitElement {
    static override styles = [
        panelStyles,
        css`
            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
                min-height: 0;
            }
            .report-preview {
                display: flex;
                flex-direction: column;
                height: 100%;
                min-height: 0;
            }
            mf-demo-workbench > [slot='preview'] {
                height: 100%;
                min-height: 0;
            }
            .controls {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                align-items: center;
                padding: 12px 16px;
                background: white;
                border-bottom: 1px solid #e6eaf0;
            }
            .stage {
                flex: 1;
                min-height: 0;
            }
            .result {
                font-size: 12px;
                color: #65758c;
            }
        `,
    ]
    static override properties = {
        selectedId: { state: true },
        sortKey: { state: true },
        methodOpen: { state: true },
        mode: { state: true },
        result: { state: true },
        customData: { state: true },
    }
    declare customData: SelectionReportData | undefined
    declare selectedId: string
    declare sortKey: ReportSortKey
    declare methodOpen: boolean
    declare mode: string
    declare result: string
    constructor() {
        super()
        this.selectedId = reportDefaultCategoryId
        this.sortKey = 'score'
        this.methodOpen = false
        this.mode = 'full'
        this.result = ''
    }
    protected override render() {
        const base = this.customData ?? reportDemoData
        const data: SelectionReportData =
            this.mode === 'empty'
                ? { ...base, categories: [] }
                : this.mode === 'missing'
                  ? {
                        ...base,
                        categories: [
                            {
                                id: reportDefaultCategoryId,
                                name: '待补充指标的类目',
                                gmv: 0,
                                units: 0,
                                products: [
                                    { id: 'missing-product', name: '尚未提供价格与货币的商品' },
                                ],
                            },
                        ],
                    }
                  : this.mode === 'long'
                    ? {
                          ...base,
                          categories: base.categories.map((c) => ({
                              ...c,
                              summary: '这是一段用于验证换行、滚动与长内容的本地示例说明。'.repeat(
                                  18,
                              ),
                              actions: (c.actions ?? []).map((a) => ({
                                  ...a,
                                  description: a.description.repeat(6),
                              })),
                          })),
                      }
                    : base
        const content = html`<div class="report-preview">
            <div class="stage">
                ${selectionReport({
                    data,
                    selectedId: this.selectedId,
                    sortKey: this.sortKey,
                    methodOpen: this.methodOpen,
                    onSelect: (id) => {
                        this.selectedId = id
                    },
                    onSortChange: (sort) => {
                        this.sortKey = sort
                    },
                    onMethodOpenChange: (open) => {
                        this.methodOpen = open
                    },
                    onViewList: () => {
                        this.result = '已触发本地「查看选品列表」回调'
                    },
                })}
            </div>
        </div>`
        return workbench(
            {
                id: 'selection-report',
                title: '报告用法与输入数据',
                description:
                    '下方为用户提供的原始演示 JSON，预览将七个区块输入映射为完整报告；保留原数字、文案及来源说明。错误输入保留画面与草稿。',
                usage: `import { panelStyles, selectionReport } from '@mofang/browser'
// LitElement 使用 static styles = panelStyles
// 本页 JSON 先经 mapReportFixture(input) 映射为 data
// 公共组件接收 SelectionReportData，不自行识别外部 JSON
// selectedId、sortKey、methodOpen 是调用方响应式状态
selectionReport({
  data, selectedId, sortKey, methodOpen,
  onSelect: id => { selectedId = id },
  onSortChange: key => { sortKey = key },
  onMethodOpenChange: open => { methodOpen = open },
  onViewList: () => { /* 交接选品列表 */ },
})`,
                parameters: [
                    {
                        name: 'data.categories',
                        description:
                            '类目 id 唯一，缺失指标显示 —，零值保留。gmv / price 应提供 currencyCode。',
                    },
                    {
                        name: 'data.categories[].demand',
                        description:
                            'series:[{label,value?}] 按数值绘线；零、负、单点与缺值均可，缺值不插值。',
                    },
                    {
                        name: 'data.matrixThresholds / methods',
                        description: '显式传入象限阈值和计算口径，不内置平台公式。',
                    },
                    {
                        name: 'selectedId / sortKey / methodOpen',
                        description: '选择、排序、弹窗由调用方受控，onViewList 只交接动作。',
                    },
                ],
                schema: reportDemoInputSchema,
                data: reportDebugDefaults,
                defaultData: reportDebugDefaults,
                validate: validateReportPartsDebug,
                onApply: (value) => {
                    const next = mapReportFixture(value as ReportPartsInput)
                    this.customData = next
                    this.mode = 'full'
                    this.selectedId = next.categories.some((c) => c.id === this.selectedId)
                        ? this.selectedId
                        : (next.categories[0]?.id ?? '')
                    this.result = '已应用本地 JSON 报告'
                },
                onReset: () => {
                    this.customData = undefined
                    this.mode = 'full'
                    this.selectedId = reportDefaultCategoryId
                    this.sortKey = 'score'
                    this.methodOpen = false
                    this.result = ''
                },
            },
            content,
            html`
                <div class="controls">
                    ${radioGroup({
                        name: 'report-mode',
                        label: '报告状态',
                        value: this.mode,
                        options: [
                            { value: 'full', label: '完整示例' },
                            { value: 'missing', label: '部分缺失' },
                            { value: 'empty', label: '空报告' },
                            { value: 'long', label: '长内容' },
                        ],
                        onChange: (value) => {
                            this.mode = value
                            this.selectedId = reportDefaultCategoryId
                        },
                    })}<span class="result" role="status">${this.result}</span>
                </div>
            `,
        )
    }
}
customElements.define('mf-selection-report-demo', SelectionReportDemo)

const reportPartsDefaults = providedReportInput
const reportPartsDebugDefaults = providedReportInput

/** 各报告区块可独立复用，并与完整报告共享相同公开组件。 */
class ReportPartsDemo extends LitElement {
    static override styles = [
        panelStyles,
        css`
            :host {
                display: block;
                height: 100%;
                min-height: 0;
                overflow: hidden;
            }
            .mf-report-parts {
                padding: 20px;
                background: #f5f6f8;
                min-height: 100%;
            }
            .parts-nav {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 20px;
            }
            .part {
                scroll-margin-top: 20px;
                margin: 0 0 28px;
            }
            .part > h3 {
                margin: 0 0 12px;
                font-size: 17px;
            }
            .stage {
                padding: 18px;
                border: 1px solid #e3e8ef;
                border-radius: 12px;
                background: #fff;
            }
            .score-stage {
                max-width: 320px;
            }
            .note {
                color: #8490a2;
                font-size: 12px;
                line-height: 1.8;
                margin: 0 0 20px;
            }
            .callback {
                font-size: 12px;
                color: #6580a6;
                margin-top: 10px;
            }
        `,
    ]
    static override properties = {
        selectedId: { state: true },
        sortKey: { state: true },
        result: { state: true },
        debug: { state: true },
    }
    declare debug: ReportPartsInput
    declare selectedId: string
    declare sortKey: ReportSortKey
    declare result: string
    constructor() {
        super()
        this.debug = reportPartsDefaults
        this.selectedId = reportDefaultCategoryId
        this.sortKey = 'score'
        this.result = ''
    }
    protected override render() {
        const entries = [
            ['metric', '指标卡'],
            ['score', '评分条'],
            ['trend', '趋势图'],
            ['opportunity', '机会矩阵'],
            ['category', '类目对比表'],
            ['source', '来源标识'],
            ['action', '行动建议卡'],
        ] as const
        const content = html`<div class="mf-report-parts">
            <p class="note">
                以下均为独立公开函数，使用本地 fixture。完整报告由这些区块组合，不包含真实市场结论。
            </p>
            <nav class="parts-nav" aria-label="报告区块导航">
                ${entries.map(([id, label]) =>
                    button({
                        label,
                        onClick: () =>
                            this.renderRoot
                                .querySelector(`#${id}`)
                                ?.scrollIntoView({ block: 'start' }),
                    }),
                )}
            </nav>
            <section class="part" id="metric">
                <h3>指标卡</h3>
                <div class="mf-report-grid mf-report-grid-three">
                    ${reportMetricCard(this.debug.metric)}${reportMetricCard({
                        label: '零值指标',
                        value: 0,
                        note: '零值按事实展示',
                    })}${reportMetricCard({ label: '尚无指标', note: '缺失值不补为零' })}
                </div>
            </section>
            <section class="part" id="score">
                <h3>评分条</h3>
                <div class="stage mf-report-grid mf-report-grid-three">
                    ${reportScore(this.debug.score)}${reportScore({
                        label: '零分',
                        value: 0,
                    })}${reportScore({
                        label: '缺失评分',
                    })}
                </div>
            </section>
            <section class="part" id="trend">
                <h3>趋势图</h3>
                <div class="mf-report-grid mf-report-grid-two">
                    ${reportTrend(this.debug.trend)}${reportTrend({
                        title: '单点趋势',
                        accessibleLabel: '单点零值示例',
                        series: [{ label: '当前', value: 0 }],
                        color: '#15a38d',
                    })}${reportTrend({
                        title: '空趋势',
                        accessibleLabel: '空趋势示例',
                        series: [],
                    })}
                </div>
            </section>
            <section class="part" id="opportunity">
                <h3>机会矩阵</h3>
                <div class="mf-report-grid mf-report-grid-two">
                    ${reportOpportunityMatrix(this.debug.matrix)}${reportOpportunityMatrix({
                        title: '指标不足',
                        x: { label: '成交', threshold: 70 },
                        y: { label: '搜索', threshold: 50 },
                    })}
                </div>
            </section>
            <section class="part" id="category">
                <h3>类目对比表</h3>
                ${reportCategoryTable({
                    categories: mappedCategories(this.debug.categories),
                    labels: reportDemoData.vocabulary?.metrics,
                    selectedId: this.selectedId,
                    sortKey: this.sortKey,
                    onSelect: (id) => {
                        this.selectedId = id
                    },
                    onSortChange: (sort) => {
                        this.sortKey = sort
                    },
                })}
            </section>
            <section class="part" id="source">
                <h3>来源标识</h3>
                <div class="stage mf-report-sources">
                    ${reportSourceBadge(this.debug.source)}${reportSourceBadge(
                        google,
                    )}${reportSourceBadge({
                        label: '调用方数据源',
                        description: '图标和说明由调用方提供',
                    })}
                </div>
            </section>
            <section class="part" id="action">
                <h3>行动建议卡</h3>
                ${reportActionCard({
                    ...this.debug.action,
                    action: {
                        label: '查看示例回调',
                        onClick: () => {
                            this.result = '已收到行动建议回调'
                        },
                    },
                })}
                <p class="callback" role="status">${this.result}</p>
            </section>
        </div>`
        return workbench(
            {
                id: 'report-parts',
                title: '区块用法与输入数据',
                description:
                    '编辑七个公开区块的代表实例。零值、缺失、单点等额外边界样例保留，用于比较；所有数据仅在本地应用。',
                usage: `import { panelStyles, reportMetricCard, reportScore, reportTrend,
  reportOpportunityMatrix, reportCategoryTable, reportSourceBadge,
  reportActionCard } from '@mofang/browser'

// 在 LitElement 中设置 static styles = panelStyles
// props 为下方 JSON 各区块的输入，回调在调用方接入
reportMetricCard(input.metric)
reportScore(input.score)
reportTrend(input.trend)
reportOpportunityMatrix(input.matrix)
reportSourceBadge(input.source)
reportActionCard(input.action)
reportCategoryTable({ categories: input.categories, selectedId, sortKey,
  onSelect: id => { selectedId = id },
  onSortChange: key => { sortKey = key },
})`,
                parameters: [
                    {
                        name: 'metric / score / trend / matrix',
                        description: '独立区块的公开 props；缺值删除字段，趋势负值与零值合法。',
                    },
                    {
                        name: 'categories / source / action',
                        description:
                            '类目数组、来源标识、行动建议文案。JSON 不包含图标对象或可执行回调。',
                    },
                    {
                        name: 'selectedId / sortKey',
                        description: '表格选择和排序由本例受控；独立区块不推进任何业务。',
                    },
                ],
                schema: reportDemoInputSchema,
                data: reportPartsDebugDefaults,
                defaultData: reportPartsDebugDefaults,
                validate: validateReportPartsDebug,
                onApply: (value) => {
                    const next = value as ReportPartsInput
                    this.debug = {
                        ...next,
                        source: restoreSource(next.source),
                        metric: {
                            ...next.metric,
                            source: next.metric.source
                                ? restoreSource(next.metric.source)
                                : undefined,
                        },
                        score: {
                            ...next.score,
                            source: next.score.source
                                ? restoreSource(next.score.source)
                                : undefined,
                        },
                        trend: {
                            ...next.trend,
                            source: next.trend.source
                                ? restoreSource(next.trend.source)
                                : undefined,
                        },
                        action: {
                            ...next.action,
                            sources: next.action.sources?.map(restoreSource),
                        },
                        categories: applyReportDebug({
                            title: '本地独立区块',
                            context: [],
                            categories: next.categories,
                        }).categories,
                    }
                    this.selectedId = this.debug.categories[0]?.id ?? ''
                    this.result = '已应用独立区块 JSON'
                },
                onReset: () => {
                    this.debug = reportPartsDefaults
                    this.selectedId = reportDefaultCategoryId
                    this.sortKey = 'score'
                    this.result = ''
                },
            },
            content,
        )
    }
}
customElements.define('mf-report-parts-demo', ReportPartsDemo)
