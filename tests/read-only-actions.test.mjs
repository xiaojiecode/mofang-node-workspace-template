import assert from 'node:assert/strict'
import test from 'node:test'
import vm from 'node:vm'
import { build } from 'esbuild'
import path from 'node:path'
import { root } from '../tooling/paths.mjs'

async function evaluate(spec, expression = 'program.manifest') {
    const source = `import {defineNode,nodeView} from '@mofang/node';
const task={name:'query',program:{entry:'query',steps:{query(ctx){return ctx.complete({items:[]})}}}};
const spec={abi:'mf.node/1',code:'fixture',state:{},tasks:{query:task},actions:{},inputSchema:{type:'object'},outputSchema:{type:'object'},...${JSON.stringify(spec)}};
const program=defineNode(spec,()=>{nodeView(()=>({}))});
export default ${expression};`
    const compiled = await build({
        stdin: { contents: source, resolveDir: root, loader: 'ts' },
        absWorkingDir: root,
        tsconfig: path.join(root, 'tsconfig.base.json'),
        bundle: true,
        write: false,
        platform: 'neutral',
        format: 'iife',
        globalName: 'compiled',
        target: 'es2016',
        logLevel: 'silent',
    })
    return JSON.parse(
        JSON.stringify(
            vm.runInNewContext(
                compiled.outputFiles[0].text + '\ncompiled.default',
                {},
                { timeout: 1000 },
            ),
        ),
    )
}
const action = {
    name: 'lookup',
    label: '查询',
    description: '当前资料查询',
    handler: 'query',
    payloadSchema: { type: 'object' },
    outputSchema: { type: 'object' },
    tools: ['collection.query'],
}

test('缺席只读声明保持旧manifest无新字段，显式声明引用已有task并保留合同', async () => {
    assert.equal(Object.hasOwn(await evaluate({}), 'readOnlyActions'), false)
    const manifest = await evaluate({ readOnlyActions: [action] })
    assert.deepEqual(manifest.readOnlyActions, [action])
    assert.equal(manifest.tasks[0].name, action.handler)
    assert.equal(Object.hasOwn(manifest.readOnlyActions[0], 'payloadSchemaDigest'), false)
})

test('只读声明不调用Component、处理器或普通业务action来提取manifest', async () => {
    const result = await evaluate(
        { readOnlyActions: [action] },
        '({manifest:program.manifest,taskNames:Object.keys(program.tasks)})',
    )
    assert.deepEqual(result.taskNames, ['query'])
    assert.deepEqual(result.manifest.actions, [])
    assert.deepEqual(result.manifest.readOnlyActions, [action])
})

test('静态声明拒绝未知task、重复动作名、非法Schema和工具名称', async () => {
    for (const readOnlyActions of [
        [{ ...action, handler: 'missing' }],
        [action, action],
        [{ ...action, payloadSchema: null }],
        [{ ...action, outputSchema: [] }],
        [{ ...action, tools: [''] }],
        [{ ...action, tools: ['tool', 'tool'] }],
        [{ ...action, description: '' }],
        [{ ...action, payloadSchemaDigest: 'author-supplied' }],
    ])
        await assert.rejects(evaluate({ readOnlyActions }))
})
