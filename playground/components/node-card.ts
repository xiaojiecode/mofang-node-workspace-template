import { LitElement, css, html } from 'lit'
import { button, cockpit, dataTable, nodeCard, panelStyles, tabs, textField } from '@mofang/browser'

/** 组合容器使用本地展示数据，翻页、输入和驾驶舱展开均不触发节点执行。 */
class NodeCardDemo extends LitElement {
    static override properties = {
        collapsed: { state: true },
        active: { state: true },
        keyword: { state: true },
    }
    static override styles = [
        panelStyles,
        css`
            :host {
                display: block;
                min-width: 0;
            }
            .demo-frame {
                height: 540px;
                min-height: 0;
                border: 1px solid var(--mf-line);
            }
            .demo-content {
                height: 100%;
                min-height: 0;
                padding: 18px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .demo-content > .mf-tabs {
                flex: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
            }
            .demo-content .mf-tab-panel > .mf-transition,
            .demo-content .mf-transition-content {
                height: 100%;
                min-height: 0;
            }
            .demo-table {
                height: 100%;
                min-height: 0;
                overflow: hidden;
            }
            .demo-table > .mf-table {
                height: 100%;
                max-height: none;
                box-sizing: border-box;
            }
            .demo-table table {
                min-width: 720px;
            }
        `,
    ]
    declare collapsed: boolean
    declare active: string
    declare keyword: string
    constructor() {
        super()
        this.collapsed = false
        this.active = 'list'
        this.keyword = ''
    }
    override render() {
        return html`<p class="mf-hint">
                NodeCard 填满有限高度；表格只在自身滚动，驾驶舱按 340 / 44px 切换且不压缩内部排版。
            </p>
            <div class="demo-frame">
                ${nodeCard(
                    {
                        collapsed: this.collapsed,
                        aside: cockpit({
                            id: 'node-card-demo',
                            title: '当前节点执行',
                            description: '本地容器示例',
                            collapsed: this.collapsed,
                            onCollapsedChange: (value) => {
                                this.collapsed = value
                            },
                            nodes: [],
                        }),
                    },
                    html`<section class="demo-content">
                        ${textField({
                            name: 'node-card-keyword',
                            label: '保留输入演示',
                            value: this.keyword,
                            onChange: (value) => {
                                this.keyword = value
                            },
                        })}${tabs({
                            id: 'node-card-tabs',
                            label: '业务内容',
                            value: this.active,
                            onChange: (value) => {
                                this.active = value
                            },
                            variant: 'underline',
                            items: [
                                {
                                    value: 'list',
                                    label: '商品列表',
                                    content: html`<div class="demo-table">
                                        ${dataTable(
                                            Array.from({ length: 24 }, (_, i) => ({
                                                id: String(i + 1),
                                                name: '本地演示商品 ' + (i + 1),
                                            })),
                                            (row) => row.id,
                                            [
                                                { title: '商品', cell: (row) => row.name },
                                                {
                                                    title: '说明',
                                                    cell: () => '表格自身承担横向与纵向滚动',
                                                },
                                                {
                                                    title: '操作',
                                                    cell: () =>
                                                        button({ label: '查看', disabled: true }),
                                                },
                                            ],
                                        )}
                                    </div>`,
                                },
                                {
                                    value: 'report',
                                    label: '结果说明',
                                    content: html`<p>
                                        本例只验证布局和页签切换；没有真实报告、能力或执行输出。
                                    </p>`,
                                },
                            ],
                        })}
                    </section>`,
                )}
            </div>`
    }
}
customElements.define('mf-node-card-demo', NodeCardDemo)
