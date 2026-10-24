import { LitElement, css, html } from 'lit'
import {
    panelStyles,
    card,
    section,
    sectionHeading,
    text,
    url,
    button,
    image,
    tabs,
    textField,
    numberField,
    selectField,
    textarea,
    checkbox,
    badge,
    statusNote,
    emptyState,
    dataTable,
    pager,
    skeleton,
    collapse,
} from '@mofang/browser'

/** 明确标注的本地测试图，用于离线验证尺寸、切图与加载状态。 */
const sample = (color: string, label: string) =>
    'data:image/svg+xml,' +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#f3f5f8"/><rect x="220" y="150" width="360" height="300" rx="20" fill="${color}"/><text x="400" y="520" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#344054">${label} · 本地测试图</text></svg>`,
    )
const pictures = [
    { src: sample('#b5c9e0', '图片一'), alt: '图片一' },
    { src: sample('#c9d5bf', '图片二'), alt: '图片二' },
]

/** 基础组件总览只使用本地数据，不接平台或真实任务。 */
export class UIPreview extends LitElement {
    static override styles = [
        panelStyles,
        css`
            :host {
                max-width: 1120px;
                margin: auto;
            }
            :host > .mf-card {
                padding: 28px 32px;
            }
            .intro {
                display: flex;
                justify-content: space-between;
                gap: 24px;
            }
            .demo-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 12px 32px;
            }
            .demo-grid > * {
                min-width: 0;
            }
            .demo-row {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                align-items: center;
            }
            .demo-stack {
                display: grid;
                gap: 12px;
            }
            .demo-grid .mf-field {
                margin: 0;
                max-width: none;
            }
            .demo-images {
                display: flex;
                gap: 16px;
                align-items: start;
                flex-wrap: wrap;
            }
            .demo-images figure {
                margin: 0;
            }
            .demo-images figcaption {
                font-size: 12px;
                color: var(--mf-muted);
                margin-top: 8px;
            }
            .demo-image-full {
                max-width: 100%;
            }
            .mf-section {
                padding: 24px 0;
            }
            .mf-table {
                margin-top: 12px;
            }
            .demo-reveal {
                padding: 16px;
                background: var(--mf-soft);
                margin-top: 12px;
            }
            @media (max-width: 650px) {
                :host > .mf-card {
                    padding: 20px 16px;
                }
                .demo-grid {
                    grid-template-columns: minmax(0, 1fr);
                    gap: 16px;
                }
                .intro {
                    flex-direction: column;
                    gap: 4px;
                }
            }
        `,
    ]
    static override properties = {
        name: { state: true },
        note: { state: true },
        amount: { state: true },
        category: { state: true },
        checked: { state: true },
        active: { state: true },
        selected: { state: true },
        page: { state: true },
        loading: { state: true },
        expanded: { state: true },
        src: { state: true },
        clickCount: { state: true },
    }
    declare name: string
    declare note: string
    declare amount: number | undefined
    declare category: string
    declare checked: boolean
    declare active: string
    declare selected: ReadonlySet<string>
    declare page: number
    declare loading: boolean
    declare expanded: boolean
    declare src: string
    declare clickCount: number
    constructor() {
        super()
        this.name = ''
        this.note = ''
        this.amount = undefined
        this.category = ''
        this.checked = true
        this.active = 'summary'
        this.selected = new Set()
        this.page = 1
        this.loading = false
        this.expanded = false
        this.src = pictures[0]!.src
        this.clickCount = 0
    }
    private toggle(keys: readonly string[], checked: boolean) {
        const selected = new Set(this.selected)
        keys.forEach((key) => (checked ? selected.add(key) : selected.delete(key)))
        this.selected = selected
    }
    protected override render() {
        const rows = [
            { id: '1', title: '示例商品一', price: 129, image: pictures[0]!.src },
            { id: '2', title: '示例商品二', price: 248, image: pictures[1]!.src },
            { id: '3', title: '已输出商品', price: 96, image: pictures[0]!.src },
        ]
        return card(
            {},
            html`<header class="intro">
                    ${sectionHeading(
                        '基础组件',
                        '统一白底、清晰层级和受控交互。以下内容均为本地预览数据。',
                    )}
                    <div>${badge('Lit · 本地预览', 'info')}</div>
                </header>
                ${section(
                    { title: '文字与链接', description: '正文、辅助信息、截断展开与业务链接。' },
                    html` <div class="demo-grid">
                        <div class="demo-stack">
                            ${text({ value: '商品与任务信息', size: 'title', weight: 'medium' })}
                            ${text({ value: '正文用于说明当前内容，辅助文字用于补充条件。' })}
                            ${text({
                                value: '缺失字段保留空态，不补造业务数据。',
                                tone: 'muted',
                                size: 'small',
                            })}
                            <div class="demo-row">
                                ${badge('待流转', 'info')}${badge('已完成', 'success')}${badge(
                                    '待核对',
                                    'warning',
                                )}${badge('失败', 'danger')}
                            </div>
                        </div>
                        <div class="demo-stack">
                            <div style="max-width:280px">
                                ${text({
                                    value: '这是一段用于验证长内容展开的文字，收起时保留两行，展开后可以完整查看，键盘也能打开与关闭。',
                                    lines: 2,
                                })}
                            </div>
                            ${url({
                                href: 'https://example.com/products/preview',
                                label: '查看来源链接',
                            })}
                            <div id="unsafe-url">
                                ${url({ href: 'javascript:alert(1)', label: '无效地址显示为文字' })}
                            </div>
                        </div>
                    </div>`,
                )}
                ${section(
                    { title: '按钮', description: '操作层级、忙碌与禁用状态共享同一套尺寸。' },
                    html`<div class="demo-row" id="buttons">
                        ${button({
                            label: '主要操作',
                            variant: 'primary',
                            onClick: () => {
                                this.clickCount++
                            },
                        })}
                        ${button({
                            label: '次要操作',
                            onClick: () => {
                                this.clickCount++
                            },
                        })}
                        ${button({
                            label: '文字按钮',
                            variant: 'ghost',
                            onClick: () => {
                                this.clickCount++
                            },
                        })}
                        ${button({
                            label: '危险操作',
                            variant: 'danger',
                            onClick: () => {
                                this.clickCount++
                            },
                        })}
                        ${button({
                            label: '处理中',
                            loading: true,
                            onClick: () => {
                                this.clickCount++
                            },
                        })}
                        ${button({
                            label: '不可操作',
                            disabled: true,
                            onClick: () => {
                                this.clickCount++
                            },
                        })}
                        ${button({
                            label: '小按钮',
                            size: 'small',
                            onClick: () => {
                                this.clickCount++
                            },
                        })}
                    </div>`,
                )}
                ${section(
                    { title: '输入', description: '即时回写调用方草稿，数字清空保留未设置状态。' },
                    html`<div class="demo-grid">
                            ${textField({
                                name: 'name',
                                label: '商品名称',
                                value: this.name,
                                placeholder: '请输入名称',
                                hint: '展示输入回写',
                                onChange: (value) => {
                                    this.name = value
                                },
                            })}
                            ${numberField({
                                name: 'amount',
                                label: '数量',
                                value: this.amount,
                                min: 1,
                                max: 100,
                                integer: true,
                                hint: '1–100，留空表示未设置',
                                onChange: (value) => {
                                    this.amount = value
                                },
                            })}
                            ${selectField({
                                name: 'category',
                                label: '分类',
                                value: this.category,
                                options: [
                                    { value: '', label: '请选择' },
                                    { value: 'disabled', label: '不可选分类', disabled: true },
                                    { value: 'home', label: '家居' },
                                    { value: 'outdoor', label: '户外' },
                                ],
                                onChange: (value) => {
                                    this.category = value ?? ''
                                },
                            })}
                            ${textField({
                                name: 'readonly',
                                label: '只读字段',
                                value: '只读内容',
                                readOnly: true,
                            })}
                            ${textarea({
                                name: 'note',
                                label: '备注',
                                value: this.note,
                                onChange: (value) => {
                                    this.note = value
                                },
                            })}
                            ${textField({
                                name: 'error',
                                label: '校验状态示例',
                                value: '',
                                error: '请输入有效内容',
                                onChange: () => {},
                            })}
                        </div>
                        <div class="demo-row" style="margin-top:16px">
                            ${checkbox({
                                label: '受控复选框',
                                checked: this.checked,
                                onChange: (value) => {
                                    this.checked = value
                                },
                            })}
                        </div>`,
                )}
                ${section(
                    {
                        title: '图片与查看器',
                        description: '点击图片放大，支持切图和缩放。图片为本地测试图。',
                    },
                    html`<div class="demo-images">
                        <figure id="preview-image">
                            ${image({
                                src: this.src,
                                alt: '图片一',
                                images: pictures,
                                width: '160px',
                                height: '120px',
                            })}
                            <figcaption>等比适配 · 点击查看</figcaption>
                        </figure>
                        <figure>
                            ${image({
                                src: pictures[1]!.src,
                                alt: '裁剪图片',
                                fit: 'cover',
                                width: '120px',
                                height: '120px',
                            })}
                            <figcaption>裁剪填充</figcaption>
                        </figure>
                        <figure>
                            ${image({ alt: '暂无商品图片', width: '120px', height: '120px' })}
                            <figcaption>无图状态</figcaption>
                        </figure>
                        <figure id="failed-image">
                            ${image({
                                src: 'data:image/png;base64,broken',
                                alt: '失败示例',
                                width: '120px',
                                height: '120px',
                            })}
                            <figcaption>加载失败</figcaption>
                        </figure>
                    </div>`,
                )}
                ${section(
                    {
                        title: '页签与区块',
                        description: '方向键切换页签，隐藏页保留输入；折叠区块使用统一标题。',
                    },
                    html`<div class="demo-grid">
                        ${tabs({
                            id: 'demo',
                            label: '商品详情',
                            value: this.active,
                            onChange: (value) => {
                                this.active = value
                            },
                            items: [
                                {
                                    value: 'summary',
                                    label: '商品摘要',
                                    content: html`<p>摘要内容</p>
                                        <input
                                            class="mf-input"
                                            aria-label="页签保留输入"
                                            placeholder="输入后切换页签"
                                        />`,
                                },
                                {
                                    value: 'json',
                                    label: '完整 JSON',
                                    content: html`<pre>{ "preview": true }</pre>`,
                                },
                                {
                                    value: 'locked',
                                    label: '不可用页签',
                                    disabled: true,
                                    content: html``,
                                },
                            ],
                        })}
                        ${section(
                            { title: '展开详情', collapsible: true },
                            html`<p>展开后可以查看完整说明。</p>
                                <input class="mf-input" aria-label="折叠区保留输入" />`,
                        )}
                    </div>`,
                )}
                ${section(
                    {
                        title: '表格与分页',
                        description: '全选只作用于当前页可选行，已输出行不可选择。',
                        actions: button({
                            label: this.loading ? '显示数据' : '查看加载态',
                            onClick: () => {
                                this.loading = !this.loading
                            },
                        }),
                    },
                    html`
                        ${dataTable(
                            this.loading
                                ? []
                                : rows.map((row) =>
                                      this.page === 1
                                          ? row
                                          : {
                                                ...row,
                                                id: `${Number(row.id) + (this.page - 1) * 3}`,
                                                title: `示例商品 ${Number(row.id) + (this.page - 1) * 3}`,
                                            },
                                  ),
                            (row) => row.id,
                            [
                                {
                                    title: '商品',
                                    cell: (row) =>
                                        html`<div class="mf-product-cell">
                                            ${image({
                                                src: row.image,
                                                alt: row.title,
                                                images: pictures,
                                            })}
                                            <div class="mf-product-text">
                                                ${text({
                                                    value: row.title,
                                                    weight: 'medium',
                                                })}${text({
                                                    value: `商品 ID ${row.id}`,
                                                    size: 'small',
                                                    tone: 'muted',
                                                })}
                                            </div>
                                        </div>`,
                                },
                                {
                                    title: '价格',
                                    align: 'right',
                                    cell: (row) =>
                                        text({
                                            value: `CNY ${row.price.toFixed(2)}`,
                                            numeric: true,
                                        }),
                                },
                                {
                                    title: '状态',
                                    cell: (row) =>
                                        badge(
                                            row.id === '3' ? '已输出' : '待选择',
                                            row.id === '3' ? 'success' : 'neutral',
                                        ),
                                },
                            ],
                            {
                                loading: this.loading,
                                label: '组件示例商品',
                                selection: {
                                    selected: this.selected,
                                    disabledReason: (key) => (key === '3' ? '已输出' : ''),
                                    onToggle: (key, checked) => this.toggle([key], checked),
                                    onToggleAll: (keys, checked) => this.toggle(keys, checked),
                                },
                            },
                        )}
                        ${pager({
                            page: this.page,
                            pageSize: 3,
                            total: 9,
                            onPage: (page) => {
                                this.page = page
                            },
                        })}
                    `,
                )}
                ${section(
                    {
                        title: '状态与动效',
                        description: '沿用已封装的骨架屏和过渡；系统减少动态效果时直接切换。',
                    },
                    html`<div class="demo-grid">
                            <div>
                                ${statusNote(
                                    '需要核对',
                                    '结果尚未确认，请先查看原操作记录。',
                                    'warning',
                                )}${statusNote('读取失败', '请检查当前状态后重新读取。', 'error')}
                            </div>
                            <div>
                                ${emptyState('暂无数据', '调整筛选条件后重新查询。')}
                                <div class="demo-stack">
                                    ${skeleton({ width: '55%' })}${skeleton({ width: '85%' })}
                                </div>
                            </div>
                        </div>
                        ${button({
                            label: this.expanded ? '收起过渡示例' : '展开过渡示例',
                            expanded: this.expanded,
                            controls: 'demo-reveal',
                            onClick: () => {
                                this.expanded = !this.expanded
                            },
                        })}
                        <div id="demo-reveal">
                            ${collapse(
                                { show: this.expanded },
                                html`<div class="demo-reveal">高度过渡结束后恢复自然布局。</div>`,
                            )}
                        </div>`,
                )} `,
        )
    }
}
customElements.define('mf-ui-preview', UIPreview)
