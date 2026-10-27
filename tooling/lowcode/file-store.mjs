import path from 'node:path'
import { createHash, randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile, rename, unlink, open, lstat, realpath } from 'node:fs/promises'
import { root } from '../paths.mjs'
import { resolvePanelPath, readNodePanels } from '../panels/manifest.mjs'

export const revisionOf = (value) => createHash('sha256').update(value).digest('hex')
export function failure(code, message, details = {}) {
    return Object.assign(new Error(message), { code, details })
}
/** 逐层创建本地事务目录，链接不参与锁或检查点存储，避免缓存目录逃逸。 */
async function cacheDirectory(workspace, ...parts) {
    let directory = await realpath(workspace)
    for (const part of ['.cache', 'lowcode', ...parts]) {
        directory = path.join(directory, part)
        await mkdir(directory).catch((error) => {
            if (error.code !== 'EEXIST') throw error
        })
        const info = await lstat(directory)
        if (!info.isDirectory() || info.isSymbolicLink())
            throw failure('unsafe_cache_path', '事务缓存目录必须是工作区内的普通目录')
    }
    return directory
}
/** 页面身份和实际路径只由节点清单决定，调用方不能指定任意目标文件。 */
export async function readDocument(code, surface, options = {}) {
    const panels = await readNodePanels(code, options)
    if (!['settings', 'business'].includes(surface) || panels[surface].renderer !== 'puck')
        throw failure('not_lowcode', '此面板不是 Puck 页面')
    const file = await resolvePanelPath(code, surface, options)
    const bytes = await readFile(file)
    let definition
    try {
        definition = JSON.parse(bytes.toString('utf8'))
    } catch {
        throw failure('invalid_json', '页面 JSON 无法解析；原文件未修改', { file })
    }
    return { key: `${code}:${surface}`, revision: revisionOf(bytes), definition, file }
}
/** 跨命令进程锁保护检查点和写入；冲突时完整保留磁盘与待提交内容。 */
export async function changeDocument(code, surface, expectedRevision, transform, options = {}) {
    const before = await readDocument(code, surface, options)
    if (typeof expectedRevision !== 'string' || expectedRevision !== before.revision)
        throw failure('revision_conflict', '页面已变化，请 inspect 后重新应用', {
            currentRevision: before.revision,
        })
    const workspace = options.rootDir ?? root
    const locks = await cacheDirectory(workspace, 'locks')
    const lockFile = path.join(locks, `${code}-${surface}.lock`)
    let lock
    try {
        lock = await open(lockFile, 'wx')
    } catch (error) {
        if (error.code === 'EEXIST')
            throw failure('document_busy', '另一作者操作正在修改该页面；请稍后重读')
        throw error
    }
    let temporary
    try {
        await lock.writeFile(
            JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }),
        )
        const current = await readDocument(code, surface, options)
        if (current.revision !== expectedRevision)
            throw failure('revision_conflict', '页面已变化，未覆盖外部修改', {
                currentRevision: current.revision,
            })
        const checkpointBytes = await readFile(current.file)
        if (revisionOf(checkpointBytes) !== expectedRevision)
            throw failure('revision_conflict', '页面已变化，未覆盖外部修改')
        const transformed = await transform(structuredClone(current.definition))
        const { validateAuthoringPackage } = await import('@mofang/low-code-page/authoring')
        const checked = validateAuthoringPackage(transformed.definition, {
            nodeCode: code,
            surface,
        })
        if (!checked.valid)
            throw failure('validation_failed', '整批修改未通过校验，页面未保存', checked)
        const definition = checked.value ?? transformed.definition
        const content = JSON.stringify(definition, null, 4) + '\n'
        const checkpoints = await cacheDirectory(workspace, 'checkpoints', code, surface)
        const checkpoint = path.join(checkpoints, current.revision + '.json')
        await writeFile(checkpoint, checkpointBytes, { flag: 'wx' }).catch(async (error) => {
            if (error.code !== 'EEXIST') throw error
            const info = await lstat(checkpoint)
            if (
                !info.isFile() ||
                info.isSymbolicLink() ||
                revisionOf(await readFile(checkpoint)) !== current.revision
            )
                throw failure('checkpoint_corrupt', '已存在检查点无效，页面未保存')
        })
        temporary = path.join(
            path.dirname(current.file),
            `.${path.basename(current.file)}.${randomUUID()}.tmp`,
        )
        await writeFile(temporary, content, { flag: 'wx' })
        if (revisionOf(await readFile(current.file)) !== expectedRevision)
            throw failure('revision_conflict', '写入前检测到外部修改，原文件保持不变')
        await rename(temporary, current.file)
        temporary = undefined
        return {
            key: current.key,
            revision: revisionOf(content),
            checkpointId: current.revision,
            definition,
            idMap: transformed.idMap ?? {},
            changes: transformed.changes ?? [],
        }
    } finally {
        if (temporary) await unlink(temporary).catch(() => {})
        await lock.close()
        await unlink(lockFile)
    }
}
export async function restoreDocument(code, surface, expectedRevision, checkpointId, options = {}) {
    if (!/^[a-f0-9]{64}$/.test(checkpointId ?? ''))
        throw failure('invalid_checkpoint', '检查点 ID 无效')
    return changeDocument(
        code,
        surface,
        expectedRevision,
        async () => {
            const directory = await cacheDirectory(
                options.rootDir ?? root,
                'checkpoints',
                code,
                surface,
            )
            const file = path.join(directory, checkpointId + '.json')
            const info = await lstat(file)
            if (!info.isFile() || info.isSymbolicLink())
                throw failure('unsafe_cache_path', '检查点必须是普通文件')
            const bytes = await readFile(file)
            if (revisionOf(bytes) !== checkpointId)
                throw failure('checkpoint_corrupt', '检查点内容摘要不匹配')
            return {
                definition: JSON.parse(bytes.toString('utf8')),
                changes: [{ op: 'restore', checkpointId }],
            }
        },
        options,
    )
}
