import { parseArgs } from 'node:util'
import path from 'node:path'
import { format, resolveConfig } from 'prettier'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { root } from '../paths.mjs'
import { nodeFiles } from './templates.mjs'
const { values } = parseArgs({
    options: { code: { type: 'string' }, interface: { type: 'string', default: 'lifecycle' } },
})
if (!values.code || !/^[a-z][a-z0-9-]{0,63}$/.test(values.code))
    throw new Error('--code 必须是 1–64 位小写字母、数字或横线，以字母开头。')
if (!['main', 'stages', 'lifecycle', 'panels'].includes(values.interface))
    throw new Error('--interface 只接受 main/stages/lifecycle/panels')
const target = path.join(root, 'nodes', values.code)
const formatting = await resolveConfig(path.join(root, 'package.json'))
await mkdir(path.dirname(target), { recursive: true })
await mkdir(target) // Fail on an existing node; never replace authored files.
for (const [relative, content] of Object.entries(nodeFiles(values.code, values.interface))) {
    const file = path.join(target, relative)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, await format(content, { ...formatting, filepath: file }), { flag: 'wx' })
}
if (values.interface !== 'panels')
    await writeFile(
        path.join(target, 'fixtures/goja-test.js'),
        await format(await readFile(new URL('./goja-fixture.js', import.meta.url), 'utf8'), {
            ...formatting,
            parser: 'babel',
        }),
        { flag: 'wx' },
    )
console.log('已创建 nodes/' + values.code + ' (' + values.interface + ')')
