# Puck 节点使用与接入说明

用户描述节点需求、查看效果、提出修改；AI 在节点工程里完成页面配置和执行逻辑。配置表单与展示页都支持 Puck，也可以分别选择 Puck 或 Lit。

## 使用入口

创建节点的人需要 Node.js 22.12+、npm 和 Git。连接平台的 CLI 需要 Python 3.10+；运行 Goja 验证时需要 Go 1.26.5+。只在魔方里配置、运行已上传节点的人不需要安装这些开发工具。AI 使用当前会话已有的文件和命令能力，模板本身不提供模型服务。

可以直接向 AI 说明：

> 根据这个 template 创建一个节点，设置和展示都使用 Puck，使用 dev 环境。输入是什么、调用哪个能力、输出是什么；设置页需要哪些字段和校验，展示页如何选择、看详情和提交。先给我可交互预览，再按我的要求上传后台。

AI 先读取本工程 AGENTS 和低代码技能，查询实际物料及能力合同，只补问缺少的业务条件。发布范围和真实能力调用沿用用户授权；开发或预览本身不启动真实采集。

### 工程生成在哪里

在 template 目录执行以下命令会新建独立工程：

```sh
npm ci
npm run init -- --dir ../my-puck-nodes --name my-puck-nodes --preset selection --settings-renderer puck --business-renderer puck
cd ../my-puck-nodes
npm ci
```

`--dir` 决定输出位置，同级目录只是示例。新工程保留模板 Git 祖先，自带工具、技能和编译好的物料包；创建普通节点不需要相邻 frontend 源码。`selection` 是选品执行逻辑起点，AI 仍需按业务需求修改它。

在已有节点工程中增加节点：

```sh
npm run node:new -- --code my-review --preset selection --settings-renderer puck --business-renderer puck
```

`init` 创建工程，`node:new` 创建工程内的节点。目标已存在时命令会拒绝覆盖。AI 应在交付中给出实际工程、`nodes/<code>` 和 `dist/<code>` 路径。

### 看效果和提出修改

AI 查询物料、读取页面修订、提交页面操作后，生成预览地址：

```sh
node tooling/cli.mjs lowcode preview --code my-review --surface settings --port 5188
```

该命令只返回 URL。启动服务前探测端口，确认可用或复用本工程服务；需要启动时执行：

```sh
npm run dev -- --host 127.0.0.1 --port 5188 --strictPort
```

在系统默认外部浏览器打开返回的地址。用户可以切换配置表单和展示页、填写和点击，页面不提供拖拽设计器。继续告诉 AI 要修改什么即可。

预览使用明确标注的模拟数据。“保存模拟配置”只保存本轮试填，刷新后恢复 fixture；它不修改页面 JSON，也不写真实工作流配置。AI 更新页面后核对实际加载的 revision；重新加载可能重置试填内容。源码预览、构建产物与实际宿主的验证区别见[预览与发布](../.agents/skills/mofang-lowcode-node/references/preview.md)。

## 各部分负责什么

| 部分 | 负责的事情 | 维护位置 |
| --- | --- | --- |
| 共享物料 | React 组件、样式、参数校验、页面运行器、AI 可查询的物料目录 | frontend 源码，构建后向模板分发 |
| template | 初始化、作者命令、编译、验证、预览和使用规范 | 本仓库 |
| 节点工程 | 业务执行代码、两份页面 JSON、业务 fixture | `nodes/<code>` |
| 工作流适配包 | 注入 SDK、目标节点、受控设置草稿、节点公开投影 | `@mofang/workflow-lowcode` |
| frontend 宿主 | 读取已保存页面包、提供登录态与权限、挂载 Puck 运行页面 | 实际工作流客户端 |

template 的 `vendor/low-code-page` 是构建后的共享包，包含运行代码、类型和作者目录。AI 通过 `lowcode catalog` 查询名称、ID、用途、参数、事件和约束；具体选用方式见[AI 物料使用指南](../.agents/skills/mofang-lowcode-node/references/materials.md)。

页面配置、数据绑定和交互变化通常修改 `.page.json`；业务采集及输出变化修改节点执行代码；新增组件能力需要修改共享物料源码并重新构建分发。通用物料不依赖具体节点名称、1688 接口或本地 fixture。

### 设置、展示和 SDK 的接线

- 设置页通过 `extensions.workflow.settingsFormId` 指定表单，字段 `name` 对应节点输入 Schema 的配置键。编辑写入宿主草稿，保存和取消由宿主负责；普通必填、格式等规则声明在字段上。业务执行仍需验证实际配置。
- 展示页读取就绪的 `composition` 投影；适配器将其暴露为 `host.nodeView`。加载、不可用和历史只读按宿主状态处理。模板里用 fixture 替代真实订阅，正式页面使用实际宿主数据。
- 选择、详情弹框等页面交互由 Puck 配置完成。提交选择通过 `workflow.nodeAction.run` 传递真实目标、payload 和 sessionRevision，并等待 applied；后台节点再决定输出和结束。
- 复杂 JS 可以声明 `service:workflowSdk`，使用宿主注入的完整公开 SDK。调用前查 SDK 方法目录和脚本合同；完整 SDK 能力仍受宿主权限和方法前置条件限制。
- 真正的采集、模型调用等业务放在节点子任务中，通过 `ctx.call` 执行。页面展示、打开详情和设计预览不应自行启动采集。

## 保存、发布和运行的区别

| 操作 | 实际结果 |
| --- | --- |
| 本地 apply / build | 修改页面配置或生成产物，不写后台 |
| 保存节点目录 | 保存执行代码和输入输出合同 |
| 保存 settings / business 页面 | 分别更新目录页面，后续新建节点实例使用目录当前页面 |
| 发布页面到已有实例 | 按明确范围更新实例页面副本，不等于替换执行定义 |
| 已有实例采用执行定义 | 显式采用新的执行代码和 Schema，原配置需核对兼容性 |
| 发布 / 启动工作流 | 发布工作流版本或实际运行；可能触发计费能力 |

上传完成应回读代码和两份页面，比较内容、节点身份与修订。不能只凭 HTTP 成功就报告整条业务已验收。Puck 的后台请求结构和当前工具差异见[平台 CLI 的 Puck 说明](../.agents/skills/mofang-js-node/references/platform-cli.md#puck-页面的后台请求结构)。

## 物料维护与版本核对

普通节点作者使用工程自带的包。维护者修改 frontend 物料后，先在该源码仓库按其构建说明生成带 manifest 的产物，再按 [README 的更新命令](../README.md#低代码面板由-ai-搭建) 更新模板。当前低代码包入口为 `prepare:lowcode`，会执行资源裁剪及产物锁更新；不要用手工复制单个 JS 或直接修改 vendor 代替。

已有节点工程通过[模板同步流程](upstream.md)接收已提交的更新，处理依赖变化后重新查询目录、校验页面并预览。更新模板不会同步更新已上传页面，也不会自动升级实际客户端的运行库。

诊断版本时同时记录：

| 记录 | 用途 |
| --- | --- |
| 模板 Git 修订、工程的上游同步状态 | 判断接收了哪次工具与规范更新 |
| `vendor/lowcode-lock.json` 的版本和 manifestSha256 | 区分同版本号下不同的实际包内容 |
| 各包 manifest、package-lock 和实际安装内容 | 核对分发产物与依赖安装是否一致 |
| `lowcode inspect` 的页面 revision | 确认正在编辑和预览的是同一份 JSON |
| 后台 catalogRevision、两份页面 revisionId、客户端运行库版本 | 确认上传及实际渲染使用的版本 |

页面的 schemaVersion、materialsVersion 等标记描述协议兼容性，不能单独代替包内容哈希和宿主版本核对。简化更新链路和版本维护仍在 [TODO](../TODO.md) 中；现有预览能力是这些优化要保留的验收要求。

## 常见问题

| 现象 | 先检查什么 |
| --- | --- |
| AI 查不到组件或参数 | 当前工程的 catalog 与实际包版本；必要时同步物料后重查。不要直接拼出目录不存在的类型或属性 |
| 设置保存报“节点没有声明该输入” | 字段 name 与该实例冻结的 inputSchema；修改显示标签不能修复字段不匹配 |
| 切换单条后已有虚构链接 | fixtures/input.json 的模拟初值和字段 defaultValue。示例使用 placeholder，真实默认输入留空 |
| 更新后仍看到旧页面 | 页面 revision、是否暂停跟随、是否打开 artifacts 产物模式、服务所属工程及浏览器缓存 |
| 列表没有数据 | 宿主投影是否 ready、rows 绑定路径、数据源触发时机、稳定且唯一的 rowKey；不要用示例数据掩盖真实失败 |
| 详情显示了别行数据 | 打开弹框时的 record 是否取当前 row；弹框内容使用 dialog.record 绑定 |
| 弹框内出现悬浮提示 | 检查 tooltip 的触发元素和鼠标命中位置。文字的全文提示不等于外层列表穿透；截断文字仍要能查看全文 |
| 上传报 unknown Start field config | 检查请求是否把 rendererKey/config 放在顶层；按平台 CLI 文档核对 lowcode 对象，拒绝后回读修订再处理 |

排查时区分页面配置、共享物料、工作流适配器和后台合同的问题，保留失败回执。文档中的模拟示例不证明真实接口接通。
