import type { LifecycleProgram, StageProgram, JSONObject } from '@mofang/contracts/goja'
import type { Input, Output, Config } from '../contract'
import { copyProduct } from '../shared/copy-product'
type State = {
  started: boolean
  received: number
  succeeded: number
  failed: number
  unknown: number
}
type View = State
export default {
  createState() {
    return { started: false, received: 0, succeeded: 0, failed: 0, unknown: 0 }
  },
  onStart(ctx) {
    ctx.state.started = true
    ctx.view.replace({ ...ctx.state })
  },
  async onInput(ctx, event) {
    ctx.state.received++
    ctx.tasks.spawn('copy', event.values, [event.deliveryId])
    await Promise.resolve()
    ctx.view.replace({ ...ctx.state })
  },
  onTaskResult(ctx, event) {
    if (event.status === 'succeeded') {
      ctx.state.succeeded++
      ctx.outputs.append(event.output, event.inputRefs)
    } else if (event.status === 'unknown') ctx.state.unknown++
    else ctx.state.failed++
    ctx.view.replace({ ...ctx.state })
    if (
      ctx.inputClosed &&
      ctx.taskSummary.queued === 0 &&
      ctx.taskSummary.running === 0 &&
      ctx.taskSummary.unresolved === 0
    )
      ctx.finishProduction()
  },
  onInputClosed(ctx) {
    if (
      ctx.taskSummary.queued === 0 &&
      ctx.taskSummary.running === 0 &&
      ctx.taskSummary.unresolved === 0
    )
      ctx.finishProduction()
  },
  tasks: {
    copy: {
      entry: 'copy',
      steps: {
        async copy(ctx) {
          const item = copyProduct(ctx.input.item)
          await Promise.resolve()
          return ctx.complete({ items: [item], report: { received: 1 } })
        },
      },
    } satisfies StageProgram<Input, JSONObject, Output>,
  },
} satisfies LifecycleProgram<State, View, Input, Output, Config>
