# 平台连接与节点开发入口

平台操作的唯一详细说明随JS技能维护，Lit技能复用同一CLI。环境、角色、HTTP路径、正文条件、修订与费用边界见[平台CLI](../.agents/skills/mofang-js-node/references/platform-cli.md)，完整开发条件和实现顺序见[节点开发入口](../.agents/skills/mofang-js-node/references/node-development.md)。无需服务端源码即可使用。

```sh
python3 .agents/skills/mofang-js-node/scripts/mofang_node.py guide
python3 .agents/skills/mofang-js-node/scripts/mofang_node.py describe nodes validate
python3 .agents/skills/mofang-js-node/scripts/mofang_node.py --profile test-admin doctor --bundle dist/<编码>
```

guide/describe离线读取，不代表远端ABI版本。doctor固定只读并仅在提供bundle时执行不落库validate，不保存、发布、起跑或执行Tool。默认只查询能力元数据和Schema并运行本地Mock；Tool可能计费，只有用户明确要求真实调用/试跑才执行。

网关：测试`https://dev.api.mofang.com`，正式`https://api.mofang.com`，预发`https://pre.api.mofang.com`。按用户已指定环境选独立admin/client profile，不能因403或猜测端点404自动切环境或推断ABI。
