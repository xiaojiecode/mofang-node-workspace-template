import { LitElement, css, html } from 'lit'
import { dateTimeField, panelStyles, textField } from '@mofang/browser'

/** 日期组件的本地演示，值始终为调用方持有的标准字符串。 */
class DateTimeExamples extends LitElement {
    static override properties = {
        date: { state: true },
        dateTime: { state: true },
        note: { state: true },
    }
    static override styles = [
        panelStyles,
        css`
            :host {
                display: grid;
                gap: 20px;
                max-width: 520px;
            }
        `,
    ]
    declare date: string
    declare dateTime: string
    declare note: string

    constructor() {
        super()
        this.date = ''
        this.dateTime = ''
        this.note = ''
    }

    /** 通过日期、时间及不可编辑示例展示统一日历的确认与取消边界。 */
    override render() {
        return html`${dateTimeField({
                name: 'demo-date',
                label: '日期',
                mode: 'date',
                value: this.date,
                min: '2026-10-01',
                max: '2026-12-31',
                compact: true,
                hint: '点击整框打开日历；可选范围：2026-10-01 至 2026-12-31，确认后才回写。',
                onChange: (value) => {
                    this.date = value
                },
            })}${dateTimeField({
                name: 'demo-date-time',
                label: '本地日期时间',
                value: this.dateTime,
                min: '2026-10-01T00:00',
                max: '2026-12-31T23:59',
                compact: true,
                hint: '宽屏使用日历与时间双区，窄屏自动单列；取消、Escape或外点均保留原值。',
                onChange: (value) => {
                    this.dateTime = value
                },
            })}<output aria-label="当前受控值" class="mf-hint"
                >日期：${this.date || '空'}<br />本地时间：${this.dateTime ||
                '空'}；浮层草稿只有确认后才出现在这里。</output
            >${textField({
                name: 'date-note',
                label: '其它字段',
                value: this.note,
                compact: true,
                onChange: (value) => {
                    this.note = value
                },
            })}${dateTimeField({
                name: 'readonly-date',
                label: '只读日期',
                value: '2026-10-28',
                mode: 'date',
                readOnly: true,
                compact: true,
                onChange: () => {},
            })}${dateTimeField({
                name: 'disabled-date',
                label: '禁用日期',
                value: '',
                mode: 'date',
                disabled: true,
                compact: true,
                onChange: () => {},
            })}${dateTimeField({
                name: 'unbound-date',
                label: '未提供回调',
                value: '',
                mode: 'date',
                compact: true,
            })}`
    }
}
customElements.define('mf-date-time-examples', DateTimeExamples)
