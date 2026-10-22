import test from 'node:test'
import assert from 'node:assert/strict'
import { transform } from 'esbuild'
import { nodeFiles } from '../tooling/init/templates.mjs'

for (const kind of ['main', 'stages', 'lifecycle', 'panels']) {
  test(kind + ' 初始化源码可被当前 TypeScript 编译链读取', async () => {
    const files = nodeFiles('example', kind)
    for (const [name, source] of Object.entries(files)) {
      if (name.endsWith('.ts')) await transform(source, { loader: 'ts', target: 'es2016' })
    }
    assert.equal('executor/index.ts' in files, kind !== 'panels')
  })
}
