# 报告与分析

选品报告复用公开报告区块和统一表格，全部从 `@mofang/browser` 导入，样式仍用 `panelStyles`。数据类型在 `lib/browser/ui/report/types.ts`；本地演示在 `playground/components/report.ts`。不要复制 Vue 原型、硬编码业务公式、引入第二份 Lit 或为折线图增加整套图表依赖。

## 独立区块

| 组件                      | 主要输入                                                           | 边界                                                              |
| ------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `reportMetricCard`        | `label,value?,unit?,description?,note?,source?`                    | 数字零保留，缺值显示 `—`；复用 `card`                             |
| `reportScore`             | `label,value?,max?,description?,source?`                           | 默认满分 100；有效区间内用 meter 语义，缺失/非法/越界不绘制评分条 |
| `reportTrend`             | `title,accessibleLabel,series,color?,unit?,summary?,note?,source?` | `series: readonly {label,value?}[]`，按数值绘线，不内置演示序列   |
| `reportOpportunityMatrix` | `title,x,y,description?,conclusion?`                               | 每轴 `{label,value?,threshold}`，阈值必须明确传入，缺数不判断象限 |
| `reportCategoryTable`     | `categories,selectedId?,sortKey,onSortChange,onSelect,caption?`    | 复用 `dataTable`；score/units/gmv 排序与选择受控                  |
| `reportSourceBadge`       | `{label,icon?,description?}`                                       | 图标为调用方按需传入的 `TemplateResult`，不导全平台图标           |
| `reportActionCard`        | `title,description,step?,sources?,action?`                         | `action:{label,onClick}` 只回调，不自动执行真实能力               |

`reportTrend` 支持零值、负值、单点、空序列和中间缺失值；缺值断线，不插值伪造事实。数据点可键盘聚焦并有数值说明，原生悬停标题和可展开数值表同时保留。实现不使用渐变 ID，不会在多个实例间串色。折线颜色与单位由调用方提供；不要根据标题推断美元、百分比或真实搜索量。

类目表 `ReportCategory` 的 `units/promoters/newUnits` 是计数，`gmv` 配 `currencyCode`。`growth/searchMomentum/*Concentration/*Overlap` 使用百分数，例如 38 表示 38%；缺失值不能补零。GMV 缺币种会注明；已知货币混合或币种缺失时禁用 GMV 比较，不能把不同币种的原始金额直接排序。缺少排序指标的项排末尾，不改调用方数组。

## 组合报告

`selectionReport({data,selectedId?,sortKey,methodOpen,onSelect,onSortChange,onMethodOpenChange,onViewList?})` 组合推荐、同级比较、三榜、需求趋势、双源机会/矩阵、供给、商品和行动。所有状态由调用方持有。`data: SelectionReportData` 包含 `title,context,categories`，其余来源、口径、阈值、说明可选；`context` 为 `{label,value}[]`，不内置国家、时间或分析层级。

`ReportCategory` 的 `demand` 为趋势图 props 数组，`products` 为 `ReportProduct[]`，`actions` 为行动卡 props 数组。商品价格只使用明确的 `price/currencyCode`。`summary/conclusion` 是报告事实或作者结论，组件不从其它数字推算“推荐成功”。不存在的 `selectedId` 只提示先选择，空类目列表显示空报告。

`matrixThresholds:{platform,search}`、`scoreDescription`、`methods:{title,formula?,description}[]` 明确配置判断与口径。不能将原型的 70/30、45/30/25 或达人计数乘 0.33 写成组件默认；用户提供的演示数字与风险扣分说明原样展示，不自行重算或补齐。方法弹窗 `methodOpen` 受控，查看选品列表只回调 `onViewList`。

示例报告必须传清楚的 `sampleLabel`。宿主有限高度时设置父层 `min-height:0`，报告自身滚动；报告外部不叠第二层正文竖向滚动。真实生成、保存、权限、发布与节点推进由业务层接线，组件预览不代表这些链路已经验证。

```ts
const data: SelectionReportData = {
    title: '选品报告',
    sampleLabel: '本地示例，非真实市场报告',
    context: [{ label: '站点', value: '待提供' }],
    categories: [{ id: 'sample', name: '示例类目', units: 0 }],
}
selectionReport({
    data,
    selectedId: 'sample',
    sortKey: 'score',
    methodOpen: false,
    onSelect: (id) => {
        selectedId = id
    },
    onSortChange: (key) => {
        sortKey = key
    },
    onMethodOpenChange: (open) => {
        methodOpen = open
    },
})
```

按改动运行 `npm run typecheck`、`npm run test:reports`；覆盖完整/空/缺失/长报告、排序选择、零/负/缺/单点图表、口径 modal、回调、有限高度末行可达。真实平台报告另行验收。

本地组件目录中的完整报告与七类独立区块采用统一右侧用法/输入数据面板，可折叠以检查宽内容。编辑数据不会改变公共报告 API，也不会请求报告生成。实际节点使用组件时无需带入这个调试面板。

当前用户提供的原始演示 JSON 保存在 `playground/components/fixtures/selection-report.json`。完整报告通过 `mapReportFixture` 做本页结构映射，独立区块直接使用原顶层输入；默认 JSON 编辑器与恢复默认均指向该文件。原始数值、文案和来源说明保留，三张已有商品图片仅映射为本地导入地址。该数据包含第三方整理/估算与相对搜索研究指数，不代表本轮已经核验的官方实时事实。

展示标签必须与调用方数据口径一致。`SelectionReportData.vocabulary` 可配置 `metrics`、`performance`、`supply`、`products` 和 `demandDescription`；独立类目表传同一份 `labels: data.vocabulary?.metrics`。省略时保留原榜单样本默认。月度类目 GMV 不能标为 Top-K 商品成交额；没有统计窗口、去重或集中范围时明确写“窗口未提供/口径未提供”，不能把默认 3 日、Top 5 或固定分母套到用户数据上。标签配置仅改变说明，不计算或修改原始数值。
