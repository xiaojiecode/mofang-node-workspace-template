import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { root, readJSON } from './paths.mjs'
const executable = path.join(
    root,
    'node_modules/.bin',
    process.platform === 'win32' ? 'tsc.cmd' : 'tsc',
)
// 根配置只负责 IDE 工程发现；逐个检查引用，避免空入口让类型检查静默跳过源码。
const solution = await readJSON(path.join(root, 'tsconfig.json'))
for (const { path: config } of solution.references) {
    const result = spawnSync(executable, ['--project', config, '--pretty', 'false'], {
        cwd: root,
        stdio: 'inherit',
        shell: process.platform === 'win32',
    })
    if (result.error) throw result.error
    if (result.status !== 0) process.exit(result.status ?? 1)
}
