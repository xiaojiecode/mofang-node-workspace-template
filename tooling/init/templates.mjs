import path from 'node:path'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const presets = ['copy', 'selection', 'human-wait', 'multi-instance']
/** 从同一套真实案例产生节点；不保留旧 lifecycle/main 入口转换。 */
export function nodeFiles(code, preset = 'copy') {
    if (!/^[a-z][a-z0-9-]{0,63}$/.test(code) || !presets.includes(preset))
        throw new Error('invalid node code or preset')
    const source = fileURLToPath(new URL('./templates/' + preset, import.meta.url))
    const result = {}
    function visit(relative = '') {
        for (const entry of readdirSync(path.join(source, relative), { withFileTypes: true })) {
            const name = path.posix.join(relative, entry.name)
            if (entry.isDirectory()) visit(name)
            else
                result[name] = readFileSync(path.join(source, name), 'utf8').replace(
                    new RegExp("code: '" + preset + "'", 'g'),
                    "code: '" + code + "'",
                )
        }
    }
    visit()
    return result
}
