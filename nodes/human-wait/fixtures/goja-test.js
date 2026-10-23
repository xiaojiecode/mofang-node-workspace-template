return (async () => {
    const h = fixtureHarness(program)
    const first = await h.send('input', { deliveryId: 'delivery-1', values: input })
    fixtureAssert(
        first.kind === 'apply' && first.plan.commands[0].handler === 'approval',
        'input must dispatch the existing approval stage program',
    )
    h.facts.inputClosed = true
    const result = await h.send('task-result', {
        taskId: first.plan.commands[0].id,
        handler: 'approval',
        inputRefs: ['delivery-1'],
        status: 'succeeded',
        output: { items: [] },
    })
    fixtureAssert(
        result.kind === 'apply' && result.plan.commands.length === 0,
        'declined item must not append an empty candidate',
    )
    fixtureAssert(
        result.plan.production === 'declare-finished',
        'settled declined input must finish production',
    )
    return { commands: result.plan.commands.length, production: result.plan.production }
})()
