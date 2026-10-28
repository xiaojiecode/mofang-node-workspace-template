import { parseArgs } from 'node:util'
import path from 'node:path'
import { mkdir, writeFile, realpath } from 'node:fs/promises'
import { root } from '../paths.mjs'
import { skeletonFiles } from './skeleton.mjs'
import { containedPath } from '../panels/manifest.mjs'
const { values } = parseArgs({
    options: {
        code: { type: 'string' },
        'settings-renderer': { type: 'string', default: 'lit' },
        'business-renderer': { type: 'string', default: 'lit' },
    },
})
if (
    typeof values.code !== 'string' ||
    !/^[a-z][a-z0-9-]{0,63}$/.test(values.code) ||
    ![values['settings-renderer'], values['business-renderer']].every((renderer) =>
        ['lit', 'puck'].includes(renderer),
    )
)
    throw new Error(
        'node:new requires --code <lowercase-kebab> [--settings-renderer lit|puck] [--business-renderer lit|puck]',
    )
const files = skeletonFiles(values.code, {
    settingsRenderer: values['settings-renderer'],
    businessRenderer: values['business-renderer'],
})
const workspace = await realpath(root)
const nodesPath = path.join(root, 'nodes')
await mkdir(nodesPath, { recursive: true })
const nodes = await realpath(nodesPath)
if (!containedPath(workspace, nodes)) throw new Error('nodes directory escapes workspace')
const target = path.join(nodes, values.code)
await mkdir(target)
for (const [relative, content] of Object.entries(files)) {
    const file = path.join(target, relative)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, content, { flag: 'wx' })
}
console.log('created nodes/' + values.code + ' skeleton')
