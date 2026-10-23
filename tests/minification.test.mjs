import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import test from 'node:test'
import { bundle } from '../tooling/build/bundle.mjs'
import { root, nodeCodes } from '../tooling/paths.mjs'

/** 在相同宿主 fixture 下执行压缩前后程序，同时核对公开钩子/阶段名称。 */
async function execute(source, input, fixture) {
    const context = vm.createContext({})
    let helper = ''
    try {
        helper = await readFile(path.join(root, 'tooling/verify/coordinator-fixture.js'), 'utf8')
    } catch (error) {
        if (error.code !== 'ENOENT') throw error
    }
    const value = await vm.runInContext(
        source +
            '\n(async () => {\n' +
            helper +
            '\nconst input = ' +
            input +
            ';\n' +
            fixture +
            '\n})()',
        context,
        { timeout: 1000 },
    )
    const names = vm.runInContext(
        `JSON.stringify({keys:Object.keys(program),hooks:Object.entries(program).filter(([,value])=>typeof value==='function').map(([key,value])=>[key,value.name]),tasks:Object.keys(program.tasks??{}),steps:Object.keys(program.steps??{})})`,
        context,
    )
    return { value: JSON.parse(JSON.stringify(value)), names }
}

test('正式压缩保持执行 fixture、钩子和阶段名称，并缩小源码', async () => {
    for (const code of await nodeCodes()) {
        const directory = path.join(root, 'nodes', code)
        let fixture
        try {
            fixture = await readFile(path.join(directory, 'fixtures/goja-test.js'), 'utf8')
        } catch (error) {
            if (error.code === 'ENOENT') continue
            throw error
        }
        const input = await readFile(path.join(directory, 'fixtures/input.json'), 'utf8')
        const readable = await bundle(path.join(directory, 'run.ts'), 'executor', {
            minify: false,
        })
        const compact = await bundle(path.join(directory, 'run.ts'), 'executor', {
            minify: true,
        })
        assert.ok(
            Buffer.byteLength(compact.code) < Buffer.byteLength(readable.code),
            code + ' 未缩小',
        )
        assert.deepEqual(
            await execute(compact.code, input, fixture),
            await execute(readable.code, input, fixture),
            code + ' 压缩前后行为不同',
        )
    }
})
