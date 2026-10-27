"""只验证离线 lowcode 请求合同；不登录，不访问接口。"""
import json
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from mofang_cli.operations import OPERATIONS, prepare
from mofang_cli.contracts import operation_contract
from mofang_cli.connection import CLIError


class LowcodeContractTest(unittest.TestCase):
    def body(self):
        return {"kind": "save", "surface": "business", "renderMode": "lowcode", "rendererKey": "puck", "expectedCatalogInstanceId": "fixture-only", "expectedCatalogRevision": "1", "config": {"extensions": {"workflow": {"nodeCode": "fixture-node", "surface": "runtime"}}}}

    def invoke(self, body):
        with tempfile.TemporaryDirectory() as folder:
            file = Path(folder) / "request.json"
            file.write_text(json.dumps(body), encoding="utf-8")
            return prepare(OPERATIONS[("panels", "save")], SimpleNamespace(file=str(file), code="fixture-node"))

    def test_lowcode_request_preserves_json(self):
        path, body, query = self.invoke(self.body())
        self.assertEqual(path, "/nodes/fixture-node/page")
        self.assertEqual(body["config"], self.body()["config"])
        self.assertEqual(query, {})

    def test_mixed_source_and_wrong_identity_rejected(self):
        for change in ({"viewSource": "lit"}, {"config": {}}, {"rendererKey": "other"}, {"surface": "settings"}):
            with self.subTest(change=change), self.assertRaises(CLIError):
                self.invoke({**self.body(), **change})

    def test_discovery_describes_native_lowcode(self):
        contract = operation_contract("panels", "save", OPERATIONS[("panels", "save")])
        self.assertIn("rendererKey", json.dumps(contract))
        self.assertIn("renderMode=lowcode", json.dumps(contract))


if __name__ == "__main__":
    unittest.main()
