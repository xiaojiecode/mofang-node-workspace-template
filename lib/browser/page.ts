import type { PagePreparation, PageProgramContext } from '@mofang/contracts/page-program'
/** 页面准备仅声明宿主真实输入需求，不是业务启动。 */
export async function prepareInput(_context: PageProgramContext): Promise<PagePreparation> {
    return { kind: 'requires_input', fields: ['item'], reason: '请由宿主准备真实到达的商品。' }
}
