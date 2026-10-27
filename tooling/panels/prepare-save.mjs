import path from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { root, readJSON } from '../paths.mjs'
import { verifyNodeArtifacts } from '../verify/artifacts.mjs'
import { resolvePanelPath } from './manifest.mjs'

/** 从本地构建和已回读的目录快照组装保存正文；不会保存、发布或查询平台。 */
export async function prepareSave({
    code,
    surface,
    catalogFile,
    out,
    supportedContextSchemas,
    rootDir = root,
}) {
    if (!['settings', 'business'].includes(surface) || !catalogFile)
        throw new Error('prepare-save requires code, surface and catalogFile')
    const envelope = await readJSON(path.resolve(catalogFile))
    if (envelope.ok === false) throw new Error('catalog snapshot is a failed response')
    const catalog = envelope.ok === true ? envelope.data : envelope
    if (
        catalog?.code !== code ||
        typeof catalog.catalogInstanceId !== 'string' ||
        !catalog.catalogInstanceId.trim() ||
        typeof catalog.catalogRevision !== 'string' ||
        !/^[1-9]\d*$/.test(catalog.catalogRevision)
    )
        throw new Error('catalog code, catalogInstanceId or catalogRevision is invalid')
    const { manifest, sources } = await verifyNodeArtifacts(code, { rootDir })
    const artifact = manifest.artifacts[surface]
    const body = {
        kind: 'save',
        surface,
        renderMode: artifact.renderMode,
        expectedCatalogInstanceId: catalog.catalogInstanceId,
        expectedCatalogRevision: catalog.catalogRevision,
    }
    if (artifact.rendererKey === 'puck') {
        body.rendererKey = 'puck'
        body.config = JSON.parse(sources[surface])
    } else {
        const sourceFile = await resolvePanelPath(code, surface, { rootDir })
        const authoredSource = await readFile(sourceFile, 'utf8')
        body.viewSource = authoredSource
        body.viewCompiled = sources[surface]
        body.viewHash = createHash('sha256').update(sources[surface]).digest('hex')
        body.compilerVersion =
            manifest.build?.compilerVersion ??
            `local-esbuild@${manifest.build?.esbuildVersion ?? 'unknown'}/mf-page-v2`
        if (surface === 'business') {
            if (
                !Array.isArray(supportedContextSchemas) ||
                !supportedContextSchemas.length ||
                new Set(supportedContextSchemas).size !== supportedContextSchemas.length ||
                supportedContextSchemas.some(
                    (value) =>
                        typeof value !== 'string' ||
                        !value ||
                        value.trim() !== value ||
                        value.includes('\0') ||
                        Buffer.byteLength(value) > 256,
                )
            )
                throw new Error('Lit business requires explicit supportedContextSchemas')
            let pageSourceFile = path.join(rootDir, 'nodes', code, 'page.ts')
            try {
                await readFile(pageSourceFile, 'utf8')
            } catch (error) {
                if (error.code !== 'ENOENT') throw error
                pageSourceFile = path.join(rootDir, 'lib/browser/page.ts')
            }
            const authoredProgram = await readFile(pageSourceFile, 'utf8')
            body.programSource = authoredProgram
            body.programCompiled = sources.pageProgram
            body.programHash = createHash('sha256').update(sources.pageProgram).digest('hex')
            body.supportedContextSchemas = supportedContextSchemas
        }
    }
    if (out)
        await writeFile(path.resolve(out), JSON.stringify(body, null, 4) + '\n', { flag: 'wx' })
    return body
}
