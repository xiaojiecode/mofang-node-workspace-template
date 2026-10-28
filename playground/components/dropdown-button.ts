import { LitElement, css, html } from 'lit'
import { button, dropdownButton, panelStyles, statusNote } from '@mofang/browser'

/** 动作下拉的独立演示，结果仅记录本地选择。 */
class DropdownButtonExamples extends LitElement {
    static override properties = { result: { state: true }, locked: { state: true } }
    static override styles = [
        panelStyles,
        css`
            :host {
                display: grid;
                gap: 20px;
            }
            .dropdown-row {
                display: flex;
                gap: 16px;
                align-items: center;
                flex-wrap: wrap;
            }
        `,
    ]
    declare result: string
    declare locked: boolean

    constructor() {
        super()
        this.result = ''
        this.locked = false
    }

    override render() {
        return html`<div class="dropdown-row">
                ${dropdownButton({
                    label: '批量操作',
                    disabled: this.locked,
                    items: [
                        {
                            id: 'bind',
                            label: '批量绑定店铺',
                            onSelect: () => {
                                this.result = '批量绑定店铺'
                            },
                        },
                        {
                            id: 'pricing',
                            label: '批量定价',
                            disabledReason: '请先选择可定价商品',
                            onSelect: () => {
                                this.result = '不应触发禁用操作'
                            },
                        },
                        {
                            id: 'publish',
                            label: '批量发布',
                            onSelect: () => {
                                this.result = '批量发布'
                            },
                        },
                    ],
                })}${button({
                    label: this.locked ? '启用动作菜单' : '禁用动作菜单',
                    onClick: () => {
                        this.locked = !this.locked
                    },
                })}${dropdownButton({
                    label: '只读操作',
                    disabled: true,
                    items: [{ id: 'readonly', label: '不可执行操作', onSelect: () => {} }],
                })}
            </div>
            <p class="mf-hint">
                使用方向键跳过禁用项，Home/End 定位，Enter/空格确认，Escape、Tab 或点击外部关闭。
            </p>
            ${statusNote('本地选择结果', this.result || '尚未选择操作')}`
    }
}
customElements.define('mf-dropdown-button-examples', DropdownButtonExamples)
