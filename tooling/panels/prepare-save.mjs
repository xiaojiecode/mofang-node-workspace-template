import path from 'node:path'
import { writeFile } from 'node:fs/promises'
import { root, readJSON } from '../paths.mjs'
import { verifyNodeArtifacts } from '../verify/artifacts.mjs'

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
        body.viewSource = sources[surface]
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
            body.programSource = sources.pageProgram
            body.supportedContextSchemas = supportedContextSchemas
        }
    }
    if (out)
        await writeFile(path.resolve(out), JSON.stringify(body, null, 4) + '\n', { flag: 'wx' })
    return body
}
