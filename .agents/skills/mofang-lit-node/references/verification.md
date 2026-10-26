# 面板必须校验

- 宿主右侧设置内容与统一底栏、普通/较矮业务抽屉；不以全屏替代默认状态。
- 参数修改立即回写，拒绝/归一化/空值/只读后正确恢复；不出现第二保存链路。
- ready/unavailable、加载/错误、真实零结果、历史及preview明确；没有模拟成功兜底。
- host动作在标准/full-panel均可达，panel选择/提交路径有键盘和实际浏览器验证。
- action accepted/processing/applied/rejected/failed/cancelled各自正确；候选等待与节点终态分开。
- 修订冲突、部分候选失败、未知网络结果、刷新/断连恢复、SDK更换和卸载清理。
- 发布目标、surface、catalog身份、修订与历史冻结分别回读；未经保存/发布/试跑不报告相应完成。
- business Lit 的编译、保存正文均包含非空 supportedContextSchemas；settings 不带 programSource，编译正文不混入 renderMode 等保存字段。
- 浏览器挂载前按宿主完整注入属性，包含 node；不使用只有 getter 的同名内部属性。验证发布用的实际编译产物，不能仅执行模块后拍静态截图。
- 出现“Lit 面板装载失败”时读取控制台原始 Error 和堆栈，区分模块执行、元素创建、属性注入与首次更新；记录页面身份，不输出凭据或整份业务数据。

验证记录区分类型/fixture/浏览器/真实链路，真实依赖与mock出口逐项核对。前端规范以目标宿主DESIGN/CSPEC为准，不自行引入新的产品组件库或移动端范围。
