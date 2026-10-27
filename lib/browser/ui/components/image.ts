import { html, noChange, nothing } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'
import type { ElementPart } from 'lit/directive.js'
import { keyed } from 'lit/directives/keyed.js'
import { styleMap } from 'lit/directives/style-map.js'
import { button } from './controls'
import { skeleton } from './skeleton'
import { linkAddress, url } from './content'
import { scale } from './transition'

export type ImageItem = Readonly<{ src: string; alt?: string }>
export type ImageProps = Readonly<{
    src?: string
    alt: string
    width?: string
    height?: string
    fit?: 'contain' | 'cover'
    preview?: boolean
    /** 查看器中的同组图片；默认只查看当前图片。 */
    images?: readonly ImageItem[]
}>
export type ImageViewerProps = Readonly<{
    open: boolean
    images: readonly ImageItem[]
    index: number
    onIndexChange: (index: number) => void
    onClose: () => void
}>

/** 除业务 HTTP(S) 图片外，允许本地预览的图片 data URL 与浏览器 blob URL。 */
function imageAddress(value: string | undefined) {
    const source = value?.trim()
    if (
        source &&
        (/^data:image\/(png|jpeg|gif|webp|avif|svg\+xml)[;,]/i.test(source) ||
            /^blob:https?:\/\//i.test(source))
    )
        return source
    return linkAddress(source)
}

/** 原生顶层 dialog 管理遮罩和焦点，节点卸载时主动释放模态状态。 */
class DialogDirective extends AsyncDirective {
    private dialog: HTMLDialogElement | undefined
    override render(_open: boolean, _bind: (dialog: HTMLDialogElement) => void) {
        return noChange
    }
    override update(
        part: ElementPart,
        [open, bind]: [boolean, (dialog: HTMLDialogElement) => void],
    ) {
        this.dialog = part.element as HTMLDialogElement
        bind(this.dialog)
        this.wanted = open
        if (open) this.open()
        return noChange
    }
    private wanted = false
    private open() {
        queueMicrotask(() => {
            if (this.wanted && this.isConnected && this.dialog?.isConnected && !this.dialog.open)
                this.dialog.showModal()
        })
    }
    protected override disconnected() {
        this.dialog?.close()
    }
    protected override reconnected() {
        this.open()
    }
}
const modal = /* @__PURE__ */ directive(DialogDirective)

class ImageDirective extends AsyncDirective {
    private props!: ImageProps
    private source: string | undefined
    private state: 'loading' | 'ready' | 'error' = 'loading'
    private open = false
    private index = 0
    override render(p: ImageProps) {
        const source = imageAddress(p.src)
        if (source !== this.source) {
            this.source = source
            this.state = 'loading'
            this.open = false
        }
        this.props = p
        return this.template()
    }
    private refresh() {
        if (this.isConnected) this.setValue(this.template())
    }
    private template() {
        const p = this.props,
            source = this.source
        const images = p.images?.length ? p.images : source ? [{ src: source, alt: p.alt }] : []
        const preview = p.preview !== false && Boolean(source)
        const label = !source ? '暂无图片' : this.state === 'error' ? '图片加载失败' : '图片加载中'
        const picture = html`${source
            ? keyed(
                  source,
                  html`<img
                      src=${source}
                      alt=${p.alt}
                      loading="lazy"
                      decoding="async"
                      @load=${() => {
                          if (this.source === source) {
                              this.state = 'ready'
                              this.refresh()
                          }
                      }}
                      @error=${() => {
                          if (this.source === source) {
                              this.state = 'error'
                              this.refresh()
                          }
                      }}
                  />`,
              )
            : nothing}
        ${!source || this.state !== 'ready'
            ? html`<span class="mf-image-fallback" role="img" aria-label=${label}>
                  ${source && this.state === 'loading'
                      ? skeleton({ shape: 'rect', height: '100%' })
                      : html`<svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="3" />
                            <circle cx="8" cy="8" r="1.5" />
                            <path d="m4 18 5-5 3 3 3-5 5 7" />
                        </svg>`}
              </span>`
            : nothing}`
        return html`<span
                class="mf-image"
                data-state=${source ? this.state : 'empty'}
                style=${styleMap({
                    width: p.width ?? '48px',
                    height: p.height ?? '48px',
                    '--mf-image-fit': p.fit ?? 'contain',
                })}
            >
                ${preview
                    ? html`<button
                          class="mf-image-trigger"
                          type="button"
                          aria-label=${`查看图片：${p.alt || '商品图片'}`}
                          title=${this.state === 'error'
                              ? '图片加载失败，点击查看'
                              : '点击查看大图'}
                          @click=${() => {
                              this.index = Math.max(
                                  0,
                                  images.findIndex((item) => imageAddress(item.src) === source),
                              )
                              this.open = true
                              this.refresh()
                          }}
                      >
                          ${picture}
                          <span class="mf-image-preview-overlay" aria-hidden="true"
                              ><svg viewBox="0 0 24 24">
                                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                  <circle cx="12" cy="12" r="3" /></svg
                          ></span>
                      </button>`
                    : html`<span class="mf-image-static">${picture}</span>`} </span
            >${p.preview !== false
                ? imageViewer({
                      open: this.open,
                      images,
                      index: this.index,
                      onIndexChange: (index) => {
                          this.index = index
                          this.refresh()
                      },
                      onClose: () => {
                          this.open = false
                          this.refresh()
                      },
                  })
                : nothing}`
    }
    protected override disconnected() {
        this.open = false
    }
    protected override reconnected() {
        this.refresh()
    }
}
const renderImage = /* @__PURE__ */ directive(ImageDirective)

class ViewerDirective extends AsyncDirective {
    private props!: ImageViewerProps
    private zoom = 1
    private source: string | undefined
    private dialog: HTMLDialogElement | undefined
    private visible = false
    override render(p: ImageViewerProps) {
        const source = p.images[p.index]?.src
        if (!p.open || this.source !== source) this.zoom = 1
        this.source = source
        this.props = p
        if (p.open) this.visible = true
        return this.template()
    }
    private changeZoom(delta: number) {
        this.zoom = Math.min(3, Math.max(1, this.zoom + delta))
        if (this.isConnected) this.setValue(this.template())
    }
    private template() {
        const p = this.props,
            current = p.images[p.index]
        if (!current) return nothing
        const move = (offset: number) => {
            const next = p.index + offset
            if (next >= 0 && next < p.images.length) p.onIndexChange(next)
        }
        return html`<dialog
            class="mf-image-viewer"
            aria-label="图片查看"
            data-closing=${!p.open}
            ${modal(p.open, (dialog: HTMLDialogElement) => {
                this.dialog = dialog
            })}
            @cancel=${(event: Event) => {
                event.preventDefault()
                p.onClose()
            }}
            @click=${(event: MouseEvent) => {
                const dialog = event.currentTarget as HTMLDialogElement
                if (event.target !== dialog) return
                const box = dialog.getBoundingClientRect()
                if (
                    event.clientX < box.left ||
                    event.clientX > box.right ||
                    event.clientY < box.top ||
                    event.clientY > box.bottom
                )
                    p.onClose()
            }}
            @keydown=${(event: KeyboardEvent) => {
                if (event.key === 'Escape') event.stopPropagation()
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault()
                    event.stopPropagation()
                    move(event.key === 'ArrowRight' ? 1 : -1)
                }
            }}
        >
            ${scale(
                {
                    show: p.open,
                    duration: 180,
                    onHidden: () => {
                        if (this.props.open) return
                        this.dialog?.close()
                        if (this.visible) {
                            this.visible = false
                            if (this.isConnected) this.setValue(this.template())
                        }
                    },
                },
                this.visible
                    ? html`<div class="mf-viewer-surface">
                          <header class="mf-viewer-header">
                              <div>
                                  <strong>${current.alt || '图片预览'}</strong>
                                  <span class="mf-hint" role="status"
                                      >${p.index + 1} / ${p.images.length}</span
                                  >
                              </div>
                              ${button({ label: '关闭图片', onClick: p.onClose, variant: 'ghost' })}
                          </header>
                          <div class="mf-viewer-stage">
                              <div
                                  class="mf-viewer-canvas"
                                  style=${styleMap({
                                      width: `${this.zoom * 100}%`,
                                      height: `${this.zoom * 100}%`,
                                  })}
                              >
                                  ${image({
                                      src: current.src,
                                      alt: current.alt ?? '图片预览',
                                      width: '100%',
                                      height: '100%',
                                      preview: false,
                                  })}
                              </div>
                          </div>
                          <footer class="mf-viewer-footer">
                              <div class="mf-toolbar">
                                  ${button({
                                      label: '上一张',
                                      disabled: p.index === 0,
                                      onClick: () => move(-1),
                                  })}
                                  ${button({
                                      label: '下一张',
                                      disabled: p.index >= p.images.length - 1,
                                      onClick: () => move(1),
                                  })}
                              </div>
                              <div class="mf-toolbar">
                                  ${button({
                                      label: '缩小',
                                      disabled: this.zoom <= 1,
                                      onClick: () => this.changeZoom(-0.5),
                                  })}
                                  <span class="mf-hint" role="status"
                                      >${Math.round(this.zoom * 100)}%</span
                                  >
                                  ${button({
                                      label: '放大',
                                      disabled: this.zoom >= 3,
                                      onClick: () => this.changeZoom(0.5),
                                  })}
                                  ${button({
                                      label: '适应窗口',
                                      onClick: () => {
                                          this.zoom = 1
                                          this.setValue(this.template())
                                      },
                                  })}
                                  ${linkAddress(current.src)
                                      ? url({ href: current.src, label: '打开原图' })
                                      : nothing}
                              </div>
                          </footer>
                      </div>`
                    : html``,
            )}
        </dialog>`
    }
}
const renderViewer = /* @__PURE__ */ directive(ViewerDirective)

/** 图片加载、失败占位及可选查看入口；默认等比完整显示，源变化会重置加载状态。 */
export function image(p: ImageProps) {
    return renderImage(p)
}

/** 受控图片查看器；关闭和切图只回调调用方，缩放是查看器内部临时状态。 */
export function imageViewer(p: ImageViewerProps) {
    return renderViewer(p)
}
