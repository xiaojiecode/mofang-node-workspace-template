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

settings/business 独立读取和保存；正文中的 surface 必须明确。`panels compile` 与 `panels save` 的正文不同：编译不接受 kind、renderMode、目录身份/修订或发布字段。business Lit 两种操作均须提供 programSource 和显式非空 supportedContextSchemas，遗漏上下文声明时远端可能只返回“页面或程序源码编译被拒绝”。先 get 当前目录身份与修订，再通过 describe 了解对应操作正文：

```bash
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin panels get --code <编码> --surface settings
python3 <技能目录>/scripts/mofang_node.py describe panels compile
python3 <技能目录>/scripts/mofang_node.py describe panels save
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin panels compile \
    --file <预览编译正文.json> --view-source <dist/编码/settings.js>
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin panels save \
    --code <编码> --file <面板保存正文.json> --view-source <dist/编码/settings.js>
```

面板保存正文示例（替换读取到的身份与修订）：

```json
{
    "kind": "save",
    "surface": "settings",
    "renderMode": "lit",
    "expectedCatalogInstanceId": "<当前目录身份>",
    "expectedCatalogRevision": "<当前目录修订>"
}
```

business Lit 必须同时提供自身的 viewSource 与非空 programSource，用 `--program-source <dist/编码/pageProgram.js>` 原文填入。settings 不接受 programSource。supportedContextSchemas 按页面实际声明填写，CLI 不默认添加整抽屉能力或改变页面布局。保存后重新 get，下一 surface 使用新读取的修订；禁止把前一个请求的旧修订直接复用。

下面是两份**编译**正文，源码由命令行参数填入。business 示例的 `mf.node-context/1` 来自当前模板的普通宿主验证契约；仍须核对目标宿主，不能将示例当成任意部署或 full-panel 的证明。

```json
{"surface":"settings"}
```

```json
{"surface":"business","supportedContextSchemas":["mf.node-context/1"]}
```

声明必须是数组，business Lit 不能为空；每项是唯一、无首尾空白、不含 NUL、最多 256 个 UTF-8 字节的非空字符串。settings 可以省略或传空数组；如显式提供声明，CLI 同样检查格式，不自动填充或规范化内容。

```bash
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin panels compile \
    --file <business编译正文.json> --view-source <dist/编码/business.js> \
    --program-source <dist/编码/pageProgram.js>
```

编译通过后使用独立的 business **保存**正文：

```json
{
    "kind": "save",
    "surface": "business",
    "renderMode": "lit",
    "supportedContextSchemas": ["mf.node-context/1"],
    "expectedCatalogInstanceId": "<刚读取的目录身份>",
    "expectedCatalogRevision": "<刚读取的目录修订>"
}
```

```bash
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin panels save \
    --code <编码> --file <business保存正文.json> \
    --view-source <dist/编码/business.js> --program-source <dist/编码/pageProgram.js>
```


```bash
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin panels instances --code <编码> --surface business
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin panels publish --code <编码> --file <发布正文.json>
python3 <技能目录>/scripts/mofang_node.py --profile demo-admin panels release --release-id <releaseId>
```

发布正文必须包含 surface、scope；selected_instances 必须给出明确非空 targets，panelRevision 可固定已保存版本。new_only、all_instances 与 selected_instances 是不同授权范围，不能代替用户选择。get/revisions/instances 需显式 `--surface`。目录保存、实例页面发布和执行定义采用分别回读，历史冻结执行不因目录更新而改写。

## 客户端工作流和节点配置

```bash
python3 <技能目录>/scripts/mofang_node.py --profile demo-user workflows list --query scope=mine --query page=1 --query pageSize=20
python3 <技能目录>/scripts/mofang_node.py --profile demo-user workflows get --workflow-id <workflowId>
python3 <技能目录>/scripts/mofang_node.py describe workflows config
python3 <技能目录>/scripts/mofang_node.py --profile demo-user workflows config --workflow-id <workflowId> --file <配置补丁.json>
```

配置正文使用当前 draftRevision，nodeConfigs 按 nodeKey 提供仅需修改的 JSON 对象；resetFields 明确删除显式值，null 是显式 null，不代表恢复默认。例：

```json
{
    "revision": "<当前draftRevision>",
    "nodeConfigs": {"<nodeKey>": {"keyword": "yoga"}},
    "resetFields": {"<nodeKey>": ["可选的恢复默认字段名"]}
}
```

改变图或采用执行定义使用 `workflows graph`，请求为 graph、revision 和可选 definitionUpdates；采用条目包含 nodeInstanceId、targetCatalogInstanceId、targetDefinitionHash。保留其它实例、边、配置、调度和页面引用，不用当前目录覆盖整张旧图。只有用户要求才执行 workflows publish/start；start 明确 source/mode，published 起跑固定 versionId 与 configurationDraftRevision。运行读回用 runs get/state/activities/view；运行参数补丁用 runs config，不能当作当前草稿配置。

身份参数通过命令选项提供；CLI 会消费相同的正文身份，若不一致则拒绝。actor 始终由服务端绑定。不会自动发布版本、采用定义、选择实例、执行上架或迁移数据。

## 失败与验证边界

- HTTP 与业务错误均为非零退出，并保留服务端 errorCode；失败回执不当作成功。
- 修订冲突需要重新读取并比较本地编辑，再决定是否重提；不能仅替换 revision。
- 所有请求均不自动重试；写入断连返回 write_outcome_unknown，先用读取命令核对原目标。start 丢失响应时用 `workflows active-run --workflow-id <ID>` 及 `runs list --query workflowId=<ID>` 找候选运行；面板发布丢失响应时用 `panels releases --code <编码> --surface <位置>` 找发布记录，再逐条核对时间、版本、范围及目标。不能仅凭“最新一条”断言就是本次请求。已取得 runId/releaseId 后只查询原资源，不重新提交。
- 不自动跟随重定向，不把令牌带到另一个地址；环境切换重新显式登录相应 profile。
- 使用真实账号保存/发布必须处于用户授权的环境和目标范围。技能维护本身不授权写业务资源。

本技能的 `tests/test_cli.py` 用回环 HTTP 替身验证登录、路由、权限区分、Schema、保存、冲突及未知结果；它不证明实际部署环境可登录、RBAC 已配置或真实业务链路通过。实连验收需用用户提供的环境与账号，记录节点／实例／修订及回读结果，禁止记录凭据。
