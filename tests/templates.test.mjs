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

// 脚手架本身要满足规范，不能要求作者创建节点后再修补注释和缩进。
test('初始化产物自带中文生命周期注释、默认导出注解和四空格格式', async () => {
    const { format } = await import('prettier')
    for (const kind of ['main', 'stages', 'lifecycle', 'panels']) {
        const files = nodeFiles('documented-node', kind)
        for (const [name, source] of Object.entries(files)) {
            if (source.includes('export default'))
                assert.match(source, /\/\/ noinspection JSUnusedGlobalSymbols\nexport default/)
            const formatted = await format(source, {
                parser: name.endsWith('.json') ? 'json' : 'typescript',
                tabWidth: 4,
                useTabs: false,
                singleQuote: true,
                semi: false,
                printWidth: 100,
                trailingComma: 'all',
            })
            assert.equal(source, formatted, kind + '/' + name + ' 格式不一致')
        }
        if (kind === 'lifecycle') {
            assert.match(files['executor/index.ts'], /节点首次激活时的业务启动钩子/)
            assert.match(files['executor/index.ts'], /unknown 不能自动重试/)
            assert.match(files['executor/index.ts'], /onControl、onError 只能观察/)
        }
    }
})
