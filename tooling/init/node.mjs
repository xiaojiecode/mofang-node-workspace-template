import { parseArgs } from 'node:util'
import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { root } from '../paths.mjs'
import { nodeFiles } from './templates.mjs'
const { values } = parseArgs({
    options: { code: { type: 'string' }, preset: { type: 'string', default: 'copy' } },
})
const files = nodeFiles(values.code, values.preset)
const target = path.join(root, 'nodes', values.code)
await mkdir(target)
for (const [relative, content] of Object.entries(files)) {
    const file = path.join(target, relative)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, content, { flag: 'wx' })
}
console.log('created nodes/' + values.code + ' from ' + values.preset)
