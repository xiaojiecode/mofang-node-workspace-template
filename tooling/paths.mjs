import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir, readdir, readFile } from 'node:fs/promises'
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const cache = path.resolve(process.env.MF_CACHE_DIR ?? path.join(root, '.cache'))
export const dist = path.join(root, 'dist')
export async function prepareCache() {
  await mkdir(cache, { recursive: true })
}
export async function nodeCodes() {
  return (await readdir(path.join(root, 'nodes'), { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()
}
export async function readJSON(file) {
  return JSON.parse(await readFile(file, 'utf8'))
}
