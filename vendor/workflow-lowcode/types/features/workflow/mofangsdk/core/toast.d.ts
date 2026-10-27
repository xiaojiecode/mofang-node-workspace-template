export type NodeToastLevel = 'success' | 'info' | 'warning' | 'error';
export type NodeToastMessage = Readonly<{
    level: NodeToastLevel;
    message: string;
}>;
export type MofangToast = Readonly<Record<NodeToastLevel, (message: string) => Promise<void>>>;
/** 提示只接受有界纯文本，不接受页面函数、HTML 或组件。 */
export declare function validateToast(level: unknown, message: unknown): NodeToastMessage;
/** 提示通过宿主受控通道显示，不发业务请求，也不自动重试。 */
export declare function createToastAPI(send: (message: NodeToastMessage) => Promise<unknown>): MofangToast;
