import type { Availability, JsonObject, NodeCommand, NodeFacts, ProductionPlan } from './types'

export interface StateEnvelope {
    readonly slots: Readonly<Record<string, unknown>>
}
export interface EvaluationBasis {
    readonly sourceHash: string
    readonly sessionRevision: string
    readonly configDigest: string
    readonly factsDigest: string
}
export interface InitializeInput {
    readonly sourceHash: string
    readonly config: JsonObject
    readonly facts: NodeFacts
}
export interface ProjectInput {
    readonly basis: EvaluationBasis
    readonly state: StateEnvelope
    readonly config: JsonObject
    readonly facts: NodeFacts
}
export interface NodeEvent {
    readonly id: string
    readonly sequence: string
    readonly type:
        | 'start'
        | 'entry'
        | 'input'
        | 'input-closed'
        | 'task-result'
        | 'action'
        | 'control'
        | 'error'
    readonly createdAt: string
    readonly payload: JsonObject
}
export interface HandleInput extends ProjectInput {
    readonly event: NodeEvent
}
export interface HandleHost {
    allocateId(kind: 'task' | 'candidate'): string
}
export type HandleResult =
    | {
          readonly kind: 'apply'
          readonly nextState: StateEnvelope
          readonly plan: {
              readonly commands: readonly NodeCommand[]
              readonly production: ProductionPlan
          }
      }
    | { readonly kind: 'reject'; readonly code: string; readonly message: string }
    | { readonly kind: 'ack' }
    | { readonly kind: 'fault'; readonly code: string; readonly message: string }
export type ProjectionResult =
    | {
          readonly kind: 'ready'
          readonly nodeView: JsonObject
          readonly actions: readonly {
              readonly name: string
              readonly availability: Availability
          }[]
      }
    | { readonly kind: 'unavailable'; readonly code: string; readonly message: string }
export interface NodeManifest {
    readonly readOnlyActions?: readonly import('./types').ReadOnlyActionSpec[]
    readonly abi: 'mf.node/1'
    readonly code: string
    readonly state: readonly { readonly key: string; readonly schema: JsonObject }[]
    readonly tasks: readonly {
        readonly name: string
        readonly entry: string
        readonly steps: readonly string[]
        readonly tools?: readonly string[]
    }[]
    readonly actions: readonly {
        readonly name: string
        readonly label: string
        readonly description: string
        readonly presentation: 'host' | 'panel'
        readonly payloadSchema: JsonObject
    }[]
    readonly inputSchema: JsonObject
    readonly outputSchema: JsonObject
    readonly hasProject: true
}
export interface NodeModule {
    readonly abi: 'mf.node/1'
    readonly manifest: NodeManifest
    initialize(input: InitializeInput): StateEnvelope
    handle(input: HandleInput, host: HandleHost): Promise<HandleResult>
    project(input: ProjectInput): ProjectionResult
    readonly tasks: Readonly<Record<string, object>>
}
