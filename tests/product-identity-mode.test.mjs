import assert from 'node:assert/strict'
import test from 'node:test'
import path from 'node:path'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { bundle, loadDefinition } from '../tooling/build/bundle.mjs'
import { cache, root } from '../tooling/paths.mjs'

test('目录模式保留省略与显式值，运行模块及其摘要不随目录字段变化', async () => {
    await mkdir(cache, { recursive: true })
    const directory = await mkdtemp(path.join(cache, 'product-mode-'))
    try {
        const program = path.join(root, 'tooling/init/skeleton/run.ts')
        const before = await bundle(program, 'executor')
        for (const mode of [undefined, 'inherit', 'new']) {
            const definition = {
                code: 'fixture',
                ...(mode === undefined ? {} : { productIdentityMode: mode }),
            }
            await writeFile(
                path.join(directory, 'node.ts'),
                `export default ${JSON.stringify(definition)}`,
            )
            const loaded = await loadDefinition(directory)
            assert.deepEqual(loaded, definition)
            assert.equal(Object.hasOwn(loaded, 'productIdentityMode'), mode !== undefined)
            const after = await bundle(program, 'executor')
            assert.equal(after.code, before.code)
        }
        const runtimeTypes = await readFile(path.join(root, 'lib/author/types.ts'), 'utf8')
        const moduleTypes = await readFile(path.join(root, 'lib/author/module-types.ts'), 'utf8')
        assert.doesNotMatch(runtimeTypes + moduleTypes, /productIdentityMode/)
    } finally {
        await rm(directory, { recursive: true, force: true })
    }
})

test('本地目录构建拒绝显式空串、未知值和非字符串模式', async () => {
    await mkdir(cache, { recursive: true })
    const directory = await mkdtemp(path.join(cache, 'invalid-product-mode-'))
    try {
        for (const mode of ['', 'other', null, false, 1]) {
            await writeFile(
                path.join(directory, 'node.ts'),
                `export default ${JSON.stringify({ code: 'fixture', productIdentityMode: mode })}`,
            )
            await assert.rejects(loadDefinition(directory), /productIdentityMode/)
        }
    } finally {
        await rm(directory, { recursive: true, force: true })
    }
})
