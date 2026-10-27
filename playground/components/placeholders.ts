import { LitElement, css, html, nothing } from 'lit'
import type { TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import {
    panelStyles,
    selectField,
    switchField,
    button,
    nodePlaceholder,
    activityIcon,
    uiIcon,
    dataTable,
    image,
    progressBar,
} from '@mofang/browser'
import { placeholder, placeholderStyles } from '../../lib/browser/ui/components/placeholder-presets'
import { workbench } from './inspector'

type PlaceholderSample = Readonly<{
    id: string
    group: string
    title: string
    description: string
    icon: string
    actions: readonly string[]
    kind: string
    variant: 'panel' | 'inline' | 'page'
    animation: string
    source: string
    note: string
}>

/** 仅用于逐组件验收的原型展示数据，不进入节点SDK或冻结业务契约。 */
const samples: readonly PlaceholderSample[] = [
    {
        id: 'workflow-empty',
        group: '页面与模板',
        title: '暂无工作流',
        description: '开始创建你的专属工作流',
        icon: 'empty-workflow',
        actions: ['创建工作流'],
        kind: 'placeholder',
        variant: 'page',
        animation: 'none',
        source: 'src/views/WorkflowPage.vue:330',
        note: '',
    },
    {
        id: 'workflow-search-empty',
        group: '页面与模板',
        title: '没有找到匹配的工作流',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/views/WorkflowPage.vue:410',
        note: '',
    },
    {
        id: 'social-coming-soon',
        group: '页面与模板',
        title: '社媒工作流即将推出',
        description: '我们正在准备更多社媒场景的工作流模板，敬请期待。',
        icon: 'coming-soon',
        actions: ['浏览电商工作流'],
        kind: 'placeholder',
        variant: 'page',
        animation: 'none',
        source: 'src/components/WorkflowComingSoon.vue:10',
        note: '',
    },
    {
        id: 'leads-coming-soon',
        group: '页面与模板',
        title: '外贸获客工作流即将推出',
        description: '我们正在准备更多外贸获客场景的工作流模板，敬请期待。',
        icon: 'coming-soon',
        actions: ['浏览电商工作流'],
        kind: 'placeholder',
        variant: 'page',
        animation: 'none',
        source: 'src/components/WorkflowComingSoon.vue:14',
        note: '',
    },
    {
        id: 'research-running',
        group: '节点结果',
        title: '选品智能体运行中',
        description: '',
        icon: 'research',
        actions: [],
        kind: 'node',
        variant: 'panel',
        animation: 'heartbeat',
        source: 'src/views/WorkflowExecutionPage.vue:5254',
        note: '原型含dots/skeleton；用户当前明确要求只保留图标双环轻微心跳和标题，已按当前要求排除旧装饰。',
    },
    {
        id: 'research-paused',
        group: '节点结果',
        title: '选品调研已暂停',
        description: '',
        icon: 'research',
        actions: [],
        kind: 'node',
        variant: 'panel',
        animation: 'heartbeat-optional',
        source: 'src/views/WorkflowExecutionPage.vue:5261',
        note: '暂停不是动画状态；是否保留轻微心跳由调用方显式传入animate。',
    },
    {
        id: 'research-pause-notice',
        group: '节点结果',
        title: '已暂停',
        description: '可重新配置选品参数，或点击右上角继续',
        icon: 'none',
        actions: ['重新配置'],
        kind: 'notice',
        variant: 'inline',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:5244',
        note: '',
    },
    {
        id: 'collection-await-start',
        group: '节点结果',
        title: '商品采集待开始',
        description: '点击右侧“下一步”启动本节点。',
        icon: 'collection',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:5128',
        note: '',
    },
    {
        id: 'collection-before-research',
        group: '节点结果',
        title: '暂无商品数据',
        description: '',
        icon: 'collection',
        actions: ['开始选品'],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:5132',
        note: '',
    },
    {
        id: 'research-not-started',
        group: '节点结果',
        title: '暂无商品数据',
        description: '右上角设置工作流基本条件后，即可开启执行',
        icon: 'empty-product',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:683',
        note: '属于原型配置及fallback，不声称每个专属结果组件都实际进入该分支。',
    },
    {
        id: 'collection-not-started',
        group: '节点结果',
        title: '暂无采集商品',
        description: '选择商品来源和采集字段后，即可汇集商品素材',
        icon: 'empty-product',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:702',
        note: '属于原型配置及fallback，不声称每个专属结果组件都实际进入该分支。',
    },
    {
        id: 'optimization-not-started',
        group: '节点结果',
        title: '暂无待优化商品',
        description: '完成商品采集后，即可批量优化商品信息',
        icon: 'empty-product',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:718',
        note: '属于原型配置及fallback，不声称每个专属结果组件都实际进入该分支。',
    },
    {
        id: 'publish-not-started',
        group: '节点结果',
        title: '暂无发布结果',
        description: '商品从商品信息优化节点发布后，结果会汇总到这里',
        icon: 'empty-product',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:734',
        note: '属于原型配置及fallback，不声称每个专属结果组件都实际进入该分支。',
    },
    {
        id: 'library-no-collected',
        group: '节点结果',
        title: '暂无采集成功商品',
        description: '请先返回商品库选择需要上架的商品',
        icon: 'empty-product',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:747',
        note: '属于原型配置及fallback，不声称每个专属结果组件都实际进入该分支。',
    },
    {
        id: 'store-no-products',
        group: '节点结果',
        title: '暂无符合条件的店铺商品',
        description: '请先返回商品库选择需要发布的商品',
        icon: 'empty-product',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:780',
        note: '属于原型配置及fallback，不声称每个专属结果组件都实际进入该分支。',
    },
    {
        id: 'node-failed',
        group: '节点结果',
        title: '节点执行失败',
        description: '选品调研已中断；已有结果保留，后续节点不会自动启动。',
        icon: 'empty-product',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:5328',
        note: '',
    },
    {
        id: 'node-paused',
        group: '节点结果',
        title: '节点已暂停',
        description: '选品调研节点已暂停，可从右上角继续执行',
        icon: 'empty-product',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:5328',
        note: '',
    },
    {
        id: 'node-running',
        group: '节点结果',
        title: '节点执行中',
        description: '正在执行选品调研节点，请稍候',
        icon: 'empty-product',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:5328',
        note: '',
    },
    {
        id: 'node-data-research-empty',
        group: '节点结果',
        title: '暂无商品数据',
        description: '配置选品调研节点后，即可开启执行',
        icon: 'empty-product',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowNodeDataPanel.vue:355',
        note: '',
    },
    {
        id: 'node-data-research-running',
        group: '节点结果',
        title: '选品 Agent 执行中',
        description: '正在生成完整选品结果，完成后统一展示',
        icon: 'research',
        actions: [],
        kind: 'node',
        variant: 'panel',
        animation: 'heartbeat',
        source: 'src/components/WorkflowNodeDataPanel.vue:355',
        note: '原型研究骨架不复制；当前用户指定的节点占位仅图标环与标题。',
    },
    {
        id: 'node-no-results',
        group: '节点结果',
        title: '暂无执行结果',
        description: '运行工作流后可在此查看节点数据',
        icon: 'empty-product',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowNodeDataPanel.vue:360',
        note: '',
    },
    {
        id: 'instance-waiting',
        group: '节点结果',
        title: '等待执行',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowInstanceNodeResults.vue:22',
        note: '',
    },
    {
        id: 'research-candidates-processing',
        group: '节点结果',
        title: '正在生成候选商品，结果将逐条显示。',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowResearchResults.vue:169',
        note: '',
    },
    {
        id: 'research-no-match',
        group: '节点结果',
        title: '本次条件没有匹配结果，可调整选品条件后重新运行。',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowResearchResults.vue:169',
        note: '',
    },
    {
        id: 'media-image-empty',
        group: '媒体与素材',
        title: '暂无生成图片',
        description: '执行后在这里查看商品主图、场景图、详情图与生成状态',
        icon: 'image',
        actions: ['打开节点配置'],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowMediaResults.vue:136',
        note: '原型另有三项类型提示；属于媒体组合，不并入nodePlaceholder。',
    },
    {
        id: 'media-image-running',
        group: '媒体与素材',
        title: '正在生成图片',
        description: '执行后在这里查看商品主图、场景图、详情图与生成状态',
        icon: 'loading',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'spin',
        source: 'src/components/WorkflowMediaResults.vue:136',
        note: '原型另有三项类型提示；属于媒体组合，不并入nodePlaceholder。',
    },
    {
        id: 'media-video-empty',
        group: '媒体与素材',
        title: '暂无生成视频',
        description: '执行后在这里查看商品视频、封面、分镜与生成状态',
        icon: 'video',
        actions: ['打开节点配置'],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowMediaResults.vue:136',
        note: '原型另有三项类型提示；属于媒体组合，不并入nodePlaceholder。',
    },
    {
        id: 'media-video-running',
        group: '媒体与素材',
        title: '正在生成视频',
        description: '执行后在这里查看商品视频、封面、分镜与生成状态',
        icon: 'loading',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'spin',
        source: 'src/components/WorkflowMediaResults.vue:136',
        note: '原型另有三项类型提示；属于媒体组合，不并入nodePlaceholder。',
    },
    {
        id: 'media-search-empty',
        group: '媒体与素材',
        title: '暂无匹配的生成任务',
        description: '',
        icon: 'empty-product',
        actions: ['查看全部'],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowMediaResults.vue:143',
        note: '',
    },
    {
        id: 'media-retrying',
        group: '媒体与素材',
        title: '正在重新生成，请稍候',
        description: '',
        icon: 'loading',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'spin',
        source: 'src/components/WorkflowMediaResults.vue:148',
        note: '',
    },
    {
        id: 'media-item-failed',
        group: '媒体与素材',
        title: '生成失败',
        description: '当前任务返回的失败原因由调用方提供。',
        icon: 'image',
        actions: ['补充素材并重新生成'],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowMediaResults.vue:148',
        note: '',
    },
    {
        id: 'video-idle',
        group: '媒体与素材',
        title: '视频 Agent',
        description: '快速创作电商带货视频',
        icon: 'video-agent',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowVideoCreationDialog.vue:227',
        note: '',
    },
    {
        id: 'video-processing',
        group: '媒体与素材',
        title: 'Video Agent 正在创作',
        description: '正在分析商品素材并生成视频画面...',
        icon: 'loading',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'spin',
        source: 'src/components/WorkflowVideoCreationDialog.vue:236',
        note: '原型同时有进度条与参数摘要；预览组合复用progressBar。',
    },
    {
        id: 'video-failed',
        group: '媒体与素材',
        title: '视频生成失败',
        description: '视频生成服务响应超时，或视频审核未通过。',
        icon: 'video-failure',
        actions: ['重新生成'],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowVideoCreationDialog.vue:245',
        note: '',
    },
    {
        id: 'batch-images-empty',
        group: '媒体与素材',
        title: '暂无可处理图片',
        description: '',
        icon: 'image',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowBatchImageEditorDialog.vue:295',
        note: '',
    },
    {
        id: 'upload-local-empty',
        group: '媒体与素材',
        title: '上传后的素材将在这里显示',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowProductImageUploadDialog.vue:393',
        note: '',
    },
    {
        id: 'upload-search-empty',
        group: '媒体与素材',
        title: '没有找到匹配的图片素材',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowProductImageUploadDialog.vue:429',
        note: '',
    },
    {
        id: 'product-image-missing',
        group: '媒体与素材',
        title: '商品缩略图缺失',
        description: '',
        icon: 'product-placeholder',
        actions: [],
        kind: 'image',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowProductEditor.vue:2079',
        note: '',
    },
    {
        id: 'collection-image-missing',
        group: '媒体与素材',
        title: '采集商品缩略图缺失',
        description: '',
        icon: 'collection',
        actions: [],
        kind: 'image',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowBuilderCollectionContent.vue:162',
        note: '',
    },
    {
        id: 'publish-image-missing',
        group: '媒体与素材',
        title: '发布商品缩略图缺失',
        description: '',
        icon: 'file',
        actions: [],
        kind: 'image',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowBuilderPublishContent.vue:132',
        note: '',
    },
    {
        id: 'collection-filter-empty',
        group: '表格与检索',
        title: '暂无符合当前筛选条件的商品',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'table',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowBuilderCollectionContent.vue:167',
        note: '',
    },
    {
        id: 'collection-no-run',
        group: '表格与检索',
        title: '还没有采集结果',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'table',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowBuilderCollectionContent.vue:167',
        note: '',
    },
    {
        id: 'builder-publish-filter-empty',
        group: '表格与检索',
        title: '暂无符合当前筛选条件的商品',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'table',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowBuilderPublishContent.vue:136',
        note: '',
    },
    {
        id: 'collection-status-empty',
        group: '表格与检索',
        title: '暂无符合当前状态的商品',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'table',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowCollectionResults.vue:475',
        note: '',
    },
    {
        id: 'optimization-filter-empty',
        group: '表格与检索',
        title: '暂无相关商品',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'table',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowOptimizationPanel.vue:1125',
        note: '',
    },
    {
        id: 'library-filter-empty',
        group: '表格与检索',
        title: '暂无符合条件的商品',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'table',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowLibraryCollectionPanel.vue:326',
        note: '',
    },
    {
        id: 'store-filter-empty',
        group: '表格与检索',
        title: '暂无符合条件的店铺商品',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'table',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowStoreProductsPanel.vue:330',
        note: '',
    },
    {
        id: 'publish-filter-empty',
        group: '表格与检索',
        title: '暂无相关商品',
        description: '',
        icon: 'none',
        actions: ['返回商品信息优化查看商品'],
        kind: 'table',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowPublishResults.vue:433',
        note: '',
    },
    {
        id: 'sku-filter-empty',
        group: '表格与检索',
        title: '没有匹配的 SKU',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'table',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowProductEditor.vue:2684',
        note: '',
    },
    {
        id: 'tasks-filter-empty',
        group: '表格与检索',
        title: '没有匹配的任务',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'table',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowTaskHistoryDialog.vue:44',
        note: '',
    },
    {
        id: 'auth-filter-empty',
        group: '表格与检索',
        title: '未找到匹配的店铺',
        description: '',
        icon: 'none',
        actions: ['清空筛选'],
        kind: 'table',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowStoreAuthorization.vue:312',
        note: '',
    },
    {
        id: 'auth-stores-empty',
        group: '店铺与配置',
        title: '暂无授权店铺',
        description: '添加第一家 TikTok Shop 店铺，完成授权后即可用于工作流',
        icon: 'store',
        actions: ['打开店铺授权配置'],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowStoreAuthorization.vue:317',
        note: '配置入口仅resultsOnly时显示，其他模式的新增授权按钮属于外层。',
    },
    {
        id: 'binding-stores-empty',
        group: '店铺与配置',
        title: '暂无绑定店铺',
        description: '需要先进行店铺授权后才能绑定店铺',
        icon: 'store-auth-empty',
        actions: ['取消', '去授权店铺'],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'none',
        source: 'src/components/WorkflowStoreBindingDialog.vue:132',
        note: '动作在原弹窗footer；此处仅展示占位加调用方操作槽，不实现授权弹窗。',
    },
    {
        id: 'attribute-options-empty',
        group: '店铺与配置',
        title: '无数据',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowAttributeSelect.vue:167',
        note: '',
    },
    {
        id: 'settings-nodes-empty',
        group: '店铺与配置',
        title: '暂无可配置节点',
        description: '请先从画布下方添加节点，再设置对应能力。',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowAutomationSettings.vue:856',
        note: '',
    },
    {
        id: 'builder-settings-empty',
        group: '店铺与配置',
        title: '暂无可配置节点',
        description: '关闭设置后，从画布添加节点，再设置对应能力。',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/views/WorkflowBuilderPage.vue:5957',
        note: '',
    },
    {
        id: 'node-settings-empty',
        group: '店铺与配置',
        title: '节点暂无可配置项',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowAutomationSettings.vue:1469',
        note: '',
    },
    {
        id: 'node-run-no-settings',
        group: '店铺与配置',
        title: '该节点无需配置',
        description: '执行时沿用工作流中的设置。',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowRunSetupDialog.vue:53',
        note: '',
    },
    {
        id: 'review-steps-empty',
        group: '店铺与配置',
        title: '当前没有可审核的步骤',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowExecutionModeSettings.vue:54',
        note: '',
    },
    {
        id: 'capability-search-empty',
        group: '店铺与配置',
        title: '该能力组暂无匹配项',
        description: '',
        icon: 'search',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowCapabilityEditor.vue:725',
        note: '',
    },
    {
        id: 'category-search-empty',
        group: '店铺与配置',
        title: '未找到匹配的类目',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowAutomationSettings.vue:1075',
        note: '',
    },
    {
        id: 'category-await-first',
        group: '店铺与配置',
        title: '请先选择一级类目',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowAutomationSettings.vue:1147',
        note: '',
    },
    {
        id: 'category-await-second',
        group: '店铺与配置',
        title: '请先选择二级类目',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowAutomationSettings.vue:1172',
        note: '',
    },
    {
        id: 'platform-coming-soon',
        group: '店铺与配置',
        title: '更多平台敬请期待',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowCapabilityConfigDialog.vue:1615',
        note: '',
    },
    {
        id: 'recommendations-empty',
        group: '店铺与配置',
        title: '暂无符合当前节点输出的后续节点。',
        description: '已连接的节点不会重复推荐。',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/views/WorkflowBuilderPage.vue:5577',
        note: '',
    },
    {
        id: 'node-search-empty',
        group: '店铺与配置',
        title: '没有匹配的节点',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/views/WorkflowBuilderPage.vue:5627',
        note: '',
    },
    {
        id: 'category-required',
        group: '店铺与配置',
        title: '您还没有选择类目，请选择类目后操作',
        description: '',
        icon: 'warning',
        actions: [],
        kind: 'notice',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowProductEditor.vue:2423',
        note: '',
    },
    {
        id: 'trace-issues-empty',
        group: '驾驶舱与过程',
        title: '当前没有待处理问题，请核对左侧当前节点结果后继续。',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowExecutionTracePanel.vue:337',
        note: '',
    },
    {
        id: 'trace-capabilities-empty',
        group: '驾驶舱与过程',
        title: '本次未开启原子能力',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowExecutionTracePanel.vue:395',
        note: '',
    },
    {
        id: 'trace-sources-empty',
        group: '驾驶舱与过程',
        title: '暂无数据来源',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowExecutionTracePanel.vue:416',
        note: '',
    },
    {
        id: 'trace-outputs-empty',
        group: '驾驶舱与过程',
        title: '暂无输出内容',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowExecutionTracePanel.vue:437',
        note: '',
    },
    {
        id: 'thought-empty',
        group: '驾驶舱与过程',
        title: '暂无智能体思考过程',
        description: '',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/views/WorkflowExecutionPage.vue:4946',
        note: '',
    },
    {
        id: 'history-instances-empty',
        group: '驾驶舱与过程',
        title: '此工作流暂无执行实例。',
        description: '开始运行后，每次实例会独立保留任务与结果。',
        icon: 'none',
        actions: [],
        kind: 'empty',
        variant: 'inline',
        animation: 'none',
        source: 'src/components/WorkflowTaskHistoryDialog.vue:38',
        note: '',
    },
    {
        id: 'product-saving',
        group: '局部等待与遮罩',
        title: '正在保存商品信息',
        description: '正在同步最新商品信息，请稍候',
        icon: 'loading',
        actions: [],
        kind: 'placeholder',
        variant: 'panel',
        animation: 'spin',
        source: 'src/components/WorkflowProductEditor.vue:2875',
        note: '原型为阻塞编辑的全局loading遮罩；库仅封装展示，inert/阻塞/保存不属于placeholder职责。',
    },
]

const assets: Readonly<Record<string, string>> = {
    'empty-workflow': new URL('./assets/placeholders/empty-workflow.svg', import.meta.url).href,
    'coming-soon': new URL('./assets/placeholders/coming-soon-illustration.png', import.meta.url)
        .href,
    'empty-product': new URL('./assets/placeholders/empty-product.svg', import.meta.url).href,
    'video-agent': new URL('./assets/placeholders/video-agent.svg', import.meta.url).href,
    'video-failure': new URL('./assets/placeholders/video-failure.svg', import.meta.url).href,
    'store-auth-empty': new URL('./assets/placeholders/store-auth-empty.svg', import.meta.url).href,
    'product-placeholder': new URL('./assets/placeholders/product-placeholder.png', import.meta.url)
        .href,
    collection: new URL('./assets/placeholders/lucide-file-search.svg', import.meta.url).href,
    file: new URL('./assets/placeholders/lucide-file-text.svg', import.meta.url).href,
    image: new URL('./assets/placeholders/lucide-image-plus.svg', import.meta.url).href,
    video: new URL('./assets/placeholders/lucide-video.svg', import.meta.url).href,
    store: new URL('./assets/placeholders/lucide-store.svg', import.meta.url).href,
}

/** JSON只描述展示数据，所有图标资源和操作回调仍由受控代码提供。 */
type PlaceholderEditorData = Readonly<{
    title: string
    description: string
    variant: 'panel' | 'inline' | 'page'
    icon: string
    actions: readonly string[]
}>

/** 占位预览只切换本地样例，操作按钮仅回显回调名称，不启动或恢复真实工作流。 */
class PlaceholderExamples extends LitElement {
    static override styles = [
        panelStyles,
        placeholderStyles,
        css`
            :host {
                display: block;
                min-width: 0;
            }
            .controls {
                display: grid;
                gap: 14px;
            }
            .controls .mf-field {
                margin: 0;
                width: 100%;
            }
            .controls .sample-select {
                width: 100%;
            }
            .controls .mf-switch-label {
                margin: 0;
            }
            .stage {
                display: grid;
                align-content: safe center;
                min-width: 0;
                border: 1px solid var(--mf-line);
                overflow: auto;
                background: #fff;
            }
            .stage[data-kind='node'] {
                display: flex;
            }
            .stage[data-kind='node'] .mf-node-placeholder {
                min-height: 0;
            }
            .stage[data-kind='table'] {
                display: block;
            }
            .stage[data-kind='image'] {
                justify-items: center;
                gap: 16px;
            }
            .stage[data-kind='notice'] {
                align-content: start;
            }
            .stage .mf-placeholder {
                min-width: 0;
            }
            .stage .mf-placeholder .mf-empty-state {
                width: 100%;
            }
            .stage .mf-placeholder .mf-empty-state .mf-button + .mf-button {
                margin-left: 8px;
            }
            .stage .mf-placeholder__icon > img[src*='lucide'] {
                width: 36px;
                height: 36px;
            }
            .stage
                .mf-placeholder[data-variant='inline']
                .mf-placeholder__icon
                > img[src*='lucide'] {
                width: 24px;
                height: 24px;
            }
            .stage .mf-empty-state {
                overflow-wrap: anywhere;
            }
            .stage .mf-placeholder[data-variant='page'] {
                min-height: 100%;
            }
            .sample-caption {
                font-size: 12px;
                color: var(--mf-muted);
                padding: 12px 16px;
            }
            .sample-actions {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 8px;
                padding: 0 16px 16px;
            }
            .composition-progress {
                padding: 0 24px 24px;
            }
            .saving-context {
                position: relative;
                height: 100%;
                min-height: 280px;
                padding: 24px;
            }
            .saving-context > p {
                color: var(--mf-muted);
            }
            .saving-overlay {
                position: absolute;
                inset: 0;
                display: grid;
                place-items: safe center;
                background: rgb(255 255 255 / 94%);
            }
            .result {
                min-height: 38px;
                padding: 10px 0;
                font-size: 12px;
                color: var(--mf-muted);
            }
            .evidence {
                margin-top: 14px;
                font-size: 12px;
                color: var(--mf-muted);
                line-height: 1.7;
                overflow-wrap: anywhere;
            }
            .evidence code {
                white-space: normal;
            }
            details {
                margin-top: 14px;
                border-top: 1px solid var(--mf-line);
                padding-top: 14px;
            }
            summary {
                cursor: pointer;
                font-size: 13px;
            }
            .inventory {
                display: grid;
                gap: 0;
                padding-top: 10px;
            }
            .inventory button {
                display: grid;
                grid-template-columns: minmax(180px, 1fr) minmax(0, 2fr);
                gap: 16px;
                border: 0;
                border-bottom: 1px solid var(--mf-line);
                padding: 12px 8px;
                background: #fff;
                color: var(--mf-fg);
                text-align: left;
                font: inherit;
                font-size: 12px;
                cursor: pointer;
            }
            .inventory button[aria-pressed='true'] {
                background: #edf5ff;
            }
            .inventory button small {
                color: var(--mf-muted);
                overflow-wrap: anywhere;
            }
            .sequence {
                display: flex;
                gap: 8px;
                align-items: center;
                margin-left: auto;
            }
            .sequence span {
                color: var(--mf-muted);
                font-size: 12px;
                font-variant-numeric: tabular-nums;
            }
            button:focus-visible {
                outline: 2px solid #87bbff;
                outline-offset: 2px;
            }
        `,
    ]
    static override properties = {
        group: { state: true },
        sampleId: { state: true },
        animationEnabled: { state: true },
        contentMode: { state: true },
        height: { state: true },
        lastAction: { state: true },
        appliedData: { state: true },
        editorRevision: { state: true },
    }
    declare group: string
    declare sampleId: string
    declare animationEnabled: boolean
    declare contentMode: string
    declare height: string
    declare lastAction: string
    declare appliedData: PlaceholderEditorData | undefined
    declare editorRevision: number
    constructor() {
        super()
        this.group = '节点结果'
        this.sampleId = 'research-running'
        this.animationEnabled = true
        this.contentMode = 'original'
        this.height = '420'
        this.lastAction = ''
        this.appliedData = undefined
        this.editorRevision = 0
    }
    private choose(id: string) {
        this.sampleId = id
        this.lastAction = ''
        this.appliedData = undefined
        this.contentMode = 'original'
        this.editorRevision += 1
    }
    private defaults(sample: PlaceholderSample): PlaceholderEditorData {
        const fixed = sample.kind === 'node' || sample.kind === 'image' || sample.kind === 'table'
        return {
            title: sample.title,
            description: fixed ? '' : sample.description,
            variant: sample.variant,
            icon:
                sample.kind === 'node'
                    ? 'research'
                    : sample.kind === 'table'
                      ? 'none'
                      : sample.icon,
            actions: sample.kind === 'node' || sample.kind === 'image' ? [] : sample.actions,
        }
    }
    private data(sample: PlaceholderSample): PlaceholderEditorData {
        const data = this.appliedData ?? this.defaults(sample)
        if (this.contentMode === 'empty') return { ...data, title: '', description: '' }
        if (this.contentMode !== 'long') return data
        return {
            ...data,
            title: `${data.title}：用于验收有限空间内长标题换行与内容可达性的本地示例，不表示真实任务正在执行。`,
            description:
                sample.kind === 'node' || sample.kind === 'image' || sample.kind === 'table'
                    ? ''
                    : '这是长说明样例。请核对有限高度下的文字、图标与操作是否完整可达；容器由宿主负责滚动，内容不会自动截断。'.repeat(
                          5,
                      ),
        }
    }
    private validateData(value: unknown, sample: PlaceholderSample): string | undefined {
        if (!value || typeof value !== 'object' || Array.isArray(value))
            return '请输入占位参数对象。'
        const row = value as Record<string, unknown>
        if (
            Object.keys(row).some(
                (key) => !['title', 'description', 'variant', 'icon', 'actions'].includes(key),
            )
        )
            return '仅支持 title、description、variant、icon、actions，不接受代码或其他字段。'
        if (typeof row.title !== 'string') return 'title 必须是字符串；允许空字符串以检查空文案。'
        if (row.description !== undefined && typeof row.description !== 'string')
            return 'description 必须是字符串。'
        if (
            row.variant !== undefined &&
            (typeof row.variant !== 'string' || !['panel', 'inline', 'page'].includes(row.variant))
        )
            return 'variant 只能为 panel、inline 或 page。'
        const allowedIcons = this.iconOptions(sample)
        if (
            row.icon !== undefined &&
            (typeof row.icon !== 'string' || !allowedIcons.includes(row.icon))
        )
            return 'icon 只能选择本页已知的本地图标名称，不接受 URL 或 HTML。'
        if (
            row.actions !== undefined &&
            (!Array.isArray(row.actions) ||
                row.actions.some((label) => typeof label !== 'string' || !label.trim()))
        )
            return 'actions 必须是非空按钮文案组成的字符串数组。'
        const data = this.decode(value, sample)
        if (
            sample.kind === 'node' &&
            (data.description ||
                data.actions.length ||
                data.variant !== 'panel' ||
                data.icon !== 'research')
        )
            return '研究节点占位固定为研究图标双环与标题；description、actions 必须为空，variant 固定 panel。'
        if (
            sample.kind === 'image' &&
            (data.description || data.actions.length || data.variant !== sample.variant)
        )
            return '缩略图样例固定为图片布局，仅可编辑标题与本地图标；description、actions 必须为空。'
        if (
            sample.kind === 'table' &&
            (data.description || data.icon !== 'none' || data.variant !== 'inline')
        )
            return '表格零结果使用 dataTable 固定布局，仅可编辑标题与操作文案；description 为空、icon 为 none、variant 为 inline。'
        return undefined
    }
    private decode(value: unknown, sample: PlaceholderSample): PlaceholderEditorData {
        const row = value as Partial<PlaceholderEditorData>
        const defaults = this.defaults(sample)
        return {
            title: row.title!,
            description: row.description ?? '',
            variant: row.variant ?? defaults.variant,
            icon: row.icon ?? defaults.icon,
            actions: row.actions ?? [],
        }
    }
    private iconOptions(sample: PlaceholderSample): readonly string[] {
        if (sample.kind === 'node') return ['research']
        if (sample.kind === 'table') return ['none']
        if (sample.kind === 'image') return ['none', ...Object.keys(assets)]
        return ['none', 'loading', 'search', 'warning', ...Object.keys(assets)]
    }
    private icon(name: string): TemplateResult | undefined {
        if (name === 'loading')
            return activityIcon({ kind: 'loading', running: this.animationEnabled })
        if (name === 'search' || name === 'warning') return uiIcon(name)
        const source = assets[name]
        return source ? html`<img src=${source} alt="" />` : undefined
    }
    private actions(labels: readonly string[]) {
        return labels.length
            ? html`${labels.map((label) =>
                  button({
                      label,
                      variant: label === '取消' ? 'secondary' : 'accent',
                      onClick: () => {
                          this.lastAction = `已触发“${label}”本地回调；未执行真实业务。`
                      },
                  }),
              )}`
            : undefined
    }
    private content(sample: PlaceholderSample, data: PlaceholderEditorData) {
        const { title, description } = data
        const actions = this.actions(data.actions)
        if (sample.kind === 'node')
            return nodePlaceholder({ title, animate: this.animationEnabled })
        if (sample.kind === 'image')
            return html`${image({
                    ...(assets[data.icon] ? { src: assets[data.icon]! } : {}),
                    alt: title,
                    width: '72px',
                    height: '72px',
                    preview: false,
                })}
                <p class="sample-caption">${title}</p>`
        if (sample.kind === 'table')
            return html`${dataTable<{ id: string }>(
                [],
                (row) => row.id,
                [
                    { title: '商品 / 任务', cell: () => '' },
                    { title: '状态', cell: () => '' },
                ],
                { empty: title, label: '零结果表格本地示例' },
            )}${actions ? html`<div class="sample-actions">${actions}</div>` : nothing}`
        const icon = this.icon(data.icon)
        const body = placeholder({
            title,
            description,
            ...(icon ? { icon } : {}),
            ...(actions ? { actions } : {}),
            variant: data.variant,
        })
        if (sample.id === 'video-processing')
            return html`${body}
                <div class="composition-progress">
                    ${progressBar({ label: '本地预览进度', value: 36 })}
                </div>`
        if (sample.id === 'product-saving')
            return html`<div class="saving-context">
                <p>商品编辑区域（本地展示）</p>
                <div class="saving-overlay">${body}</div>
            </div>`
        return body
    }
    private usage(sample: PlaceholderSample, data: PlaceholderEditorData) {
        if (sample.kind === 'node')
            return `import { nodePlaceholder } from '@mofang/browser'

// 运行状态由调用方提供；这里只控制轻微心跳。
nodePlaceholder({
    title: ${JSON.stringify(data.title)},
    animate: ${this.animationEnabled},
})`
        if (sample.kind === 'image')
            return `import { image } from '@mofang/browser'

// knownAssetUrl 来自本地资源表，不执行输入文本。
image({ src: knownAssetUrl, alt: ${JSON.stringify(data.title)}, width: '72px', height: '72px' })`
        if (sample.kind === 'table')
            return `import { dataTable, button } from '@mofang/browser'

// 列、空行和操作回调由调用方提供。
dataTable([], row => row.id, columns, {
    empty: ${JSON.stringify(data.title)},
})
// 如需操作，在表格外组合受控按钮。`
        return `import { placeholder, button } from '@mofang/browser'

// icon 和 actions 接收 Lit 模板，不接收 HTML 字符串。
// 编辑器仅解析受校验的 JSON；回调由本地代码提供。
placeholder({
    title: ${JSON.stringify(data.title)},
    description: ${JSON.stringify(data.description)},
    variant: ${JSON.stringify(data.variant)},
    icon: knownLocalIcon,
    actions: localActionButtons,
})`
    }
    override render() {
        const groups = [...new Set(samples.map((sample) => sample.group))]
        const filtered = samples.filter((sample) => sample.group === this.group)
        const sample = filtered.find((sample) => sample.id === this.sampleId) ?? filtered[0]!
        const index = filtered.findIndex((item) => item.id === sample.id)
        const data = this.data(sample)
        const fixedLayout =
            sample.kind === 'node' || sample.kind === 'image' || sample.kind === 'table'
        const controls = html`
            <div class="controls" aria-label="占位示例参数">
                ${selectField({
                    name: 'placeholder-group',
                    label: '场景分类',
                    value: this.group,
                    compact: true,
                    options: groups.map((value) => ({ value, label: value })),
                    onChange: (value) => {
                        this.group = value ?? groups[0]!
                        this.choose(samples.find((sample) => sample.group === this.group)!.id)
                    },
                })}
                <div class="sample-select">
                    ${selectField({
                        name: 'placeholder-sample',
                        label: '原型占位场景',
                        value: sample.id,
                        compact: true,
                        options: filtered.map((value) => ({ value: value.id, label: value.title })),
                        onChange: (value) => this.choose(value ?? filtered[0]!.id),
                    })}
                </div>
                ${selectField({
                    name: 'placeholder-content',
                    label: '文案长度',
                    value: this.contentMode,
                    compact: true,
                    options: [
                        { value: 'original', label: '原型文案' },
                        { value: 'empty', label: '空文案' },
                        { value: 'long', label: '长文案' },
                    ],
                    onChange: (value) => {
                        this.contentMode = value ?? 'original'
                        this.editorRevision += 1
                    },
                })}
                ${selectField({
                    name: 'placeholder-height',
                    label: '宿主高度',
                    value: this.height,
                    compact: true,
                    options: [
                        { value: '240', label: '240px' },
                        { value: '420', label: '420px' },
                        { value: '640', label: '640px' },
                    ],
                    onChange: (value) => {
                        this.height = value ?? '420'
                    },
                })}
                ${selectField({
                    name: 'placeholder-icon',
                    label: '本地插画 / 图标',
                    value: data.icon,
                    compact: true,
                    readOnly: sample.kind === 'node' || sample.kind === 'table',
                    options: this.iconOptions(sample).map((value) => ({ value, label: value })),
                    onChange: (value) => {
                        this.appliedData = { ...data, icon: value ?? 'none' }
                        this.contentMode = 'original'
                        this.editorRevision += 1
                    },
                })}
                ${switchField({
                    label: '展示动效',
                    checked: this.animationEnabled,
                    onChange: (value) => {
                        this.animationEnabled = value
                    },
                })}
                <div class="sequence">
                    ${button({
                        label: '上一个',
                        disabled: index === 0,
                        onClick: () => this.choose(filtered[index - 1]!.id),
                    })}<span>${index + 1} / ${filtered.length}</span>${button({
                        label: '下一个',
                        disabled: index === filtered.length - 1,
                        onClick: () => this.choose(filtered[index + 1]!.id),
                    })}
                </div>
            </div>
        `
        const content = html`<div
                class="stage"
                data-kind=${sample.kind}
                style=${styleMap({ height: `${this.height}px` })}
                aria-label="占位组件预览"
            >
                ${this.content(sample, data)}
            </div>
            <div class="result" role="status">
                ${this.lastAction || '操作仅用于核对回调；样例状态由预览参数切换。'}
            </div>
            <div class="evidence">
                原型来源：<code>${sample.source}</code>。${sample.note ||
                '这是独立展示样例，未接入真实工作流。'}
            </div>
            <details>
                <summary>逐项清单（${samples.length} 个展示样例）</summary>
                <div class="inventory">
                    ${samples.map(
                        (item) =>
                            html`<button
                                type="button"
                                aria-pressed=${item.id === sample.id}
                                @click=${() => {
                                    this.group = item.group
                                    this.choose(item.id)
                                }}
                            >
                                <span>${item.group} · ${item.title}</span
                                ><small>${item.source}</small>
                            </button>`,
                    )}
                </div>
            </details> `
        return workbench(
            {
                id: `placeholder-${sample.id}-${this.editorRevision}`,
                title: '占位用法与数据',
                description: fixedLayout
                    ? '当前样例保留专属布局，固定项会明确校验；通用占位样例支持修改布局与操作。图标只来自本地资源。'
                    : '修改文案、布局、操作文字和本地图标后应用到预览；错误输入不会替换当前内容。',
                usage: this.usage(sample, data),
                parameters: [
                    {
                        name: 'title / description',
                        description:
                            sample.kind === 'node'
                                ? '研究节点只显示标题；title允许空字符串，description必须为空。'
                                : '纯文本标题与说明，允许空文案和长文案；图片及表格样例说明固定为空。',
                    },
                    {
                        name: 'variant',
                        description: fixedLayout
                            ? `当前样例固定为 ${this.defaults(sample).variant}，不将缩略图、表格或研究环静默改成另一种布局。`
                            : 'panel结果区、inline局部提示、page页面插画。',
                    },
                    {
                        name: 'icon',
                        description:
                            '仅允许本地资源名称、none、loading、search或warning；研究节点固定research，表格固定none。',
                    },
                    {
                        name: 'actions',
                        description:
                            '按钮文案字符串数组。回调始终由本地代码提供，不执行JSON中的代码。研究节点与缩略图必须为空。',
                    },
                ],
                data,
                defaultData: this.defaults(sample),
                validate: (value) => this.validateData(value, sample),
                onApply: (value) => {
                    this.appliedData = this.decode(value, sample)
                    this.contentMode = 'original'
                    this.lastAction = ''
                },
                onReset: () => {
                    this.appliedData = undefined
                    this.contentMode = 'original'
                    this.lastAction = ''
                    this.editorRevision += 1
                },
            },
            content,
            controls,
        )
    }
}
customElements.define('mf-placeholder-examples', PlaceholderExamples)
