import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { root } from './paths.mjs'
const executable = path.join(
  root,
  'node_modules/.bin',
  process.platform === 'win32' ? 'tsc.cmd' : 'tsc',
)
for (const config of ['tsconfig.json', 'tsconfig.goja.json', 'tsconfig.page-program.json']) {
  const result = spawnSync(executable, ['--project', config, '--pretty', 'false'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
