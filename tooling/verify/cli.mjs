import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { root, cache } from '../paths.mjs'

const temporary = path.join(cache, 'cli-tests')
await mkdir(temporary, { recursive: true })
const result = spawnSync(
    'python3',
    ['-m', 'unittest', 'discover', '-s', '.agents/skills/mofang-js-node/tests', '-v'],
    {
        cwd: root,
        env: { ...process.env, TMPDIR: temporary, PYTHONDONTWRITEBYTECODE: '1' },
        stdio: 'inherit',
    },
)
if (result.error) throw result.error
process.exitCode = result.status ?? 1
