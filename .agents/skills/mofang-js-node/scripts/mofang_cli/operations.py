"""显式的正式 HTTP 操作目录；字段由当前网关与作者契约核对。"""

from dataclasses import asdict, dataclass
import json
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
    ("panels", "compile"): Operation("POST", "/nodes/page/compile", True, ("surface", "viewSource")),
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
    ("workflows", "graph"): Operation("PUT", "/definitions/{workflow_id}/graph", required=("graph", "revision")),
    ("workflows", "config"): Operation("PATCH", "/definitions/{workflow_id}/config", required=("revision",), example={"revision": "<draftRevision>", "nodeConfigs": {"<nodeKey>": {"keyword": "<值>"}}, "resetFields": {}}),
    ("workflows", "publish"): Operation("POST", "/definitions/{workflow_id}/versions", required=("revision",), example={"revision": "<draftRevision>"}),
    ("workflows", "start"): Operation("POST", "/definitions/{workflow_id}/runs", required=("source", "mode"), example={"source": "published", "mode": "manual", "versionId": "<versionId>", "configurationDraftRevision": "<draftRevision>"}),
    ("runs", "list"): Operation("GET", "/runs", query=("workflowId", "status", "page", "pageSize")),
    ("runs", "get"): Operation("GET", "/runs/{run_id}"),
    ("runs", "state"): Operation("GET", "/runs/{run_id}/state"),
    ("runs", "activities"): Operation("GET", "/runs/{run_id}/activities", query=("afterSeq", "limit")),
    ("runs", "config"): Operation("PATCH", "/runs/{run_id}/config", required=("revision",)),
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


def describe(group=None, action=None):
    rows = []
    for (g, a), op in OPERATIONS.items():
        if (group and group != g) or (action and action != a):
            continue
        roles = ["client"] if op.client_only else ["admin"] if op.admin else ["admin", "client"]
        if op.method == "GET":
            effect = "read"
        elif (g, a) in (("nodes", "validate"), ("panels", "compile")):
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
        fields = ("code", "name", "description", "icon", "category", "inputSchema", "outputSchema", "timeoutSeconds", "source", "tools", "maxToolCalls")
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
    for field in op.required:
        if field not in body or body[field] is None or body[field] == "":
            raise CLIError("missing_field", f"请求体缺少 {field}；运行 describe 查看契约")
    for field in ("revision", "expectedCatalogRevision", "configurationDraftRevision"):
        if field in body and (not isinstance(body[field], str) or not body[field].isdecimal() or int(body[field]) < 1):
            raise CLIError("invalid_revision", f"{field} 必须是正整数修订字符串")
    if op.path.endswith("/page") and op.method == "PUT" and body.get("kind") != "save":
        raise CLIError("invalid_argument", "panels save 只接受 kind=save")
    if (op.path == "/nodes/page/compile" or (op.method == "PUT" and op.path.endswith("/page") and body.get("renderMode") == "lit")):
        if body.get("surface") not in ("settings", "business"):
            raise CLIError("invalid_argument", "surface 必须明确为 settings 或 business")
        if not isinstance(body.get("viewSource"), str) or not body["viewSource"].strip():
            raise CLIError("missing_field", "Lit 面板必须提供 viewSource 或 --view-source")
        if body["surface"] == "business" and (not isinstance(body.get("programSource"), str) or not body["programSource"].strip()):
            raise CLIError("missing_field", "business Lit 必须同时提供 programSource 或 --program-source")
        if body["surface"] == "settings" and body.get("programSource"):
            raise CLIError("invalid_argument", "settings 不接受 programSource")
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
