# 函数节点协调与必须人工事件

当前新源码使用 mf.node/1，完整API见 [作者规范](../../../../docs/authoring.md)和[最小骨架](../../../../tooling/init/skeleton/run.ts)。不提交 createState/ctx.state/view.replace 旧对象，不建立旧协议转换。

Component只绑定，业务由 useOnStart/useOnEntry/useOnInput/useTask(...).onResult/useNodeAction 触发。状态Schema、snapshot/updater/reducer及真实inputRefs按作者规范。onControl/onError只读，任务仍使用当前stages。零结果、无选择、失败有无参数host finish；unknown先核对。finish只是生产声明，已有候选/任务/事件/输入仍由平台结清。

`useOnEntry` 独立处理没有上游到达的真实入口任务，收到 inputEventId、taskId、generation、inputManifestId 与准备好的 values；不得用入口任务身份伪造 deliveryId。与入口输入相关的子任务使用 inputEventId 引用。商品仍只通过真实 `useOnInput` 到达。入口结果未声明时保持未知；模板支持不代表目标平台已支持。

节点先以默认 state 和用户填写的冻结输入初始化；全部节点就绪后才启动本次范围内的节点，范围外节点仅供查看。初始投影须支持尚无上游到达；不能把初始化误当作收到商品或业务成功。启动和后续事件基于已保存 state 更新，不重置用户选择或设置。运行范围与权限由宿主核验，实际平台支持以目标环境验证为准。

## 必须人工事件与结束路径

逐项列明事件名称、payloadSchema、guard及禁用原因、真实页面入口、accepted→outcome结果查询和剩余义务。host动作必须无参数；panel动作浏览器验收真实可达，Lit 正文不能省略必要动作。关闭抽屉不是finish，finish不是endReview。

用户重复点击/断连不自动重发，按eventId查询。业务拒绝撤销整个事件日志并保留用户选择；程序fault和unknown不能包装成成功。验证表见[必须验证](verification.md)。
