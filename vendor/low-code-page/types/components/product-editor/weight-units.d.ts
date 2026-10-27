/**
 * 包裹重量的单位选项。
 *
 * 单独一个模块而不是放在组件文件里：组件文件导出非组件会让 Fast Refresh 失效
 * （react-refresh/only-export-components）。
 */
/**
 * 平台单位词表 → 编辑器展示词表。
 *
 * 只转换语义相同的别名，未知单位原样保留，避免把 POUND / INCH 静默标成 KG / CM。
 */
export declare function toEditorWeightUnit(unit?: string): string;
export declare function toEditorDimensionUnit(unit?: string): string;
/** 编辑器词表 → 平台单位词表，未知单位仍原样保留。 */
export declare function toPlatformWeightUnit(unit: string): string;
export declare function toPlatformDimensionUnit(unit?: string): string;
/**
 * 返回下拉框要展示的单位选项。
 *
 * 当前值不在固定选项里时（平台可能返回 POUND 这类单位）动态补上：显示成计划外的单位，
 * 总好过静默标成 KG —— 后者会把 1 POUND 说成 1 KG，错 2.2 倍。
 */
export declare function getWeightUnitOptions(current: string): string[];
