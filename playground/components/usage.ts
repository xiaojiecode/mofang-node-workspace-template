/** 用法文字跟随真实模板函数；右侧编辑仅改变本地演示状态。 */
const examples: Record<
    string,
    readonly [string, readonly Readonly<{ name: string; description: string }>[]]
> = {
    card: [
        '// 内容由宿主传入，selected 只表示当前选择\ncard({ title: "选品调研", description: "调研范围", selected: true }, html`正文`)',
        [
            { name: 'title / description', description: '卡片标题与说明。' },
            { name: 'selected / onClick', description: '显式选择状态与宿主点击回调。' },
        ],
    ],
    input: [
        '// value 由宿主持有，onChange 写回本地草稿\ntextField({ name: "search", label: "关键词", value, suffixIcon: uiIcon("search"), onChange })\nnumberField({ name: "quantity", label: "数量", value: amount, min: 0, max: 100, onChange })',
        [
            { name: 'value / onChange', description: '受控值与更新回调；数字清空是 undefined。' },
            {
                name: 'suffixIcon / spinner',
                description: '输入右侧图标与数字上下步进；越界值保留输入并提示错误。',
            },
        ],
    ],
    form: [
        '// 只负责分组布局，保存草稿仍由宿主完成\nformGroup({ title: "调研参数", columns: 1 }, html`${fields}`)',
        [{ name: 'title / columns', description: '分组标题和 1/2 列排列。' }],
    ],
    required: [
        'fieldLabel({ label: "平台", required: true })\nfieldLabel({ label: "补充说明", optional: true })',
        [{ name: 'required / optional', description: '必填优先显示星号，可选由调用方明确声明。' }],
    ],
    select: [
        '// options 数据由调用方提供，不发起请求\nselectField({ name: "platform", label: "平台", value, options, onChange })',
        [
            {
                name: 'value / options',
                description: '当前选项 ID 与选项列表；只读缺少回调时不可编辑。',
            },
        ],
    ],
    cascader: [
        '// 每层 children 构成目录，value 保存已确认路径\ncascaderField({ name: "category", label: "类目", value: path, options, onChange })',
        [
            {
                name: 'value / options',
                description: '路径 ID 数组和分层目录；确认写回、取消保留原值。',
            },
        ],
    ],
    range: [
        'rangeField({ name: "price", label: "价格区间", value: { min: 10, max: 80 }, min: 0, onChange })\n// rangeError(value) 可用于阻止无效确认',
        [
            {
                name: 'value.min / value.max',
                description: '上下限允许缺省；空值不等于 0，不自动交换上下限。',
            },
        ],
    ],
    radio: [
        'radioGroup({ name: "sort", label: "排序", value, options, onChange })',
        [{ name: 'name / value / options', description: '同组名称、选中值和可选项，方向键切换。' }],
    ],
    switch: [
        'switchField({ label: "自动筛选", checked: true, onChange })',
        [{ name: 'checked / onChange', description: '受控布尔状态，组件不触发真实业务操作。' }],
    ],
    flow: [
        '// 只负责排列内容\nflow({ direction: "horizontal", gap: 12, wrap: true }, html`${items}`)',
        [{ name: 'direction / wrap / gap', description: '水平或垂直排列、是否换行、元素间距。' }],
    ],
    footer: [
        'footer({ leading: html`本地草稿`, actions: button({ label: "确认", onClick }) })',
        [{ name: 'leading / actions', description: '说明与操作模板；固定位置由外部容器负责。' }],
    ],
    progress: [
        '// 不提供 value 时表示进度未知\nprogressBar({ label: "调研进度", value: 68 })',
        [{ name: 'value', description: '0～100；缺少数值时显示不确定进度，不根据耗时推算。' }],
    ],
    tabs: [
        'tabs({ id: "results", label: "执行结果", value: "list", items, onChange })',
        [
            {
                name: 'id / value / items',
                description: '稳定 ID、受控当前页签、各页内容模板；隐藏页保留草稿与 DOM。',
            },
        ],
    ],
    dialog: [
        '// open 由宿主管理，确认与关闭分开处理\ndialog({ open, title: "确认配置", onClose, footer }, html`${body}`)',
        [
            {
                name: 'open / onClose / size',
                description: '受控显示、关闭原因回调，size 可选 default/large。',
            },
        ],
    ],
    capability: [
        'capabilityCard({ title: "数据筛选", description: "筛选候选商品", enabled, onToggle, onConfigure })',
        [
            {
                name: 'enabled / required / disabled',
                description: '明确的能力选择、必选与禁用状态，组件不执行能力。',
            },
        ],
    ],
    'capability-panel': [
        'capabilityPanel({ open, title: "配置", onClose, onConfirm }, html`${fields}`)',
        [
            {
                name: 'onConfirm / confirmDisabled',
                description: '确认提交本地草稿；错误存在时禁用确认。',
            },
        ],
    ],
    placeholder: [
        'nodePlaceholder({ title: "选品调研中", animate: true })',
        [
            {
                name: 'title / animate',
                description: '原型研究插图、淡色双环与可关闭心跳，标签与动效独立控制。',
            },
        ],
    ],
    'node-status': [
        'nodeStatus({ title: "已暂停", description: "核对后继续", tone: "warning", action })',
        [
            {
                name: 'title / tone / action',
                description: '调用方提供状态文字、色调和操作，不自行恢复节点。',
            },
        ],
    ],
    warning: [
        'warningCard({ title: "运行已暂停", description, actions })',
        [{ name: 'title / description / actions', description: '状态说明和宿主提供的操作。' }],
    ],
    timeline: [
        'timeline({ label: "执行过程", items, running: true })',
        [
            {
                name: 'items / running',
                description: '稳定 ID 的步骤及其色调；running 只控制展示动画。',
            },
        ],
    ],
    accordion: [
        'executionAccordion({ id: "logic", title: "运行逻辑", open: true, rows, onOpenChange })',
        [
            {
                name: 'open / rows / onOpenChange',
                description: '受控展开、稳定日志行 ID、回调宿主；内容更新不重播展开动画。',
            },
        ],
    ],
    cockpit: [
        '// nodes 是展示投影，模板不驱动真实任务\ncockpit({ id: "node", nodes, collapsed, onCollapsedChange, running })',
        [
            {
                name: 'nodes',
                description: '节点 ID、标题、状态、过程和能力卡片；JSON 仅允许这些纯数据字段。',
            },
            {
                name: 'collapsed / running',
                description: '展开状态与展示动画，收起保留内容、滚动和草稿。',
            },
        ],
    ],
    svg: [
        'activityIcon({ kind: "activity", running: true })',
        [
            {
                name: 'kind / running',
                description: 'loading/execute/activity/sparkle 与运行展示开关；减少动效设置优先。',
            },
        ],
    ],
    icons: [
        'uiIcon("search")\ncurrencyIcon("USD")\nplatformIcon("tiktok_shop")',
        [
            {
                name: 'name / code / platformId',
                description: '已知图标、币种或平台标识。平台完整字标适合比正方形图标更宽的容器。',
            },
        ],
    ],
    catalog: [
        'const sites = sitesOfPlatform(platformId)\nconst currency = currencyOfPlatformSite(platformId, siteId)',
        [
            {
                name: 'platformId / siteId',
                description: '目录中的平台与站点，币种根据站点即时展示。',
            },
        ],
    ],
    platforms: [
        'platformLinks({ label: "支持平台", items })',
        [{ name: 'items', description: '平台 ID、名称、图标与可选链接，只有明确地址才打开链接。' }],
    ],
    combined: [
        '// 复用基础模板组合，草稿保存在宿主\ncard(...)\nformGroup(...)\ncapabilityCard(...)\nfooter(...)',
        [{ name: '宿主草稿', description: '步骤切换和字段更新保持本地，确认不会启动真实工作流。' }],
    ],
    runtime: [
        '// 状态投影由宿主提供\nnodeStatus(...)\nprogressBar(...)\nexecutionAccordion(...)\ncockpit(...)',
        [{ name: '展示范围', description: '进度、运行过程和节点详情使用本地模拟数据。' }],
    ],
}
export function componentUsage(id: string) {
    const example = examples[id]
    return {
        usage:
            example?.[0] ??
            '// 使用左侧组件检查支持的展示与交互\n// 演示仅操作本地状态，不连接外部服务。',
        parameters: example?.[1] ?? [],
    }
}
