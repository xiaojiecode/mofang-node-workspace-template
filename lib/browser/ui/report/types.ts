import type { TemplateResult } from 'lit'

export type ReportSource = Readonly<{
    label: string
    icon?: TemplateResult | undefined
    description?: string | undefined
}>
export type ReportMetricCardProps = Readonly<{
    label: string
    value?: string | number | undefined
    unit?: string | undefined
    description?: string | undefined
    note?: string | undefined
    source?: ReportSource | undefined
}>
export type ReportScoreProps = Readonly<{
    label: string
    value?: number | undefined
    max?: number | undefined
    description?: string | undefined
    source?: ReportSource | undefined
}>
export type ReportTrendPoint = Readonly<{ label: string; value?: number | undefined }>
export type ReportTrendProps = Readonly<{
    title: string
    accessibleLabel: string
    series: readonly ReportTrendPoint[]
    color?: string | undefined
    unit?: string | undefined
    summary?: string | undefined
    note?: string | undefined
    source?: ReportSource | undefined
}>
export type ReportAxis = Readonly<{ label: string; value?: number | undefined; threshold: number }>
export type ReportOpportunityMatrixProps = Readonly<{
    title: string
    x: ReportAxis
    y: ReportAxis
    description?: string | undefined
    conclusion?: string | undefined
}>
export type ReportActionCardProps = Readonly<{
    title: string
    step?: string | undefined
    description: string
    sources?: readonly ReportSource[] | undefined
    action?: Readonly<{ label: string; onClick: () => void }>
}>
export type ReportProduct = Readonly<{
    id: string
    name: string
    imageUrl?: string | undefined
    price?: number | undefined
    currencyCode?: string | undefined
    units?: number | undefined
    growth?: number | undefined
    promoters?: number | undefined
    source?: string | undefined
}>
/** 数字来自调用方的报告事实；缺失指标不能从其它计数推算。 */
export type ReportCategory = Readonly<{
    id: string
    name: string
    englishName?: string | undefined
    summary?: string | undefined
    units?: number | undefined
    gmv?: number | undefined
    currencyCode?: string | undefined
    growth?: number | undefined
    promoters?: number | undefined
    newUnits?: number | undefined
    searchMomentum?: number | undefined
    platformScore?: number | undefined
    searchScore?: number | undefined
    opportunityScore?: number | undefined
    productConcentration?: number | undefined
    shopConcentration?: number | undefined
    promotionOverlap?: number | undefined
    newProductOverlap?: number | undefined
    demand?: readonly ReportTrendProps[] | undefined
    products?: readonly ReportProduct[] | undefined
    actions?: readonly ReportActionCardProps[] | undefined
    conclusion?: string | undefined
}>
/** 增长率、搜索动量和集中度均使用百分数（38 表示 38%，不是 0.38）。 */
export type ReportSortKey = 'score' | 'units' | 'gmv'
/** 展示名称必须匹配数据窗口和统计口径；不提供时沿用原榜单样本名称。 */
export type ReportMetricLabels = Readonly<{
    units?: string
    gmv?: string
    growth?: string
    promoters?: string
    newUnits?: string
    searchMomentum?: string
    opportunityScore?: string
    sortUnits?: string
    sortGmv?: string
}>
export type ReportMetricCopy = Readonly<{
    label?: string
    description?: string
    note?: string
    unit?: string
}>
/** 不同报告仅配置展示口径，不改变数字、公式或状态推进。 */
export type ReportVocabulary = Readonly<{
    metrics?: ReportMetricLabels
    performance?: Readonly<{
        title?: string
        description?: string
        sales?: ReportMetricCopy
        promotion?: ReportMetricCopy
        newProducts?: ReportMetricCopy
    }>
    supply?: Readonly<{
        description?: string
        productConcentration?: ReportMetricCopy
        shopConcentration?: ReportMetricCopy
        promotionOverlap?: ReportMetricCopy
        newProductOverlap?: ReportMetricCopy
    }>
    products?: Readonly<{ units?: string; growth?: string; promoters?: string }>
    demandDescription?: string
}>
export type ReportCategoryTableProps = Readonly<{
    categories: readonly ReportCategory[]
    selectedId?: string | undefined
    sortKey: ReportSortKey
    onSortChange: (sort: ReportSortKey) => void
    onSelect: (categoryId: string) => void
    caption?: string | undefined
    labels?: ReportMetricLabels | undefined
}>
export type ReportMethod = Readonly<{
    title: string
    formula?: string | undefined
    description: string
}>
export type SelectionReportData = Readonly<{
    title: string
    description?: string | undefined
    vocabulary?: ReportVocabulary | undefined
    /** 示例报告必须由调用方明确标记，不允许把本地 fixture 当作市场事实。 */
    sampleLabel?: string | undefined
    context: readonly Readonly<{ label: string; value: string }>[]
    categoryPath?: string | undefined
    categories: readonly ReportCategory[]
    sources?: readonly ReportSource[] | undefined
    platformSource?: ReportSource | undefined
    searchSource?: ReportSource | undefined
    /** 阈值与口径必须随报告显式提供；组件没有内置平台评分公式。 */
    matrixThresholds?: Readonly<{ platform: number; search: number }>
    scoreDescription?: string | undefined
    comparisonCaption?: string | undefined
    methods?: readonly ReportMethod[] | undefined
    notes?: readonly string[] | undefined
}>
export type SelectionReportProps = Readonly<{
    data: SelectionReportData
    selectedId?: string | undefined
    sortKey: ReportSortKey
    methodOpen: boolean
    onSelect: (categoryId: string) => void
    onSortChange: (sort: ReportSortKey) => void
    onMethodOpenChange: (open: boolean) => void
    onViewList?: () => void | undefined
}>
