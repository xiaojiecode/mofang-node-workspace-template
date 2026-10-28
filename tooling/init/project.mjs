import { parseArgs } from 'node:util'
import path from 'node:path'
import { cp, mkdir, readdir, writeFile, readFile, rm } from 'node:fs/promises'
import { root } from '../paths.mjs'
import { initializeGitHistory, initializeWorkspace } from '../upstream/index.mjs'
const { values } = parseArgs({
    options: {
        dir: { type: 'string' },
        name: { type: 'string' },
    },
})
if (
    !values.dir ||
    !values.name ||
    !/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(values.name)
)
    throw new Error('init requires --dir <empty-dir> --name <package-name>')
const target = path.resolve(values.dir)
if (target === root || target.startsWith(root + path.sep))
    throw new Error('new project must be outside template root')
try {
    if ((await readdir(target)).length) throw new Error('target is not empty; no files overwritten')
} catch (error) {
    if (error.code !== 'ENOENT') throw error
}
await mkdir(target, { recursive: true })
const sourceCommit = await initializeGitHistory(target)
// 仅在本次新建的工程中重置起始内容。
// vendor 必须使用当前完整快照，不能残留 Git 基线中的旧大包。
for (const name of ['nodes', 'shared', 'vendor', '.agents/managed.json'])
    await rm(path.join(target, name), { recursive: true, force: true })
const includes = [
    'lib',
    'tooling',
    'playground',
    'tests',
    'docs',
    '.agents',
    '.github',
    'package.json',
    'package-lock.json',
    'tsconfig.base.json',
    'tsconfig.json',
    'tsconfig.goja.json',
    'tsconfig.page-program.json',
    '.gitignore',
    '.editorconfig',
    '.npmrc',
    '.prettierrc.json',
    '.prettierignore',
    'README.md',
    'AGENTS.md',
]
for (const name of includes)
    await cp(path.join(root, name), path.join(target, name), {
        recursive: true,
        force: true,
        filter: (source) =>
            !source
                .split(path.sep)
                .some((part) =>
                    [
                        'node_modules',
                        '.cache',
                        'dist',
                        '.git',
                        '__pycache__',
                        'upstream-state.json',
                        'upstream-journal.json',
                        'upstream.lock',
                        'upstream-merge.json',
                        'upstream-checkout.json',
                    ].includes(part),
                ),
    })
// 固定共享包必须带上编译产物；通用模板过滤器会排除 dist，不能用于 vendor。
await cp(path.join(root, 'vendor'), path.join(target, 'vendor'), {
    recursive: true,
    force: true,
    // 本地包中的 npm 安装目录不属于分发内容；保留 SDK 的 dist 与精简低代码目录。
    filter: (source) =>
        !path.relative(path.join(root, 'vendor'), source).split(path.sep).includes('node_modules'),
})
for (const file of ['package.json', 'package-lock.json']) {
    const value = JSON.parse(await readFile(path.join(target, file), 'utf8'))
    value.name = values.name
    // 页面发布产物是宿主直接加载的 CommonJS；新工程不应让 .js 按 ESM 解析。
    if (file === 'package.json') delete value.type
    if (file === 'package-lock.json') value.packages[''].name = values.name
    await writeFile(path.join(target, file), JSON.stringify(value, null, 4) + '\n')
}
// shared 属于当前用户业务，新工程从空目录开始。
await mkdir(path.join(target, 'shared'), { recursive: true })
await writeFile(path.join(target, 'shared/.gitkeep'), '')
// 初始化只准备空的节点目录；使用 node:new 按需创建中性骨架。
await mkdir(path.join(target, 'nodes'), { recursive: true })
await writeFile(path.join(target, 'nodes/.gitkeep'), '')
await initializeWorkspace(target, sourceCommit)
console.log('created ' + target + '; next: npm ci && npm run check')
