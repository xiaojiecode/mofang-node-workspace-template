import { parseArgs } from 'node:util'
import path from 'node:path'
import { mkdir, writeFile, realpath } from 'node:fs/promises'
import { root } from '../paths.mjs'
import { nodeFiles, presets } from './templates.mjs'
import { containedPath } from '../panels/manifest.mjs'
const { values } = parseArgs({
    options: {
        code: { type: 'string' },
        preset: { type: 'string', default: 'copy' },
        'settings-renderer': { type: 'string', default: 'lit' },
        'business-renderer': { type: 'string', default: 'lit' },
    },
})
if (
    typeof values.code !== 'string' ||
    !/^[a-z][a-z0-9-]{0,63}$/.test(values.code) ||
    !presets.includes(values.preset) ||
    ![values['settings-renderer'], values['business-renderer']].every((renderer) =>
        ['lit', 'puck'].includes(renderer),
    )
)
    throw new Error(
        'node:new requires --code <lowercase-kebab> [--preset copy|selection|human-wait|multi-instance] [--settings-renderer lit|puck] [--business-renderer lit|puck]',
    )
const files = nodeFiles(values.code, values.preset, {
    settingsRenderer: values['settings-renderer'],
    businessRenderer: values['business-renderer'],
})
const workspace = await realpath(root)
const nodes = await realpath(path.join(root, 'nodes'))
if (!containedPath(workspace, nodes)) throw new Error('nodes directory escapes workspace')
const target = path.join(nodes, values.code)
await mkdir(target)
for (const [relative, content] of Object.entries(files)) {
    const file = path.join(target, relative)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, content, { flag: 'wx' })
}
console.log('created nodes/' + values.code + ' from ' + values.preset)
