/** 本地演示输入使用 draft-07，只描述数据结构，不作为节点或平台生产契约。 */
const text = { type: 'string' }
const nonEmpty = { type: 'string', pattern: '\\S' }
const number = { type: 'number' }
const percent = { type: 'number', minimum: 0, maximum: 100 }
const ref = (name: string) => ({ $ref: `#/definitions/${name}` })
const definitions = {
    source: {
        title: '数据来源',
        type: 'object',
        required: ['label'],
        additionalProperties: true,
        properties: { label: nonEmpty, description: text, icon: false },
        description: 'JSON 不保存 Lit 图标对象，已知图标由预览代码重建。',
    },
    metric: {
        title: '指标卡输入',
        type: 'object',
        required: ['label'],
        additionalProperties: true,
        properties: {
            label: nonEmpty,
            value: { anyOf: [{ type: 'string' }, { type: 'number' }] },
            unit: text,
            description: text,
            note: text,
            source: ref('source'),
        },
    },
    score: {
        title: '评分输入',
        type: 'object',
        required: ['label'],
        additionalProperties: true,
        properties: {
            label: nonEmpty,
            value: number,
            max: { type: 'number', exclusiveMinimum: 0 },
            description: text,
            source: ref('source'),
        },
        description: '缺失或越界的评分由展示组件明确处理，不补成零分。',
    },
    trendPoint: {
        title: '趋势数据点',
        type: 'object',
        required: ['label'],
        additionalProperties: true,
        properties: { label: text, value: number },
    },
    trend: {
        title: '趋势图输入',
        type: 'object',
        required: ['title', 'accessibleLabel', 'series'],
        additionalProperties: true,
        properties: {
            title: nonEmpty,
            accessibleLabel: nonEmpty,
            series: { type: 'array', items: ref('trendPoint') },
            color: text,
            unit: text,
            summary: text,
            note: text,
            source: ref('source'),
        },
        description: 'value 可缺失，缺值断线；零、负值、单点和空序列合法。',
    },
    axis: {
        title: '矩阵轴',
        type: 'object',
        required: ['label', 'threshold'],
        additionalProperties: true,
        properties: { label: nonEmpty, value: number, threshold: number },
    },
    matrix: {
        title: '机会矩阵输入',
        type: 'object',
        required: ['title', 'x', 'y'],
        additionalProperties: true,
        properties: {
            title: nonEmpty,
            x: ref('axis'),
            y: ref('axis'),
            description: text,
            conclusion: text,
        },
    },
    action: {
        title: '行动建议输入',
        type: 'object',
        required: ['title', 'description'],
        additionalProperties: true,
        properties: {
            title: nonEmpty,
            description: text,
            step: text,
            sources: { type: 'array', items: ref('source') },
            action: false,
        },
        description: 'JSON 只保存展示数据，不接受可执行回调。',
    },
    product: {
        title: '代表商品',
        type: 'object',
        required: ['id', 'name'],
        additionalProperties: true,
        properties: {
            id: nonEmpty,
            name: nonEmpty,
            imageUrl: { type: 'string', description: '本地图片地址；地址语义由调试校验检查。' },
            price: number,
            currencyCode: text,
            units: number,
            growth: number,
            promoters: number,
            source: text,
        },
    },
    category: {
        title: '类目报告',
        type: 'object',
        required: ['id', 'name'],
        additionalProperties: true,
        properties: {
            id: nonEmpty,
            name: nonEmpty,
            englishName: text,
            summary: text,
            units: number,
            gmv: number,
            currencyCode: text,
            growth: number,
            promoters: number,
            newUnits: number,
            searchMomentum: number,
            platformScore: percent,
            searchScore: percent,
            opportunityScore: percent,
            productConcentration: percent,
            shopConcentration: percent,
            promotionOverlap: percent,
            newProductOverlap: percent,
            demand: { type: 'array', items: ref('trend') },
            products: { type: 'array', items: ref('product') },
            actions: { type: 'array', items: ref('action') },
            conclusion: text,
        },
        description: '可选指标缺失合法；id 唯一性由自定义校验负责。',
    },
}
const demoProperties = {
    metric: ref('metric'),
    score: ref('score'),
    trend: ref('trend'),
    matrix: ref('matrix'),
    categories: { type: 'array', items: ref('category') },
    source: ref('source'),
    action: ref('action'),
}
const metricCopy = {
    type: 'object',
    additionalProperties: true,
    properties: { label: text, description: text, note: text, unit: text },
}
const metricLabels = {
    type: 'object',
    additionalProperties: true,
    properties: {
        units: text,
        gmv: text,
        growth: text,
        promoters: text,
        newUnits: text,
        searchMomentum: text,
        opportunityScore: text,
        sortUnits: text,
        sortGmv: text,
    },
}
const vocabulary = {
    title: '展示口径',
    type: 'object',
    additionalProperties: true,
    properties: {
        metrics: metricLabels,
        performance: {
            type: 'object',
            additionalProperties: true,
            properties: {
                title: text,
                description: text,
                sales: metricCopy,
                promotion: metricCopy,
                newProducts: metricCopy,
            },
        },
        supply: {
            type: 'object',
            additionalProperties: true,
            properties: {
                description: text,
                productConcentration: metricCopy,
                shopConcentration: metricCopy,
                promotionOverlap: metricCopy,
                newProductOverlap: metricCopy,
            },
        },
        products: {
            type: 'object',
            additionalProperties: true,
            properties: { units: text, growth: text, promoters: text },
        },
        demandDescription: text,
    },
}

/** 真正传入 selectionReport 的纯 JSON 数据；Lit 图标和行动回调由调用方另行接入。 */
export const reportDataSchema: Record<string, unknown> = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'urn:mofang:report:selection-report-data',
    title: 'SelectionReportData · 选品报告数据',
    description:
        '对应公共组件 SelectionReportData 的纯 JSON 部分。不是后端或节点生产契约；不含 TemplateResult 图标、行动回调及受控状态回调。',
    type: 'object',
    required: ['title', 'context', 'categories'],
    additionalProperties: true,
    definitions,
    properties: {
        title: nonEmpty,
        description: text,
        vocabulary,
        sampleLabel: text,
        context: {
            type: 'array',
            items: {
                type: 'object',
                required: ['label', 'value'],
                additionalProperties: true,
                properties: { label: nonEmpty, value: text },
            },
        },
        categoryPath: text,
        categories: { type: 'array', items: ref('category') },
        sources: { type: 'array', items: ref('source') },
        platformSource: ref('source'),
        searchSource: ref('source'),
        matrixThresholds: {
            type: 'object',
            required: ['platform', 'search'],
            additionalProperties: true,
            properties: { platform: number, search: number },
        },
        scoreDescription: text,
        comparisonCaption: text,
        methods: {
            type: 'array',
            items: {
                type: 'object',
                required: ['title', 'description'],
                additionalProperties: true,
                properties: { title: nonEmpty, formula: text, description: text },
            },
        },
        notes: { type: 'array', items: text },
    },
}

/** 用户原始演示输入通过 mapReportFixture 映射为上面的组件数据，不是同一种根结构。 */
export const reportDemoInputSchema: Record<string, unknown> = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'urn:mofang:preview:selection-report-demo-input',
    title: '选品报告演示源数据 · 七区块输入',
    description:
        'metric/score/trend/matrix/categories/source/action 为本页原始演示输入。完整报告通过 mapReportFixture 映射；不应直接作为 SelectionReportData 使用。',
    type: 'object',
    required: ['metric', 'score', 'trend', 'matrix', 'categories', 'source', 'action'],
    properties: demoProperties,
    additionalProperties: true,
    definitions,
}
