"""节点开发所需的离线事实；不把本地目录声明为远端部署能力。"""

import json
from pathlib import Path

# 字段清单随平台契约同步生成，workflowId 由路径身份消费。
START_WORKFLOW_RUN_FIELDS = tuple(json.loads((Path(__file__).parent / "start-workflow-run-fields.json").read_text(encoding="utf-8")))

ENVIRONMENTS = {
    "test": "https://dev.api.mofang.com",
    "production": "https://api.mofang.com",
    "preproduction": "https://pre.api.mofang.com",
}

FIELD_HELP = {
    "sourceRunId": "可选的真实来源运行身份，用于本次起跑的历史输出引用。",
    "planId": "可选的真实任务计划 ID，使用正整数十进制字符串。",
    "viewCompiled": "模板本地构建的最终 CommonJS 展示产物，原样上传。",
    "viewHash": "展示产物原字节的 SHA-256。",
    "programCompiled": "模板本地构建的最终页面数据程序，仅 business Lit 需要。",
    "programHash": "页面数据程序产物原字节的 SHA-256。",
    "compilerVersion": "构建工具标识，最多64个UTF-8字节；不作为服务端信任证明。",
    "code": "节点编码；必须等于编译产物 manifest.code，不按目录标题猜编码。",
    "name": "节点名称，最多128字符。",
    "inputSchema": "完整输入 JSON Schema；业务主流 item 由真实到达绑定，必须与 manifest 一致。",
    "outputSchema": "完整输出 JSON Schema；主流 items 使用可信系统类型，必须与 manifest 一致。",
    "source": "dist/<code>/program.js 的完整原文，根接口 mf.node/1；不能提交 tasks 阶段源码。",
    "tools": "许可 tool_name 列表；从原子能力详情精确读取，声明许可不代表已执行或实际有额度。",
    "maxToolCalls": "每次子任务跨全部阶段累计的正整数工具预算；仅 publish_message/ctx.message 免计（须核对目标平台支持），其它内置工具仍计数；按分支、循环/轮询上限核算，没有调用也不能传非法值。",
    "timeoutSeconds": "非负整数；0使用平台默认600秒，不代表无限。",
    "productIdentityMode": "可选目录字段inherit/new；省略按inherit处理且保留缺席，不进入mf.node/1运行模块manifest或命令。",
    "expectedCatalogInstanceId": "最近一次 nodes source / panels get 回读的真实目录身份。",
    "expectedCatalogRevision": "同次回读的正整数修订字符串；冲突时比较差异，不能只替换修订重提。",
    "surface": "settings 或 business，两份页面独立修订、保存和发布。",
    "kind": "面板保存使用 save；不是节点 kind。",
    "renderMode": "Lit 面板使用 lit；Puck 页面原生使用 lowcode。",
    "rendererKey": "renderMode=lowcode 时使用 puck，与构建产物一致。",
    "config": "renderMode=lowcode 时提交经共享校验的完整 PagePackage JSON 对象，不提交 JS 字符串。",
    "viewSource": "settings.js 或 business.js 原文，必须与 surface 对应。",
    "programSource": "仅 business Lit 必须提供 pageProgram.js；settings 和 lowcode 不接受。",
    "supportedContextSchemas": "business Lit 编译与保存必须显式提供非空数组，元素为唯一、无首尾空白、最多256个UTF-8字节的非空字符串；按真实宿主契约声明，不自动补默认值或整抽屉标记。",
    "scope": "面板发布 new_only / all_instances / selected_instances，按用户明确授权选择。",
    "targets": "selected_instances 的非空 nodeInstanceId 列表；不能用 nodeCode 替代。",
    "panelRevision": "已保存页面的真实修订；不能用执行 definitionHash 替代。",
    "expectedRevision": "用户已读取并选中的当前工作流 draftRevision，正整数字符串；冲突不补读替换 CAS。",
    "description": "完整工作流说明字符串，允许为空。",
    "coverUrl": "完整工作流封面地址字符串，允许为空。",
    "graph": "保留全部未修改实例、边、配置、调度和页面引用的实际图。",
    "definitionUpdates": "显式采用：nodeInstanceId、targetCatalogInstanceId、targetDefinitionHash。",
    "pausedRun": "真实 saveContext 原样提交 runId、expectedRunRevision、expectedPauseRequestId；不得猜测暂停窗口。",
    "businessTag": "后台官方工作流可选业务分类，仍由服务端校验权限。",
    "isTestRun": "显式布尔值；true 为试运行，false 为正式运行，不从 source 或历史版本推断。",
    "initialDeliveries": "可选初始投递，遵循当前冻结输入合同，不是临时 Globals 或节点配置。",
    "reuseOutputs": "可选显式历史输出引用，按真实运行和节点身份校验。",
    "mode": "启动模式 manual / auto；会影响候选审核和后继执行。",
    "expectedSessionRevision": "从当前 node view 读取的会话修订；不能使用 catalogRevision。",
    "candidates": "当前动作涉及的真实 id/expectedRevision 引用；无候选动作传空数组。",
    "payload": "符合当前动作 payloadSchema 的对象；动作名称和可用性来自就绪投影。",
    "official": "是否为官方工作流，按实际身份权限和用户目标填写布尔值。",
}


def operation_contract(group, action, operation):
    fields = {name: {"required": name in operation.required, "meaning": FIELD_HELP.get(name, "由实际目标契约提供；不得根据名称编造业务字段。")}
              for name in operation.required}
    response = []
    conditions = []
    if group == "nodes" and action in ("validate", "create", "update"):
        fields.update({name: {"required": name in operation.required, "meaning": FIELD_HELP[name]}
                       for name in ("code", "name", "inputSchema", "outputSchema", "source", "tools", "maxToolCalls", "timeoutSeconds", "productIdentityMode", "expectedCatalogInstanceId", "expectedCatalogRevision")})
        conditions += ["校验 source 的 manifest、编码和双 Schema 一致；validate 不落库，不启动 Tool。",
                       "保存目录、实例采用、两份页面发布、新建运行是独立操作。"]
        response = (["valid", "programInterface", "scope", "toolAvailability"] if action == "validate"
                    else ["catalogInstanceId", "catalogRevision", "definitionHash"])
    if group == "nodes" and action == "source":
        response = ["code", "codeRuntime", "editable", "source", "tools", "maxToolCalls", "catalogInstanceId", "catalogRevision", "definitionHash"]
    if group == "capabilities" and action == "call":
        for name, meaning in {"jsonrpc": "CLI 固定生成 2.0。", "id": "CLI 为本次调用生成的 UUID；仅作请求关联，不是重试幂等键。",
                              "method": "CLI 固定生成 tools/call。", "params": "name 来自 --tool，arguments 来自 --file（省略为 {}），_meta.workspace_id 来自 --workspace-id。"}.items():
            fields[name] = {"required": True, "meaning": meaning}
        conditions += ["仅用户明确授权实际调用时执行；只接受客户端 profile 和客户端 access token，禁止管理员 execute 入口或按管理员 ID 推导客户端身份。",
                       "CLI 必填 --tool 与 --workspace-id；--file 只提供 arguments 对象，省略为 {}，不能提供整份 JSON-RPC 请求或覆盖调用身份。",
                       "CLI 生成 jsonrpc/id/method/params，将工作区放在 params._meta.workspace_id；用户身份和工作区成员权限由服务端校验。",
                       "无自动重试、轮询或管理员回退；断连保留 request_id，结果未知时先核对。工作流专属能力仍通过真实节点 ctx.call 执行。",
                       "保留完整 MCP result；CLI 成功只表示协议调用没有报错，pending、失败项及最终业务状态仍须按能力输出 Schema 检查。"]
        response = ["tool_name", "workspace_id", "request_id", "result.content", "result.isError", "result.structuredContent"]
    elif group == "capabilities":
        conditions += ["仅查询元数据，不是执行能力。get --tool 按 tool_name 精确匹配后读取详情。",
                       "读取完整 input_schema/output_schema、registered/effective_enabled、async_execution/requires_workflow_context；缺失明确报告，不执行付费调用猜结构。"]
        response = ["tool_name", "input_schema", "output_schema", "input_schema_registered", "output_schema_registered", "effective_enabled", "async_execution", "requires_workflow_context"]
        conditions += ["async_execution是平台工具执行契约；业务响应pending/generation仍须按输出Schema处理，不能据此省略业务轮询。"]
    if group == "panels":
        panel_fields = {
            "save": ("kind", "surface", "renderMode", "rendererKey", "config", "viewSource", "viewCompiled", "viewHash", "programSource", "programCompiled", "programHash", "compilerVersion", "supportedContextSchemas", "expectedCatalogInstanceId", "expectedCatalogRevision"),
            "publish": ("surface", "scope", "targets", "panelRevision"),
        }
        for name in panel_fields.get(action, ()):
            fields[name] = {"required": name in operation.required, "meaning": FIELD_HELP[name]}
        if action == "save":
            condition = "surface=business 且 renderMode=lit"
            fields["programSource"]["required_when"] = condition
            fields["supportedContextSchemas"]["required_when"] = condition
            conditions += ["business Lit 同时提供 viewSource/programSource 和显式非空 supportedContextSchemas；settings 禁止 programSource。",
                           "上下文声明不自动填充；字符串不能重复、含NUL或首尾空白，每项最多256个UTF-8字节。"]
        if action == "save":
            fields["rendererKey"]["required_when"] = "renderMode=lowcode"
            fields["config"]["required_when"] = "renderMode=lowcode"
            conditions += ["Puck 使用 lowcode/rendererKey=puck/config，先用本地 build/verify/panels:prepare 校验并组装；不调用后端编译、不附带 viewSource/programSource。"]
            conditions += ["Lit 只接本地 build/verify/panels:prepare 的最终产物与摘要，后端不编译或静态分析。"]
            conditions += ["保存一个 surface 后回读新目录修订，再保存另一个；不复用旧修订。"]
        if action == "publish":
            conditions += ["发布只使用已保存 panelRevision、显式scope/targets；按releaseId查询原回执。"]
    if group == "workflows":
        conditions += ["名称、说明、封面与完整图经一次 workflows save 提交；不再提供逐块配置、图、运行配置写入或工作流发布。节点页面包发布仍独立保留。",
                       "start 仅按用户明确要求执行，会启动节点并可能产生 Tool/模型费用。"]
        if action == "save":
            for name in ("definitionUpdates", "pausedRun", "businessTag"):
                fields[name] = {"required": False, "meaning": FIELD_HELP[name]}
            fields["name"]["meaning"] = "完整工作流名称字符串。"
            conditions += ["先读完整快照，保留其它实例、配置、身份、冻结引用和外观；删除配置字段使用完整图中省略该键，null 仍是显式值。",
                           "成功核对 receipt 与 snapshot，后续 Start 使用保存回执 draftRevision；失败、冲突、未知不自动重发，也不只替换修订号。",
                           "暂停普通配置与外观修改提交真实 pausedRun；未关闭运行含暂停仍锁定拓扑、绑定与策略。"]
            response = ["receipt.status", "receipt.resourceId", "receipt.resourceRevision", "snapshot.summary", "snapshot.draftGraph", "snapshot.draftRevision", "snapshot.saveContext", "pausedRun"]
        if action == "start":
            for name in START_WORKFLOW_RUN_FIELDS:
                if name not in fields:
                    fields[name] = {"required": False, "meaning": FIELD_HELP.get(name, "字段语义遵循冻结的 StartWorkflowRunBody 契约。")}
            conditions += ["先手动完整保存，再以同次回执 expectedRevision 和明确 isTestRun 起跑；不隐式保存、不传 source/versionId 或临时 Globals/节点配置。"]
            response = ["run.id", "run.source", "run.majorRevision", "run.isTestRun"]
    if group == "runs" and action in ("action", "action-result", "actions"):
        if action == "action":
            fields["name"] = {"required": True, "meaning": "就绪投影actions中的精确动作name，不是节点名称或按钮文案。"}
        conditions += ["action 受理后按 eventId 查询 outcome；accepted/applied/节点成功是不同状态。",
                       "写请求未知结果只查询原事件，不自动重发；actor由服务端绑定。"]
        response = {"action": ["receipt.eventId", "receipt.sequence", "receipt.status"],
                    "action-result": ["result.eventId", "result.status", "result.processedRevision", "result.taskIds", "result.candidateIds", "result.error"],
                    "actions": ["items[]", "snapshotUpperSequence", "nextCursor", "hasMore"]}[action]
        conditions += ["原始HTTP/CLI返回receipt或result包装；宿主SDK返回已解包回执。applied/rejected/failed/cancelled为动作终态。"]
    return {"body_fields": fields, "conditions": conditions, "response_fields_to_inspect": response}
