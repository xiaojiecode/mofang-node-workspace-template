import path from 'node:path'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { skeletonPanelFiles } from './skeleton-panels.mjs'

/** 从中性骨架生成节点文件，不携带任何业务示例或预设。 */
export function skeletonFiles(code, renderers = {}) {
    if (!/^[a-z][a-z0-9-]{0,63}$/.test(code)) throw new Error('invalid node code')
    const source = fileURLToPath(new URL('./skeleton', import.meta.url))
    const result = {}
    function visit(relative = '') {
        for (const entry of readdirSync(path.join(source, relative), { withFileTypes: true })) {
            const name = path.posix.join(relative, entry.name)
            if (entry.isDirectory()) visit(name)
            else
                result[name] = readFileSync(path.join(source, name), 'utf8').replaceAll(
                    '__NODE_CODE__',
                    code,
                )
        }
    }
    visit()
    const panels = skeletonPanelFiles(code, renderers)
    if (renderers.settingsRenderer === 'puck') delete result['settings.ts']
    if (renderers.businessRenderer === 'puck') delete result['view.ts']
    return { ...result, ...panels }
}
