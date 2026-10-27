import { LitElement, css, html } from 'lit'
import { panelStyles, radioGroup, button } from '@mofang/browser'
import { reportDataSchema, reportDemoInputSchema } from './schema/report'
import { reportDemoData, reportOverviewData } from './report'

/** 报告结构独立提供给调用方；源 JSON 映射与组件纯数据明确区分。 */
class ReportSchemaPage extends LitElement {
    static override properties = { kind: { state: true }, message: { state: true } }
    declare kind: 'data' | 'source'
    declare message: string
    constructor() {
        super()
        this.kind = 'data'
        this.message = ''
    }
    static override styles = [
        panelStyles,
        css`
            :host {
                display: block;
                min-width: 0;
            }
            * {
                box-sizing: border-box;
            }
            .heading {
                display: flex;
                justify-content: space-between;
                gap: 24px;
                align-items: start;
                margin-bottom: 24px;
            }
            .heading p {
                font-size: 13px;
                color: #6b7a90;
                line-height: 1.8;
                max-width: 85ch;
                margin: 12px 0 0;
            }
            .actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                align-items: center;
            }
            .actions a {
                font-size: 12px;
                color: #338fff;
                text-decoration: none;
                white-space: nowrap;
            }
            .metadata {
                display: flex;
                gap: 18px;
                flex-wrap: wrap;
                padding: 14px 16px;
                border: 1px solid #e1e7ef;
                border-radius: 6px;
                background: #f8fafd;
                font-size: 12px;
                color: #62738a;
                margin-bottom: 20px;
                overflow-wrap: anywhere;
            }
            .metadata strong {
                color: #344f70;
            }
            .fields {
                margin-bottom: 24px;
            }
            .fields p {
                font-size: 12px;
                line-height: 1.9;
                margin: 6px 0;
                color: #617087;
            }
            .fields code {
                color: #285c9c;
            }
            .panes {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                gap: 22px;
            }
            h2 {
                font-size: 14px;
                margin: 0 0 10px;
                color: #42546d;
            }
            .panel {
                min-width: 0;
            }
            pre {
                height: 620px;
                max-height: calc(100dvh - 460px);
                min-height: 260px;
                overflow: auto;
                margin: 0;
                border: 1px solid #dfe7f0;
                background: #f9fbfe;
                border-radius: 6px;
                padding: 16px;
                white-space: pre;
                tab-size: 2;
                font:
                    12px/1.7 ui-monospace,
                    SFMono-Regular,
                    Consolas,
                    monospace;
                color: #334c6d;
            }
            .message {
                min-height: 22px;
                margin: 8px 0;
                font-size: 12px;
                color: #5b7696;
            }
        `,
    ]
    private schema() {
        return this.kind === 'data' ? reportDataSchema : reportDemoInputSchema
    }
    private async copy() {
        try {
            await navigator.clipboard.writeText(JSON.stringify(this.schema(), null, 2))
            this.message = '已复制 JSON Schema'
        } catch {
            this.message = '浏览器未允许复制，可直接选中下方只读文本复制。'
        }
    }
    private download() {
        const blob = new Blob([JSON.stringify(this.schema(), null, 2) + '\n'], {
            type: 'application/schema+json',
        })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download =
            this.kind === 'data'
                ? 'selection-report.schema.json'
                : 'selection-report-demo.schema.json'
        anchor.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
    protected override render() {
        const schema = this.schema()
        const example = this.kind === 'data' ? reportDemoData : reportOverviewData
        return html`<div class="heading">
                <div>
                    ${radioGroup({
                        name: 'report-schema-kind',
                        label: '选品报告 JSON Schema',
                        value: this.kind,
                        options: [
                            { value: 'data', label: '组件展示数据' },
                            { value: 'source', label: '当前演示源 JSON' },
                        ],
                        onChange: (value) => {
                            this.kind = value as 'data' | 'source'
                            this.message = ''
                        },
                    })}
                    <p>
                        ${this.kind === 'data'
                            ? '对应 SelectionReportData，后续调用 selectionReport({ data, ...受控回调 }) 时使用。结构只描述纯 JSON 数据，图标模板与动作回调由调用方代码提供。'
                            : '对应用户提供的 metric / score / trend / matrix / categories / source / action 七区块输入；预览先调用 mapReportFixture 映射为 SelectionReportData，不能直接当作组件 data。'}
                    </p>
                </div>
                <div class="actions">
                    ${button({
                        label: '复制 Schema',
                        onClick: () => {
                            void this.copy()
                        },
                    })}${button({ label: '下载 Schema', onClick: () => this.download() })}<a
                        href="?component=report"
                        >打开完整报告</a
                    >
                </div>
            </div>
            <div class="metadata">
                <strong>${String(schema.title ?? '选品报告数据结构')}</strong
                ><span>标识 ${String(schema.$id ?? '')}</span><span>版本 Draft-07</span>
            </div>
            <div class="fields">
                ${this.kind === 'data'
                    ? html`<p>
                              <code>title / context / categories</code> 为必填基础；类目通过唯一
                              <code>id</code> 关联受控选择。指标缺失允许省略，零值保持。
                          </p>
                          <p>
                              <code>vocabulary</code> 声明指标和公式的展示口径，<code
                                  >sources / methods / notes</code
                              >
                              承载来源与解释。函数、Lit 图标模板与运行时回调不写入 JSON。
                          </p>`
                    : html`<p>
                              七个顶层区块分别对应指标卡、评分、趋势、矩阵、对比类目、来源标识和行动建议；完整示例保持用户原始数值与说明。
                          </p>
                          <p>
                              该输入是演示专用映射格式。后续复用通用组件，优先选择“组件展示数据”结构。
                          </p>`}
            </div>
            <div class="panes">
                <section class="panel">
                    <h2>数据结构 · JSON Schema（只读）</h2>
                    <pre aria-label="选品报告 JSON Schema"><code>${JSON.stringify(
                        schema,
                        null,
                        2,
                    )}</code></pre>
                </section>
                <section class="panel">
                    <h2>完整示例 · JSON 数据（只读）</h2>
                    <pre aria-label="选品报告完整示例"><code>${JSON.stringify(
                        example,
                        null,
                        2,
                    )}</code></pre>
                </section>
            </div>
            <p class="message" role="status">${this.message}</p>`
    }
}
customElements.define('mf-report-schema-page', ReportSchemaPage)
