import type {
    StageContext,
    StageProgram,
    EntryEvent,
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
const entry: EntryEvent<{ limit: number }> = {
    inputEventId: 'event-1',
    taskId: 'task-1',
    generation: '1',
    inputManifestId: 'manifest-1',
    values: { limit: 2 },
}
const arrival: InputEvent<{ item: Product }> = {
    ...entry,
    deliveryId: 'delivery-1',
    values: { item: product },
}
// @ts-expect-error 原始到达身份不能替代本次任务代次的输入事件身份。
const oldArrival: InputEvent = { deliveryId: 'delivery-1', values: {} }
// @ts-expect-error 代次必须保留为十进制字符串。
const invalidGeneration: EntryEvent = { ...entry, generation: 1 }
// @ts-expect-error 入口事件没有商品到达身份，不能伪造 deliveryId。
void entry.deliveryId
void arrival
void oldArrival
void invalidGeneration
function invalid(ctx: StageContext, result: TaskResultEvent) {
    // @ts-expect-error Goja 不提供 DOM。
    document.createElement('div')
    // @ts-expect-error Goja 不提供 fetch。
    fetch('https://example.invalid')
    // @ts-expect-error Node 全局变量与 Goja 隔离。
    process.exit(0)
    // @ts-expect-error 宿主不提供定时器。
    setTimeout(() => {}, 1)
    // @ts-expect-error 失败与未知事件不包含成功输出。
    result.output
    // @ts-expect-error Goja 源码不能取得浏览器 SDK 配置。
    ctx.config
}
void invalid
// @ts-expect-error 已退役的 lifecycle 对象 ABI 不再导出作者类型。
import type { LifecycleProgram } from '@mofang/contracts/goja'

// @ts-expect-error 独立 main API 已退役，根程序必须使用 mf.node/1。
import type { MainProgram } from '@mofang/contracts/goja'
