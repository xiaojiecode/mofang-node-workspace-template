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
/** 供 Lit 展示的业务 JSON；平台执行状态和权限仍从 NodeFlow 的真实资源读取。 */
type View = State
// noinspection JSUnusedGlobalSymbols
export default {
    /**
     * 创建可序列化的初始业务状态，不接收 ctx。
     * 这里只返回数据；启动业务放在 onStart。不要依赖顶层变量、时钟、网络或跨 VM 内存，
     * 宿主会在后续事件调用时重新注入已保存的 state。
     */
    createState() {
        return { started: false, received: 0, succeeded: 0, failed: 0, unknown: 0 }
    },
    /**
     * 节点首次激活时的业务启动钩子，正式工作流和 Node Lab 采用相同顺序。
     * 宿主先创建初始状态，再调用此方法；页面挂载、刷新和后续商品到达不会再次触发它。
     * 可初始化 view、声明候选或派发子任务；协调上下文没有 ctx.call，外部业务应放入 tasks。
     */
    onStart(ctx) {
        ctx.state.started = true
        ctx.view.replace({ ...ctx.state })
    },
    /**
     * 每次真实上游到达触发一次，event.values 是本次输入，event.deliveryId 是来源身份。
     * 按业务更新 ctx.state / view，或将输入交给子任务；派发时用 inputRefs 保留真实到达引用。
     * 本方法不直接调用外部系统；不要在这里假定已拿到整批商品。
     */
    async onInput(ctx, event) {
        ctx.state.received++
        ctx.tasks.spawn('copy', event.values, [event.deliveryId])
        await Promise.resolve()
        ctx.view.replace({ ...ctx.state })
    },
    /**
     * 处理一个子任务的结果通知，按 status 区分成功、失败、取消和未知结果。
     * 只有成功结果才能追加候选，并沿用 event.inputRefs；unknown 不能自动重试或伪造成功输出。
     * 本例计数只用于展示，停止生产的判断使用宿主 taskSummary；候选追加不等于已经流转。
     */
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
    /**
     * 宿主确认后续不再有输入时触发；关闭原因可来自上游完成、失败或取消。
     * 输入关闭不代表业务已经处理完，仍需等待本节点要求的动作及子任务结清。
     * finishProduction 只声明停止产出；候选、事件和审核结清后才由平台判定节点完成。
     */
    onInputClosed(ctx) {
        if (
            ctx.taskSummary.queued === 0 &&
            ctx.taskSummary.running === 0 &&
            ctx.taskSummary.unresolved === 0
        )
            ctx.finishProduction()
    },
    /**
     * 按需扩展 onAction / onControl / onError；完整参数与读写限制见 LifecycleProgram 声明。
     * onAction 接收业务动作且可写；onControl、onError 只能观察，不能派发、写候选或自动补偿。
     */
    tasks: {
        copy: {
            entry: 'copy',
            steps: {
                /**
                 * 子任务的 copy 阶段：每次执行都由新的 VM 读取 ctx.input 与已保存阶段状态。
                 * 本例仅深拷贝商品并完成；需要外部业务时，每阶段至多调用一次 ctx.call。
                 * 阶段 ctx.complete / next / awaitUser 等终结方法会中断当前阶段，不能在其后继续写业务。
                 */
                async copy(ctx) {
                    const item = copyProduct(ctx.input.item)
                    await Promise.resolve()
                    return ctx.complete({ items: [item], report: { received: 1 } })
                },
            },
        } satisfies StageProgram<Input, JSONObject, Output>,
    },
} satisfies LifecycleProgram<State, View, Input, Output, Config>
