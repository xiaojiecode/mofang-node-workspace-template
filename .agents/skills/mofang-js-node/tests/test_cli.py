"""使用回环 HTTP 替身验证真实 CLI；不登录或写入真实魔方环境。"""

import contextlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import unittest
from unittest import mock

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))
from mofang_cli.cli import main
from mofang_cli.connection import CLIError, HTTPClient

class Server(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def handle_request(self):
        payload = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        body = json.loads(payload) if payload else None
        self.server.requests.append((self.command, self.path, body, self.headers.get("Authorization")))
        if self.server.responses:
            status, value = self.server.responses.pop(0)
        elif self.path == "/v1/admin/login":
            status, value = 200, {"access_token": "test-admin-token", "expires_in": 3600}
        elif self.path == "/v1/user/login/code":
            status, value = 200, {"code": 0, "data": {"access_token": "test-client-token", "refresh_token": "test-refresh-token", "expires_in": 3600}}
        else:
            status, value = 200, {"code": 0, "data": {"body": body, "path": self.path}}
        if status == -1:
            self.close_connection = True
            return
        self.send_response(status)
        if status == 302:
            self.send_header("Location", "/must-not-follow")
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(value).encode())

    do_GET = do_POST = do_PUT = do_PATCH = handle_request


class CLITest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), Server)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def setUp(self):
        # 测试资产遵循任务 TMPDIR；避免写全局缓存或真实会话。
        self.temporary = tempfile.TemporaryDirectory(dir=os.environ.get("TMPDIR"))
        self.root = Path(self.temporary.name)
        self.state = self.root / "sessions"
        self.server.requests, self.server.responses = [], []

    def tearDown(self):
        self.temporary.cleanup()

    def call(self, argv, stdin="", profile="admin"):
        out = io.StringIO()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()), mock.patch("sys.stdin", io.StringIO(stdin)):
            result = main(["--state-dir", str(self.state), "--profile", profile, *argv])
        return result, json.loads(out.getvalue())

    def login(self, role="admin"):
        code, result = self.call(["auth", "login", "--role", role, "--base-url", self.url, "--phone", "test-account", "--secret-stdin"], "test-secret", role)
        self.assertEqual(code, 0, result)
        self.assertNotIn("test-secret", json.dumps(result))
        self.assertNotIn("test-admin-token", json.dumps(result))
        return result

    def body(self, value):
        file = self.root / "body.json"
        file.write_text(json.dumps(value), encoding="utf-8")
        return ["--file", str(file)]

    def test_admin_login_is_bare_and_secret_is_private(self):
        self.login()
        stored = json.loads((self.state / "admin.json").read_text())
        self.assertNotIn("password", stored)
        self.assertEqual(stored["access_token"], "test-admin-token")
        self.assertEqual((self.state.stat().st_mode & 0o777), 0o700)
        self.assertEqual(((self.state / "admin.json").stat().st_mode & 0o777), 0o600)
        self.assertEqual(self.server.requests[0][:3], ("POST", "/v1/admin/login", {"phone": "test-account", "password": "test-secret"}))

    def test_client_identity_cannot_use_author_endpoints(self):
        self.login("client")
        before = len(self.server.requests)
        code, result = self.call(["nodes", "source", "--code", "selection-test1"], profile="client")
        self.assertEqual(result["error"]["code"], "admin_required")
        self.assertEqual(code, 1)
        self.assertEqual(len(self.server.requests), before)

    def test_search_reads_exact_tool_detail_and_both_schemas(self):
        self.login()
        schema = {"type": "object", "properties": {"items": {"type": "array", "items": {"$ref": "urn:product:1"}}}}
        self.server.responses = [(200, {"code": 0, "data": {"list": [{"id": 3, "tool_name": "other"}], "total": 101}}), (200, {"code": 0, "data": {"list": [{"id": 7, "tool_name": "exact_tool"}], "total": 101}}), (200, {"code": 0, "data": {"tool_name": "exact_tool", "input_schema": schema, "output_schema": schema}})]
        code, result = self.call(["capabilities", "get", "--tool", "exact_tool"])
        self.assertEqual(code, 0, result)
        self.assertEqual(result["data"]["input_schema"], schema)
        self.assertEqual(result["data"]["output_schema"], schema)
        self.assertIn("page=2", self.server.requests[-2][1])
        self.assertEqual(self.server.requests[-1][1], "/v1/admin/atomic-capabilities/7")

    def test_node_bundle_update_preserves_revision_and_consumes_identity(self):
        self.login()
        value = {"code": "selection-test1", "name": "示例", "inputSchema": {}, "outputSchema": {}, "source": "const program={}", "tools": [], "maxToolCalls": 8, "timeoutSeconds": 0}
        folder = self.root / "bundle"
        folder.mkdir()
        (folder / "node.json").write_text(json.dumps(value))
        code, result = self.call(["nodes", "update", "--code", "selection-test1", "--bundle", str(folder), "--expected-catalog-instance-id", "catalog-id", "--expected-catalog-revision", "2"])
        self.assertEqual(code, 0, result)
        method, path, body, authorization = self.server.requests[-1]
        self.assertEqual((method, path), ("PUT", "/v1/admin/workflow/nodes/selection-test1/javascript"))
        self.assertEqual(body["expectedCatalogRevision"], "2")
        self.assertNotIn("code", body)
        self.assertNotIn("nodeCode", body)
        self.assertEqual(body["source"], value["source"])
        self.assertEqual(authorization, "Bearer test-admin-token")

    def test_client_config_keeps_explicit_null_and_reset_fields(self):
        self.login("client")
        body = {"revision": "7", "nodeConfigs": {"select": {"keyword": None}}, "resetFields": {"select": ["region"]}}
        code, result = self.call(["workflows", "config", "--workflow-id", "wf", *self.body(body)], profile="client")
        self.assertEqual(code, 0, result)
        self.assertEqual(self.server.requests[-1][:3], ("PATCH", "/v1/workflow/definitions/wf/config", body))

    def test_revision_conflict_is_not_retried(self):
        self.login("client")
        self.server.responses = [(409, {"code": 409, "msg": "revision conflict", "data": {"errorCode": "revision_conflict"}})]
        before = len(self.server.requests)
        code, result = self.call(["workflows", "config", "--workflow-id", "wf", *self.body({"revision": "1"})], profile="client")
        self.assertEqual(code, 1)
        self.assertEqual(result["error"]["code"], "revision_conflict")
        self.assertEqual(result["error"]["status"], 409)
        self.assertEqual(len(self.server.requests), before + 1)

    def test_disconnect_after_write_reports_unknown_without_retry(self):
        self.login("client")
        self.server.responses = [(-1, {})]
        before = len(self.server.requests)
        code, result = self.call(["workflows", "publish", "--workflow-id", "wf", *self.body({"revision": "1"})], profile="client")
        self.assertEqual(code, 1)
        self.assertEqual(result["error"]["code"], "write_outcome_unknown")
        self.assertEqual(len(self.server.requests), before + 1)

    def test_redirect_does_not_forward_authorization(self):
        self.login()
        self.server.responses = [(302, {})]
        before = len(self.server.requests)
        code, result = self.call(["nodes", "list"])
        self.assertEqual(code, 1)
        self.assertEqual(result["error"]["code"], "redirect_rejected")
        self.assertEqual(len(self.server.requests), before + 1)

    def test_unknown_start_and_release_can_be_discovered_without_new_write(self):
        self.login("client")
        code, result = self.call(["runs", "list", "--query", "workflowId=wf", "--query", "page=1"], profile="client")
        self.assertEqual(code, 0, result)
        self.assertEqual(self.server.requests[-1][:2], ("GET", "/v1/workflow/runs?workflowId=wf&page=1"))
        code, result = self.call(["workflows", "active-run", "--workflow-id", "wf"], profile="client")
        self.assertEqual(code, 0, result)
        self.assertEqual(self.server.requests[-1][:2], ("GET", "/v1/workflow/definitions/wf/active-run"))
        self.login()
        code, result = self.call(["panels", "releases", "--code", "example", "--surface", "business"])
        self.assertEqual(code, 0, result)
        self.assertEqual(self.server.requests[-1][:2], ("GET", "/v1/admin/workflow/nodes/example/page/releases?surface=business"))

    def test_sensitive_auth_error_redacted_and_profile_not_overwritten(self):
        self.login()
        previous = (self.state / "admin.json").read_bytes()
        self.server.responses = [(401, {"code": 401, "msg": "bad test-secret"})]
        code, result = self.call(["auth", "login", "--role", "admin", "--base-url", self.url, "--phone", "test-account", "--secret-stdin"], "test-secret")
        self.assertEqual(code, 1)
        self.assertNotIn("test-secret", json.dumps(result))
        self.assertEqual((self.state / "admin.json").read_bytes(), previous)

    def test_import_status_refresh_and_local_logout(self):
        self.login("client")
        self.server.responses = [(200, {"code": 0, "data": {"access_token": "new-test-token", "refresh_token": "new-refresh", "expires_in": 3600}})]
        code, result = self.call(["auth", "refresh"], profile="client")
        self.assertEqual(code, 0, result)
        self.assertEqual(self.server.requests[-1][2], {"refresh_token": "test-refresh-token"})
        self.assertNotIn("new-test-token", json.dumps(result))
        code, result = self.call(["auth", "status"], profile="client")
        self.assertEqual(result["data"]["role"], "client")
        before = len(self.server.requests)
        self.call(["auth", "logout"], profile="client")
        self.assertFalse((self.state / "client.json").exists())
        self.assertEqual(len(self.server.requests), before)

    def test_invalid_identity_actor_and_revision_fail_before_network(self):
        self.login("client")
        before = len(self.server.requests)
        for body, expected in [({"revision": "1", "workflowId": "another"}, "identity_mismatch"), ({"revision": "1", "actor": {}}, "invalid_argument"), ({"revision": 1}, "invalid_revision")]:
            code, result = self.call(["workflows", "config", "--workflow-id", "wf", *self.body(body)], profile="client")
            self.assertEqual((code, result["error"]["code"]), (1, expected))
        self.assertEqual(len(self.server.requests), before)

    def test_panel_source_and_surface_are_independent(self):
        self.login()
        source = self.root / "settings.js"
        source.write_text("export default class Example {}")
        value = {"kind": "save", "surface": "settings", "renderMode": "lit", "expectedCatalogInstanceId": "catalog", "expectedCatalogRevision": "3"}
        code, result = self.call(["panels", "save", "--code", "example", *self.body(value), "--view-source", str(source)])
        self.assertEqual(code, 0, result)
        self.assertEqual(self.server.requests[-1][2]["viewSource"], source.read_text())
        self.assertEqual(self.server.requests[-1][2]["surface"], "settings")
        self.assertNotIn("programSource", self.server.requests[-1][2])
        self.call(["panels", "get", "--code", "example", "--surface", "business"])
        self.assertEqual(self.server.requests[-1][1], "/v1/admin/workflow/nodes/example/page?surface=business")

    def test_business_panel_requires_program_and_settings_rejects_it(self):
        self.login()
        before = len(self.server.requests)
        body = {"kind": "save", "surface": "business", "renderMode": "lit", "expectedCatalogInstanceId": "catalog", "expectedCatalogRevision": "2", "viewSource": "export default class P {}"}
        code, result = self.call(["panels", "save", "--code", "example", *self.body(body)])
        self.assertEqual((code, result["error"]["code"]), (1, "missing_field"))
        self.assertEqual(len(self.server.requests), before)
        body["programSource"] = "export function prepareInput() {}"
        code, result = self.call(["panels", "save", "--code", "example", *self.body(body)])
        self.assertEqual(code, 0, result)
        before = len(self.server.requests)
        body["surface"] = "settings"
        code, result = self.call(["panels", "save", "--code", "example", *self.body(body)])
        self.assertEqual((code, result["error"]["code"]), (1, "invalid_argument"))
        self.assertEqual(len(self.server.requests), before)

    def test_failed_receipt_is_not_success(self):
        self.login("client")
        self.server.responses = [(200, {"code": 0, "data": {"receipt": {"status": "failed", "errorCode": "bad_schema", "errorMessage": "Rejected"}}})]
        code, result = self.call(["workflows", "publish", "--workflow-id", "wf", *self.body({"revision": "1"})], profile="client")
        self.assertEqual((code, result["error"]["code"]), (1, "bad_schema"))

    def test_describe_and_lit_entry_work_without_server_sources(self):
        for entry in (SCRIPTS / "mofang_node.py", SCRIPTS.parents[1] / "mofang-lit-node/scripts/mofang_node.py"):
            result = subprocess.run([sys.executable, str(entry), "describe", "panels", "save"], capture_output=True, text=True, cwd=self.root)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(result.stdout)["data"][0]["method"], "PUT")

    def test_client_mfa_then_verify_saves_only_completed_login(self):
        self.server.responses = [(200, {"code": 0, "data": {"mfa_required": True, "mfa_challenge_id": "challenge-test"}})]
        code, result = self.call(["auth", "login", "--role", "client", "--base-url", self.url, "--phone", "test-account", "--secret-stdin"], "test-code", "client")
        self.assertEqual((code, result["error"]["code"]), (1, "mfa_required"))
        self.assertFalse((self.state / "client.json").exists())
        self.server.responses = [(200, {"code": 0, "data": {"access_token": "mfa-test-token", "expires_in": 3600}})]
        code, result = self.call(["auth", "verify", "--base-url", self.url, "--challenge-id", "challenge-test", "--secret-stdin"], "test-otp", "client")
        self.assertEqual(code, 0, result)
        self.assertEqual(self.server.requests[-1][2], {"challenge_id": "challenge-test", "code": "test-otp"})
        self.assertNotIn("mfa-test-token", json.dumps(result))
        self.assertTrue((self.state / "client.json").is_file())

    def test_import_keeps_profile_isolated_and_expired_session_stops_request(self):
        self.login()
        previous = (self.state / "admin.json").read_bytes()
        code, result = self.call(["auth", "import", "--role", "client", "--base-url", self.url, "--secret-stdin"], "import-test-token", "client")
        self.assertEqual(code, 0, result)
        self.assertNotIn("import-test-token", json.dumps(result))
        self.assertEqual((self.state / "admin.json").read_bytes(), previous)
        target = self.state / "client.json"
        value = json.loads(target.read_text())
        value["expires_at"] = 1
        target.write_text(json.dumps(value))
        before = len(self.server.requests)
        code, result = self.call(["nodes", "list"], profile="client")
        self.assertEqual((code, result["error"]["code"]), (1, "session_expired"))
        self.assertEqual(len(self.server.requests), before)

    def test_explicit_selected_publish_targets_required(self):
        self.login()
        before = len(self.server.requests)
        value = {"surface": "business", "scope": "selected_instances", "targets": []}
        code, result = self.call(["panels", "publish", "--code", "example", *self.body(value)])
        self.assertEqual((code, result["error"]["code"]), (1, "invalid_argument"))
        self.assertEqual(len(self.server.requests), before)
        value["targets"] = ["instance-id"]
        code, result = self.call(["panels", "publish", "--code", "example", *self.body(value)])
        self.assertEqual(code, 0, result)
        self.assertEqual(self.server.requests[-1][2]["targets"], ["instance-id"])

    def test_state_permissions_symlink_and_url_credentials_rejected(self):
        self.login()
        session_file = self.state / "admin.json"
        original = self.root / "original.json"
        session_file.rename(original)
        session_file.symlink_to(original)
        code, result = self.call(["auth", "status"])
        self.assertEqual((code, result["error"]["code"]), (1, "unsafe_state"))
        with self.assertRaises(CLIError):
            HTTPClient("https://account:secret@example.invalid")


if __name__ == "__main__":
    unittest.main()
