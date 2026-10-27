# 作者接口与保存

先运行平台CLI guide取得作者条件，再用指定环境profile运行doctor --bundle核对实际validate；describe仅是离线目录，不证明远端ABI。默认只读取许可工具元数据与双Schema，不执行Tool取样。作者请求使用 code/name/description/icon/category/inputSchema/outputSchema/timeoutSeconds/source/tools/maxToolCalls，更新携带最近读取的 expectedCatalogInstanceId/expectedCatalogRevision。maxToolCalls为完整子任务跨阶段累计正预算，按[作者规范](../../../../docs/authoring.md)核算分支与轮询；仅publish_message/ctx.message免计，其它内置工具仍计数。不能因当前没有外部调用就传非法值，远端规则须按实际部署核对。

目录保存、指定实例采用、两个surface发布、新起跑是不同操作，逐次回读身份与修订。历史冻结源码/Schema/页面不因模板升级替换。平台校验与本地Goja/fixture、数据库/Tool/浏览器真实链路分别报告；目录校验不证明业务已通过。操作清单见[平台CLI](platform-cli.md)，作者规范见[模板文档](../../../../docs/authoring.md)。
