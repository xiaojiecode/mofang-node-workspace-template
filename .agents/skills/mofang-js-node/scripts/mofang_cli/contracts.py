"""节点开发所需的离线事实；不把本地目录声明为远端部署能力。"""

ENVIRONMENTS = {
    "test": "https://dev.api.mofang.com",
    "production": "https://api.mofang.com",
    "preproduction": "https://pre.api.mofang.com",
}

FIELD_HELP = {
    "code": "节点编码；必须等于编译产物 manifest.code，不按目录标题猜编码。",
    "name": "节点名称，最多128字符。",
    "inputSchema": "完整输入 JSON Schema；业务主流 item 由真实到达绑定，必须与 manifest 一致。",
    "outputSchema": "完整输出 JSON Schema；主流 items 使用可信系统类型，必须与 manifest 一致。",
    "source": "dist/<code>/program.js 的完整原文，根接口 mf.node/1；不能提交 tasks 阶段源码。",
    "tools": "许可 tool_name 列表；从原子能力详情精确读取，声明许可不代表已执行或实际有额度。",
    "maxToolCalls": "正整数调用预算；没有外部调用也不能传非法值。",
    "timeoutSeconds": "非负整数；0使用平台默认600秒，不代表无限。",
    "expectedCatalogInstanceId": "最近一次 nodes source / panels get 回读的真实目录身份。",
    "expectedCatalogRevision": "同次回读的正整数修订字符串；冲突时比较差异，不能只替换修订重提。",
    "surface": "settings 或 business，两份页面独立修订、保存和发布。",
    "kind": "面板保存使用 save；不是节点 kind。",
    "renderMode": "本工程 Lit 面板使用 lit。",
    "viewSource": "settings.js 或 business.js 原文，必须与 surface 对应。",
    "programSource": "business 必须提供 pageProgram.js；settings 不接受。",
    "scope": "面板发布 new_only / all_instances / selected_instances，按用户明确授权选择。",
    "targets": "selected_instances 的非空 nodeInstanceId 列表；不能用 nodeCode 替代。",
    "panelRevision": "已保存页面的真实修订；不能用执行 definitionHash 替代。",
    "revision": "当前草稿或运行配置修订，正整数字符串，按目标资源回读。",
    "nodeConfigs": "以 nodeKey 为键的配置补丁；不替换上游主流输入。",
    "resetFields": "以 nodeKey 为键的字段名数组，显式删除已设置值；null不是删除。",
    "graph": "保留全部未修改实例、边、配置、调度和页面引用的实际图。",
    "definitionUpdates": "显式采用：nodeInstanceId、targetCatalogInstanceId、targetDefinitionHash。",
    "source_mode": "启动 source=published 时同时提供 versionId 和 configurationDraftRevision。",
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
                       for name in ("code", "name", "inputSchema", "outputSchema", "source", "tools", "maxToolCalls", "timeoutSeconds", "expectedCatalogInstanceId", "expectedCatalogRevision")})
        conditions += ["校验 source 的 manifest、编码和双 Schema 一致；validate 不落库，不启动 Tool。",
                       "保存目录、实例采用、两份页面发布、新建运行是独立操作。"]
        response = (["valid", "programInterface", "scope", "toolAvailability"] if action == "validate"
                    else ["catalogInstanceId", "catalogRevision", "definitionHash"])
    if group == "nodes" and action == "source":
        response = ["code", "codeRuntime", "editable", "source", "tools", "maxToolCalls", "catalogInstanceId", "catalogRevision", "definitionHash"]
    if group == "capabilities":
        conditions += ["仅查询元数据，不是执行能力。get --tool 按 tool_name 精确匹配后读取详情。",
                       "读取完整 input_schema/output_schema、registered/effective_enabled、async_execution/requires_workflow_context；缺失明确报告，不执行付费调用猜结构。"]
        response = ["tool_name", "input_schema", "output_schema", "input_schema_registered", "output_schema_registered", "effective_enabled", "async_execution", "requires_workflow_context"]
        conditions += ["async_execution是平台工具执行契约；业务响应pending/generation仍须按输出Schema处理，不能据此省略业务轮询。"]
    if group == "panels":
        for name in ("surface", "viewSource", "programSource", "expectedCatalogInstanceId", "expectedCatalogRevision", "scope", "targets", "panelRevision"):
            fields[name] = {"required": name in operation.required, "meaning": FIELD_HELP[name]}
        conditions += ["business Lit 同时提供 viewSource/programSource；settings 禁止 programSource。",
                       "保存一个 surface 后回读新目录修订，再保存另一个；发布后按 releaseId 查询原回执。"]
    if group == "workflows":
        conditions += ["图与配置修改使用真实 draftRevision；定义采用不等于页面发布。",
                       "publish/start 仅按用户明确要求执行；start 会启动节点并可能产生 Tool/模型费用。"]
        if action == "start":
            fields["source"] = {"required": True, "meaning": FIELD_HELP["source_mode"]}
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
