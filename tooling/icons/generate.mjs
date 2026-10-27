import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { format, resolveConfig } from 'prettier'
import { root } from '../paths.mjs'
import { platformIcons } from './config.mjs'

/** 按唯一图标清单生成动态目录和静态入口；检查模式不修改源码。 */
export async function generateIconEntries(check = false) {
    const save = async (file, content) => {
        const target = path.join(root, file)
        content = await format(content, { ...(await resolveConfig(target)), filepath: target })
        if (check) {
            if ((await readFile(target, 'utf8')) !== content)
                throw new Error(`${file} 需要重新生成`)
        } else {
            await mkdir(path.dirname(target), { recursive: true })
            await writeFile(target, content)
        }
    }
    const dynamic =
        platformIcons
            .map((item, index) => `import platform${index} from './platforms/${item.file}.svg'`)
            .join('\n') +
        '\n\n/** 动态图标目录包含全部优化资产；已知平台优先使用静态入口。 */\nexport const platformIconUrls: Readonly<Record<string, string>> = {\n' +
        platformIcons.map((item, index) => `    '${item.id}': platform${index},`).join('\n') +
        '\n}\n'
    await save('lib/browser/ui/assets/platforms.ts', dynamic)
    for (const item of platformIcons) {
        await save(
            `lib/browser/ui/icons/platforms/${item.file}.ts`,
            `import source from '../../assets/platforms/${item.file}.svg'\nimport { platformImage } from '../platform-image'\nimport type { IconProps } from '../../components/icons'\n\n/** ${item.label} 的静态按需入口，只打包本平台的优化 SVG。 */\nexport function ${item.exportName}(props: IconProps = {}) {\n    return platformImage(source, '${item.label}', props)\n}\n`,
        )
    }
    await save(
        'lib/browser/ui/icons/platform-index.ts',
        platformIcons
            .map((item) => `export { ${item.exportName} } from './platforms/${item.file}'`)
            .join('\n') + '\n',
    )
}
