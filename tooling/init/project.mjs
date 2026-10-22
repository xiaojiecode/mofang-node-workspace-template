import { parseArgs } from 'node:util'
import path from 'node:path'
import { cp, mkdir, readdir, writeFile, access, readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { root, readJSON } from '../paths.mjs'
import { nodeFiles } from './templates.mjs'
const { values } = parseArgs({
    options: {
        dir: { type: 'string' },
        name: { type: 'string' },
        interface: { type: 'string', default: 'lifecycle' },
    },
})
if (
    !values.dir ||
    !values.name ||
    !/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(values.name)
)
    throw new Error(
        '用法：npm run init -- --dir <empty-dir> --name <package-name> [--interface stages|lifecycle|main|panels]',
    )
if (!['main', 'stages', 'lifecycle', 'panels'].includes(values.interface))
    throw new Error('未知执行接口')
const target = path.resolve(values.dir)
if (target === root || target.startsWith(root + path.sep))
    throw new Error('新仓库必须位于模板仓库外，避免复制递归。')
try {
    if ((await readdir(target)).length) throw new Error('目标目录非空，未覆盖任何文件：' + target)
} catch (error) {
    if (error.code !== 'ENOENT') throw error
}
const includes = [
    'packages',
    'apps',
    'tooling',
    'tests',
    'package.json',
    'package-lock.json',
    'tsconfig.base.json',
    'tsconfig.json',
    'tsconfig.goja.json',
    'tsconfig.page-program.json',
    '.gitignore',
    '.editorconfig',
    '.npmrc',
    'README.md',
    'AGENTS.md',
    'assets',
    '.prettierrc.json',
    '.prettierignore',
    '.github',
]
for (const item of includes) await access(path.join(root, item))
await mkdir(target, { recursive: true })
for (const item of includes)
    await cp(path.join(root, item), path.join(target, item), {
        recursive: true,
        force: false,
        errorOnExist: true,
        filter: (src) =>
            !src
                .split(path.sep)
                .some((n) => ['node_modules', '.cache', 'dist', '.git'].includes(n)),
    })
const pkg = await readJSON(path.join(target, 'package.json'))
pkg.name = values.name
await writeFile(path.join(target, 'package.json'), JSON.stringify(pkg, null, 4) + '\n')
const lock = await readJSON(path.join(target, 'package-lock.json'))
lock.name = values.name
lock.packages[''].name = values.name
await writeFile(path.join(target, 'package-lock.json'), JSON.stringify(lock, null, 4) + '\n')
for (const [relative, content] of Object.entries(nodeFiles('pass-through', values.interface))) {
    const file = path.join(target, 'nodes/pass-through', relative)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, content, { flag: 'wx' })
}
if (values.interface !== 'panels')
    await writeFile(
        path.join(target, 'nodes/pass-through/fixtures/goja-test.js'),
        await readFile(new URL('./goja-fixture.js', import.meta.url)),
        { flag: 'wx' },
    )
const git = spawnSync('git', ['init', '--initial-branch=main', target], { stdio: 'inherit' })
if (git.error) throw git.error
if (git.status !== 0) process.exit(git.status ?? 1)
console.log(
    '项目已初始化：' +
        target +
        '\n下一步：npm ci && npm run dev；完整检查：npm run check（浏览器与 Go 环境见 README）',
)
