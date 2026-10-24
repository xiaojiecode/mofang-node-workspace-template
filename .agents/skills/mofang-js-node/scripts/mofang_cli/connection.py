"""HTTP 信封、错误和本地会话；不输出或持久化登录密码。"""

import ipaddress
from http.client import HTTPException
import json
import os
from pathlib import Path
import re
import stat
import tempfile
import time
from urllib import error, parse, request


class CLIError(Exception):
    def __init__(self, code, message, status=None, details=None, exit_code=1):
        super().__init__(message)
        self.code, self.message, self.status = code, message, status
        self.details = details
        self.exit_code = exit_code

    def json(self):
        value = {"code": self.code, "message": self.message}
        if self.status is not None:
            value["status"] = self.status
        if self.details is not None:
            value["details"] = self.details
        return {"ok": False, "error": value}


def base_url(value):
    parts = parse.urlsplit(value.strip())
    if (parts.scheme not in ("http", "https") or any(c.isspace() for c in value) or not parts.hostname
            or parts.username or parts.password or parts.query or parts.fragment
            or any(p in (".", "..") for p in parts.path.split("/"))):
        raise CLIError("invalid_url", "base-url 必须是无凭据、query 和 fragment 的 HTTP(S) 网关地址")
    return value.strip().rstrip("/")


class NoRedirect(request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class HTTPClient:
    def __init__(self, url, token=None, timeout=30):
        self.url, self.token, self.timeout = base_url(url), token, timeout
        host = parse.urlsplit(self.url).hostname
        try:
            local = ipaddress.ip_address(host).is_loopback
        except ValueError:
            local = host == "localhost"
        handlers = [NoRedirect()]
        if local:
            handlers.append(request.ProxyHandler({}))
        self.opener = request.build_opener(*handlers)

    def call(self, method, path, body=None, query=None, bare=False, jsonrpc=False):
        url = self.url + path
        if query:
            url += "?" + parse.urlencode(query)
        headers = {"Accept": "application/json"}
        if self.token:
            headers["Authorization"] = "Bearer " + self.token
        data = None
        if body is not None:
            data = json.dumps(body, ensure_ascii=False, allow_nan=False).encode()
            headers["Content-Type"] = "application/json"
        req = request.Request(url, data=data, headers=headers, method=method)
        status = 0
        try:
            with self.opener.open(req, timeout=self.timeout) as response:
                status = response.status
                raw = response.read(16 * 1024 * 1024 + 1)
        except error.HTTPError as exc:
            status, raw = exc.code, exc.read(1024 * 1024)
        except (error.URLError, TimeoutError, OSError, HTTPException) as exc:
            code = "request_failed" if method == "GET" else "write_outcome_unknown"
            message = "连接失败；请核对地址与网络。" if method == "GET" else "未取得完整响应，写入结果未知；先回读目标，不要直接重发。"
            raise CLIError(code, message) from exc
        if 300 <= status < 400:
            raise CLIError("redirect_rejected", "拒绝自动跟随重定向；请使用实际网关地址", status)
        if len(raw) > 16 * 1024 * 1024:
            raise CLIError("response_too_large", "响应超过 16 MiB；请缩小查询范围", status)
        try:
            value = json.loads(raw)
        except (ValueError, UnicodeError) as exc:
            raise CLIError("invalid_response", "服务端未返回 JSON；写请求请先回读核对结果", status) from exc
        if not isinstance(value, dict):
            raise CLIError("invalid_response", "服务端响应必须是 JSON 对象", status)
        if jsonrpc and value.get("jsonrpc") == "2.0":
            if value.get("id") != body["id"]:
                raise CLIError("invalid_response", "JSON-RPC 响应 ID 与本次请求不一致；不要自动重发", status)
            if "error" in value:
                rpc_error = value["error"]
                if not isinstance(rpc_error, dict):
                    raise CLIError("invalid_response", "JSON-RPC error 必须是对象", status)
                message = str(rpc_error.get("message") or "客户端原子能力调用被拒绝")
                if self.token:
                    message = message.replace(self.token, "<redacted>")
                details = {"rpc_code": rpc_error.get("code")}
                if "data" in rpc_error:
                    data = rpc_error["data"]
                    if self.token:
                        data = json.loads(json.dumps(data).replace(self.token, "<redacted>"))
                    details["rpc_data"] = data
                raise CLIError("mcp_rpc_error", message, status, details)
            if 200 <= status < 300 and isinstance(value.get("result"), dict):
                return value["result"]
            raise CLIError("invalid_response", "JSON-RPC 缺少有效 result；不要自动重发", status)
        if jsonrpc and 200 <= status < 300:
            raise CLIError("invalid_response", "服务端未返回 JSON-RPC 2.0 回执；不要自动重发", status)
        if 200 <= status < 300 and bare and "code" not in value:
            return value
        if 200 <= status < 300 and value.get("code") == 0 and "data" in value:
            return value["data"]
        details = value.get("data")
        code = details.get("errorCode") if isinstance(details, dict) else None
        code = code or ("unauthorized" if status == 401 else "permission_denied" if status == 403 else "api_error")
        message = str(value.get("msg") or value.get("message") or "服务端拒绝请求")
        secrets = [self.token]
        if isinstance(body, dict):
            secrets += [body.get(k) for k in ("password", "code", "access_token", "refresh_token")]
        for secret in secrets:
            if isinstance(secret, str) and secret:
                message = message.replace(secret, "<redacted>")
        raise CLIError(str(code), message, status)


class Sessions:
    def __init__(self, directory, profile):
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", profile):
            raise CLIError("invalid_profile", "profile 只接受 1–64 位字母、数字、下划线和短横线")
        self.directory = Path(directory).expanduser()
        self.path = self.directory / (profile + ".json")

    def _directory(self):
        if self.directory.is_symlink():
            raise CLIError("unsafe_state", "会话目录不能是符号链接")
        self.directory.mkdir(parents=True, exist_ok=True, mode=0o700)
        if os.name != "nt" and stat.S_IMODE(self.directory.stat().st_mode) & 0o077:
            raise CLIError("unsafe_state", "请使用权限为 0700 的专用会话目录")

    def load(self, check_expiry=True):
        self._directory()
        try:
            if self.path.is_symlink():
                raise CLIError("unsafe_state", "会话文件不能是符号链接")
            fd = os.open(self.path, os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0))
            with os.fdopen(fd) as stream:
                if os.name != "nt" and stat.S_IMODE(os.fstat(stream.fileno()).st_mode) & 0o077:
                    raise CLIError("unsafe_state", "会话文件权限必须是 0600")
                value = json.load(stream)
        except FileNotFoundError as exc:
            raise CLIError("not_logged_in", "当前 profile 尚未登录；先运行 auth login 或 auth import") from exc
        if (not isinstance(value, dict) or value.get("role") not in ("admin", "client")
                or not isinstance(value.get("access_token"), str) or not value["access_token"]):
            raise CLIError("invalid_session", "会话格式无效；请重新登录")
        base_url(value.get("base_url", ""))
        if check_expiry and value.get("expires_at") and time.time() >= value["expires_at"]:
            raise CLIError("session_expired", "会话已到期；客户端可显式 auth refresh，管理员请重新登录")
        return value

    def save(self, url, role, response):
        token = response.get("access_token")
        if not isinstance(token, str) or not token or any(c.isspace() for c in token):
            raise CLIError("invalid_login", "登录未返回有效 access_token；未保存会话")
        self._directory()
        value = {"base_url": base_url(url), "role": role, "access_token": token}
        ttl = response.get("expires_in")
        if isinstance(ttl, (int, float)) and ttl > 0:
            value["expires_at"] = time.time() + ttl
        if isinstance(response.get("refresh_token"), str) and response["refresh_token"]:
            value["refresh_token"] = response["refresh_token"]
        with tempfile.NamedTemporaryFile(mode="w", dir=self.directory, delete=False, encoding="utf-8") as stream:
            temporary = Path(stream.name)
            try:
                os.chmod(temporary, 0o600)
                json.dump(value, stream, ensure_ascii=False)
                stream.flush()
                os.fsync(stream.fileno())
                os.replace(temporary, self.path)
            finally:
                temporary.unlink(missing_ok=True)
        return self.public(value)

    def public(self, value):
        return {"base_url": value["base_url"], "role": value["role"],
                "expires_at": value.get("expires_at"), "session_file": str(self.path)}

    def forget(self):
        self._directory()
        self.path.unlink(missing_ok=True)
        return {"forgotten": True, "remote_session_revoked": False}
