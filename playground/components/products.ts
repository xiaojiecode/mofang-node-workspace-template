import { workbench } from './inspector'
import { validateProductRows } from './debug-validation'
import { LitElement, css, html } from 'lit'
import type { Product } from '@mofang/contracts/business'
import {
    panelStyles,
    dataTable,
    productCell,
    money,
    percent,
    pager,
    text,
    selectField,
} from '@mofang/browser'
import type { TableColumn } from '@mofang/browser'

type ProductRow = Readonly<{
    id: string
    product: Product
    sales7?: number
    revenue7?: number
    commission?: number
    creators?: number
}>
type TableState = 'ready' | 'loading' | 'initial-loading' | 'empty' | 'error' | 'readonly'

/** 本地示例图只包含几何形状和标签，用于检查缩略图与查看器。 */
function sampleImage(color: string, label: string) {
    return (
        'data:image/svg+xml,' +
        encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="#f5f6f8"/><rect x="190" y="150" width="220" height="290" rx="28" fill="${color}"/><rect x="230" y="108" width="140" height="70" rx="12" fill="#d8dce1"/><text x="300" y="490" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#434b58">${label} · 本地示例</text></svg>`,
        )
    )
}

/** 商品字段沿用内置 Product；指标仅为表格预览数据，不写入业务契约。 */
const products: readonly ProductRow[] = [
    {
        id: 'p1',
        product: {
            basic: {
                title: '便携保温杯',
                description: '本地示例商品，用于展示商品摘要、缩略图与金额。',
                price: 19.8,
                currency: 'USD',
            },
            images: [
                { url: sampleImage('#90b8c0', '保温杯') },
                { url: sampleImage('#b8c8bd', '保温杯细节') },
            ],
            collection: {
                source: 'TikTok Shop',
                sourceUrl: 'https://example.com/products/local-demo-1',
                sourceItemId: 'LOCAL-001',
            },
        },
        sales7: 1320,
        revenue7: 26136,
        commission: 12,
        creators: 84,
    },
    {
        id: 'p2',
        product: {
            basic: {
                title: '这是一个需要完整展开阅读的长商品标题：旅行收纳袋组合套装，分隔整理衣物和日常随身用品',
                description:
                    '长描述示例：保留多段信息与中文内容，默认展示摘要，用户可用键盘或鼠标展开查看全文。该内容仅用于本地组件展示，不构成真实商品承诺。',
                price: 35,
                currency: 'EUR',
            },
            images: [{ url: sampleImage('#d3bca0', '收纳袋') }],
            collection: {
                source: 'Amazon',
                sourceUrl: 'https://example.com/products/local-demo-2',
                sourceItemId: 'LOCAL-002',
            },
        },
        sales7: 942,
        revenue7: 32970,
        commission: 8.5,
        creators: 56,
    },
    {
        id: 'p3',
        product: {
            basic: { title: '无图商品示例', price: 0, currency: 'CNY' },
            collection: {
                source: '1688',
                sourceUrl: 'https://example.com/products/local-demo-3',
                sourceItemId: 'LOCAL-003',
            },
        },
        sales7: 0,
        revenue7: 0,
        commission: 0,
        creators: 0,
    },
    { id: 'p4', product: { basic: { title: '部分字段缺失商品' } } },
    {
        id: 'p5',
        product: {
            basic: {
                title: '轻量桌面收纳盒',
                description: '本地示例描述。',
                price: 12.5,
                currency: 'GBP',
            },
            images: [{ url: sampleImage('#b4bcd5', '收纳盒') }],
        },
        sales7: 342,
        revenue7: 4275,
        commission: 10,
        creators: 19,
    },
    {
        id: 'p6',
        product: {
            basic: { title: '日常清洁刷套装', price: 16.2, currency: 'USD' },
            images: [{ url: sampleImage('#b8c8bd', '清洁刷') }],
        },
        sales7: 210,
        revenue7: 3402,
        commission: 7,
        creators: 15,
    },
    {
        id: 'p7',
        product: {
            basic: { title: '便携化妆包', price: 24, currency: 'USD' },
            images: [{ url: sampleImage('#d6b6c9', '化妆包') }],
        },
        sales7: 602,
        revenue7: 14448,
        commission: 15,
        creators: 42,
    },
    {
        id: 'p8',
        product: {
            basic: { title: '可折叠购物袋', price: 8.5, currency: 'USD' },
            images: [{ url: sampleImage('#b3c49b', '购物袋') }],
        },
        sales7: 124,
        revenue7: 1054,
        commission: 6,
        creators: 9,
    },
]

/** 商品表格组合直接复用表格、商品单元格、金额和分页组件，勾选在本地按 ID 跨页保留。 */
class ProductTablePreview extends LitElement {
    static override styles = [
        panelStyles,
        css`
            :host {
                display: block;
            }
            .toolbar {
                display: flex;
                align-items: end;
                gap: 24px;
                justify-content: space-between;
                margin-bottom: 16px;
            }
            .toolbar .mf-field {
                width: 240px;
                margin: 0;
            }
            .summary {
                margin: 0 0 8px;
                color: #5c6470;
                font-size: 12px;
                line-height: 20px;
            }
            .frame {
                height: var(--mf-table-preview-height, 420px);
                border: 1px solid #e5e8ec;
                border-radius: 6px;
                background: #fff;
                overflow: auto;
                scrollbar-gutter: stable;
            }
            .frame[data-placement='bottom'] {
                display: grid;
                grid-template-rows: minmax(0, 1fr) auto;
                overflow: hidden;
            }
            .frame[data-placement='bottom'] .mf-table {
                overflow: auto;
            }
            .frame[data-placement='bottom'] .pager-area {
                min-width: 0;
            }
            .mf-table {
                min-height: 0;
                max-height: none;
                border: 0;
                border-radius: 0;
                overflow: visible;
            }
            .mf-table table {
                min-width: 940px;
                table-layout: fixed;
            }
            .mf-table th {
                z-index: 2;
                height: 36px;
            }
            .mf-table td {
                padding: 8px 10px;
                box-sizing: border-box;
            }
            .mf-table .mf-check {
                width: 40px;
            }
            .mf-product-cell {
                min-width: 0;
            }
            .mf-product-text {
                min-width: 0;
                flex: 1;
            }
            .description {
                margin-top: 5px;
            }
            .description .mf-text {
                font-size: 11px;
                line-height: 17px;
            }
            .mf-table .mf-empty {
                height: calc(var(--mf-table-preview-height, 420px) - 92px);
            }
            .mf-table .mf-empty .mf-empty {
                height: auto;
            }
            .mf-table[aria-busy='true'] tbody:has(tr[aria-hidden]) td {
                height: 90px;
            }
            .pager-area {
                min-width: 0;
                padding: 0 14px;
                border-top: 1px solid #e8ebf0;
            }
            .mf-pager {
                margin: 0;
                min-height: 52px;
                box-sizing: border-box;
            }
            .footnote {
                margin: 12px 0 0;
                color: #737b87;
                font-size: 12px;
                line-height: 20px;
            }
        `,
    ]
    static override properties = {
        records: { state: true },
        state: { state: true },
        selected: { state: true },
        page: { state: true },
        pageSize: { state: true },
        placement: { state: true },
    }
    declare state: TableState
    declare selected: ReadonlySet<string>
    declare page: number
    declare pageSize: number
    declare placement: 'bottom' | 'after-rows'
    declare records: readonly ProductRow[]
    constructor() {
        super()
        this.records = structuredClone(products)
        this.state = 'ready'
        this.selected = new Set()
        this.page = 1
        this.pageSize = 5
        this.placement = 'bottom'
    }
    private toggle(keys: readonly string[], checked: boolean) {
        if (this.state !== 'ready') return
        const next = new Set(this.selected)
        keys.forEach((key) => (checked ? next.add(key) : next.delete(key)))
        this.selected = next
    }
    private content() {
        const empty = this.state === 'empty'
        const failure = this.state === 'error'
        const initial = this.state === 'initial-loading'
        const busy = this.state === 'loading' || initial || failure
        const readOnly = this.state === 'readonly'
        const total = empty || failure || initial ? 0 : this.records.length
        const rows =
            empty || failure || initial
                ? []
                : this.records.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
        const columns: readonly TableColumn<ProductRow>[] = [
            {
                title: '商品信息',
                width: '310px',
                cell: (row) =>
                    html`${productCell(row.product)}${row.product.basic?.description
                        ? html`<div class="description">
                              ${text({
                                  value: row.product.basic.description,
                                  tone: 'muted',
                                  lines: 1,
                              })}
                          </div>`
                        : html``}`,
            },
            {
                title: '价格',
                width: '100px',
                align: 'right',
                cell: (row) => money(row.product.basic?.price, row.product.basic?.currency),
            },
            {
                title: '近 7 天销量',
                width: '100px',
                align: 'right',
                cell: (row) => row.sales7?.toLocaleString('zh-CN') ?? '—',
            },
            {
                title: '近 7 天销售额',
                width: '130px',
                align: 'right',
                cell: (row) => money(row.revenue7, row.product.basic?.currency),
            },
            {
                title: '佣金比例',
                width: '90px',
                align: 'right',
                cell: (row) => percent(row.commission),
            },
            {
                title: '关联达人数',
                width: '100px',
                align: 'right',
                cell: (row) => row.creators ?? '—',
            },
        ]
        return html`<div class="toolbar">
                ${selectField({
                    name: 'product-table-state',
                    label: '演示内容',
                    value: this.state,
                    options: [
                        { value: 'ready', label: '商品列表' },
                        { value: 'loading', label: '加载示例' },
                        { value: 'initial-loading', label: '首次加载' },
                        { value: 'empty', label: '空表示例' },
                        { value: 'error', label: '错误示例' },
                        { value: 'readonly', label: '只读示例' },
                    ],
                    onChange: (value) => {
                        this.state = value as TableState
                        if (['empty', 'error', 'initial-loading'].includes(this.state)) {
                            this.page = 1
                            this.selected = new Set()
                        }
                    },
                })}
                ${selectField({
                    name: 'product-pagination-placement',
                    label: '分页位置',
                    value: this.placement,
                    options: [
                        { value: 'bottom', label: '固定底部' },
                        { value: 'after-rows', label: '随内容滚动' },
                    ],
                    onChange: (value) => {
                        this.placement = value as 'bottom' | 'after-rows'
                    },
                })}
                <p class="summary">本地示例 ${total} 件 · 已选 ${this.selected.size} 件</p>
            </div>
            <div class="frame" data-placement=${this.placement}>
                ${dataTable(rows, (row) => row.id, columns, {
                    label: '本地示例商品表格',
                    empty: '暂无商品数据',
                    loading: this.state === 'loading' || initial,
                    ...(failure
                        ? {
                              error: {
                                  title: '商品读取失败',
                                  description:
                                      '这是本地失败示例。当前没有可用结果，点击重新加载恢复演示数据。',
                                  onRetry: () => {
                                      this.state = 'ready'
                                      this.page = 1
                                  },
                              },
                          }
                        : {}),
                    selection: {
                        selected: this.selected,
                        disabledReason: () => (readOnly ? '当前只读' : busy ? '等待加载完成' : ''),
                        onToggle: (id, checked) => this.toggle([id], checked),
                        onToggleAll: (ids, checked) => this.toggle(ids, checked),
                    },
                })}
                <div class="pager-area">
                    ${pager({
                        page: this.page,
                        pageSize: this.pageSize,
                        total,
                        busy,
                        pageSizes: [3, 5, 8],
                        onPage: (page) => {
                            this.page = page
                        },
                        onPageSize: (size) => {
                            this.pageSize = size
                            this.page = 1
                        },
                    })}
                </div>
            </div>
            <p class="footnote">
                所有商品、图片与指标均为本地演示数据。缺失值显示“—”，零值保留；点击缩略图查看同组图片，点击长标题或描述展开全文。
            </p>`
    }
    protected override render() {
        return workbench(
            {
                id: 'product-table',
                title: '用法与演示数据',
                description: '商品与指标均为本地示例，应用后不请求外部平台。',
                usage: '// 商品展示复用标准 Product 字段\ndataTable(rows, row => row.id, [\n  { title: "商品", cell: row => productCell(row.product) },\n  { title: "价格", cell: row => money(row.product.basic?.price, row.product.basic?.currency) }\n])',
                parameters: [
                    {
                        name: 'product.basic',
                        description:
                            'title/description/currency 为字符串，price 为有限数字；缺失字段显示占位。',
                    },
                    {
                        name: 'product.images',
                        description: '仅使用 url 字符串数组；点击图片使用内置查看器。',
                    },
                    {
                        name: 'sales7 / revenue7 / commission / creators',
                        description: '可缺省的有限数字；零值与缺失分别展示。',
                    },
                ],
                data: products,
                validate: validateProductRows,
                onApply: (value: unknown) => {
                    this.records = value as readonly ProductRow[]
                    this.page = 1
                    this.selected = new Set()
                },
                onReset: () => {
                    this.records = structuredClone(products)
                    this.page = 1
                    this.selected = new Set()
                },
            },
            this.content(),
        )
    }
}
customElements.define('mf-product-table-preview', ProductTablePreview)
