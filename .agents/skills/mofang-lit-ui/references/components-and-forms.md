# 组件选择与受控表单

API 以 [公开导出](../../../../lib/browser/ui/index.ts) 和组件源码类型为准。模板函数接受 props，返回 `TemplateResult`；业务值由调用方持有，组件不保存第二份业务配置。

| 需求           | 优先使用                                                                    | 关键边界                                                                  |
| -------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 卡片/分组      | `card(props,content)`、`section(props,content)`、`formGroup(props,content)` | Card 外层一层；分组不拥有保存链路                                         |
| 文字/链接/标识 | `text`、`url`、`badge`、`fieldLabel`                                        | 链接校验 HTTP(S)；必填与可选需显式声明                                    |
| 文本/多行      | `textField`、`textarea`                                                     | `name,label,value,onChange`，有提示/错误/只读                             |
| 数字           | `numberField`                                                               | `value:number\|undefined`；可选 `min/max/step/integer/spinner/suffixText` |
| 单层/级联      | `selectField`、`cascaderField`                                              | 受控值与临时导航状态分离                                                  |
| 区间           | `rangeField`、`rangeError`                                                  | `value:{min?,max?}`；不静默交换上下界                                     |
| 单选/多选/开关 | `radioGroup`、`checkbox`、`switchField`                                     | 值、禁用与回调均由调用方给出                                              |
| 操作           | `button`                                                                    | `primary`沿原深色，`accent`为蓝色；禁用/加载阻断点击                      |
| 能力选择/配置  | `capabilityCard`、`capabilityPanel`                                         | 只提供开关和配置入口，不调用真实能力                                      |
| 通用弹窗       | `dialog(props,content)`                                                     | 受控 `open`，调用方负责草稿与提交                                         |

`FieldProps` 包含 `name,label,required?,optional?,hint?,error?,compact?`。`compact:true` 使用原型紧凑外观，不改变旧调用默认。`textField` 支持 `suffixText` 和 `suffixIcon`，装饰图标不增加独立交互。要可点击的后缀操作应扩展可访问按钮，不把图标当按钮。

设置面板从宿主 `settings.values/readOnly/onFieldChange` 读写；最终保存继续由宿主处理。`undefined` 删除显式字段，`0` 是有效数字，`null` 只按实际契约使用。没有回调或只读时字段不可编辑。数字越界/非法输入不回写宿主，原非法输入在其它字段刷新时保留；合法输入、清空及合法步进清除对应错误。不要用 `Number(value)||0` 处理空值。

```ts
numberField({
    name: 'count',
    label: '候选商品数量',
    value: count,
    min: 0,
    max: 100,
    integer: true,
    spinner: true,
    compact: true,
    onChange: (value) => {
        count = value
    },
})
rangeField({
    name: 'price',
    label: '价格区间',
    value: price,
    min: 0,
    suffixText: '$',
    compact: true,
    onChange: (value) => {
        price = value
    },
})
```

`rangeError(price)` 在最低值大于最高值时返回错误；单值数值边界由数字组件检查，跨字段错误由调用方阻止确认。清空一个端点会删除该字段，不转换成零，也不自动填另一个端点。业务币种应来自已核实的平台站点关系，示例美元不能变成默认真实币种。

`selectField` 的值是字符串，清空选项回调 `undefined`；选项为 `{value,label,disabled?}`。键盘方向键、Home/End、Enter、Escape、Tab 与点外关闭沿组件实现复用。

`cascaderField` 接受 `{value: readonly string[],options,onChange}`，每个选项为 `{value,label,disabled?,children?}`。打开复制已确认路径到临时草稿；更改上级清除下级。允许确认任意已选层级；搜索结果仍需确认。取消、Escape 和点外不提交；Escape 返回触发器，点外不抢走用户新焦点。清空立即提交空路径并关闭。需要仅叶子选择等不同业务规则时，先确认规则再扩展，不在页面暗中改变。

弹窗打开时由调用方复制草稿；关闭按钮、Escape、遮罩和取消只走 `onClose(reason)`，确认才提交。关闭过渡期间保留本次内容，下一次打开重置草稿，避免退场内容突然重排。`capabilityPanel` 组合 `dialog`、取消/确认 footer，接 `onConfirm/confirmDisabled`；校验失败保持草稿。`capabilityCard` 的 `required` 隐藏开关，`disabled` 阻断操作，配置点击不切换能力。

Card 的 `variant:'compact'` 可配 `icon/selected/onClick` 形成步骤卡。普通Card仍是容器；可点击Card将点击范围限定在自身，`actions` 独立可用。避免用嵌套按钮包住整张含表单卡片。

## 发布店铺选择

`publishShopDialog({open,productTitle,productStatus?,batchCount?,platformId,platformLabel,platformIcon?,shops,selectedId,onSelectionChange,onConfirm,onClose,onAuthorize?})` 是单选弹窗。`shops` 的每项为 `PublishShop`：`id,platformId,regionLabel,name,account?,defaultCategory?,disabledReason?`。组件只展示目标平台的店铺，保留调用方顺序；不根据未知创建时间排序。批量商品统一绑定同一家店铺，不变为多选。

`selectedId` 是本次弹窗草稿。打开时由调用方复制已提交店铺；没有有效已提交值时，可按已确认业务规则预选首个可用店铺。`onSelectionChange(id)` 只更新草稿，确认才调用 `onConfirm(shop)`；取消、Escape、遮罩和关闭不修改已提交值。退场期间保留本次草稿，下次打开再重置。禁用原因可见，键盘方向键/Home/End 跳过禁用店铺。

无店铺时可传 `onAuthorize` 交接宿主授权入口。组件不执行真实授权、绑定或发布。平台图标由调用方传静态按需入口，如 `tiktokShopIcon()`，不为一个弹窗引入动态全量目录。

下拉浮层打开时跟随触发器所处 ShadowRoot、slot 祖先和视口滚动/缩放，不以滚动自动关闭代替跟随；触发器完全离开视口后关闭。关闭或卸载释放定位监听，rAF 合并同一帧更新。触发器右侧箭头按 `aria-expanded` 在 0/180 度间短过渡，快速反向保持当前状态，滚动定位不重播，减少动态效果时直接切换方向。
