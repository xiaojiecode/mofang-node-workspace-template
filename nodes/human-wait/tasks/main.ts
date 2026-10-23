import type { StageProgram, StageContext } from '@mofang/node'
import type { Input, Output } from '../contract'
import { copyProduct } from '../contract'

/** 沿现有真实 awaitUser 等待身份/回合恢复，回答保存在 ctx.answer；不建立跨事件 Promise。 */
export const approvalProgram: StageProgram<Input, Record<string, never>, Output> = {
    entry: 'ask',
    steps: {
        ask(ctx) {
            return ctx.awaitUser({
                prompt: '是否保留本商品？请回答 {"approved":true} 或 {"approved":false}',
                nextStep: 'answer',
                data: {},
            })
        },
        answer(ctx: StageContext<Input, Record<string, never>, Output, unknown>) {
            const answer: unknown = ctx.answer
            if (
                !answer ||
                typeof answer !== 'object' ||
                Array.isArray(answer) ||
                !('approved' in answer) ||
                typeof answer.approved !== 'boolean'
            ) {
                return ctx.awaitUser({
                    prompt: '回答必须包含布尔字段 approved，请重新回答',
                    nextStep: 'answer',
                    data: {},
                })
            }
            if (!answer.approved) return ctx.complete({ items: [] })
            return ctx.complete({ items: [copyProduct(ctx.input.item)] })
        },
    },
}
