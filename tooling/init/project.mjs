import { parseArgs } from 'node:util'
import path from 'node:path'
import { cp, mkdir, readdir, writeFile, readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { root } from '../paths.mjs'
import { initializeManaged } from '../upstream/index.mjs'
import { nodeFiles, presets } from './templates.mjs'
const { values } = parseArgs({
    options: {
        dir: { type: 'string' },
        name: { type: 'string' },
        preset: { type: 'string', default: 'all' },
    },
})
if (
    !values.dir ||
    !values.name ||
    !/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(values.name) ||
    (values.preset !== 'all' && !presets.includes(values.preset))
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
const includes = [
    'lib',
    'tooling',
    'playground',
    'tests',
    'shared',
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
        force: false,
        errorOnExist: true,
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
                    ].includes(part),
                ),
    })
for (const file of ['package.json', 'package-lock.json']) {
    const value = JSON.parse(await readFile(path.join(target, file), 'utf8'))
    value.name = values.name
    if (file === 'package-lock.json') value.packages[''].name = values.name
    await writeFile(path.join(target, file), JSON.stringify(value, null, 4) + '\n')
}
for (const preset of values.preset === 'all' ? presets : [values.preset]) {
    for (const [relative, content] of Object.entries(nodeFiles(preset, preset))) {
        const file = path.join(target, 'nodes', preset, relative)
        await mkdir(path.dirname(file), { recursive: true })
        await writeFile(file, content, { flag: 'wx' })
    }
}
await initializeManaged(target)
const git = spawnSync('git', ['init', '--initial-branch=main', target], { stdio: 'inherit' })
if (git.error) throw git.error
if (git.status !== 0) process.exit(git.status ?? 1)
console.log('created ' + target + '; next: npm ci && npm run check')
