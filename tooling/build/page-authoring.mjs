import { parse } from 'acorn'
import { transformSync } from 'esbuild'

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

/** 保留未使用导入和不可达分支，只移除 TypeScript 类型供作者规则分析。 */
export function authorJavaScript(source) {
    return transformSync(source, {
        loader: 'ts',
        format: 'esm',
        target: 'esnext',
        minify: false,
        treeShaking: false,
        legalComments: 'none',
        tsconfigRaw: { compilerOptions: { verbatimModuleSyntax: true } },
    }).code
}

/** 检查每个实际参与构建的作者模块；本地依赖由打包器解析，不在这里猜来源。 */
export function inspectAuthorModule(source, kind) {
    const ast = parse(source, { ecmaVersion: 'latest', sourceType: 'module' })
    function visit(node, parent) {
        if (!node || typeof node !== 'object') return
        if (node.type === 'ImportExpression') throw new Error('页面产物不能动态 import')
        if (kind === 'page-program' && node.type === 'Identifier' && forbiddenPage.has(node.name)) {
            const property =
                (parent?.type === 'MemberExpression' &&
                    parent.property === node &&
                    !parent.computed) ||
                (parent?.type === 'Property' &&
                    parent.key === node &&
                    !parent.computed &&
                    !parent.shorthand)
            if (!property) throw new Error('页面数据程序禁止访问 ' + node.name)
        }
        if (
            kind === 'page-program' &&
            node.type === 'MemberExpression' &&
            node.object?.name === 'Math' &&
            (node.property?.name ?? node.property?.value) === 'random'
        )
            throw new Error('页面数据程序不能使用随机数')
        for (const value of Object.values(node)) {
            if (Array.isArray(value)) value.forEach((child) => visit(child, node))
            else if (value && typeof value === 'object') visit(value, node)
        }
    }
    visit(ast, null)
    return ast
}

/** 检查未压缩的完整 ESM 公开接口，不依赖正式 CommonJS helper 的名称。 */
export function inspectAuthorBundle(source, kind) {
    const ast = inspectAuthorModule(source, kind)
    const bindings = new Map()
    const exported = []
    for (const statement of ast.body) {
        const declaration =
            statement.type === 'ExportNamedDeclaration' ? statement.declaration : statement
        if (declaration?.type === 'FunctionDeclaration' && declaration.id)
            bindings.set(declaration.id.name, declaration)
        if (declaration?.type === 'VariableDeclaration')
            for (const item of declaration.declarations)
                if (item.id.type === 'Identifier') bindings.set(item.id.name, item.init)
        if (
            statement.type === 'ImportDeclaration' &&
            (kind !== 'panel' || statement.source.value !== 'lit')
        )
            throw new Error('页面产物含不支持的运行时依赖')
        if (
            statement.type === 'ExportAllDeclaration' ||
            (statement.type === 'ExportNamedDeclaration' && statement.source)
        )
            throw new Error('页面产物不能残留外部 re-export')
        if (statement.type === 'ExportDefaultDeclaration') exported.push({ name: 'default' })
        if (statement.type === 'ExportNamedDeclaration') {
            if (declaration?.id)
                exported.push({ name: declaration.id.name, local: declaration.id.name })
            else if (declaration?.type === 'VariableDeclaration')
                for (const item of declaration.declarations)
                    exported.push({ name: item.id.name, local: item.id.name })
            for (const specifier of statement.specifiers ?? [])
                exported.push({
                    name: specifier.exported.name ?? specifier.exported.value,
                    local: specifier.local.name,
                })
        }
    }
    // panel 也用于共享浏览器库打包；默认导出由节点产物 verify 与真实 Lit 宿主核对。
    if (kind === 'panel') return
    if (exported.length !== 1 || exported[0].name !== 'prepareInput')
        throw new Error('数据程序只允许导出 prepareInput')
    const seen = new Set()
    let local = exported[0].local
    let binding = bindings.get(local)
    while (binding?.type === 'Identifier' && !seen.has(local)) {
        seen.add(local)
        local = binding.name
        binding = bindings.get(local)
    }
    if (
        !['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(
            binding?.type,
        )
    )
        throw new Error('数据程序导出的 prepareInput 必须是函数')
    const targets = new Set([exported[0].local, local, ...seen])
    // 顶层重写会直接改变模块导出；函数体内的同名局部变量不冒充模块绑定。
    for (const statement of ast.body) {
        const node = statement.type === 'ExpressionStatement' ? statement.expression : undefined
        if (
            (node?.type === 'AssignmentExpression' &&
                node.left.type === 'Identifier' &&
                targets.has(node.left.name)) ||
            (node?.type === 'UpdateExpression' &&
                node.argument.type === 'Identifier' &&
                targets.has(node.argument.name))
        )
            throw new Error('数据程序不能重写 prepareInput 导出绑定')
    }
}
