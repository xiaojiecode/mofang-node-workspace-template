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
  interface: 'main' | 'stages' | 'lifecycle' | 'panels'
  entries: { settings: string; business: string; pageProgram: string; executor?: string }
}
export type JavaScriptValidation = {
  programInterface: 'stages' | 'lifecycle'
  valid: true
  entry: string
  steps: string[]
  scope: 'syntax_and_contract'
  toolAvailability: 'checked_on_submission'
}
