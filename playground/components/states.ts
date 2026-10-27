import { LitElement, css, html } from 'lit'
import { workbench } from './inspector'
import {
    panelStyles,
    selectField,
    radioGroup,
    executionAccordion,
    cascaderField,
    textField,
    capabilityCard,
    capabilityPanel,
    dialog,
    button,
    timeline,
    cockpit,
    progressBar,
} from '@mofang/browser'

const examples = {
    accordion: {
        label: '运行逻辑手风琴',
        modes: [
            ['content', '有记录'],
            ['empty', '空记录'],
            ['closed', '收起'],
        ],
    },
    select: {
        label: '下拉选择',
        modes: [
            ['content', '有选项'],
            ['empty', '无选项'],
            ['readonly', '只读'],
        ],
    },
    cascader: {
        label: '多级下拉',
        modes: [
            ['content', '有类目'],
            ['empty', '无类目'],
            ['readonly', '只读'],
        ],
    },
    field: {
        label: '表单字段',
        modes: [
            ['content', '正常'],
            ['error', '错误'],
            ['readonly', '只读'],
        ],
    },
    capability: {
        label: '能力卡片',
        modes: [
            ['content', '可选'],
            ['required', '必选'],
            ['disabled', '不可用'],
        ],
    },
    dialog: {
        label: '弹窗',
        modes: [
            ['content', '有内容'],
            ['empty', '空内容'],
            ['readonly', '只读配置'],
        ],
    },
    timeline: {
        label: '时间线',
        modes: [
            ['content', '有步骤'],
            ['empty', '空步骤'],
        ],
    },
    cockpit: {
        label: '节点驾驶舱',
        modes: [
            ['content', '有节点'],
            ['empty', '无节点'],
        ],
    },
    progress: {
        label: '进度条',
        modes: [
            ['zero', '0%'],
            ['full', '100%'],
            ['unknown', '不确定进度'],
        ],
    },
} as const
type Example = keyof typeof examples

/** 状态样例仅切换本地展示数据，不推进业务状态或调用外部服务。 */
class StateExamples extends LitElement {
    static override styles = [
        panelStyles,
        css`
            :host {
                display: block;
            }
            .controls {
                display: grid;
                gap: 18px;
                padding-bottom: 22px;
                border-bottom: 1px solid #e8ebf0;
            }
            .controls > .mf-field {
                width: min(360px, 100%);
                margin: 0;
            }
            .stage {
                min-height: 420px;
                padding-top: 24px;
            }
            .note {
                margin: 16px 0 0;
                color: #6b7280;
                font-size: 12px;
                line-height: 20px;
            }
            .cockpit-stage {
                --mf-cockpit-content-width: 348px;
                height: 420px;
                width: 350px;
                transition: width 160ms ease;
            }
            .cockpit-stage[data-collapsed] {
                width: 44px;
            }
            .mf-timeline {
                margin-top: 12px;
            }
            @media (prefers-reduced-motion: reduce) {
                .cockpit-stage {
                    transition: none;
                }
            }
        `,
    ]
    static override properties = {
        example: { state: true },
        mode: { state: true },
        value: { state: true },
        path: { state: true },
        open: { state: true },
        expanded: { state: true },
        enabled: { state: true },
        collapsed: { state: true },
    }
    declare example: Example
    declare mode: string
    declare value: string
    declare path: readonly string[]
    declare open: boolean
    declare expanded: boolean
    declare enabled: boolean
    declare collapsed: boolean
    constructor() {
        super()
        const initial = new URLSearchParams(location.search).get('example')
        this.example = initial && initial in examples ? (initial as Example) : 'accordion'
        this.mode = initial ? examples[this.example].modes[0][0] : 'empty'
        this.value = ''
        this.path = []
        this.open = false
        this.expanded = true
        this.enabled = true
        this.collapsed = false
    }
    private changeExample(value: string | undefined) {
        this.example = value as Example
        this.mode = examples[this.example].modes[0][0]
        this.open = false
        this.expanded = true
        this.value = ''
        this.path = []
    }
    private sample() {
        const empty = this.mode === 'empty'
        const readOnly = this.mode === 'readonly'
        switch (this.example) {
            case 'accordion':
                return executionAccordion({
                    id: 'state-example',
                    title: '节点运行逻辑',
                    tag: '执行',
                    open: this.expanded,
                    onOpenChange: (open) => {
                        this.expanded = open
                    },
                    rows: empty
                        ? []
                        : [{ id: 'read', tag: '理解', text: '读取当前节点输入和已确认参数' }],
                    emptyText: '暂无运行记录',
                })
            case 'select':
                return selectField({
                    name: 'state-select',
                    label: '示例选择',
                    value: this.value,
                    options: empty
                        ? []
                        : [
                              { value: 'one', label: '选项一' },
                              { value: 'two', label: '选项二' },
                          ],
                    readOnly,
                    onChange: (value) => {
                        this.value = value ?? ''
                    },
                })
            case 'cascader':
                return html`${cascaderField({
                        name: 'state-category',
                        label: '示例类目',
                        value: this.path,
                        options: empty
                            ? []
                            : [
                                  {
                                      value: 'home',
                                      label: '家居生活',
                                      children: [{ value: 'storage', label: '收纳整理' }],
                                  },
                              ],
                        readOnly,
                        onChange: (path) => {
                            this.path = path
                        },
                    })}
                    <p class="note">展开选择器，在搜索框输入“不存在的类目”可查看无匹配结果。</p>`
            case 'field':
                return textField({
                    name: 'state-text',
                    label: '示例名称',
                    required: true,
                    value: this.value,
                    readOnly,
                    ...(this.mode === 'error' ? { error: '请填写名称后再继续' } : {}),
                    onChange: (value) => {
                        this.value = value
                    },
                })
            case 'capability':
                return capabilityCard({
                    title: '数据筛选',
                    description: '按本地示例条件筛选候选商品',
                    enabled: this.enabled,
                    required: this.mode === 'required',
                    disabled: this.mode === 'disabled',
                    ...(this.mode === 'disabled'
                        ? { disabledReason: '当前示例展示不可用状态' }
                        : {}),
                    onToggle: (value) => {
                        this.enabled = value
                    },
                })
            case 'dialog':
                return html`${button({
                    label: '打开示例弹窗',
                    onClick: () => {
                        this.open = true
                    },
                })}
                ${readOnly
                    ? capabilityPanel(
                          {
                              open: this.open,
                              title: '只读配置',
                              confirmDisabled: true,
                              onClose: () => {
                                  this.open = false
                              },
                              onConfirm: () => {},
                          },
                          textField({
                              name: 'state-readonly-dialog',
                              label: '名称',
                              value: '本地只读内容',
                              readOnly: true,
                          }),
                      )
                    : dialog(
                          {
                              open: this.open,
                              title: empty ? '空内容弹窗' : '示例弹窗',
                              onClose: () => {
                                  this.open = false
                              },
                          },
                          empty ? html`` : html`<p>这是本地示例内容。</p>`,
                      )}`
            case 'timeline':
                return html`${timeline({
                    label: '示例过程',
                    items: empty
                        ? []
                        : [
                              {
                                  id: 'prepare',
                                  title: '读取输入',
                                  description: '本地步骤说明',
                                  tone: 'complete',
                              },
                          ],
                })}${empty
                    ? html`<p class="note">当前步骤数组为空，时间线不生成虚构步骤。</p>`
                    : html``}`
            case 'cockpit':
                return html`<div class="cockpit-stage" ?data-collapsed=${this.collapsed}>
                    ${cockpit({
                        id: 'states',
                        collapsed: this.collapsed,
                        onCollapsedChange: (value) => {
                            this.collapsed = value
                        },
                        nodes: empty
                            ? []
                            : [
                                  {
                                      id: 'sample',
                                      title: '选品调研',
                                      status: '待处理',
                                      controlLabel: '本地展示状态',
                                  },
                              ],
                    })}
                </div>`
            case 'progress':
                return progressBar({
                    label: '处理进度',
                    ...(this.mode === 'unknown' ? {} : { value: this.mode === 'zero' ? 0 : 100 }),
                })
        }
    }
    private content() {
        return html`<div class="controls">
                ${radioGroup({
                    name: 'example',
                    label: '组件',
                    value: this.example,
                    options: Object.entries(examples).map(([value, item]) => ({
                        value,
                        label: item.label,
                    })),
                    onChange: (value) => this.changeExample(value),
                })}${radioGroup({
                    name: 'example-state',
                    label: '展示状态',
                    value: this.mode,
                    options: examples[this.example].modes.map(([value, label]) => ({
                        value,
                        label,
                    })),
                    onChange: (value) => {
                        this.mode = value
                        this.expanded = value !== 'closed'
                        this.open = false
                    },
                })}
            </div>
            <div class="stage">${this.sample()}</div>`
    }
    protected override render() {
        return workbench(
            {
                id: 'state-examples',
                title: '用法与状态说明',
                description: '点击平铺选项比较同一组件的内容、空态与边界，所有数据仅保存在本地。',
                usage: '// 调用方显式提供数据和交互状态\nexecutionAccordion({ id: "logic", open, rows, onOpenChange })\nselectField({ name, label, value, options, onChange })',
                parameters: [
                    { name: '组件', description: '切换到对应公共组件的局部样例。' },
                    {
                        name: '展示状态',
                        description: '内容、空、错误或只读为演示配置，不表示真实节点事实。',
                    },
                ],
            },
            this.content(),
        )
    }
}
customElements.define('mf-state-examples', StateExamples)
