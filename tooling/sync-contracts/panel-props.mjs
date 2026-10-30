import path from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { root } from '../paths.mjs'

/** 注入属性采用扁平声明；结构变化时要求人工核对，不截断字段。 */
export function panelPropNames(source) {
    const body = source.match(/export interface PanelProps \{([^{}]+)\}/)
    if (!body) throw new Error('无法读取 PanelProps 注入声明')
    const names = body[1]
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
            const field = line.match(/^\s*(\w+)\??:\s*[^{};,\n]+;?\s*$/)
            if (!field) throw new Error('无法解析面板注入属性：' + line.trim())
            return field[1]
        })
    if (new Set(names).size !== names.length) throw new Error('面板注入属性重复')
    return names
}

/** CLI 注入清单由类型声明生成，文档引用同一声明。 */
export async function syncPanelProps(check = false) {
    const names = panelPropNames(
        await readFile(path.join(root, 'lib/contracts/src/browser/host.ts'), 'utf8'),
    )
    const file = path.join(
        root,
        '.agents/skills/mofang-js-node/scripts/mofang_cli/panel-props.json',
    )
    if (check) {
        if (JSON.stringify(JSON.parse(await readFile(file, 'utf8'))) !== JSON.stringify(names))
            throw new Error(
                '面板注入清单已过期，请运行 node tooling/sync-contracts/panel-props.mjs',
            )
    } else await writeFile(file, JSON.stringify(names, null, 4) + '\n')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
    await syncPanelProps(process.argv.includes('--check'))
