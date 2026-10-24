import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { mkdir, readFile, writeFile, rm, lstat, rename } from 'node:fs/promises'
import { root as defaultRoot } from '../paths.mjs'

const official = 'https://github.com/xiaojiecode/mofang-node-workspace-template.git'
const templateRef = 'refs/mofang/template'
const controls = ['upstream.json', 'upstream-state.json', 'upstream-merge.json', 'upstream.lock']

function runGit(directory, args) {
    const result = spawnSync('git', ['-C', directory, ...args], {
        encoding: 'utf8',
        maxBuffer: 16 << 20,
        timeout: 60000,
    })
    if (result.error) throw new Error('git operation could not run (' + args[0] + ')')
    return result
}
function git(directory, args) {
    const result = runGit(directory, args)
    if (result.status !== 0) throw new Error('git operation failed (' + args[0] + ')')
    return result.stdout.trim()
}
async function json(file, fallback = null) {
    try {
        return JSON.parse(await readFile(file, 'utf8'))
    } catch (error) {
        if (error.code === 'ENOENT') return fallback
        throw error
    }
}
/** 控制文件不能通过符号链接写到工程之外。Git 管理业务文件与合并冲突。 */
async function assertControls(directory) {
    for (const relative of ['.agents', ...controls.map((name) => '.agents/' + name)]) {
        try {
            const stat = await lstat(path.join(directory, relative))
            if (
                stat.isSymbolicLink() ||
                (relative === '.agents' ? !stat.isDirectory() : !stat.isFile())
            )
                throw new Error('unsafe upstream control path: ' + relative)
        } catch (error) {
            if (error.code !== 'ENOENT') throw error
        }
    }
}
async function save(directory, name, value) {
    await assertControls(directory)
    await mkdir(path.join(directory, '.agents'), { recursive: true })
    const file = path.join(directory, '.agents', name),
        temporary = file + '.next-' + process.pid
    await writeFile(temporary, JSON.stringify(value, null, 4) + '\n', { flag: 'wx' })
    try {
        await assertControls(directory)
        await rename(temporary, file)
    } finally {
        await rm(temporary, { force: true })
    }
}
function sourceAllowed(source) {
    if (source?.url !== official && !(source?.allowFileSource && path.isAbsolute(source.url)))
        throw new Error('source is not the configured official template')
    if (!/^[A-Za-z0-9][A-Za-z0-9_./-]*$/.test(source.ref ?? '') || source.ref.includes('..'))
        throw new Error('invalid upstream ref')
}
function merging(directory) {
    return runGit(directory, ['rev-parse', '--verify', 'MERGE_HEAD']).status === 0
}
/** 未完成的 Git 操作或未合并索引必须保留现场，不能被快照提交误当成普通修改。 */
async function unfinishedGitOperation(directory) {
    if (git(directory, ['ls-files', '--unmerged'])) return 'unmerged index'
    for (const name of [
        'MERGE_HEAD',
        'CHERRY_PICK_HEAD',
        'REVERT_HEAD',
        'rebase-merge',
        'rebase-apply',
        'sequencer',
    ]) {
        const file = path.resolve(directory, git(directory, ['rev-parse', '--git-path', name]))
        try {
            await lstat(file)
            return name
        } catch (error) {
            if (error.code !== 'ENOENT') throw error
        }
    }
    return null
}
function isAncestor(directory, before, after) {
    return runGit(directory, ['merge-base', '--is-ancestor', before, after]).status === 0
}
function dependenciesChanged(directory, before, after) {
    return Boolean(
        git(directory, [
            'diff',
            '--name-only',
            before,
            after,
            '--',
            'package.json',
            'package-lock.json',
        ]),
    )
}
/** 不修改全局 Git 身份；没有配置身份时仅为自动合并/初始化提供作者。 */
export function commitGit(directory, args) {
    const identity = []
    if (runGit(directory, ['config', 'user.name']).status !== 0)
        identity.push('-c', 'user.name=Mofang Workspace')
    if (runGit(directory, ['config', 'user.email']).status !== 0)
        identity.push('-c', 'user.email=workspace@mofang.invalid')
    return runGit(directory, [...identity, ...args])
}
/** 更新前把已暂存、未暂存和未忽略的新文件保存为本地提交，不推送业务内容。 */
async function snapshotChanges(directory) {
    if (await unfinishedGitOperation(directory))
        throw new Error('Git operation is unfinished; local changes preserved')
    if (!git(directory, ['status', '--porcelain'])) return
    const staged = runGit(directory, ['diff', '--cached', '--quiet'])
    if (staged.status !== 0 && staged.status !== 1) throw new Error('could not inspect Git index')
    if (staged.status === 1) {
        const savedIndex = commitGit(directory, ['commit', '-m', 'chore: 同步上游前保存已暂存改动'])
        if (savedIndex.status !== 0)
            throw new Error('could not save staged changes; index preserved')
    }
    if (!git(directory, ['status', '--porcelain'])) return
    git(directory, ['add', '--all'])
    const remaining = runGit(directory, ['diff', '--cached', '--quiet'])
    if (remaining.status === 0) return
    if (remaining.status !== 1) throw new Error('could not inspect snapshot index')
    const saved = commitGit(directory, ['commit', '-m', 'chore: 同步上游前保存本地改动'])
    if (saved.status !== 0)
        throw new Error('could not save local changes; index and working files preserved')
}
/** 构建门禁只检查 Git 未完成合并、操作中断与依赖状态，不做文件白名单。 */
export async function ensureUpstream(directory = defaultRoot) {
    await assertControls(directory)
    const config = await json(path.join(directory, '.agents/upstream.json'))
    if (config?.version !== 2)
        throw new Error(
            'workspace requires explicit Git-history adoption; legacy workspaces are not migrated automatically',
        )
    if (merging(directory))
        throw new Error('Git merge is unfinished; resolve and commit or run git merge --abort')
    if (await json(path.join(directory, '.agents/upstream-merge.json')))
        throw new Error('upstream merge bookkeeping is incomplete; run upstream recover')
    if ((await json(path.join(directory, '.agents/upstream-state.json')))?.dependenciesPending)
        throw new Error(
            'upstream dependenciesPending; install the pinned lock, then run upstream dependencies-ready',
        )
}
async function lockWorkspace(directory, action) {
    await assertControls(directory)
    await mkdir(path.join(directory, '.agents'), { recursive: true })
    const lock = path.join(directory, '.agents/upstream.lock')
    try {
        await writeFile(lock, JSON.stringify({ pid: process.pid }), { flag: 'wx' })
    } catch (error) {
        if (error.code === 'EEXIST')
            return { status: 'conflict', reason: 'another upstream operation owns the lock' }
        throw error
    }
    try {
        return await action()
    } finally {
        await rm(lock, { force: true })
    }
}
async function completeMerge(directory, marker) {
    const head = git(directory, ['rev-parse', 'HEAD'])
    if (merging(directory))
        return {
            status: 'conflict',
            reason: 'resolve Git conflicts and commit, or run git merge --abort',
        }
    if (isAncestor(directory, marker.targetCommit, head)) {
        const previous = await json(path.join(directory, '.agents/upstream-state.json'), {})
        const dependenciesPending = Boolean(
            previous.dependenciesPending ||
            dependenciesChanged(directory, marker.beforeCommit, head),
        )
        git(directory, ['update-ref', templateRef, marker.targetCommit])
        await save(directory, 'upstream-state.json', {
            version: 2,
            status: head === marker.beforeCommit ? 'current' : 'updated',
            sourceCommit: marker.targetCommit,
            appliedCommit: marker.targetCommit,
            headCommit: head,
            checkedAt: new Date().toISOString(),
            dependenciesPending,
        })
        await rm(path.join(directory, '.agents/upstream-merge.json'))
        return {
            status: head === marker.beforeCommit ? 'current' : 'updated',
            sourceCommit: marker.targetCommit,
            appliedCommit: marker.targetCommit,
            headCommit: head,
            dependenciesPending,
        }
    }
    if (head === marker.beforeCommit && !git(directory, ['status', '--porcelain'])) {
        await rm(path.join(directory, '.agents/upstream-merge.json'))
        return { status: 'current', aborted: true }
    }
    return {
        status: 'conflict',
        reason: 'merge result does not contain the upstream commit; local files preserved',
    }
}
/** Git 自身保存冲突和撤销信息；recover 只补记已完成合并或确认撤销。 */
export async function recoverUpstream(directory = defaultRoot) {
    await assertControls(directory)
    const owner = await json(path.join(directory, '.agents/upstream.lock'))
    if (owner) {
        try {
            process.kill(owner.pid, 0)
            return { status: 'conflict', reason: 'upstream owner process is still alive' }
        } catch (error) {
            if (error.code !== 'ESRCH')
                return { status: 'conflict', reason: 'cannot verify lock owner' }
        }
        await rm(path.join(directory, '.agents/upstream.lock'))
    }
    return lockWorkspace(directory, async () => {
        const marker = await json(path.join(directory, '.agents/upstream-merge.json'))
        return marker
            ? completeMerge(directory, marker)
            : { status: merging(directory) ? 'conflict' : 'current' }
    })
}
/** 更新整个模板 Git 历史；Git 自动合并不重叠改动，冲突保留原生合并状态。 */
async function syncPrimary({ directory = defaultRoot } = {}) {
    return lockWorkspace(directory, async () => {
        const config = await json(path.join(directory, '.agents/upstream.json'))
        if (config?.version !== 2)
            return {
                status: 'incompatible',
                reason: 'legacy workspace requires explicit Git-history adoption; no automatic migration',
            }
        sourceAllowed(config.source)
        const operation = await unfinishedGitOperation(directory)
        if (operation)
            return { status: 'conflict', reason: 'Git operation is unfinished: ' + operation }
        if (await json(path.join(directory, '.agents/upstream-merge.json')))
            return {
                status: 'interrupted',
                reason: 'run upstream recover before starting another update',
            }
        try {
            git(directory, ['fetch', '--no-tags', config.source.url, config.source.ref])
        } catch {
            return {
                status: 'offline',
                reason: 'could not fetch configured upstream; check network/authentication/ref',
            }
        }
        let beforeCommit = git(directory, ['rev-parse', 'HEAD']),
            targetCommit = git(directory, ['rev-parse', 'FETCH_HEAD'])
        if (runGit(directory, ['merge-base', beforeCommit, targetCommit]).status !== 0)
            return {
                status: 'incompatible',
                reason: 'no shared Git ancestor; explicit adoption is required',
                sourceCommit: targetCommit,
            }
        if (!isAncestor(directory, targetCommit, beforeCommit)) {
            await snapshotChanges(directory)
            beforeCommit = git(directory, ['rev-parse', 'HEAD'])
        }
        const marker = { version: 2, beforeCommit, targetCommit }
        await save(directory, 'upstream-merge.json', marker)
        const merged = commitGit(directory, [
            'merge',
            '--no-edit',
            '-m',
            '合并官方节点模板更新',
            targetCommit,
        ])
        if (merged.status !== 0)
            return {
                status: merging(directory) ? 'conflict' : 'interrupted',
                sourceCommit: targetCommit,
                reason: 'Git merge did not complete; inspect git status, resolve and commit or abort, then run upstream recover',
            }
        return completeMerge(directory, marker)
    })
}
/** 新工程仅取得模板基线祖先，不复制源工程后续业务提交或配置远端。 */
export async function initializeGitHistory(directory, source = defaultRoot) {
    const ref = runGit(source, ['rev-parse', '--verify', templateRef])
    const commit = ref.status === 0 ? ref.stdout.trim() : git(source, ['rev-parse', 'HEAD'])
    git(directory, ['init', '--initial-branch=main'])
    git(directory, ['fetch', '--no-tags', source, commit])
    git(directory, ['checkout', '-b', 'main', 'FETCH_HEAD'])
    git(directory, ['update-ref', templateRef, commit])
    return commit
}
export async function initializeWorkspace(directory, sourceCommit) {
    await save(directory, 'upstream.json', {
        version: 2,
        kind: 'project',
        source: { url: official, ref: 'main' },
        related: [],
    })
    await save(directory, 'upstream-state.json', {
        version: 2,
        status: 'initialized',
        sourceCommit,
        appliedCommit: sourceCommit,
        dependenciesPending: false,
    })
    git(directory, ['add', '--all'])
    const committed = commitGit(directory, ['commit', '--allow-empty', '-m', '初始化节点工作区'])
    if (committed.status !== 0) throw new Error('could not commit initialized workspace')
}
export async function dependenciesReady(directory = defaultRoot) {
    await assertControls(directory)
    if (merging(directory) || (await json(path.join(directory, '.agents/upstream-merge.json'))))
        throw new Error('finish or recover the Git merge before verifying dependencies')
    const packageLock = await json(path.join(directory, 'package-lock.json')),
        installed = await json(path.join(directory, 'node_modules/.package-lock.json'))
    if (!packageLock || !installed) throw new Error('pinned dependencies are not installed')
    for (const [name, entry] of Object.entries(packageLock.packages)) {
        if (!name || entry.link || entry.optional) continue
        if (installed.packages?.[name]?.version !== entry.version)
            throw new Error('installed dependency differs from pinned lock: ' + name)
    }
    const state = await json(path.join(directory, '.agents/upstream-state.json'))
    if (!state) throw new Error('no upstream state exists')
    await save(directory, 'upstream-state.json', { ...state, dependenciesPending: false })
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
            const operation = await unfinishedGitOperation(repo)
            if (operation) {
                entry.status = 'conflict'
                throw new Error('related Git operation is unfinished: ' + operation)
            }
            const remote = source.remote ?? 'origin'
            if (
                git(repo, ['remote', 'get-url', remote]) !== source.url ||
                git(repo, ['rev-parse', '--abbrev-ref', '@{upstream}']) !==
                    remote + '/' + source.ref
            )
                throw new Error('related tracking source mismatch')
            git(repo, ['fetch', remote, source.ref])
            const target = git(repo, ['rev-parse', remote + '/' + source.ref])
            let before = git(repo, ['rev-parse', 'HEAD'])
            if (!isAncestor(repo, target, before)) {
                if (runGit(repo, ['merge-base', before, target]).status !== 0)
                    throw new Error('related repository has no shared ancestor')
                await snapshotChanges(repo)
                before = git(repo, ['rev-parse', 'HEAD'])
                const merged = commitGit(repo, [
                    'merge',
                    '--no-edit',
                    '-m',
                    '合并关联仓库更新',
                    target,
                ])
                if (merged.status !== 0)
                    throw new Error('related merge did not complete; local snapshot preserved')
            }
            entry.appliedCommit = git(repo, ['rev-parse', 'HEAD'])
            entry.status = before === entry.appliedCommit ? 'current' : 'updated'
        } catch (error) {
            entry.reason = error.message
        }
        related.push(entry)
    }
    return related.some((entry) => !['current', 'updated'].includes(entry.status))
        ? { status: 'conflict', primary: result, related }
        : { ...result, related }
}
