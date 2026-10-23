# 魔方函数节点工作区

统一维护 Goja 后台函数节点和 Lit 设置/业务面板。后台作者 API 是具名状态、不可变快照、显式 updater/reducer 和自定义 Hook；前端保持 Lit。新产物只支持 `mf.node/1`，不读取或转换旧 createState/lifecycle 对象。

官方唯一模板与技能源：[mofang-node-workspace-template](https://github.com/xiaojiecode/mofang-node-workspace-template)。先读 [AGENTS.md](AGENTS.md) 和本项目可选 AGENTS.local.md，首次修改/运行前执行 `node tooling/cli.mjs upstream sync --startup`；它会保留本地改动并明确报告离线/冲突，不能把未同步说成最新。

## 创建与开发

```sh
npm ci
npm run init -- --dir ../my-nodes --name my-nodes
cd ../my-nodes
npm ci
npm run dev
```

默认生成 copy、selection、human-wait、multi-instance 四个真实源码起点；只保留一种可加 `--preset copy`。已有工程新增用 `npm run node:new -- --code my-node --preset copy`，目标存在时直接失败。Node 22.12+，Goja/平台验证需要 Go 1.26.5+；依赖保持 lock 中精确版本，不自动浮动升级。

```text
nodes/<code>/
  node.ts        本地目录元数据与冻结双 Schema
  run.ts         defineNode 静态 spec 与纯函数绑定
  contract.ts    本节点类型与状态/动作 Schema
  settings.ts    宿主受控设置面板
  view.ts        Lit 业务面板
  tasks/         当前 StageProgram 阶段程序
  fixtures/      明确的本地验证数据
lib/
  author/        @mofang/node，实际 mf.node/1 作者运行时
  contracts/     @mofang/contracts/*，可信 SDK/系统类型快照
  browser/       @mofang/browser，Lit 展示与宿主资源接线
shared/          用户业务公共源码
playground/      有界双面板本地预览
.agents/skills/  JS、Lit 节点与 Lit 最佳实践技能完整源码，包含唯一共享平台 CLI
```

只有一个根包，没有 npm workspaces。别名由根 tsconfig 和构建/预览统一解析。源码允许 import/export；后台打包为单文件 `const program=...`，不引入浏览器、Node、网络或计时器。Lit 产物仅导入宿主 `lit`，不内置第二份核心。

## 业务与结束路径

状态槽必须提供冻结 Schema，snapshot 深只读。setter 不改变当前闭包；连续累加用 pending updater；状态与命令耦合时 reducer 一次返回 state/commands/production。Component/guard/Project 只计算，真正工作在事件 handler 和子任务阶段。完整说明见 [作者规范](docs/authoring.md)、[运行边界](docs/abi.md)和 [反例](docs/antipatterns.md)。

输入/任务输出保留真实 deliveryId/inputRefs；Product 使用完整可信类型，不手写缩略业务 Schema。子任务继续当前 stages 与 ctx.input/state/answer，每阶段最多一次能力调用；unknown 不自动重发，人工回答沿真实等待身份。

finish 是事件计划末尾的生产声明，不直接完成节点，不放行/丢弃已有候选。无参必要动作由共同宿主入口提供；参数选择由业务 Lit 提交。动作 accepted、applied、子任务成功和节点成功分别显示。selection 示例覆盖零输入、未选择、失败收尾；它不是 FastMoss 业务节点的替代实现。

## 验证

```sh
npm run typecheck
npm run build
npm run verify
npm test
MF_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:browser
npm run verify:goja
npm run verify:platform -- --workspace /path/to/mofangv6
```

`npm run check` 执行格式/类型/构建/产物/回归/浏览器/Goja。平台验证使用真实 Go 模块和页面编译器，不启动服务或写库；它不替代 Workflow 事务、权限、Tool 账本或完整业务。更完整的分层要求见 [验证表](docs/verification.md)。

缓存显式设置 `MF_CACHE_DIR`；npm 缓存用 `NPM_CONFIG_CACHE`，Go/Vite/浏览器材料由工具归该目录。正式 build 安全压缩并输出大小/耗时，属性名不混淆；build:dev 只改变可读性。fixture 页面明确是本地数据，不作为真实业务成功证据。

## 平台、技能与更新

平台 CLI：`npm run platform -- describe`。JS/Lit 技能分别见 [.agents/skills/mofang-js-node](.agents/skills/mofang-js-node/SKILL.md)、[.agents/skills/mofang-lit-node](.agents/skills/mofang-lit-node/SKILL.md)及 [Lit 最佳实践](.agents/skills/lit-best-practices/SKILL.md)。CLI 登录资料保存在用户指定的受限配置，密码/token 不进入源码、日志或报告。目录保存、实例采用、双面板发布和新运行分别核对目标与修订。

[安全同步](docs/upstream.md)使用唯一官方源和明确受管清单。生成项目保留 nodes/、shared/、AGENTS.local.md 和自定义技能；冲突不自动 stash/reset/rebase。半更新 journal 或 dependenciesPending 会阻止构建，恢复不覆盖中断后用户新改动。技能源码已合入本模板；退役独立技能仓库由维护者在完整验收后另行执行，不是初始化或同步命令的副作用。
