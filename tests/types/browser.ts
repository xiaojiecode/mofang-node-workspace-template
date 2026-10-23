import type { MofangSDK, PanelProps, PageProgramContext, NodeView } from '@mofang/contracts/browser'
import { HostPanel } from '@mofang/browser'
import { productSummary, textField } from '@mofang/browser'
import type { Product } from '@mofang/contracts/business'
import type { JavaScriptValidation } from '@mofang/contracts/author'
const moduleValidation: JavaScriptValidation = {
    programInterface: 'mf.node/1',
    valid: true,
    entry: 'initialize',
    steps: ['initialize', 'handle', 'project'],
    scope: 'syntax_and_contract',
    toolAvailability: 'checked_on_submission',
}
void moduleValidation
declare const sdk: MofangSDK
declare const props: PanelProps
type IsAny<T> = 0 extends 1 & T ? true : false
type ExpectFalse<T extends false> = T
type SDKIsTyped = ExpectFalse<IsAny<MofangSDK>>
type PanelPropsAreTyped = ExpectFalse<IsAny<PanelProps>>
type ProductIsTyped = ExpectFalse<IsAny<Product>>
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
