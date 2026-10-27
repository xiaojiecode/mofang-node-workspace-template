import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { PageRenderer } from '@mofang/low-code-page/runtime'
import { createPuckPanelHost } from '@mofang/workflow-lowcode'
import { puckPanelFiles } from '../tooling/init/puck-panels.mjs'

for (const preset of ['selection', 'copy', 'human-wait', 'multi-instance']) {
    test(`${preset} 首次渲染没有 SDK 数据时显示等待内容，非法绑定仍报错`, () => {
        const definition = JSON.parse(
            puckPanelFiles(preset, preset, { businessRenderer: 'puck' })['business.page.json'],
        )
        const host = createPuckPanelHost({
            target: { nodeCode: preset },
            surface: 'business',
            lowcode: { rendererKey: 'puck', config: definition },
        })
        const render = () => renderToString(createElement(PageRenderer, { definition, host }))
        assert.match(render(), /等待节点状态/)
        if (preset === 'selection') assert.match(render(), /提交所选商品/)
        host.context.nodeFlow = { data: { status: 'waiting' } }
        host.context.nodeView = { rows: [] }
        host.context.nodeOutput = {
            items: [{ id: 'candidate', value: { items: [{ basic: { title: '回归商品' } }] } }],
        }
        assert.match(render(), /waiting/)
        if (preset !== 'selection') assert.match(render(), /回归商品/)
        host.context.nodeFlow = null
        const status = definition.page.content.find(
            (node) => node.props.binding?.path?.join('.') === 'nodeFlow.data.status',
        )
        // 去掉显式缺省值可复现原故障；不能靠全局吞掉绑定错误通过检查。
        delete status.props.binding.fallback
        assert.throws(render, /绑定路径不存在/)
    })
}
