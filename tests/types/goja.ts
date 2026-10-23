import type { StageContext, InputEvent, TaskResultEvent } from '@mofang/contracts/goja'
import type { Product, Image, Video, BuiltinTypes } from '@mofang/contracts/business'
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
function invalid(ctx: StageContext, result: TaskResultEvent) {
    // @ts-expect-error Goja has no DOM.
    document.createElement('div')
    // @ts-expect-error Goja has no fetch.
    fetch('https://example.invalid')
    // @ts-expect-error Node globals are isolated.
    process.exit(0)
    // @ts-expect-error No timer host.
    setTimeout(() => {}, 1)
    // @ts-expect-error Failed and unknown events do not contain successful output.
    result.output
    // @ts-expect-error Goja source cannot import a browser SDK runtime.
    ctx.config
}
void invalid
// @ts-expect-error Retired lifecycle object ABI has no author export.
import type { LifecycleProgram } from '@mofang/contracts/goja'

// @ts-expect-error Standalone main API is retired; root programs require mf.node/1.
import type { MainProgram } from '@mofang/contracts/goja'
