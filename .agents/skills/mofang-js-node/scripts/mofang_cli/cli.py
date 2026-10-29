"""命令解析与工作流操作；登录敏感值从终端或 stdin 接收。"""

import argparse
import getpass
import json
import math
import os
from pathlib import Path
import sys

from .connection import CLIError, HTTPClient, Sessions, base_url
from .operations import OPERATIONS, api_path, describe, path_fields, prepare
from .development import doctor, guide
from .capabilities import call_capability


def secret(args, prompt):
    if args.secret_stdin:
        value = sys.stdin.read().rstrip("\r\n")
    elif sys.stdin.isatty():
        value = getpass.getpass(prompt)
    else:
        raise CLIError("secret_required", "非交互调用必须使用 --secret-stdin；不要将密码或令牌放在命令参数中")
    if not value:
        raise CLIError("secret_required", "登录凭据不能为空")
    return value


def login_result(sessions, url, role, value):
    if not isinstance(value, dict):
        raise CLIError("invalid_login", "登录响应不是对象")
    if value.get("mfa_required"):
        challenge = value.get("mfa_challenge_id", "")
        raise CLIError("mfa_required", f"需要二次验证；使用 auth verify --challenge-id {challenge} 完成登录；会话尚未保存")
    return sessions.save(url, role, value)


def auth(args, sessions):
    if args.action == "status":
        return sessions.public(sessions.load(check_expiry=False))
    if args.action == "logout":
        return sessions.forget()
    if args.action == "refresh":
        previous = sessions.load(check_expiry=False)
        if previous["role"] != "client" or not previous.get("refresh_token"):
            raise CLIError("login_required", "此会话不支持刷新；请重新登录")
        value = HTTPClient(previous["base_url"], timeout=args.timeout).call(
            "POST", "/v1/user/refresh-token", {"refresh_token": previous["refresh_token"]})
        return login_result(sessions, previous["base_url"], "client", value)
    url = base_url(args.base_url)
    if args.action == "import":
        return sessions.save(url, args.role, {"access_token": secret(args, "Access token: ")})
    if args.action == "verify":
        value = HTTPClient(url, timeout=args.timeout).call("POST", "/v1/user/login/2fa", {
            "challenge_id": args.challenge_id, "code": secret(args, "二次验证码: ")})
        return login_result(sessions, url, "client", value)
    role = args.role
    payload = {"phone": args.phone}
    if role == "admin":
        payload["password"] = secret(args, "管理员密码: ")
        path = "/v1/admin/login"
    else:
        payload.update(code=secret(args, "客户端登录验证码: "), platform="node-cli")
        path = "/v1/user/login/code"
    value = HTTPClient(url, timeout=args.timeout).call("POST", path, payload, bare=role == "admin")
    return login_result(sessions, url, role, value)


def capability_by_name(client, tool):
    page = 1
    while True:
        # keyword只覆盖显示信息，不能证明精确tool_name不存在；按正式分页目录匹配身份。
        value = client.call("GET", "/v1/admin/atomic-capabilities", query={"page": page, "size": 100})
        if not isinstance(value, dict) or not isinstance(value.get("list"), list) or not isinstance(value.get("total"), int):
            raise CLIError("invalid_response", "原子能力列表结构不完整")
        for item in value["list"]:
            if item.get("tool_name") == tool:
                identity = item.get("id")
                if not isinstance(identity, int) or identity < 1:
                    raise CLIError("invalid_response", "原子能力缺少有效 ID")
                return client.call("GET", f"/v1/admin/atomic-capabilities/{identity}")
        if not value["list"] or page * 100 >= value["total"]:
            raise CLIError("capability_not_found", "当前目录中未找到该 tool_name")
        page += 1


def run(args):
    if args.group == "guide":
        return guide()
    if args.group == "describe":
        rows = describe(args.resource, args.operation)
        if not rows:
            raise CLIError("unknown_operation", "未找到该命令")
        return rows
    sessions = Sessions(args.state_dir, args.profile)
    if args.group == "auth":
        return auth(args, sessions)
    if args.group == "doctor":
        session = sessions.load()
        client = HTTPClient(session["base_url"], session["access_token"], args.timeout)
        return doctor(client, session, args, capability_by_name)
    op = OPERATIONS[(args.group, args.action)]
    session = sessions.load()
    # 权限先于请求；后台作者与客户端所有者始终使用各自的正式入口。
    api_path(op, session["role"], op.path)
    client = HTTPClient(session["base_url"], session["access_token"], args.timeout)
    if args.group == "capabilities" and args.action == "call":
        return call_capability(client, session, args)
    if args.group == "capabilities" and args.action == "get" and args.tool:
        return capability_by_name(client, args.tool)
    path, body, query = prepare(op, args)
    result = client.call(op.method, api_path(op, session["role"], path), body, query)
    receipt = result.get("receipt") if isinstance(result, dict) else None
    if op.method != "GET" and isinstance(receipt, dict) and receipt.get("status") == "failed":
        raise CLIError(str(receipt.get("errorCode") or "mutation_failed"), str(receipt.get("errorMessage") or "写入回执失败"))
    return result


def parser():
    cli = argparse.ArgumentParser(description="魔方节点 CLI：通过正式 HTTP 接口及客户端 MCP HTTP 入口操作，无需安装 MCP 或服务端源码。全局参数放在命令组之前。")
    cli.add_argument("--profile", default="default", help="会话名，后台与客户端分别使用不同 profile")
    cli.add_argument("--state-dir", default=os.environ.get("MOFANG_NODE_STATE_DIR", str(Path.home() / ".local/share/mofang-node-cli")), help="私有会话目录；目录 0700、文件 0600")
    cli.add_argument("--timeout", type=float, default=30, help="HTTP 超时秒数；无自动重试")
    groups = cli.add_subparsers(dest="group", required=True)
    groups.add_parser("guide", help="离线开发入口：环境、作者规则、文件、条件、接口与费用边界；不访问网络")
    diagnosis = groups.add_parser("doctor", help="只读环境预检；提供bundle才执行不落库validate，绝不执行Tool或发布")
    diagnosis.add_argument("--bundle", help="已构建dist/<code>，读取node.json；不提供时不推断远端ABI")
    info = groups.add_parser("describe", help="离线查看操作路径、角色、必填字段及请求示例")
    info.add_argument("resource", nargs="?")
    info.add_argument("operation", nargs="?")
    auth_commands = groups.add_parser("auth", help="管理员密码登录；客户端验证码登录或显式导入已有 token")
    actions = auth_commands.add_subparsers(dest="action", required=True)
    for action in ("login", "import", "verify", "status", "logout", "refresh"):
        sub = actions.add_parser(action, help="仅清除本地会话，不撤销远端登录" if action == "logout" else None)
        if action in ("login", "import", "verify"):
            sub.add_argument("--base-url", required=True, help="网关根地址或具有 /v1 代理的页面站点地址")
            sub.add_argument("--secret-stdin", action="store_true", help="从 stdin 读取密码、验证码或裸 access token")
        if action in ("login", "import"):
            sub.add_argument("--role", choices=("admin", "client"), required=True)
        if action == "login":
            sub.add_argument("--phone", required=True)
        if action == "verify":
            sub.add_argument("--challenge-id", required=True)
    for group in sorted({key[0] for key in OPERATIONS}):
        resource = groups.add_parser(group)
        actions = resource.add_subparsers(dest="action", required=True)
        for (name, action), op in OPERATIONS.items():
            if name != group:
                continue
            sub = actions.add_parser(action, help=f"{op.method} {op.path}" + ("（管理员）" if op.admin else ""))
            if (group, action) == ("capabilities", "call"):
                sub.add_argument("--tool", required=True, help="精确 tool_name；仅用户明确要求时执行真实能力")
                sub.add_argument("--workspace-id", required=True, help="当前客户端用户有权访问的工作区 ID；不推导默认空间")
            for key in path_fields(op.path):
                if group == "capabilities":
                    identity = sub.add_mutually_exclusive_group(required=True)
                    identity.add_argument("--id")
                    identity.add_argument("--tool", help="精确 tool_name；分页检索后读取完整能力详情")
                else:
                    sub.add_argument("--" + key.replace("_", "-"), required=True)
            if op.method != "GET":
                sub.add_argument("--file", help="能力 arguments JSON 对象；- 表示 stdin，省略时为 {}" if (group, action) == ("capabilities", "call") else "请求体 JSON 对象文件；- 表示 stdin。字段用 describe 查看")
                if group == "nodes":
                    sub.add_argument("--bundle", help="读取工程模板 dist/<code>/node.json")
                    sub.add_argument("--source-file", help="以原文填入 source")
                    sub.add_argument("--expected-catalog-instance-id")
                    sub.add_argument("--expected-catalog-revision")
                if group == "panels" and action == "save":
                    sub.add_argument("--view-source", help="以原文填入 viewSource")
                    sub.add_argument("--program-source", help="以原文填入 programSource，仅 business")
            if op.query:
                sub.add_argument("--query", action="append", default=[], metavar="KEY=VALUE", help="仅允许 describe 列出的 query 字段；可重复")
                if "surface" in op.query:
                    sub.add_argument("--surface", choices=("settings", "business"), required=True)
    return cli


def main(argv=None):
    try:
        args = parser().parse_args(argv)
        if not math.isfinite(args.timeout) or args.timeout <= 0:
            raise CLIError("invalid_argument", "timeout 必须是正数")
        data = run(args)
        if args.group == "doctor" and data["status"] == "blocked":
            print(json.dumps({"ok": False, "data": data, "error": {"code": "doctor_blocked", "message": "环境预检存在缺口，见checks；未执行Tool或发布"}}, ensure_ascii=False, allow_nan=False))
            return 1
        print(json.dumps({"ok": True, "data": data}, ensure_ascii=False, allow_nan=False))
        return 0
    except CLIError as exc:
        print(json.dumps(exc.json(), ensure_ascii=False))
        return exc.exit_code
    except (OSError, ValueError, TypeError) as exc:
        print(json.dumps(CLIError("invalid_input_or_state", "输入或会话文件无效；检查格式、文件权限及正文数值").json(), ensure_ascii=False))
        return 1
    except KeyboardInterrupt:
        print(json.dumps(CLIError("interrupted", "操作被中断；若已提交写请求，请先回读结果").json(), ensure_ascii=False))
        return 130
