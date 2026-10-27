import { css, html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { live } from 'lit/directives/live.js'
import { repeat } from 'lit/directives/repeat.js'
import { dialog } from './dialog'
import type { DialogCloseReason } from './dialog'
import { card } from './card'
import { button } from './controls'
import { footer } from './layout'

export type PublishShop = Readonly<{
    id: string
    platformId: string
    regionLabel: string
    name: string
    account?: string
    defaultCategory?: string
    disabledReason?: string
}>

export type PublishShopDialogProps = Readonly<{
    open: boolean
    productTitle: string
    productStatus?: string
    /** 一次统一绑定的商品件数；目标店铺仍为单选。 */
    batchCount?: number
    platformId: string
    platformLabel: string
    /** 平台标识由调用方按需传入，避免单一业务弹窗带入全量图标。 */
    platformIcon?: TemplateResult
    shops: readonly PublishShop[]
    selectedId: string | undefined
    onSelectionChange: (shopId: string) => void
    onConfirm: (shop: PublishShop) => void
    onClose: (reason: DialogCloseReason) => void
    onAuthorize?: () => void
}>

/** 发布店铺单选弹窗只交接所选对象，不保存绑定、不授权店铺、不提交发布。 */
export function publishShopDialog(p: PublishShopDialogProps) {
    const shops = p.shops.filter((shop) => shop.platformId === p.platformId)
    const selected = shops.find((shop) => shop.id === p.selectedId && !shop.disabledReason)
    const batch = p.batchCount !== undefined && p.batchCount > 1
    const choose = (shop: PublishShop) => {
        if (!shop.disabledReason) p.onSelectionChange(shop.id)
    }
    return html`<div class="mf-publish-shop-host">
        ${dialog(
            {
                open: p.open,
                title: batch ? '统一绑定发布店铺' : '选择发布店铺',
                onClose: p.onClose,
                footer: footer({
                    actions: html`${button({
                        label: '稍后再说',
                        onClick: () => p.onClose('cancel'),
                    })}${!shops.length && p.onAuthorize
                        ? button({ label: '去授权店铺', variant: 'accent', onClick: p.onAuthorize })
                        : button({
                              label: batch
                                  ? `确认统一绑定 (${selected ? 1 : 0})`
                                  : `确认绑定店铺 (${selected ? 1 : 0})`,
                              variant: 'accent',
                              disabled: !selected,
                              onClick: () => {
                                  if (selected) p.onConfirm(selected)
                              },
                          })}`,
                }),
            },
            html`<div class="mf-publish-shop-hero">
                    <span class="mf-publish-shop-symbol" aria-hidden="true"
                        ><svg
                            viewBox="0 0 32 32"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.4"
                        >
                            <path
                                d="m6 13 2-7h16l2 7M7 17v10h18V17M6 13c0 5 5 5 5 1 0 4 5 4 5 0 0 4 5 4 5 0 0 4 5 4 5-1Z"
                            /></svg
                    ></span>
                    <h3>${batch ? '统一绑定发布店铺' : '请先绑定发布店铺'}</h3>
                    <p>请选择目标店铺。绑定后可继续修改，点击发布才会提交。</p>
                </div>
                <div class="mf-publish-shop-product">
                    ${card(
                        { variant: 'compact' },
                        html`<span
                                >${batch
                                    ? `所选待绑定商品（${p.batchCount} 件）`
                                    : p.productTitle}</span
                            ><span class="mf-publish-shop-badge"
                                >${p.productStatus ?? (batch ? '待统一绑定' : '未绑定')}</span
                            >`,
                    )}
                </div>
                <div class="mf-publish-shop-heading">
                    <strong>可选店铺</strong>${p.platformIcon ?? nothing}<span
                        class="mf-publish-shop-platform"
                        >${p.platformLabel}</span
                    ><span class="mf-publish-shop-count">${shops.length} 家店铺</span>
                </div>
                ${shops.length
                    ? html`<div
                          class="mf-publish-shop-list"
                          role="radiogroup"
                          aria-label="可选发布店铺"
                          @keydown=${(event: KeyboardEvent) => {
                              if (
                                  ![
                                      'ArrowDown',
                                      'ArrowUp',
                                      'ArrowLeft',
                                      'ArrowRight',
                                      'Home',
                                      'End',
                                  ].includes(event.key)
                              )
                                  return
                              const enabled = shops.filter((shop) => !shop.disabledReason)
                              if (!enabled.length) return
                              event.preventDefault()
                              const index = enabled.findIndex((shop) => shop.id === p.selectedId)
                              const next =
                                  event.key === 'Home'
                                      ? 0
                                      : event.key === 'End'
                                        ? enabled.length - 1
                                        : ((index < 0
                                              ? event.key === 'ArrowDown' ||
                                                event.key === 'ArrowRight'
                                                  ? -1
                                                  : 0
                                              : index) +
                                              (event.key === 'ArrowDown' ||
                                              event.key === 'ArrowRight'
                                                  ? 1
                                                  : -1) +
                                              enabled.length) %
                                          enabled.length
                              const target = enabled[next]!
                              choose(target)
                              const root = event.currentTarget as HTMLElement
                              root.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
                                  if (input.value === target.id) input.focus()
                              })
                          }}
                      >
                          ${repeat(
                              shops,
                              (shop) => shop.id,
                              (shop) =>
                                  html`<label
                                      class="mf-publish-shop-option"
                                      data-selected=${shop.id === p.selectedId}
                                      data-disabled=${Boolean(shop.disabledReason)}
                                      title=${shop.disabledReason ?? ''}
                                      ><input
                                          type="radio"
                                          tabindex=${selected
                                              ? shop.id === selected.id
                                                  ? 0
                                                  : -1
                                              : shop.id ===
                                                  shops.find((item) => !item.disabledReason)?.id
                                                ? 0
                                                : -1}
                                          value=${shop.id}
                                          aria-label=${`${shop.regionLabel} ${shop.name}${shop.account ? ` (${shop.account})` : ''}`}
                                          .checked=${live(shop.id === p.selectedId)}
                                          ?disabled=${Boolean(shop.disabledReason)}
                                          @change=${() => choose(shop)} /><span
                                          class="mf-publish-shop-copy"
                                          ><span
                                              ><span class="mf-publish-shop-region"
                                                  >${shop.regionLabel}</span
                                              ><strong
                                                  >${shop.name}${shop.account
                                                      ? ` (${shop.account})`
                                                      : ''}</strong
                                              ></span
                                          ><small
                                              >默认类目：${shop.defaultCategory || '未设置'}</small
                                          >${shop.disabledReason
                                              ? html`<small class="mf-publish-shop-error"
                                                    >${shop.disabledReason}</small
                                                >`
                                              : nothing}</span
                                      ><svg
                                          class="mf-publish-shop-check"
                                          viewBox="0 0 20 20"
                                          aria-hidden="true"
                                      >
                                          <rect x="1" y="1" width="18" height="18" rx="4" />
                                          <path
                                              d="m5 10 3 3 7-7"
                                              fill="none"
                                              stroke="white"
                                              stroke-width="2"
                                          /></svg
                                  ></label>`,
                          )}
                      </div>`
                    : html`<div class="mf-publish-shop-empty">
                          <strong>暂无可选店铺</strong>
                          <p>当前平台尚无可选发布店铺。</p>
                      </div>`}`,
        )}
    </div>`
}

/** 选择列表在弹窗正文内滚动，默认类目与禁用原因可复制，交互标签不选中文字。 */
export const publishShopDialogStyles = /* @__PURE__ */ (() => css`
    .mf-publish-shop-host .mf-dialog {
        width: min(480px, calc(100vw - 48px));
        border-radius: 16px;
    }
    .mf-publish-shop-host .mf-dialog-header {
        position: relative;
        height: 0;
        flex: 0 0 0;
        padding: 0;
        border: 0;
    }
    .mf-publish-shop-host .mf-dialog-header h2 {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
    }
    .mf-publish-shop-host .mf-dialog-close {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 1;
    }
    .mf-publish-shop-host .mf-dialog-body {
        padding: 26px 22px 18px;
    }
    .mf-publish-shop-hero {
        text-align: center;
        margin-bottom: 18px;
    }
    .mf-publish-shop-symbol {
        width: 58px;
        height: 58px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ffe394;
        background: #fffbee;
        border-radius: 50%;
        color: #eeb93d;
        margin-bottom: 12px;
    }
    .mf-publish-shop-symbol svg {
        width: 30px;
        height: 30px;
    }
    .mf-publish-shop-hero h3 {
        font-size: 17px;
        margin: 0 0 8px;
    }
    .mf-publish-shop-hero p {
        color: #7a7f88;
        font-size: 12px;
        line-height: 1.7;
        margin: 0;
    }
    .mf-publish-shop-product .mf-card {
        background: #f8f9fb;
        border-color: #eceef1;
        padding: 10px 12px;
        margin-bottom: 16px;
    }
    .mf-publish-shop-product .mf-card-body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        font-size: 13px;
    }
    .mf-publish-shop-product .mf-card-body > span:first-child {
        min-width: 0;
        overflow-wrap: anywhere;
    }
    .mf-publish-shop-badge {
        flex: 0 0 auto;
        color: #bc8507;
        border: 1px solid #ffe19a;
        background: #fffbed;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 11px;
    }
    .mf-publish-shop-heading {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        margin-bottom: 8px;
    }
    .mf-publish-shop-platform {
        padding: 1px 5px;
        background: #338fff;
        color: #fff;
        border-radius: 3px;
        font-size: 11px;
    }
    .mf-publish-shop-count {
        margin-left: auto;
        color: #9298a2;
        font-size: 11px;
    }
    .mf-publish-shop-list {
        display: grid;
        gap: 8px;
    }
    .mf-publish-shop-option {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 12px;
        border: 1px solid #e3e7ed;
        border-radius: 7px;
        cursor: pointer;
    }
    .mf-publish-shop-option[data-selected='true'] {
        background: #f0f7ff;
        border-color: #338fff;
    }
    .mf-publish-shop-option[data-disabled='true'] {
        background: #fafafa;
        opacity: 0.6;
        cursor: not-allowed;
    }
    .mf-publish-shop-option input {
        position: absolute;
        opacity: 0;
        width: 1px;
        height: 1px;
    }
    .mf-publish-shop-option:has(input:focus-visible) {
        outline: 2px solid #87bbff;
        outline-offset: 2px;
    }
    .mf-publish-shop-copy {
        flex: 1;
        min-width: 0;
        display: grid;
        gap: 5px;
    }
    .mf-publish-shop-copy > span {
        display: flex;
        flex-wrap: wrap;
        gap: 5px 8px;
        align-items: center;
    }
    .mf-publish-shop-copy strong {
        font-size: 13px;
        font-weight: 600;
        overflow-wrap: anywhere;
        user-select: none;
    }
    .mf-publish-shop-region {
        color: #338fff;
        font-size: 11px;
        padding: 1px 5px;
        border: 1px solid #c8e2ff;
        border-radius: 3px;
        user-select: none;
    }
    .mf-publish-shop-copy small {
        color: #8a929f;
        font-size: 11px;
    }
    .mf-publish-shop-copy .mf-publish-shop-error {
        color: #bd543d;
    }
    .mf-publish-shop-check {
        width: 17px;
        height: 17px;
        flex-shrink: 0;
        fill: #c7cdd5;
    }
    .mf-publish-shop-option[data-selected='true'] .mf-publish-shop-check {
        fill: #338fff;
    }
    .mf-publish-shop-option:not([data-selected='true']) .mf-publish-shop-check path {
        visibility: hidden;
    }
    .mf-publish-shop-empty {
        padding: 28px 12px;
        text-align: center;
    }
    .mf-publish-shop-empty strong {
        font-size: 14px;
    }
    .mf-publish-shop-empty p {
        color: #8b929d;
        font-size: 12px;
        margin-top: 7px;
    }
    .mf-publish-shop-host .mf-footer {
        background: #fafbfc;
        padding: 12px 18px;
    }
`)()
