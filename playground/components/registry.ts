interface GalleryEntry {
    id: string
    label: string
    description: string
    component?: string
    anchor?: string
    overviewOnly?: boolean
}

interface GalleryGroup {
    title: string
    items: readonly GalleryEntry[]
}

/** 导航与平铺总览共享这一份组件目录，保留每项的稳定直链。 */
export const galleryRegistry: readonly GalleryGroup[] = [
    {
        title: '组合示例',
        items: [
            {
                id: 'combined',
                label: '设置组合示例',
                description: '步骤、表单、能力配置与底部操作。',
            },
            {
                id: 'runtime',
                label: '运行区域组合',
                description: '进度、运行逻辑、结果页签与驾驶舱。',
            },
            {
                id: 'products',
                label: '商品表格',
                description: '商品缩略图、指标、勾选与分页。',
            },
            {
                id: 'publish-shop',
                label: '发布店铺选择',
                description: '为商品选择目标发布店铺。',
            },
        ],
    },
    {
        title: '报告与分析',
        items: [
            {
                id: 'report-schema',
                label: '选品报告 JSON Schema',
                description: '可复用结构、字段说明与完整 JSON 示例。',
            },
            {
                id: 'report',
                label: '选品报告',
                description: '组合指标、图表、来源与建议的完整报告。',
            },
            {
                id: 'report-parts',
                label: '报告独立区块',
                description: '单独预览可复用的报告展示组件。',
            },
            {
                id: 'report-metric',
                component: 'report-parts',
                anchor: 'metric',
                overviewOnly: true,
                label: '指标卡',
                description: '指标数值、单位和变化。',
            },
            {
                id: 'report-score',
                component: 'report-parts',
                anchor: 'score',
                overviewOnly: true,
                label: '评分条',
                description: '评级与得分说明。',
            },
            {
                id: 'report-trend',
                component: 'report-parts',
                anchor: 'trend',
                overviewOnly: true,
                label: '趋势图',
                description: '时间维度的指标变化。',
            },
            {
                id: 'report-opportunity',
                component: 'report-parts',
                anchor: 'opportunity',
                overviewOnly: true,
                label: '机会矩阵',
                description: '竞争与机会的分布。',
            },
            {
                id: 'report-category',
                component: 'report-parts',
                anchor: 'category',
                overviewOnly: true,
                label: '对比表组合',
                description: '类目指标的横向比较。',
            },
            {
                id: 'report-source',
                component: 'report-parts',
                anchor: 'source',
                overviewOnly: true,
                label: '来源标识',
                description: '报告数据与结论的来源。',
            },
            {
                id: 'report-action',
                component: 'report-parts',
                anchor: 'action',
                overviewOnly: true,
                label: '行动建议卡',
                description: '可采取的下一步建议。',
            },
        ],
    },
    {
        title: '布局与容器',
        items: [
            {
                id: 'node-card',
                label: 'NodeCard 节点业务容器',
                description: '填满宿主的业务正文与可收起驾驶舱。',
            },
            {
                id: 'card',
                label: 'Card 卡片',
                description: '标题、说明、图标与内容容器。',
            },
            {
                id: 'dialog',
                label: '弹窗',
                description: '受控弹窗、长正文与操作区。',
            },
            {
                id: 'tabs',
                label: 'Tab 切换容器',
                description: '保留内容和草稿的页签切换。',
            },
            {
                id: 'flow',
                label: 'Flow 流式容器',
                description: '横向或纵向排列与空间不足换行。',
            },
            {
                id: 'footer',
                label: 'Footer 操作区',
                description: '容器底部的内容与操作区域。',
            },
        ],
    },
    {
        title: '数据展示',
        items: [
            {
                id: 'table',
                label: '基础表格',
                description: '可配置列、行选择与分页。',
            },
            {
                id: 'text',
                label: '文字 / 链接 / 反馈',
                description: '标题、正文、链接、徽标与反馈。',
            },
            {
                id: 'images',
                label: '图片与查看器',
                description: '缩略图、无图占位和大图查看。',
            },
            {
                id: 'summary',
                label: '商品摘要',
                description: 'Product已有字段的只读摘要。',
            },
        ],
    },
    {
        title: '表单与选择',
        items: [
            {
                id: 'form',
                label: '表单组件',
                description: '关联字段的分组与标签。',
            },
            {
                id: 'controls',
                label: '按钮 / 复选框 / 多行输入',
                description: '按钮、复选框及多行草稿输入。',
            },
            {
                id: 'dropdown-button',
                label: '动作下拉按钮',
                description: '按钮样式的动作菜单，支持键盘、禁用与外点关闭。',
            },
            {
                id: 'input',
                label: '输入框 / 数字步进',
                description: '文本、后缀图标及数字步进。',
            },
            {
                id: 'date-time',
                label: '日期 / 时间选择',
                description: '原生日期和本地时间，保留标准字符串。',
            },
            {
                id: 'required',
                label: '可选 / 必填标识',
                description: '必填和可选字段标识。',
            },
            {
                id: 'select',
                label: '下拉选择',
                description: '单层选择与键盘导航。',
            },
            {
                id: 'cascader',
                label: '多级下拉选择',
                description: '多级路径、搜索、确认与取消。',
            },
            {
                id: 'range',
                label: '区间输入',
                description: '上下限输入与区间错误提示。',
            },
            {
                id: 'radio',
                label: '单选',
                description: '一组选项中选择一个。',
            },
            {
                id: 'switch',
                label: '切换开关',
                description: '受控开关及不可用状态。',
            },
            {
                id: 'capability',
                label: '原子能力 Card',
                description: '能力名称、说明与配置入口。',
            },
            {
                id: 'capability-panel',
                label: '原子能力配置面板',
                description: '确认后提交的能力配置草稿。',
            },
        ],
    },
    {
        title: '反馈与状态',
        items: [
            {
                id: 'states',
                label: '状态切换示例',
                description: '空内容、错误、只读与边界演示。',
            },
            {
                id: 'progress',
                label: '进度条',
                description: '确定百分比与不确定进度。',
            },
            {
                id: 'placeholder',
                label: '容器占位 / SVG动画',
                description: '图标、圆环与轻微心跳。',
            },
            {
                id: 'placeholders',
                label: '通用占位',
                description: '无数据、未运行等内容占位。',
            },
            {
                id: 'node-status',
                label: '节点状态提示条',
                description: '节点提示说明与可选操作。',
            },
            {
                id: 'warning',
                label: '警告卡片',
                description: '带图标和处理说明的警告。',
            },
        ],
    },
    {
        title: '运行过程',
        items: [
            {
                id: 'cockpit',
                label: '节点驾驶舱',
                description: '节点、执行步骤、能力与产出。',
            },
            {
                id: 'timeline',
                label: '垂直时间线',
                description: '可配置图标、标题与说明的时间线。',
            },
            {
                id: 'accordion',
                label: '运行逻辑手风琴',
                description: '可收起的运行逻辑与记录。',
            },
        ],
    },
    {
        title: '图标与业务目录',
        items: [
            {
                id: 'svg',
                label: 'SVG 运行动画',
                description: '加载、执行、心跳与静止对照。',
            },
            {
                id: 'icons',
                label: 'SVG 图标',
                description: '平台、货币与常用操作矢量图标。',
            },
            {
                id: 'platforms',
                label: '支持平台横条',
                description: '支持平台标识的横向排列。',
            },
            {
                id: 'catalog',
                label: '平台 / 地区 / 币种',
                description: '平台、站点与当地币种目录。',
            },
        ],
    },
    {
        title: '动效',
        items: [
            {
                id: 'transitions',
                label: '过渡动画',
                description: '淡入、位移、缩放和高度过渡。',
            },
        ],
    },
]

export const galleryEntries = galleryRegistry.flatMap((group) => group.items)
