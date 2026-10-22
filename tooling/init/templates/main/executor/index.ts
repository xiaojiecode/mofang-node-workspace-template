import type { MainProgram } from '@mofang/contracts/goja'
import type { Input, Output } from '../contract'
import { copyProduct } from '../shared/copy-product'
// noinspection JSUnusedGlobalSymbols
export default {
    /**
     * 单次程序入口，ctx.input 是冻结输入，返回值是完整输出对象。
     * main 的 complete / failNode 等方法只登记意图，调用后必须显式 return。
     * await 只能等待在本次调用内已 settle 的值，不提供 Node.js、网络或定时器事件循环。
     */
    async main(ctx) {
        await Promise.resolve()
        return { items: [copyProduct(ctx.input.item)], report: { received: 1 } }
    },
} satisfies MainProgram<Input, Output>
