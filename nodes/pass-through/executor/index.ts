import type { StageProgram, JSONObject } from '@mofang/contracts/goja'
import type { Input, Output } from '../contract'
import { copyProduct } from '../shared/copy-product'
export default {
  entry: 'copy',
  steps: {
    async copy(ctx) {
      const item = copyProduct(ctx.input.item)
      await Promise.resolve()
      return ctx.complete({ items: [item], report: { received: 1 } })
    },
  },
} satisfies StageProgram<Input, JSONObject, Output>
