;(async () => {
    const h = fixtureHarness(program)
    const result = await h.send('input', { deliveryId: 'delivery-1', values: input })
    fixtureAssert(
        result.kind === 'apply' && result.plan.commands.length === 1,
        'shared counters must not duplicate business output',
    )
    const view = h.project()
    fixtureAssert(
        view.kind === 'ready' && view.nodeView.left === 1 && view.nodeView.right === 1,
        'two explicit slots must update independently',
    )
    return {
        left: view.nodeView.left,
        right: view.nodeView.right,
        commands: result.plan.commands.length,
    }
})()
