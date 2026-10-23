return (async () => {
    const h = fixtureHarness(program)
    await h.send('input', { deliveryId: 'delivery-1', values: input })
    h.facts.inputClosed = true
    await h.send('input-closed', { reason: 'completed' })
    const invalid = await h.send('action', {
        name: 'submit',
        payload: { keys: ['missing'] },
        candidates: [],
    })
    fixtureAssert(invalid.kind === 'reject', 'invalid selection must reject the whole action')
    const submitted = await h.send('action', {
        name: 'submit',
        payload: { keys: ['delivery-1'] },
        candidates: [],
    })
    fixtureAssert(
        submitted.kind === 'apply' && submitted.plan.commands.length === 1,
        'selected row must append once',
    )
    fixtureAssert(
        submitted.plan.commands[0].inputRefs[0] === 'delivery-1',
        'selection provenance lost',
    )
    const empty = fixtureHarness(program)
    empty.facts.inputClosed = true
    await empty.send('input-closed', { reason: 'completed' })
    const ended = await empty.send('action', { name: 'finish', payload: {}, candidates: [] })
    fixtureAssert(
        ended.kind === 'apply' &&
            ended.plan.commands.length === 0 &&
            ended.plan.production === 'declare-finished',
        'zero rows must have finish path',
    )
    return {
        rejection: invalid.kind,
        submitted: submitted.plan.commands.length,
        zeroResultFinish: ended.plan.production,
    }
})()
