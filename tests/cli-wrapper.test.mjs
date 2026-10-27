import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const cli = fileURLToPath(new URL('../tooling/cli.mjs', import.meta.url))

test('platform 包装器兼容一个多余的参数分隔符', () => {
    const result = spawnSync(process.execPath, [cli, 'platform', '--', '--help'], {
        encoding: 'utf8',
    })
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /usage:/i)
})

test('node:new 在写入前拒绝非法节点编码', () => {
    const result = spawnSync(process.execPath, [cli, 'node:new', '--code', 'Bad_Code'], {
        encoding: 'utf8',
    })
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /node:new requires/i)
})
