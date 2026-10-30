# 面板容器与候选

## 按宿主容器布局

settings只负责设置内容；Lit 工作流设置 shell 提供导航与策略，宿主保有统一草稿保存/取消。business处于有限高度上拉抽屉，标准或full-panel均在 Lit 正文内提供必要动作和状态；全屏由用户显式切换，不能把浏览器视口当默认画布。内容滚动归属清楚，重要动作不能仅在滚动不可达底部。

## 必须人工事件的页面引导

先读真实动作声明和guard。无参数必要动作由 Lit 正文显示，参数动作如商品keys由业务Lit真实按钮实现；finish 保留独立入口，不用关闭抽屉或endReview替代它。零结果、不选择、失败与unknown分别显示原因和下一步。

动作accepted、applied、任务成功和节点成功分开。applied后仍可能等待候选审核；rejected/failed保留选择并显示原因；回执未知先查记录，不自动再写。候选update/remove/release用真实ID/修订，历史已流转快照只读。接线见[SDK](sdk.md)，整抽屉见[边界](full-drawer.md)。
