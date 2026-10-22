import type {
    MainProgram,
    LifecycleProgram,
    StageContext,
    InputEvent,
    TaskResultEvent,
    ReadContext,
} from '@mofang/contracts/goja'
import type { Product, Image, Video, BuiltinTypes } from '@mofang/contracts/business'
import type { MainContext } from '@mofang/contracts/goja'
const product: Product = {
    collection: { source: 'fixture', sourceUrl: 'https://example.invalid' },
    basic: { title: '商品', price: 1, currency: 'CNY' },
    images: [{ url: 'x', width: 10 }],
    videos: [{ url: 'x', durationSeconds: 2 }],
    skus: [{ skuCode: 'a', attributes: { color: 'blue' } }],
    attributes: { weight: 10 },
    references: { draftProductId: 'draft' },
}
void product
const main: MainProgram<{ item: Product }, { items: Product[] }> = {
    async main() {
        return { items: [product] }
    },
}
const lifecycle: LifecycleProgram = {
    createState: () => ({}),
    async onStart(ctx) {
        await Promise.resolve()
        ctx.view.replace({ ok: true })
    },
    tasks: {},
}
void main
void lifecycle
function invalid(ctx: StageContext, readonly: ReadContext, result: TaskResultEvent) {
    // @ts-expect-error Goja has no DOM.
    document.createElement('div')
    // @ts-expect-error Goja has no fetch.
    fetch('https://example.invalid')
    // @ts-expect-error Node globals are isolated.
    process.exit(0)
    // @ts-expect-error No timer host.
    setTimeout(() => {}, 1)
    // @ts-expect-error Runtime has no retired view_replace API.
    readonly.view_replace({})
    // @ts-expect-error Readonly hooks cannot produce candidates.
    readonly.outputs.append({})
    // @ts-expect-error Failed and unknown events do not contain successful output.
    result.output
    // @ts-expect-error Goja source cannot import a browser SDK runtime.
    ctx.config
}
void invalid
function mainMustReturn(ctx: MainContext<{ title?: string }>) {
    if (typeof ctx.input.title !== 'string') ctx.failNode('title required')
    // @ts-expect-error Main failNode does not abort JS or narrow the remaining control flow.
    return ctx.input.title.toUpperCase()
}
void mainMustReturn
