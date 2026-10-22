# 节点模板协作规则

先读 README、目标节点的 node.ts / contract.ts 与 packages/contracts/provenance.json。保留已有节点；新建使用 node:new，不复制别的业务节点后猜测字段。启动钩子是 onStart，只有节点首次激活时运行；不能用 Lit 装载或重绘触发后台业务。

- 先确定 stages / main / lifecycle / panels 的业务需要。涉及契约、状态、恢复或已有页面行为的取舍先与用户讨论；沿用已确认决定。
- node.ts 是本地构建配置。平台保存、目录更新、实例采用、页面发布和真实试跑各有自己的目标与修订，不因本地构建自动执行。
- 在本节点 contract.ts 共用输入输出类型和 Schema；系统 Product/媒体类型只引用，不手写第二份简化结构。
- 通用纯展示放 lit-ui；宿主订阅接线放 lit-host；本节点组件放 settings/business 内。后台只引用纯数据和 Goja 代码，不引用 DOM、Lit、Node 或预览替身。
- 响应式属性用 declare 与 static properties；根页面不自己注册 customElements。共用组件不得使用全局固定标签污染其它节点或历史修订。
- 设置值由宿主控制，编辑立即回调，readOnly 时不修改；不另建保存按钮或配置写入链路。
- lifecycle 协调钩子不调用 Tool；业务调用放子任务 stages。只读 onControl/onError 不派发、不写状态；unknown 不自动重试，也不能伪造成功候选。
- main 的终结方法返回 undefined，写 return 来结束函数；stages 的终结 API 中断当前阶段，不混用类型。
- 调整代码后运行 typecheck、build、verify 与相关测试。最终产物通过 test:browser，执行示例通过 verify:goja；有平台源码时再做 verify:platform。
- fixtures 是本地试运行输入与断言，不是真实业务成功。验证层次需分开报告。
- 本仓库不得存储凭据。缓存放 .cache 或 MF_CACHE_DIR 指定目录；发布源码、包锁、类型快照和测试保留在 Git。

- 手写源码统一 4 个空格缩进，不使用 Tab；赋值及二元运算符两侧留空格。提交前运行 npm run lint，自动修复用 npm run lint:fix。
- 为生命周期钩子和公共函数保留中文说明，写清触发时机、输入输出、效果和限制；export default 前保留 // noinspection JSUnusedGlobalSymbols。修改脚手架时同步 tooling/init/templates，并验证新初始化工程。
- 正式 build 启用安全压缩并输出大小/耗时报告；不启用属性名混淆、不删除业务日志或变更宿主 ABI。压缩优化需验证行为等价，构建成功不能代替运行校验。
