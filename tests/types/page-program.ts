import type { PageProgramContext } from '@mofang/contracts/page-program'
declare const context: PageProgramContext
void context.context.input
// @ts-expect-error Data programs have no browser network API.
fetch('https://example.invalid')
// @ts-expect-error Data programs have no DOM.
document.createElement('div')
