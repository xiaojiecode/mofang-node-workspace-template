import { c as e, f as t } from "./split-layout-CBltrNgl.js";
const l = {
  Repeater: "循环容器",
  Tabs: "标签切换",
  Section: "分组卡片",
  Stack: "布局容器",
  Form: "表单",
  SplitLayout: "分栏",
  ScrollPanel: "滚动面板",
  WorkflowProcess: "节点处理信息反馈",
  ExecutionResult: "执行结果进度",
  ThinkingProcess: "当前节点执行",
  Link: "链接",
  Text: "文本",
  Image: "图片",
  Badge: "状态标签",
  TextField: "输入框",
  NumberField: "数字输入",
  TextareaField: "多行输入",
  SelectField: "下拉选择",
  SwitchField: "开关",
  ConfigField: "设置表单项",
  RecordListField: "可增删明细表单",
  ActionButton: "操作按钮",
  DataTable: "数据表格",
  SelectionSummary: "选择摘要",
  Pagination: "分页器"
}, i = {
  Repeater: { gap: 6, content: [] },
  Tabs: {
    label: "标签切换",
    items: [
      { value: "all", label: "全部" },
      { value: "other", label: "其他" }
    ],
    defaultValue: "all",
    variant: "default",
    eventId: ""
  },
  Section: { title: "内容分组", content: [] },
  Stack: { direction: "column", gap: 16, content: [] },
  SplitLayout: {
    direction: "row",
    gap: 12,
    wrap: "nowrap",
    widthSizing: { ...t },
    heightSizing: { ...t, mode: "fixed", value: 640 },
    panes: [
      e("pane-1", "分区 1"),
      e("pane-2", "分区 2")
    ]
  },
  ScrollPanel: { header: [], content: [], footer: [] },
  WorkflowProcess: {
    title: "",
    eventId: ""
  },
  ExecutionResult: {
    dataSourceId: "",
    eventId: "",
    status: "queued",
    total: 0
  },
  ThinkingProcess: { footer: [] },
  Link: { text: "商品来源", href: "", eventId: "" },
  Form: { formId: "main", content: [] },
  Text: { text: "文本内容" },
  Image: { src: "", alt: "商品图片", width: 64, height: 64 },
  Badge: { text: "状态", variant: "secondary" },
  TextField: { fieldId: "", placeholder: "请输入" },
  NumberField: { fieldId: "", placeholder: "请输入数值", step: 1 },
  TextareaField: { fieldId: "", placeholder: "请输入", rows: 3 },
  SelectField: { fieldId: "", placeholder: "请选择" },
  SwitchField: { fieldId: "" },
  ConfigField: { fieldId: "", kind: "text", layout: "vertical" },
  RecordListField: {
    fieldId: "",
    itemLabel: "条目",
    addLabel: "添加条目",
    columns: [{ key: "name", label: "名称", kind: "text" }]
  },
  ActionButton: { label: "操作", eventId: "", variant: "default" },
  DataTable: {
    tableId: "",
    dataSourceId: "",
    rowKey: "id",
    columns: [],
    selection: !0,
    pageSize: 20
  },
  SelectionSummary: { tableId: "", text: "已选择 {count} 项" },
  Pagination: { tableId: "", dataSourceId: "", pageSizeOptions: [10, 20, 50] }
}, o = {
  layout: {
    title: "布局",
    components: [
      "Section",
      "Stack",
      "Form",
      "SplitLayout",
      "ScrollPanel",
      "Repeater"
    ]
  },
  form: {
    title: "表单",
    components: [
      "TextField",
      "SelectField",
      "SwitchField",
      "ConfigField",
      "RecordListField"
    ]
  },
  display: {
    title: "展示",
    components: [
      "Tabs",
      "Text",
      "Link",
      "Image",
      "Badge",
      "DataTable",
      "SelectionSummary",
      "Pagination"
    ]
  },
  business: {
    title: "节点业务组件",
    components: ["WorkflowProcess", "ExecutionResult", "ThinkingProcess"]
  },
  action: { title: "操作", components: ["ActionButton"] }
};
export {
  l as a,
  o as b,
  i as m
};
