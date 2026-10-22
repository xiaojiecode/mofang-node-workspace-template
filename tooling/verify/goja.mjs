import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { mkdir, readFile } from 'node:fs/promises'
import { root, cache, dist, nodeCodes, readJSON, prepareCache } from '../paths.mjs'
await prepareCache()
await mkdir(path.join(cache, 'tmp'), { recursive: true })
const env = {
  ...process.env,
  GOCACHE: path.join(cache, 'go-build'),
  GOMODCACHE: path.join(cache, 'go-mod'),
  GOTMPDIR: path.join(cache, 'tmp'),
}
const binary = path.join(cache, process.platform === 'win32' ? 'goja-check.exe' : 'goja-check')
const built = spawnSync('go', ['build', '-mod=readonly', '-o', binary, '.'], {
  cwd: path.join(root, 'tooling/verify/goja-runner'),
  env,
  stdio: 'inherit',
})
if (built.error) throw new Error('Goja 验证需要 Go 1.26.5+：' + built.error.message)
if (built.status !== 0) process.exit(built.status ?? 1)
const requested = process.argv.includes('--node')
  ? process.argv[process.argv.indexOf('--node') + 1]
  : undefined
const available = await nodeCodes()
if (requested && !available.includes(requested)) throw new Error('未知节点：' + requested)
for (const code of requested ? [requested] : available) {
  const manifest = await readJSON(path.join(dist, code, 'manifest.json'))
  if (manifest.interface === 'panels') continue
  const source = await readFile(path.join(dist, code, 'program.js'), 'utf8')
  const fixture = await readFile(path.join(root, 'nodes', code, 'fixtures/input.json'), 'utf8')
  const test = await readFile(path.join(root, 'nodes', code, 'fixtures/goja-test.js'), 'utf8')
  const result = spawnSync(binary, [], {
    input: JSON.stringify({ source, test: 'const input = ' + fixture + ';\n' + test }),
    env,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(code + ': ' + result.stderr)
  console.log(code + ': Goja 引擎 fixture ' + result.stdout.trim())
}
