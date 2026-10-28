import { parseArgs } from 'node:util'
import path from 'node:path'
import { cp, mkdir, readdir, writeFile, readFile, rm } from 'node:fs/promises'
import { root } from '../paths.mjs'
import { initializeGitHistory, initializeWorkspace } from '../upstream/index.mjs'
import { nodeFiles, presets } from './templates.mjs'
const { values } = parseArgs({
    options: {
        dir: { type: 'string' },
        name: { type: 'string' },
        preset: { type: 'string', default: 'all' },
        'settings-renderer': { type: 'string', default: 'lit' },
        'business-renderer': { type: 'string', default: 'lit' },
    },
})
if (
    !values.dir ||
    !values.name ||
    !/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(values.name) ||
    (values.preset !== 'all' && !presets.includes(values.preset)) ||
    ![values['settings-renderer'], values['business-renderer']].every((renderer) =>
        ['lit', 'puck'].includes(renderer),
    )
)
    throw new Error(
        'init requires --dir <empty-dir> --name <package-name> [--preset all|copy|selection|human-wait|multi-instance]',
    )
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
// Only this newly created checkout is reset to the requested starter content.
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
// shared belongs to the current user's business; a fresh scaffold starts empty.
await mkdir(path.join(target, 'shared'), { recursive: true })
await writeFile(path.join(target, 'shared/.gitkeep'), '')
for (const preset of values.preset === 'all' ? presets : [values.preset]) {
    for (const [relative, content] of Object.entries(
        nodeFiles(preset, preset, {
            settingsRenderer: values['settings-renderer'],
            businessRenderer: values['business-renderer'],
        }),
    )) {
        const file = path.join(target, 'nodes', preset, relative)
        await mkdir(path.dirname(file), { recursive: true })
        await writeFile(file, content, { flag: 'wx' })
    }
}
await initializeWorkspace(target, sourceCommit)
console.log('created ' + target + '; next: npm ci && npm run check')
