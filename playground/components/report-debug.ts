import type { SelectionReportData, ReportSource, PublishShop } from '@mofang/browser'
import { tiktokShopIcon } from '@mofang/browser'

type RecordValue = Record<string, unknown>
const object = (value: unknown): value is RecordValue =>
    value !== null && typeof value === 'object' && !Array.isArray(value)
const text = (value: unknown): value is string =>
    typeof value === 'string' && value.trim().length > 0
function optionalText(value: RecordValue, names: readonly string[]) {
    for (const name of names)
        if (value[name] !== undefined && typeof value[name] !== 'string')
            return `${name} 必须为字符串。`
    return undefined
}
function numbers(value: RecordValue, names: readonly string[]) {
    for (const name of names)
        if (
            value[name] !== undefined &&
            (typeof value[name] !== 'number' || !Number.isFinite(value[name]))
        )
            return `${name} 必须为有限数字；缺失时删除字段。`
    return undefined
}
function sources(value: unknown): string | undefined {
    if (!Array.isArray(value)) return 'sources 必须为来源数组。'
    for (const source of value) {
        if (!object(source) || !text(source.label)) return '每个来源必须包含非空 label。'
        if (source.icon !== undefined)
            return 'JSON 不接受 Lit 图标对象；来源图标由预览按已知来源重建。'
        const error = optionalText(source, ['description'])
        if (error) return error
    }
    return undefined
}
function source(value: unknown) {
    return sources([value])
}
function actions(value: unknown): string | undefined {
    if (!Array.isArray(value)) return 'actions 必须为行动数组。'
    for (const action of value) {
        if (!object(action) || !text(action.title) || typeof action.description !== 'string')
            return '每个行动必须包含 title 和 description。'
        if (action.action !== undefined) return 'JSON 只编辑展示数据，不接受 action 回调。'
        const error =
            optionalText(action, ['step']) ??
            (action.sources === undefined ? undefined : sources(action.sources))
        if (error) return error
    }
    return undefined
}
/** JSON 调试边界只校验本页用到的展示事实；缺少可选指标合法，不补造结果。 */
export function validateReportDebug(value: unknown): string | undefined {
    if (!object(value) || !text(value.title)) return '报告必须为对象，并包含非空 title。'
    if (!Array.isArray(value.context)) return 'context 必须为数组。'
    for (const item of value.context)
        if (!object(item) || !text(item.label) || typeof item.value !== 'string')
            return 'context 每项必须包含 label 和 value 字符串。'
    if (!Array.isArray(value.categories)) return 'categories 必须为数组。'
    const ids = new Set<string>()
    for (const category of value.categories) {
        if (!object(category) || !text(category.id) || !text(category.name))
            return '每个类目必须包含非空 id 和 name。'
        if (ids.has(category.id)) return `类目 id 重复：${category.id}`
        ids.add(category.id)
        const error =
            numbers(category, [
                'units',
                'gmv',
                'growth',
                'promoters',
                'newUnits',
                'searchMomentum',
                'platformScore',
                'searchScore',
                'opportunityScore',
                'productConcentration',
                'shopConcentration',
                'promotionOverlap',
                'newProductOverlap',
            ]) ?? optionalText(category, ['englishName', 'summary', 'currencyCode', 'conclusion'])
        if (error) return `${category.name}：${error}`
        for (const name of [
            'platformScore',
            'searchScore',
            'opportunityScore',
            'productConcentration',
            'shopConcentration',
            'promotionOverlap',
            'newProductOverlap',
        ])
            if (typeof category[name] === 'number' && (category[name] < 0 || category[name] > 100))
                return `${category.name}：${name} 必须在 0–100 之间。`
        if (category.demand !== undefined) {
            if (!Array.isArray(category.demand)) return 'demand 必须为趋势数组。'
            for (const trend of category.demand) {
                if (
                    !object(trend) ||
                    !text(trend.title) ||
                    !text(trend.accessibleLabel) ||
                    !Array.isArray(trend.series)
                )
                    return '每个趋势必须包含 title、accessibleLabel 和 series 数组。'
                const trendError =
                    optionalText(trend, ['color', 'unit', 'summary', 'note']) ??
                    (trend.source === undefined ? undefined : source(trend.source))
                if (trendError) return trendError
                for (const point of trend.series)
                    if (
                        !object(point) ||
                        typeof point.label !== 'string' ||
                        numbers(point, ['value'])
                    )
                        return '趋势点必须有 label，value 可缺失或为有限数字。'
            }
        }
        if (category.products !== undefined) {
            if (!Array.isArray(category.products)) return 'products 必须为商品数组。'
            const productIds = new Set<string>()
            for (const product of category.products) {
                if (!object(product) || !text(product.id) || !text(product.name))
                    return '商品必须有非空 id 和 name。'
                if (productIds.has(product.id)) return `商品 id 重复：${product.id}`
                productIds.add(product.id)
                const productError =
                    numbers(product, ['price', 'units', 'growth', 'promoters']) ??
                    optionalText(product, ['imageUrl', 'currencyCode', 'source'])
                if (productError) return productError
                if (
                    typeof product.imageUrl === 'string' &&
                    (product.imageUrl.startsWith('//') ||
                        /^[a-z][a-z\d+.-]*:/i.test(product.imageUrl))
                )
                    return '图片只接受本地相对路径或绝对路径，调试不加载远程图片。'
            }
        }
        if (category.actions !== undefined) {
            const error = actions(category.actions)
            if (error) return error
        }
    }
    for (const key of ['sources'])
        if (value[key] !== undefined) {
            const error = sources(value[key])
            if (error) return error
        }
    for (const key of ['platformSource', 'searchSource'])
        if (value[key] !== undefined) {
            const error = source(value[key])
            if (error) return error
        }
    const error = optionalText(value, [
        'description',
        'sampleLabel',
        'categoryPath',
        'scoreDescription',
        'comparisonCaption',
    ])
    if (error) return error
    if (value.matrixThresholds !== undefined) {
        if (
            !object(value.matrixThresholds) ||
            typeof value.matrixThresholds.platform !== 'number' ||
            typeof value.matrixThresholds.search !== 'number' ||
            numbers(value.matrixThresholds, ['platform', 'search'])
        )
            return 'matrixThresholds 必须包含有限数字 platform 和 search。'
    }
    if (value.methods !== undefined) {
        if (!Array.isArray(value.methods)) return 'methods 必须为数组。'
        for (const method of value.methods)
            if (
                !object(method) ||
                !text(method.title) ||
                typeof method.description !== 'string' ||
                optionalText(method, ['formula'])
            )
                return '每个计算口径必须包含 title、description，formula 可选字符串。'
    }
    if (
        value.notes !== undefined &&
        (!Array.isArray(value.notes) || value.notes.some((note) => typeof note !== 'string'))
    )
        return 'notes 必须为字符串数组。'
    return undefined
}
/** 序列化副本不包含 TemplateResult，不能把 Lit 对象当作外部报告协议。 */
export function reportDebugData(data: unknown): unknown {
    return JSON.parse(
        JSON.stringify(data, (key, value: unknown) => (key === 'icon' ? undefined : value)),
    )
}
export function restoreSource(value: ReportSource): ReportSource {
    return value.label === 'TikTok Shop' ? { ...value, icon: tiktokShopIcon() } : value
}
/** 只恢复已知来源的本地图标；用户编辑数据不会执行脚本或发起业务请求。 */
export function applyReportDebug(value: unknown): SelectionReportData {
    const data = value as SelectionReportData
    return {
        ...data,
        sampleLabel: data.sampleLabel || '本地调试示例 · 非真实市场报告',
        sources: data.sources?.map(restoreSource),
        platformSource: data.platformSource ? restoreSource(data.platformSource) : undefined,
        searchSource: data.searchSource ? restoreSource(data.searchSource) : undefined,
        categories: data.categories.map((category) => ({
            ...category,
            demand: category.demand?.map((trend) => ({
                ...trend,
                source: trend.source ? restoreSource(trend.source) : undefined,
            })),
            actions: category.actions?.map((action) => ({
                ...action,
                sources: action.sources?.map(restoreSource),
            })),
        })),
    }
}
export type ShopDebugData = Readonly<{
    productTitle: string
    productStatus?: string
    batchCount?: number
    platformId: string
    platformLabel: string
    shops: readonly PublishShop[]
    selectedId?: string | undefined
}>
/** 店铺调试只接受可展示的对象与选择，不接受账号凭据和业务回调。 */
export function validateShopDebug(value: unknown): string | undefined {
    if (
        !object(value) ||
        !text(value.productTitle) ||
        !text(value.platformId) ||
        !text(value.platformLabel)
    )
        return '必须提供非空 productTitle、platformId 和 platformLabel。'
    const error =
        optionalText(value, ['productStatus', 'selectedId']) ?? numbers(value, ['batchCount'])
    if (error) return error
    if (
        value.batchCount !== undefined &&
        (!Number.isInteger(value.batchCount) || (value.batchCount as number) < 1)
    )
        return 'batchCount 必须为正整数。'
    if (!Array.isArray(value.shops)) return 'shops 必须为数组。'
    const ids = new Set<string>()
    for (const shop of value.shops) {
        if (
            !object(shop) ||
            !text(shop.id) ||
            !text(shop.name) ||
            !text(shop.platformId) ||
            !text(shop.regionLabel)
        )
            return '店铺必须有非空 id、name、platformId 和 regionLabel。'
        if (ids.has(shop.id)) return `店铺 id 重复：${shop.id}`
        ids.add(shop.id)
        const error = optionalText(shop, ['account', 'defaultCategory', 'disabledReason'])
        if (error) return error
    }
    if (
        value.selectedId !== undefined &&
        !value.shops.some(
            (shop) =>
                shop.id === value.selectedId &&
                shop.platformId === value.platformId &&
                !shop.disabledReason,
        )
    )
        return 'selectedId 必须指向当前平台的可用店铺，或删除该字段。'
    return undefined
}

/** 独立区块的调试输入只覆盖可见的代表实例，边界样例继续保留。 */
export function validateReportPartsDebug(value: unknown): string | undefined {
    if (!object(value) || !object(value.metric) || !text(value.metric.label))
        return 'metric 必须包含非空 label。'
    if (
        value.metric.value !== undefined &&
        typeof value.metric.value !== 'string' &&
        (typeof value.metric.value !== 'number' || !Number.isFinite(value.metric.value))
    )
        return 'metric.value 必须为字符串或有限数字。'
    const metricError = optionalText(value.metric, ['unit', 'description', 'note'])
    if (metricError) return metricError
    if (value.metric.source !== undefined) {
        const error = source(value.metric.source)
        if (error) return error
    }
    if (!object(value.score) || !text(value.score.label)) return 'score 必须包含非空 label。'
    const scoreError =
        numbers(value.score, ['value', 'max']) ?? optionalText(value.score, ['description'])
    if (scoreError) return scoreError
    if (value.score.max !== undefined && (value.score.max as number) <= 0)
        return 'score.max 必须大于 0。'
    if (value.score.source !== undefined) {
        const error = source(value.score.source)
        if (error) return error
    }
    if (
        !object(value.matrix) ||
        !text(value.matrix.title) ||
        !object(value.matrix.x) ||
        !object(value.matrix.y)
    )
        return 'matrix 必须有 title、x、y。'
    for (const axis of [value.matrix.x, value.matrix.y])
        if (
            !text(axis.label) ||
            typeof axis.threshold !== 'number' ||
            numbers(axis, ['threshold', 'value'])
        )
            return '矩阵轴必须有 label、有限 threshold；value 可缺失或为有限数字。'
    const matrixError = optionalText(value.matrix, ['description', 'conclusion'])
    if (matrixError) return matrixError
    if (value.metric.source !== undefined) {
        const error = source(value.metric.source)
        if (error) return error
    }
    const reportError = validateReportDebug({
        title: '独立区块',
        context: [],
        categories: [
            { id: 'trend', name: '趋势', demand: [value.trend] },
            ...(Array.isArray(value.categories) ? value.categories : []),
        ],
    })
    if (reportError) return reportError
    if (!Array.isArray(value.categories)) return 'categories 必须为数组。'
    const sourceError = source(value.source)
    if (sourceError) return sourceError
    return actions([value.action])
}
