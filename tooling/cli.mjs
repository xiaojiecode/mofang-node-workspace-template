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
} else if (command === 'platform') {
    await ensureUpstream()
    const result = spawnSync(
        'python3',
        [
            path.join(root, '.agents/skills/mofang-js-node/scripts/mofang_node.py'),
            ...process.argv.slice(3),
        ],
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
