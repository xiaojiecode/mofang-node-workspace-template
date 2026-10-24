# 工作区 Git 同步

日常开发不要求检查或同步上游更新。需要更新模板时，手动执行 `node tooling/cli.mjs upstream sync`；成功后再读取更新后的 AGENTS、AGENTS.local.md 和相关技能。配置在 .agents/upstream.json，version=2，官方唯一源为 mofang-node-workspace-template。

CLI 保留未完成合并、恢复记录和依赖状态的本地安全检查，不会因此联网检查更新，也不要求每轮先同步。

新工程从模板提交取得 Git 祖先，再提交包名、所选节点和初始化配置。refs/mofang/template 记录最近采用的模板提交；从已有生成工程再初始化时只取该模板祖先，不带入后续业务提交。初始化不会配置业务 origin，业务仓库远端由项目维护者设置。

配置的 kind=template/project 仅区分官方模板案例校验与生成工程的通用 ABI 校验，两者均使用相同 Git 合并更新方式。

更新不要求工作树干净。先 fetch 并核对共同祖先，确认有上游更新后，先把已有暂存版本单独保存为中文本地提交，再将工作区修改和未忽略的新文件保存为本地快照提交（没有差异不创建空提交），再用普通 merge 把整个上游提交合入当前分支。没有上游更新或 fetch 失败时不创建快照；忽略文件和业务提交均不会被自动推送。没有受管清单或逐技能白名单；新增技能、工具及其它文件都按 Git 处理。本地不重叠修改自动合并，nodes/、shared/ 和自定义技能也参与正常合并。包名修改保存在工程自身提交中，后续若上游也修改同处内容则按真实冲突处理，不静默重写包名。

已有未完成的 merge、cherry-pick、rebase、revert 或未合并索引时先保留现场，不把冲突标记自动提交为快照。

出现冲突后查看 `git status`，编辑冲突文件，执行 `git add` 和 `git commit`；放弃这次合并则执行 `git merge --abort`。之后运行 `node tooling/cli.mjs upstream recover` 补记合并结果或确认撤销。recover 不重写文件、不重新合并；Git 未结清的冲突会阻止构建。同步不会自动 stash/reset/rebase、切分支或安装依赖；失败时保留本地快照、暂存区或合并现场，不丢弃本地内容。AGENTS.local.md 仍为项目本地忽略文件。

Git 保存实际合并状态；.agents/upstream-merge.json 只记录合并前和目标提交，防止进程中断后遗漏状态/依赖检查。已完成合并但状态尚未写入时，recover 核对目标是否为当前 HEAD 的祖先后补记。已撤销且回到合并前干净状态时仅清除记录；其它情况保留现场并要求人工处理。同步使用工作区独占锁，recover 不能清除活进程的锁。

package/lock 变化会置 dependenciesPending。按可信 lock 完成 `npm ci`，再运行 `node tooling/cli.mjs upstream dependencies-ready` 校验安装版本并解除门禁。重复同步为 current 不能清除尚未安装的依赖标记。未完成合并或恢复记录也会阻止 dependencies-ready。

旧 managed 工程没有模板 Git 祖先，不在本次自动迁移范围。version=1 或无共同祖先时明确停止，保留原工程；后续在单独确认后逐个接入，不用 allow-unrelated-histories 或替换业务 Git 历史掩盖缺失祖先。

related 仍只处理显式登记 role=project/reference、path、url、ref 的已有子目录仓库，核对来源、tracking 和共同祖先后按相同的本地快照加普通合并策略更新；它不是节点模板主仓合并策略，不自动克隆未知仓库、扫描文档链接或连接数据库。

状态区分 current/updated/offline/conflict/incompatible/interrupted。报告 source/applied commit 和阻断原因，不输出凭据。离线不是最新；同步成功不代表 ABI、运行依赖或业务链路已验收。需要在更新后检查实际差异及相关验证。

同步不发布节点、不迁库、不删除已有工程、不改全局 AI 配置。第三方技能的来源和许可随各技能分发，Impeccable 引擎与项目 hook 的安装不是 Git 同步副作用。
