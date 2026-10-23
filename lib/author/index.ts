import type {
    ActionContext,
    ActionSpec,
    Availability,
    CommandFactories,
    DeepReadonly,
    HookResult,
    JsonObject,
    NodeCommand,
    NodeFacts,
    NodeReducer,
    NodeReject,
    NodeSpec,
    OutputHandle,
    StateSetter,
    StateSlot,
    TaskHandle,
    TaskReference,
    TaskResultEvent,
} from './types'
import type {
    ControlEvent,
    CoordinatorError,
    InputClosedEvent,
    InputEvent,
} from '@mofang/contracts/goja'
import type {
    HandleHost,
    HandleInput,
    HandleResult,
    NodeEvent,
    NodeModule,
    ProjectionResult,
    ProjectInput,
    StateEnvelope,
} from './module-types'
import { identity, jsonCopy, objectValue, readonlyCopy } from './json'
export * from './types'
export type * from './module-types'

type Phase =
    | 'binding'
    | 'handler'
    | 'reducer'
    | 'updater'
    | 'guard'
    | 'project'
    | 'notification'
    | 'closed'
type Callback = (payload: unknown, context?: ActionContext) => unknown
type Handler = { type: NodeEvent['type']; callback: Callback; task?: string }
type ActionBinding = { guard: () => Availability; handler: Callback }
interface Scope {
    spec: NodeSpec
    phase: Phase
    input: ProjectInput
    event?: NodeEvent
    host?: HandleHost
    snapshot: Readonly<Record<string, unknown>>
    pending: Record<string, unknown>
    writers: Set<string>
    hooks: Handler[]
    actions: Map<string, ActionBinding>
    getter?: () => JsonObject
    commands: NodeCommand[]
    constructed: Set<NodeCommand>
    allocated: Set<string>
    finished: boolean
    failure?: Error
    rejection?: NodeReject
}
let active: Scope | undefined

/** 将错误锁存在当前计算，作者 catch 不能把越权或拒绝变成部分提交。 */
function fail(message: string): never {
    const error = new Error(message)
    if (active && !active.failure) active.failure = error
    throw error
}
function scope(): Scope {
    if (!active || active.phase === 'closed')
        throw new Error('node Hook is unavailable outside the current scope')
    if (active.failure) throw active.failure
    if (active.rejection) throw new Error(active.rejection.message)
    return active
}
function phase(required: Phase): Scope {
    const current = scope()
    if (current.phase !== required)
        fail('node operation requires ' + required + ' scope; current scope is ' + current.phase)
    return current
}
function pure<T>(current: Scope, next: Phase, run: () => T): T {
    const before = current.phase
    current.phase = next
    try {
        return run()
    } finally {
        current.phase = before
    }
}
function boundary<T>(current: Scope, run: () => T): T {
    try {
        return run()
    } catch (error) {
        if (!current.rejection && !current.failure)
            current.failure = error instanceof Error ? error : new Error(String(error))
        throw error
    }
}
function declared<T>(items: Readonly<Record<string, T>>, value: T): void {
    if (!Object.values(items).includes(value))
        fail('node capability must reference its static declaration')
}
function validateName(name: string): void {
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(name))
        throw new Error(
            'task/action name must contain 1–64 ASCII letters, digits, underscores or hyphens',
        )
}
function unique(names: readonly string[]): void {
    if (new Set(names).size !== names.length)
        throw new Error('duplicate static declaration identity')
}

/** 冻结具名 Schema 声明；initial 只在 initialize 执行，Schema 最终由宿主可信校验器负责。 */
export function defineStateSlot<S>(definition: StateSlot<S>): StateSlot<S> {
    identity(definition.key, 'state slot key')
    objectValue(definition.schema, 'state schema')
    if (typeof definition.initial !== 'function')
        throw new Error('state slot initial must be a synchronous function')
    return Object.freeze({
        key: definition.key,
        schema: readonlyCopy(definition.schema),
        initial: definition.initial,
    })
}

/** 只绑定本次事件开始快照；setter 的 updater 按已经暂存的 pending state 累积。 */
export function useNodeState<S>(slot: StateSlot<S>): readonly [DeepReadonly<S>, StateSetter<S>] {
    const current = phase('binding')
    declared(current.spec.state, slot)
    bindWriter(current, slot.key)
    const setState: StateSetter<S> = (next) =>
        boundary(current, () => {
            const writing = phase('handler')
            if (writing !== current) fail('state setter belongs to another computation')
            const value =
                typeof next === 'function'
                    ? pure(current, 'updater', () =>
                          (next as (pending: DeepReadonly<S>) => S)(
                              readonlyCopy(current.pending[slot.key]) as DeepReadonly<S>,
                          ),
                      )
                    : next
            current.pending[slot.key] = jsonCopy(value)
        })
    return [current.snapshot[slot.key] as DeepReadonly<S>, setState]
}
function bindWriter(current: Scope, key: string): void {
    if (current.writers.has(key)) fail('a state slot may bind only one setter or reducer')
    current.writers.add(key)
}

/** 所有 reducer 更新与命令共享事件日志；拒绝时丢弃该事件已暂存的全部效果。 */
export function useNodeReducer<S, A, C extends object>(
    slot: StateSlot<S>,
    reducer: NodeReducer<S, A, C>,
): readonly [DeepReadonly<S>, (action: DeepReadonly<A>) => void] {
    const current = phase('binding')
    declared(current.spec.state, slot)
    bindWriter(current, slot.key)
    const dispatch = (action: DeepReadonly<A>): void =>
        boundary(current, () => {
            if (phase('handler') !== current) fail('dispatch belongs to another computation')
            const transition = pure(current, 'reducer', () =>
                reducer(
                    readonlyCopy(current.pending[slot.key]) as DeepReadonly<S>,
                    readonlyCopy(action),
                    {
                        facts: current.input.facts,
                        config: current.input.config as DeepReadonly<C>,
                        commands: factories(current),
                    },
                ),
            )
            if ('kind' in transition) {
                if (transition.kind !== 'reject' || current.event?.type !== 'action')
                    fail('structured rejection is only valid for action events')
                current.rejection = readonlyCopy({
                    kind: 'reject',
                    code: identity(transition.code, 'rejection code'),
                    message: identity(transition.message, 'rejection message'),
                })
                throw new Error(current.rejection.message)
            }
            if (
                transition.production !== 'unchanged' &&
                transition.production !== 'declare-finished'
            )
                fail('invalid production plan')
            for (const command of transition.commands) {
                if (!current.constructed.has(command))
                    fail('reducer commands must be built by env.commands')
                current.commands.push(jsonCopy(command))
            }
            current.pending[slot.key] = jsonCopy(transition.state)
            if (transition.production === 'declare-finished') current.finished = true
        })
    return [current.snapshot[slot.key] as DeepReadonly<S>, dispatch]
}

export function useNodeFacts(): DeepReadonly<NodeFacts> {
    return phase('binding').input.facts
}
export function useNodeConfig<C extends object>(): DeepReadonly<C> {
    return phase('binding').input.config as DeepReadonly<C>
}

function allocate(current: Scope, kind: 'task' | 'candidate'): string {
    if (scope() !== current || (current.phase !== 'handler' && current.phase !== 'reducer'))
        fail('identity allocation requires a writable event')
    if (!current.host) fail('identity allocator is unavailable')
    const id = identity(current.host.allocateId(kind), 'allocated identity')
    if (current.allocated.has(id)) fail('allocated identities must be distinct')
    current.allocated.add(id)
    return id
}
function makeCommand<T extends NodeCommand>(current: Scope, command: T): T {
    if (scope() !== current || (current.phase !== 'handler' && current.phase !== 'reducer'))
        fail('command factories require a writable event or reducer')
    const frozen = readonlyCopy(command)
    current.constructed.add(frozen)
    return frozen
}
function factories(current: Scope): CommandFactories {
    const result: CommandFactories = {
        spawn(task, input, options) {
            declared(current.spec.tasks, task as { name: string; program: object })
            return makeCommand(current, {
                kind: 'task.spawn',
                id: allocate(current, 'task'),
                handler: task.name,
                input: jsonCopy(objectValue(input, 'task input')),
                inputRefs: jsonCopy(options.inputRefs),
            })
        },
        append(value, options) {
            return makeCommand(current, {
                kind: 'candidate.append',
                id: allocate(current, 'candidate'),
                value: jsonCopy(objectValue(value, 'candidate output')),
                inputRefs: jsonCopy(options.inputRefs),
            })
        },
        update(id, expectedRevision, value) {
            return makeCommand(current, {
                kind: 'candidate.update',
                id: identity(id, 'candidate identity'),
                expectedRevision: identity(expectedRevision, 'candidate revision'),
                value: jsonCopy(objectValue(value, 'candidate output')),
            })
        },
        remove(id, expectedRevision) {
            return makeCommand(current, {
                kind: 'candidate.remove',
                id: identity(id, 'candidate identity'),
                expectedRevision: identity(expectedRevision, 'candidate revision'),
            })
        },
    }
    return Object.freeze(result)
}
function stage(current: Scope, command: NodeCommand): string {
    if (phase('handler') !== current) fail('command handle belongs to another computation')
    current.commands.push(jsonCopy(command))
    return command.id
}

/** 绑定静态任务；调用 spawn 只登记计划，完成事件另行触发 onResult。 */
export function useTask<I extends object, O extends object, S extends object>(
    definition: TaskReference<I, O, S>,
): TaskHandle<I, O> {
    const current = phase('binding')
    declared(current.spec.tasks, definition as { name: string; program: object })
    const result: TaskHandle<I, O> = {
        spawn(input, options) {
            return boundary(current, () => {
                phase('handler')
                return stage(current, factories(current).spawn(definition, input, options))
            })
        },
        onResult(handler) {
            if (phase('binding') !== current)
                fail('task result binding belongs to another computation')
            current.hooks.push({
                type: 'task-result',
                task: definition.name,
                callback: handler as Callback,
            })
        },
    }
    return Object.freeze(result)
}
export function useOutputs<O extends object>(): OutputHandle<O> {
    const current = phase('binding')
    const result: OutputHandle<O> = {
        append(value, options) {
            return boundary(current, () => {
                phase('handler')
                return stage(current, factories(current).append(value, options))
            })
        },
        update(id, expectedRevision, value) {
            boundary(current, () => {
                phase('handler')
                stage(current, factories(current).update(id, expectedRevision, value))
            })
        },
        remove(id, expectedRevision) {
            boundary(current, () => {
                phase('handler')
                stage(current, factories(current).remove(id, expectedRevision))
            })
        },
    }
    return Object.freeze(result)
}
export function useProduction(): { readonly declared: boolean; finish(): void } {
    const current = phase('binding')
    return Object.freeze({
        declared: current.input.facts.productionDeclared,
        finish() {
            if (phase('handler') !== current)
                fail('production handle belongs to another computation')
            current.finished = true
        },
    })
}

/** 参数和来源已由平台校验；handler 只收到业务 payload 与受限动作元数据。 */
export function useNodeAction<P extends object>(
    spec: ActionSpec<P>,
    binding: {
        readonly guard: () => Availability
        readonly handler: (payload: DeepReadonly<P>, context: ActionContext) => HookResult
    },
): void {
    const current = phase('binding')
    declared(current.spec.actions, spec)
    if (current.actions.has(spec.name)) fail('duplicate action binding')
    current.actions.set(spec.name, { guard: binding.guard, handler: binding.handler as Callback })
}
function register(type: NodeEvent['type'], handler: Callback): void {
    phase('binding').hooks.push({ type, callback: handler })
}
export function useOnStart(handler: () => HookResult): void {
    register('start', handler)
}
export function useOnInput<I extends object>(
    handler: (event: DeepReadonly<InputEvent<I>>) => HookResult,
): void {
    register('input', handler as Callback)
}
export function useOnInputClosed(
    handler: (event: DeepReadonly<InputClosedEvent>) => HookResult,
): void {
    register('input-closed', handler as Callback)
}
export function useOnTaskResult<O extends object>(
    handler: (event: DeepReadonly<TaskResultEvent<O>>) => HookResult,
): void {
    register('task-result', handler as Callback)
}
export function useOnControl(handler: (event: DeepReadonly<ControlEvent>) => HookResult): void {
    register('control', handler as Callback)
}
export function useOnError(handler: (event: DeepReadonly<CoordinatorError>) => HookResult): void {
    register('error', handler as Callback)
}
export function nodeView<V extends JsonObject>(getter: () => V): void {
    const current = phase('binding')
    if (current.getter) fail('exactly one nodeView getter must be bound')
    current.getter = getter
}

function makeScope(
    spec: NodeSpec,
    input: ProjectInput,
    event?: NodeEvent,
    host?: HandleHost,
): Scope {
    const slots = objectValue(input.state.slots, 'state slots')
    const expected = Object.values(spec.state)
        .map((slot) => slot.key)
        .sort()
    const actual = Object.keys(slots).sort()
    if (JSON.stringify(expected) !== JSON.stringify(actual))
        throw new Error('state slot set differs from frozen declaration')
    const result: Scope = {
        spec,
        phase: 'binding',
        input: readonlyCopy(input),
        snapshot: readonlyCopy(slots),
        pending: jsonCopy(slots),
        writers: new Set(),
        hooks: [],
        actions: new Map(),
        commands: [],
        constructed: new Set(),
        allocated: new Set(),
        finished: false,
    }
    if (event) result.event = readonlyCopy(event)
    if (host) result.host = host
    return result
}
function bind(current: Scope, Component: () => undefined): void {
    if (active) throw new Error('concurrent/reentrant module computations are unsupported')
    active = current
    const returned = Component()
    if (returned !== undefined)
        fail('function node body must be synchronous and return without a value')
    if (!current.getter) fail('exactly one nodeView getter must be bound')
    for (const action of Object.values(current.spec.actions))
        if (!current.actions.has(action.name))
            fail('declared action is missing its guard/handler binding: ' + action.name)
    if (current.failure) throw current.failure
}
function availability(current: Scope, binding: ActionBinding): Availability {
    const value = pure(current, 'guard', binding.guard)
    objectValue(value, 'action availability')
    if (value.enabled === true) return { enabled: true }
    if (value.enabled === false && typeof value.reason === 'string' && value.reason.trim())
        return { enabled: false, reason: value.reason }
    fail('guard must return a synchronous availability with a disabled reason')
}
function fault(error: unknown): { code: string; message: string } {
    return {
        code: 'NODE_PROGRAM_ERROR',
        message: error instanceof Error ? error.message : String(error),
    }
}
function close(current: Scope | undefined): void {
    if (current) current.phase = 'closed'
    if (active === current) active = undefined
}

/** 从静态 spec 提取 ABI；保存检查不执行 Component、不初始化假业务快照。 */
export function defineNode<T extends NodeSpec>(spec: T, Component: () => undefined): NodeModule {
    if (spec.abi !== 'mf.node/1') throw new Error('unsupported node ABI')
    identity(spec.code, 'node code')
    const slots = Object.values(spec.state)
    const taskDefinitions = Object.values(spec.tasks)
    const actions = Object.values(spec.actions)
    unique(slots.map((slot) => slot.key))
    unique(taskDefinitions.map((task) => task.name))
    unique(actions.map((action) => action.name))
    const tasks: Record<string, object> = Object.create(null) as Record<string, object>
    const taskManifest = taskDefinitions
        .map((task) => {
            validateName(task.name)
            const program = objectValue(task.program, 'task program')
            const steps = Object.keys(objectValue(program.steps, 'task steps')).sort()
            if (typeof program.entry !== 'string' || !steps.includes(program.entry))
                throw new Error('task entry must name a declared stage')
            tasks[task.name] = task.program
            return { name: task.name, entry: program.entry, steps }
        })
        .sort((a, b) => a.name.localeCompare(b.name))
    const manifest = readonlyCopy({
        abi: 'mf.node/1' as const,
        code: spec.code,
        state: slots
            .map((slot) => ({ key: slot.key, schema: slot.schema }))
            .sort((a, b) => a.key.localeCompare(b.key)),
        tasks: taskManifest,
        actions: actions
            .map((action) => {
                validateName(action.name)
                return {
                    name: action.name,
                    label: action.label,
                    description: action.description,
                    presentation: action.presentation,
                    payloadSchema: action.payloadSchema,
                }
            })
            .sort((a, b) => a.name.localeCompare(b.name)),
        inputSchema: spec.inputSchema,
        outputSchema: spec.outputSchema,
        hasProject: true as const,
    })
    return Object.freeze({
        abi: 'mf.node/1' as const,
        manifest,
        tasks: Object.freeze(tasks),
        initialize(): StateEnvelope {
            if (active) throw new Error('initialization cannot run inside another node scope')
            const result: Record<string, unknown> = Object.create(null) as Record<string, unknown>
            for (const slot of slots) result[slot.key] = jsonCopy(slot.initial())
            return { slots: result }
        },
        async handle(input: HandleInput, host: HandleHost): Promise<HandleResult> {
            let current: Scope | undefined
            try {
                current = makeScope(spec, input, input.event, host)
                bind(current, Component)
                const event = current.event!
                const readOnly = event.type === 'control' || event.type === 'error'
                current.phase = readOnly ? 'notification' : 'handler'
                if (event.type === 'action') {
                    const name = identity(event.payload.name, 'action name')
                    const binding = current.actions.get(name)
                    if (!binding) fail('action is not declared')
                    const enabled = availability(current, binding)
                    if (!enabled.enabled)
                        return {
                            kind: 'reject',
                            code: 'ACTION_UNAVAILABLE',
                            message: enabled.reason,
                        }
                    const context = readonlyCopy({
                        eventId: event.id,
                        sequence: event.sequence,
                        candidates: event.payload.candidates ?? [],
                    }) as ActionContext
                    const returned = await binding.handler(event.payload.payload, context)
                    if (returned !== undefined) fail('node handler must return without a value')
                } else {
                    for (const handler of current.hooks) {
                        if (
                            handler.type !== event.type ||
                            (handler.task && handler.task !== event.payload.handler)
                        )
                            continue
                        const returned = await handler.callback(event.payload)
                        if (returned !== undefined) fail('node handler must return without a value')
                        if (current.failure) throw current.failure
                        if (current.rejection) return current.rejection
                    }
                }
                if (current.failure) throw current.failure
                if (current.rejection) return current.rejection
                if (readOnly) return { kind: 'ack' }
                return jsonCopy({
                    kind: 'apply',
                    nextState: { slots: current.pending },
                    plan: {
                        commands: current.commands,
                        production: current.finished ? 'declare-finished' : 'unchanged',
                    },
                })
            } catch (error) {
                if (current?.failure) return { kind: 'fault', ...fault(current.failure) }
                if (current?.rejection) return current.rejection
                return { kind: 'fault', ...fault(error) }
            } finally {
                close(current)
            }
        },
        project(input: ProjectInput): ProjectionResult {
            let current: Scope | undefined
            try {
                current = makeScope(spec, input)
                bind(current, Component)
                const projected = pure(current, 'project', () =>
                    objectValue(current!.getter!(), 'nodeView'),
                )
                const actionViews = Object.keys(current.spec.actions)
                    .map((key) => current!.spec.actions[key]!)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((action) => ({
                        name: action.name,
                        availability: availability(current!, current!.actions.get(action.name)!),
                    }))
                if (current.failure) throw current.failure
                return jsonCopy({ kind: 'ready', nodeView: projected, actions: actionViews })
            } catch (error) {
                return { kind: 'unavailable', ...fault(current?.failure ?? error) }
            } finally {
                close(current)
            }
        },
    })
}
