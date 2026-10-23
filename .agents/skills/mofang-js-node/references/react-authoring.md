# React 风格节点的关键规则

这是一套受持久工作流约束的函数作者接口，前端仍由独立Lit面板渲染。不要导入React DOM/Fiber，也不把组件mount/unmount作为真实业务开始/补偿。

1. 静态spec声明状态槽、Schema、任务和动作；函数只绑定已声明条目。具名槽避免按Hook顺序绑错持久数据。
2. 状态是快照；setter登记更新，updater收到pending值。不能set后读旧变量判断下一业务步骤。复杂流程一次reducer返回state/commands/production。
3. 初始化/赋值使用JSON值语义，复制校验后深只读；不承诺对象引用跨VM相等。字段缺省/null、数字安全整数、无undefined/稀疏数组均明确。
4. 多事件处理器串行等待本次Promise settle；异步rejection不提交前序半份效果。
5. 任务输出按status判别读取，只有成功才有output；来源沿真实inputRefs，不用目标声明冒充证据。
6. 新ABI结束声明在计划末尾应用，仍不关闭节点。旧根ABI不再接受或转换。
7. Project只读已提交一致快照，不回滚已提交动作，不因页面错误重做真实调用。
8. 条件Hook、循环动态注册和等待后注册不受支持；lint和代表性分支检查不能宣称证明任意程序。

完整维护说明见[模板作者文档](../../../../docs/authoring.md)。实现前必须用真实类型、产物与平台加载器核对，而非仅复制语法示例。
