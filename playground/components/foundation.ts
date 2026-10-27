import { LitElement, css, html } from 'lit'
import { workbench } from './inspector'
import { validateBasicRows } from './debug-validation'
import {
    panelStyles,
    text,
    url,
    section,
    badge,
    emptyState,
    statusNote,
    sectionHeading,
    skeleton,
    image,
    imageViewer,
    button,
    checkbox,
    textarea,
    dataTable,
    pager,
    pageNumbers,
    fade,
    slide,
    scale,
    collapse,
    productSummary,
    selectField,
} from '@mofang/browser'

const picture = (color: string, label: string) =>
    'data:image/svg+xml,' +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#f5f6f8"/><rect x="180" y="100" width="280" height="250" rx="24" fill="${color}"/><text x="320" y="408" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#475467">${label} · 本地示例图</text></svg>`,
    )
const pictures = [
    { src: picture('#a8c7cb', '图片一'), alt: '本地示例图一' },
    { src: picture('#c5bdad', '图片二'), alt: '本地示例图二' },
]
const rows = Array.from({ length: 12 }, (_, index) => ({
    id: String(index + 1),
    name: `示例记录 ${index + 1}`,
    amount: (index + 1) * 12.5,
    owner: ['小林', '小陈', '小周'][index % 3] ?? '',
}))

/** 原有公共组件的分组示例；所有交互均为本地展示状态。 */
class FoundationExamples extends LitElement {
    static override properties = {
        kind: {},
        records: { state: true },
        checked: { state: true },
        note: { state: true },
        shown: { state: true },
        viewerOpen: { state: true },
        index: { state: true },
        selected: { state: true },
        page: { state: true },
        tableState: { state: true },
        placement: { state: true },
    }
    static override styles = [
        panelStyles,
        css`
            :host {
                display: block;
            }
            .stack {
                display: grid;
                gap: 20px;
            }
            .row {
                display: flex;
                flex-wrap: wrap;
                gap: 14px;
                align-items: center;
            }
            .demo-title {
                margin: 0 0 10px;
                color: #343941;
                font-size: 14px;
                font-weight: 600;
            }
            .example {
                padding: 18px 0;
                border-bottom: 1px solid #e8ebf0;
            }
            .example:last-child {
                border-bottom: 0;
            }
            .example > .mf-field {
                margin: 0;
            }
            .caption {
                margin: 8px 0;
                color: #6b7280;
                font-size: 12px;
                line-height: 20px;
            }
            .motion-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 16px;
                margin-top: 20px;
            }
            .motion-stage {
                min-height: 130px;
                padding: 16px;
                border: 1px solid #e8ebf0;
                border-radius: 6px;
            }
            .motion-block {
                padding: 16px;
                background: #f0f7ff;
                color: #345e8b;
                border-radius: 5px;
                line-height: 22px;
            }
            .table-frame {
                height: var(--mf-table-preview-height, 340px);
                margin-top: 16px;
                border: 1px solid #e8ebf0;
                border-radius: 6px;
                overflow: auto;
            }
            .table-frame[data-placement='bottom'] {
                display: grid;
                grid-template-rows: minmax(0, 1fr) auto;
                overflow: hidden;
            }
            .table-frame[data-placement='bottom'] .mf-table {
                overflow: auto;
            }
            .table-frame .mf-table {
                overflow: visible;
                max-height: none;
                min-height: 0;
                border: 0;
                border-radius: 0;
            }
            .table-frame td.mf-empty {
                height: calc(var(--mf-table-preview-height, 340px) - 92px);
            }
            .table-frame .mf-table[aria-busy='true'] tbody:has(tr[aria-hidden]) td {
                height: 70px;
            }
            .table-frame td {
                height: 36px;
                padding: 7px 10px;
            }
            .table-frame .mf-pager {
                margin: 0;
                padding: 12px;
                border-top: 1px solid #e8ebf0;
            }
        `,
    ]
    declare kind: string
    declare checked: boolean
    declare records: typeof rows
    declare note: string
    declare shown: boolean
    declare viewerOpen: boolean
    declare index: number
    declare selected: ReadonlySet<string>
    declare page: number
    declare tableState: string
    declare placement: 'bottom' | 'after-rows'
    constructor() {
        super()
        this.records = structuredClone(rows)
        this.kind = 'text'
        this.checked = true
        this.note = ''
        this.shown = true
        this.viewerOpen = false
        this.index = 0
        this.selected = new Set()
        this.page = 1
        this.tableState = 'ready'
        this.placement = 'bottom'
    }
    private toggle(ids: readonly string[], checked: boolean) {
        if (this.tableState !== 'ready') return
        const next = new Set(this.selected)
        ids.forEach((id) => (checked ? next.add(id) : next.delete(id)))
        this.selected = next
    }
    private content() {
        switch (this.kind) {
            case 'text':
                return html`<div class="stack">
                    <div data-export="sectionHeading">
                        ${sectionHeading('标题与说明', 'sectionHeading 提供统一的标题层级。')}
                    </div>
                    <div data-export="text">
                        ${text({ value: '正文文字可选择、复制与完整阅读。' })}
                        <div style="max-width:340px;margin-top:10px">
                            ${text({
                                value: '长文本示例：展开入口允许用户使用键盘或鼠标查看完整内容，默认只显示两行。组件保留原始文本，不截断真实数据。',
                                lines: 2,
                                tone: 'muted',
                            })}
                        </div>
                    </div>
                    <div data-export="url" class="row">
                        ${url({ href: 'https://example.com', label: '外部示例链接' })}${url({
                            href: 'javascript:alert(1)',
                            label: '不安全地址显示为文字',
                        })}
                    </div>
                    <div data-export="section">
                        ${section(
                            {
                                title: '可折叠区块',
                                description: '点击标题展开，内容保持在同一 DOM 中。',
                                collapsible: true,
                            },
                            html`<p>本地示例内容。</p>`,
                        )}
                    </div>
                    <div data-export="badge" class="row">
                        ${badge('信息', 'info')}${badge('成功', 'success')}${badge(
                            '警告',
                            'warning',
                        )}${badge('失败', 'danger')}
                    </div>
                    <div data-export="statusNote">
                        ${statusNote('等待核对', '请检查当前数据后继续。', 'info')}${statusNote(
                            '加载失败',
                            '这是错误展示示例，没有发起网络请求。',
                            'error',
                        )}
                    </div>
                    <div data-export="emptyState">${emptyState('暂无内容')}</div>
                    <div data-export="skeleton">
                        ${skeleton({ width: '240px', height: '16px' })}
                        <p class="caption">骨架仅演示加载占位，不代替真实错误。</p>
                    </div>
                </div>`
            case 'images':
                return html`<div class="stack">
                    <div class="row" data-export="image">
                        ${image({
                            ...pictures[0]!,
                            images: pictures,
                            width: '120px',
                            height: '90px',
                        })}${image({ alt: '未提供图片', width: '120px', height: '90px' })}
                    </div>
                    <p class="caption">点击缩略图查看同组图片；无图显示明确占位。</p>
                    <div data-export="imageViewer">
                        ${button({
                            label: '打开受控图片查看器',
                            onClick: () => {
                                this.viewerOpen = true
                            },
                        })}${imageViewer({
                            open: this.viewerOpen,
                            images: pictures,
                            index: this.index,
                            onIndexChange: (index) => {
                                this.index = index
                            },
                            onClose: () => {
                                this.viewerOpen = false
                            },
                        })}
                    </div>
                </div>`
            case 'controls':
                return html`<div class="stack">
                    <div data-export="button" class="row">
                        ${(['primary', 'accent', 'secondary', 'ghost', 'danger'] as const).map(
                            (variant) =>
                                button({
                                    label: variant,
                                    variant,
                                    onClick: () => {
                                        this.note = `点击 ${variant}`
                                    },
                                }),
                        )}${button({ label: '加载示例', loading: true })}${button({
                            label: '不可操作',
                            disabled: true,
                        })}
                    </div>
                    <div data-export="checkbox" class="row">
                        ${checkbox({
                            label: '可选复选框',
                            checked: this.checked,
                            onChange: (checked) => {
                                this.checked = checked
                            },
                        })}${checkbox({
                            label: '部分选中',
                            checked: false,
                            indeterminate: true,
                            onChange: () => {},
                        })}${checkbox({
                            label: '不可用复选框',
                            checked: true,
                            disabled: true,
                            onChange: () => {},
                        })}
                    </div>
                    <div data-export="textarea">
                        ${textarea({
                            name: 'foundation-notes',
                            label: '多行输入',
                            value: this.note,
                            rows: 4,
                            onChange: (value) => {
                                this.note = value
                            },
                        })}
                    </div>
                </div>`
            case 'transitions':
                return html`<div data-export="fade slide scale collapse">
                    ${button({
                        label: this.shown ? '收起演示内容' : '展开演示内容',
                        onClick: () => {
                            this.shown = !this.shown
                        },
                    })}
                    <p class="caption">
                        四种过渡保留内容 DOM；仅主动开合播放，减少动态效果时立即切换。
                    </p>
                    <div class="motion-grid">
                        ${(['fade', 'slide', 'scale', 'collapse'] as const).map(
                            (kind) =>
                                html`<section class="motion-stage">
                                    <h3 class="demo-title">${kind}</h3>
                                    ${{ fade, slide, scale, collapse }[kind](
                                        { show: this.shown, duration: 180 },
                                        html`<div class="motion-block">
                                            同一位置的本地内容，可反复快速切换。
                                        </div>`,
                                    )}
                                </section>`,
                        )}
                    </div>
                </div>`
            case 'summary':
                return html`<div data-export="productSummary">
                    ${productSummary({
                        basic: {
                            title: '本地商品摘要示例',
                            description: '展示 Product 内置字段，不补造缺失属性。',
                            currency: 'USD',
                            price: 19.8,
                        },
                        images: pictures.map((item) => ({ url: item.src })),
                        skus: [{ skuCode: 'LOCAL-1' }],
                    })}
                </div>`
            case 'table': {
                const initial = this.tableState === 'initial-loading'
                const failure = this.tableState === 'error'
                const loading = this.tableState === 'loading' || initial
                const empty = this.tableState === 'empty'
                const readOnly = this.tableState === 'readonly'
                const visible =
                    empty || failure || initial
                        ? []
                        : this.records.slice((this.page - 1) * 10, this.page * 10)
                return html`<div class="row">
                        ${selectField({
                            name: 'foundation-table-state',
                            label: '演示内容',
                            value: this.tableState,
                            options: [
                                { value: 'ready', label: '记录列表' },
                                { value: 'loading', label: '加载示例' },
                                { value: 'initial-loading', label: '首次加载' },
                                { value: 'error', label: '错误示例' },
                                { value: 'empty', label: '空表示例' },
                                { value: 'readonly', label: '只读示例' },
                            ],
                            onChange: (value) => {
                                this.tableState = value ?? 'ready'
                                if (
                                    ['empty', 'error', 'initial-loading'].includes(this.tableState)
                                ) {
                                    this.page = 1
                                    this.selected = new Set()
                                }
                            },
                        })}
                        <p class="caption">
                            已选 ${this.selected.size} 项。列由调用方定义，表格按本地示例顺序展示。
                        </p>
                    </div>
                    ${selectField({
                        name: 'table-pagination-placement',
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
                    <div
                        class="table-frame"
                        data-placement=${this.placement}
                        data-export="dataTable pager pageNumbers"
                    >
                        ${dataTable(
                            visible,
                            (row) => row.id,
                            [
                                { title: '名称', cell: (row) => row.name },
                                { title: '负责人', cell: (row) => row.owner },
                                {
                                    title: '金额',
                                    align: 'right',
                                    cell: (row) => row.amount.toFixed(2),
                                },
                            ],
                            {
                                label: '基础表格示例',
                                loading,
                                empty: '暂无记录',
                                ...(failure
                                    ? {
                                          error: {
                                              title: '记录读取失败',
                                              description:
                                                  '这是本地失败示例。点击重新加载恢复示例记录。',
                                              onRetry: () => {
                                                  this.tableState = 'ready'
                                                  this.page = 1
                                              },
                                          },
                                      }
                                    : {}),
                                selection: {
                                    selected: this.selected,
                                    disabledReason: (id) =>
                                        loading
                                            ? '正在加载'
                                            : readOnly
                                              ? '当前只读'
                                              : id === '3'
                                                ? '示例不可选择行'
                                                : '',
                                    onToggle: (id, checked) => this.toggle([id], checked),
                                    onToggleAll: (ids, checked) => this.toggle(ids, checked),
                                },
                            },
                        )}${pager({
                            page: this.page,
                            pageSize: 10,
                            total: empty || failure || initial ? 0 : this.records.length,
                            busy: loading || failure,
                            onPage: (page) => {
                                this.page = page
                            },
                        })}
                    </div>
                    <p class="caption">
                        页码计算示例：${pageNumbers(5, 12).join(' ')}。全选只作用于本页可选行。
                    </p>`
            }
            default:
                return html``
        }
    }
    protected override render() {
        return workbench(
            {
                id: `foundation-${this.kind}`,
                title: '用法与演示数据',
                description: '数据编辑与选择只作用于当前本地示例。',
                usage:
                    this.kind === 'table'
                        ? '// 列与行由调用方提供；分页由外部宿主控制\ndataTable(rows, row => row.id, columns, { selection })\npager({ page, pageSize: 10, total: rows.length, onPage })'
                        : `// 公共 ${this.kind} 模板按需导入\n// value 和回调由宿主持有，取消与确认分别处理。`,
                parameters:
                    this.kind === 'table'
                        ? [
                              {
                                  name: 'rows',
                                  description:
                                      '每行 id/name/owner 字符串和有限数字 amount；id 必须唯一。',
                              },
                              {
                                  name: '分页位置',
                                  description:
                                      '宿主决定固定容器底部或跟随所有数据行滚动；不是 pager 自身状态。',
                              },
                          ]
                        : [],
                ...(this.kind === 'table'
                    ? {
                          data: rows,
                          validate: validateBasicRows,
                          onApply: (value: unknown) => {
                              this.records = value as typeof rows
                              this.page = 1
                              this.selected = new Set()
                          },
                          onReset: () => {
                              this.records = structuredClone(rows)
                              this.page = 1
                              this.selected = new Set()
                          },
                      }
                    : {}),
            },
            this.content(),
        )
    }
}
customElements.define('mf-foundation-examples', FoundationExamples)
