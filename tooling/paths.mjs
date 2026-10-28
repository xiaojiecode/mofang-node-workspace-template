import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir, readdir, readFile, stat } from 'node:fs/promises'
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const cache = path.resolve(process.env.MF_CACHE_DIR ?? path.join(root, '.cache'))
export const dist = path.join(root, 'dist')
/**
 * 创建当前任务指定的缓存目录；优先使用 MF_CACHE_DIR，避免把验证材料写进发布产物。
 */
export async function prepareCache() {
    await mkdir(cache, { recursive: true })
}
/**
 * 读取包含 node.ts 的节点目录并排序，忽略尚未设计的空目录占位。
 * 不把目录名当作平台目录身份，也不在读取时执行节点程序。
 */
export async function nodeCodes({ rootDir = root } = {}) {
    const directory = path.join(rootDir, 'nodes')
    let entries
    try {
        entries = await readdir(directory, { withFileTypes: true })
    } catch (error) {
        if (error.code === 'ENOENT') return []
        throw error
    }
    const candidates = entries.filter((entry) => entry.isDirectory())
    const codes = await Promise.all(
        candidates.map(async (entry) => {
            try {
                if (!(await stat(path.join(directory, entry.name, 'node.ts'))).isFile())
                    throw new Error('节点定义必须是文件：' + entry.name + '/node.ts')
                return entry.name
            } catch (error) {
                if (error.code === 'ENOENT') return undefined
                throw error
            }
        }),
    )
    return codes.filter((code) => code !== undefined).sort()
}
/**
 * 以 UTF-8 读取并解析 JSON。文件缺失或格式错误直接抛出，避免把错误配置默认为空对象。
 */
export async function readJSON(file) {
    return JSON.parse(await readFile(file, 'utf8'))
}
