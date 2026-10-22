function assert(ok, message) {
  if (!ok) throw new Error(message)
}
function clone(value) {
  return JSON.parse(JSON.stringify(value))
}
async function execute(p, value) {
  let output,
    step = p.entry,
    state = {},
    count = 0,
    failed
  const terminal = {}
  const ctx = {
    input: clone(value),
    state,
    call() {
      throw new Error('This fixture does not authorize Tool calls')
    },
    message() {},
    complete(value) {
      output = value
      if (!p.main) throw terminal
    },
    next(next, data) {
      step = next
      state = data
      if (!p.main) throw terminal
    },
    failNode(reason) {
      failed = reason
      if (!p.main) throw terminal
    },
  }
  if (p.main) {
    try {
      const result = await p.main(ctx)
      if (result !== undefined) output = result
    } catch (error) {
      if (error !== terminal) throw error
    }
  } else
    while (output === undefined && count++ < 50) {
      ctx.state = state
      try {
        await p.steps[step](ctx)
      } catch (error) {
        if (error !== terminal) throw error
      }
    }
  if (failed) throw new Error(failed)
  assert(output !== undefined, 'No output')
  return output
}
return (async () => {
  let output
  if (program.createState) {
    let state = program.createState(),
      view = null,
      spawned = [],
      candidates = []
    const ctx = {
      node: { runId: 'fixture-run', nodeInstanceId: 'fixture-node' },
      config: {},
      state,
      view: {
        current: view,
        replace(v) {
          view = clone(v)
        },
      },
      inputClosed: false,
      taskSummary: { queued: 0, running: 0, unresolved: 0 },
      tasks: {
        spawn(handler, input, inputRefs) {
          spawned.push({ handler, input, inputRefs })
          return 'fixture-task'
        },
      },
      outputs: {
        append(value, refs) {
          candidates.push({ value, refs })
          return 'fixture-candidate'
        },
      },
      finishProduction() {},
    }
    if (program.onStart) await program.onStart(ctx)
    assert(ctx.state.started === true, 'onStart was not observed')
    await program.onInput(ctx, { deliveryId: 'fixture-delivery', values: clone(input) })
    assert(spawned.length === 1, 'Expected one task')
    const task = spawned[0]
    output = await execute(program.tasks[task.handler], task.input)
    await program.onTaskResult(ctx, {
      status: 'succeeded',
      taskId: 'fixture-task',
      handler: task.handler,
      inputRefs: task.inputRefs,
      output,
    })
    assert(candidates.length === 1, 'Expected one candidate')
    assert(candidates[0].refs[0] === 'fixture-delivery', 'Lost input provenance')
    await program.onTaskResult(ctx, {
      status: 'unknown',
      taskId: 'unknown-task',
      handler: task.handler,
      inputRefs: [],
      error: { code: 'unknown', message: 'unknown' },
      operationRefs: ['op'],
    })
    assert(candidates.length === 1, 'Unknown result fabricated an output')
  } else output = await execute(program, input)
  assert(
    JSON.stringify(output.items[0]) === JSON.stringify(input.item),
    'Pass-through lost product fields',
  )
  return {
    passed: true,
    items: output.items.length,
    hooks: program.createState
      ? ['createState', 'onStart', 'onInput', 'onTaskResult']
      : ['execute'],
  }
})()
