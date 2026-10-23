import type { StageProgram, TaskDefinition } from '@mofang/node'
import type { Input, Output } from '../contract'
import { copyProduct } from '../contract'

/** 当前阶段 API；新 VM 从 ctx.input 读取，不捕获协调器的状态。 */
export const copyProgram: StageProgram<Input, Record<string, never>, Output> = {
    entry: 'copy',
    steps: {
        copy(ctx) {
            return ctx.complete({ items: [copyProduct(ctx.input.item)] })
        },
    },
}
export const copyTask: TaskDefinition<Input, Output, Record<string, never>> = {
    name: 'copy',
    program: copyProgram,
}
