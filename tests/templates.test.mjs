import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { mkdtemp, mkdir, readFile, lstat, symlink, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { transform } from 'esbuild'
import { nodeFiles, presets } from '../tooling/init/templates.mjs'
import { root, cache } from '../tooling/paths.mjs'

for (const preset of presets)
    test(preset + ' 新函数节点生成包含完整契约与独立面板', async () => {
        const files = nodeFiles('new-node', preset)
        for (const [name, source] of Object.entries(files))
            if (name.endsWith('.ts')) await transform(source, { loader: 'ts', target: 'es2016' })
        for (const name of [
            'node.ts',
            'run.ts',
            'contract.ts',
            'settings.ts',
            'view.ts',
            'fixtures/input.json',
            'fixtures/goja-test.js',
        ])
            assert.ok(files[name], name)
        assert.match(files['run.ts'], /abi: 'mf.node\/1'/)
        assert.match(files['node.ts'], /code: 'new-node'/)
        assert.ok(!Object.keys(files).some((file) => file.includes('executor/')))
    })

test('冷初始化携带隐藏技能、共享CLI和受管基线，真实类型和构建可运行', async () => {
    await mkdir(cache, { recursive: true })
    const area = await mkdtemp(path.join(cache, 'cold-')),
        target = path.join(area, 'project')
    const initialized = spawnSync(
        process.execPath,
        [path.join(root, 'tooling/init/project.mjs'), '--dir', target, '--name', 'cold-fixture'],
        { cwd: root, encoding: 'utf8' },
    )
    assert.equal(initialized.status, 0, initialized.stdout + initialized.stderr)
    for (const file of [
        '.agents/skills/mofang-js-node/SKILL.md',
        '.agents/skills/mofang-js-node/scripts/mofang_cli/cli.py',
        '.agents/skills/mofang-lit-node/scripts/mofang_node.py',
        '.agents/upstream-state.json',
    ])
        assert.ok((await lstat(path.join(target, file))).isFile(), file)
    assert.equal(
        JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8')).workspaces,
        undefined,
    )
    await symlink(path.join(root, 'node_modules'), path.join(target, 'node_modules'), 'dir')
    for (const script of ['typecheck', 'build', 'verify']) {
        const result = spawnSync('npm', ['run', script], {
            cwd: target,
            encoding: 'utf8',
            env: process.env,
        })
        assert.equal(result.status, 0, script + ': ' + result.stdout + result.stderr)
    }
    const lit = spawnSync(
        'python3',
        [path.join(target, '.agents/skills/mofang-lit-node/scripts/mofang_node.py'), 'describe'],
        { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } },
    )
    assert.equal(lit.status, 0, lit.stderr)
    assert.match(lit.stdout, /nodes/)
    // Reusing a generated workspace as scaffolding must not carry its user's business helpers.
    await writeFile(path.join(target, 'shared/user-business.ts'), "export const owner = 'user'\n")
    const second = path.join(area, 'second-project')
    const regenerated = spawnSync(
        process.execPath,
        [
            path.join(target, 'tooling/init/project.mjs'),
            '--dir',
            second,
            '--name',
            'second-fixture',
        ],
        { cwd: target, encoding: 'utf8' },
    )
    assert.equal(regenerated.status, 0, regenerated.stdout + regenerated.stderr)
    await assert.rejects(lstat(path.join(second, 'shared/user-business.ts')), { code: 'ENOENT' })
    assert.equal(
        await readFile(path.join(target, 'shared/user-business.ts'), 'utf8'),
        "export const owner = 'user'\n",
    )
})
