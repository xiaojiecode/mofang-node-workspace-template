import type { Values } from '../schema';
import type { EventMapping } from './types';
/** 浏览器事件不可延后读取或序列化；仅在回调现场取出页面声明的路径。 */
export declare function extractEventArguments(mapping: EventMapping, args: unknown[]): Values;
