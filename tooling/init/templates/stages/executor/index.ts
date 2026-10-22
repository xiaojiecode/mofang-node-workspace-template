import type { StageProgram, JSONObject } from '@mofang/contracts/goja'
import type { Input, Output } from '../contract'
import { copyProduct } from '../shared/copy-product'
// noinspection JSUnusedGlobalSymbols
export default {
    entry: 'copy',
    steps: {
        /**
         * 普通节点的 copy 阶段：每次执行都由新的 VM 读取 ctx.input 与已保存阶段状态。
         * 本例仅深拷贝商品并完成；需要外部业务时，每阶段至多调用一次 ctx.call。
         * 阶段 ctx.complete / next / awaitUser 等终结方法会中断当前阶段，不能在其后继续写业务。
         */
        async copy(ctx) {
            const item = copyProduct(ctx.input.item)
            await Promise.resolve()
            return ctx.complete({ items: [item], report: { received: 1 } })
        },
    },
} satisfies StageProgram<Input, JSONObject, Output>
