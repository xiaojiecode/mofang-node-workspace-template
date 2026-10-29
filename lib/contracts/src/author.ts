export type Schema = Readonly<Record<string, unknown>>
export interface JavaScriptNodeBody {
    code: string
    name: string
    description: string
    icon: string
    category: string
    inputSchema: Schema
    outputSchema: Schema
    timeoutSeconds: number
    source: string
    tools: readonly string[]
    maxToolCalls: number
    /** 商品身份模式只属于目录；缺省按inherit处理，不写入运行模块manifest。 */
    productIdentityMode?: 'inherit' | 'new'
    expectedCatalogInstanceId?: string
    expectedCatalogRevision?: string
}
/** 本地构建元数据，不是平台API请求或mf.node/1运行模块manifest。 */
export type NodeDefinition = Omit<
    JavaScriptNodeBody,
    'source' | 'expectedCatalogInstanceId' | 'expectedCatalogRevision'
> & {
    interface: 'node' | 'panels'
}
export type JavaScriptValidation = {
    programInterface: 'mf.node/1'
    valid: true
    entry: 'initialize'
    steps: string[]
    scope: 'syntax_and_contract'
    toolAvailability: 'checked_on_submission'
}
