"""显式的正式 HTTP 操作目录；字段由当前网关与作者契约核对。"""

from dataclasses import asdict, dataclass
import json
import hashlib
from pathlib import Path
from urllib.parse import quote

from .connection import CLIError
from .contracts import operation_contract


@dataclass(frozen=True)
class Operation:
    method: str
    path: str
    admin: bool = False
    required: tuple = ()
    example: object = None
    query: tuple = ()
    client_only: bool = False


# path 中的字段只能通过路径提供，不能重复放入 query/body。
OPERATIONS = {
    ("runs", "action"): Operation("POST", "/runs/{run_id}/nodes/{instance_id}/actions", required=("name", "payload", "expectedSessionRevision", "candidates")),
    ("runs", "action-result"): Operation("GET", "/runs/{run_id}/nodes/{instance_id}/actions/{event_id}", query=("view",)),
    ("runs", "actions"): Operation("GET", "/runs/{run_id}/nodes/{instance_id}/actions", query=("view", "cursor", "afterSequence", "limit", "name", "actorUserId")),
    ("capabilities", "list"): Operation("GET", "/atomic-capabilities", True, query=("page", "size", "keyword", "category_code", "channel_code", "status")),
    ("capabilities", "get"): Operation("GET", "/atomic-capabilities/{id}", True),
    ("capabilities", "call"): Operation("POST", "/toomcp", required=("jsonrpc", "id", "method", "params"), client_only=True,
        example={"jsonrpc": "2.0", "id": "<本次请求ID>", "method": "tools/call", "params": {"name": "<精确tool_name>", "arguments": {}, "_meta": {"workspace_id": 123}}}),
    ("types", "list"): Operation("GET", "/type-schemas"),
    ("nodes", "list"): Operation("GET", "/nodes", query=("kind", "category")),
    ("nodes", "get"): Operation("GET", "/nodes/{code}"),
    ("nodes", "source"): Operation("GET", "/nodes/{code}/javascript", True),
    ("nodes", "validate"): Operation("POST", "/nodes/javascript/validate", True, ("code", "name", "inputSchema", "outputSchema", "source", "tools", "maxToolCalls", "timeoutSeconds")),
    ("nodes", "create"): Operation("POST", "/nodes/javascript", True, ("code", "name", "inputSchema", "outputSchema", "source", "tools", "maxToolCalls", "timeoutSeconds")),
    ("nodes", "update"): Operation("PUT", "/nodes/{code}/javascript", True, ("name", "inputSchema", "outputSchema", "source", "tools", "maxToolCalls", "timeoutSeconds", "expectedCatalogInstanceId", "expectedCatalogRevision")),
    ("panels", "get"): Operation("GET", "/nodes/{code}/page", True, query=("surface", "revisionId")),
    ("panels", "save"): Operation("PUT", "/nodes/{code}/page", True, ("kind", "surface", "renderMode", "expectedCatalogInstanceId", "expectedCatalogRevision"), {"kind": "save", "surface": "settings", "renderMode": "lit", "expectedCatalogInstanceId": "<读取当前目录身份>", "expectedCatalogRevision": "<读取当前目录修订>"}),
    ("panels", "revisions"): Operation("GET", "/nodes/{code}/page/revisions", True, query=("surface", "offset", "limit")),
    ("panels", "instances"): Operation("GET", "/nodes/{code}/instances", True, query=("surface", "offset", "limit", "search")),
    ("panels", "publish"): Operation("POST", "/nodes/{code}/page/releases", True, ("surface", "scope"), {"surface": "settings", "scope": "selected_instances", "panelRevision": "<已保存的页面修订>", "targets": ["<nodeInstanceId>"]}),
    ("panels", "releases"): Operation("GET", "/nodes/{code}/page/releases", True, query=("surface", "offset", "limit")),
    ("panels", "release"): Operation("GET", "/page-releases/{release_id}", True, query=("state", "offset", "limit")),
    ("workflows", "list"): Operation("GET", "/definitions", query=("scope", "keyword", "type", "businessTag", "page", "pageSize")),
    ("workflows", "get"): Operation("GET", "/definitions/{workflow_id}"),
    ("workflows", "active-run"): Operation("GET", "/definitions/{workflow_id}/active-run"),
    ("workflows", "create"): Operation("POST", "/definitions", required=("name", "official"), example={"name": "<工作流名称>", "official": False}),
    ("workflows", "save"): Operation("PUT", "/definitions/{workflow_id}", required=("expectedRevision", "name", "description", "coverUrl", "graph"), example={"expectedRevision": "<已读取的draftRevision>", "name": "<工作流名称>", "description": "", "coverUrl": "", "graph": {"nodes": [], "edges": [], "globalsJson": {}, "agentSnapshots": {}}}),
    ("workflows", "start"): Operation("POST", "/definitions/{workflow_id}/runs", required=("expectedRevision", "isTestRun", "mode"), example={"expectedRevision": "<已保存的draftRevision>", "isTestRun": False, "mode": "manual"}),
    ("runs", "list"): Operation("GET", "/runs", query=("workflowId", "status", "page", "pageSize")),
    ("runs", "get"): Operation("GET", "/runs/{run_id}"),
    ("runs", "state"): Operation("GET", "/runs/{run_id}/state"),
    ("runs", "activities"): Operation("GET", "/runs/{run_id}/activities", query=("afterSeq", "limit")),
    ("runs", "view"): Operation("GET", "/runs/{run_id}/nodes/{instance_id}/view", query=("page", "pageSize", "view")),
}


def read_object(filename):
    import sys
    try:
        value = json.loads(sys.stdin.read() if filename == "-" else Path(filename).read_text(encoding="utf-8"))
    except (OSError, ValueError, UnicodeError) as exc:
        raise CLIError("invalid_json_file", "无法读取 JSON 对象文件") from exc
    if not isinstance(value, dict):
        raise CLIError("invalid_json_file", "请求体必须是 JSON 对象")
    return value


def validate_context_schemas(body):
    """按页面保存契约校验显式上下文声明，不猜测 Schema 或自动提升为整抽屉模式。"""
    field = "supportedContextSchemas"
    if field not in body:
        if body["surface"] == "business":
            raise CLIError("missing_field", "business Lit 必须显式提供非空 supportedContextSchemas；按目标宿主确认声明，CLI 不自动填充")
        return
    schemas = body[field]
    if not isinstance(schemas, list) or (body["surface"] == "business" and not schemas):
        raise CLIError("invalid_argument", "supportedContextSchemas 必须是数组，business Lit 不能为空")
    seen = set()
    for index, schema in enumerate(schemas):
        valid = isinstance(schema, str) and bool(schema.strip()) and schema == schema.strip() and "\x00" not in schema
        if valid:
            try:
                valid = len(schema.encode("utf-8")) <= 256
            except UnicodeEncodeError:
                valid = False
        if not valid:
            raise CLIError("invalid_argument", f"supportedContextSchemas[{index}] 必须是无首尾空白、不含 NUL、最多 256 个 UTF-8 字节的非空字符串")
        if schema in seen:
            raise CLIError("invalid_argument", "supportedContextSchemas 不能重复")
        seen.add(schema)


def describe(group=None, action=None):
    rows = []
    for (g, a), op in OPERATIONS.items():
        if (group and group != g) or (action and action != a):
            continue
        roles = ["client"] if op.client_only else ["admin"] if op.admin else ["admin", "client"]
        if op.method == "GET":
            effect = "read"
        elif (g, a) == ("nodes", "validate"):
            effect = "validate_without_persistence"
        elif (g, a) in (("workflows", "start"), ("runs", "action"), ("capabilities", "call")):
            effect = "execution_may_incur_cost"
        else:
            effect = "write_requires_user_scope"
        rows.append({"command": f"{g} {a}", **asdict(op), "body_path_fields": path_fields(op.path),
                     "discovery_scope": "offline_operation_catalog", "remote_abi": "not_checked",
                     "http_paths": {role: api_path(op, role, op.path) for role in roles},
                     "effect": effect, "contract": operation_contract(g, a, op)})
    return rows


def path_fields(path):
    import re
    return re.findall(r"\{([a-z_]+)\}", path)


def prepare(op, args):
    body = read_object(args.file) if getattr(args, "file", None) else {}
    if getattr(args, "bundle", None):
        if getattr(args, "file", None):
            raise CLIError("invalid_argument", "bundle 与 file 不能同时使用")
        bundle = read_object(str(Path(args.bundle) / "node.json"))
        fields = ("code", "name", "description", "icon", "category", "inputSchema", "outputSchema", "timeoutSeconds", "source", "tools", "maxToolCalls", "productIdentityMode")
        body = {key: bundle[key] for key in fields if key in bundle}
    for attr, field in (("source_file", "source"), ("view_source", "viewSource"), ("program_source", "programSource")):
        filename = getattr(args, attr, None)
        if filename:
            body[field] = Path(filename).read_text(encoding="utf-8")
    for attr, field in (("expected_catalog_instance_id", "expectedCatalogInstanceId"), ("expected_catalog_revision", "expectedCatalogRevision")):
        if getattr(args, attr, None):
            body[field] = getattr(args, attr)
    path = op.path
    for key in path_fields(path):
        value = getattr(args, key)
        if not value or value in (".", "..") or any(c in value for c in "/\\?#"):
            raise CLIError("invalid_argument", f"{key} 不是有效的路径标识")
        # 与前端 resourcePath 一样消费路径身份，禁止正文覆盖另一资源。
        aliases = {"code": ("code", "nodeCode"), "workflow_id": ("workflowId", "targetId"), "run_id": ("runId", "targetId"), "instance_id": ("nodeInstanceId",), "release_id": ("releaseId",), "event_id": ("eventId",)}
        for field in aliases.get(key, (key,)):
            if field in body:
                if body[field] != value:
                    raise CLIError("identity_mismatch", f"正文 {field} 与路径身份不一致")
                del body[field]
        path = path.replace("{" + key + "}", quote(value, safe=""))
    if "actor" in body:
        raise CLIError("invalid_argument", "actor 由服务端绑定，不能在请求体指定")
    if "productIdentityMode" in body and body["productIdentityMode"] not in ("inherit", "new"):
        raise CLIError("invalid_argument", "productIdentityMode只接受inherit或new；省略表示inherit")
    for field in op.required:
        allow_empty = op.method == "PUT" and op.path == "/definitions/{workflow_id}" and field in ("description", "coverUrl")
        if field not in body or body[field] is None or (body[field] == "" and not allow_empty):
            raise CLIError("missing_field", f"请求体缺少 {field}；运行 describe 查看契约")
    for field in ("expectedRevision", "expectedCatalogRevision"):
        if field in body and (not isinstance(body[field], str) or not body[field].isdecimal() or int(body[field]) < 1):
            raise CLIError("invalid_revision", f"{field} 必须是正整数修订字符串")
    if op.method == "PUT" and op.path == "/definitions/{workflow_id}":
        allowed = {"expectedRevision", "name", "description", "coverUrl", "graph", "definitionUpdates", "businessTag", "pausedRun"}
        if body.keys() - allowed:
            raise CLIError("invalid_argument", "workflows save 只接受完整 SaveWorkflow 正文；不接受旧配置补丁或版本字段")
        if not isinstance(body["graph"], dict) or any(not isinstance(body[field], str) for field in ("name", "description", "coverUrl")):
            raise CLIError("invalid_argument", "保存需要 graph 对象和字符串名称、说明、封面")
    if op.method == "POST" and op.path == "/definitions/{workflow_id}/runs":
        allowed = {"expectedRevision", "isTestRun", "mode", "scope", "initialDeliveries", "reuseOutputs"}
        if body.keys() - allowed:
            raise CLIError("invalid_argument", "workflows start 只接受已保存修订与显式运行参数；不接受 source/version 或临时配置")
        if not isinstance(body["isTestRun"], bool):
            raise CLIError("invalid_argument", "isTestRun 必须显式为布尔值")
    if op.path.endswith("/page") and op.method == "PUT" and body.get("kind") != "save":
        raise CLIError("invalid_argument", "panels save 只接受 kind=save")
    if op.path.endswith("/page") and op.method == "PUT" and body.get("renderMode") == "lowcode":
        if body.get("surface") not in ("settings", "business") or body.get("rendererKey") != "puck":
            raise CLIError("invalid_argument", "Puck 保存需要明确 surface 和 rendererKey=puck")
        if not isinstance(body.get("config"), dict) or not body["config"]:
            raise CLIError("missing_field", "Puck 保存需要完整 config 对象；先运行 panels:prepare")
        if any(field in body for field in ("viewSource", "programSource", "supportedContextSchemas")):
            raise CLIError("invalid_argument", "lowcode 不接受 Lit 源码或上下文声明")
        extensions = body["config"].get("extensions")
        binding = extensions.get("workflow") if isinstance(extensions, dict) else None
        expected_surface = "settings" if body["surface"] == "settings" else "runtime"
        if not isinstance(binding, dict) or binding.get("nodeCode") != args.code or binding.get("surface") != expected_surface:
            raise CLIError("identity_mismatch", "config 工作流身份与节点或面板不一致")
    if op.method == "PUT" and op.path.endswith("/page") and body.get("renderMode") == "lit":
        if body.get("surface") not in ("settings", "business"):
            raise CLIError("invalid_argument", "surface 必须明确为 settings 或 business")
        if not isinstance(body.get("viewSource"), str) or not body["viewSource"].strip():
            raise CLIError("missing_field", "Lit 面板必须提供 viewSource 或 --view-source")
        if body["surface"] == "business" and (not isinstance(body.get("programSource"), str) or not body["programSource"].strip()):
            raise CLIError("missing_field", "business Lit 必须同时提供 programSource 或 --program-source")
        if body["surface"] == "settings" and body.get("programSource"):
            raise CLIError("invalid_argument", "settings 不接受 programSource")
        for field in ("viewCompiled", "compilerVersion"):
            if not isinstance(body.get(field), str) or not body[field].strip():
                raise CLIError("missing_field", f"Lit 保存必须提供 {field}；先运行模板 build/verify/panels:prepare")
        try:
            version_bytes = body["compilerVersion"].encode("utf-8")
        except UnicodeEncodeError as exc:
            raise CLIError("invalid_argument", "compilerVersion 必须是有效 UTF-8") from exc
        if len(version_bytes) > 64:
            raise CLIError("invalid_argument", "compilerVersion 最多 64 个 UTF-8 字节")
        if body["surface"] == "business" and (not isinstance(body.get("programCompiled"), str) or not body["programCompiled"].strip()):
            raise CLIError("missing_field", "business Lit 必须提供 programCompiled；先运行模板 build/verify/panels:prepare")
        if body["surface"] == "settings" and (body.get("programCompiled") or body.get("programHash")):
            raise CLIError("invalid_argument", "settings 不接受页面数据程序产物")
        for compiled_field, hash_field in (("viewCompiled", "viewHash"), ("programCompiled", "programHash")):
            if body.get(compiled_field):
                try:
                    digest = hashlib.sha256(body[compiled_field].encode("utf-8")).hexdigest()
                except UnicodeEncodeError as exc:
                    raise CLIError("invalid_argument", "页面产物必须是有效 UTF-8") from exc
                if body.get(hash_field) != digest:
                    raise CLIError("invalid_argument", f"{hash_field} 与实际产物不一致；请重新构建并生成保存正文")
        validate_context_schemas(body)
    if op.method == "POST" and op.path.endswith("/page/releases"):
        scope = body["scope"]
        if scope not in ("new_only", "all_instances", "selected_instances"):
            raise CLIError("invalid_argument", "无效发布范围")
        targets = body.get("targets", [])
        if scope == "selected_instances" and (not isinstance(targets, list) or not targets or any(not isinstance(t, str) or not t for t in targets)):
            raise CLIError("invalid_argument", "selected_instances 需要显式非空 targets")
        if scope != "selected_instances" and targets:
            raise CLIError("invalid_argument", "当前发布范围不接受 targets")
    query = {}
    for value in getattr(args, "query", []) or []:
        key, sep, content = value.partition("=")
        if not sep or key not in op.query or key in query:
            raise CLIError("invalid_query", "query 字段不支持或重复；运行 describe 查看允许字段")
        query[key] = content
    if getattr(args, "surface", None):
        if "surface" in query:
            raise CLIError("invalid_query", "surface 重复")
        query["surface"] = args.surface
    return path, body if op.method != "GET" else None, query


def api_path(op, role, path):
    if op.client_only and role != "client":
        raise CLIError("client_required", "此操作需要客户端 profile，不能使用管理员身份")
    if op.path == "/toomcp":
        return path
    if op.admin and role != "admin":
        raise CLIError("admin_required", "此操作需要管理员 profile；不能复用客户端身份")
    prefix = "/v1/admin" if op.path.startswith("/atomic-capabilities") else "/v1/admin/workflow" if role == "admin" else "/v1/workflow"
    return prefix + path
