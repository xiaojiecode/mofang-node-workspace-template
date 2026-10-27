import type { ProductEditorValue } from '../product-editor/types';
/** 只检查组件安全挂载所需结构，业务必填/范围仍交给原编辑器保存校验。 */
export declare function parseEditorProduct(value: unknown): ProductEditorValue;
