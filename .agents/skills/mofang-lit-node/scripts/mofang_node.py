#!/usr/bin/env python3
"""Lit 技能复用同级 JS 技能中的 CLI，避免维护两份 HTTP 与认证逻辑。"""
from pathlib import Path
import sys

shared = Path(__file__).resolve().parents[2] / "mofang-js-node" / "scripts"
if not (shared / "mofang_node.py").is_file():
    print('需要同时安装同级 mofang-js-node 技能，以提供共享的节点 CLI。', file=sys.stderr)
    raise SystemExit(1)
sys.path.insert(0, str(shared))
from mofang_cli.cli import main

if __name__ == "__main__":
    raise SystemExit(main())
