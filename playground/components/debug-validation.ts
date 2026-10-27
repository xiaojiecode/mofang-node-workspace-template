/** 演示 JSON 只允许明确字段，不以猜测兼容层接受未知结构。 */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
    value !== null && typeof value === 'object' && !Array.isArray(value)
const strings = (
    item: Record<string, unknown>,
    names: readonly string[],
    required: readonly string[] = [],
) =>
    names.every((name) =>
        required.includes(name)
            ? typeof item[name] === 'string' && Boolean(item[name])
            : item[name] === undefined || typeof item[name] === 'string',
    )
const uniqueIds = (items: readonly Record<string, unknown>[]) =>
    new Set(items.map((item) => item.id)).size === items.length

export function validateBasicRows(value: unknown): string | undefined {
    if (!Array.isArray(value)) return '记录必须是数组。'
    if (value.length > 200) return '本地预览最多支持 200 条记录。'
    if (
        !value.every(
            (item) =>
                isRecord(item) &&
                Object.keys(item).every((key) => ['id', 'name', 'owner', 'amount'].includes(key)) &&
                strings(item, ['id', 'name', 'owner'], ['id', 'name', 'owner']) &&
                typeof item.amount === 'number' &&
                Number.isFinite(item.amount),
        )
    )
        return '每条记录需要 id、name、owner 字符串和有限数字 amount；不接受其它字段。'
    if (!uniqueIds(value)) return '记录 id 必须唯一。'
    return undefined
}

export function validateCockpitNodes(value: unknown): string | undefined {
    if (!Array.isArray(value)) return 'nodes 必须是数组。'
    const tones = ['neutral', 'active', 'complete', 'warning', 'error']
    for (const node of value) {
        if (
            !isRecord(node) ||
            !Object.keys(node).every((key) =>
                [
                    'id',
                    'title',
                    'status',
                    'statusTone',
                    'controlLabel',
                    'processTitle',
                    'process',
                    'capabilities',
                ].includes(key),
            ) ||
            !strings(
                node,
                ['id', 'title', 'status', 'controlLabel', 'processTitle'],
                ['id', 'title', 'status'],
            )
        )
            return '节点需要 id/title/status 字符串；只接受说明列出的纯数据字段。'
        if (node.statusTone !== undefined && !tones.includes(String(node.statusTone)))
            return 'statusTone 必须是 neutral/active/complete/warning/error。'
        for (const field of ['process', 'capabilities']) {
            const items = node[field]
            if (items === undefined) continue
            if (!Array.isArray(items)) return `${field} 必须是数组。`
            if (
                !items.every(
                    (item) =>
                        isRecord(item) &&
                        strings(
                            item,
                            field === 'process' ? ['id', 'title', 'description'] : ['id', 'title'],
                            ['id', 'title'],
                        ) &&
                        Object.keys(item).every((key) =>
                            (field === 'process'
                                ? ['id', 'title', 'description', 'tone', 'current']
                                : ['id', 'title']
                            ).includes(key),
                        ) &&
                        (item.tone === undefined || tones.includes(String(item.tone))) &&
                        (item.current === undefined || typeof item.current === 'boolean'),
                )
            )
                return `${field} 需要唯一 id/title，过程可附字符串 description、tone 和布尔 current。`
            if (!uniqueIds(items)) return `${field} 的 id 必须唯一。`
        }
    }
    if (!uniqueIds(value)) return '节点 id 必须唯一。'
    return undefined
}

export function validateProductRows(value: unknown): string | undefined {
    if (!Array.isArray(value) || value.length > 200) return '商品必须是最多 200 项的数组。'
    for (const row of value) {
        if (
            !isRecord(row) ||
            !strings(row, ['id'], ['id']) ||
            !isRecord(row.product) ||
            !Object.keys(row).every((key) =>
                ['id', 'product', 'sales7', 'revenue7', 'commission', 'creators'].includes(key),
            )
        )
            return '每项需要唯一 id 与 product 对象，仅支持表格已展示指标。'
        for (const key of ['sales7', 'revenue7', 'commission', 'creators'])
            if (
                row[key] !== undefined &&
                (typeof row[key] !== 'number' || !Number.isFinite(row[key]))
            )
                return `${key} 必须为有限数字或缺省。`
        const product = row.product
        if (!Object.keys(product).every((key) => ['basic', 'images', 'collection'].includes(key)))
            return '本地商品表仅支持 product.basic/images/collection。'
        if (product.basic !== undefined) {
            if (
                !isRecord(product.basic) ||
                !Object.keys(product.basic).every((key) =>
                    ['title', 'description', 'price', 'currency'].includes(key),
                ) ||
                !strings(product.basic, ['title', 'description', 'currency']) ||
                (product.basic.price !== undefined &&
                    (typeof product.basic.price !== 'number' ||
                        !Number.isFinite(product.basic.price)))
            )
                return 'basic 只接受 title/description/currency 字符串与有限数字 price。'
        }
        if (
            product.images !== undefined &&
            (!Array.isArray(product.images) ||
                !product.images.every(
                    (item) =>
                        isRecord(item) &&
                        Object.keys(item).every((key) => ['url'].includes(key)) &&
                        strings(item, ['url'], ['url']),
                ))
        )
            return 'images 必须是仅包含 url 字符串的数组。'
        if (
            product.collection !== undefined &&
            (!isRecord(product.collection) ||
                !Object.keys(product.collection).every((key) =>
                    ['source', 'sourceUrl', 'sourceItemId'].includes(key),
                ) ||
                !strings(product.collection, ['source', 'sourceUrl', 'sourceItemId']))
        )
            return 'collection 只接受 source/sourceUrl/sourceItemId 字符串。'
    }
    if (!uniqueIds(value)) return '商品 id 必须唯一。'
    return undefined
}
