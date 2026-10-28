# 魔方函数节点工作区

统一维护 Goja 后台函数节点和 Lit/Puck 设置、业务面板。后台作者 API 是具名状态、不可变快照、显式 updater/reducer 和自定义 Hook；两份面板独立选择渲染方式。新产物只支持 `mf.node/1`，不读取或转换旧 createState/lifecycle 对象。

用户请求与 AI 行为的对应关系见 [AI 意图路由](docs/ai-behavior.md)。本模板将本地开发、页面预览、平台保存、实例发布和真实运行分开处理，AI 不会把其中一个动作的成功推断为其它动作已完成。

官方唯一模板与技能源：[mofang-node-workspace-template](https://github.com/xiaojiecode/mofang-node-workspace-template)。先读 [AGENTS.md](AGENTS.md) 和本项目可选 AGENTS.local.md，日常开发不要求检查或同步上游更新。需要更新模板时，手动执行 `node tooling/cli.mjs upstream sync`，详见 [Git 同步](docs/upstream.md)；未完成合并、恢复记录和依赖状态的本地安全检查仍保留。

## 创建与开发

```sh
npm ci
npm run init -- --dir ../my-nodes --name my-nodes
cd ../my-nodes
npm ci
npm run node:new -- --code my-node
npm run dev
```

模板和 `init` 创建的新工程都从空 `nodes/` 开始。已有工程用 `npm run node:new -- --code my-node` 按需创建中性骨架，目标存在时直接失败。空工程打开预览时会显示创建命令提示；不再提供业务预设或 `--preset` 参数。骨架只包含空双 Schema、最小 `mf.node/1` 入口、独立面板、页面准备程序和空 fixture，不调用能力、不创建任务或候选，也不自动声明生产结束。请按已确认业务补充契约、状态、任务和结束路径后再发布或运行。Node 22.12+，Goja/平台验证需要 Go 1.26.5+；依赖保持 lock 中精确版本，不自动浮动升级。

```text
nodes/<code>/
  node.ts        本地目录元数据与冻结双 Schema
  run.ts         defineNode 静态 spec 与纯函数绑定
  contract.ts    本节点类型与状态/动作 Schema
  panels.json    两份面板的 renderer 和入口；旧工程可缺省为 Lit
  settings.ts    宿主受控设置面板
  view.ts        Lit 业务面板
  settings.page.json  Puck 设置页完整包，选用 Puck 时生成
  business.page.json  Puck 业务页完整包，选用 Puck 时生成
  page.ts        骨架的空输入准备程序，按 inputSchema 补充
  tasks/         按业务需要新增的 StageProgram 阶段程序，不随骨架生成
  fixtures/      明确的本地验证数据
lib/
  author/        @mofang/node，实际 mf.node/1 作者运行时
  contracts/     @mofang/contracts/*，可信 SDK/系统类型快照
  browser/       @mofang/browser，Lit 展示与宿主资源接线
shared/          用户业务公共源码
playground/      有界双面板本地预览
vendor/          固定版本的低代码作者/运行库及工作流 SDK/适配包
.agents/skills/  节点设计、JS/Lit、Lit 最佳实践及第三方设计技能，包含唯一共享平台 CLI
```

只有一个根包，没有 npm workspaces。别名在 tsconfig.base.json 中定义，由类型检查和构建/预览统一解析。源码允许 import/export；后台打包为单文件 `const program=...`，不引入浏览器、Node、网络或计时器。Lit 产物仅导入宿主 `lit`，不内置第二份核心。

根 tsconfig.json 是 IDE 工程入口，通过 references 明确关联浏览器配置 tooling/tsconfig.browser.json、后台配置 tsconfig.goja.json 和页面程序配置 tsconfig.page-program.json。WebStorm、VS Code 及 TypeScript 语言服务可从标准入口发现后台源码，保留各运行环境的隔离。类型检查使用 npm run typecheck，它逐个检查引用工程；只运行 tsc -p tsconfig.json 不会检查所有源码。浏览器配置放在 tooling/ 下，保留模板祖先的工程通过 upstream sync 合并更新，不需要改本机全局 IDE 配置。

如果 IDE 在更新后仍沿用旧工程，先重启 TypeScript 语言服务。导入报红时先确认文件所属配置和别名解析，不用 any 或忽略诊断消除报错。Product.attributes 的值是 unknown，使用前按实际类型收窄；类型回归同时校验 SDK、Product 与阶段上下文没有退化为 any。

## 业务与结束路径

状态槽必须提供冻结 Schema，snapshot 深只读。setter 不改变当前闭包；连续累加用 pending updater；状态与命令耦合时 reducer 一次返回 state/commands/production。Component/guard/Project 只计算，真正工作在事件 handler 和子任务阶段。完整说明见 [作者规范](docs/authoring.md)、[运行边界](docs/abi.md)和 [反例](docs/antipatterns.md)。

输入/任务输出保留真实 deliveryId/inputRefs；Product 使用完整可信类型，不手写缩略业务 Schema。子任务继续当前 stages 与 ctx.input/state/answer，每阶段最多一次能力调用；unknown 不自动重发，人工回答沿真实等待身份。

finish 是事件计划末尾的生产声明，不直接完成节点，不放行/丢弃已有候选。无参必要动作由共同宿主入口提供；参数选择由业务面板提交。动作 accepted、applied、子任务成功和节点成功分别显示。骨架没有预设业务规则，节点作者须实现零输入、未选择、失败和未知结果的处理路径。

## 低代码面板由 AI 搭建

用户描述需求、体验页面并提修改意见，AI 负责字段、布局、数据源、事件与页面包。设置和业务可各自选择 `lit` 或 `puck`，两个选项默认 `lit`；四种组合都保留原节点执行合同。

首次使用先看 [Puck 使用与接入说明](docs/lowcode.md)：环境准备、独立工程位置、交互预览、各部分职责，以及保存和发布的区别。AI 搭建时按 [物料使用指南](.agents/skills/mofang-lowcode-node/references/materials.md) 选择组件、组合字段和详情交互。

```sh
npm run node:new -- --code review-products --settings-renderer puck --business-renderer puck
# 混合渲染时，两个面板分别指定；init 只创建空工程
npm run node:new -- --code review-mixed --settings-renderer puck --business-renderer lit
```

节点清单示例：

```json
{
    "version": 1,
    "settings": { "renderer": "puck", "entry": "settings.page.json" },
    "business": { "renderer": "lit", "entry": "view.ts" }
}
```

没有清单的旧节点继续使用 `settings.ts` 和 `view.ts`。存在但不合法的清单、入口越界或符号链接逃逸都会失败；创建命令不会覆盖已有节点。新工程携带 vendor 编译产物及固定依赖，在独立目录执行 `npm ci` 即可安装，不需要相邻 frontend/admin 源码。

低代码包通过 `vendor/low-code-page/` 精简目录分发，不再生成或依赖 tgz。package-lock 固定本地目录依赖，vendor/lowcode-lock.json 和 manifest.json 校验产物。保留公开入口、类型、组件和逻辑；移除 `.map`、全部字体二进制及 `@font-face`，使用宿主 `--font-default` 或系统字体，字体许可仍保留。选品报告的三张宠物商品示例大图按来源清单的 hash 从 JS 中移除，报告沿用已有编号占位；其他图标和图片不受影响。裁剪规则由目录生成脚本维护，更新包时自动执行，不手改生成文件。SDK/工作流适配包暂保留原目录方式。

维护者更新低代码包时执行：

```sh
npm run prepare:lowcode -- --source ../frontend/dist/low-code
npm install
```

来源必须是带完整 manifest 的构建产物。命令先校验 hash，裁剪资源后整体同步 vendor/low-code-page 和产物锁；`npm install` 更新安装内容和 package-lock。后续低代码更新使用 `prepare:lowcode` 保证字体和示例图不会重新带入。提交精简目录、依赖配置和锁文件；node_modules 属于安装产物，被 Git 忽略，不提交。散文件方式下，共享包更新会在 Git 修改区显示对应文件变化。

作者命令输出结构化 JSON，能力目录来自当前共享包：

```sh
node tooling/cli.mjs lowcode guide
node tooling/cli.mjs lowcode catalog --category material --query 表格
node tooling/cli.mjs lowcode catalog --category sdk
node tooling/cli.mjs lowcode inspect --code review-products --surface settings
node tooling/cli.mjs lowcode apply --file ./request.json
node tooling/cli.mjs lowcode validate --code review-products --surface settings
node tooling/cli.mjs lowcode preview --code review-products --surface business --port 5188
```

`apply` 文件包含 nodeCode、surface、inspect 返回的 expectedRevision 和 operations。常规修改使用语义操作，完整导入也必须校验并检查 revision；失败不留下半成品。成功返回新 revision、变更摘要和检查点；`restore --file <请求文件>` 需要 nodeCode、surface、expectedRevision、checkpointId，以新修订恢复当前面板，不影响节点代码。

预览只挂载运行页面，用户可填表、选择、点按钮；页面没有物料栏、拖拽设计器或 JSON 编辑入口。preview 命令只给出 URL，不启动服务；先探测端口，复用已有 `npm run dev`，在默认外部浏览器核对实际 revision。Mock 操作只影响预览内存，不能证明真实第三方接口、平台保存或节点运行已成功。配置接口不等于授权调用接口；真实调用和写入另行确认范围。

Puck 设置页保留 `main1` 宿主表单绑定，骨架不预置业务字段或提交动作。作者按已确认契约添加设置字段、就绪投影绑定和参数动作；共享动作适配等到 applied 后才显示成功。accepted 只表示动作已受理，取消、失败和结果未知不会被当作成功。

### 构建与离线保存准备

`npm run build` 按清单生成宿主直接加载的 CommonJS/ES2017 `.js` 或完整 `.page.json`；构建期会对可静态识别的无插值 `lit.css` 做 CSS 空白压缩，源码保持可读。manifest 记录 surface、格式、renderer、模块格式、源码和产物 hash、包兼容版本。只有 Lit 业务页生成 `pageProgram.js`。`node.json` 继续只含原执行定义，不混入面板描述。`npm run verify` 同时核对源码修订、产物哈希、JS 限制和共享 JSON 校验。

```sh
npm run build
npm run verify
node tooling/cli.mjs panels:prepare --code review-products --surface settings --catalog-file ./catalog.json --out ./settings-save.json
```

catalog.json 必须是已回读的真实目录信息 `{code,catalogInstanceId,catalogRevision}`，也接受平台 CLI 的 `{ok:true,data:{...}}` 包装。修订为正整数字符串；身份不匹配、源码改动后未重新构建、产物 hash 不一致都会失败。输出文件已存在时也会失败。Lit 业务页还需要 `--supported-context-schemas` 显式传入已确认的 JSON 字符串数组。

Puck 后台保存使用 `renderMode=lowcode` 和 `lowcode: { rendererKey: "puck", config: 完整PagePackage }`，业务包内部 surface 使用 runtime；不发送 Lit 的 viewSource/programSource。`panels:prepare` 完全离线，不调用保存或发布接口。当前准备工具和 CLI 仍使用顶层 rendererKey/config，与后台结构有差异，上传前按 [Puck 请求结构与已知问题](.agents/skills/mofang-js-node/references/platform-cli.md#puck-页面的后台请求结构) 处理。先保存 settings，再回读新目录修订，随后准备和保存 business。页面保存、页面发布、实例采用执行定义以及启动新运行是分别授权、分别核对的操作。

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

`npm run check` 执行格式/类型/构建/产物/回归/CLI回环测试/浏览器/Goja。平台验证应从已创建并构建节点的独立工程运行，模板空目录会明确失败。它使用真实 Go 模块和页面编译器，不启动服务或写库；它不替代 Workflow 事务、权限、Tool 账本或完整业务。更完整的分层要求见 [验证表](docs/verification.md)。

fixtures/goja-test.js 使用普通 JavaScript 脚本语法，最后一个表达式提供验证结果。异步测试写成 `(async () => { /* 断言 */ return { passed: true } })()`，不写文件顶层 return。运行器分别加载程序与 fixture，检查异常、Promise 拒绝、未结清及缺少结果；函数内部 return 仍用于结果和分支控制。

已有工程的 nodes/ 属于用户业务文件，upstream sync 不会替换其中的 fixture。升级运行器时，需将旧 fixture 最外层的 `return (async ...` 改为 `(async ...`，保留函数内部返回和全部断言。

缓存显式设置 `MF_CACHE_DIR`；npm 缓存用 `NPM_CONFIG_CACHE`，Go/Vite/浏览器材料由工具归该目录。正式 build 安全压缩并输出大小/耗时，属性名不混淆；build:dev 只改变可读性。发布包携带本地最终编译字节，服务端保存时只做校验和冻结，不应依赖服务端再次转译。fixture 页面明确是本地数据，不作为真实业务成功证据。

## 官方基础组件

基础组件统一维护在 [lib/browser/ui](lib/browser/ui/README.md)，从 `@mofang/browser` 导入，包含白底主题、Card、表单、表格与分页、图片查看器、Tabs、骨架和过渡。保留既有调用方式；组件只处理展示与交互，业务执行和宿主草稿仍由节点负责。

`npm run test:ui` 生成组件总览并验证交互，`npm run test:transitions` 验证过渡；两项均纳入 `npm run check`。可通过 `MF_CACHE_DIR` 指定预览与截图目录，通过 `MF_CHROME_PATH` 指定 Chrome。

新工程初始化时自带组件和验证入口；已有工程通过 `upstream sync` 合并官方更新，本地组件改动按普通 Git 合并处理。更新后须重新构建和发布相应面板，平台已发布版本不会自动替换。

## 平台、技能与更新

先运行 `npm run platform -- guide` 取得离线开发条件、作者API和常用接口；再用 `npm run platform -- --profile test-admin doctor --bundle dist/<编码>` 做只读环境预检和不落库ABI校验。未提供bundle不宣称远端ABI；仅查Schema和开发不授权执行可能计费的Tool。完整入口见[节点开发指南](.agents/skills/mofang-js-node/references/node-development.md)。

平台 CLI：`npm run platform -- describe`。JS/Lit 技能分别见 [.agents/skills/mofang-js-node](.agents/skills/mofang-js-node/SKILL.md)、[.agents/skills/mofang-lit-node](.agents/skills/mofang-lit-node/SKILL.md)及 [Lit 最佳实践](.agents/skills/lit-best-practices/SKILL.md)。CLI 登录资料保存在用户指定的受限配置，密码/token 不进入源码、日志或报告。目录保存、实例采用、双面板发布和新运行分别核对目标与修订。

设计阶段按需使用 [节点业务设计](.agents/skills/mofang-node-business-design/SKILL.md) 推导业务规则、输入输出、事件与人工交接，使用 [节点 UI 设计](.agents/skills/mofang-node-ui-design/SKILL.md) 组织有限空间内的表单、审核界面和状态反馈；实现仍遵守上述执行及面板契约。

另提供第三方 [Impeccable](.agents/skills/impeccable/SKILL.md)（综合设计与评审）和 [frontend-design](.agents/skills/frontend-design/SKILL.md)（视觉方向与排版），各自 UPSTREAM.json 记录固定来源修订，保留 Apache-2.0 许可及相关归属。七个技能均随初始化分发；安装技能未安装项目 hook 或全局配置。Impeccable launcher 会按其规则定位或首次获取引擎，实际运行能力需另行核对；节点宿主约束及项目材料位置优先。

[Git 同步](docs/upstream.md)使用唯一官方源。新工程保留模板祖先并提交初始化内容，以后通过 fetch/merge 更新整个上游，不维护文件或技能白名单；非重叠改动自动合并，冲突按 Git 常规方式解决或撤销后执行 upstream recover。未提交修改不自动 stash/reset/rebase。未完成合并或 dependenciesPending 会阻止构建。旧无模板祖先的工程不自动迁移，后续逐个接入。技能源码已合入本模板；退役独立技能仓库由维护者另行处理，不是初始化或同步命令的副作用。
