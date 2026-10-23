/** 只接受可持久化的 JSON 值；检查后复制，避免冻结事件或跨槽别名逃逸。 */
export function jsonCopy<T>(value: T): T {
    const active = new Set<object>()
    let count = 0
    function visit(item: unknown): void {
        if (++count > 100000) throw new Error('JSON value is too large')
        if (item === null || typeof item === 'string' || typeof item === 'boolean') return
        if (typeof item === 'number') {
            if (!Number.isFinite(item) || (Number.isInteger(item) && !Number.isSafeInteger(item)))
                throw new Error('JSON number is not finite or exceeds safe integer range')
            return
        }
        if (typeof item !== 'object') throw new Error('value contains a non-JSON type')
        if (active.has(item)) throw new Error('value contains a JSON cycle')
        const array = Array.isArray(item)
        const prototype = Object.getPrototypeOf(item)
        if (prototype !== null && prototype !== (array ? Array.prototype : Object.prototype))
            throw new Error('value contains a non-JSON object')
        active.add(item)
        const fields = Object.getOwnPropertyDescriptors(item)
        for (const key of Reflect.ownKeys(fields)) {
            if (typeof key !== 'string') throw new Error('JSON symbol fields are not supported')
            const field = fields[key]!
            if (!('value' in field)) throw new Error('JSON getters and setters are not supported')
            if (!array || key !== 'length') visit(field.value)
        }
        if (array)
            for (let i = 0; i < item.length; i++)
                if (!fields[String(i)]) throw new Error('JSON array holes are not supported')
        active.delete(item)
    }
    visit(value)
    return JSON.parse(JSON.stringify(value)) as T
}

/** 当前事件快照递归冻结；返回值不持有作者传入的原对象。 */
export function readonlyCopy<T>(value: T): T {
    const copy = jsonCopy(value)
    function freeze(item: unknown): void {
        if (item === null || typeof item !== 'object') return
        for (const key of Object.keys(item)) freeze((item as Record<string, unknown>)[key])
        Object.freeze(item)
    }
    freeze(copy)
    return copy
}

export function objectValue(value: unknown, name: string): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        throw new Error(name + ' must be an object')
    return value as Record<string, unknown>
}

export function identity(value: unknown, name: string): string {
    if (typeof value !== 'string' || !value || value.trim() !== value || value.length > 128)
        throw new Error(name + ' must be a nonempty identity')
    return value
}
