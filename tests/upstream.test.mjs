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
test('未提交修改停止更新，不stash、覆盖或切分支', async () => {
    const h = await setup(),
        head = git(h.target, 'rev-parse', 'HEAD')
    await writeFile(path.join(h.target, 'rules.txt'), 'uncommitted')
    assert.equal((await h.sync()).status, 'conflict')
    assert.equal(git(h.target, 'rev-parse', 'HEAD'), head)
    assert.equal(await readFile(path.join(h.target, 'rules.txt'), 'utf8'), 'uncommitted')
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
