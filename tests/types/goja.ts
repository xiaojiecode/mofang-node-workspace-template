import type {
    StageContext,
    StageProgram,
    InputEvent,
    TaskResultEvent,
} from '@mofang/contracts/goja'
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
// 别名丢失会把导入和下游属性退化为 any；这些断言必须保持具体类型。
type IsAny<T> = 0 extends 1 & T ? true : false
type ExpectFalse<T extends false> = T
type ProductIsTyped = ExpectFalse<IsAny<Product>>
type AttributesAreTyped = ExpectFalse<IsAny<NonNullable<Product['attributes']>>>
type AttributeValuesAreTyped = ExpectFalse<IsAny<NonNullable<Product['attributes']>[string]>>
const attributes = product.attributes ?? {}
// @ts-expect-error 扩展属性是 unknown，必须先验证才能作为数字使用。
const unverifiedWeight: number = attributes.weight
void unverifiedWeight
const typedTask: StageProgram<{ keyword: string }, { attempt: number }, { items: Product[] }> = {
    entry: 'search',
    steps: {
        search(ctx) {
            type ContextIsTyped = ExpectFalse<IsAny<typeof ctx>>
            type InputIsTyped = ExpectFalse<IsAny<typeof ctx.input>>
            const keyword: string = ctx.input.keyword
            // @ts-expect-error 泛型输入不能读取未声明字段。
            ctx.input.missing
            // @ts-expect-error 泛型输入必须保留字段类型。
            const numberKeyword: number = ctx.input.keyword
            void keyword
            void numberKeyword
            return ctx.complete({ items: [product] })
        },
    },
}
void typedTask
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
