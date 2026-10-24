import type { MofangSDK, PanelProps, PageProgramContext, NodeView } from '@mofang/contracts/browser'
import { HostPanel } from '@mofang/browser'
import { productSummary, textField, selectField, card } from '@mofang/browser'
import type { TemplateResult } from 'lit'
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
// 宿主 HTTP 能力仅声明 JSON 参数，不向作者暴露底层鉴权请求实例。
void sdk.http.request<{ items: string[] }>({
    method: 'GET',
    path: '/v1/example/items',
    query: { page: 1 },
})
// @ts-expect-error HTTP 仅支持公开的五种方法。
void sdk.http.request({ method: 'TRACE', path: '/v1/example/items' })
// @ts-expect-error 页面不能覆盖宿主认证请求头。
void sdk.http.request({ method: 'GET', path: '/v1/example/items', headers: { Authorization: 'x' } })
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

// 保留已有 selectField 的 TemplateResult 返回契约，可直接作为容器内容。
const selectionField: TemplateResult = selectField({
    name: 'region',
    label: '地区',
    value: 'US',
    options: [{ value: 'US', label: '美国' }],
})
void card({ title: '设置' }, selectionField)
