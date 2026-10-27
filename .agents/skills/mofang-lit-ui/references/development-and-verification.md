# 开发与验证

先读工程 AGENTS、目标面板与相邻调用，检查用户现有改动。公共源码在 `lib/browser/ui/`，入口 `lib/browser/ui/index.ts`；新增组件同时维护导出、类型、独立预览与有意义验证。保留既有默认，单次业务布局不先扩成通用框架。

## 本地预览

`npm run dev:components` 启动 `playground/components/vite.config.mjs`，默认loopback5298。先检查端口与进程归属，已有进程不强停；按任务选择空闲端口，可用 `-- --port <端口>`。缓存使用 `MF_CACHE_DIR=<任务缓存目录>`，临时和依赖缓存遵循所在工作区规则。

左侧按组合示例、布局与容器、表单与选择、反馈与状态、运行过程、图标与业务目录、报告与分析分类。独立页验证组件，组合页验证有限高度、滚动及动作区。预览使用明确fixture；不要为了展示而调用真实能力、创建工作流或发布节点。

常用检查按改动范围选择：

```sh
npm run typecheck
npm run build
npm run verify
npm run test:components
npm run test:reports
npm run test:ui
npm run test:transitions
npm run icons:check
npm run icons:verify
```

浏览器工具可用 `MF_CHROME_PATH` 指定现有 Chrome。类型、产物、本地浏览器与真实平台链路分别报告；组件或样式修改不要求无关后台全链路运行。

## 关键场景

表单验证受控拒绝/归一化、只读禁用、0与清空、非法数字保留、合法步进清错、区间逆序阻止确认。级联验证改上级清下级、搜索、任意层确认、取消、清空、Escape回触发器以及点外保留用户新焦点。弹窗验证取消不保存、确认才保存，重开复制已确认草稿。

布局检查固定footer可达、正文独立滚动、Tab标题没有竖向滚动条、横向标签仍可到达、Card点击不越界且actions独立、长文案/缺图/空态/错误/加载/只读。商品表格检查稳定行key、当页全选范围、不可选原因、分页边界和图片查看。

动画只响应用户显隐/切换或明确展示状态，订阅刷新不重播。下拉与弹窗主要使用opacity/transform，不在退出时撤销其结构性flex布局；`column`等结构属性常驻，关闭内容在可见退场期间不重排。操作文字可禁选，输入、日志、说明与业务结果保留复制。

驾驶舱在中间帧测header/description/content/footer尺寸，不能只看开合终点。检查空闲稳定、连续开合、快速反向、重置尺寸、滚动位置与focus/inert。不得用Observer测量当前动画宽度再写回作为展开宽度。

占位心跳、活动标记与进度平滑变化尊重 `prefers-reduced-motion`；停止展示动画不能改真实节点状态。首次进度直接显示事实，更新才过渡。检查0/100和缺失值。

截图先等待ShadowRoot内有限动画完成，再捕获；`document.getAnimations()`未必遍历阴影根所有子元素。无限心跳不阻塞截图。每张截图打开确认显示正确组件与完整内容，不把淡入起点的透明图当成完成证据。

## 演示用法与输入数据

预览使用 `playground/components/inspector.ts` 的 `workbench(config,content,controls?)` 统一右侧面板，展示中文用法、参数说明和可编辑 JSON；保持与真实节点面板分开。`config` 提供稳定 `id,title,description,usage,parameters`，可选 `data,defaultData,schema,validate,onApply,onReset`。传入 `data` 为默认 fixture；已有 `defaultData` 参数时也明确指向默认 fixture，不能把应用后的对象误作恢复默认来源。

完整选品报告、报告独立区块和店铺弹窗均支持本地 JSON 调试。编辑后先校验，成功才更新演示，失败保持原结果与输入草稿，并显示中文错误；恢复默认同时重置演示状态和编辑器。只接受数据，不执行文本，不将 JSON 当脚本。JSON 不包含 Lit `TemplateResult`、函数、凭据或真实能力调用；来源图标由已知静态入口重建。

报告调试保持真实展示边界：类目和商品 id 不重复，指标必须是有限数字；部分缺失合法，不能为了通过验证补假指标。店铺 `selectedId` 必须指向当前平台可用店铺，取消仍不提交。趋势序列来自输入数值，不从其它计数暗推演示曲线。右侧面板只是预览调试工具，不作为节点业务 API 或保存链路。

JSON 数据和 JSON Schema 分开展示。当前仅为选品报告整理独立 Schema 入口：`playground/components/schema/selection-report.schema.json` 对应组件 `SelectionReportData` 的纯 JSON 部分，`selection-report-demo.schema.json` 对应用户原始七区块演示输入。两者均为 draft-07、本地 `urn` 标识和内部引用；不能互相混用。Schema 只读，实例数据可编辑；基础结构与自定义唯一 id/业务语义校验通过后才应用。Lit 图标、函数回调由调用方接入，不放入 JSON。该入口不把其它组件或后端协议升级为新 Schema 标准。
