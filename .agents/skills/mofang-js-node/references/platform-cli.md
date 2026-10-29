# 通过 CLI 连接魔方平台

用于按环境登录后台或客户端、查询和试调用原子能力、校验保存节点与双面板、配置工作流。Python 3.10+，仅标准库，不安装或注册 MCP。独立试调用走平台客户端 MCP HTTP 入口；节点运行中的业务调用仍由子任务 ctx.call 执行。

CLI 源码在本技能的 `scripts/`；Lit 技能的同名入口复用它。安装时同时保留同级 `mofang-js-node` 和 `mofang-lit-node`。在任意工程目录执行，均无需魔方服务端源码。

```bash
python3 <技能目录>/scripts/mofang_node.py --help
python3 <技能目录>/scripts/mofang_node.py describe
python3 <技能目录>/scripts/mofang_node.py describe nodes update
```

全局参数 `--profile`、`--state-dir`、`--timeout` 放在命令组之前。成功输出 `{"ok":true,"data":...}`；API、权限、输入和网络错误输出 `{"ok":false,"error":{"code":...,"message":...,"status":...}}` 并非零退出。`--help` 的参数错误走 argparse 的 stderr 和退出码 2。不要从退出 0 推断运行已经完成，仍需检查回执、发布状态与运行状态。

## 开发入口与费用边界

先运行 `guide` 取得离线开发事实、作者 API、接口字段含义、修订条件和effect，再按[节点开发入口](node-development.md)补齐业务条件。`describe` 只展示本地CLI目录，不探测远端ABI；`doctor --bundle <dist/编码>` 仅读取类型/目录/声明工具的元数据，并调用不落库的validate。未提供bundle时ABI为not_checked；403或连接失败不等于ABI不支持。

默认不执行可能计费的Tool、模型或工作流start；仅用户明确要求实际调用/试跑时才在授权范围执行。开发、查Schema、编译/validate不代表这种授权。`capabilities call` 必须使用客户端会话，禁止改用后台原子能力 execute 接口。

## 环境和身份

网关固定映射：`https://dev.api.mofang.com` 为测试、`https://api.mofang.com` 为正式、`https://pre.api.mofang.com` 为预发。按用户已指定的环境直接选择对应网关和独立profile；尚未指定时仅澄清目标环境。页面地址只有实际代理 `/v1` 时才可作为 base-url；不要带具体 `/workflow/new` 路由或把页面查询参数当作网关前缀。后台与客户端身份独立，使用不同 profile。

```bash
# 交互式输入管理员密码；密码不出现在命令行或输出中。
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin auth login \
    --role admin --base-url <网关根地址> --phone <管理员账号>

# 客户端当前正式接口使用登录验证码，不把后台密码或管理员 token 当用户身份。
python3 <技能目录>/scripts/mofang_node.py --profile demo-user auth login \
    --role client --base-url <网关根地址> --phone <用户账号>

# 用户明确提供已有会话时，可通过交互提示输入裸 access token。
python3 <技能目录>/scripts/mofang_node.py --profile demo-user auth import \
    --role client --base-url <网关根地址>

python3 <技能目录>/scripts/mofang_node.py --profile demo-admin auth status
```

非交互调用在上述 login/import 后加 `--secret-stdin`，从已有受限文件或调用方的内存管道传入密码、验证码或裸 access token；不要把值拼进 shell 命令、URL、日志或报告。CLI 不发送短信；验证码由正常登录流程获得。需要 2FA 时 login 返回 `mfa_required` 和 challenge ID，再运行：

```bash
python3 <技能目录>/scripts/mofang_node.py --profile demo-user auth verify \
    --base-url <同一网关根地址> --challenge-id <登录返回的challenge-id>
```

会话默认放 `~/.local/share/mofang-node-cli/<profile>.json`，可用 `--state-dir` 或 `MOFANG_NODE_STATE_DIR` 指定独立目录。目录必须为 0700、文件为 0600；CLI 保存 token 和有效期，不保存密码，不输出 token。不要把 state-dir 指向共享目录或项目源码目录。`auth status` 只检查本地记录，不证明远端会话仍有效；客户端可显式 `auth refresh`，管理员到期后重新登录。`auth logout` 只清除本 profile 的本地会话，不撤销远端会话。

## 在线找能力，读取完整输入输出

```bash
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin capabilities list \
    --query channel_code=fastmoss --query page=1 --query size=50
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin capabilities get \
    --tool fastmoss_product_search
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin capabilities get --id <能力ID>
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin types list
```

列表用于发现，完整定义以 get 为准；`--tool` 分页读取未过滤目录后按精确tool_name匹配，再调用详情；keyword模糊查询不覆盖所有工具编码，空搜索结果不能证明能力不存在。读取 `input_schema`、`output_schema`、两者的 registered 标记、effective_enabled、async_execution 和 requires_workflow_context。字段未注册、缺失或上游不提供输出 Schema 时，明确记录缺口，不根据名字或样例猜造结构。异步能力须区分提交回执与最终结果，不能把任务号当作商品结果。没有后台目录读取权限时报告权限缺口，不使用内部无鉴权接口。

节点主流类型从在线 `types list` 选择；作者开发类型从已安装节点模板的 `lib/contracts` 读取。原子能力的工具名、请求与响应以在线详情为准，无须搜索后端适配器源码。

## 使用客户端身份试调用

先用同环境管理员读取能力详情并确认输入输出、可用性与工作流上下文要求。用户已明确要求实际调用后，用独立客户端 profile 和显式工作区执行：

```bash
python3 <技能目录>/scripts/mofang_node.py --profile test-client capabilities call \
    --tool platform_product.collection_box_products --workspace-id <工作区ID>
python3 <技能目录>/scripts/mofang_node.py --profile test-client capabilities call \
    --tool platform_product.store_products --workspace-id <工作区ID> --file <参数.json>
```

`--file` 仅放能力 arguments，例如 `{"keyword":"测试"}`；省略时为 `{}`，`--file -` 从 stdin 读取。CLI 生成 `POST /toomcp` 的 JSON-RPC `tools/call` 请求，将工作区放在 `params._meta.workspace_id`。客户端用户身份由服务端从 access token 认证，工作区成员权限也由服务端校验。profile 必须为 client，令牌的客户端 access 类型另做错用检查；本地检查不代替服务端签名验证。不要使用管理员令牌、按相同数字或手机号映射用户、直连数据库代替调用，或为了绕过权限填写其它用户身份。

没有客户端会话时用上述 `auth login --role client` 或 `auth import --role client`；会话过期按正常刷新/登录处理，不回退管理员 execute。需要真实工作流身份的能力沿节点 `ctx.call` 调试，不在此命令中伪造运行标识。

成功输出保留 `tool_name/workspace_id/request_id/result`，其中 result 是完整 MCP 回执。JSON-RPC error、MCP `isError=true` 返回非零退出码；业务 pending、部分失败和最终完成仍按能力输出 Schema 判断，不能只看 CLI `ok`。命令不自动重试或轮询；断连时输出结果未知和 request_id，先核对原请求，不能重新提交来判断是否成功。

## 节点校验、创建和更新

命令操作 JS/Goja 作者接口；Go 注册定义只读。Agent 与其它目录类型可通过 nodes list/get 查看，不能用 JS 更新接口覆盖。请求体用 `--file <JSON文件>`，也可用 `--file -` 从 stdin 读取；本任务的正文、结果和临时材料按工作区约定保存。

```bash
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin nodes source --code <节点编码>
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin nodes validate --bundle <dist/节点目录>
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin nodes create --bundle <dist/节点目录>
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin nodes update \
    --code <节点编码> --bundle <dist/节点目录> \
    --expected-catalog-instance-id <当前catalogInstanceId> \
    --expected-catalog-revision <当前catalogRevision>
```

bundle 读取工程模板的 `node.json`，只选取作者请求字段，不发送模板元数据或客户端编造的实现类型。也可用 `--file` 写完整作者请求，通过 `--source-file <program.js>` 原文覆盖 source。更新前读取 source；目录身份及修订必须来自用户本次要编辑的版本。CLI 不自动读取最新修订覆盖它们。校验只证明 syntax_and_contract，不证明真实工具授权或业务成功。更新后再 nodes source 回读源码、目录修订和定义摘要。

## 双面板保存和发布

Puck 上传先读下面的“Puck 页面的后台请求结构”；本节的本地构建和最终保存正文示例用于 Lit。

settings/business 独立读取和保存；surface 和目录双 CAS 必须明确。页面编译与作者静态分析只在模板本地进行，远程 `panels compile` 已删除。后台 Lit 仅支持最终产物接口写入或上传，不提供源码编辑和预览。

```bash
npm run build
npm run verify
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin panels get --code <编码> --surface settings > <目录快照.json>
node tooling/cli.mjs panels:prepare --code <编码> --surface settings --catalog-file <目录快照.json> --out <保存正文.json>
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin panels save --code <编码> --file <保存正文.json>
```

Lit 保存正文包含 viewSource/viewCompiled/viewHash/compilerVersion；business 另外包含 programSource/programCompiled/programHash 和显式非空 supportedContextSchemas。`panels:prepare --supported-context-schemas '["真实契约身份"]'` 按真实宿主声明上下文；不猜默认声明。每个产物摘要来自最终字节。保存一个面板后回读新目录修订，再准备另一个面板，不改写旧文件的 revision 规避冲突。

同一保存正文也可在后台相应节点与面板上传。后台核对当前身份、修订与摘要格式后提交同一接口，真实摘要由后端重算并核对，不重编译、不重写 CAS。发布仍使用已有 `panels publish --code <编码> --file <发布正文.json>`，正文携带 surface、已保存 panelRevision、显式 scope/targets；回执未知时只查询原资源，不自动重发。

### Puck 页面的后台请求结构

后台保存接口为 `PUT /v1/admin/workflow/nodes/{code}/page`。Puck 请求将 rendererKey 和完整页面包放入 lowcode 对象。以下是结构示意，pagePackage、catalogInstanceId 和 catalogRevision 均需替换为实际对象或本次回读值：

```js
const body = {
    kind: 'save',
    surface: 'settings', // 展示页使用 business
    renderMode: 'lowcode',
    lowcode: {
        rendererKey: 'puck',
        config: pagePackage, // 完整 PagePackage 对象，不能只传 data 或 JSON 字符串
    },
    expectedCatalogInstanceId: catalogInstanceId,
    expectedCatalogRevision: catalogRevision,
}
```

页面包中的节点编码须与 URL 一致。settings 包的工作流 surface 为 settings；business 包内为 runtime。两份页面分别保存，每次使用新回读并核对的目录修订。

**已知工具差异（2026-10-27 核对）：** `tooling/panels/prepare-save.mjs` 仍输出顶层 rendererKey/config，CLI 的 `mofang_cli/operations.py` 也按顶层字段做本地校验。直接发送该正文会被当前 dev 后台拒绝；只把输入 JSON 改成嵌套对象再交给现有 `panels save`，也会在本地校验失败。模板通用工具尚需修复，这份说明不代表工具已经兼容。

遇到这个差异时，先确认目标部署合同及本地工具版本。在用户已授权上传的节点工程中，可为已校验的请求增加局部适配：将两个顶层字段移入 lowcode，使用同一平台 CLI 的已认证 HTTPClient 请求上述正常接口。适配必须核对管理员环境、目标编码、构建产物一致性及目录身份/修订，保留服务端校验和失败回执；不要绕过鉴权、写数据库或改包为 Lit。通用工具修复后优先恢复标准命令。

本次 `lst-template-puck-collection` 的 dev 上传曾返回 HTTP 400 `unknown Start field config`，回读目录修订仍为 1。该节点工程通过局部请求适配完成 settings、business 保存，最终回读目录修订为 3，两份 config 均与本地产物相同；未发布到已有实例，也未执行真实采集。这是该次上传记录，不代表其它部署环境或未来工具版本已验证。

保存目录页面会供后续新实例使用；更新已有实例仍按显式发布范围操作。写入失败或断连先回读，处理修订冲突时比较内容，不只替换修订号后重发。完整预览与交付检查见[Puck 预览和发布边界](../../mofang-lowcode-node/references/preview.md)。

## 客户端工作流和节点配置

```bash
python3 <技能目录>/scripts/mofang_node.py --profile demo-user workflows list --query scope=mine --query page=1 --query pageSize=20
python3 <技能目录>/scripts/mofang_node.py --profile demo-user workflows get --workflow-id <workflowId>
python3 <技能目录>/scripts/mofang_node.py describe workflows save
python3 <技能目录>/scripts/mofang_node.py --profile demo-user workflows save --workflow-id <workflowId> --file <完整保存正文.json>
```

先读取完整快照，以用户选中的 draftRevision 作为 expectedRevision，同时提交名称、说明、封面和完整图。说明和封面允许空字符串但不能省略；graph 保留全部未修改节点、边、Globals、身份、冻结引用与外观。修改节点配置在 graph.nodes 的 configJson 完成，删除显式字段时省略该键，null 仍是显式 null。不要用当前目录重建旧图。

```json
{
    "expectedRevision": "<已读取的draftRevision>",
    "name": "<工作流名称>",
    "description": "",
    "coverUrl": "",
    "graph": {
        "nodes": [],
        "edges": [],
        "globalsJson": {},
        "agentSnapshots": {}
    }
}
```

上例只展示空图结构；编辑现有工作流时必须提交实际完整图。显式采用执行定义仍使用可选 definitionUpdates，条目包含 nodeInstanceId、targetCatalogInstanceId、targetDefinitionHash。暂停时普通配置与外观修改须原样附带读取到的 saveContext 作为 pausedRun，其字段为 runId、expectedRunRevision、expectedPauseRequestId；不能猜暂停身份或补读最新修订替换用户 CAS。未关闭运行含暂停锁定结构、绑定与审核／并发策略。

Save 返回 receipt 与 snapshot，成功核对 receipt.status=applied、资源身份和修订，使用 snapshot.draftRevision 作为后续起跑修订。失败、冲突或未知保留完整本地正文，不拆成多次写入或自动重试。退役的 workflows graph/config/publish 与 runs config 不再暴露；节点页面包 panels save/publish 保留。

只有用户明确要求才执行 workflows start。先完成手动 Save，再提交同次保存修订、显式 isTestRun 与 mode；不隐式保存，不带 source、versionId、configurationDraftRevision、临时 Globals 或节点配置。

```bash
python3 <技能目录>/scripts/mofang_node.py describe workflows start
python3 <技能目录>/scripts/mofang_node.py --profile demo-user workflows start --workflow-id <workflowId> --file <起跑正文.json>
```

```json
{
    "expectedRevision": "<Save回执的draftRevision>",
    "isTestRun": false,
    "mode": "manual"
}
```

正式运行用 false，试运行用 true。运行读回保留 runs get/state/activities/view；历史 source/version 字段仅用于读取，不作为新起跑参数。身份通过命令选项提供；CLI 消费相同正文身份，身份不一致则拒绝。actor 始终由服务端绑定。CLI 不自动保存后起跑、采用定义、选择实例、执行上架或迁移数据。

## 失败与验证边界

- HTTP 与业务错误均为非零退出，并保留服务端 errorCode；失败回执不当作成功。
- 修订冲突需要重新读取并比较本地编辑，再决定是否重提；不能仅替换 expectedRevision。
- 所有请求均不自动重试；写入断连返回 write_outcome_unknown，先用读取命令核对原目标。start 丢失响应时用 `workflows active-run --workflow-id <ID>` 及 `runs list --query workflowId=<ID>` 找候选运行；面板发布丢失响应时用 `panels releases --code <编码> --surface <位置>` 找发布记录，再逐条核对时间、版本、范围及目标。不能仅凭“最新一条”断言就是本次请求。已取得 runId/releaseId 后只查询原资源，不重新提交。
- 不自动跟随重定向，不把令牌带到另一个地址；环境切换重新显式登录相应 profile。
- 使用真实账号保存/发布必须处于用户授权的环境和目标范围。技能维护本身不授权写业务资源。

本技能的 `tests/test_cli.py` 用回环 HTTP 替身验证登录、路由、权限区分、Schema、保存、冲突及未知结果；它不证明实际部署环境可登录、RBAC 已配置或真实业务链路通过。实连验收需用用户提供的环境与账号，记录节点／实例／修订及回读结果，禁止记录凭据。
