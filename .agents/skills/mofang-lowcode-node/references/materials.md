# AI 物料选用与组合

搭建表单、选择列表、行详情或配置事件时读取本页。这里解释选型和组合；完整参数以当前安装包的 catalog 为准，避免维护另一份全量组件清单。

## 先查目录，再确定配置

```sh
node tooling/cli.mjs lowcode guide
node tooling/cli.mjs lowcode catalog --category material --query 表格
node tooling/cli.mjs lowcode catalog --id DataTable
node tooling/cli.mjs lowcode catalog --id field
node tooling/cli.mjs lowcode catalog --id value-ref
node tooling/cli.mjs lowcode catalog --id operations
```

目录返回名称、description、参数 schema、默认示例、slots、事件、绑定和约束。列表有分页，继续按 nextOffset 查询；精确 ID 查询用于确认真实字段和枚举，中文用途描述不足时结合 schema 和示例判断。目录缺少某项能力时报告缺口，不把未经支持的字段写入页面假装实现。

区分四类身份：

| 身份 | 示例 | 用途 |
| --- | --- | --- |
| 物料 ID / 组件 type | DataTable | 决定用哪一种组件 |
| 组件实例 props.id | 工具生成的 component-… | 定位页面里的某一个组件，局部修改保留它 |
| 逻辑 ID | fieldId、formId、tableId、eventId | 关联字段、表单、选择状态和事件；不同控件可能引用同一逻辑对象 |
| 字段 name | singleUrl | 宿主配置和节点输入 Schema 使用的键 |

## 常用选型

| 需求 | 优先查询 | 组合要点 |
| --- | --- | --- |
| 简单分组、纵向或横向排版 | Section、Stack | 使用目录声明的 content 插槽，间距写在容器上 |
| 保存一组配置字段 | Form | 字段 formId 与所属 Form 一致；settingsFormId 绑定宿主草稿 |
| 普通文本 / 多行文本 | TextField、TextareaField | fieldId 连接逻辑字段；提示用 placeholder，必填及格式规则写在字段上 |
| 少量互斥选项 | ConfigField | 单选使用 `kind: "choice"`，不是自行猜测 radio 类型 |
| 较多选项的下拉选择 | SelectField 或 ConfigField | 后者使用 `kind: "select"`；选项及远端映射查 field/source |
| 比较多条数据并勾选 | DataTable、SelectionSummary | 固定 tableId、稳定 rowKey；摘要和提交读取同一表格的选择状态 |
| 自定义卡片或图片列表 | Repeater、Text、Image | 循环内使用 row，适合不需要表格列对齐的内容 |
| 行内详情、操作菜单 | 表格 cell 模板、ActionButton、dialog | 表格列引用 cellTemplateId；事件携带当前 row 到 dialog.record |
| 展示文字、图片、链接 | Text、Image、Link | 只显示来源实际提供的数据；长文字截断保留全文入口，无图有明确空态 |
| 调用节点动作 | ActionButton、event、SDK 目录 | 按当前动作 payloadSchema 组装参数，写动作受只读和忙碌状态约束 |

## 示例：单条 / 多条链接表单

先 inspect 找到 settings 表单的组件 ID 和 formId。以下是 apply 请求示例：替换 nodeCode、expectedRevision 和 `<Form组件ID>`；如果实际表单不是 main1，同时替换 formId。

```json
{
    "nodeCode": "docs-example",
    "surface": "settings",
    "expectedRevision": "<inspect返回的revision>",
    "operations": [
        {
            "op": "field.upsert",
            "id": "linkMode",
            "value": {
                "name": "linkMode",
                "formId": "main1",
                "label": "采集链接形式",
                "type": "string",
                "defaultValue": "single",
                "options": [
                    { "label": "单条", "value": "single" },
                    { "label": "多条", "value": "multiple" }
                ]
            }
        },
        {
            "op": "component.add",
            "type": "ConfigField",
            "parentId": "<Form组件ID>",
            "props": { "fieldId": "linkMode", "kind": "choice" }
        }
    ]
}
```

再按同样方式建立两个 string 字段 singleUrl 和 multiUrls，默认值为空，分别配 TextField、TextareaField。两个字段各自保留草稿；节点代码只读取当前模式的字段。

单条控件的 visibleWhen 示例，多条控件将 right.value 改成 multiple：

```json
{
    "operator": "equals",
    "left": { "from": "form", "formId": "main1", "path": ["linkMode"] },
    "right": { "from": "constant", "value": "single" }
}
```

逻辑字段设置 required、requiredMessage、pattern、validationMessage，隐藏草稿不提交时使用 submitWhenHidden=false。验证当前可见字段的空值、每一行格式、切换后的草稿保留及取消恢复。HTTP(S) 格式校验不证明商品真实存在；限制域名或商品路径需来自业务能力合同。

新增组件前先 inspect，已有对应字段或控件时使用 upsert/update，避免重复添加。Form 内放表单控件，DataTable 放在表单之外。

## 示例：采集结果、勾选输出和行详情

1. 核对节点真实投影和动作 Schema。DataTable 的 rowKey 选择结果里稳定且唯一的身份；不要用行号或猜测的商品 ID。
2. 将表格 rows 绑定到 host.nodeView.rows。需要整理状态文案或禁选标记时，使用 host 数据源和 transform 脚本，消费 input.data；绑定字段须与转换结果一致。
3. 以 selectionDisabledPath 指定不可选行的标记。SelectionSummary 与提交按钮使用相同 tableId，未选中、只读或节点未就绪时禁用提交；后台重新校验实际选项。
4. 创建 cell 模板，在其中加入「详情」ActionButton，再将表格操作列的 cellTemplateId 指向它。cell 根为 `$cell:<id>`，当前行绑定为 `{ "from": "row" }`。
5. 创建 dialog，指定独立 formId、title、initialBindings 和 content。按钮事件使用 dialog.open，把当前 row 放入 input.record。

打开详情的事件步骤示例：

```json
{
    "id": "open-details",
    "type": "dialog.open",
    "targetId": "product-details",
    "input": { "record": { "from": "row" } }
}
```

在 `$dialog:product-details` 内放 Text/Image/Link 等展示控件，绑定当前记录字段。例如商品标题：

```json
{ "from": "dialog", "path": ["record", "title"], "fallback": "暂无标题" }
```

弹框内容明确使用 dialog.record；不要在弹框根上使用只适合行内的 row 绑定。纯查看详情使用宿主自带的关闭入口即可；只读详情不增加确认提交事件，也不改变列表选择。详情说明文案是否可配置需查当前物料能力，不能伪造未支持的属性。

带参数的提交按钮使用 host.action，actionId 为 workflow.nodeAction.run。input 包括真实 runId、nodeInstanceId、name、payload、candidates 和 expectedSessionRevision。选择项可用 `{ "from": "table", "tableId": "products", "path": ["selectedIds"] }` 读取；payload 的键名和候选参数由节点动作合同决定，不将某个示例的 keys 套到所有节点。

## 脚本、数据源和能力缺口

优先用字段规则、绑定和事件步骤表达交互。复杂计算、验证、转换、事件分别查 compute、validate、transform、event 脚本合同；需要 SDK 时同时查询 `catalog --category sdk --id <方法路径>`，声明 service:workflowSdk 依赖并按生命周期清理订阅。

用 host 读取节点投影，用 local 样本验证映射，第三方 HTTP 接线按[数据源说明](datasources.md)。页面配置不保存凭据，设计态与普通渲染不执行写入。完整 SDK 不意味着可以越过宿主权限或把真实采集放进展示脚本。

能力不足时记录“缺什么、影响哪项交互、需要修改页面还是共享物料”，保留可运行的已支持部分，并明确未实现项。新增物料通过源码构建和分发补入目录后再配置；维护流程见[接入说明](../../../../docs/lowcode.md#物料维护与版本核对)。

## 完成条件

apply 返回成功且整包 validate 通过，引用、节点身份和 surface 一致。预览实际加载最新 revision；验证初次打开、重新加载、空数据、错误、只读、表单切换、详情对应行、选中输出和长文本全文入口。记录模拟和真实链路的证据边界，发布前按[预览与发布](preview.md)核对。
