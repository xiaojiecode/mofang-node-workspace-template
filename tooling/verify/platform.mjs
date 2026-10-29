import path from 'node:path'
import { parseArgs } from 'node:util'
import { mkdir, writeFile, realpath } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { root, cache } from '../paths.mjs'
const { values } = parseArgs({ options: { workspace: { type: 'string' } } })
const workspace = values.workspace ?? process.env.MOFANG_WORKSPACE
if (!workspace)
    throw new Error(
        '真实平台验证：--workspace <mofangv6>；本命令通过 Go overlay 使用现有源码，不启动服务或写数据库。',
    )
// Go 按真实工作目录匹配 overlay，符号链接入口也必须采用同一路径。
const server = await realpath(path.resolve(workspace, 'mofang-server'))
await mkdir(path.join(cache, 'tmp'), { recursive: true })
const overlay = path.join(cache, 'platform-overlay.json')
await writeFile(
    overlay,
    JSON.stringify({
        Replace: {
            [path.join(
                server,
                'services/workflow/internal/pageartifact/engineering_template_test.go',
            )]: path.join(root, 'tooling/verify/platform_test.go.txt'),
        },
    }),
)
const result = spawnSync(
    'go',
    [
        'test',
        '-overlay',
        overlay,
        './services/workflow/internal/pageartifact',
        '-run',
        '^TestEngineeringTemplate$',
        '-count=1',
        '-v',
    ],
    {
        cwd: server,
        encoding: 'utf8',
        maxBuffer: 8 * 1024 * 1024,
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
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
if (result.status !== 0) process.exit(result.status ?? 1)
if (!/^=== RUN\s+TestEngineeringTemplate$/m.test(result.stdout ?? ''))
    throw new Error('真实平台验证未执行 TestEngineeringTemplate，不能将空测试结果视为通过。')
