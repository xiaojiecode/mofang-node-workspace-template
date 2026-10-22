import path from 'node:path'
import { build } from 'esbuild'
import { root } from '../paths.mjs'
export const litMode =
  process.env.MF_LIT_MODE ?? (process.argv.includes('--development') ? 'development' : 'production')
if (!['production', 'development'].includes(litMode))
  throw new Error('MF_LIT_MODE 必须为 production 或 development')
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
export async function bundle(file, kind) {
  const panel = kind === 'panel'
  // The platform manifest accepts ordinary functions; lower async methods before submission.
  const result = await build({
    absWorkingDir: root,
    entryPoints: [file],
    bundle: true,
    write: false,
    format: kind === 'executor' ? 'iife' : 'esm',
    ...(kind === 'executor' ? { globalName: '__mfProgram' } : {}),
    target: kind === 'executor' ? 'es2016' : 'es2022',
    platform: 'neutral',
    conditions: panel ? [litMode] : [],
    minify: false,
    treeShaking: true,
    legalComments: 'none',
    metafile: true,
    logLevel: 'silent',
    plugins: [
      {
        name: 'runtime-boundary',
        setup(api) {
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
                .replaceAll('\\\\', '/')
              if (
                !/\/node_modules\/(?:lit-html|lit-element|@lit\/reactive-element)\//.test(resolved)
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
  if (kind === 'executor') code += '\nconst program = __mfProgram.default;\n'
  const imports = Object.values(result.metafile.outputs).flatMap((o) => o.imports)
  if (imports.some((i) => i.path !== 'lit' || !panel || i.kind === 'dynamic-import'))
    throw new Error('产物残留不支持的模块导入')
  return { code, inputs: Object.keys(result.metafile.inputs) }
}
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
      'data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64')
    )
  ).default
}
