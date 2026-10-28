import os from 'node:os'
import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import {
    mkdtemp,
    mkdir,
    readFile,
    lstat,
    symlink,
    writeFile,
    access,
    readdir,
} from 'node:fs/promises'
import { constants } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { transform } from 'esbuild'
import { parse } from 'acorn'
import { skeletonFiles } from '../tooling/init/skeleton.mjs'
import { root, cache } from '../tooling/paths.mjs'

test('中性骨架包含完整契约与独立面板，不生成业务逻辑', async () => {
    const files = skeletonFiles('new-node')
    for (const [name, source] of Object.entries(files)) {
        if (name.endsWith('.ts')) await transform(source, { loader: 'ts', target: 'es2016' })
        if (name === 'fixtures/goja-test.js')
            parse(source, { ecmaVersion: 'latest', sourceType: 'script' })
    }
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
    assert.ok(
        !Object.keys(files).some((file) => file.includes('executor/') || file.startsWith('tasks/')),
    )
    assert.match(files['run.ts'], /state: \{\}/)
    assert.match(files['run.ts'], /tasks: \{\}/)
    assert.match(files['run.ts'], /actions: \{\}/)
    assert.ok(files['page.ts'])
    assert.throws(() => skeletonFiles('../invalid'))
})

test('冷初始化携带完整技能和模板Git祖先，真实类型和构建可运行', async () => {
    await mkdir(cache, { recursive: true })
    const projectBase = cache === root || cache.startsWith(root + path.sep) ? os.tmpdir() : cache
    const area = await mkdtemp(path.join(projectBase, 'cold-')),
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
        '.agents/skills/mofang-node-business-design/SKILL.md',
        '.agents/skills/mofang-node-business-design/references/review-example.md',
        '.agents/skills/mofang-node-ui-design/SKILL.md',
        '.agents/skills/mofang-node-ui-design/references/panel-review.md',
        '.agents/skills/impeccable/SKILL.md',
        '.agents/skills/impeccable/scripts/impeccable',
        '.agents/skills/impeccable/reference/critique.md',
        '.agents/skills/impeccable/LICENSE',
        '.agents/skills/impeccable/NOTICE.md',
        '.agents/skills/impeccable/UPSTREAM.json',
        '.agents/skills/frontend-design/SKILL.md',
        '.agents/skills/frontend-design/LICENSE.txt',
        '.agents/skills/frontend-design/UPSTREAM.json',
        '.agents/upstream-state.json',
        'tooling/tsconfig.browser.json',
        'lib/browser/ui/README.md',
        'lib/browser/ui/components/card.ts',
        'lib/browser/ui/components/image.ts',
        'lib/browser/ui/components/select.ts',
        'lib/browser/ui/components/tabs.ts',
        'lib/browser/ui/components/skeleton.ts',
        'lib/browser/ui/components/transition.ts',
        'tooling/verify/ui.mjs',
        'tooling/verify/transitions.mjs',
        'tests/fixtures/ui-preview.ts',
        'tests/fixtures/transition-preview.ts',
    ])
        assert.ok((await lstat(path.join(target, file))).isFile(), file)
    await access(path.join(target, '.agents/skills/impeccable/scripts/impeccable'), constants.X_OK)
    const template = spawnSync(
        'git',
        ['-C', root, 'rev-parse', '--verify', 'refs/mofang/template'],
        {
            encoding: 'utf8',
        },
    )
    const expectedAncestor =
        template.status === 0
            ? template.stdout.trim()
            : spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], {
                  encoding: 'utf8',
              }).stdout.trim()
    const ancestor = spawnSync('git', [
        '-C',
        target,
        'merge-base',
        '--is-ancestor',
        expectedAncestor,
        'HEAD',
    ])
    assert.equal(ancestor.status, 0)
    assert.equal(
        spawnSync('git', ['-C', target, 'status', '--porcelain'], { encoding: 'utf8' }).stdout,
        '',
    )
    assert.equal(
        JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8')).workspaces,
        undefined,
    )
    await symlink(path.join(root, 'node_modules'), path.join(target, 'node_modules'), 'dir')
    const generatedPackage = JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8'))
    assert.equal(generatedPackage.type, undefined)
    assert.equal(generatedPackage.scripts['test:ui'], 'node tooling/verify/ui.mjs')
    assert.equal(
        generatedPackage.scripts['test:transitions'],
        'node tooling/verify/transitions.mjs',
    )
    assert.ok(generatedPackage.scripts.check.includes('npm run test:ui'))
    // 在新工程中通过公开入口编译组件总览；防止只复制组件文件却遗漏导出或依赖。
    const componentBundle = spawnSync(
        process.execPath,
        [
            '--input-type=module',
            '-e',
            `
        import {bundle} from './tooling/build/bundle.mjs';
        import path from 'node:path';
        const result = await bundle('./tests/fixtures/ui-preview.ts', 'panel');
        if (!result.inputs.some((file) => file.endsWith('components/card.ts'))) throw new Error('card missing');
        const forbidden = ['nodes', 'shared'].map((directory) => path.resolve(directory) + path.sep);
        if (result.inputs.some((file) => forbidden.some((prefix) => path.resolve(file).startsWith(prefix)))) throw new Error('business dependency');
    `,
        ],
        { cwd: target, encoding: 'utf8', env: process.env },
    )
    assert.equal(componentBundle.status, 0, componentBundle.stdout + componentBundle.stderr)

    const solution = JSON.parse(await readFile(path.join(target, 'tsconfig.json'), 'utf8'))
    assert.deepEqual(solution.files, [])
    assert.deepEqual(solution.references, [
        { path: './tooling/tsconfig.browser.json' },
        { path: './tsconfig.goja.json' },
        { path: './tsconfig.page-program.json' },
    ])
    const baseline = JSON.parse(
        await readFile(path.join(target, '.agents/upstream-state.json'), 'utf8'),
    )
    assert.equal(baseline.version, 2)
    assert.ok(baseline.sourceCommit)
    assert.equal(
        JSON.parse(await readFile(path.join(target, '.agents/upstream.json'), 'utf8')).kind,
        'project',
    )
    assert.deepEqual(await readdir(path.join(target, 'nodes')), ['.gitkeep'])
    // 空工程必须能独立检查，不依赖仓库自带节点或既有 dist。
    for (const script of ['typecheck', 'build', 'verify']) {
        const result = spawnSync('npm', ['run', script], {
            cwd: target,
            encoding: 'utf8',
            env: process.env,
        })
        assert.equal(result.status, 0, script + ': ' + result.stdout + result.stderr)
    }
    assert.equal(
        JSON.parse(await readFile(path.join(target, 'dist/build-report.json'), 'utf8')).nodes
            .length,
        0,
    )
    for (const code of ['blank-node', 'custom-page']) {
        const created = spawnSync(
            process.execPath,
            [path.join(target, 'tooling/cli.mjs'), 'node:new', '--code', code],
            { cwd: target, encoding: 'utf8' },
        )
        assert.equal(created.status, 0, created.stdout + created.stderr)
    }
    const duplicate = spawnSync(
        process.execPath,
        [path.join(target, 'tooling/cli.mjs'), 'node:new', '--code', 'blank-node'],
        { cwd: target, encoding: 'utf8' },
    )
    assert.notEqual(duplicate.status, 0)
    assert.match(duplicate.stderr, /EEXIST/)
    const retired = spawnSync(
        process.execPath,
        [
            path.join(target, 'tooling/cli.mjs'),
            'node:new',
            '--code',
            'retired-node',
            '--preset',
            'copy',
        ],
        { cwd: target, encoding: 'utf8' },
    )
    assert.notEqual(retired.status, 0)
    await assert.rejects(lstat(path.join(target, 'nodes/retired-node')), { code: 'ENOENT' })
    // 仅覆写隔离工程的页面程序，证明构建没有忽略节点级入口。
    await writeFile(
        path.join(target, 'nodes/custom-page/page.ts'),
        `
import type { PagePreparation, PageProgramContext } from '@mofang/contracts/page-program'
export async function prepareInput(_context: PageProgramContext): Promise<PagePreparation> {
    return { kind: 'requires_input', fields: ['item'], reason: 'cold-node-page-override' }
}
`,
    )
    for (const script of ['typecheck', 'build', 'verify', 'verify:goja']) {
        const result = spawnSync('npm', ['run', script], {
            cwd: target,
            encoding: 'utf8',
            env: process.env,
        })
        assert.equal(result.status, 0, script + ': ' + result.stdout + result.stderr)
    }
    const minification = spawnSync(process.execPath, ['--test', 'tests/minification.test.mjs'], {
        cwd: target,
        encoding: 'utf8',
        env: process.env,
    })
    assert.equal(minification.status, 0, minification.stdout + minification.stderr)
    // 默认骨架不虚构输入；自定义程序保留自己的输入要求。
    const pageContext = {
        context: { input: {} },
        deliveries: [],
        read() {
            throw new Error('unexpected data read')
        },
    }
    const blankPageModule = await import(
        pathToFileURL(path.join(target, 'dist/blank-node/pageProgram.js')).href
    )
    const blankPage = blankPageModule.default ?? blankPageModule
    assert.deepEqual(await blankPage.prepareInput(pageContext), {
        kind: 'prepared',
        values: {},
        usedRefs: [],
        fieldSources: {},
    })
    const customPageModule = await import(
        pathToFileURL(path.join(target, 'dist/custom-page/pageProgram.js')).href
    )
    const customPage = customPageModule.default ?? customPageModule
    assert.deepEqual((await customPage.prepareInput(pageContext)).fields, ['item'])
    assert.equal((await customPage.prepareInput(pageContext)).reason, 'cold-node-page-override')
    // 逐个注入真实类型错误，防止根配置变为 solution 后 CLI 只检查了空入口。
    for (const file of [
        'tests/types/browser.ts',
        'tests/types/goja.ts',
        'tests/types/page-program.ts',
    ]) {
        const source = await readFile(path.join(target, file), 'utf8')
        try {
            await writeFile(
                path.join(target, file),
                source + '\nconst typecheckMustVisitThisProject: number = "invalid"\n',
            )
            const rejected = spawnSync('npm', ['run', 'typecheck'], {
                cwd: target,
                encoding: 'utf8',
                env: process.env,
            })
            assert.notEqual(rejected.status, 0, file + ': typecheck skipped a referenced project')
            assert.match(rejected.stdout + rejected.stderr, /TS2322/)
            assert.ok((rejected.stdout + rejected.stderr).includes(path.basename(file)))
        } finally {
            await writeFile(path.join(target, file), source)
        }
    }
    const lit = spawnSync(
        'python3',
        [path.join(target, '.agents/skills/mofang-lit-node/scripts/mofang_node.py'), 'describe'],
        { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } },
    )
    assert.equal(lit.status, 0, lit.stderr)
    assert.match(lit.stdout, /nodes/)
    // 从生成工程再创建工程时，不能复制已有业务节点或用户公共源码。
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
    assert.deepEqual(await readdir(path.join(second, 'nodes')), ['.gitkeep'])
    assert.equal(
        await readFile(path.join(target, 'shared/user-business.ts'), 'utf8'),
        "export const owner = 'user'\n",
    )
})
