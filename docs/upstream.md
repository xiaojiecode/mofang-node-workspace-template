# 工作区安全同步

每轮首次修改/运行前执行 `node tooling/cli.mjs upstream sync --startup`，再读取更新后的 AGENTS、AGENTS.local.md 和相关技能。配置在 .agents/upstream.json，官方唯一源为 mofang-node-workspace-template；related 只处理显式登记 role/project 或 reference、path、url、ref 的已有子目录仓库，不扫描文档链接或连接数据库。

checkout 模式仅在工作树干净、远端URL和 tracking 分支精确一致时 fetch + ff-only；不自动 stash/reset/rebase/切分支。生成项目是 managed 模式，从隔离缓存获取官方提交及 .agents/managed.json，校验格式/ABI/每文件摘要/路径，对本地L、已应用B、上游U做三方比较。本地与B/U都不同时整份更新冲突，绝不覆盖 nodes/、shared/、AGENTS.local.md、自定义技能或凭据。项目自定义包名在受管 package/lock 中保留。

受管资产按 `upstream manifest` 逐文件列举；发布前由维护者生成并一起提交。同步在写入前准备备份和文件，持有独占锁并保存 journal，逐文件写前重验哈希，最后保存完整状态标记。多文件更新不是文件系统原子；中断会留下 journal 并阻止 build/verify/trial/platform。`upstream recover` 只恢复仍等于写入前/后的文件，若中断后用户修改过则保留并报 conflict；活锁持有进程不能强删。

package/lock 变化会置 dependenciesPending；先按可信 lock 完成 npm ci，再运行 `node tooling/cli.mjs upstream dependencies-ready` 校验安装版本并清除。同步本身不运行远端脚本或自动安装依赖；半更新和依赖未就绪时不加载业务构建。不要用改用户节点掩盖ABI/依赖不兼容。

状态区分 current/updated/offline/conflict/incompatible/interrupted。离线不是最新；报告 source/applied commit 和阻断原因，不输出 token。生成项目的初始本地基线不是远端已同步证据，未提交本地模板不会冒称远端commit。AGENTS 是协作指令，不能证明每个AI实际执行过同步；CLI完整性门槛只能阻止已知半更新状态。

同步不发布业务节点、不迁库、不删除仓库、不改变全局AI配置。技能随模板完整分发，旧技能仓库由维护者完成验收后另行处理。
