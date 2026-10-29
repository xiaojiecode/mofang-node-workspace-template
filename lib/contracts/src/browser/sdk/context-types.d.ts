import type { InputManifest, PredecessorRef } from './input-types';
import type { ID, JSONObject, Revision } from './json-types';
import type { PanelReference, SettingsPanelReference } from './panel-types';
import type { WaitEnvelope } from './wait-types';
export type NodePlan = Readonly<{
    seq: number;
    updatedAt: string;
    explanation?: string;
    steps: readonly Readonly<{
        id: string;
        title: string;
        status: 'pending' | 'in_progress' | 'completed';
    }>[];
}>;
export type NodeContext = Readonly<{
    sdkVersion: '1';
    contextRevision: Revision;
    workflowId: ID;
    workspaceId: ID;
    spaceId: ID;
    nodeInstanceId: ID;
    nodeKey: string;
    runId?: ID;
    nodeRunId?: ID;
    taskId?: ID;
    mode: 'auto' | 'manual';
    view: 'current' | 'history' | 'preview';
    inputRequestId?: ID;
    inputManifest?: InputManifest;
    input: JSONObject | null;
    config: JSONObject | null;
    configRevisionId: ID;
    pendingConfigRevisionId?: ID;
    inboxWatermark: Revision;
    predecessorRefs: readonly PredecessorRef[];
    output?: import('./output-types').NodeOutput;
    plan?: NodePlan;
    agentAwait?: Readonly<{
        waitingToolCallId: ID;
        prompt: string;
        output?: JSONObject;
    }>;
    /** 独立查询声明来自当前选中运行；旧冻结没有声明时不采用当前目录。 */
    readOnlyActions?: readonly import('./read-only-action-types').ReadOnlyActionView[];
    continuation?: Readonly<{
        expectedGateRevision: string;
        expectedWaitingTurn?: number;
    }>;
    state: Readonly<{
        status: string;
        phase: string;
        closure: 'open' | 'settling' | 'closed';
    }>;
    control: Readonly<{
        revision: Revision;
        desiredState: 'running' | 'paused';
        phase: 'applying' | 'applied' | 'blocked';
        reasons: readonly JSONObject[];
        inFlightToolCount: number;
        unknownToolCount: number;
    }>;
    wait?: WaitEnvelope;
    permissions: Readonly<{
        canEditConfig: boolean;
        canEditDefinition: boolean;
        canPrepare: boolean;
        canExecute: boolean;
        canCommit: boolean;
    }>;
    panel: PanelReference;
    settingsPanel: SettingsPanelReference;
}>;
