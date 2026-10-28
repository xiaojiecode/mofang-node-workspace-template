import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises'
import { cache, nodeCodes, prepareCache } from '../tooling/paths.mjs'

test('节点发现保留已定义节点并忽略仅占位的商品库目录', async () => {
    await prepareCache()
    const directory = await mkdtemp(path.join(cache, 'node-discovery-'))
    try {
        for (const code of ['product-library-shop', 'z-defined', 'a-defined', 'invalid-entry'])
            await mkdir(path.join(directory, 'nodes', code), { recursive: true })
        await writeFile(path.join(directory, 'nodes/product-library-shop/.gitkeep'), '')
        await writeFile(path.join(directory, 'nodes/z-defined/node.ts'), 'export default {}')
        await writeFile(path.join(directory, 'nodes/a-defined/node.ts'), 'export default {}')
        await writeFile(path.join(directory, 'nodes/notes.txt'), '不是节点')
        assert.deepEqual(await nodeCodes({ rootDir: directory }), ['a-defined', 'z-defined'])
        await mkdir(path.join(directory, 'nodes/invalid-entry/node.ts'))
        await assert.rejects(nodeCodes({ rootDir: directory }), /节点定义必须是文件/)
    } finally {
        await rm(directory, { recursive: true, force: true })
    }
})
