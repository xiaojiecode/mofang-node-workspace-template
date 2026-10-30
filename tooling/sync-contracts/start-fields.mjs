/** 从起跑正文的扁平类型声明提取字段；结构变化时停止同步，避免静默遗漏。 */
export function startWorkflowRunFields(source) {
    const body = source.match(/export type StartWorkflowRunBody = Readonly<\{([^{}]*)\}>/)
    if (!body) throw new Error('无法读取 StartWorkflowRunBody，需核对起跑契约结构')
    const lines = body[1].replace(/\/\*[\s\S]*?\*\//g, '').split('\n')
    const fields = []
    for (const line of lines) {
        if (!line.trim()) continue
        const field = line.match(/^\s*(\w+)\??:\s*[^{};,\n]+;?\s*$/)
        if (!field) throw new Error('无法解析起跑契约字段：' + line.trim())
        if (fields.includes(field[1])) throw new Error('起跑契约存在重复字段')
        fields.push(field[1])
    }
    if (!fields.includes('workflowId')) throw new Error('起跑契约缺少 workflowId')
    return fields.filter((field) => field !== 'workflowId')
}
