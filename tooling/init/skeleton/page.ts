import type { PagePreparation, PageProgramContext } from '@mofang/contracts/page-program'

/** 空白页面程序不虚构业务输入；作者按 inputSchema 补充真实准备逻辑。 */
export async function prepareInput(_context: PageProgramContext): Promise<PagePreparation> {
    return { kind: 'prepared', values: {}, usedRefs: [], fieldSources: {} }
}
