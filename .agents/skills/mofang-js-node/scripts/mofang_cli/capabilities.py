"""使用客户端会话试调用原子能力；工作区明确指定，用户身份由服务端认证。"""

import base64
import json
import uuid

from .connection import CLIError
from .operations import read_object


def require_client_session(session):
    """拒绝管理员 profile 及误标为客户端的管理员/刷新令牌。"""
    if session["role"] != "client":
        raise CLIError("client_required", "原子能力调用必须使用客户端 profile，不能使用管理员身份")
    try:
        parts = session["access_token"].split(".")
        if len(parts) != 3:
            raise ValueError("not JWT")
        payload = parts[1]
        claims = json.loads(base64.urlsafe_b64decode(payload + "=" * (-len(payload) % 4)))
        valid = isinstance(claims, dict) and claims.get("sub") == "access"
    except (ValueError, UnicodeError):
        valid = False
    if not valid:
        raise CLIError("client_access_token_required", "需要客户端 access token；请通过客户端登录或导入客户端会话")
    # 这里只拦截明显错用的令牌类型；签名、有效期和业务权限仍由服务端验证。


def call_capability(client, session, args):
    """发送一次 tools/call，保留完整 MCP 结果及关联 ID，不自动重试或轮询。"""
    require_client_session(session)
    tool = args.tool.strip()
    if not tool or any(char.isspace() for char in tool):
        raise CLIError("invalid_argument", "tool 必须是精确且非空的 tool_name")
    if (not 1 <= len(args.workspace_id) <= 19 or not args.workspace_id.isascii()
            or not args.workspace_id.isdecimal() or not 0 < int(args.workspace_id) <= 9223372036854775807):
        raise CLIError("invalid_argument", "workspace-id 必须是正整数 int64")
    workspace_id = int(args.workspace_id)
    arguments = read_object(args.file) if args.file else {}
    request_id = str(uuid.uuid4())
    context = {"tool_name": tool, "workspace_id": workspace_id, "request_id": request_id}
    body = {"jsonrpc": "2.0", "id": request_id, "method": "tools/call", "params": {
        "name": tool, "arguments": arguments, "_meta": {"workspace_id": workspace_id},
    }}
    try:
        result = client.call("POST", "/toomcp", body, jsonrpc=True)
        if "isError" in result and not isinstance(result["isError"], bool):
            raise CLIError("invalid_response", "MCP isError 必须是布尔值；不要自动重发")
        if not isinstance(result.get("content"), list):
            raise CLIError("invalid_response", "MCP 结果缺少 content 数组；不要自动重发")
        if result.get("isError"):
            raise CLIError("tool_execution_failed", "原子能力返回错误，见完整 MCP 回执", details={"result": result})
    except KeyboardInterrupt as exc:
        raise CLIError("interrupted", "调用被中断，执行结果未知；请用 request_id 核对原请求，不要自动重发", details=context, exit_code=130) from exc
    except CLIError as exc:
        exc.details = {**context, **(exc.details or {})}
        raise
    return {**context, "result": result}
