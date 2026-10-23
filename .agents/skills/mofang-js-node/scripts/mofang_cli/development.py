"""离线开发指引与固定只读预检；没有 Tool 执行、目录写入或发布路径。"""

import copy
from urllib.parse import urlsplit

from .connection import CLIError
from .contracts import ENVIRONMENTS
from .operations import OPERATIONS, api_path, describe, prepare


def guide():
    return {
        "scope": "offline_authoring_facts",
        "local_abi": "mf.node/1",
        "remote_abi": "not_checked",
        "abi_fields": {"node.ts.interface": "本地构建分类node或panels，不作为平台请求字段", "program.abi": "mf.node/1", "validate.programInterface": "实际远端校验必须返回mf.node/1"},
        "environments": ENVIRONMENTS,
        "cost_policy": "默认仅读元数据和Schema、运行本地Mock；只有用户明确要求才执行Tool或启动可能计费的工作流。",
        "commands": {"offline": "npm run platform -- guide", "operation_details": "npm run platform -- describe nodes validate", "doctor": "npm run platform -- --profile <环境-admin> doctor --bundle dist/<编码>", "metadata": "npm run platform -- --profile <环境-admin> capabilities get --tool <精确tool_name>", "local_checks": "npm run check", "argument_order": "--profile/--state-dir/--timeout均在命令组之前"},
        "fixture_globals": {"program": "编译后的mf.node/1模块", "input": "当前节点fixtures/input.json", "fixtureHarness": "本地Mock事件/计划与状态验证助手，不模拟平台账本", "fixtureAssert": "断言失败抛错；不得删断言让测试通过"},
        "authentication": {"admin": "POST /v1/admin/login，管理员密码；只在私有会话保存access_token",
                           "client": "POST /v1/user/login/code，客户端验证码；需要2FA时POST /v1/user/login/2fa",
                           "profiles": "每个环境的admin/client分别使用profile；环境域名不证明远端ABI版本。"},
        "files": {"nodes/<code>/node.ts": "目录元数据、双Schema、许可工具和预算",
                  "nodes/<code>/contract.ts": "配置/状态/动作/投影类型与冻结Schema",
                  "nodes/<code>/run.ts": "defineNode静态声明与函数绑定",
                  "nodes/<code>/tasks/": "StageProgram子任务；每阶段最多一次真实能力调用",
                  "nodes/<code>/settings.ts": "宿主受控草稿，不另建保存接口",
                  "nodes/<code>/view.ts": "Lit面板，只读composition就绪投影，参数动作等待具体outcome",
                  "nodes/<code>/page.ts": "可选本节点页面准备入口；缺省要求真实item，源节点可声明空prepared输入而不伪造商品",
                  "nodes/<code>/fixtures/": "普通JS脚本最后表达式，不写顶层return；明确Mock范围",
                  "lib/author/": "@mofang/node实际作者API及类型",
                  "lib/contracts/": "系统可信业务类型、浏览器SDK和Goja契约",
                  "shared/": "用户业务公共代码，不受upstream覆盖"},
        "authoring_rules": [
            "defineNode(spec, Component)，具名state槽与冻结Schema；函数体只绑定，不能启动业务。",
            "状态快照只读；setter不改变当前闭包，累加用updater，状态与命令耦合用一次reducer transition。",
            "Component/guard/Project/updater/reducer不执行Tool；真正外部调用只在子任务stage的ctx.call。",
            "完整读取Tool双Schema、异步状态/代次、错误与结果字段，再映射完整Product；扩展属性用unknown并收窄。",
            "finish是事件计划末尾生产声明；输入、任务、事件、候选、unknown和控制义务未结清时节点不会成功。",
            "零结果、不选择、失败都要有实际入口；无参数必要动作由宿主提供，full-panel也保留。",
            "unknown不自动重发；普通业务失败不静默重试，不恢复业务去重、步骤回用或副作用回放。",
            "业务投影只取composition.projection.status=ready的nodeView，失败显示平台退路，不回退旧nodeView。",
            "动作accepted不是applied，更不是节点成功；按eventId读取getActionResult/watchActionResult。",
        ],
        "author_api": {
            "defineNode(spec, Component)": "spec包含abi/code/inputSchema/outputSchema/state/tasks/actions；Component同步绑定且不返回业务结果。",
            "defineStateSlot({key, schema, initial})": "定义稳定状态槽；key唯一，初始值可序列化并符合冻结Schema。",
            "useNodeState(slot)": "返回[snapshot, setter]；setter接受新值或纯pending updater。",
            "useNodeReducer(slot, reducer)": "返回[snapshot, dispatch]；reducer一次给出state/commands/production或结构化reject。",
            "useNodeConfig<C>() / useNodeFacts()": "取得只读配置和真实运行事实；配置不是主流输入，不能改facts。",
            "useTask(definition)": "返回spawn(input,{inputRefs})与onResult；definition必须来自静态spec.tasks。",
            "useOutputs<O>()": "append/update/remove候选计划；保留inputRefs及候选expectedRevision。",
            "useProduction()": "读取declared；finish()暂存事件末尾的生产结束声明。",
            "useNodeAction(spec,{guard,handler})": "动作静态声明与绑定一致；guard禁用时返回明确reason。",
            "useOnStart / useOnInput / useOnInputClosed / useOnTaskResult": "注册并逐个等待本次事件handler；任务优先用对应useTask.onResult。",
            "useOnControl / useOnError": "只读通知，不能派发状态或命令。",
            "nodeView(() => view)": "恰好一个纯投影getter；Project失败不撤销已提交业务计划。",
        },
        "required_evidence": ["目标环境/profile/角色与用户授权范围", "节点code、目录身份/修订或明确新建",
                              "输入/输出可信类型与辅助字段、Tool双Schema及缺口", "触发条件、等待与结束条件、候选来源/修订",
                              "两份面板surface、必要动作、空结果/失败/unknown分支", "预算/超时、真实与Mock出口",
                              "现有业务保留范围、发布/采用/运行分别授权"],
        "workflow": ["guide（离线）", "按用户已指定环境选择独立profile", "读取types与所选Tool元数据，不执行Tool",
                     "编写契约、run/tasks、双面板和Mock fixtures", "npm run check",
                     "doctor --bundle dist/<code>（只读+不落库validate）",
                     "用户要求后才保存目录、逐surface发布、显式采用；真实起跑可能产生费用"],
        "interfaces": describe(),
        "references": ["references/node-development.md", "references/platform-cli.md", "references/react-authoring.md"],
        "prohibited_inferences": ["describe是本地目录，不证明远端支持ABI", "不存在通用/nodes/javascript/abi或/workflow/abi探测约定",
                                  "403是权限/会话问题，不证明ABI不支持", "本地dev分支、远端dev分支、实际部署是三份事实"],
    }


def doctor(client, session, args, capability_loader):
    checks = []
    abi = {"status": "not_checked", "reason": "提供--bundle后才通过真实validate核对ABI"}

    def record(name, callback):
        try:
            value = callback()
            checks.append({"name": name, "status": "passed", "data": value})
            return value
        except CLIError as exc:
            checks.append({"name": name, "status": "failed", "error": exc.json()["error"]})
            return None

    def capability(tool):
        value = capability_loader(client, tool)
        if not isinstance(value, dict) or any(not isinstance(value.get(name), dict) for name in ("input_schema", "output_schema")):
            raise CLIError("capability_schema_missing", "能力缺少完整输入/输出Schema，不能执行付费请求猜测响应")
        flags = ("input_schema_registered", "output_schema_registered", "effective_enabled", "async_execution", "requires_workflow_context")
        missing = [key for key in flags if not isinstance(value.get(key), bool)]
        if missing:
            raise CLIError("capability_metadata_missing", "能力必要标记缺失或非布尔值：" + ", ".join(missing) + "；不能按字段缺失推断同步、启用或已注册")
        if value.get("effective_enabled") is False:
            raise CLIError("capability_disabled", "所选能力当前禁用；未执行能力")
        if value.get("input_schema_registered") is False or value.get("output_schema_registered") is False:
            raise CLIError("capability_schema_unregistered", "能力Schema尚未注册，不能用样例替代正式契约")
        public = ("id", "name", "desc", "purpose", "description", "tool_name", "input_schema", "output_schema", "input_schema_registered", "output_schema_registered", "input_schema_hash", "output_schema_hash", "effective_enabled", "async_execution", "requires_workflow_context")
        return {key: value[key] for key in public if key in value}

    def collection(op):
        value = client.call("GET", api_path(op, session["role"], op.path))
        if not isinstance(value, dict) or not isinstance(value.get("items"), list):
            raise CLIError("invalid_response", "目录响应缺少items数组，不能把无关JSON当作预检成功")
        return value

    observed = {}
    for group, action in [("types", "list"), ("nodes", "list")]:
        op = OPERATIONS[(group, action)]
        observed[group] = record(group, lambda op=op: collection(op))

    if args.bundle:
        if session["role"] != "admin":
            checks.append({"name": "abi", "status": "failed", "error": {"code": "admin_required", "message": "bundle校验需要同环境管理员profile，未提交任何写入"}})
        else:
            op = OPERATIONS[("nodes", "validate")]
            validation_args = copy.copy(args)
            validation_args.file = None
            path, body, query = prepare(op, validation_args)
            nodes = observed.get("nodes")
            existing = next((item for item in nodes.get("items", []) if isinstance(item, dict) and item.get("code") == body["code"]), None) if isinstance(nodes, dict) else None
            if existing and (existing.get("codeRuntime") == "go" or existing.get("editable") is False):
                checks.append({"name": "catalog_editability", "status": "failed", "error": {"code": "catalog_not_editable", "message": "目录由Go注册或标记只读，不能用JS覆盖"}})
            elif existing:
                source_op = OPERATIONS[("nodes", "source")]
                source_args = copy.copy(args)
                source_args.code = body["code"]
                source_path, _, _ = prepare(source_op, source_args)
                current = record("catalog_source", lambda: client.call("GET", api_path(source_op, "admin", source_path)))
                if isinstance(current, dict) and current.get("editable") is not True:
                    checks.append({"name": "catalog_editability", "status": "failed", "error": {"code": "catalog_not_editable", "message": "现有目录不允许JS编辑；不能覆盖Go注册定义或猜测可写性"}})
            for tool in body.get("tools", []):
                record("capability:" + tool, lambda tool=tool: capability(tool))
            validation = record("validate", lambda: client.call("POST", api_path(op, "admin", path), body, query))
            if isinstance(validation, dict) and validation.get("valid") is True and validation.get("programInterface") == "mf.node/1":
                abi = {"status": "supported", "evidence": validation}
            elif validation is not None:
                abi = {"status": "unsupported_or_invalid", "evidence": validation}
                checks.append({"name": "abi", "status": "failed", "error": {"code": "abi_not_verified", "message": "实际validate没有确认mf.node/1，禁止降级根程序或猜测专用端点"}})
            else:
                abi = {"status": "not_verified", "reason": "见validate失败；权限/连接失败不能等同ABI不支持"}

    failed = any(item["status"] == "failed" for item in checks)
    ready = not failed and abi["status"] == "supported"
    return {"status": "blocked" if failed else "ready" if ready else "discovered",
            "ready_for_catalog_save": ready, "remote_abi": abi,
            "target": {"base_url": session["base_url"], "role": session["role"],
                       "environment": next((name for name, url in ENVIRONMENTS.items() if urlsplit(url).hostname == urlsplit(session["base_url"]).hostname), "custom")},
            "checks": checks, "tool_execution_count": 0,
            "readiness_scope": "static_contract_and_metadata",
            "permissions": {"catalog_write": "not_checked", "tool_execution": "not_checked"},
            "limits": "仅确认读取与静态ABI契约；未保存、发布、起跑，未验证目录写权限、Tool权限/余额或真实业务成功"}
