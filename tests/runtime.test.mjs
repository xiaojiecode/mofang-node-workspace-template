import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { root } from '../tooling/paths.mjs'

// 从真实构建入口分别选择两种模式，防止可读构建再次切回另一套指令协议。
test('压缩与可读构建使用同一组生产版 Lit 指令', () => {
    const results = [[], ['--development']].map((args) => {
        const result = spawnSync(
            process.execPath,
            [
                '--input-type=module',
                '-e',
                `import {bundle,litMode,buildMode} from './tooling/build/bundle.mjs';
                 const value=await bundle('./nodes/pass-through/settings/index.ts','panel');
                 console.log(JSON.stringify({litMode,buildMode,inputs:value.inputs,bytes:value.code.length}));`,
                '--',
                ...args,
            ],
            { cwd: root, encoding: 'utf8' },
        )
        assert.equal(result.status, 0, result.stderr)
        const value = JSON.parse(result.stdout)
        assert.equal(value.litMode, 'production')
        assert.ok(value.inputs.some((input) => input.endsWith('directives/live.js')))
        assert.ok(value.inputs.every((input) => !input.includes('/development/')))
        return value
    })
    assert.equal(results[0].buildMode, 'production')
    assert.equal(results[1].buildMode, 'development')
    assert.deepEqual(results[0].inputs, results[1].inputs)
    assert.ok(results[0].bytes < results[1].bytes)
})
