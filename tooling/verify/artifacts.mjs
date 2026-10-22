import path from 'node:path'
import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { parse } from 'acorn'
import Ajv from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { root, dist, nodeCodes, readJSON } from '../paths.mjs'
import { forbiddenGoja } from '../build/bundle.mjs'
const forbiddenPage = new Set([
    'require',
    'eval',
    'Function',
    'fetch',
    'XMLHttpRequest',
    'WebSocket',
    'Worker',
    'SharedWorker',
    'Date',
    'performance',
    'window',
    'document',
    'navigator',
    'localStorage',
    'sessionStorage',
    'process',
    'global',
    'globalThis',
    'Deno',
    'Bun',
    'setTimeout',
    'setInterval',
    'setImmediate',
    'requestAnimationFrame',
    'queueMicrotask',
    'crypto',
])
/**
 * 解析最终单文件产物，检查模块形式、体积和运行环境禁止访问的全局。
 * 构建成功不代表宿主可执行，产物仍需浏览器或 Goja 的实际加载验证。
 */
export function inspect(source, kind) {
    if (!source || Buffer.byteLength(source) > 5 * 1024 * 1024 || source.includes('\0'))
        throw new Error('源码为空、超过 5 MiB 或含 NUL')
    const ast = parse(source, {
        ecmaVersion: 'latest',
        sourceType: kind === 'executor' ? 'script' : 'module',
    })
    function visit(node, parent) {
        if (!node || typeof node !== 'object') return
        if (node.type === 'ImportExpression') throw new Error('产物不能动态 import')
        if (node.type === 'ImportDeclaration' && (kind !== 'panel' || node.source.value !== 'lit'))
            throw new Error('产物含不支持的 import')
        if (
            (node.type === 'ExportNamedDeclaration' || node.type === 'ExportAllDeclaration') &&
            node.source
        )
            throw new Error('产物不能从外部 re-export')
        const forbidden = kind === 'page-program' ? forbiddenPage : forbiddenGoja
        if (kind !== 'panel' && node.type === 'Identifier' && forbidden.has(node.name)) {
            const property =
                (parent?.type === 'MemberExpression' &&
                    parent.property === node &&
                    !parent.computed) ||
                (parent?.type === 'Property' &&
                    parent.key === node &&
                    !parent.computed &&
                    !parent.shorthand)
            if (!property) throw new Error(kind + ' 禁止访问 ' + node.name)
        }
        if (
            kind === 'executor' &&
            node.type === 'MemberExpression' &&
            node.object?.name === 'globalThis' &&
            forbiddenGoja.has(node.property?.name ?? node.property?.value)
        )
            throw new Error('Goja 不提供该宿主全局')
        if (
            kind === 'page-program' &&
            node.type === 'MemberExpression' &&
            node.object?.name === 'Math' &&
            (node.property?.name ?? node.property?.value) === 'random'
        )
            throw new Error('数据程序不能使用随机数')
        for (const value of Object.values(node))
            if (Array.isArray(value)) value.forEach((child) => visit(child, node))
            else if (value && typeof value === 'object') visit(value, node)
    }
    visit(ast, null)
    const exports = ast.body.filter((n) => n.type.startsWith('Export'))
    if (
        kind === 'panel' &&
        !exports.some(
            (n) =>
                n.type === 'ExportDefaultDeclaration' ||
                n.specifiers?.some((s) => s.exported.name === 'default'),
        )
    )
        throw new Error('面板缺少默认导出')
    if (kind === 'page-program') {
        const names = exports.flatMap((n) =>
            n.declaration?.id
                ? [n.declaration.id.name]
                : (n.specifiers?.map((s) => s.exported.name) ?? []),
        )
        if (names.length !== 1 || names[0] !== 'prepareInput')
            throw new Error('数据程序只允许导出 prepareInput')
    }
    return ast
}
/**
 * 检查原始 URL 的控制字符、百分号编码和完整协议/主机，随后再调用 URL 解析。
 * 不让解析器的自动补全或规范化掩盖平台应拒绝的原始输入。
 */
export function validPlatformURL(text) {
    if (
        !text ||
        text.trim() !== text ||
        /[\u0000-\u001f\u007f]/.test(text) ||
        /%(?![0-9a-fA-F]{2})/.test(text)
    )
        return false
    const authority = text.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/([^/?#]+)/)?.[1]
    if (!authority || authority.includes('\\')) return false
    try {
        const url = new URL(text)
        return Boolean(url.protocol && url.host)
    } catch {
        return false
    }
}
/**
 * 装载随工程固定的系统 Schema 与格式校验器。只使用本地可信类型快照，
 * 不从外部网络解析 $ref；类型检查不能替代这里的运行时数据约束。
 */
export async function schemaValidator() {
    const ajv = new Ajv({ strict: false, allErrors: true })
    addFormats(ajv)
    ajv.addFormat('mf-url', { type: 'string', validate: validPlatformURL })
    for (const file of await readdir(path.join(root, 'packages/contracts/schemas')))
        ajv.addSchema(await readJSON(path.join(root, 'packages/contracts/schemas', file)))
    return ajv
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
    const ajv = await schemaValidator()
    for (const code of await nodeCodes()) {
        const manifest = await readJSON(path.join(dist, code, 'manifest.json'))
        for (const [entry, artifact] of Object.entries(manifest.artifacts)) {
            const source = await readFile(path.join(dist, code, artifact.file), 'utf8')
            if (
                artifact.sha256 !== createHash('sha256').update(source).digest('hex') ||
                artifact.bytes !== Buffer.byteLength(source)
            )
                throw new Error('产物已改动或清单过期：' + code + '/' + entry)
            inspect(
                source,
                entry === 'executor'
                    ? 'executor'
                    : entry === 'pageProgram'
                      ? 'page-program'
                      : 'panel',
            )
        }
        if (manifest.interface !== 'panels') {
            const body = await readJSON(path.join(dist, code, 'node.json'))
            if (body.source !== (await readFile(path.join(dist, code, 'program.js'), 'utf8')))
                throw new Error('node.json 与执行源码不一致')
            if (body.outputSchema.required?.includes('items') || body.outputSchema.properties.item)
                throw new Error('输出 items 不能必填，不能声明单数 item')
            const validate = ajv.compile(body.inputSchema),
                fixture = await readJSON(path.join(root, 'nodes', code, 'fixtures/input.json'))
            if (!validate(fixture))
                throw new Error(
                    code + ' 输入 fixture 不符合 Schema：' + JSON.stringify(validate.errors),
                )
            ajv.compile(body.outputSchema)
        }
        console.log(code + ': 模块、体积、哈希与输入 Schema 校验通过')
    }
}
