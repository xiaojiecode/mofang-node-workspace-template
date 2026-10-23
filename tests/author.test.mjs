import assert from 'node:assert/strict'
import test from 'node:test'
import vm from 'node:vm'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { build } from 'esbuild'
import { root } from '../tooling/paths.mjs'

const helper = await readFile(path.join(root, 'tooling/verify/coordinator-fixture.js'), 'utf8')
const header = `import {defineNode,defineStateSlot,useNodeState,useNodeReducer,useNodeAction,useNodeFacts,useOnStart,useOnInput,useOnControl,useTask,useOutputs,useProduction,nodeView} from '@mofang/node';
const slot=defineStateSlot({key:'state',schema:{type:'object'},initial:()=>({count:0,seen:0})});
const finish={name:'finish',label:'结束',description:'明确结束',presentation:'host',payloadSchema:{type:'object',properties:{},additionalProperties:false}};
const task={name:'copy',program:{entry:'copy',steps:{copy(ctx){return ctx.complete({items:[]})}}}};
const spec={abi:'mf.node/1',code:'fixture',inputSchema:{type:'object'},outputSchema:{type:'object'},state:{slot},tasks:{copy:task},actions:{}};`

/** 执行真实作者库的最终 bundle；此处 allocator 是明确 fixture，平台身份账本由 Go 侧另验。 */
async function run(body, expression) {
    const source = header + '\n' + body
    const compiled = await build({
        stdin: { contents: source, resolveDir: root, loader: 'ts' },
        absWorkingDir: root,
        tsconfig: path.join(root, 'tsconfig.base.json'),
        bundle: true,
        write: false,
        platform: 'neutral',
        format: 'iife',
        globalName: '__module',
        target: 'es2016',
        logLevel: 'silent',
    })
    const value = await vm.runInNewContext(
        compiled.outputFiles[0].text +
            '\nconst program=__module.default;\n' +
            helper +
            '\n(async()=>{' +
            expression +
            '})()',
        {},
        { timeout: 1000 },
    )
    return JSON.parse(JSON.stringify(value))
}

test('快照不变，异步 handler 按顺序运行，函数式 setter 累积 pending state', async () => {
    const result = await run(
        `export default defineNode(spec,()=>{
        const [state,set]=useNodeState(slot);
        useOnStart(async()=>{await Promise.resolve();set(p=>({...p,count:p.count+1}));});
        useOnStart(()=>{set(p=>({...p,count:p.count+1,seen:state.count}));});
        nodeView(()=>state);
    });`,
        `const h=fixtureHarness(program);const result=await h.send('start',{});return {result,view:h.project()};`,
    )
    assert.equal(result.result.kind, 'apply')
    assert.deepEqual(result.view.nodeView, { count: 2, seen: 0 })
})

test('结构化拒绝撤销整个动作日志，作者 catch 不能清除拒绝', async () => {
    const result = await run(
        `spec.actions={finish};export default defineNode(spec,()=>{
        const [state,dispatch]=useNodeReducer(slot,(pending,action)=>action==='reject'?{kind:'reject',code:'NO',message:'业务拒绝'}:{state:{...pending,count:pending.count+1},commands:[],production:'unchanged'});
        useNodeAction(finish,{guard:()=>({enabled:true}),handler(){dispatch('increment');try{dispatch('reject')}catch{} }});nodeView(()=>state);
    });`,
        `const h=fixtureHarness(program);const result=await h.send('action',{name:'finish',payload:{},candidates:[]});return {result,view:h.project()};`,
    )
    assert.equal(result.result.kind, 'reject')
    assert.equal(result.result.code, 'NO')
    assert.equal(result.view.nodeView.count, 0)
})

test('普通输入中的 reducer reject 是 fault', async () => {
    const result = await run(
        `export default defineNode(spec,()=>{const [state,dispatch]=useNodeReducer(slot,()=>({kind:'reject',code:'NO',message:'拒绝'}));useOnInput(()=>{dispatch({})});nodeView(()=>state)});`,
        `const h=fixtureHarness(program);return h.send('input',{deliveryId:'d',values:{}});`,
    )
    assert.equal(result.kind, 'fault')
})

for (const [name, event, body] of [
    ['Component', 'start', 'try{set({count:1,seen:0})}catch{}'],
    ['只读通知', 'control', 'useOnControl(()=>{try{set({count:1,seen:0})}catch{}})'],
    [
        'updater内副作用',
        'start',
        'const production=useProduction();useOnStart(()=>{try{set(p=>{production.finish();return p})}catch{}})',
    ],
])
    test(name + ' 的越权写入即使被捕获也必须 fault', async () => {
        const result = await run(
            `export default defineNode(spec,()=>{const [state,set]=useNodeState(slot);${body};nodeView(()=>state)});`,
            `const h=fixtureHarness(program);return h.send('${event}',{type:'paused'});`,
        )
        assert.equal(result.kind, 'fault')
    })

test('Project 越权返回 unavailable，Handle 不提前执行 nodeView', async () => {
    const result = await run(
        `export default defineNode(spec,()=>{const [state,set]=useNodeState(slot);useOnStart(()=>{set(p=>({...p,count:1}))});nodeView(()=>{try{set({count:2,seen:0})}catch{};return state})});`,
        `const h=fixtureHarness(program);const result=await h.send('start',{});return {result,view:h.project(),state:h.state};`,
    )
    assert.equal(result.result.kind, 'apply')
    assert.equal(result.view.kind, 'unavailable')
    assert.equal(result.state.slots.state.count, 1)
})

test('新 ABI 将 finish 统一折叠为计划末尾声明', async () => {
    const result = await run(
        `export default defineNode(spec,()=>{const production=useProduction();const task=useTask(spec.tasks.copy);useOnStart(()=>{production.finish();task.spawn({},{inputRefs:[]})});nodeView(()=>({}))});`,
        `return fixtureHarness(program).send('start',{});`,
    )
    assert.equal(result.kind, 'apply')
    assert.equal(result.plan.production, 'declare-finished')
    assert.equal(result.plan.commands[0].kind, 'task.spawn')
})

test('状态 setter 复制传入 JSON，不保留外部对象别名', async () => {
    const result = await run(
        `export default defineNode(spec,()=>{const [state,set]=useNodeState(slot);useOnStart(()=>{const value={count:1,seen:0};set(value);value.count=99});nodeView(()=>state)});`,
        `const h=fixtureHarness(program);await h.send('start',{});return h.project();`,
    )
    assert.equal(result.nodeView.count, 1)
})

test('非法 JSON 在边界锁存 fault，不能提交前半段更新', async () => {
    const result = await run(
        `export default defineNode(spec,()=>{const [state,set]=useNodeState(slot);useOnStart(()=>{set(p=>({...p,count:1}));try{set({count:NaN,seen:0})}catch{}});nodeView(()=>state)});`,
        `const h=fixtureHarness(program);const result=await h.send('start',{});return {result,state:h.state};`,
    )
    assert.equal(result.result.kind, 'fault')
    assert.equal(result.state.slots.state.count, 0)
})

test('缺少动作绑定与重复 nodeView 都在实际运行绑定时报故障', async () => {
    for (const body of [
        'spec.actions={finish};export default defineNode(spec,()=>{nodeView(()=>({}))})',
        'export default defineNode(spec,()=>{nodeView(()=>({}));nodeView(()=>({}))})',
    ]) {
        const result = await run(body, `return fixtureHarness(program).send('start',{});`)
        assert.equal(result.kind, 'fault')
    }
})

test('guard 禁用含原因，动作处理器不执行', async () => {
    const result = await run(
        `spec.actions={finish};export default defineNode(spec,()=>{const [state,set]=useNodeState(slot);useNodeAction(finish,{guard:()=>({enabled:false,reason:'先等待'}),handler(){set({count:99,seen:0})}});nodeView(()=>state)});`,
        `const h=fixtureHarness(program);const result=await h.send('action',{name:'finish',payload:{},candidates:[]});return {result,state:h.state};`,
    )
    assert.equal(result.result.kind, 'reject')
    assert.equal(result.result.message, '先等待')
    assert.equal(result.state.slots.state.count, 0)
})
