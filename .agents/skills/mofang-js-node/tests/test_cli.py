"""使用回环 HTTP 替身验证真实 CLI；不登录或写入真实魔方环境。"""

import contextlib
import base64
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import io
import json
import hashlib
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

    def workflow_body(self, **patch):
        """完整保存正文来自已读取快照；空说明与封面仍显式提交。"""
        return {"expectedRevision": "7", "name": "测试工作流", "description": "", "coverUrl": "",
                "graph": {"nodes": [], "edges": [], "globalsJson": {}, "agentSnapshots": {}}, **patch}

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
        self.assertTrue(all("keyword=" not in r[1] for r in self.server.requests[-3:-1]))
        self.assertEqual(self.server.requests[-1][1], "/v1/admin/atomic-capabilities/7")

    def client_access_session(self, subject="access"):
        self.login("client")
        payload = base64.urlsafe_b64encode(json.dumps({"sub": subject, "uid": 1109}).encode()).decode().rstrip("=")
        token = "header." + payload + ".test-signature"
        file = self.state / "client.json"
        session = json.loads(file.read_text())
        session["access_token"] = token
        file.write_text(json.dumps(session))
        self.server.requests = []
        return token

    def capability_call(self, extra=(), workspace="1081", profile="client"):
        with mock.patch("mofang_cli.capabilities.uuid.uuid4", return_value="call-test"):
            return self.call(["capabilities", "call", "--tool", "platform_product.store_products", "--workspace-id", workspace, *extra], profile=profile)

    def test_capability_call_uses_client_mcp_and_explicit_workspace(self):
        token = self.client_access_session()
        result = {"content": [{"type": "text", "text": '{"list":[{"id":"product-1"}],"total":1}'}], "isError": False}
        self.server.responses = [(200, {"jsonrpc": "2.0", "id": "call-test", "result": result})]
        code, value = self.capability_call(self.body({"keyword": "测试"}))
        self.assertEqual(code, 0, value)
        self.assertEqual(value["data"], {"tool_name": "platform_product.store_products", "workspace_id": 1081, "request_id": "call-test", "result": result})
        self.assertEqual(self.server.requests, [("POST", "/toomcp", {"jsonrpc": "2.0", "id": "call-test", "method": "tools/call", "params": {"name": "platform_product.store_products", "arguments": {"keyword": "测试"}, "_meta": {"workspace_id": 1081}}}, "Bearer " + token)])
        self.assertNotIn(token, json.dumps(value))

    def test_capability_call_default_arguments_and_pending_are_preserved(self):
        self.client_access_session()
        result = {"content": [{"type": "text", "text": '{"status":"pending","jobId":"job-1"}'}]}
        self.server.responses = [(200, {"jsonrpc": "2.0", "id": "call-test", "result": result})]
        code, value = self.capability_call()
        self.assertEqual(code, 0, value)
        self.assertEqual(value["data"]["result"], result)
        self.assertEqual(self.server.requests[0][2]["params"]["arguments"], {})
        self.assertEqual(len(self.server.requests), 1)

    def test_capability_call_rejects_admin_before_network(self):
        self.login("admin")
        self.server.requests = []
        code, value = self.capability_call(profile="admin")
        self.assertEqual((code, value["error"]["code"]), (1, "client_required"))
        self.assertEqual(self.server.requests, [])

    def test_capability_call_rejects_mislabeled_admin_and_refresh_tokens(self):
        for subject in ("admin", "refresh"):
            with self.subTest(subject=subject):
                self.client_access_session(subject)
                code, value = self.capability_call()
                self.assertEqual((code, value["error"]["code"]), (1, "client_access_token_required"))
                self.assertEqual(self.server.requests, [])

    def test_capability_call_requires_valid_explicit_workspace(self):
        self.client_access_session()
        for workspace in ("0", "-1", "1.0", "abc", "9223372036854775808", "１２"):
            with self.subTest(workspace=workspace):
                code, value = self.capability_call(workspace=workspace)
                self.assertEqual((code, value["error"]["code"]), (1, "invalid_argument"))
                self.assertEqual(self.server.requests, [])
        with self.assertRaises(SystemExit):
            self.call(["capabilities", "call", "--tool", "tool"], profile="client")

    def test_capability_call_requires_object_arguments(self):
        self.client_access_session()
        code, value = self.capability_call(self.body([]))
        self.assertEqual((code, value["error"]["code"]), (1, "invalid_json_file"))
        self.assertEqual(self.server.requests, [])

    def test_capability_call_rpc_errors_are_nonzero_and_not_retried(self):
        token = self.client_access_session()
        for status in (200, 403):
            with self.subTest(status=status):
                self.server.requests = []
                self.server.responses = [(status, {"jsonrpc": "2.0", "id": "call-test", "error": {"code": -32000, "message": "非本工作空间 " + token, "data": {"category": "policy_denied", "retryable": False, "detail": token}}})]
                code, value = self.capability_call()
                self.assertEqual((code, value["error"]["code"]), (1, "mcp_rpc_error"))
                self.assertEqual(value["error"]["details"]["rpc_code"], -32000)
                self.assertEqual(value["error"]["details"]["rpc_data"], {"category": "policy_denied", "retryable": False, "detail": "<redacted>"})
                self.assertEqual(value["error"]["details"]["request_id"], "call-test")
                self.assertNotIn(token, json.dumps(value))
                self.assertEqual(len(self.server.requests), 1)

    def test_capability_call_tool_failure_preserves_receipt(self):
        self.client_access_session()
        result = {"content": [{"type": "text", "text": '{"failures":[{"reasonCode":"unavailable"}]}'}], "isError": True}
        self.server.responses = [(200, {"jsonrpc": "2.0", "id": "call-test", "result": result})]
        code, value = self.capability_call()
        self.assertEqual((code, value["error"]["code"]), (1, "tool_execution_failed"))
        self.assertEqual(value["error"]["details"]["result"], result)

    def test_capability_call_rejects_unrelated_or_malformed_receipts(self):
        self.client_access_session()
        for response in ({"code": 0, "data": {}}, {"jsonrpc": "2.0", "id": "other", "result": {"content": []}}, {"jsonrpc": "2.0", "id": "call-test", "result": {"content": [], "isError": "false"}}):
            with self.subTest(response=response):
                self.server.responses = [(200, response)]
                code, value = self.capability_call()
                self.assertEqual((code, value["error"]["code"]), (1, "invalid_response"))

    def test_capability_call_disconnect_is_unknown_and_keeps_request_id(self):
        self.client_access_session()
        self.server.responses = [(-1, None)]
        code, value = self.capability_call()
        self.assertEqual((code, value["error"]["code"]), (1, "write_outcome_unknown"))
        self.assertEqual(value["error"]["details"]["request_id"], "call-test")
        self.assertEqual(len(self.server.requests), 1)

    def test_capability_call_interrupt_is_unknown_and_keeps_request_id(self):
        self.client_access_session()
        with mock.patch("mofang_cli.connection.HTTPClient.call", side_effect=KeyboardInterrupt) as request:
            code, value = self.capability_call()
        self.assertEqual((code, value["error"]["code"]), (130, "interrupted"))
        self.assertEqual(value["error"]["details"], {"request_id": "call-test", "tool_name": "platform_product.store_products", "workspace_id": 1081})
        request.assert_called_once()

    def test_describe_capability_call_is_client_only_and_marks_cost(self):
        code, value = self.call(["describe", "capabilities", "call"])
        self.assertEqual(code, 0, value)
        self.assertEqual(value["data"][0]["http_paths"], {"client": "/toomcp"})
        self.assertEqual(value["data"][0]["effect"], "execution_may_incur_cost")
        self.assertEqual(self.server.requests, [])

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

    def test_client_save_preserves_full_graph_null_removal_and_pause_window(self):
        self.login("client")
        graph = {"nodes": [{"key": "select", "code": "select", "nodeInstanceId": "instance-select",
                            "configJson": {"keyword": None}, "uiJson": {"title": "选品"}}],
                 "edges": [], "globalsJson": {"language": "zh"}, "agentSnapshots": {}}
        paused = {"runId": "run", "expectedRunRevision": "5", "expectedPauseRequestId": "pause"}
        updates = [{"nodeInstanceId": "instance-select", "targetCatalogInstanceId": "catalog", "targetDefinitionHash": "hash"}]
        body = self.workflow_body(graph=graph, pausedRun=paused, definitionUpdates=updates)
        before = len(self.server.requests)
        code, result = self.call(["workflows", "save", "--workflow-id", "wf", *self.body(body)], profile="client")
        self.assertEqual(code, 0, result)
        self.assertEqual(self.server.requests[-1][:3], ("PUT", "/v1/workflow/definitions/wf", body))
        self.assertEqual(len(self.server.requests), before + 1)
        self.assertIsNone(body["graph"]["nodes"][0]["configJson"]["keyword"])
        self.assertNotIn("region", body["graph"]["nodes"][0]["configJson"])

    def test_node_bundle_preserves_optional_product_identity_mode_for_catalog_calls(self):
        self.login()
        folder = Path(self.bundle())
        original = json.loads((folder / "node.json").read_text())
        for action in ("validate", "create", "update"):
            for mode in (None, "inherit", "new"):
                with self.subTest(action=action, mode=mode):
                    value = dict(original)
                    if mode is not None:
                        value["productIdentityMode"] = mode
                    (folder / "node.json").write_text(json.dumps(value))
                    arguments = ["nodes", action, "--bundle", str(folder)]
                    if action == "update":
                        arguments += ["--code", "fixture", "--expected-catalog-instance-id", "catalog", "--expected-catalog-revision", "1"]
                    code, result = self.call(arguments)
                    self.assertEqual(code, 0, result)
                    body = self.server.requests[-1][2]
                    self.assertEqual("productIdentityMode" in body, mode is not None)
                    if mode is not None:
                        self.assertEqual(body["productIdentityMode"], mode)
                    self.assertEqual(body["source"], original["source"])

    def test_node_identity_mode_rejects_explicit_invalid_values_before_network(self):
        self.login()
        folder = Path(self.bundle())
        original = json.loads((folder / "node.json").read_text())
        before = len(self.server.requests)
        for mode in ("", "auto", None, False, 1):
            value = {**original, "productIdentityMode": mode}
            (folder / "node.json").write_text(json.dumps(value))
            for body_args in (["--bundle", str(folder)], self.body(value)):
                code, result = self.call(["nodes", "validate", *body_args])
                self.assertEqual((code, result["error"]["code"]), (1, "invalid_argument"))
        self.assertEqual(len(self.server.requests), before)

    def test_revision_conflict_is_not_retried(self):
        self.login("client")
        self.server.responses = [(409, {"code": 409, "msg": "revision conflict", "data": {"errorCode": "revision_conflict"}})]
        before = len(self.server.requests)
        code, result = self.call(["workflows", "save", "--workflow-id", "wf", *self.body(self.workflow_body(expectedRevision="1"))], profile="client")
        self.assertEqual(code, 1)
        self.assertEqual(result["error"]["code"], "revision_conflict")
        self.assertEqual(result["error"]["status"], 409)
        self.assertEqual(len(self.server.requests), before + 1)

    def test_disconnect_after_write_reports_unknown_without_retry(self):
        self.login("client")
        self.server.responses = [(-1, {})]
        before = len(self.server.requests)
        code, result = self.call(["workflows", "save", "--workflow-id", "wf", *self.body(self.workflow_body())], profile="client")
        self.assertEqual(code, 1)
        self.assertEqual(result["error"]["code"], "write_outcome_unknown")
        self.assertEqual(len(self.server.requests), before + 1)

    def test_start_requires_saved_revision_and_explicit_boolean_without_legacy_overrides(self):
        self.login("client")
        for test_run in (False, True):
            body = {"expectedRevision": "8", "isTestRun": test_run, "mode": "manual"}
            before = len(self.server.requests)
            code, result = self.call(["workflows", "start", "--workflow-id", "wf", *self.body(body)], profile="client")
            self.assertEqual(code, 0, result)
            self.assertEqual(self.server.requests[-1][:3], ("POST", "/v1/workflow/definitions/wf/runs", body))
            self.assertEqual(len(self.server.requests), before + 1)
        before = len(self.server.requests)
        invalid = [({"expectedRevision": "8", "mode": "manual"}, "missing_field"),
                   ({"expectedRevision": "8", "isTestRun": "false", "mode": "manual"}, "invalid_argument"),
                   ({"expectedRevision": "8", "isTestRun": False, "mode": "manual", "source": "saved"}, "invalid_argument"),
                   ({"expectedRevision": "8", "isTestRun": False, "mode": "manual", "globalsJson": {}}, "invalid_argument")]
        for body, expected in invalid:
            code, result = self.call(["workflows", "start", "--workflow-id", "wf", *self.body(body)], profile="client")
            self.assertEqual((code, result["error"]["code"]), (1, expected))
        self.assertEqual(len(self.server.requests), before)

    def test_save_requires_full_metadata_and_rejects_retired_patch_fields(self):
        self.login("client")
        before = len(self.server.requests)
        missing = self.workflow_body()
        del missing["coverUrl"]
        for body, expected in [(missing, "missing_field"), (self.workflow_body(nodeConfigs={}), "invalid_argument")]:
            code, result = self.call(["workflows", "save", "--workflow-id", "wf", *self.body(body)], profile="client")
            self.assertEqual((code, result["error"]["code"]), (1, expected))
        self.assertEqual(len(self.server.requests), before)

    def test_offline_workflow_catalog_removes_retired_writes_but_keeps_page_releases(self):
        code, result = self.call(["describe"])
        self.assertEqual(code, 0, result)
        operations = {row["command"]: row for row in result["data"]}
        for command in ("workflows graph", "workflows config", "workflows publish", "runs config"):
            self.assertNotIn(command, operations)
        save = operations["workflows save"]
        self.assertEqual((save["method"], save["path"]), ("PUT", "/definitions/{workflow_id}"))
        self.assertEqual(set(save["required"]), {"expectedRevision", "name", "description", "coverUrl", "graph"})
        self.assertIn("pausedRun", save["contract"]["body_fields"])
        self.assertIn("snapshot.draftRevision", save["contract"]["response_fields_to_inspect"])
        self.assertEqual(set(operations["workflows start"]["required"]), {"expectedRevision", "isTestRun", "mode"})
        self.assertIn("panels publish", operations)
        self.assertIn("runs get", operations)
        self.assertEqual(self.server.requests, [])
        for group, action in (("workflows", "graph"), ("workflows", "config"), ("workflows", "publish"), ("runs", "config")):
            with self.subTest(group=group, action=action), contextlib.redirect_stderr(io.StringIO()):
                with self.assertRaises(SystemExit) as raised:
                    main([group, action])
                self.assertEqual(raised.exception.code, 2)
        self.assertEqual(self.server.requests, [])

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
        for body, expected in [(self.workflow_body(workflowId="another"), "identity_mismatch"), (self.workflow_body(actor={}), "invalid_argument"), (self.workflow_body(expectedRevision=1), "invalid_revision")]:
            code, result = self.call(["workflows", "save", "--workflow-id", "wf", *self.body(body)], profile="client")
            self.assertEqual((code, result["error"]["code"]), (1, expected))
        self.assertEqual(len(self.server.requests), before)

    def compiled_panel_fields(self, business=False):
        """保存测试使用模板最终字节，不再依赖服务端编译。"""
        view = 'module.exports={default:class P{}}'
        fields = {"viewCompiled": view, "viewHash": hashlib.sha256(view.encode()).hexdigest(), "compilerVersion": "local-esbuild@0.28.2/mf-page-v2"}
        if business:
            program = 'module.exports={prepareInput(){}}'
            fields.update(programCompiled=program, programHash=hashlib.sha256(program.encode()).hexdigest())
        return fields

    def test_panel_source_and_surface_are_independent(self):
        self.login()
        source = self.root / "settings.js"
        source.write_text("export default class Example {}")
        value = {"kind": "save", "surface": "settings", "renderMode": "lit", "expectedCatalogInstanceId": "catalog", "expectedCatalogRevision": "3"}
        value.update(self.compiled_panel_fields())
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
        body["supportedContextSchemas"] = ["mf.node-context/1"]
        body.update(self.compiled_panel_fields(True))
        code, result = self.call(["panels", "save", "--code", "example", *self.body(body)])
        self.assertEqual(code, 0, result)
        before = len(self.server.requests)
        body["surface"] = "settings"
        code, result = self.call(["panels", "save", "--code", "example", *self.body(body)])
        self.assertEqual((code, result["error"]["code"]), (1, "invalid_argument"))
        self.assertEqual(len(self.server.requests), before)

    def test_business_context_schemas_are_explicit_and_validated_before_network(self):
        self.login()
        for action in ("save",):
            prefix = ["panels", action] + (["--code", "example"] if action == "save" else [])
            valid = {"surface": "business", "viewSource": "export default class P {}", "programSource": "export function prepareInput() {}"}
            if action == "save":
                valid.update(kind="save", renderMode="lit", expectedCatalogInstanceId="catalog", expectedCatalogRevision="2", **self.compiled_panel_fields(True))
            before = len(self.server.requests)
            code, result = self.call([*prefix, *self.body(valid)])
            self.assertEqual((code, result["error"]["code"]), (1, "missing_field"))
            self.assertIn("supportedContextSchemas", result["error"]["message"])
            for invalid in (None, [], "mf.node-context/1", [1], [""], [" mf.node-context/1"], ["mf.node-context/1 "], ["x", "x"], ["x\x00y"], ["x" * 257], ["中" * 86], ["\ud800"]):
                with self.subTest(action=action, invalid=repr(invalid)):
                    code, result = self.call([*prefix, *self.body({**valid, "supportedContextSchemas": invalid})])
                    self.assertEqual((code, result["error"]["code"]), (1, "invalid_argument"))
            self.assertEqual(len(self.server.requests), before)
            schemas = ["mf.node-context/1", "custom.preview/1"]
            code, result = self.call([*prefix, *self.body({**valid, "supportedContextSchemas": schemas})])
            self.assertEqual(code, 0, result)
            self.assertEqual(self.server.requests[-1][2]["supportedContextSchemas"], schemas)

    def test_save_requires_final_artifacts_and_checks_hashes(self):
        self.login()
        body = {"kind": "save", "surface": "settings", "renderMode": "lit", "viewSource": "export default class P{}", "expectedCatalogInstanceId": "catalog", "expectedCatalogRevision": "1"}
        before = len(self.server.requests)
        code, result = self.call(["panels", "save", "--code", "example", *self.body(body)])
        self.assertEqual((code, result["error"]["code"]), (1, "missing_field"))
        body.update(self.compiled_panel_fields())
        for patch in ({"viewHash": "bad"}, {"programCompiled": "bad"}, {"compilerVersion": "x" * 65}, {"compilerVersion": "中" * 22}):
            code, result = self.call(["panels", "save", "--code", "example", *self.body({**body, **patch})])
            self.assertEqual((code, result["error"]["code"]), (1, "invalid_argument"))
        self.assertEqual(len(self.server.requests), before)
        code, result = self.call(["panels", "save", "--code", "example", *self.body(body)])
        self.assertEqual(code, 0, result)
        self.assertEqual(self.server.requests[-1][2]["viewCompiled"], body["viewCompiled"])

    def test_describe_exposes_final_save_and_publish_without_remote_compile(self):
        code, result = self.call(["guide"])
        self.assertEqual(code, 0, result)
        interfaces = {row["command"]: row for row in result["data"]["interfaces"]}
        self.assertNotIn("panels compile", interfaces)
        self.assertIn("viewCompiled", interfaces["panels save"]["contract"]["body_fields"])
        self.assertIn("renderMode", interfaces["panels save"]["contract"]["body_fields"])
        self.assertEqual(set(interfaces["panels publish"]["contract"]["body_fields"]), {"surface", "scope", "panelRevision", "targets"})
        self.assertIn("supportedContextSchemas", result["data"]["panel_authoring"]["business_context"])
        self.assertFalse(self.state.exists())
        self.assertEqual(self.server.requests, [])

    def test_failed_receipt_is_not_success(self):
        self.login("client")
        self.server.responses = [(200, {"code": 0, "data": {"receipt": {"status": "failed", "errorCode": "bad_schema", "errorMessage": "Rejected"}}})]
        code, result = self.call(["workflows", "save", "--workflow-id", "wf", *self.body(self.workflow_body())], profile="client")
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

    def bundle(self, tools=None):
        folder = self.root / "node-bundle"
        folder.mkdir()
        value = {"code": "fixture", "name": "Fixture", "inputSchema": {}, "outputSchema": {}, "source": "const program = {}", "tools": tools or [], "maxToolCalls": 8, "timeoutSeconds": 0}
        (folder / "node.json").write_text(json.dumps(value))
        return str(folder)

    def doctor_responses(self, validation=None, nodes=None):
        return [(200, {"code": 0, "data": {"items": []}}),
                (200, {"code": 0, "data": {"items": nodes or []}}),
                (200, {"code": 0, "data": validation or {"valid": True, "programInterface": "mf.node/1", "scope": "syntax_and_contract"}})]

    def test_guide_is_offline_and_describe_does_not_claim_remote_abi(self):
        code, result = self.call(["guide"])
        self.assertEqual(code, 0)
        data = result["data"]
        self.assertEqual(data["environments"]["test"], "https://dev.api.mofang.com")
        self.assertEqual(data["environments"]["production"], "https://api.mofang.com")
        self.assertEqual(data["environments"]["preproduction"], "https://pre.api.mofang.com")
        self.assertEqual(data["remote_abi"], "not_checked")
        self.assertFalse(self.state.exists())
        self.assertEqual(self.server.requests, [])
        validation = next(x for x in data["interfaces"] if x["command"] == "nodes validate")
        self.assertEqual(validation["http_paths"], {"admin": "/v1/admin/workflow/nodes/javascript/validate"})
        self.assertEqual(validation["effect"], "validate_without_persistence")
        self.assertIn("source", validation["contract"]["body_fields"])
        start = next(x for x in data["interfaces"] if x["command"] == "workflows start")
        self.assertEqual(start["effect"], "execution_may_incur_cost")

    def test_doctor_without_bundle_only_discovers_and_does_not_probe_guessed_paths(self):
        self.login()
        self.server.requests = []
        self.server.responses = self.doctor_responses()[:2]
        code, result = self.call(["doctor"])
        self.assertEqual(code, 0, result)
        self.assertEqual(result["data"]["status"], "discovered")
        self.assertFalse(result["data"]["ready_for_catalog_save"])
        self.assertEqual(result["data"]["remote_abi"]["status"], "not_checked")
        self.assertEqual([r[:2] for r in self.server.requests], [("GET", "/v1/admin/workflow/type-schemas"), ("GET", "/v1/admin/workflow/nodes")])

    def test_doctor_validates_new_abi_without_creating_or_executing(self):
        self.login()
        self.server.requests = []
        self.server.responses = self.doctor_responses()
        code, result = self.call(["doctor", "--bundle", self.bundle()])
        self.assertEqual(code, 0, result)
        self.assertTrue(result["data"]["ready_for_catalog_save"])
        self.assertEqual(result["data"]["tool_execution_count"], 0)
        self.assertEqual([r[1] for r in self.server.requests], ["/v1/admin/workflow/type-schemas", "/v1/admin/workflow/nodes", "/v1/admin/workflow/nodes/javascript/validate"])
        self.assertNotIn("test-admin-token", json.dumps(result))

    def test_doctor_legacy_validation_success_is_not_new_abi_support(self):
        self.login()
        self.server.responses = self.doctor_responses({"valid": True, "programInterface": "stages"})
        code, result = self.call(["doctor", "--bundle", self.bundle()])
        self.assertEqual(code, 1)
        self.assertFalse(result["data"]["ready_for_catalog_save"])
        self.assertEqual(result["error"]["code"], "doctor_blocked")

    def test_doctor_permission_failure_does_not_mean_abi_unsupported(self):
        self.login()
        self.server.responses = self.doctor_responses()
        self.server.responses[0] = (403, {"code": 403, "message": "denied"})
        code, result = self.call(["doctor", "--bundle", self.bundle()])
        self.assertEqual(code, 1)
        self.assertEqual(result["data"]["status"], "blocked")
        self.assertEqual(result["data"]["remote_abi"]["status"], "supported")

    def test_doctor_missing_tool_schema_blocks_without_tool_execution(self):
        self.login()
        self.server.requests = []
        responses = self.doctor_responses()
        self.server.responses = responses[:2] + [
            (200, {"code": 0, "data": {"list": [{"id": 7, "tool_name": "search"}], "total": 1}}),
            (200, {"code": 0, "data": {"tool_name": "search", "input_schema": {}}}),
            responses[2],
        ]
        code, result = self.call(["doctor", "--bundle", self.bundle(["search"])])
        self.assertEqual(code, 1)
        errors = [x["error"]["code"] for x in result["data"]["checks"] if x["status"] == "failed"]
        self.assertIn("capability_schema_missing", errors)
        self.assertEqual([r[1] for r in self.server.requests if r[0] != "GET"], ["/v1/admin/workflow/nodes/javascript/validate"])

    def test_doctor_existing_go_definition_cannot_be_overwritten(self):
        self.login()
        self.server.requests = []
        self.server.responses = self.doctor_responses(nodes=[{"code": "fixture", "codeRuntime": "go", "editable": False}])
        code, result = self.call(["doctor", "--bundle", self.bundle()])
        self.assertEqual(code, 1)
        self.assertFalse(result["data"]["ready_for_catalog_save"])
        self.assertFalse(any(r[1].endswith("/javascript") for r in self.server.requests))

    def test_doctor_client_cannot_validate_bundle(self):
        self.login("client")
        self.server.requests = []
        self.server.responses = self.doctor_responses()[:2]
        code, result = self.call(["doctor", "--bundle", self.bundle()], profile="client")
        self.assertEqual(code, 1)
        self.assertTrue(all(r[0] == "GET" for r in self.server.requests))

    def test_doctor_unknown_capability_flags_are_not_readiness(self):
        self.login()
        responses = self.doctor_responses()
        self.server.responses = responses[:2] + [
            (200, {"code": 0, "data": {"list": [{"id": 7, "tool_name": "search"}], "total": 1}}),
            (200, {"code": 0, "data": {"tool_name": "search", "input_schema": {}, "output_schema": {}}}),
            responses[2],
        ]
        code, result = self.call(["doctor", "--bundle", self.bundle(["search"])])
        self.assertEqual(code, 1)
        failures = [x for x in result["data"]["checks"] if x["status"] == "failed"]
        self.assertEqual(failures[0]["error"]["code"], "capability_metadata_missing")
        self.assertIn("async_execution", failures[0]["error"]["message"])

    def test_describe_action_fields_match_http_wrappers(self):
        for action, expected in [("action", "receipt.eventId"), ("action-result", "result.eventId"), ("actions", "items[]")]:
            code, result = self.call(["describe", "runs", action])
            self.assertEqual(code, 0)
            contract = result["data"][0]["contract"]
            self.assertIn(expected, contract["response_fields_to_inspect"])
            self.assertNotIn("outcome", contract["response_fields_to_inspect"])
            if action == "action":
                self.assertIn("动作name", contract["body_fields"]["name"]["meaning"])

    def test_doctor_accepts_explicit_false_flags_and_does_not_echo_private_metadata(self):
        self.login()
        responses = self.doctor_responses()
        capability = {"tool_name": "search", "input_schema": {}, "output_schema": {}, "input_schema_registered": True, "output_schema_registered": True, "effective_enabled": True, "async_execution": False, "requires_workflow_context": False, "vendor_secret": "must-not-echo"}
        self.server.responses = responses[:2] + [
            (200, {"code": 0, "data": {"list": [{"id": 7, "tool_name": "search"}], "total": 1}}),
            (200, {"code": 0, "data": capability}), responses[2],
        ]
        code, result = self.call(["doctor", "--bundle", self.bundle(["search"])])
        self.assertEqual(code, 0, result)
        check = next(x for x in result["data"]["checks"] if x["name"] == "capability:search")
        self.assertIs(check["data"]["async_execution"], False)
        self.assertNotIn("must-not-echo", json.dumps(result))

    def test_doctor_rejects_unrelated_collection_json(self):
        self.login()
        self.server.responses = [(200, {"code": 0, "data": {"unexpected": True}}), (200, {"code": 0, "data": {"items": []}})]
        code, result = self.call(["doctor"])
        self.assertEqual(code, 1)
        self.assertEqual(result["data"]["checks"][0]["error"]["code"], "invalid_response")


if __name__ == "__main__":
    unittest.main()
