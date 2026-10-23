# 面板必须校验

- 宿主右侧设置内容与统一底栏、普通/较矮业务抽屉；不以全屏替代默认状态。
- 参数修改立即回写，拒绝/归一化/空值/只读后正确恢复；不出现第二保存链路。
- ready/unavailable、加载/错误、真实零结果、历史及preview明确；没有模拟成功兜底。
- host动作在标准/full-panel均可达，panel选择/提交路径有键盘和实际浏览器验证。
- action accepted/processing/applied/rejected/failed/cancelled各自正确；候选等待与节点终态分开。
- 修订冲突、部分候选失败、未知网络结果、刷新/断连恢复、SDK更换和卸载清理。
- 发布目标、surface、catalog身份、修订与历史冻结分别回读；未经保存/发布/试跑不报告相应完成。

验证记录区分类型/fixture/浏览器/真实链路，真实依赖与mock出口逐项核对。前端规范以目标宿主DESIGN/CSPEC为准，不自行引入新的产品组件库或移动端范围。
