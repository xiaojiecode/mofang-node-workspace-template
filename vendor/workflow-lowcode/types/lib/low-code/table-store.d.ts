import type { PagePackage, TableState } from './schema';
/** 首次渲染前登记所有声明的表格，工具栏无需等待表格组件挂载。 */
export declare function initialTables(definition: {
    page: PagePackage['page'];
    cells: PagePackage['cells'];
    dialogs: Record<string, {
        content: PagePackage['page'];
    }>;
}): Record<string, TableState>;
