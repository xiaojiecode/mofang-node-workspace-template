import path from 'node:path'
import { parseArgs } from 'node:util'
import { mkdir, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { root, cache } from '../paths.mjs'
const { values } = parseArgs({ options: { workspace: { type: 'string' } } })
const workspace = values.workspace ?? process.env.MOFANG_WORKSPACE
if (!workspace)
  throw new Error(
    '真实平台验证：--workspace <mofangv6>；本命令通过 Go overlay 使用现有源码，不启动服务或写数据库。',
  )
const server = path.resolve(workspace, 'mofang-server')
await mkdir(path.join(cache, 'tmp'), { recursive: true })
const overlay = path.join(cache, 'platform-overlay.json')
await writeFile(
  overlay,
  JSON.stringify({
    Replace: {
      [path.join(server, 'services/workflow/internal/pagecompiler/engineering_template_test.go')]:
        path.join(root, 'tooling/verify/platform_test.go.txt'),
    },
  }),
)
const result = spawnSync(
  'go',
  [
    'test',
    '-overlay',
    overlay,
    './services/workflow/internal/pagecompiler',
    '-run',
    '^TestEngineeringTemplate$',
    '-count=1',
    '-v',
  ],
  {
    cwd: server,
    stdio: 'inherit',
    env: {
      ...process.env,
      MF_TEMPLATE_REPO: root,
      GOCACHE: path.join(cache, 'go-build'),
      GOMODCACHE: path.join(cache, 'go-mod'),
      GOTMPDIR: path.join(cache, 'tmp'),
    },
  },
)
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
