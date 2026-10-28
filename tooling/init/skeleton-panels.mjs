import { createAuthoringPackage, applyOperations } from '@mofang/low-code-page/authoring'

const host = (...path) => ({ from: 'host', path })

/** 生成只展示宿主状态的中性低代码页面，不包含任何业务示例。 */
function populate(definition, surface) {
    const operations = [
        {
            op: 'component.add',
            type: 'Text',
            props: { text: surface === 'settings' ? '节点设置' : '节点业务' },
        },
        {
            op: 'component.add',
            type: 'Text',
            props: {
                text:
                    surface === 'settings'
                        ? '这是空白骨架，请按业务需求增加受控设置字段。'
                        : '这是空白骨架，请按业务输出和动作补充页面。',
            },
        },
        {
            op: 'component.add',
            type: 'Text',
            props: {
                text: '等待节点状态',
                binding: { ...host('nodeFlow', 'data', 'status'), fallback: '等待节点状态' },
            },
        },
    ]
    return applyOperations(definition, operations).definition
}

/** 生成独立面板清单，并按渲染方式提供最小页面与本地 fixture。 */
export function skeletonPanelFiles(
    code,
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
                title: `节点骨架 · ${surface === 'settings' ? '设置' : '业务'}`,
            })
            files[entry] = JSON.stringify(populate(initial, surface), null, 4) + '\n'
        }
    }
    files['panels.json'] = JSON.stringify(panels, null, 4) + '\n'
    if ([settingsRenderer, businessRenderer].includes('puck'))
        files['fixtures/lowcode-preview.json'] =
            JSON.stringify(
                {
                    mode: 'mock',
                    scenarios: ['normal', 'empty', 'failure', 'readonly'],
                    provenance: 'scaffold-local-fixture',
                },
                null,
                4,
            ) + '\n'
    return files
}
