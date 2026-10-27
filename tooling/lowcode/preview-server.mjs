import path from 'node:path'
import { readFile, realpath } from 'node:fs/promises'
import { readDocument } from './file-store.mjs'
import { readNodePanels, resolveNodeDirectory, containedPath } from '../panels/manifest.mjs'
import { validateAuthoringPackage } from '@mofang/low-code-page/authoring'
import { verifyNodeArtifacts } from '../verify/artifacts.mjs'
import { root, nodeCodes } from '../paths.mjs'

/** 只读预览服务，不提供浏览器编辑配置或保存页面的接口。 */
export function lowcodePreviewPlugin() {
    return {
        name: 'lowcode-readonly-preview',
        configureServer(server) {
            server.watcher.add(path.join(root, 'nodes'))
            server.watcher.on('change', (file) => {
                if (
                    file.endsWith('.page.json') &&
                    file.startsWith(path.join(root, 'nodes') + path.sep)
                )
                    server.ws.send({
                        type: 'custom',
                        event: 'lowcode:changed',
                        data: { file: path.relative(root, file) },
                    })
            })
            server.middlewares.use('/__lowcode', async (req, res) => {
                res.setHeader('content-type', 'application/json; charset=utf-8')
                res.setHeader('cache-control', 'no-store')
                try {
                    if (req.method !== 'GET') {
                        res.statusCode = 405
                        res.end(JSON.stringify({ error: '预览只读，请通过 AI 作者工具修改页面' }))
                        return
                    }
                    const url = new URL(req.url, 'http://localhost')
                    if (url.pathname === '/nodes') {
                        const nodes = []
                        for (const code of await nodeCodes())
                            nodes.push({ code, panels: await readNodePanels(code) })
                        res.end(JSON.stringify(nodes))
                        return
                    }
                    const manifestMatch = url.pathname.match(/^\/([a-z][a-z0-9-]{0,63})\/manifest$/)
                    if (manifestMatch) {
                        res.end(JSON.stringify(await readNodePanels(manifestMatch[1])))
                        return
                    }
                    const match = url.pathname.match(
                        /^\/([a-z][a-z0-9-]{0,63})\/(settings|business)$/,
                    )
                    if (!match) {
                        res.statusCode = 404
                        res.end(JSON.stringify({ error: '页面不存在' }))
                        return
                    }
                    const [, code, surface] = match
                    const document = await readDocument(code, surface)
                    const dir = await resolveNodeDirectory(code)
                    const fixtureFile = async (relative) => {
                        const file = await realpath(path.join(dir, relative))
                        if (!containedPath(dir, file)) throw new Error('fixture 路径超出当前节点')
                        return JSON.parse(await readFile(file, 'utf8'))
                    }
                    let fixture = {},
                        input = {}
                    try {
                        fixture = await fixtureFile('fixtures/preview.json')
                    } catch (error) {
                        if (error.code !== 'ENOENT') throw error
                    }
                    try {
                        input = await fixtureFile('fixtures/input.json')
                    } catch (error) {
                        if (error.code !== 'ENOENT') throw error
                    }
                    if (url.searchParams.get('artifacts') === 'true') {
                        const { sources } = await verifyNodeArtifacts(code)
                        const content = sources[surface]
                        document.definition = JSON.parse(content)
                        document.revision = (await import('./file-store.mjs')).revisionOf(content)
                    }
                    const checked = validateAuthoringPackage(document.definition, {
                        nodeCode: code,
                        surface,
                    })
                    if (!checked.valid) throw new Error(checked.errors.join('；'))
                    res.end(
                        JSON.stringify({
                            key: document.key,
                            revision: document.revision,
                            definition: document.definition,
                            fixture,
                            input,
                            panels: await readNodePanels(code),
                        }),
                    )
                } catch (error) {
                    res.statusCode = 422
                    res.end(JSON.stringify({ error: error.message, code: error.code }))
                }
            })
        },
    }
}
