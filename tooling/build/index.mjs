import path from 'node:path'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { root, dist, nodeCodes } from '../paths.mjs'
import { bundle, loadDefinition, litMode } from './bundle.mjs'
for (const code of await nodeCodes()) {
  const directory = path.join(root, 'nodes', code),
    definition = await loadDefinition(directory)
  if (definition.code !== code) throw new Error('节点目录与编码不一致：' + code)
  const out = path.join(dist, code)
  await rm(out, { recursive: true, force: true })
  await mkdir(out, { recursive: true })
  const entries = [
    ['settings', 'panel'],
    ['business', 'panel'],
    ['pageProgram', 'page-program'],
    ...(definition.interface === 'panels' ? [] : [['executor', 'executor']]),
  ]
  const artifacts = {}
  for (const [entry, kind] of entries) {
    const relative = definition.entries[entry]
    if (
      !relative ||
      path.isAbsolute(relative) ||
      path.relative(directory, path.resolve(directory, relative)).startsWith('..')
    )
      throw new Error('入口必须位于节点目录内：' + entry)
    const { code: source } = await bundle(path.join(directory, relative), kind)
    const file = entry === 'executor' ? 'program.js' : entry + '.js'
    await writeFile(path.join(out, file), source)
    artifacts[entry] = {
      file,
      bytes: Buffer.byteLength(source),
      sha256: createHash('sha256').update(source).digest('hex'),
    }
  }
  const { interface: programInterface, entries: _, ...metadata } = definition
  if (programInterface !== 'panels') {
    const { readFile } = await import('node:fs/promises')
    await writeFile(
      path.join(out, 'node.json'),
      JSON.stringify(
        { ...metadata, source: await readFile(path.join(out, 'program.js'), 'utf8') },
        null,
        2,
      ) + '\n',
    )
  }
  await writeFile(
    path.join(out, 'manifest.json'),
    JSON.stringify({ code, interface: programInterface, litMode, artifacts }, null, 2) + '\n',
  )
  console.log(code + ': ' + Object.keys(artifacts).join(', '))
}
