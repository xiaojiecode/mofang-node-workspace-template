import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { build, transformSync } from 'esbuild'
import { parse } from 'acorn'
import { root } from '../paths.mjs'
// 两种构建仅在可读性和压缩上不同，指令始终匹配统一宿主 ABI。
export const litMode = 'production'
export const buildMode = process.argv.includes('--development') ? 'development' : 'production'
export const forbiddenGoja = new Set([
    'fetch',
    'XMLHttpRequest',
    'WebSocket',
    'window',
    'document',
    'localStorage',
    'sessionStorage',
    'process',
    'require',
    'console',
    'setTimeout',
    'setInterval',
    'setImmediate',
    'queueMicrotask',
    'URL',
    'URLSearchParams',
    'TextEncoder',
    'TextDecoder',
    'structuredClone',
    'Intl',
])

/**
 * 只压缩能静态证明为 lit.css 的无插值模板。插值可能出现在选择器、属性值或
 * @规则内部，无法在不执行作者代码的情况下安全重写，因此保留原模板。
 */
function compressStaticCss(source) {
    let transformedSource = transformSync(source, {
        loader: 'ts',
        format: 'esm',
        target: 'esnext',
    }).code
    const ast = parse(transformedSource, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        locations: false,
    })
    const cssNames = new Set()
    for (const statement of ast.body) {
        if (statement.type !== 'ImportDeclaration' || statement.source.value !== 'lit') continue
        for (const element of statement.specifiers) {
            if (element.type === 'ImportSpecifier' && element.imported.name === 'css')
                cssNames.add(element.local.name)
        }
    }
    if (!cssNames.size) return transformedSource
    const edits = []
    function visit(node) {
        if (
            node?.type === 'TaggedTemplateExpression' &&
            node.tag?.type === 'Identifier' &&
            cssNames.has(node.tag.name) &&
            node.quasi?.expressions?.length === 0
        ) {
            const transformed = transformSync(node.quasi.quasis[0].value.cooked, {
                loader: 'css',
                minifyWhitespace: true,
                minifySyntax: false,
                minifyIdentifiers: false,
                legalComments: 'inline',
            }).code.trim()
            const escaped = transformed
                .replaceAll('\\', '\\\\')
                .replaceAll('`', '\\`')
                .replaceAll('${', '\\${')
            edits.push({
                start: node.quasi.start + 1,
                end: node.quasi.end - 1,
                value: escaped,
            })
        }
        for (const [key, value] of Object.entries(node ?? {})) {
            if (key === 'loc' || key === 'start' || key === 'end') continue
            if (Array.isArray(value)) {
                for (const child of value) if (child?.type) visit(child)
            } else if (value?.type) visit(value)
        }
    }
    visit(ast)
    for (const edit of edits.sort((a, b) => b.start - a.start))
        transformedSource =
            transformedSource.slice(0, edit.start) + edit.value + transformedSource.slice(edit.end)
    return transformedSource
}
/**
 * 将一个作者入口编译为宿主可加载的单文件。正式模式启用标识符、语法和空白压缩，
 * 保留函数/类 name 及全部属性名，避免破坏生命周期钩子、Lit 注入属性和公开协议。
 * Goja 仍降级到 ES2016；开发模式保留可读产物。minify 覆盖值仅用于等价性回归比较。
 */
export async function bundle(file, kind, options = {}) {
    const started = performance.now()
    const minify = options.minify ?? buildMode === 'production'
    const panel = kind === 'panel'
    const format = options.format ?? (kind === 'executor' ? 'iife' : 'esm')
    const target = options.target ?? (kind === 'executor' ? 'es2016' : 'es2022')
    // 平台清单接收普通函数，提交前将异步方法降级为普通函数。
    const result = await build({
        absWorkingDir: root,
        entryPoints: [file],
        bundle: true,
        write: false,
        loader: { '.svg': 'dataurl' },
        format,
        ...(kind === 'executor' ? { globalName: '__mfProgram' } : {}),
        target,
        platform: 'neutral',
        conditions: panel ? [litMode] : [],
        minify,
        keepNames: true,
        charset: 'utf8',
        treeShaking: true,
        legalComments: 'none',
        metafile: true,
        logLevel: 'silent',
        plugins: [
            {
                name: 'runtime-boundary',
                setup(api) {
                    api.onLoad({ filter: /\.(?:ts|mts)$/ }, async (args) => ({
                        contents:
                            options.optimizeCss === false
                                ? await readFile(args.path, 'utf8')
                                : compressStaticCss(await readFile(args.path, 'utf8')),
                        loader: options.optimizeCss === false ? 'ts' : 'js',
                    }))
                    api.onResolve({ filter: /^(lit|lit-html|@lit\/reactive-element)$/ }, (args) =>
                        panel
                            ? { path: 'lit', external: true }
                            : { errors: [{ text: '后台及页面数据程序不能引用 Lit' }] },
                    )
                    api.onResolve(
                        { filter: /(?:^|\/)(?:lit-html|lit-element|reactive-element)\.js$/ },
                        (args) => {
                            const resolved = path
                                .resolve(path.dirname(args.importer), args.path)
                                .replaceAll('\\', '/')
                            if (
                                !/\/node_modules\/(?:lit-html|lit-element|@lit\/reactive-element)\//.test(
                                    resolved,
                                )
                            )
                                return
                            return panel
                                ? { path: 'lit', external: true }
                                : { errors: [{ text: '非展示产物不能加载 Lit 核心' }] }
                        },
                    )
                    api.onResolve({ filter: /^node:/ }, (args) => ({
                        errors: [{ text: '发布产物不能引用 ' + args.path }],
                    }))
                },
            },
        ],
    })
    for (const input of Object.keys(result.metafile.inputs)) {
        if (
            kind === 'executor' &&
            /(?:lit-ui|lit-host|contracts\/src\/browser|apps\/playground|fixtures|node_modules\/(?:lit|lit-html|@lit)\/)/.test(
                input,
            )
        )
            throw new Error('Goja 包引入了浏览器或预览代码：' + input)
        if (
            panel &&
            /node_modules\/(?:lit-html\/lit-html|@lit\/reactive-element\/reactive-element|lit-element\/lit-element)\.js$/.test(
                input,
            )
        )
            throw new Error('面板包含第二份 Lit 核心：' + input)
    }
    if (result.outputFiles.length !== 1)
        throw new Error('发布入口必须生成单个文件，不允许外置 CSS、图片或 chunks。')
    let code = result.outputFiles[0].text
    if (kind === 'executor')
        code += minify
            ? 'const program=__mfProgram.default;\n'
            : '\nconst program = __mfProgram.default;\n'
    const imports = Object.values(result.metafile.outputs).flatMap((o) => o.imports)
    if (imports.some((i) => i.path !== 'lit' || !panel || i.kind === 'dynamic-import'))
        throw new Error('产物残留不支持的模块导入')
    return {
        code,
        inputs: Object.keys(result.metafile.inputs),
        format,
        target,
        sourceBytes: Object.values(result.metafile.inputs).reduce(
            (sum, input) => sum + input.bytes,
            0,
        ),
        durationMs: performance.now() - started,
    }
}
/** 读取本地 node.ts 构建描述；它不是平台请求，不执行后台 program 或页面业务。 */
export async function loadDefinition(directory) {
    const result = await build({
        absWorkingDir: root,
        entryPoints: [path.join(directory, 'node.ts')],
        bundle: true,
        write: false,
        format: 'esm',
        platform: 'node',
        target: 'es2022',
        logLevel: 'silent',
    })
    return (
        await import(
            'data:text/javascript;base64,' +
                Buffer.from(result.outputFiles[0].text).toString('base64')
        )
    ).default
}
