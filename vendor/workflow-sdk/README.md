# 工作流浏览器 SDK 核心

此目录是 mf-client 的 mofangsdk/core 构建产物，后台通过本地依赖复用同一份 SDK。
不手工修改 dist；源码与接口仍以客户端 SDK 核心为准。

在 mf-client 中运行 npm run sync:workflow-sdk 重新生成；后台首次接入运行 pnpm install --offline。
已有本地依赖时同步脚本同时刷新 pnpm 的包副本，重新启动后台开发服务后使用新运行时。
后台只读演示 transport 不访问工作流服务，未支持的操作返回 operation_unavailable。
./lowcode 入口另提供显式内存 Mock：上下文和候选数据可读取，候选编辑、放行、移除仅更新内存并校验修订；不调用真实工作流或伪造任务执行成功。其余未模拟方法明确报 operation_unavailable。
