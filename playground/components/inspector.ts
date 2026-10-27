import { LitElement, css, html, nothing } from 'lit'
import type { TemplateResult, PropertyValues } from 'lit'
import { validateSchemaInput } from './schema-validation'

export type DemoWorkbenchConfig = Readonly<{
    id: string
    title: string
    description: string
    usage: string
    parameters: readonly Readonly<{ name: string; description: string }>[]
    data?: unknown
    /** 与演示数据分开显示的本地 draft-07 数据结构。 */
    schema?: Record<string, unknown>
    /** 重置用的稳定初始副本；data 为动态有效值时显式提供。 */
    defaultData?: unknown
    validate?: (value: unknown) => string | undefined
    onApply?: (value: unknown) => void
    onReset?: () => void
}>

/** 演示工作台只解析 JSON 和回调本地状态，不编译或执行编辑区文本。 */
class DemoWorkbench extends LitElement {
    static override properties = {
        config: { attribute: false },
        draft: { state: true },
        error: { state: true },
        message: { state: true },
        collapsed: { state: true },
    }
    declare config: DemoWorkbenchConfig
    declare draft: string
    declare error: string
    declare message: string
    declare collapsed: boolean
    constructor() {
        super()
        this.config = {
            id: '',
            title: '用法与演示数据',
            description: '',
            usage: '',
            parameters: [],
        }
        this.draft = ''
        this.error = ''
        this.message = ''
        this.collapsed = false
    }
    protected override willUpdate(changed: PropertyValues<this>) {
        const previous = changed.get('config') as DemoWorkbenchConfig | undefined
        if (changed.has('config') && previous?.id !== this.config.id) {
            this.draft =
                this.config.data === undefined ? '' : JSON.stringify(this.config.data, null, 2)
            this.error = ''
            this.message = ''
        }
    }
    private apply() {
        let value: unknown
        try {
            value = JSON.parse(this.draft)
        } catch {
            this.error = 'JSON 格式不正确，请检查引号、逗号与括号。'
            this.message = ''
            return
        }
        const structureProblem = this.config.schema
            ? validateSchemaInput(this.config.schema, value)
            : undefined
        const problem = structureProblem ?? this.config.validate?.(value)
        if (problem) {
            this.error = problem
            this.message = ''
            return
        }
        this.config.onApply?.(value)
        this.error = ''
        this.message = '已应用到本地预览'
    }
    private reset() {
        this.config.onReset?.()
        this.draft =
            (this.config.defaultData ?? this.config.data) === undefined
                ? ''
                : JSON.stringify(this.config.defaultData ?? this.config.data, null, 2)
        this.error = ''
        this.message = '已恢复默认演示数据'
    }
    private schemaPanel() {
        const schema = this.config.schema
        if (!schema) return nothing
        return html`<details class="schema-panel">
            <summary>数据结构 · JSON Schema</summary>
            <p class="schema-name">${String(schema.title ?? '演示数据结构')}</p>
            <dl class="schema-metadata">
                <dt>标识</dt>
                <dd>${String(schema.$id ?? '本地 Schema')}</dd>
                <dt>版本</dt>
                <dd>${String(schema.$schema ?? '未标明')}</dd>
            </dl>
            <pre aria-label="只读 JSON Schema"><code>${JSON.stringify(schema, null, 2)}</code></pre>
            <p class="schema-note">
                结构只读；type 标识字段类型，required 列出必填字段。应用时先检查结构，再检查唯一 ID
                等约束。
            </p>
        </details>`
    }
    static override styles = css`
        :host {
            display: block;
            min-width: 0;
            min-height: 0;
            height: 100%;
            color: #303b4a;
            font-family: inherit;
        }
        * {
            box-sizing: border-box;
        }
        .workbench {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 386px;
            gap: 24px;
            min-height: 0;
            height: 100%;
            align-items: start;
        }
        .workbench[data-collapsed] {
            grid-template-columns: minmax(0, 1fr) 38px;
            gap: 12px;
        }
        .preview {
            min-width: 0;
            min-height: 0;
            height: 100%;
            overflow: auto;
        }
        aside {
            position: sticky;
            top: 0;
            border: 1px solid #e3e8ef;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 3px 14px #24456a05;
            max-height: calc(100dvh - 255px);
            overflow: auto;
            min-width: 0;
        }
        .rail-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            border: 0;
            background: #fff;
            border-bottom: 1px solid #e8edf3;
            color: #44546a;
            text-align: left;
            padding: 12px 14px;
            font-family: inherit;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            user-select: none;
        }
        .rail-toggle svg {
            width: 14px;
            height: 14px;
        }
        .workbench[data-collapsed] .rail-toggle {
            padding: 14px 11px;
            writing-mode: vertical-rl;
            gap: 12px;
        }
        .body {
            padding: 18px;
        }
        .description {
            font-size: 12px;
            line-height: 1.8;
            color: #6d7b8e;
            margin: 0 0 18px;
        }
        h3 {
            font-size: 12px;
            margin: 22px 0 12px;
            padding-top: 18px;
            border-top: 1px solid #edf0f5;
            font-weight: 600;
            color: #45566e;
        }
        h3:first-child {
            margin-top: 0;
            padding-top: 0;
            border-top: 0;
        }
        dl {
            margin: 0;
        }
        dt {
            font:
                12px ui-monospace,
                SFMono-Regular,
                Consolas,
                monospace;
            color: #315d93;
            margin-top: 10px;
            overflow-wrap: anywhere;
        }
        dd {
            margin: 3px 0 0;
            font-size: 12px;
            line-height: 1.7;
            color: #718096;
        }
        pre {
            white-space: pre-wrap;
            overflow-wrap: anywhere;
            line-height: 1.65;
            font:
                11px/1.75 ui-monospace,
                SFMono-Regular,
                Consolas,
                monospace;
            color: #41536b;
            background: #fff;
            border: 1px solid #e1e7ef;
            padding: 12px;
            border-radius: 4px;
            margin: 0;
            max-height: 280px;
            overflow: auto;
        }
        textarea {
            display: block;
            width: 100%;
            min-height: 220px;
            resize: vertical;
            border: 1px solid #d7e0eb;
            border-radius: 4px;
            background: #f9fbfe;
            color: #334155;
            padding: 10px;
            font:
                11px/1.7 ui-monospace,
                SFMono-Regular,
                Consolas,
                monospace;
            tab-size: 2;
        }
        textarea:focus {
            outline: 2px solid #acd0ff;
            outline-offset: 1px;
        }
        .actions {
            display: flex;
            gap: 8px;
            margin-top: 10px;
            position: sticky;
            bottom: -18px;
            background: #fff;
            padding: 12px 0;
            border-top: 1px solid #edf0f5;
        }
        .actions button {
            border: 1px solid #d8e1ec;
            background: #fff;
            color: #536279;
            border-radius: 4px;
            padding: 7px 11px;
            font-size: 12px;
            cursor: pointer;
            user-select: none;
        }
        .actions button:first-child {
            background: #338fff;
            border-color: #338fff;
            color: #fff;
        }
        .schema-panel {
            border-top: 1px solid #edf0f5;
            margin-top: 20px;
            padding-top: 18px;
        }
        .schema-panel summary {
            font-size: 12px;
            color: #45566e;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
        }
        .schema-name {
            font-size: 12px;
            margin: 12px 0 8px;
            color: #334e70;
        }
        .schema-metadata {
            margin-bottom: 12px;
        }
        .schema-metadata dt {
            font-size: 11px;
            color: #8190a4;
            margin-top: 5px;
        }
        .schema-metadata dd {
            font-size: 11px;
            overflow-wrap: anywhere;
        }
        .schema-note {
            font-size: 11px;
            line-height: 1.7;
            color: #8390a2;
            margin: 8px 0 0;
        }
        .feedback {
            min-height: 42px;
        }
        .error {
            font-size: 12px;
            color: #c33737;
            line-height: 1.7;
            overflow-wrap: anywhere;
            margin: 10px 0 0;
        }
        .message {
            font-size: 12px;
            color: #398054;
            line-height: 1.7;
            margin: 10px 0 0;
        }
        .controls {
            margin: 0 0 18px;
        }
        ::slotted([slot='controls']) {
            display: block;
        }
        @media (max-width: 1150px) {
            .workbench {
                grid-template-columns: minmax(0, 1fr) 310px;
                gap: 16px;
            }
        }
    `
    protected override render() {
        return html`<div class="workbench" ?data-collapsed=${this.collapsed}>
            <div class="preview"><slot name="preview"></slot></div>
            <aside aria-label="组件用法与调试">
                <button
                    class="rail-toggle"
                    type="button"
                    aria-expanded=${!this.collapsed}
                    @click=${() => {
                        this.collapsed = !this.collapsed
                    }}
                >
                    <span>${this.collapsed ? '展开调试' : this.config.title}</span
                    ><svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
                        <path d=${this.collapsed ? 'm6 3 5 5-5 5' : 'm10 3-5 5 5 5'} />
                    </svg>
                </button>
                ${this.collapsed
                    ? nothing
                    : html`<div class="body">
                          <p class="description">${this.config.description}</p>
                          <div class="controls"><slot name="controls"></slot></div>
                          <h3>用法示例</h3>
                          <pre><code>${this.config.usage}</code></pre>
                          ${this.config.parameters.length
                              ? html`<h3>参数说明</h3>
                                    <dl>
                                        ${this.config.parameters.map(
                                            (item) =>
                                                html`<dt>${item.name}</dt>
                                                    <dd>${item.description}</dd>`,
                                        )}
                                    </dl>`
                              : nothing}
                          ${this.schemaPanel()}
                          ${this.config.data === undefined || !this.config.onApply
                              ? nothing
                              : html`<h3><label for="demo-json">输入演示数据 · JSON</label></h3>
                                    <textarea
                                        id="demo-json"
                                        spellcheck="false"
                                        .value=${this.draft}
                                        @input=${(e: Event) => {
                                            this.draft = (e.target as HTMLTextAreaElement).value
                                            this.message = ''
                                        }}
                                    ></textarea>
                                    <div class="actions">
                                        <button type="button" @click=${() => this.apply()}>
                                            应用到预览</button
                                        ><button type="button" @click=${() => this.reset()}>
                                            恢复默认
                                        </button>
                                    </div>
                                    <div class="feedback">
                                        ${this.error
                                            ? html`<p class="error" role="alert">${this.error}</p>`
                                            : nothing}${this.message
                                            ? html`<p class="message" role="status">
                                                  ${this.message}
                                              </p>`
                                            : nothing}
                                    </div>`}
                      </div>`}
            </aside>
        </div>`
    }
}
customElements.define('mf-demo-workbench', DemoWorkbench)

/** 各示例共用一套右侧用法、参数和 JSON 调试入口，controls 可传受控表单模板。 */
export function workbench(
    config: DemoWorkbenchConfig,
    content: TemplateResult,
    controls?: TemplateResult,
) {
    return html`<mf-demo-workbench .config=${config}
        ><div slot="preview">${content}</div>
        ${controls ? html`<div slot="controls">${controls}</div>` : nothing}</mf-demo-workbench
    >`
}
