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
  page.ts        可选节点级页面准备程序，缺省要求真实item输入
  tasks/         当前 StageProgram 阶段程序
  fixtures/      明确的本地验证数据
lib/
  author/        @mofang/node，实际 mf.node/1 作者运行时
  contracts/     @mofang/contracts/*，可信 SDK/系统类型快照
  browser/       @mofang/browser，Lit 展示与宿主资源接线
shared/          用户业务公共源码
playground/      有界双面板本地预览
.agents/skills/  节点设计、JS/Lit、Lit 最佳实践及第三方设计技能，包含唯一共享平台 CLI
```

只有一个根包，没有 npm workspaces。别名在 tsconfig.base.json 中定义，由类型检查和构建/预览统一解析。源码允许 import/export；后台打包为单文件 `const program=...`，不引入浏览器、Node、网络或计时器。Lit 产物仅导入宿主 `lit`，不内置第二份核心。

根 tsconfig.json 是 IDE 工程入口，通过 references 明确关联浏览器配置 tooling/tsconfig.browser.json、后台配置 tsconfig.goja.json 和页面程序配置 tsconfig.page-program.json。WebStorm、VS Code 及 TypeScript 语言服务可从标准入口发现后台源码，保留各运行环境的隔离。类型检查使用 npm run typecheck，它逐个检查引用工程；只运行 tsc -p tsconfig.json 不会检查所有源码。浏览器配置放在 tooling/ 下，保留模板祖先的工程通过 upstream sync 合并更新，不需要改本机全局 IDE 配置。

如果 IDE 在更新后仍沿用旧工程，先重启 TypeScript 语言服务。导入报红时先确认文件所属配置和别名解析，不用 any 或忽略诊断消除报错。Product.attributes 的值是 unknown，使用前按实际类型收窄；类型回归同时校验 SDK、Product 与阶段上下文没有退化为 any。

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

`npm run check` 执行格式/类型/构建/产物/回归/CLI回环测试/浏览器/Goja。平台验证使用真实 Go 模块和页面编译器，不启动服务或写库；它不替代 Workflow 事务、权限、Tool 账本或完整业务。更完整的分层要求见 [验证表](docs/verification.md)。

fixtures/goja-test.js 使用普通 JavaScript 脚本语法，最后一个表达式提供验证结果。异步测试写成 `(async () => { /* 断言 */ return { passed: true } })()`，不写文件顶层 return。运行器分别加载程序与 fixture，检查异常、Promise 拒绝、未结清及缺少结果；函数内部 return 仍用于结果和分支控制。

已有工程的 nodes/ 属于用户业务文件，upstream sync 不会替换其中的 fixture。升级运行器时，需将旧 fixture 最外层的 `return (async ...` 改为 `(async ...`，保留函数内部返回和全部断言。

缓存显式设置 `MF_CACHE_DIR`；npm 缓存用 `NPM_CONFIG_CACHE`，Go/Vite/浏览器材料由工具归该目录。正式 build 安全压缩并输出大小/耗时，属性名不混淆；build:dev 只改变可读性。fixture 页面明确是本地数据，不作为真实业务成功证据。

## 平台、技能与更新

先运行 `npm run platform -- guide` 取得离线开发条件、作者API和常用接口；再用 `npm run platform -- --profile test-admin doctor --bundle dist/<编码>` 做只读环境预检和不落库ABI校验。未提供bundle不宣称远端ABI；仅查Schema和开发不授权执行可能计费的Tool。完整入口见[节点开发指南](.agents/skills/mofang-js-node/references/node-development.md)。

平台 CLI：`npm run platform -- describe`。JS/Lit 技能分别见 [.agents/skills/mofang-js-node](.agents/skills/mofang-js-node/SKILL.md)、[.agents/skills/mofang-lit-node](.agents/skills/mofang-lit-node/SKILL.md)及 [Lit 最佳实践](.agents/skills/lit-best-practices/SKILL.md)。CLI 登录资料保存在用户指定的受限配置，密码/token 不进入源码、日志或报告。目录保存、实例采用、双面板发布和新运行分别核对目标与修订。

设计阶段按需使用 [节点业务设计](.agents/skills/mofang-node-business-design/SKILL.md) 推导业务规则、输入输出、事件与人工交接，使用 [节点 UI 设计](.agents/skills/mofang-node-ui-design/SKILL.md) 组织有限空间内的表单、审核界面和状态反馈；实现仍遵守上述 JS/Lit 契约。

另提供第三方 [Impeccable](.agents/skills/impeccable/SKILL.md)（综合设计与评审）和 [frontend-design](.agents/skills/frontend-design/SKILL.md)（视觉方向与排版），各自 UPSTREAM.json 记录固定来源修订，保留 Apache-2.0 许可及相关归属。七个技能均随初始化分发；安装技能未安装项目 hook 或全局配置。Impeccable launcher 会按其规则定位或首次获取引擎，实际运行能力需另行核对；节点宿主约束及项目材料位置优先。

[Git 同步](docs/upstream.md)使用唯一官方源。新工程保留模板祖先并提交初始化内容，以后通过 fetch/merge 更新整个上游，不维护文件或技能白名单；非重叠改动自动合并，冲突按 Git 常规方式解决或撤销后执行 upstream recover。未提交修改不自动 stash/reset/rebase。未完成合并或 dependenciesPending 会阻止构建。旧无模板祖先的工程不自动迁移，后续逐个接入。技能源码已合入本模板；退役独立技能仓库由维护者另行处理，不是初始化或同步命令的副作用。
