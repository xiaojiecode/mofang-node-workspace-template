/**
 * 对话历史分组工具：按工作目录文件夹分组。
 * 无 cwd / default / mofang-home/{userId}（运行时 home）归入「对话」；
 * 其余归一化（统一 / 分隔、盘符转小写）。
 */
import type { MofangThread } from '../../../api/mofang/types';
export interface HistoryGroup {
    key: string;
    label: string;
    cwd: string | string[];
    threads: MofangThread[];
    count?: number;
}
/** 归一化工作目录路径：统一 /、去尾部 /、盘符转小写。 */
export declare function normalizeHistoryCwd(cwd: string): string;
/**
 * 只有当前机器的 {home}/workspaces/default 才是默认对话目录。
 * 同步过来的 workspaces/remote 下即使末尾叫 default，也必须保留为独立目录。
 */
export declare function isMofangRuntimeHomeCwd(cwd: string): boolean;
/** 无 cwd、default 工作区、运行时 home 都算默认对话目录。 */
export declare function isDefaultHistoryCwd(cwd: string): boolean;
/** 其它机器同步过来的 cwd：workspaces/remote 或 home 下的 remote/unix。 */
export declare function isSyncedRemoteHistoryCwd(cwd: string): boolean;
/** 运行时 home 上的会话文件实际落在 workspaces/default。 */
export declare function resolveWorkdirRoot(cwd: string): string;
/** 判断工作目录是否属于系统隐藏目录。 */
export declare function isHiddenSystemCwd(cwd: string): boolean;
/** 工作目录选择器使用目录摘要，不能只依赖当前已经展开的会话页。 */
export declare function selectableWorkspaceCwds(summaries: Array<{
    cwd: string;
}>, loadedThreads?: Array<{
    cwd: string;
}>): string[];
/** 计算分组 key 与显示名。 */
export declare function resolveHistoryGroup(cwd: string): {
    key: string;
    label: string;
};
/** 置顶优先（同为置顶按 pinnedAt 降序），其余按更新时间降序。 */
export declare function sortThreads(threads: MofangThread[], pinnedIds: ReadonlySet<string>): MofangThread[];
/** 把线程列表分组；groups 顺序按「对话」在前，其余按 label 字母序。 */
export declare function groupThreads(threads: MofangThread[], pinnedIds: ReadonlySet<string>): HistoryGroup[];
/** 侧栏填过的标题（含 skill 名）不要被服务端 preview「22 11」盖掉。 */
export declare function rememberThreadDisplayTitle(threadId: string | undefined, title: string, options?: {
    prefer?: boolean;
}): void;
export declare function resetThreadDisplayTitlesForTests(): void;
export declare function peekThreadDisplayTitle(threadId: string | undefined): string;
/** 显示标题：name 优先，否则 preview。 */
export declare function threadTitle(thread: MofangThread): string;
/** 新建会话服务端常没有 name/preview，用首条用户消息顶上。 */
export declare function fillThreadTitle(thread: MofangThread, fallback: string): MofangThread;
/** 后到的空标题不要盖掉已经填好的预览。 */
export declare function mergeThreadTitle(current: MofangThread | undefined, incoming: MofangThread): MofangThread;
