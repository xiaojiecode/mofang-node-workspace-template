# 官方节点基础组件

本目录是官方节点基础组件的维护源，随模板初始化进入新工程，已有工程通过 `upstream sync` 合并更新。组件与引用它的面板一起打包；更新本地源码不等于发布平台面板。

全部通过 `@mofang/browser` 导入，以 Lit 模板函数组合。面板继续使用 `static styles = panelStyles`，已有 `button`、`textField`、`numberField`、`selectField`、`dataTable` 和 `pager` 调用保持可用。不注册全局业务组件，不引入另一份 Lit 或页面框架。

## 展示与操作

| 组件                                        | 参数与职责                                                                                                     |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `text(props)`                               | `value`、`size`、`tone`、`weight`、`numeric`；`lines` 截断并提供可展开全文                                     |
| `url(props)`                                | `href`、`label`、`newTab`；完整 HTTP(S) 链接默认外部打开，无效地址显示为文字                                   |
| `button(props)`                             | 保留 `label/onClick/variant/disabled/title`，增加 `loading/type/size/expanded/controls`；`danger` 表示危险操作 |
| `section(props, content)`                   | 标题、说明、工具区与内容；`collapsible` 保留原生 summary 键盘入口并使用高度过渡，`label` 可补充可访问名称      |
| `tabs(props)`                               | 稳定唯一 `id`、`label`、`value`、`items`、`onChange`；键盘切换，非活动页保留 DOM 并隐藏                        |
| `badge(label, tone)`                        | 只展示业务状态，语义颜色为 neutral/info/success/warning/danger                                                 |
| `emptyState(title, description?, actions?)` | 空态及调用方提供的下一步                                                                                       |
| `statusNote(title, message, kind?)`         | 保留原调用方式，补充 warning/success；错误使用 alert，信息使用 status                                          |

页签的 `value` 由调用方维护。值不在可用项中时展示首个可用项，不回调改写业务状态。主动切页使用 160ms 淡入，普通内容刷新不重启动画。切页保留输入，但移除某个 item 或整个页签组件会卸载对应内容。`id` 必须在同一 ShadowRoot 中唯一，item 的 `value` 必须唯一且稳定。

## Card 容器

`card({ title?, description?, actions? }, content)` 提供白底、细边框和 14px 圆角和轻阴影的外层容器。标题、说明和操作区均可省略，默认内容内边距为 24px。最外层 Card 在宽宿主使用 12px 外边距，宿主宽度不超过 640px 时使用 8px，满高业务卡片同步扣除上下外边距。节点可在设置/业务面板外层使用一层 Card；业务抽屉由节点布局指定内边距与高度，内部使用 Section 分组，避免嵌套卡片挤占空间。

```ts
card({ title: '商品信息', actions: button({ label: '刷新', onClick: reload }) }, html`<p>内容</p>`)
```

`button({ variant: 'primary', ... })` 使用与客户端默认按钮一致的黑底白字：背景 `#34322d`、悬停 `#2f2c29`、文字白色；禁用状态保持颜色并降低透明度，键盘焦点使用灰色焦点环。

按钮默认高 36px；`size: 'small'` 高 32px，`size: 'panel'` 使用客户端节点按钮规格（32px 高、4px 圆角、13px 字号）。

## 输入与表格

`textField`、`textarea`、`numberField`、`selectField`、`checkbox` 均以回调更新调用方草稿。没有回调或处于只读状态的字段禁用。数字清空回调 `undefined`，非法数字不写入草稿；候选编辑和设置保存继续由原业务或宿主负责。

`textField` 和 `textarea` 支持 `error`、`hint` 与 `ariaLabel`，说明和错误通过 `name` 生成的 ID 关联。每个表单内使用唯一 `name`。`checkbox` 支持 `indeterminate`、禁用原因 `title` 和只显示方框的 `labelHidden`；隐藏文字时仍必须提供可访问的 `label`。

`selectField` 使用顶层 Popover 下拉列表，支持键盘导航、键入匹配、点外关闭、空值删除以及选项 `disabled`。`labelHidden` 隐藏视觉标签但保留可访问名称，分页条也使用同一选择器。

`dataTable(rows, key, columns, options)` 增加 `label` 和 `loading`。加载且没有数据时展示骨架，有数据时保留现有行；选择集合、翻页、筛选和业务权限均由调用方管理。`key` 应是稳定唯一的行身份，重排不会重建行内图片或输入。全选只作用于当前传入的可选行，部分选中显示半选态。表格不会额外排序或发起请求。

## 图片

```ts
image({
    ...(product.images?.[0] ? { src: product.images[0].url } : {}),
    alt: product.basic?.title || '商品图片',
    width: '64px',
    height: '64px',
    fit: 'contain',
    images: (product.images ?? []).map((item) => ({ src: item.url, alt: '商品图片' })),
})
```

在启用 `exactOptionalPropertyTypes` 的代码中，源可能不存在时省略 `src`，或通过条件展开传入。`image` 默认尺寸为 48px，等比完整显示；`cover` 可裁剪填充，`preview: false` 关闭查看入口。加载中使用骨架，缺图和失败各有可访问名称。源变化重置加载状态，旧请求不能覆盖新图。

`imageViewer({open, images, index, onIndexChange, onClose})` 是独立受控查看器。原生 `dialog` 进入浏览器顶层，避免表格、抽屉的 overflow 裁切；支持前后切图、左右方向键、100%–300% 缩放、适应窗口、关闭及 Esc。缩放后可滚动查看完整画面。HTTP(S) 图片提供打开原图入口，关闭后焦点返回触发器。源数组变化时，调用方应提供有效的 `index`；无对应图片时不打开。

网络图接受 HTTP(S) 地址，本地预览支持图片 data URL 和 HTTP(S) 来源的 blob URL。所有文字按 Lit 文本绑定渲染，不插入原始 HTML。查看器使用 180ms 缩放过渡，退出结束后关闭原生 dialog 并恢复焦点；关闭后释放查看内容。组件卸载立即释放模态状态。

## 主题、骨架和过渡

默认内容底色为 **白色**，不继承客户端灰白色 `--background`。确需显式换底色时设置 `--mf-panel-background`；前景、边框、辅助文字等仍可沿用宿主语义变量。节点独立样式只负责布局，控件状态由 `panelStyles` 统一提供。

骨架使用 `skeleton()`。`fade/slide/scale/collapse` 的接口和生命周期见 [过渡说明](components/transition.md)。过渡只用于明确的展开、收起，不在订阅刷新时重播页面动画；系统减少动态效果时直接切换。

## 预览与验证

```sh
MF_CACHE_DIR=/path/to/task-cache npm run test:ui
MF_CACHE_DIR=/path/to/task-cache npm run test:transitions
```

可用 `MF_CHROME_PATH` 指定 Chrome。生成 `ui/preview.html` 组件总览及截图，验证可读和压缩产物。`tooling/verify/browser.mjs` 验证真实节点源码/产物的本地 Mock 交互；这些验证不代表平台发布或真实业务链路验收。

## 状态更新与布局稳定

反馈区是否固定高度、表格与操作区如何分配空间由节点负责，组件不绑定特定业务的布局尺寸。表格通过稳定行 key 保留 DOM，加载状态保留已有数据与选择列；按钮加载图标不挤动文字。过渡只响应显式显隐变化，普通重渲染不重播动画。

节点可参考 `mofang-node-ui-design` 技能验证同一数据集的状态切换、滚动位置与布局稳定性；组件交互和动画回归由 `test:ui`、`test:transitions` 维护。组件不管理任务、候选、权限或发布，业务层继续负责这些规则。

## 维护与兼容

新增通用组件同时维护本目录导出、说明、组件总览和相关回归。已有调用参数保持可用；调整公开参数、默认交互或主题时先确认影响，再验证原有节点和冷初始化工程。业务专属页面、查询参数与节点执行逻辑留在各自工程，不放入官方基础组件。

本版默认采用白色背景、Card 容器、顶层 Popover 下拉及图片查看器。`selectField` 的受控 `value/onChange` 调用方式保持一致，DOM 从原生 select 变为 combobox/listbox；使用方的浏览器测试应按角色和可访问名称定位，不依赖原生 select 标签。无需引入第二份 Lit、独立 npm 包或全局业务组件注册。
