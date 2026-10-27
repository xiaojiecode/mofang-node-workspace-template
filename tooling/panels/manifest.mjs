import path from 'node:path'
import { lstat, readFile, realpath } from 'node:fs/promises'
import { root } from '../paths.mjs'

export const panelSurfaces = ['settings', 'business']

/** 判断解析后的路径是否仍属于指定目录，拒绝跨节点及符号链接逃逸。 */
export function containedPath(directory, candidate) {
    const relative = path.relative(directory, candidate)
    return (
        relative !== '' &&
        relative !== '..' &&
        !relative.startsWith('..' + path.sep) &&
        !path.isAbsolute(relative)
    )
}

/** 读取真实节点目录；目录编码与文件系统边界共同校验。 */
export async function resolveNodeDirectory(code, { rootDir = root } = {}) {
    if (typeof code !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(code))
        throw new Error('invalid node code')
    const workspace = await realpath(rootDir)
    const nodes = await realpath(path.join(workspace, 'nodes'))
    const directory = await realpath(path.join(nodes, code))
    if (!containedPath(workspace, nodes) || !containedPath(nodes, directory))
        throw new Error('node path escapes workspace')
    return directory
}

/** 校验入口的拼写和真实文件，禁止绝对路径、父目录及链接逃逸。 */
async function entryPath(directory, descriptor) {
    const { renderer, entry } = descriptor ?? {}
    if (
        !['lit', 'puck'].includes(renderer) ||
        typeof entry !== 'string' ||
        !entry ||
        entry.includes('\\') ||
        entry.split('/').some((part) => !part || part === '.' || part === '..') ||
        path.isAbsolute(entry) ||
        path.win32.isAbsolute(entry) ||
        entry.includes(':') ||
        !(renderer === 'puck' ? entry.endsWith('.page.json') : entry.endsWith('.ts'))
    )
        throw new Error('invalid panel renderer or entry')
    const file = await realpath(path.join(directory, entry))
    if (!containedPath(directory, file) || !(await lstat(file)).isFile())
        throw new Error('panel entry escapes node or is not a file')
    return file
}

/** 无描述文件的工程沿用 Lit；描述存在但错误时必须失败，不能静默回退。 */
export async function readNodePanels(code, options = {}) {
    const directory = await resolveNodeDirectory(code, options)
    const manifestPath = path.join(directory, 'panels.json')
    let manifest
    let legacy = false
    try {
        await lstat(manifestPath)
    } catch (error) {
        if (error.code !== 'ENOENT') throw error
        legacy = true
    }
    if (legacy) {
        manifest = {
            version: 1,
            settings: { renderer: 'lit', entry: 'settings.ts' },
            business: { renderer: 'lit', entry: 'view.ts' },
        }
    } else {
        if (!containedPath(directory, await realpath(manifestPath)))
            throw new Error('panels.json escapes node')
        manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    }
    if (
        !manifest ||
        manifest.version !== 1 ||
        Object.keys(manifest).some((key) => !['version', ...panelSurfaces].includes(key))
    )
        throw new Error('invalid panels.json version or fields')
    for (const surface of panelSurfaces) {
        const panel = manifest[surface]
        if (!panel || Object.keys(panel).some((key) => !['renderer', 'entry'].includes(key)))
            throw new Error('invalid panels.json surface: ' + surface)
    }
    const entries = await Promise.all(
        panelSurfaces.map((surface) => entryPath(directory, manifest[surface])),
    )
    if (entries[0] === entries[1]) throw new Error('panel entries must differ')
    return { ...manifest, legacy }
}

/** 返回经清单及真实路径校验的指定面板源文件。 */
export async function resolvePanelPath(code, surface, options = {}) {
    if (!panelSurfaces.includes(surface)) throw new Error('surface must be settings or business')
    const manifest = await readNodePanels(code, options)
    return entryPath(await resolveNodeDirectory(code, options), manifest[surface])
}
