import { createAuthoringPackage, applyOperations } from '@mofang/low-code-page/authoring'

const constant = (value) => ({ from: 'constant', value })
const host = (...path) => ({ from: 'host', path })
const ref = (name) => ({ $ref: name })
const names = {
    copy: '直接复制',
    selection: '人工选品',
    'human-wait': '等待人工确认',
    'multi-instance': '多实例执行',
}

/** 按已有节点合同填充可运行面板，保留备注草稿、就绪投影和人工选品动作。 */
function populatePreset(definition, preset, surface) {
    if (surface === 'settings')
        return applyOperations(definition, [
            {
                op: 'field.upsert',
                id: 'note',
                value: {
                    name: 'note',
                    formId: 'main1',
                    label: '备注',
                    type: 'string',
                    defaultValue: '',
                    description: '辅助配置；商品由真实到达绑定。',
                },
            },
            {
                op: 'component.add',
                type: 'TextField',
                parentId: definition.page.content[0].props.id,
                props: { fieldId: 'note', placeholder: '请输入备注' },
            },
            {
                op: 'component.add',
                type: 'Text',
                props: { text: '修改写入宿主草稿，由工作流统一保存。' },
            },
        ]).definition
    const operations = [
        { op: 'component.add', type: 'Text', props: { text: names[preset] } },
        {
            op: 'component.add',
            type: 'Text',
            props: {
                text: '等待节点状态',
                binding: { ...host('nodeFlow', 'data', 'status'), fallback: '等待节点状态' },
            },
        },
        {
            op: 'component.add',
            type: 'Text',
            props: { text: '等待业务投影', binding: host('nodeView') },
        },
    ]
    if (preset === 'selection') {
        const selected = { from: 'table', tableId: 'products', path: ['selectedIds'], fallback: [] }
        operations.push(
            {
                op: 'component.add',
                type: 'DataTable',
                ref: 'products',
                props: {
                    tableId: 'products',
                    rowKey: 'key',
                    selection: true,
                    selectionDisabledPath: 'submitted',
                    resetOn: host('target'),
                    columns: [
                        { id: 'title', title: '商品', field: 'product.basic.title' },
                        { id: 'key', title: '标识', field: 'key' },
                    ],
                },
            },
            {
                op: 'binding.upsert',
                value: {
                    nodeId: ref('products'),
                    property: 'rows',
                    value: { ...host('nodeView', 'rows'), fallback: [] },
                },
            },
            {
                op: 'rule.upsert',
                value: {
                    targetId: ref('products'),
                    property: 'disabled',
                    condition: {
                        operator: 'equals',
                        left: host('readOnly'),
                        right: constant(true),
                    },
                },
            },
            {
                op: 'component.add',
                type: 'SelectionSummary',
                props: { tableId: 'products', text: '已选择 {count} 件商品' },
            },
            {
                op: 'component.add',
                type: 'Text',
                props: { text: '请先选择商品；无商品或不选择时可通过宿主必要动作区结束选品。' },
            },
            {
                op: 'component.add',
                type: 'ActionButton',
                ref: 'submit',
                props: {
                    label: '提交所选商品',
                    eventId: 'submit-selection',
                    disabledWhen: {
                        operator: 'any',
                        conditions: [
                            { operator: 'empty', left: selected },
                            { operator: 'equals', left: host('readOnly'), right: constant(true) },
                        ],
                    },
                },
            },
            {
                op: 'event.upsert',
                id: 'submit-selection',
                value: {
                    nodeId: ref('submit'),
                    event: 'click',
                    steps: [
                        {
                            id: 'submit',
                            type: 'host.action',
                            actionId: 'workflow.nodeAction.run',
                            input: {
                                runId: host('target', 'runId'),
                                nodeInstanceId: host('target', 'nodeInstanceId'),
                                name: constant('submit'),
                                payload: { from: 'object', entries: { keys: selected } },
                                expectedSessionRevision: host(
                                    'nodeFlow',
                                    'data',
                                    'composition',
                                    'snapshot',
                                    'sessionRevision',
                                ),
                                candidates: constant([]),
                            },
                        },
                        {
                            id: 'applied',
                            type: 'feedback',
                            message: constant('协调效果已应用，请继续处理候选与节点剩余义务。'),
                        },
                    ],
                },
            },
        )
    } else
        operations.push(
            {
                op: 'component.add',
                type: 'Text',
                props: { text: '生产结束后，候选仍需按运行模式处理；必要动作由宿主提供。' },
            },
            {
                op: 'component.add',
                type: 'Repeater',
                ref: 'outputs',
                props: { binding: { ...host('nodeOutput', 'items'), fallback: [] } },
            },
            {
                op: 'component.add',
                type: 'Text',
                parentId: ref('outputs'),
                props: {
                    text: '候选商品',
                    binding: { from: 'row', path: ['item', 'value', 'items'] },
                },
            },
        )
    return applyOperations(definition, operations).definition
}

/** 生成完整共享页面包；页面身份及配置表单绑定由共享作者合同提供。 */
export function puckPanelFiles(
    code,
    preset,
    { settingsRenderer = 'lit', businessRenderer = 'lit' } = {},
) {
    if (
        ![settingsRenderer, businessRenderer].every((renderer) =>
            ['lit', 'puck'].includes(renderer),
        )
    )
        throw new Error('panel renderer must be lit or puck')
    const files = {}
    const panels = { version: 1 }
    for (const [surface, renderer] of [
        ['settings', settingsRenderer],
        ['business', businessRenderer],
    ]) {
        const entry =
            renderer === 'puck'
                ? surface + '.page.json'
                : surface === 'settings'
                  ? 'settings.ts'
                  : 'view.ts'
        panels[surface] = { renderer, entry }
        if (renderer === 'puck') {
            const initial = createAuthoringPackage({
                nodeCode: code,
                surface,
                title: `${preset} · ${surface === 'settings' ? '配置' : '展示'}`,
            })
            files[entry] = JSON.stringify(populatePreset(initial, preset, surface), null, 4) + '\n'
        }
    }
    files['panels.json'] = JSON.stringify(panels, null, 4) + '\n'
    if ([settingsRenderer, businessRenderer].includes('puck'))
        files['fixtures/lowcode-preview.json'] =
            JSON.stringify(
                {
                    mode: 'mock',
                    preset,
                    scenarios: ['normal', 'empty', 'failure', 'readonly'],
                    provenance: 'template-local-fixture',
                },
                null,
                4,
            ) + '\n'
    return files
}
