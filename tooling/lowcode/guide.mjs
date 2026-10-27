export const guide = {
    protocol: 'mofang.lowcode-authoring/1',
    scope: 'local_authoring_only',
    workflow: [
        '询问业务缺口',
        'catalog 查询实际能力',
        'inspect 获取页面修订',
        'apply 原子修改',
        'validate 检查',
        'preview 交互验证',
    ],
    tools: {
        guide: {},
        catalog: {
            category: 'material|logic|schema|sdk',
            query: '可选关键词',
            id: '可选精确能力 ID；operations 返回全部操作 JSON Schema',
            offset: 0,
            limit: 20,
        },
        inspect: {
            code: '节点编码',
            surface: 'settings|business',
            section: '可选局部',
            componentId: '可选组件 ID',
        },
        apply: {
            file: 'JSON 请求文件或 - 读取标准输入：nodeCode/surface/expectedRevision/operations；或 definition 整包导入，二选一',
        },
        validate: { code: '节点编码', surface: 'settings|business' },
        preview: {
            code: '节点编码',
            surface: 'settings|business',
            port: 5188,
            scene: 'ready|empty|error',
        },
        restore: { file: 'JSON 请求文件：nodeCode/surface/expectedRevision/checkpointId' },
    },
    limits: [
        '用户仅交互预览，不开放设计器',
        '所有操作不发布平台，不调用真实业务接口',
        '未知能力返回不可用，不能伪造成功',
        '密钥不写入页面 JSON',
        '配置取消由宿主负责；accepted 不等于 applied',
    ],
    authoring: {
        root: '$root',
        temporaryReference: {
            $ref: '同批 component.add.ref 或集合 upsert.ref；Form/DataTable 支持 ref.formId/ref.tableId',
        },
        slots: '按组件目录查询；分栏 panes:<paneId>:content，弹框根 $dialog:<id>，单元格根 $cell:<id>',
        bindingIdentity: 'nodeId + property；binding 不添加虚构 id',
        collections: [
            'fields',
            'sources',
            'bindings',
            'rules',
            'events',
            'scripts',
            'dialogs',
            'cells',
        ],
    },
}
