import { LitElement, css, html, nothing } from 'lit'
import { collapse, fade, panelStyles, scale, slide } from '@mofang/browser'
import type { SlideProps } from '@mofang/browser'

type Effect = 'fade' | 'slide' | 'scale' | 'collapse'
const effects = [
    { key: 'fade', title: '淡入淡出', description: '透明度变化，适合提示与内容区。' },
    { key: 'slide', title: '滑动', description: '移动 12px 并淡入淡出。' },
    { key: 'scale', title: '缩放', description: '从 96% 恢复原尺寸。' },
    { key: 'collapse', title: '展开收起', description: '按内容高度变化，结束后恢复自然布局。' },
] as const

/** 独立组件预览和浏览器回归夹具，不挂接节点或平台 SDK。 */
class TransitionPreview extends LitElement {
    static override styles = [
        panelStyles,
        css`
            :host {
                max-width: 1000px;
                margin: auto;
            }
            header {
                margin-bottom: 28px;
            }
            header p,
            article > p {
                color: var(--mf-muted);
                margin-top: 8px;
            }
            .controls {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 16px;
                margin-top: 16px;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 20px;
            }
            article {
                min-width: 0;
                padding: 24px;
                border: 1px solid var(--mf-line);
                border-radius: 12px;
                background: var(--mf-bg);
            }
            article > button {
                margin: 16px 0;
            }
            .content {
                padding: 18px;
                border-radius: 8px;
                background: var(--mf-soft);
            }
            .content label {
                display: grid;
                gap: 8px;
            }
            .content p {
                margin-top: 12px;
            }
            .content button {
                margin-top: 12px;
            }
            .after {
                padding-top: 14px;
                font-size: 12px;
                color: var(--mf-muted);
            }
            select {
                font: inherit;
                padding: 4px 8px;
            }
            @media (max-width: 650px) {
                .grid {
                    grid-template-columns: 1fr;
                }
            }
        `,
    ]
    static override properties = {
        open: { state: true },
        duration: { state: true },
        direction: { state: true },
        extra: { state: true },
        mounted: { state: true },
    }
    declare open: Record<Effect, boolean>
    declare duration: number
    declare direction: NonNullable<SlideProps['direction']>
    declare extra: number
    declare mounted: boolean

    constructor() {
        super()
        this.open = { fade: true, slide: true, scale: true, collapse: true }
        this.duration = 180
        this.direction = 'up'
        this.extra = 0
        this.mounted = true
    }

    /** 切换预览显隐，调用方始终提供同一份内容模板。 */
    toggle(effect: Effect) {
        this.open = { ...this.open, [effect]: !this.open[effect] }
    }

    protected override render() {
        return html`<header>
                <h2>动画过渡组件</h2>
                <p>关闭后保留内容。输入文字，再收起并展开，检查输入是否仍在。</p>
                <div class="controls">
                    <label>
                        <input
                            type="checkbox"
                            @change=${(event: Event) => {
                                this.duration = (event.target as HTMLInputElement).checked
                                    ? 600
                                    : 180
                            }}
                        />
                        慢速演示（600ms）
                    </label>
                    <label>
                        滑动进入方向
                        <select
                            @change=${(event: Event) => {
                                this.direction = (event.target as HTMLSelectElement)
                                    .value as typeof this.direction
                            }}
                        >
                            <option value="up">向上</option>
                            <option value="down">向下</option>
                            <option value="left">向左</option>
                            <option value="right">向右</option>
                        </select>
                    </label>
                </div>
            </header>
            <div class="grid">
                ${effects.map(({ key, title, description }) => {
                    const content = html`<div class="content">
                        <label>
                            ${title} · 保留输入
                            <input class="mf-input" placeholder="输入任意文字" />
                        </label>
                        ${key === 'collapse'
                            ? html`<button
                                      class="mf-button"
                                      @click=${() => {
                                          this.extra++
                                      }}
                                  >
                                      增加一行内容
                                  </button>
                                  ${Array.from(
                                      { length: this.extra },
                                      (_, index) => html`<p>新增内容 ${index + 1}</p>`,
                                  )}`
                            : nothing}
                    </div>`
                    const props = { show: this.open[key], duration: this.duration }
                    const templates = {
                        fade: () => fade(props, content),
                        slide: () => slide({ ...props, direction: this.direction }, content),
                        scale: () => scale(props, content),
                        collapse: () => collapse(props, content),
                    }
                    return html`<article id=${key}>
                        <h3>${title}</h3>
                        <p>${description}</p>
                        <button
                            class="mf-button"
                            aria-expanded=${this.open[key]}
                            aria-controls=${`${key}-region`}
                            @click=${() => this.toggle(key)}
                        >
                            ${this.open[key] ? '收起' : '展开'}${title}
                        </button>
                        <div id=${`${key}-region`}>
                            ${this.mounted ? templates[key]() : nothing}
                        </div>
                        <div class="after">后续内容随显隐恢复布局</div>
                    </article>`
                })}
            </div>`
    }
}

customElements.define('mf-transition-preview', TransitionPreview)
