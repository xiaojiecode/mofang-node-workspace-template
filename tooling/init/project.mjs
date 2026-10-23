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
const sourceCommit = await initializeGitHistory(target)
// Only this newly created checkout is reset to the requested starter content.
for (const name of ['nodes', 'shared', '.agents/managed.json'])
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
for (const file of ['package.json', 'package-lock.json']) {
    const value = JSON.parse(await readFile(path.join(target, file), 'utf8'))
    value.name = values.name
    if (file === 'package-lock.json') value.packages[''].name = values.name
    await writeFile(path.join(target, file), JSON.stringify(value, null, 4) + '\n')
}
// shared belongs to the current user's business; a fresh scaffold starts empty.
await mkdir(path.join(target, 'shared'), { recursive: true })
await writeFile(path.join(target, 'shared/.gitkeep'), '')
for (const preset of values.preset === 'all' ? presets : [values.preset]) {
    for (const [relative, content] of Object.entries(nodeFiles(preset, preset))) {
        const file = path.join(target, 'nodes', preset, relative)
        await mkdir(path.dirname(file), { recursive: true })
        await writeFile(file, content, { flag: 'wx' })
    }
}
await initializeWorkspace(target, sourceCommit)
console.log('created ' + target + '; next: npm ci && npm run check')
