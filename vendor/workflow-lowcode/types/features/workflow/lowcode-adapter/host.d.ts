import type { HostAdapter } from '../../../lib/low-code/schema';
import type { PuckPanelHostProps } from './types';
/** 完整公开 SDK 服务与可视化单次调用共用同一个受宿主约束的门面。 */
export declare function createPuckPanelHost(props: PuckPanelHostProps): HostAdapter;
