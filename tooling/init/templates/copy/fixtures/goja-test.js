return (async () => {
    const h = fixtureHarness(program)
    const first = await h.send('input', { deliveryId: 'delivery-1', values: input })
    fixtureAssert(
        first.kind === 'apply' && first.plan.commands.length === 1,
        'input must spawn one real task intent',
    )
    const task = first.plan.commands[0]
    fixtureAssert(task.inputRefs[0] === 'delivery-1', 'task provenance lost')
    h.facts.inputClosed = true
    const result = await h.send('task-result', {
        taskId: task.id,
        handler: 'copy',
        inputRefs: task.inputRefs,
        status: 'succeeded',
        output: { items: [input.item] },
    })
    fixtureAssert(
        result.kind === 'apply' && result.plan.commands[0].kind === 'candidate.append',
        'success must append candidate',
    )
    fixtureAssert(
        result.plan.commands[0].inputRefs[0] === 'delivery-1',
        'candidate provenance lost',
    )
    fixtureAssert(
        result.plan.production === 'declare-finished',
        'settled copy must declare production finished',
    )
    const view = h.project()
    fixtureAssert(view.kind === 'ready' && view.nodeView.received === 1, 'committed view missing')
    return {
        kind: result.kind,
        production: result.plan.production,
        received: view.nodeView.received,
        inputRefs: result.plan.commands[0].inputRefs,
    }
})()
