import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { mkdir, mkdtemp, writeFile, readFile, symlink } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { cache } from '../tooling/paths.mjs'
import {
    createManifest,
    initializeManaged,
    syncUpstream,
    recoverUpstream,
    ensureUpstream,
} from '../tooling/upstream/index.mjs'

const git = (directory, ...args) => {
    const result = spawnSync(
        'git',
        [
            '-C',
            directory,
            '-c',
            'user.name=Template Test',
            '-c',
            'user.email=test@example.invalid',
            ...args,
        ],
        { encoding: 'utf8' },
    )
    assert.equal(result.status, 0, result.stderr)
    return result.stdout.trim()
}
async function setup() {
    await mkdir(cache, { recursive: true })
    const area = await mkdtemp(path.join(cache, 'upstream-test-')),
        source = path.join(area, 'source'),
        target = path.join(area, 'target')
    await mkdir(source)
    await mkdir(target)
    git(source, 'init', '--initial-branch=main')
    await writeFile(path.join(source, 'AGENTS.md'), 'baseline\n')
    await writeFile(path.join(target, 'AGENTS.md'), 'baseline\n')
    await initializeManaged(target)
    const config = {
        version: 1,
        mode: 'managed',
        source: { url: source, ref: 'main', allowFileSource: true },
        related: [],
    }
    await writeFile(path.join(target, '.agents/upstream.json'), JSON.stringify(config))
    async function commit(text) {
        await writeFile(path.join(source, 'AGENTS.md'), text)
        await mkdir(path.join(source, '.agents'), { recursive: true })
        await writeFile(
            path.join(source, '.agents/managed.json'),
            JSON.stringify(await createManifest(source)),
        )
        git(source, 'add', '.')
        git(source, 'commit', '-m', 'fixture')
    }
    await commit('upstream-one\n')
    return {
        source,
        target,
        area,
        commit,
        sync: () => syncUpstream({ directory: target, cache: path.join(area, 'cache') }),
    }
}

test('受管三方哈希更新且保留用户节点；无变化再次同步current', async () => {
    const h = await setup()
    await mkdir(path.join(h.target, 'nodes'))
    await writeFile(path.join(h.target, 'nodes/user.ts'), 'user-owned')
    const first = await h.sync()
    assert.equal(first.status, 'updated', JSON.stringify(first))
    assert.equal(await readFile(path.join(h.target, 'AGENTS.md'), 'utf8'), 'upstream-one\n')
    assert.equal(await readFile(path.join(h.target, 'nodes/user.ts'), 'utf8'), 'user-owned')
    assert.equal((await h.sync()).status, 'current')
})
test('本地受管修改产生conflict，整份更新不覆盖用户', async () => {
    const h = await setup()
    await writeFile(path.join(h.target, 'AGENTS.md'), 'user-modified')
    const result = await h.sync()
    assert.equal(result.status, 'conflict')
    assert.deepEqual(result.conflicts, ['AGENTS.md'])
    assert.equal(await readFile(path.join(h.target, 'AGENTS.md'), 'utf8'), 'user-modified')
})
test('manifest路径越界与本地symlink均拒绝', async () => {
    const h = await setup()
    await writeFile(
        path.join(h.source, '.agents/managed.json'),
        JSON.stringify({
            version: 1,
            abi: 'mf.node/1',
            nodeMajor: 22,
            files: [{ path: '../escape', sha256: 'a'.repeat(64), deletion: 'if-unchanged' }],
        }),
    )
    git(h.source, 'add', '.')
    git(h.source, 'commit', '-m', 'unsafe')
    assert.equal((await h.sync()).status, 'incompatible')
    const second = await setup()
    await mkdir(path.join(second.target, 'lib'))
    await symlink(path.join(second.area, 'outside'), path.join(second.target, 'lib/author'))
    await mkdir(path.join(second.source, 'lib/author'), { recursive: true })
    await writeFile(path.join(second.source, 'lib/author/index.ts'), 'source')
    await second.commit('upstream-two\n')
    assert.equal((await second.sync()).status, 'incompatible')
})
test('并行锁、依赖待安装与未完成journal阻止工具运行', async () => {
    const h = await setup()
    await writeFile(
        path.join(h.target, '.agents/upstream.lock'),
        JSON.stringify({ pid: process.pid }),
    )
    assert.equal((await h.sync()).status, 'conflict')
    assert.equal((await recoverUpstream(h.target)).status, 'conflict')
    await writeFile(
        path.join(h.target, '.agents/upstream-journal.json'),
        JSON.stringify({ version: 1, entries: [] }),
    )
    await assert.rejects(ensureUpstream(h.target), /interrupted/)
})
test('中断恢复保留中断后用户改动，不能强制覆盖', async () => {
    const h = await setup()
    const before = await readFile(path.join(h.target, 'AGENTS.md'))
    const { createHash } = await import('node:crypto')
    const hash = (value) => createHash('sha256').update(value).digest('hex')
    const backup = path.join(h.area, 'backup')
    await writeFile(backup, before)
    await writeFile(path.join(h.target, 'AGENTS.md'), 'after-write')
    await writeFile(
        path.join(h.target, '.agents/upstream-journal.json'),
        JSON.stringify({
            version: 1,
            stateBefore: await readFile(path.join(h.target, '.agents/upstream-state.json'), 'utf8'),
            stateAfter: null,
            entries: [
                { path: 'AGENTS.md', before: hash(before), after: hash('after-write'), backup },
            ],
        }),
    )
    await writeFile(path.join(h.target, 'AGENTS.md'), 'new-user-work')
    assert.equal((await recoverUpstream(h.target)).status, 'conflict')
    assert.equal(await readFile(path.join(h.target, 'AGENTS.md'), 'utf8'), 'new-user-work')
    await writeFile(path.join(h.target, 'AGENTS.md'), 'after-write')
    assert.equal((await recoverUpstream(h.target)).status, 'current')
    assert.equal(await readFile(path.join(h.target, 'AGENTS.md'), 'utf8'), before.toString())
})

test('state已提交但journal未删除的崩溃窗口只完成提交，不回滚文件到旧代', async () => {
    const h = await setup()
    const stateFile = path.join(h.target, '.agents/upstream-state.json')
    const stateBefore = await readFile(stateFile, 'utf8')
    const stateAfter = {
        ...JSON.parse(stateBefore),
        appliedCommit: 'new-commit',
        files: { 'AGENTS.md': 'new-hash' },
    }
    const { createHash } = await import('node:crypto')
    const hash = (value) => createHash('sha256').update(value).digest('hex')
    const backup = path.join(h.area, 'before')
    await writeFile(backup, 'baseline\n')
    await writeFile(path.join(h.target, 'AGENTS.md'), 'committed-new')
    await writeFile(stateFile, JSON.stringify(stateAfter))
    await writeFile(
        path.join(h.target, '.agents/upstream-journal.json'),
        JSON.stringify({
            version: 1,
            stateBefore,
            stateAfter,
            entries: [
                {
                    path: 'AGENTS.md',
                    before: hash('baseline\n'),
                    after: hash('committed-new'),
                    backup,
                },
            ],
        }),
    )
    const result = await recoverUpstream(h.target)
    assert.equal(result.completedCommit, true)
    assert.equal(await readFile(path.join(h.target, 'AGENTS.md'), 'utf8'), 'committed-new')
    assert.deepEqual(JSON.parse(await readFile(stateFile, 'utf8')), stateAfter)
})

test('checkout重复current检查不能清掉依赖待安装，Git完成后可恢复pending标记', async () => {
    const h = await setup()
    await writeFile(
        path.join(h.source, '.gitignore'),
        '.agents/upstream-state.json\n.agents/upstream-checkout.json\n.agents/upstream.lock\n.agents/*.next-*\n',
    )
    await writeFile(
        path.join(h.source, '.agents/upstream.json'),
        JSON.stringify({
            version: 1,
            mode: 'checkout',
            source: { url: h.source, ref: 'main', remote: 'origin', allowFileSource: true },
            related: [],
        }),
    )
    await writeFile(
        path.join(h.source, 'package.json'),
        JSON.stringify({ name: 'fixture', version: '1.0.0' }),
    )
    git(h.source, 'add', '.')
    git(h.source, 'commit', '-m', 'checkout baseline')
    const checkout = path.join(h.area, 'checkout')
    git(h.area, 'clone', h.source, checkout)
    const before = git(checkout, 'rev-parse', 'HEAD')
    await writeFile(
        path.join(h.source, 'package.json'),
        JSON.stringify({ name: 'fixture', version: '1.0.1' }),
    )
    git(h.source, 'add', '.')
    git(h.source, 'commit', '-m', 'dependency revision')
    const options = { directory: checkout, cache: path.join(h.area, 'cache-checkout') }
    const first = await syncUpstream(options)
    assert.equal(first.status, 'updated', JSON.stringify(first))
    assert.equal(first.dependenciesPending, true)
    const second = await syncUpstream(options)
    assert.equal(second.status, 'current', JSON.stringify(second))
    assert.equal(second.dependenciesPending, true)
    await assert.rejects(ensureUpstream(checkout), /dependenciesPending/)
    const head = git(checkout, 'rev-parse', 'HEAD')
    const stateFile = path.join(checkout, '.agents/upstream-state.json')
    const state = JSON.parse(await readFile(stateFile, 'utf8'))
    await writeFile(stateFile, JSON.stringify({ ...state, dependenciesPending: false }))
    await writeFile(
        path.join(checkout, '.agents/upstream-checkout.json'),
        JSON.stringify({
            beforeCommit: before,
            targetCommit: head,
            dependenciesPending: true,
            checkedAt: 'fixture',
        }),
    )
    await assert.rejects(ensureUpstream(checkout), /interrupted/)
    assert.equal((await recoverUpstream(checkout)).status, 'current')
    assert.equal(JSON.parse(await readFile(stateFile, 'utf8')).dependenciesPending, true)
})

test('控制目录和state/journal/config符号链接均不得跟随', async () => {
    const h = await setup()
    for (const name of ['upstream-state.json', 'upstream-journal.json', 'upstream.json']) {
        const directory = path.join(h.area, name)
        await mkdir(directory)
        await mkdir(path.join(directory, '.agents'))
        await symlink(
            path.join(h.target, '.agents/upstream-state.json'),
            path.join(directory, '.agents', name),
        )
        await assert.rejects(ensureUpstream(directory), /unsafe/)
        assert.equal(
            (await syncUpstream({ directory, cache: path.join(h.area, 'cache-control') })).status,
            'incompatible',
        )
    }
    const directory = path.join(h.area, 'agents-link')
    await mkdir(directory)
    await symlink(path.join(h.target, '.agents'), path.join(directory, '.agents'), 'dir')
    await assert.rejects(ensureUpstream(directory), /unsafe/)
    assert.equal(
        (await syncUpstream({ directory, cache: path.join(h.area, 'cache-control') })).status,
        'incompatible',
    )
})
