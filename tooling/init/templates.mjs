export function nodeFiles(code, kind) {
  const lifecycle = kind === 'lifecycle'
  const files = {
    'contract.ts': `import type { Product } from '@mofang/contracts/business'
export type Input = { item: Product; note?: string }
export type Output = { items?: Product[]; report?: { received: number } }
export type Config = { note?: string }
const ref = (kind: string) => ({ $ref: 'urn:mofang:workflow:type:' + kind + ':1' })
export const inputSchema = { type: 'object', properties: { item: ref('product'), note: { ...ref('string'), title: '备注', default: '' } }, required: ['item'], additionalProperties: false }
export const outputSchema = { type: 'object', properties: { items: { type: 'array', items: ref('product') }, report: ref('object') }, additionalProperties: false }
`,
    'node.ts': `import type { NodeDefinition } from '@mofang/contracts/author'
import { inputSchema, outputSchema } from './contract'
export default {
 code: '${code}', name: '${lifecycle ? '生命周期原样传递' : '商品原样传递'}', description: '保留完整商品，仅用于模板开发', icon: '', category: '开发示例',
 interface: '${kind}', inputSchema, outputSchema, timeoutSeconds: 60, tools: [], maxToolCalls: 8,
 entries: { settings: 'settings/index.ts', business: 'business/index.ts', pageProgram: 'page-program/index.ts'${kind === 'panels' ? '' : ", executor: 'executor/index.ts'"} }
} satisfies NodeDefinition
`,
    'settings/index.ts': `import { html } from 'lit'
import { HostPanel } from '@mofang/lit-host'
import { panelStyles, textField, sectionHeading, statusNote } from '@mofang/lit-ui'
export default class SettingsPanel extends HostPanel {
 static override styles = panelStyles
 override render() {
  const editor=this.settings
  return html\`\${sectionHeading('节点设置', '修改立即写入宿主草稿，由工作流统一保存。')}
   \${textField({name:'note',label:'备注',value:typeof editor?.values.note==='string'?editor.values.note:'',readOnly:!editor||editor.readOnly||!editor.onFieldChange,onChange:value=>editor?.onFieldChange?.('note',value),hint:'备注作为辅助配置，商品由真实到达绑定。'})}
   \${statusNote(editor?.readOnly?'只读模式':'统一草稿',editor?.readOnly?'当前上下文不能修改设置。':'本面板不会单独提交配置。')}\`
 }
}
`,
    'business/index.ts': `import { html } from 'lit'
import { HostPanel${lifecycle ? ', NodeFlowController' : ''} } from '@mofang/lit-host'
import { panelStyles, productSummary, sectionHeading, statusNote } from '@mofang/lit-ui'
import type { Product } from '@mofang/contracts/business'
export default class BusinessPanel extends HostPanel {
 static override styles = panelStyles
 ${lifecycle ? 'private readonly flow = new NodeFlowController(this,()=>({sdk:this.sdk,target:this.target}))' : ''}
 override render() {
  ${
    lifecycle
      ? `const resource=this.flow.state
  const page=resource?.data?.nodeOutput ?? this.nodeOutput
  const values=page?.items.flatMap(candidate=>Array.isArray(candidate.value.items)?candidate.value.items:[]) ?? []
  const status=resource?.data?.status ?? 'waiting'`
      : `const resource=this.contextResource.state
  const context=resource?.data ?? this.context
  const values=Array.isArray(context?.output?.values?.items)?context.output.values.items:[]
  const status=context?.state.status ?? 'waiting'`
  }
  if(resource?.error) return statusNote('读取失败',resource.error.message,'error')
  if(resource?.loading && !resource.data) return statusNote('正在读取','等待宿主提供节点数据。')
  return html\`\${sectionHeading('${lifecycle ? '候选商品' : '执行结果'}','${lifecycle ? '候选与已流转输出分别保留；本示例只展示。' : '显示宿主提供的正式输出，不改变执行状态。'}')}
   \${statusNote('当前状态',status)}
   \${values.length?values.map(value=>productSummary(value as Product)):statusNote('暂无商品','当前没有可展示的${lifecycle ? '候选' : '正式输出'}。')}\`
 }
}
`,
    'page-program/index.ts': `import type { PageProgramContext, PagePreparation } from '@mofang/contracts/page-program'
/** Required page ABI; execution input is prepared by HostInputProgram. */
export async function prepareInput(_context: PageProgramContext): Promise<PagePreparation> {
 return { kind: 'requires_input', fields: ['item'], reason: '请由宿主准备当前到达的商品。' }
}
`,
    'fixtures/input.json':
      JSON.stringify(
        {
          item: {
            basic: {
              title: '示例收纳盒',
              description: '仅用于本地预览的示例数据',
              price: 29,
              currency: 'CNY',
            },
            images: [{ url: 'https://example.invalid/sample.png' }],
            skus: [{ skuCode: 'DEMO-01', stock: 12 }],
            attributes: { material: '纸板' },
          },
          note: '本地预览',
        },
        null,
        2,
      ) + '\n',
  }
  if (kind === 'panels') return files
  files['shared/copy-product.ts'] = `import type { Product } from '@mofang/contracts/business'
import type { DeepReadonly } from '@mofang/contracts/goja'
/** Input already passed the platform Schema; clone only valid JSON data. */
export function copyProduct(value: DeepReadonly<Product>): Product { return JSON.parse(JSON.stringify(value)) as Product }
`
  const steps = `{ entry:'copy', steps:{ async copy(ctx) { const item=copyProduct(ctx.input.item); await Promise.resolve(); return ctx.complete({items:[item],report:{received:1}}) } } } satisfies StageProgram<Input, JSONObject, Output>`
  files['executor/index.ts'] =
    kind === 'main'
      ? `import type { MainProgram } from '@mofang/contracts/goja'
import type { Input, Output } from '../contract'
import { copyProduct } from '../shared/copy-product'
export default { async main(ctx) { await Promise.resolve(); return {items:[copyProduct(ctx.input.item)],report:{received:1}} } } satisfies MainProgram<Input,Output>
`
      : !lifecycle
        ? `import type { StageProgram, JSONObject } from '@mofang/contracts/goja'
import type { Input, Output } from '../contract'
import { copyProduct } from '../shared/copy-product'
export default ${steps}
`
        : `import type { LifecycleProgram, StageProgram, JSONObject } from '@mofang/contracts/goja'
import type { Input, Output, Config } from '../contract'
import { copyProduct } from '../shared/copy-product'
type State = { started: boolean; received: number; succeeded: number; failed: number; unknown: number }
type View = State
export default {
 createState() {return {started:false,received:0,succeeded:0,failed:0,unknown:0}},
 onStart(ctx) {ctx.state.started=true;ctx.view.replace({...ctx.state})},
 async onInput(ctx,event) {
  ctx.state.received++
  ctx.tasks.spawn('copy',event.values,[event.deliveryId])
  await Promise.resolve()
  ctx.view.replace({...ctx.state})
 },
 onTaskResult(ctx,event) {
  if(event.status==='succeeded') {ctx.state.succeeded++;ctx.outputs.append(event.output,event.inputRefs)}
  else if(event.status==='unknown') ctx.state.unknown++
  else ctx.state.failed++
  ctx.view.replace({...ctx.state})
  if(ctx.inputClosed && ctx.taskSummary.queued===0 && ctx.taskSummary.running===0 && ctx.taskSummary.unresolved===0) ctx.finishProduction()
 },
 onInputClosed(ctx) {
  if(ctx.taskSummary.queued===0 && ctx.taskSummary.running===0 && ctx.taskSummary.unresolved===0) ctx.finishProduction()
 },
 tasks:{copy:${steps}}
} satisfies LifecycleProgram<State,View,Input,Output,Config>
`
  return files
}
