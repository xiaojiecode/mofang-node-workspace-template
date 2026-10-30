import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { startWorkflowRunFields } from '../tooling/sync-contracts/start-fields.mjs'

test('CLI 起跑字段与冻结浏览器契约一致，路径身份不进入正文白名单', async () => {
    const source = await readFile(
        new URL('../lib/contracts/src/browser/sdk/run-body-types.d.ts', import.meta.url),
        'utf8',
    )
    const fields = JSON.parse(
        await readFile(
            new URL(
                '../.agents/skills/mofang-js-node/scripts/mofang_cli/start-workflow-run-fields.json',
                import.meta.url,
            ),
            'utf8',
        ),
    )
    assert.deepEqual(fields, startWorkflowRunFields(source))
    assert.ok(fields.includes('sourceRunId'))
    assert.ok(fields.includes('planId'))
    assert.equal(fields.includes('workflowId'), false)
})

test('起跑字段生成随契约增删，未知结构不静默截断', () => {
    const source =
        'export type StartWorkflowRunBody = Readonly<{\n workflowId: ID\n /** 可选计划 */\n planId?: ID\n}>'
    assert.deepEqual(startWorkflowRunFields(source), ['planId'])
    assert.deepEqual(startWorkflowRunFields(source.replace(' planId?: ID', ' sourceRunId?: ID')), [
        'sourceRunId',
    ])
    for (const invalid of [
        source.replace('planId?: ID', 'planId?: ID; sourceRunId?: ID;'),
        source.replace('planId?: ID', 'planId?: ID, sourceRunId?: ID'),
        source.replace('planId?: ID', 'options: { enabled: boolean }'),
        source.replace('workflowId: ID', ''),
        source.replace('planId?: ID', 'planId?: ID\nplanId?: ID'),
    ])
        assert.throws(() => startWorkflowRunFields(invalid))
})
