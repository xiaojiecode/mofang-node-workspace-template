import { parseArgs } from 'node:util'
import { readFile } from 'node:fs/promises'
import { guide } from './guide.mjs'
import { readDocument, changeDocument, restoreDocument, failure } from './file-store.mjs'

/** 所有作者命令统一输出机器可读结果；验证和预览绝不隐式发布。 */
export async function runLowcode(argv) {
    const [action, ...rest] = argv
    if (
        !['guide', 'catalog', 'inspect', 'apply', 'validate', 'preview', 'restore'].includes(action)
    )
        throw failure('unknown_tool', '未知 lowcode 命令，请运行 lowcode guide')
    const { values } = parseArgs({
        args: rest,
        options: Object.fromEntries(
            [
                'code',
                'node',
                'surface',
                'file',
                'category',
                'query',
                'id',
                'offset',
                'limit',
                'section',
                'componentId',
                'port',
                'scene',
            ].map((key) => [key, { type: 'string' }]),
        ),
    })
    if (action === 'guide') {
        let packages = null
        try {
            packages = JSON.parse(await readFile(new URL('../../vendor/lowcode-lock.json', import.meta.url), 'utf8'))
        } catch (error) { if (error.code !== 'ENOENT') throw error }
        return { ...guide, provenance: { source: 'vendor/lowcode-lock.json', packages } }
    }
    const authoring = await import('@mofang/low-code-page/authoring')
    if (action === 'catalog') {
        const offset = Number(values.offset ?? 0),
            limit = Number(values.limit ?? 20)
        if (
            !Number.isSafeInteger(offset) ||
            offset < 0 ||
            !Number.isSafeInteger(limit) ||
            limit < 1 ||
            limit > 100
        )
            throw failure('invalid_pagination', 'offset 必须为非负整数，limit 必须为 1–100 的整数')
        if (values.category === 'sdk') {
            const { WORKFLOW_SDK_METHODS, WORKFLOW_SDK_VERSION } =
                await import('@mofang/workflow-sdk/lowcode')
            const action = WORKFLOW_SDK_METHODS.find((item) => item.path === 'nodeFlow.action')
            if (!action)
                throw failure(
                    'catalog_incomplete',
                    'SDK 目录缺少 nodeFlow.action 合同，不能描述便捷动作',
                )
            const helper = {
                ...action,
                path: 'workflow.nodeAction.run',
                label: '节点动作 · 等待应用结果',
                signature: '(body: NodeFlowActionBody): Promise<NodeActionResult>',
                description:
                    '同一公开动作请求参数，等待 applied 后成功；accepted/processing 继续等待，失败或 needs_review 不自动重发。',
                example:
                    'host.action: workflow.nodeAction.run；input 为 NodeFlowActionBody，不能包在 args 数组中。',
                constraints: [
                    '仅当前目标且可执行、非只读时可调用',
                    '30 秒默认超时；取消/目标变化释放等待',
                    'payloadSchema 仍由真实 SDK transport/服务端验证',
                ],
            }
            const resetField = {
                path: 'workflow.settings.resetField',
                kind: 'async',
                effect: 'write',
                label: '节点配置 · 清除字段覆盖值',
                signature: '(input: { fieldId?: string; name?: string }): Promise<null>',
                description:
                    '仅当前配置表单；按 fieldId 或 name 定位，调用宿主 onFieldChange(name, undefined) 清除覆盖值，不能用 null 代替删除。',
                parameters: [{ name: 'input', type: '{ fieldId?: string; name?: string }' }],
                parametersSchema: {
                    type: 'object',
                    properties: {
                        fieldId: { type: 'string', minLength: 1 },
                        name: { type: 'string', minLength: 1 },
                    },
                    anyOf: [{ required: ['fieldId'] }, { required: ['name'] }],
                    additionalProperties: false,
                },
                constraints: [
                    '仅 settings 面板；字段必须属于 settingsFormId 对应表单',
                    '只读时拒绝；fieldId 提供时必须有效且优先于 name',
                ],
                example: "host.action: workflow.settings.resetField；input: { name: 'title' }",
            }
            const items = [...WORKFLOW_SDK_METHODS, helper, resetField].filter(
                (item) =>
                    (!values.id || item.path === values.id || `sdk.${item.path}` === values.id) &&
                    (!values.query ||
                        JSON.stringify(item).toLowerCase().includes(values.query.toLowerCase())),
            )
            if (values.id && !items.length)
                throw failure('unsupported_capability', `SDK 能力不存在：${values.id}`)
            return {
                version: WORKFLOW_SDK_VERSION,
                total: items.length,
                items: items.slice(offset, offset + limit),
                nextOffset: offset + limit < items.length ? offset + limit : null,
            }
        }
        if (values.category && !['material', 'logic', 'schema'].includes(values.category))
            throw failure('unsupported_category', '目录分类必须为 material/logic/schema/sdk')
        return authoring.describeCatalog({
            category: values.category,
            query: values.query,
            id: values.id,
            offset,
            limit,
        })
    }
    let body = {}
    if (values.file) {
        try {
            let contents = ''
            if (values.file === '-') for await (const chunk of process.stdin) contents += chunk
            else contents = await readFile(values.file, 'utf8')
            body = JSON.parse(contents)
        } catch (error) {
            throw failure('invalid_request_json', '无法读取或解析请求 JSON', {
                message: error.message,
            })
        }
    }
    if (!body || typeof body !== 'object' || Array.isArray(body))
        throw failure('invalid_request', '请求 JSON 必须是对象')
    if (values.code && values.node && values.code !== values.node)
        throw failure('identity_mismatch', 'code 与 node 参数不一致')
    const code = values.code ?? values.node ?? body.nodeCode
    const surface = values.surface ?? body.surface
    if (!code || !['settings', 'business'].includes(surface))
        throw failure('invalid_identity', '必须提供 code 和 surface=settings|business')
    if (
        (values.code ?? values.node) &&
        body.nodeCode &&
        (values.code ?? values.node) !== body.nodeCode
    )
        throw failure('identity_mismatch', '命令与请求文件节点不一致')
    if (values.surface && body.surface && values.surface !== body.surface)
        throw failure('identity_mismatch', '命令与请求文件 surface 不一致')
    if (action === 'apply') {
        if (Object.hasOwn(body, 'operations') === Object.hasOwn(body, 'definition'))
            throw failure('invalid_request', 'operations 与 definition 必须二选一')
        const result = await changeDocument(code, surface, body.expectedRevision, (definition) =>
            body.definition
                ? authoring.applyOperations(definition, [
                      { op: 'package.import', value: body.definition },
                  ])
                : authoring.applyOperations(definition, body.operations),
        )
        const { definition: _definition, ...receipt } = result
        return receipt
    }
    if (action === 'restore') {
        const { definition: _definition, ...receipt } = await restoreDocument(
            code,
            surface,
            body.expectedRevision,
            body.checkpointId,
        )
        return receipt
    }
    const document = await readDocument(code, surface)
    if (action === 'inspect')
        return {
            key: document.key,
            revision: document.revision,
            ...authoring.inspectPackage(document.definition, values),
        }
    const checked = authoring.validateAuthoringPackage(document.definition, {
        nodeCode: code,
        surface,
    })
    if (action === 'validate') {
        if (!checked.valid) throw failure('validation_failed', '页面校验未通过', checked)
        return { key: document.key, revision: document.revision, ...checked }
    }
    if (action === 'preview') {
        if (values.scene && !['ready', 'empty', 'error'].includes(values.scene)) throw failure('invalid_scene', 'scene 必须为 ready、empty 或 error')
        if (!checked.valid) throw failure('validation_failed', '页面校验未通过，不能预览', checked)
        const port = Number(values.port ?? process.env.MF_PREVIEW_PORT ?? 5188)
        if (!Number.isInteger(port) || port < 1 || port > 65535)
            throw failure('invalid_port', '预览端口无效')
        if (values.scene && !['ready', 'empty', 'error'].includes(values.scene))
            throw failure('invalid_scene', 'scene 必须为 ready/empty/error')
        const params = new URLSearchParams({ node: code, surface, scene: values.scene ?? 'ready' })
        return {
            url: `http://127.0.0.1:${port}/lowcode.html?${params}`,
            revision: document.revision,
            mode: 'mock',
            serverStarted: false,
            instruction: `先探测端口；复用已有服务，或 npm run dev -- --port ${port}。页面加载 revision 以预览页实际值为准。`,
        }
    }
    throw failure('unknown_tool', '未知 lowcode 命令，请运行 lowcode guide')
}

if (process.argv[1]?.replaceAll('\\', '/').endsWith('/lowcode/cli.mjs')) {
    try {
        console.log(JSON.stringify({ ok: true, data: await runLowcode(process.argv.slice(2)) }))
    } catch (error) {
        console.log(
            JSON.stringify({
                ok: false,
                error: {
                    code: error.code ?? 'authoring_error',
                    message: error.message,
                    details: error.details ?? error.diagnostics ?? null,
                },
            }),
        )
        process.exitCode = 1
    }
}
