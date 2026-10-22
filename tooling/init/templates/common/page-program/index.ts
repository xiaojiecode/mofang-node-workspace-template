import type { PageProgramContext, PagePreparation } from '@mofang/contracts/page-program'
/**
 * 业务页面包要求提供的 prepareInput ABI，并非后台程序启动入口。
 * Agent / Code 的实际输入由 HostInputProgram 准备；本例只返回需要当前商品的提示，
 * 不构造来源凭据、不替换冻结输入，也不执行采集或其他外部业务。
 */
export async function prepareInput(_context: PageProgramContext): Promise<PagePreparation> {
    return { kind: 'requires_input', fields: ['item'], reason: '请由宿主准备当前到达的商品。' }
}
