import type { PageProgramContext, PagePreparation } from '@mofang/contracts/page-program'
/** Required page ABI; execution input is prepared by HostInputProgram. */
export async function prepareInput(_context: PageProgramContext): Promise<PagePreparation> {
  return { kind: 'requires_input', fields: ['item'], reason: '请由宿主准备当前到达的商品。' }
}
