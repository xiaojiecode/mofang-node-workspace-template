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
    expectedCatalogInstanceId?: string
    expectedCatalogRevision?: string
}
/** Local build manifest; this is NOT a platform API request. */
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
