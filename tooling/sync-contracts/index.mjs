import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { readdir, readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises'
import { compile } from 'json-schema-to-typescript'
import { root, cache, readJSON, prepareCache } from '../paths.mjs'
const args = process.argv.slice(2)
const workspaceIndex = args.indexOf('--workspace')
const workspace = workspaceIndex < 0 ? process.env.MOFANG_WORKSPACE : args[workspaceIndex + 1]
if (!workspace)
  throw new Error('维护者同步需要 --workspace <mofangv6>；普通开发使用仓库自带类型，不需要同步。')
const sourceRoot = path.resolve(workspace)
const destination = path.join(root, 'packages/contracts')
const hash = (value) => createHash('sha256').update(value).digest('hex')
const sources = {}
async function record(relative) {
  const bytes = await readFile(path.join(sourceRoot, relative))
  sources[relative] = hash(bytes)
  return bytes
}
for (const [folder, accept] of [
  [
    'mf-client/src/features/workflow/mofangsdk/core',
    (n) => n.endsWith('.ts') && !/test|typecheck|fixture/.test(n),
  ],
  ['mofang-server/pkg/workflow/schemas', (n) => n.endsWith('.json')],
  ['mofang-server/pkg/jsprogram', (n) => n.endsWith('.go') && !n.endsWith('_test.go')],
])
  for (const name of (await readdir(path.join(sourceRoot, folder))).sort())
    if (accept(name)) await record(folder + '/' + name)
for (const file of [
  'mf-client/src/features/workflow/node-pages/dynamic-lit-panel.tsx',
  'mf-client/src/features/workflow/node-pages/node-panel-provider.tsx',
  'mofang-server/web/admin/src/api/workflowJavaScript.ts',
  'mofang-server/services/workflow/internal/pagecompiler/compiler.go',
  'mofang-server/go.mod',
])
  await record(file)
if (args.includes('--check')) {
  const previous = await readJSON(path.join(destination, 'provenance.json'))
  if (JSON.stringify(previous.sources) !== JSON.stringify(sources))
    throw new Error('平台源码已变化：需要显式同步并重新核验 Goja 手工作者声明。')
  console.log('契约来源内容哈希一致。')
  process.exit(0)
}
await prepareCache()
const stage = path.join(cache, 'contracts-export')
await mkdir(stage, { recursive: true })
const core = path.join(sourceRoot, 'mf-client/src/features/workflow/mofangsdk/core')
const config = path.join(stage, 'tsconfig.json')
await writeFile(
  config,
  JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      strict: true,
      skipLibCheck: true,
      types: [],
      lib: ['ES2022', 'DOM'],
      declaration: true,
      emitDeclarationOnly: true,
      rootDir: core,
      outDir: path.join(stage, 'sdk'),
    },
    files: [path.join(core, 'index.ts')],
  }),
)
const result = spawnSync(path.join(root, 'node_modules/.bin/tsc'), ['-p', config], {
  cwd: root,
  stdio: 'inherit',
})
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
await mkdir(path.join(destination, 'src/browser'), { recursive: true })
await rm(path.join(destination, 'src/browser/sdk'), { recursive: true, force: true })
await cp(path.join(stage, 'sdk'), path.join(destination, 'src/browser/sdk'), { recursive: true })
// Execution author types have a separate, runtime-verified entry point.
const index = path.join(destination, 'src/browser/sdk/index.d.ts')
await writeFile(
  index,
  (await readFile(index, 'utf8')).replace(
    /^export type \* from ['"]\.\/node-program-types['"];?\n/m,
    '',
  ),
)
const schemas = {}
for (const name of (
  await readdir(path.join(sourceRoot, 'mofang-server/pkg/workflow/schemas'))
).sort()) {
  if (!name.endsWith('.json')) continue
  schemas[name.slice(0, -5)] = JSON.parse(
    await readFile(path.join(sourceRoot, 'mofang-server/pkg/workflow/schemas', name), 'utf8'),
  )
}
await mkdir(path.join(destination, 'schemas'), { recursive: true })
for (const [name, schema] of Object.entries(schemas))
  await writeFile(
    path.join(destination, 'schemas', name + '.json'),
    JSON.stringify(schema, null, 2) + '\n',
  )
const names = Object.keys(schemas)
const pascal = (s) => s[0].toUpperCase() + s.slice(1)
const rewrite = (value) => {
  if (Array.isArray(value)) return value.map(rewrite)
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !['$schema', '$id'].includes(k))
        .map(([k, v]) => [k, k === '$ref' ? '#/$defs/' + pascal(v.split(':').at(-2)) : rewrite(v)]),
    )
  return value
}
const schema = {
  type: 'object',
  properties: Object.fromEntries(names.map((n) => [n, { $ref: '#/$defs/' + pascal(n) }])),
  required: names,
  additionalProperties: false,
  $defs: Object.fromEntries(
    names.map((n) => [pascal(n), { ...rewrite(schemas[n]), title: pascal(n) }]),
  ),
}
const output = await compile(schema, 'BuiltinTypes', {
  bannerComment:
    '/** Generated from platform JSON Schema. Do not edit. Runtime validation still applies. */',
  style: { singleQuote: true, semi: false },
})
await mkdir(path.join(destination, 'src/business'), { recursive: true })
await writeFile(path.join(destination, 'src/business/index.ts'), output)
await writeFile(
  path.join(destination, 'provenance.json'),
  JSON.stringify(
    {
      schemaVersion: 1,
      syncedAt: new Date().toISOString(),
      sources,
      authorTypes:
        'src/goja/index.ts is maintained against pkg/jsprogram, not generated from Go. Browser declarations exclude execution author exports.',
    },
    null,
    2,
  ) + '\n',
)
console.log('已导出 SDK 声明与 ' + names.length + ' 个系统类型；Goja 作者声明需要运行验证。')
