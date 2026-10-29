/** 仅用于本地作者库验证，不包含Workflow账本、Tool、权限或持久化。 */
function fixtureHarness(program, config = {}) {
    const facts = {
        runId: 'fixture-run',
        nodeInstanceId: 'fixture-node',
        sessionRevision: '1',
        status: { run: 'running', session: 'running', closure: 'open' },
        gate: { paused: false, cancelled: false, canHandle: true },
        inputClosed: false,
        productionDeclared: false,
        policy: { mode: 'manual', reviewPoint: false },
        tasks: { queued: 0, running: 0, waiting: 0, unknown: 0, failed: 0, unresolved: 0 },
        candidates: { total: 0, pending: 0, released: 0, removed: 0 },
    }
    const basis = {
        sourceHash: 'fixture-source',
        sessionRevision: '1',
        configDigest: 'fixture-config',
        factsDigest: 'fixture-facts',
    }
    let state = program.initialize({ sourceHash: basis.sourceHash, config, facts })
    let sequence = 0,
        allocated = 0
    const host = {
        allocateId(kind) {
            return kind + '-' + ++allocated
        },
    }
    return {
        facts,
        get state() {
            return state
        },
        project() {
            return program.project({ basis, state, config, facts })
        },
        async send(type, payload) {
            const result = await program.handle(
                {
                    basis,
                    state,
                    config,
                    facts,
                    event: {
                        id: 'event-' + ++sequence,
                        sequence: String(sequence),
                        type,
                        createdAt: '2026-10-23T00:00:00Z',
                        payload,
                    },
                },
                host,
            )
            if (result.kind === 'apply') {
                state = result.nextState
                if (result.plan.production === 'declare-finished') facts.productionDeclared = true
            }
            return result
        },
    }
}
function fixtureAssert(condition, message) {
    if (!condition) throw new Error(message)
}
