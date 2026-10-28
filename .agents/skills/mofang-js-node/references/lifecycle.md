# 函数节点协调与必须人工事件

当前新源码使用 mf.node/1，完整API见 [作者规范](../../../../docs/authoring.md)和[最小骨架](../../../../tooling/init/skeleton/run.ts)。不提交 createState/ctx.state/view.replace 旧对象，不建立旧协议转换。

Component只绑定，业务由 useOnStart/useOnInput/useOnTaskResult/useNodeAction 触发。状态Schema、snapshot/updater/reducer及真实inputRefs按作者规范。onControl/onError只读，任务仍使用当前stages。零结果、无选择、失败有无参数host finish；unknown先核对。finish只是生产声明，已有候选/任务/事件/输入仍由平台结清。

## 必须人工事件与结束路径

逐项列明事件名称、payloadSchema、guard及禁用原因、真实页面入口、accepted→outcome结果查询和剩余义务。host动作必须无参数；panel动作浏览器验收真实可达，full-panel不能省略共同宿主区域。关闭抽屉不是finish，finish不是endReview。

用户重复点击/断连不自动重发，按eventId查询。业务拒绝撤销整个事件日志并保留用户选择；程序fault和unknown不能包装成成功。验证表见[必须验证](verification.md)。
