import type { MofangSDK, PanelProps, PageProgramContext, NodeView } from '@mofang/contracts/browser'
import { HostPanel } from '@mofang/lit-host'
import { productSummary, textField } from '@mofang/lit-ui'
import type { Product } from '@mofang/contracts/business'
declare const sdk: MofangSDK
declare const props: PanelProps
void sdk.nodeFlow.watch({ runId: 'run', nodeInstanceId: 'node' })
void props.settings?.onFieldChange?.('note', 'text')
void props.ui?.onSelectTask?.({ taskId: 'task', nodeRunId: 'run' })
// @ts-expect-error The host callback takes an identity object, not a task ID string.
void props.ui?.onSelectTask?.('task')
void textField({ name: 'x', label: 'x', value: '', readOnly: true })
void productSummary({
    basic: { title: 'x' },
    references: { shopProductId: 'shop' },
} satisfies Product)
// @ts-expect-error IDs/revisions are strings.
void sdk.nodeFlow.watch({ runId: 42, nodeInstanceId: 'node' })
// @ts-expect-error Contracts are types only; platform owns the SDK runtime.
import { createMofangSDK } from '@mofang/contracts/browser'
