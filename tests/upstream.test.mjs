import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { mkdir, mkdtemp, writeFile, readFile, symlink, cp } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { cache, root } from '../tooling/paths.mjs'
import {
    syncUpstream,
    recoverUpstream,
    ensureUpstream,
    dependenciesReady,
    initializeGitHistory,
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

test('从业务工程再初始化仅继承模板祖先，不复制后续业务提交', async () => {
    const h = await setup()
    const template = git(h.target, 'rev-parse', 'HEAD')
    git(h.target, 'update-ref', 'refs/mofang/template', template)
    await writeFile(path.join(h.target, 'private-business.txt'), 'project-only content')
    git(h.target, 'add', '.')
    git(h.target, 'commit', '-m', 'private business work')
    const business = git(h.target, 'rev-parse', 'HEAD')
    const generated = path.join(h.area, 'generated')
    await mkdir(generated)
    assert.equal(await initializeGitHistory(generated, h.target), template)
    assert.equal(git(generated, 'rev-parse', 'HEAD'), template)
    assert.equal(git(generated, 'rev-parse', 'refs/mofang/template'), template)
    await assert.rejects(readFile(path.join(generated, 'private-business.txt')), { code: 'ENOENT' })
    assert.notEqual(spawnSync('git', ['-C', generated, 'cat-file', '-e', business]).status, 0)
})
async function setup() {
    await mkdir(cache, { recursive: true })
    const area = await mkdtemp(path.join(cache, 'git-upstream-')),
        source = path.join(area, 'source'),
        target = path.join(area, 'target')
    await mkdir(source)
    git(source, 'init', '--initial-branch=main')
    await mkdir(path.join(source, '.agents'))
    await mkdir(path.join(source, 'tooling/upstream'), { recursive: true })
    for (const file of ['tooling/cli.mjs', 'tooling/paths.mjs', 'tooling/upstream/index.mjs'])
        await cp(path.join(root, file), path.join(source, file))
    await writeFile(
        path.join(source, '.gitignore'),
        '.agents/upstream-state.json\n.agents/upstream-merge.json\n.agents/upstream.lock\n.agents/*.next-*\nnode_modules/\n',
    )
    await writeFile(
        path.join(source, '.agents/upstream.json'),
        JSON.stringify({
            version: 2,
            source: { url: source, ref: 'main', allowFileSource: true },
            related: [],
        }),
    )
    await writeFile(path.join(source, 'rules.txt'), 'first\nsecond\nthird\nfourth\nfifth\n')
    const commit = () => {
        git(source, 'add', '.')
        git(source, 'commit', '-m', 'upstream change')
        return git(source, 'rev-parse', 'HEAD')
    }
    commit()
    git(area, 'clone', source, target)
    const sync = () => syncUpstream({ directory: target })
    return { area, source, target, sync, commit }
}

test('普通Git更新可引入任意新技能和目录，不依赖受管清单', async () => {
    const h = await setup()
    for (const folder of ['.agents/skills/new-third-party', 'new-library']) {
        await mkdir(path.join(h.source, folder), { recursive: true })
        await writeFile(path.join(h.source, folder, 'content.md'), 'new content')
    }
    const upstream = h.commit()
    const result = await h.sync()
    assert.equal(result.status, 'updated', JSON.stringify(result))
    assert.equal(result.appliedCommit, upstream)
    assert.equal(git(h.target, 'rev-parse', 'HEAD'), upstream)
    assert.equal(
        await readFile(path.join(h.target, '.agents/skills/new-third-party/content.md'), 'utf8'),
        'new content',
    )
    assert.equal(
        await readFile(path.join(h.target, 'new-library/content.md'), 'utf8'),
        'new content',
    )
    assert.equal((await h.sync()).status, 'current')
})
test('Git自动合并同文件不重叠修改，并保留本地业务和自定义技能', async () => {
    const h = await setup()
    await writeFile(path.join(h.target, 'rules.txt'), 'local-first\nsecond\nthird\nfourth\nfifth\n')
    await mkdir(path.join(h.target, '.agents/skills/my-skill'), { recursive: true })
    await writeFile(path.join(h.target, '.agents/skills/my-skill/SKILL.md'), 'my skill')
    await mkdir(path.join(h.target, 'nodes'))
    await writeFile(path.join(h.target, 'nodes/business.ts'), 'my business')
    git(h.target, 'add', '.')
    git(h.target, 'commit', '-m', 'business changes')
    const local = git(h.target, 'rev-parse', 'HEAD')
    await writeFile(
        path.join(h.source, 'rules.txt'),
        'first\nsecond\nthird\nfourth\nupstream-fifth\n',
    )
    const upstream = h.commit()
    const result = await h.sync()
    assert.equal(result.status, 'updated', JSON.stringify(result))
    assert.equal(
        await readFile(path.join(h.target, 'rules.txt'), 'utf8'),
        'local-first\nsecond\nthird\nfourth\nupstream-fifth\n',
    )
    git(h.target, 'merge-base', '--is-ancestor', local, 'HEAD')
    git(h.target, 'merge-base', '--is-ancestor', upstream, 'HEAD')
    assert.equal(await readFile(path.join(h.target, 'nodes/business.ts'), 'utf8'), 'my business')
    assert.equal(
        await readFile(path.join(h.target, '.agents/skills/my-skill/SKILL.md'), 'utf8'),
        'my skill',
    )
})
async function conflict() {
    const h = await setup()
    await writeFile(path.join(h.target, 'rules.txt'), 'local replacement\n')
    git(h.target, 'add', '.')
    git(h.target, 'commit', '-m', 'local edit')
    await writeFile(path.join(h.source, 'rules.txt'), 'upstream replacement\n')
    h.commit()
    assert.equal((await h.sync()).status, 'conflict')
    assert.match(git(h.target, 'status', '--porcelain'), /UU rules.txt/)
    return h
}
test('冲突保留Git状态，人工解决提交后recover只补记，不重做合并', async () => {
    const h = await conflict()
    await assert.rejects(ensureUpstream(h.target), /unfinished/)
    assert.equal((await h.sync()).status, 'conflict')
    assert.equal((await recoverUpstream(h.target)).status, 'conflict')
    await writeFile(path.join(h.target, 'rules.txt'), 'human resolution\n')
    git(h.target, 'add', '.')
    git(h.target, 'commit', '-m', 'resolve merge')
    const head = git(h.target, 'rev-parse', 'HEAD')
    const recovered = spawnSync(
        process.execPath,
        [path.join(h.target, 'tooling/cli.mjs'), 'upstream', 'recover'],
        { encoding: 'utf8' },
    )
    assert.equal(recovered.status, 0, recovered.stdout + recovered.stderr)
    assert.equal(JSON.parse(recovered.stdout).status, 'updated')
    assert.equal(git(h.target, 'rev-parse', 'HEAD'), head)
    assert.equal(await readFile(path.join(h.target, 'rules.txt'), 'utf8'), 'human resolution\n')
    await ensureUpstream(h.target)
})
test('git merge --abort后recover保留本地提交，不回滚用户文件', async () => {
    const h = await conflict()
    git(h.target, 'merge', '--abort')
    assert.equal((await recoverUpstream(h.target)).aborted, true)
    assert.equal(await readFile(path.join(h.target, 'rules.txt'), 'utf8'), 'local replacement\n')
    await ensureUpstream(h.target)
})
test('未提交修改在无更新时保持原样，有更新时本地快照并合并', async () => {
    const h = await setup(),
        head = git(h.target, 'rev-parse', 'HEAD')
    await writeFile(path.join(h.target, 'rules.txt'), 'local-first\nsecond\nthird\nfourth\nfifth\n')
    assert.equal((await h.sync()).status, 'current')
    assert.equal(git(h.target, 'rev-parse', 'HEAD'), head)
    await writeFile(path.join(h.target, 'new-business.ts'), 'local business')
    await writeFile(path.join(h.target, 'staged.txt'), 'staged')
    git(h.target, 'add', 'staged.txt')
    await writeFile(path.join(h.target, 'staged.txt'), 'unstaged after staged')
    await writeFile(
        path.join(h.source, 'rules.txt'),
        'first\nsecond\nthird\nfourth\nupstream-fifth\n',
    )
    const upstream = h.commit()
    const result = await h.sync()
    assert.equal(result.status, 'updated', JSON.stringify(result))
    assert.equal(
        await readFile(path.join(h.target, 'rules.txt'), 'utf8'),
        'local-first\nsecond\nthird\nfourth\nupstream-fifth\n',
    )
    assert.equal(await readFile(path.join(h.target, 'new-business.ts'), 'utf8'), 'local business')
    assert.equal(await readFile(path.join(h.target, 'staged.txt'), 'utf8'), 'unstaged after staged')
    assert.match(git(h.target, 'log', '--format=%s', '-2'), /同步上游前保存本地改动/)
    git(h.target, 'merge-base', '--is-ancestor', upstream, 'HEAD')
    assert.equal(git(h.target, 'status', '--porcelain'), '')
    assert.equal(git(h.target, 'stash', 'list'), '')
    const stagedCommit = git(h.target, 'log', '--format=%H', '--grep=保存已暂存改动', '-1')
    assert.equal(git(h.target, 'show', stagedCommit + ':staged.txt'), 'staged')
})
test('未提交重叠修改冲突后撤销仍保留本地快照及新文件', async () => {
    const h = await setup()
    await writeFile(path.join(h.target, 'rules.txt'), 'local dirty content')
    await writeFile(path.join(h.target, 'new.txt'), 'local new file')
    await writeFile(path.join(h.source, 'rules.txt'), 'upstream replacement')
    h.commit()
    assert.equal((await h.sync()).status, 'conflict')
    assert.match(git(h.target, 'status', '--porcelain'), /UU rules.txt/)
    git(h.target, 'merge', '--abort')
    assert.equal((await recoverUpstream(h.target)).aborted, true)
    assert.equal(await readFile(path.join(h.target, 'rules.txt'), 'utf8'), 'local dirty content')
    assert.equal(await readFile(path.join(h.target, 'new.txt'), 'utf8'), 'local new file')
})
test('关联仓库的未提交修改也保存为本地快照再合并', async () => {
    const h = await setup(),
        related = await setup()
    const repo = path.join(h.target, 'reference')
    git(h.target, 'clone', related.source, repo)
    const configPath = path.join(h.target, '.agents/upstream.json')
    const config = JSON.parse(await readFile(configPath, 'utf8'))
    config.related = [
        {
            path: 'reference',
            role: 'reference',
            url: related.source,
            ref: 'main',
            allowFileSource: true,
        },
    ]
    await writeFile(configPath, JSON.stringify(config))
    await writeFile(
        path.join(h.target, '.gitignore'),
        (await readFile(path.join(h.target, '.gitignore'), 'utf8')) + 'reference/\n',
    )
    git(h.target, 'add', '.')
    git(h.target, 'commit', '-m', '配置关联仓库')
    await writeFile(path.join(repo, 'new.txt'), 'local reference work')
    await writeFile(path.join(related.source, 'upstream.txt'), 'upstream reference work')
    related.commit()
    const result = await h.sync()
    assert.equal(result.related[0].status, 'updated', JSON.stringify(result))
    assert.equal(await readFile(path.join(repo, 'new.txt'), 'utf8'), 'local reference work')
    assert.equal(await readFile(path.join(repo, 'upstream.txt'), 'utf8'), 'upstream reference work')
    assert.equal(git(repo, 'status', '--porcelain'), '')
})
test('依赖变更阻止构建，重复current不清状态，安装版本核对后解除', async () => {
    const h = await setup()
    await writeFile(
        path.join(h.source, 'package-lock.json'),
        JSON.stringify({ packages: { '': {}, 'node_modules/dep': { version: '1.0.0' } } }),
    )
    h.commit()
    assert.equal((await h.sync()).dependenciesPending, true)
    assert.equal((await h.sync()).dependenciesPending, true)
    await assert.rejects(ensureUpstream(h.target), /dependenciesPending/)
    await mkdir(path.join(h.target, 'node_modules'))
    const installed = path.join(h.target, 'node_modules/.package-lock.json')
    await writeFile(
        installed,
        JSON.stringify({ packages: { 'node_modules/dep': { version: '0.9.0' } } }),
    )
    await assert.rejects(dependenciesReady(h.target), /differs/)
    await writeFile(
        installed,
        JSON.stringify({ packages: { 'node_modules/dep': { version: '1.0.0' } } }),
    )
    await dependenciesReady(h.target)
    await ensureUpstream(h.target)
})
test('无共同祖先的工程停止，不自动合并不相关历史', async () => {
    const h = await setup()
    git(h.target, 'checkout', '--orphan', 'unrelated')
    git(h.target, 'add', '.')
    git(h.target, 'commit', '-m', 'unrelated root')
    const result = await h.sync()
    assert.equal(result.status, 'incompatible')
    assert.match(result.reason, /ancestor/)
})
test('旧managed工程明确停止，不自动迁移', async () => {
    const h = await setup()
    await writeFile(
        path.join(h.target, '.agents/upstream.json'),
        JSON.stringify({ version: 1, mode: 'managed' }),
    )
    assert.equal((await h.sync()).status, 'incompatible')
    await assert.rejects(ensureUpstream(h.target), /adoption/)
})
test('锁与控制文件符号链接不会被覆盖', async () => {
    const h = await setup(),
        lock = path.join(h.target, '.agents/upstream.lock')
    await writeFile(lock, JSON.stringify({ pid: process.pid }))
    assert.equal((await h.sync()).status, 'conflict')
    assert.equal((await recoverUpstream(h.target)).status, 'conflict')
    const other = path.join(h.area, 'linked')
    await mkdir(other)
    await symlink(path.join(h.target, '.agents'), path.join(other, '.agents'), 'dir')
    await assert.rejects(ensureUpstream(other), /unsafe/)
    assert.equal((await syncUpstream({ directory: other })).status, 'incompatible')
})

test('未完成 cherry-pick 的索引冲突不能被自动快照提交', async () => {
    const h = await setup()
    await writeFile(path.join(h.source, 'rules.txt'), 'upstream replacement')
    const upstream = h.commit()
    await writeFile(path.join(h.target, 'rules.txt'), 'local replacement')
    git(h.target, 'add', '.')
    git(h.target, 'commit', '-m', '保存本地修改')
    git(h.target, 'fetch', 'origin')
    const cherry = spawnSync('git', ['-C', h.target, 'cherry-pick', upstream], { encoding: 'utf8' })
    assert.notEqual(cherry.status, 0)
    const before = git(h.target, 'rev-parse', 'HEAD')
    const index = git(h.target, 'ls-files', '--unmerged')
    assert.ok(index)
    const result = await h.sync()
    assert.equal(result.status, 'conflict')
    assert.equal(git(h.target, 'rev-parse', 'HEAD'), before)
    assert.equal(git(h.target, 'ls-files', '--unmerged'), index)
    git(h.target, 'rev-parse', '--verify', 'CHERRY_PICK_HEAD')
})
for (const marker of ['rebase-merge', 'rebase-apply', 'sequencer', 'REVERT_HEAD']) {
    test('未完成 ' + marker + ' 时保留普通本地修改且不创建快照', async () => {
        const h = await setup()
        await writeFile(path.join(h.source, 'new.txt'), 'upstream')
        h.commit()
        await writeFile(path.join(h.target, 'local.txt'), 'local')
        const head = git(h.target, 'rev-parse', 'HEAD')
        const file = path.resolve(h.target, git(h.target, 'rev-parse', '--git-path', marker))
        await writeFile(file, 'pending operation')
        const result = await h.sync()
        assert.equal(result.status, 'conflict')
        assert.equal(git(h.target, 'rev-parse', 'HEAD'), head)
        assert.equal(await readFile(path.join(h.target, 'local.txt'), 'utf8'), 'local')
    })
}

test('暂存版本与工作区恢复到HEAD的版本都能保存并继续同步', async () => {
    const h = await setup()
    const original = await readFile(path.join(h.target, 'rules.txt'), 'utf8')
    await writeFile(path.join(h.target, 'rules.txt'), 'staged-only-version')
    git(h.target, 'add', 'rules.txt')
    await writeFile(path.join(h.target, 'rules.txt'), original)
    await writeFile(path.join(h.source, 'added.txt'), 'upstream')
    h.commit()
    const result = await h.sync()
    assert.equal(result.status, 'updated', JSON.stringify(result))
    assert.equal(await readFile(path.join(h.target, 'rules.txt'), 'utf8'), original)
    const stagedCommit = git(h.target, 'log', '--format=%H', '--grep=保存已暂存改动', '-1')
    assert.equal(git(h.target, 'show', stagedCommit + ':rules.txt'), 'staged-only-version')
    assert.equal(git(h.target, 'status', '--porcelain'), '')
})
