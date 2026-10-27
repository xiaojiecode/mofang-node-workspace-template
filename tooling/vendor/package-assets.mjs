import { createHash } from 'node:crypto'
import { parse } from 'acorn'
import postcss from 'postcss'

const systemFonts =
    'system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
const inheritedFont = `var(--font-default, ${systemFonts})`
const demoPaths = new Set([
    'src/components/report-display/assets/pet-carrier-backpack.png',
    'src/components/report-display/assets/pet-carseat.png',
    'src/components/report-display/assets/pet-stroller.png',
])

/** 不携带字体二进制；许可与来源记录仍保留。 */
export const isFontAsset = (file) =>
    /\.(woff2?|ttf|otf|eot|ttc)$/i.test(file) || /^fonts\/.*\.svg$/i.test(file)

/** 仅调整字体声明，保留其余布局、主题及图片样式。宿主没有字体设置时使用系统字体。 */
export function useSystemFonts(css) {
    const root = postcss.parse(css)
    root.walkAtRules(/^font-face$/i, (rule) => rule.remove())
    root.walkDecls((declaration) => {
        if (declaration.prop === '--font-default') {
            declaration.remove()
            return
        }
        declaration.value = declaration.value.replace(/var\(--font-default\)/g, inheritedFont)
        if (
            declaration.prop === 'font-family' &&
            /Mofang Cockpit|Noto Sans SC/.test(declaration.value)
        ) {
            declaration.value = inheritedFont
        }
    })
    return root.toString()
}

/** 按来源清单的内容摘要定位三张示例图，不匹配业务图片或其他图标。 */
export function demoImageHashes(manifest) {
    return new Map(
        (manifest.files ?? [])
            .filter((file) => demoPaths.has(file.path))
            .map((file) => [file.sha256, file.path]),
    )
}

/** 仅替换 JS 字符串常量；报告原有的无图分支会显示编号占位。 */
export function removeDemoImages(code, hashes) {
    if (!hashes.size || !code.includes('data:image/png;base64,')) return { code, removed: [] }
    const tree = parse(code, { ecmaVersion: 'latest', sourceType: 'module' })
    const pending = [tree],
        replacements = [],
        removed = new Set()
    while (pending.length) {
        const node = pending.pop()
        if (
            node.type === 'Literal' &&
            typeof node.value === 'string' &&
            node.value.startsWith('data:image/png;base64,')
        ) {
            const bytes = Buffer.from(node.value.slice('data:image/png;base64,'.length), 'base64')
            const source = hashes.get(createHash('sha256').update(bytes).digest('hex'))
            if (source) {
                replacements.push([node.start, node.end])
                removed.add(source)
            }
        }
        for (const value of Object.values(node)) {
            if (Array.isArray(value)) {
                for (const child of value) if (child?.type) pending.push(child)
            } else if (value?.type) pending.push(value)
        }
    }
    for (const [start, end] of replacements.sort((a, b) => b[0] - a[0]))
        code = code.slice(0, start) + '""' + code.slice(end)
    return { code, removed: [...removed] }
}
