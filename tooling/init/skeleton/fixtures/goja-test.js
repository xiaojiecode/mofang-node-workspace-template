;(async () => {
    const h = fixtureHarness(program)
    const input = await h.send('input', {
        inputEventId: 'input-event-1',
        taskId: 'task-1',
        generation: '1',
        inputManifestId: 'manifest-1',
        deliveryId: 'delivery-1',
        values: {},
    })
    fixtureAssert(input.kind === 'apply', '骨架应接受输入事件')
    fixtureAssert(input.plan.commands.length === 0, '骨架不应虚构任务或候选')
    fixtureAssert(input.plan.production === 'unchanged', '骨架不应在收到输入时声明生产结束')
    const closed = await h.send('input-closed', { reason: 'fixture' })
    fixtureAssert(closed.kind === 'apply', '骨架应接受输入关闭事件')
    fixtureAssert(closed.plan.commands.length === 0, '骨架不应虚构结束动作')
    fixtureAssert(closed.plan.production === 'unchanged', '骨架不应在输入关闭时声明生产结束')
    const view = h.project()
    fixtureAssert(
        view.kind === 'ready' && Object.keys(view.nodeView).length === 0,
        '骨架视图应为空对象',
    )
    return { kind: closed.kind, commands: closed.plan.commands.length, view: view.nodeView }
})()
