import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { root } from './paths.mjs'
import {
    dependenciesReady,
    ensureUpstream,
    recoverUpstream,
    syncUpstream,
} from './upstream/index.mjs'

const [command, action, ...args] = process.argv.slice(2)
if (command === 'upstream') {
    if (action === 'sync') {
        const result = await syncUpstream()
        console.log(JSON.stringify(result))
        if (!['current', 'updated'].includes(result.status)) process.exitCode = 1
    } else if (action === 'recover') {
        const result = await recoverUpstream()
        console.log(JSON.stringify(result))
        if (!['current', 'updated'].includes(result.status)) process.exitCode = 1
    } else if (action === 'dependencies-ready') await dependenciesReady()
    else throw new Error('upstream requires sync|recover|dependencies-ready')
} else if (command === 'lowcode') {
    await ensureUpstream()
    try {
        const { runLowcode } = await import('./lowcode/cli.mjs')
        console.log(JSON.stringify({ ok: true, data: await runLowcode(process.argv.slice(3)) }))
    } catch (error) {
        console.log(
            JSON.stringify({
                ok: false,
                error: {
                    code: error.code ?? 'authoring_error',
                    message: error.message,
                    details: error.details ?? error.diagnostics ?? null,
                },
            }),
        )
        process.exitCode = 1
    }
} else if (command === 'panels:prepare') {
    await ensureUpstream()
    const { parseArgs } = await import('node:util')
    const { values } = parseArgs({
        args: process.argv.slice(3),
        options: Object.fromEntries(
            ['code', 'surface', 'catalog-file', 'out', 'supported-context-schemas'].map((key) => [
                key,
                { type: 'string' },
            ]),
        ),
    })
    const { prepareSave } = await import('./panels/prepare-save.mjs')
    const body = await prepareSave({
        code: values.code,
        surface: values.surface,
        catalogFile: values['catalog-file'],
        out: values.out,
        ...(values['supported-context-schemas']
            ? { supportedContextSchemas: JSON.parse(values['supported-context-schemas']) }
            : {}),
    })
    console.log(JSON.stringify({ ok: true, data: body, persisted: false }))
} else if (command === 'platform') {
    await ensureUpstream()
    const python = ['python3', 'python', 'py'].find((binary) => {
        const probe = spawnSync(binary, ['-c', 'import sys; assert sys.version_info.major == 3'], {
            stdio: 'ignore',
            timeout: 5000,
        })
        return probe.status === 0
    })
    if (!python) throw new Error('需要可用的 Python 3，请安装后重试')
    // 兼容直接调用包装器时多传的一个参数分隔符；npm 脚本仍按文档使用 `--` 转发。
    const platformArgs = process.argv.slice(3)
    if (platformArgs[0] === '--') platformArgs.shift()
    const result = spawnSync(
        python,
        [path.join(root, '.agents/skills/mofang-js-node/scripts/mofang_node.py'), ...platformArgs],
        { stdio: 'inherit' },
    )
    if (result.error) throw result.error
    process.exitCode = result.status ?? 1
} else {
    await ensureUpstream()
    const scripts = {
        build: 'build/index.mjs',
        verify: 'verify/artifacts.mjs',
        trial: 'verify/goja.mjs',
        typecheck: 'typecheck.mjs',
        'node:new': 'init/node.mjs',
        init: 'init/project.mjs',
    }
    if (!scripts[command])
        throw new Error(
            'command requires build|verify|trial|typecheck|node:new|init|upstream|platform',
        )
    const result = spawnSync(
        process.execPath,
        [path.join(root, 'tooling', scripts[command]), ...process.argv.slice(3)],
        { stdio: 'inherit' },
    )
    if (result.error) throw result.error
    process.exitCode = result.status ?? 1
}
