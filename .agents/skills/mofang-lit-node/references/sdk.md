# SDK与新投影

类型使用 lib/contracts/src/browser；SDK由宿主注入，不自建HTTP/SSE。节点目标来自this.target的真实runId/nodeInstanceId，不能传整个panelContext。通过sdk.nodeFlow.watch取得平台状态/权限/候选和composition，只有projection.status=ready读取其nodeView。unavailable显示错误，不用旧顶层nodeView兜底。

sdk/target变化重绑，卸载清理，history/preview禁止写。参数动作带expectedSessionRevision/candidates，accepted只表受理；按eventId的watchActionResult补读，刷新listActions分页恢复，不按view/payload变化猜结果。共享[ActionController](../../../../lib/browser/actions.ts)保留拒绝勾选、忽略旧目标回执，回执不明不自动重发。

设置沿settings.values/readOnly/onFieldChange受控草稿，UI状态回调不能触发后台业务。逐执行Agent/Go正式输出仍走context，不与节点总页混用。
