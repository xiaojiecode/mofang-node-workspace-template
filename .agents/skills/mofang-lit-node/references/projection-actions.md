# Project 与动作接线草案

mf.node/1的业务JSON只取composition.projection.status为ready时的composition.projection.nodeView。外层snapshot与summary来自同一一致性快照；unavailable不回退旧顶层nodeView。后端GET不修补执行状态。

静态动作说明来自冻结manifest；availability是当前投影，真正提交和消费仍校验权限、状态、guard、来源与修订。Lit 业务正文负责 host 无参数动作和参数交互及可达性。

现有nodeFlow.action为唯一提交名，new ABI明确提供expectedSessionRevision及所需候选数组，不由SDK猜当前修订自动补值。回执的eventId用于精确结果补读；applied只代表协调事务提交。

listActions以固定序号上界分页恢复，页内outcome状态不是全扫描冻结；已知非终态随后按eventId继续补查。sequence不会因outcome更新而增加，不能仅拉更大sequence等待完成。

冲突/拒绝保留选择并说明原因，不把HTTP成功写成节点成功。网络失败结果未知时不重复业务提交；刷新后查看记录核对身份，不凭正文相似判断原动作。

历史页面不写，节点/SDK切换隔离旧请求结果，订阅共享现有消息连接。浏览器验证包含没有候选、业务view没变化、页面装载成功但Project失败等情况。

## 查询、确认与结清的用词

查询处理结果是读取原 eventId 或业务操作的状态，不产生新提交。“已人工核对原结果/动作记录/任务操作”当前只解除前端的未知标记，不向服务端保存核对结论，也不能证明业务已完成；文档与页面说明不能把这类入口描述成服务端确认成功。`resolveUnknownTask` 才提交 succeeded/failed 结论和证据，并保留真实身份与修订。

候选是尚未交给下游的完整输出；release 将其交给下游，discard 不再投递该输出，不等同于删除商品库记录。`endReview` 结束人工审核，现有页面的确认流程会丢弃剩余候选，需明确范围与后果。`production.finish` 只声明不再产生新输出，不替代任务、候选、unknown 与控制义务结清，也不直接代表节点成功。本轮统一概念说明，不改 action 标识或按钮文案。
