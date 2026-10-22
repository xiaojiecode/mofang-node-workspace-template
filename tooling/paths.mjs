import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir, readdir, readFile } from 'node:fs/promises'
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
 * 读取当前工程 nodes 下的节点目录并排序，供构建、预览和验证共用。
 * 不把目录名当作平台目录身份，也不在读取时执行节点程序。
 */
export async function nodeCodes() {
    return (await readdir(path.join(root, 'nodes'), { withFileTypes: true }))
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort()
}
/**
 * 以 UTF-8 读取并解析 JSON。文件缺失或格式错误直接抛出，避免把错误配置默认为空对象。
 */
export async function readJSON(file) {
    return JSON.parse(await readFile(file, 'utf8'))
}
