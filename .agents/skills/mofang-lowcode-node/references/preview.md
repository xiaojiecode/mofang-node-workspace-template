# 预览和发布边界

预览使用共享 PageRenderer、工作流适配器和本地 Mock SDK，不挂编辑器。用户可试填、勾选、点按钮；修改组件、事件、数据源都通过 AI。

`lowcode preview` 只返回 URL，不启动服务。先确认端口是否占用。正常、空结果、读取失败和只读均需验证；设置的模拟保存/取消不修改页面源文件。AI apply 后预览可跟随合法 revision；暂停跟随后需显式加载新版本，加载会重置试填。

交付前核对标题、长文本悬停、窄视口与主操作可达性，记录浏览器错误、网络请求、页面版本。源码预览与 `?artifacts=true` 产物预览分别验证。Mock 成功不代表真实 Tool 执行、远端保存或发布成功。

发布准备使用 build/verify 和 `panels:prepare --code <编码> --surface <面板> --catalog-file <真实目录回读快照> --out <新请求文件>`。命令只生成请求正文，不发请求；禁止编造 catalogInstanceId/catalogRevision。Puck 使用原生 lowcode config，不能再包成 Lit。

按用户授权使用既有平台 CLI 保存/发布。保存 settings 后回读当前修订，再准备 business；页面保存、面板发布、执行定义采用、工作流版本和新运行分别记录。正式 frontend 必须支持 settingsFormId 和当前包版本；不把新包降级塞入旧 runtime。
