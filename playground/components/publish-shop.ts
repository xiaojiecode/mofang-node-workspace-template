import { LitElement, css, html, nothing } from 'lit'
import { panelStyles, button, radioGroup, publishShopDialog, platformIcon } from '@mofang/browser'
import type { PublishShop } from '@mofang/browser'
import { workbench } from './inspector'
import { validateShopDebug } from './report-debug'
import type { ShopDebugData } from './report-debug'

const shops: readonly PublishShop[] = [
    {
        id: 'us-beauty',
        platformId: 'tiktok_shop',
        regionLabel: '美国',
        name: 'Glow Beauty US',
        account: '美国美妆运营',
        defaultCategory: '美妆个护',
    },
    {
        id: 'us-home',
        platformId: 'tiktok_shop',
        regionLabel: '美国',
        name: 'Home Essentials',
        account: '家居运营',
        defaultCategory: '家居生活',
    },
    {
        id: 'us-expired',
        platformId: 'tiktok_shop',
        regionLabel: '美国',
        name: '待续期店铺',
        disabledReason: '店铺授权已失效，请重新授权',
    },
    { id: 'other-platform', platformId: 'amazon', regionLabel: '美国', name: '其他平台店铺' },
]
const defaultData: ShopDebugData = {
    productTitle: '保湿修护精华液 30ml',
    platformId: 'tiktok_shop',
    platformLabel: 'TikTok Shop',
    shops,
}

/** 店铺演示使用一份已提交值和本次弹窗草稿；JSON 只改变本地展示。 */
class PublishShopDemo extends LitElement {
    static override styles = [
        panelStyles,
        css`
            :host {
                display: block;
                height: 100%;
                min-height: 0;
            }
            .parameters {
                display: grid;
                gap: 12px;
            }
            .stage {
                min-height: 380px;
                padding: 20px;
            }
            .result {
                margin-top: 18px;
                font-size: 13px;
                color: #617084;
            }
        `,
    ]
    static override properties = {
        mode: { state: true },
        open: { state: true },
        selected: { state: true },
        result: { state: true },
        data: { state: true },
    }
    declare mode: string
    declare open: boolean
    declare selected: string | undefined
    declare committedId: string | undefined
    declare result: string
    declare data: ShopDebugData
    constructor() {
        super()
        this.mode = 'single'
        this.open = false
        this.result = ''
        this.data = defaultData
    }
    protected override render() {
        const data = this.data
        const available = this.mode === 'empty' ? [] : data.shops
        const content = html`<div class="stage">
                ${button({
                    label: this.mode === 'batch' ? '统一绑定发布店铺' : '选择发布店铺',
                    variant: 'accent',
                    onClick: () => {
                        this.selected =
                            available.find(
                                (shop) =>
                                    shop.id === this.committedId &&
                                    shop.platformId === data.platformId &&
                                    !shop.disabledReason,
                            )?.id ??
                            available.find(
                                (shop) =>
                                    shop.platformId === data.platformId && !shop.disabledReason,
                            )?.id
                        this.open = true
                    },
                })}${this.result
                    ? html`<p class="result" role="status">${this.result}</p>`
                    : nothing}
            </div>
            ${publishShopDialog({
                open: this.open,
                productTitle: data.productTitle,
                ...(data.productStatus ? { productStatus: data.productStatus } : {}),
                ...(this.mode === 'batch'
                    ? { batchCount: data.batchCount ?? 12 }
                    : data.batchCount !== undefined
                      ? { batchCount: data.batchCount }
                      : {}),
                platformId: data.platformId,
                platformLabel: data.platformLabel,
                platformIcon: platformIcon(data.platformId),
                shops: available,
                selectedId: this.selected,
                onSelectionChange: (id) => {
                    this.selected = id
                },
                onConfirm: (shop) => {
                    this.committedId = shop.id
                    this.result = `已在本地示例中选择 ${shop.name}`
                    this.open = false
                },
                onClose: () => {
                    this.open = false
                },
                onAuthorize: () => {
                    this.result = '此处由宿主连接店铺授权入口'
                    this.open = false
                },
            })}`
        return workbench(
            {
                id: 'publish-shop',
                title: '店铺弹窗用法与数据',
                description:
                    '输入商品、平台和店铺列表后应用。弹窗打开时从已提交值复制草稿，没有有效值时预选首个可用店铺；取消不提交。所有选择仅保存在本页。',
                usage: `import { panelStyles, publishShopDialog, tiktokShopIcon } from '@mofang/browser'\n// LitElement 使用 static styles = panelStyles\n// 打开时复制草稿，关闭退场期间不重置\npublishShopDialog({\n  open, productTitle, platformId, platformLabel,\n  platformIcon: tiktokShopIcon(), shops, selectedId: draftId,\n  onSelectionChange: id => { draftId = id },\n  onConfirm: shop => { committedId = shop.id; open = false },\n  onClose: () => { open = false },\n})`,
                parameters: [
                    {
                        name: 'shops',
                        description:
                            'id 唯一；只显示 platformId 匹配的店铺。disabledReason 禁用并显示原因。',
                    },
                    {
                        name: 'selectedId',
                        description: '本次草稿，可不填。JSON 提供时必须是当前平台可用店铺。',
                    },
                    { name: 'batchCount', description: '可选正整数；多件商品仍统一单选一家店铺。' },
                    {
                        name: 'onConfirm / onClose',
                        description: '确认才保存已提交值；取消、Escape、遮罩关闭不保存。',
                    },
                ],
                data: defaultData,
                defaultData,
                validate: validateShopDebug,
                onApply: (value) => {
                    this.data = value as ShopDebugData
                    this.mode = 'single'
                    this.committedId = this.data.selectedId
                    this.selected = this.data.selectedId
                    this.open = false
                    this.result = '已应用店铺 JSON 演示数据'
                },
                onReset: () => {
                    this.data = defaultData
                    this.mode = 'single'
                    this.selected = undefined
                    this.committedId = undefined
                    this.open = false
                    this.result = ''
                },
            },
            content,
            html`<div class="parameters">
                ${radioGroup({
                    name: 'shop-example',
                    label: '演示内容',
                    value: this.mode,
                    options: [
                        { value: 'single', label: '单件选择' },
                        { value: 'batch', label: '统一绑定' },
                        { value: 'empty', label: '无可用店铺' },
                    ],
                    onChange: (value) => {
                        this.mode = value
                        this.selected = undefined
                        this.result = ''
                    },
                })}
            </div>`,
        )
    }
}
customElements.define('mf-publish-shop-demo', PublishShopDemo)
