# 布局、表格与运行展示

组件样式统一来自 `panelStyles`，业务样式只负责布局和已确认的宿主尺寸。设置侧栏、有限高度业务抽屉和共同宿主必要动作区的责任遵守 Lit 面板技能；不要把预览的固定尺寸直接套到所有宿主。

`flow({direction:'horizontal'|'vertical',gap?,wrap?,align?,justify?},content)` 是普通流式布局，没有 DAG、执行或状态推进语义。`footer({leading?,actions?})` 固定在调用方容器末尾；调用方采用 `display:flex;flex-direction:column;min-height:0`，正文 `flex:1;min-height:0;overflow:auto`。不把 footer 定位到浏览器窗口，也不重复设置宿主保存按钮。

`tabs({id,label,value,items,onChange,variant?})` 默认保留旧分段外观；`variant:'underline'` 为蓝色下划线。item 为 `{value,label,content,disabled?}`，值与 ID 稳定唯一。方向键/Home/End 跳过禁用项，非活动内容保留 DOM 并隐藏/inert，切页保留输入。标题区不独立竖滚动，内容区由宿主安排滚动；很多标签允许横向可达，不用裁切隐藏末项。

## 表格

`dataTable(rows,key,columns,options)` 负责渲染和回调。列为 `TableColumn<Row>`：`title,cell,width?,align?`；稳定 `key(row)` 用于保留行、图片和输入 DOM。`options` 含 `selection,empty,rowState,loading,label,error`。`error:{title,description?,onRetry?}` 优先展示错误与可选重试回调，表格不执行请求。加载但已有数据时保留行，显示刷新提示并禁用行选择；调用方同时把分页设为 busy。空列表加载显示骨架，实际无数据使用空态。

`TableSelection` 为 `selected:ReadonlySet<string>`、`disabledReason(key)`、`onToggle(key,checked)`、`onToggleAll(keys,checked)`。全选仅针对本次传入的可选行；跨页选择保留、筛选时是否清除由业务层明确决定，表格不推断。只读可保留选择列并返回禁用原因，避免状态切换挤动布局。

商品表格复用 `productCell(product,secondary?)`、`image`、`text`、`url`、`money(value,currency)`、`percent(value)`，列仍由业务定义，不复制一套商品表格控件。缺失价格/指标显示占位，不补零；`percent` 接受 0–100，`money` 不猜币种。完整商品结构来自 `@mofang/contracts/business`，不要把第三方原始对象强转成 Product。

`pager({page,pageSize,total,onPage,pageSizes?,onPageSize?,busy?})` 仅报告翻页。总数来自真实结果，不能从当前页长度猜全量。表格与分页的容器排布由宿主负责。当前商品表格预览默认把分页固定在容器底部，正文独立滚动；可选 `after-rows` 演示让分页跟随全部行之后。这是预览宿主布局状态，不是 `pager` 的公开参数。两种布局均不能覆盖末行或产生两个正文竖向滚动层。

## 反馈和过程

| 需求        | 组件                                                            | 数据责任                                     |
| ----------- | --------------------------------------------------------------- | -------------------------------------------- |
| 提示/空态   | `statusNote`、`emptyState`、`skeleton`                          | 区分加载、零结果、权限、错误                 |
| 状态条/警告 | `nodeStatus`、`warningCard`                                     | 标题、说明、色调、操作均由调用方提供         |
| 进度        | `progressBar({label,value?,onClose?})`                          | 真实百分比；缺值为不确定进度，不估算业务完成 |
| 占位心跳    | `nodePlaceholder({title,animate?,icon?,description?,actions?})` | `animate`仅展示动效，与标题所述状态独立      |
| 执行图标    | `activityIcon({kind,running?})`                                 | kind为loading/execute/activity/sparkle       |
| 过程        | `executionAccordion`、`timeline`                                | 受控展开、稳定行ID、传入耗时，无自行计时     |

`placeholder({title,description?,icon?,actions?,variant?})` 用于普通空内容，`variant` 为 `panel/inline/page`；图标/插图和动作由调用方给出，不推断加载或业务状态。`nodePlaceholder` 专门展示节点的可选心跳图标，不把两者混为真实执行状态。

`progressBar` 首次直接显示当前值，后续填充宽度短过渡；0/100有效，非法数值不作为进度。`nodePlaceholder` 只包含图标、细圆环和标题等传入内容，不自动附加骨架或三点。`timeline` 的条目包含 `id,title,description?,icon?,tone?,current?,content?`；`running` 只控制活动标记心跳。`executionAccordion({id,title,tag?,elapsed?,open,onOpenChange,rows,emptyText?})` 只展示传入日志，row为`{id,tag,text,tone?}`；普通日志刷新不重启动画。

## 驾驶舱

`cockpit({id,title?,description?,collapsed,onCollapsedChange,nodes,running?,footerAction?})` 组合节点时间线、警告、Agent过程、能力小卡、来源和输出。`nodes` 中各节点包含真实 `id/title/status`，可选 `statusTone/controlLabel/icon/notice/processTitle/process/capabilities/sourceContent/outputContent`。状态色调不等于服务端状态枚举，动作由调用方回调。

宿主明确展开内容宽度，例如在实际宽340px且左边框1px的侧栏设 `--mf-cockpit-content-width:339px`。该值来自当前宿主，不是组件通用默认尺寸。收起由外层宽度裁切到44px，内部按稳定展开宽度排版；header、description、正文和footer不得随壳体每帧压缩。父高和底部其它控件占位也保持稳定，禁用尺寸Observer测量→写回→再测量的自反馈。

正文独立滚动，顶部和底部动作可达。收起立即 inert，DOM、日志与滚动位置保留；展开恢复。没有真实来源/输出时使用空态，不能填模拟业务成功。
