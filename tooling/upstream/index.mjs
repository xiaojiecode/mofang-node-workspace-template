import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { mkdir, readFile, writeFile, rm, lstat, readdir, rename } from 'node:fs/promises'
import { root as defaultRoot, cache as defaultCache } from '../paths.mjs'

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
const official = 'https://github.com/xiaojiecode/mofang-node-workspace-template.git'
const managedRoots = [
    'lib/',
    'tooling/',
    'playground/',
    'docs/',
    'tests/',
    '.agents/skills/mofang-js-node/',
    '.agents/skills/mofang-lit-node/',
    '.agents/skills/lit-best-practices/',
    '.github/',
]
const managedFiles = new Set([
    'AGENTS.md',
    'README.md',
    'package.json',
    'package-lock.json',
    'tsconfig.base.json',
    'tsconfig.json',
    'tsconfig.goja.json',
    'tsconfig.page-program.json',
    '.editorconfig',
    '.prettierrc.json',
    '.prettierignore',
    '.npmrc',
    '.gitignore',
])

/** 每个受管路径均来自明确清单，且不能进入业务文件或跟随符号链接越界。 */
function allowed(relative) {
    return (
        typeof relative === 'string' &&
        !relative.split('/').includes('__pycache__') &&
        !/\.py[co]$/.test(relative) &&
        !relative.includes('\\') &&
        !path.isAbsolute(relative) &&
        !relative.split('/').some((part) => !part || part === '.' || part === '..') &&
        (managedFiles.has(relative) || managedRoots.some((prefix) => relative.startsWith(prefix)))
    )
}
async function safeFile(directory, relative) {
    if (!allowed(relative)) throw new Error('unsafe managed path: ' + relative)
    const parts = relative.split('/')
    let current = directory
    for (const part of parts) {
        current = path.join(current, part)
        try {
            if ((await lstat(current)).isSymbolicLink())
                throw new Error('managed path contains a symlink: ' + relative)
        } catch (error) {
            if (error.code !== 'ENOENT') throw error
        }
    }
    return current
}
/** 控制目录与日志不能是外部链接；读配置前就检查，写入前重复检查。 */
async function assertControls(directory) {
    const agents = path.join(directory, '.agents')
    try {
        const stat = await lstat(agents)
        if (stat.isSymbolicLink() || !stat.isDirectory())
            throw new Error('unsafe .agents control directory')
    } catch (error) {
        if (error.code !== 'ENOENT') throw error
    }
    for (const name of [
        'upstream.json',
        'upstream-state.json',
        'upstream-journal.json',
        'upstream-checkout.json',
        'upstream.lock',
        'managed.json',
    ]) {
        try {
            const stat = await lstat(path.join(agents, name))
            if (stat.isSymbolicLink() || !stat.isFile())
                throw new Error('unsafe upstream control file: ' + name)
        } catch (error) {
            if (error.code !== 'ENOENT') throw error
        }
    }
}
async function bytes(file) {
    try {
        if ((await lstat(file)).isSymbolicLink()) throw new Error('unsafe symlink file')
        return await readFile(file)
    } catch (error) {
        if (error.code === 'ENOENT') return null
        throw error
    }
}
async function digest(file) {
    const value = await bytes(file)
    return value === null ? null : hash(value)
}
async function json(file, fallback) {
    const value = await bytes(file)
    return value === null ? fallback : JSON.parse(value)
}
async function save(file, value) {
    await assertControls(path.dirname(path.dirname(file)))
    await mkdir(path.dirname(file), { recursive: true })
    const temporary = file + '.next-' + process.pid
    await writeFile(temporary, JSON.stringify(value, null, 4) + '\n', { flag: 'wx' })
    try {
        await assertControls(path.dirname(path.dirname(file)))
        await rename(temporary, file)
    } finally {
        await rm(temporary, { force: true })
    }
}
function git(directory, args) {
    const result = spawnSync('git', ['-C', directory, ...args], {
        encoding: 'utf8',
        maxBuffer: 16 << 20,
        timeout: 60000,
    })
    if (result.error || result.status !== 0)
        throw new Error(
            'git operation failed (' +
                args[0] +
                '); authentication/network/ref must be checked without printing credentials',
        )
    return result.stdout.trim()
}
function sourceAllowed(source) {
    if (source.url !== official && !source.allowFileSource)
        throw new Error('source URL is not the configured official template')
    if (
        !source.ref ||
        !/^[A-Za-z0-9][A-Za-z0-9_./-]*$/.test(source.ref) ||
        source.ref.includes('..')
    )
        throw new Error('invalid upstream ref')
    if (source.allowFileSource && !path.isAbsolute(source.url))
        throw new Error('explicit file source must be an absolute path')
}

/** 发布/初始化时生成逐文件受管清单；nodes/shared/本地规则永不纳入。 */
export async function createManifest(directory = defaultRoot) {
    await assertControls(directory)
    const files = []
    async function visit(relative) {
        const file = path.join(directory, relative)
        const stat = await lstat(file)
        if (stat.isSymbolicLink()) throw new Error('managed assets cannot be symlinks: ' + relative)
        if (stat.isDirectory())
            for (const name of (await readdir(file)).sort()) await visit(relative + '/' + name)
        else if (
            allowed(relative) &&
            !relative.includes('__pycache__/') &&
            !relative.endsWith('.pyc')
        )
            files.push({ path: relative, sha256: await digest(file), deletion: 'if-unchanged' })
    }
    for (const file of [...managedFiles].sort())
        if ((await bytes(path.join(directory, file))) !== null) await visit(file)
    for (const folder of managedRoots) {
        try {
            await visit(folder.slice(0, -1))
        } catch (error) {
            if (error.code !== 'ENOENT') throw error
        }
    }
    files.sort((a, b) => a.path.localeCompare(b.path))
    return { version: 1, abi: 'mf.node/1', nodeMajor: 22, files }
}

/** 构建仅检查完整性；不会在半更新集或依赖待安装状态加载新工具。 */
export async function ensureUpstream(directory = defaultRoot) {
    await assertControls(directory)
    if (
        (await bytes(path.join(directory, '.agents/upstream-journal.json'))) ||
        (await bytes(path.join(directory, '.agents/upstream-checkout.json')))
    )
        throw new Error('upstream update interrupted; run upstream recover before building')
    const state = await json(path.join(directory, '.agents/upstream-state.json'), null)
    if (state?.dependenciesPending)
        throw new Error(
            'upstream dependenciesPending; install the pinned lock, then run upstream dependencies-ready',
        )
    const config = await json(path.join(directory, '.agents/upstream.json'), null)
    if (config?.mode === 'managed' && !state)
        throw new Error(
            'generated workspace has no managed baseline; run the initializer or complete initial adoption',
        )
}

/** 恢复只覆盖仍等于本次写入/写前内容的文件；中断后用户改动保持原样。 */
async function recoverFiles(directory = defaultRoot) {
    const checkoutFile = path.join(directory, '.agents/upstream-checkout.json')
    const checkout = await json(checkoutFile, null)
    if (checkout) {
        const head = git(directory, ['rev-parse', 'HEAD'])
        if (head !== checkout.beforeCommit && head !== checkout.targetCommit)
            return { status: 'conflict', reason: 'checkout HEAD changed after interrupted update' }
        if (head === checkout.beforeCommit && git(directory, ['status', '--porcelain']))
            return {
                status: 'conflict',
                reason: 'checkout files changed during interrupted fast-forward',
            }
        if (head === checkout.targetCommit) {
            const previous = await json(path.join(directory, '.agents/upstream-state.json'), {})
            await save(path.join(directory, '.agents/upstream-state.json'), {
                ...previous,
                version: 1,
                status: 'updated',
                sourceCommit: head,
                appliedCommit: head,
                dependenciesPending: Boolean(
                    previous.dependenciesPending || checkout.dependenciesPending,
                ),
                checkedAt: checkout.checkedAt,
            })
        }
        await rm(checkoutFile)
        return { status: 'current', recovered: 1 }
    }
    const journalFile = path.join(directory, '.agents/upstream-journal.json')
    const stateFile = path.join(directory, '.agents/upstream-state.json')
    const journal = await json(journalFile, null)
    if (!journal) return { status: 'current', recovered: 0 }
    const state = await json(stateFile, null)
    if (!('stateBefore' in journal) || !('stateAfter' in journal))
        return { status: 'incompatible', reason: 'journal metadata is incomplete' }
    const stateAfter = journal.stateAfter ?? null
    const committed = stateAfter !== null && JSON.stringify(state) === JSON.stringify(stateAfter)
    const stateBefore =
        journal.stateBefore === undefined
            ? undefined
            : journal.stateBefore === null
              ? null
              : JSON.parse(journal.stateBefore)
    if (
        !committed &&
        stateBefore !== undefined &&
        JSON.stringify(state) !== JSON.stringify(stateBefore)
    )
        return { status: 'conflict', conflicts: ['.agents/upstream-state.json'] }
    const conflicts = []
    for (const entry of journal.entries) {
        const local = await digest(await safeFile(directory, entry.path))
        if (committed ? local !== entry.after : local !== entry.before && local !== entry.after)
            conflicts.push(entry.path)
    }
    if (conflicts.length) return { status: 'conflict', conflicts }
    if (committed) {
        await rm(journalFile)
        return { status: 'current', recovered: 0, completedCommit: true }
    }
    for (const entry of [...journal.entries].reverse()) {
        const file = await safeFile(directory, entry.path)
        if (entry.before === null) await rm(file, { force: true })
        else {
            const backup = await readFile(entry.backup)
            if (hash(backup) !== entry.before) throw new Error('recovery backup hash mismatch')
            await mkdir(path.dirname(file), { recursive: true })
            await writeFile(file, backup)
        }
    }
    if (stateBefore !== undefined) {
        if (stateBefore === null) await rm(stateFile, { force: true })
        else await save(stateFile, stateBefore)
    }
    await rm(journalFile)
    return { status: 'current', recovered: journal.entries.length }
}

export async function recoverUpstream(directory = defaultRoot) {
    await assertControls(directory)
    const lock = path.join(directory, '.agents/upstream.lock')
    const owner = await json(lock, null)
    if (owner) {
        try {
            process.kill(owner.pid, 0)
            return { status: 'conflict', reason: 'sync owner process is still alive' }
        } catch (error) {
            if (error.code !== 'ESRCH')
                return { status: 'conflict', reason: 'cannot verify stale lock owner' }
        }
        await rm(lock)
    }
    await mkdir(path.dirname(lock), { recursive: true })
    try {
        await writeFile(lock, JSON.stringify({ pid: process.pid }), { flag: 'wx' })
    } catch (error) {
        if (error.code === 'EEXIST')
            return { status: 'conflict', reason: 'another recovery owns the lock' }
        throw error
    }
    try {
        return await recoverFiles(directory)
    } finally {
        await rm(lock, { force: true })
    }
}

/** 同步不运行远端脚本；checkout只快进，生成项目按三方哈希一次准备完整更新。 */
async function syncPrimary({ directory = defaultRoot, cache = defaultCache } = {}) {
    await assertControls(directory)
    const config = await json(path.join(directory, '.agents/upstream.json'), {
        version: 1,
        mode: 'checkout',
        source: { url: official, ref: 'main' },
        related: [],
    })
    if (config.version !== 1 || !['checkout', 'managed'].includes(config.mode))
        return { status: 'incompatible', reason: 'unsupported upstream policy' }
    sourceAllowed(config.source)
    await mkdir(path.join(directory, '.agents'), { recursive: true })
    const lock = path.join(directory, '.agents/upstream.lock')
    try {
        await writeFile(
            lock,
            JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }),
            { flag: 'wx' },
        )
    } catch (error) {
        if (error.code === 'EEXIST')
            return {
                status: 'conflict',
                reason: 'another sync owns the workspace lock; verify its process before removing a stale lock',
            }
        throw error
    }
    try {
        if (
            (await bytes(path.join(directory, '.agents/upstream-journal.json'))) ||
            (await bytes(path.join(directory, '.agents/upstream-checkout.json')))
        )
            return { status: 'interrupted', reason: 'run upstream recover; no new update applied' }
        if (config.mode === 'checkout') {
            if (git(directory, ['status', '--porcelain']).length)
                return {
                    status: 'conflict',
                    reason: 'checkout has local changes; no stash/reset/rebase was performed',
                }
            const remote = config.source.remote ?? 'origin'
            const remoteUrl = git(directory, ['remote', 'get-url', remote])
            if (remoteUrl !== config.source.url)
                return {
                    status: 'incompatible',
                    reason: 'tracking remote does not match configured source',
                }
            let upstream
            try {
                upstream = git(directory, ['rev-parse', '--abbrev-ref', '@{upstream}'])
            } catch {
                return {
                    status: 'incompatible',
                    reason: 'checkout has no usable tracking branch; local branch preserved',
                }
            }
            if (upstream !== remote + '/' + config.source.ref)
                return {
                    status: 'incompatible',
                    reason: 'tracking branch does not match configured source',
                }
            git(directory, ['fetch', remote, config.source.ref])
            const incoming = JSON.parse(
                git(directory, [
                    'show',
                    remote + '/' + config.source.ref + ':.agents/managed.json',
                ]),
            )
            if (
                incoming.version !== 1 ||
                incoming.abi !== 'mf.node/1' ||
                incoming.nodeMajor > Number(process.versions.node.split('.')[0])
            )
                return {
                    status: 'incompatible',
                    reason: 'incoming checkout manifest/runtime is unsupported',
                }
            for (const control of [
                'upstream.json',
                'managed.json',
                'upstream-state.json',
                'upstream-journal.json',
                'upstream-checkout.json',
                'upstream.lock',
            ]) {
                if (
                    git(directory, [
                        'ls-tree',
                        remote + '/' + config.source.ref,
                        '.agents/' + control,
                    ]).startsWith('120000')
                )
                    return { status: 'incompatible', reason: 'incoming control file is a symlink' }
            }
            const before = git(directory, ['rev-parse', 'HEAD'])
            const dependencyChanges = git(directory, [
                'diff',
                '--name-only',
                before,
                remote + '/' + config.source.ref,
            ])
                .split('\n')
                .some((file) => ['package.json', 'package-lock.json'].includes(file))
            const previous = await json(path.join(directory, '.agents/upstream-state.json'), {})
            const dependenciesPending = Boolean(previous.dependenciesPending || dependencyChanges)
            const marker = path.join(directory, '.agents/upstream-checkout.json')
            await save(marker, {
                version: 1,
                beforeCommit: before,
                targetCommit: git(directory, ['rev-parse', remote + '/' + config.source.ref]),
                dependenciesPending,
                checkedAt: new Date().toISOString(),
            })
            git(directory, ['merge', '--ff-only', remote + '/' + config.source.ref])
            const commit = git(directory, ['rev-parse', 'HEAD'])
            await save(path.join(directory, '.agents/upstream-state.json'), {
                version: 1,
                sourceCommit: commit,
                appliedCommit: commit,
                status: before === commit ? 'current' : 'updated',
                checkedAt: new Date().toISOString(),
                dependenciesPending,
            })
            await rm(marker)
            return {
                status: before === commit ? 'current' : 'updated',
                sourceCommit: commit,
                appliedCommit: commit,
                dependenciesPending,
            }
        }
        const repo = path.join(cache, 'upstream', 'template.git')
        await mkdir(path.dirname(repo), { recursive: true })
        try {
            await lstat(repo)
        } catch (error) {
            if (error.code !== 'ENOENT') throw error
            git(path.dirname(repo), ['init', '--bare', repo])
        }
        git(repo, ['fetch', '--depth=1', config.source.url, config.source.ref])
        const commit = git(repo, ['rev-parse', 'FETCH_HEAD'])
        const manifest = JSON.parse(git(repo, ['show', commit + ':.agents/managed.json']))
        if (
            manifest.version !== 1 ||
            manifest.abi !== 'mf.node/1' ||
            manifest.nodeMajor > Number(process.versions.node.split('.')[0])
        )
            return { status: 'incompatible', sourceCommit: commit }
        const previous = await json(path.join(directory, '.agents/upstream-state.json'), {
            files: {},
        })
        const upstreamFiles = new Map()
        for (const entry of manifest.files) {
            if (
                !allowed(entry.path) ||
                upstreamFiles.has(entry.path) ||
                entry.deletion !== 'if-unchanged' ||
                !/^[a-f0-9]{64}$/.test(entry.sha256)
            )
                throw new Error('unsafe/duplicate managed manifest entry')
            upstreamFiles.set(entry.path, entry)
        }
        const packageName =
            previous.packageName ?? (await json(path.join(directory, 'package.json'), {})).name
        for (const name of ['package.json', 'package-lock.json']) {
            const entry = upstreamFiles.get(name)
            if (!entry || !packageName) continue
            const raw = spawnSync('git', ['-C', repo, 'show', commit + ':' + name], {
                maxBuffer: 16 << 20,
            })
            if (raw.status !== 0 || hash(raw.stdout) !== entry.sha256)
                throw new Error('upstream package hash mismatch')
            const content = JSON.parse(raw.stdout.toString('utf8'))
            content.name = packageName
            if (name === 'package-lock.json') content.packages[''].name = packageName
            entry.sourceSha256 = entry.sha256
            entry.personalized = Buffer.from(JSON.stringify(content, null, 4) + '\n')
            entry.sha256 = hash(entry.personalized)
        }
        const conflicts = [],
            entries = []
        for (const relative of new Set([
            ...Object.keys(previous.files ?? {}),
            ...upstreamFiles.keys(),
        ])) {
            const file = await safeFile(directory, relative)
            const local = await digest(file),
                before = previous.files?.[relative] ?? null,
                target = upstreamFiles.get(relative)?.sha256 ?? null
            if (local === target) continue
            if (
                local !== before ||
                (target === null && previous.deletions?.[relative] !== 'if-unchanged')
            ) {
                conflicts.push(relative)
                continue
            }
            entries.push({ path: relative, before: local, after: target })
        }
        if (conflicts.length) return { status: 'conflict', sourceCommit: commit, conflicts }
        const transaction = path.join(
            cache,
            'upstream',
            'transactions',
            String(Date.now()) + '-' + process.pid,
        )
        await mkdir(transaction, { recursive: true })
        for (const [index, entry] of entries.entries()) {
            const file = await safeFile(directory, entry.path)
            if (entry.before !== null) {
                entry.backup = path.join(transaction, index + '.before')
                await writeFile(entry.backup, await readFile(file))
            }
            if (entry.after !== null) {
                // Buffer output preserves final newlines; git() deliberately trims only textual metadata.
                const result = spawnSync('git', ['-C', repo, 'show', commit + ':' + entry.path], {
                    maxBuffer: 16 << 20,
                })
                if (
                    result.status !== 0 ||
                    hash(result.stdout) !==
                        (upstreamFiles.get(entry.path)?.sourceSha256 ?? entry.after)
                )
                    throw new Error('upstream file hash mismatch')
                entry.staged = path.join(transaction, index + '.after')
                await writeFile(
                    entry.staged,
                    upstreamFiles.get(entry.path)?.personalized ?? result.stdout,
                )
            }
        }
        const stateBefore = await bytes(path.join(directory, '.agents/upstream-state.json'))
        const journal = {
            version: 1,
            sourceCommit: commit,
            entries,
            stateBefore: stateBefore?.toString('utf8') ?? null,
            stateAfter: null,
        }
        await save(path.join(directory, '.agents/upstream-journal.json'), journal)
        for (const entry of entries) {
            const file = await safeFile(directory, entry.path)
            if ((await digest(file)) !== entry.before)
                throw new Error('local file changed during update: ' + entry.path)
            if (entry.after === null) await rm(file, { force: true })
            else {
                await mkdir(path.dirname(file), { recursive: true })
                await writeFile(file, await readFile(entry.staged))
            }
        }
        const dependenciesPending = Boolean(
            previous.dependenciesPending ||
            entries.some(
                (entry) => entry.path === 'package.json' || entry.path === 'package-lock.json',
            ),
        )
        const state = {
            version: 1,
            packageName,
            status: entries.length ? 'updated' : 'current',
            sourceCommit: commit,
            appliedCommit: commit,
            checkedAt: new Date().toISOString(),
            dependenciesPending,
            files: Object.fromEntries(
                [...upstreamFiles].map(([name, entry]) => [name, entry.sha256]),
            ),
            deletions: Object.fromEntries(
                [...upstreamFiles].map(([name, entry]) => [name, entry.deletion]),
            ),
        }
        journal.stateAfter = state
        await save(path.join(directory, '.agents/upstream-journal.json'), journal)
        await save(path.join(directory, '.agents/upstream-state.json'), state)
        await rm(path.join(directory, '.agents/upstream-journal.json'))
        return {
            status: state.status,
            sourceCommit: commit,
            appliedCommit: commit,
            files: entries.length,
            dependenciesPending,
        }
    } catch (error) {
        const interrupted =
            (await bytes(path.join(directory, '.agents/upstream-journal.json'))) ||
            (await bytes(path.join(directory, '.agents/upstream-checkout.json')))
        return {
            status: interrupted
                ? 'interrupted'
                : /unsafe|duplicate|unsupported|invalid|mismatch|symlink/.test(error.message)
                  ? 'incompatible'
                  : 'offline',
            reason: error.message,
        }
    } finally {
        await rm(lock, { force: true })
    }
}

/** 初始化写入当前实际文件哈希；不把未提交的模板内容冒称为某个远端版本。 */
export async function initializeManaged(directory, sourceCommit = null) {
    await assertControls(directory)
    const manifest = await createManifest(directory)
    await save(path.join(directory, '.agents/upstream.json'), {
        version: 1,
        mode: 'managed',
        source: { url: official, ref: 'main' },
        related: [],
    })
    await save(path.join(directory, '.agents/upstream-state.json'), {
        version: 1,
        packageName: (await json(path.join(directory, 'package.json'), {})).name,
        status: 'initialized',
        sourceCommit,
        appliedCommit: sourceCommit,
        dependenciesPending: false,
        files: Object.fromEntries(manifest.files.map((entry) => [entry.path, entry.sha256])),
        deletions: Object.fromEntries(manifest.files.map((entry) => [entry.path, entry.deletion])),
    })
}
export async function dependenciesReady(directory = defaultRoot) {
    await assertControls(directory)
    const packageLock = await json(path.join(directory, 'package-lock.json'), null)
    const installed = await json(path.join(directory, 'node_modules/.package-lock.json'), null)
    if (!packageLock || !installed) throw new Error('pinned dependencies are not installed')
    for (const [name, entry] of Object.entries(packageLock.packages)) {
        if (!name || entry.link || entry.optional) continue
        if (installed.packages?.[name]?.version !== entry.version)
            throw new Error('installed dependency differs from pinned lock: ' + name)
    }
    const file = path.join(directory, '.agents/upstream-state.json')
    const state = await json(file, null)
    if (!state) throw new Error('no upstream state exists')
    await save(file, { ...state, dependenciesPending: false })
}

/** 相关仓库只处理显式配置的已有子目录checkout；不扫描URL、不克隆未知仓库或切分支。 */
export async function syncUpstream(options = {}) {
    const directory = options.directory ?? defaultRoot
    let result
    try {
        result = await syncPrimary(options)
    } catch (error) {
        return { status: 'incompatible', reason: error.message }
    }
    if (!['current', 'updated'].includes(result.status)) return result
    const config = await json(path.join(directory, '.agents/upstream.json'), {})
    const related = []
    for (const source of config.related ?? []) {
        const entry = { path: source.path, status: 'incompatible' }
        try {
            if (
                !['project', 'reference'].includes(source.role) ||
                typeof source.path !== 'string' ||
                path.isAbsolute(source.path) ||
                source.path.split(/[\\/]/).some((part) => !part || part === '.' || part === '..')
            )
                throw new Error('related repository requires an explicit bounded path and role')
            const repo = path.join(directory, source.path)
            let cursor = directory
            for (const part of source.path.split('/')) {
                cursor = path.join(cursor, part)
                if ((await lstat(cursor)).isSymbolicLink())
                    throw new Error('related path cannot contain symlink')
            }
            if (
                !(
                    source.url?.startsWith('https://') ||
                    /^git@[^:]+:/.test(source.url ?? '') ||
                    source.allowFileSource
                )
            )
                throw new Error('unsupported related source')
            if (source.url.startsWith('https://') && new URL(source.url).username)
                throw new Error('related URLs cannot contain credentials')
            if (
                !/^[A-Za-z0-9][A-Za-z0-9_./-]*$/.test(source.ref ?? '') ||
                source.ref.includes('..')
            )
                throw new Error('invalid related ref')
            if (git(repo, ['status', '--porcelain'])) {
                entry.status = 'conflict'
                entry.reason = 'local changes preserved'
            } else {
                const remote = source.remote ?? 'origin'
                if (
                    git(repo, ['remote', 'get-url', remote]) !== source.url ||
                    git(repo, ['rev-parse', '--abbrev-ref', '@{upstream}']) !==
                        remote + '/' + source.ref
                )
                    throw new Error('related tracking source mismatch')
                git(repo, ['fetch', remote, source.ref])
                const before = git(repo, ['rev-parse', 'HEAD'])
                git(repo, ['merge', '--ff-only', remote + '/' + source.ref])
                entry.appliedCommit = git(repo, ['rev-parse', 'HEAD'])
                entry.status = before === entry.appliedCommit ? 'current' : 'updated'
            }
        } catch (error) {
            entry.reason = error.message
        }
        related.push(entry)
    }
    return related.some((entry) => !['current', 'updated'].includes(entry.status))
        ? { status: 'conflict', primary: result, related }
        : { ...result, related }
}
