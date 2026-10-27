import path from 'node:path'
import {
    mkdir,
    readFile,
    writeFile,
    realpath,
    lstat,
    readdir,
    rename,
    rm,
    open,
} from 'node:fs/promises'
import { createHash, randomUUID } from 'node:crypto'
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'
import { root } from '../paths.mjs'

const names = {
    'low-code': ['low-code-page', '@mofang/low-code-page'],
    sdk: ['workflow-sdk', '@mofang/workflow-sdk'],
    workflow: ['workflow-lowcode', '@mofang/workflow-lowcode'],
}
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
const inside = (parent, child) => {
    const relative = path.relative(parent, child)
    return (
        relative !== '' &&
        !relative.startsWith('..' + path.sep) &&
        relative !== '..' &&
        !path.isAbsolute(relative)
    )
}
async function exists(file) {
    try {
        return await lstat(file)
    } catch (error) {
        if (error.code === 'ENOENT') return null
        throw error
    }
}
async function inventory(directory) {
    const files = []
    async function visit(current) {
        for (const entry of await readdir(current, { withFileTypes: true })) {
            const file = path.join(current, entry.name)
            if (entry.isSymbolicLink()) throw new Error(`产物不能包含链接：${file}`)
            if (entry.isDirectory()) await visit(file)
            else if (entry.isFile())
                files.push({
                    path: path.relative(directory, file).replaceAll('\\', '/'),
                    sha256: hash(await readFile(file)),
                })
            else throw new Error(`产物包含不支持的文件：${file}`)
        }
    }
    await visit(directory)
    return files.sort((a, b) => a.path.localeCompare(b.path))
}
function manifestPath(value) {
    return (
        typeof value === 'string' &&
        value.length > 0 &&
        !value.includes('\\') &&
        !path.posix.isAbsolute(value) &&
        !/^[a-z]:/i.test(value) &&
        value.split('/').every((part) => part && part !== '.' && part !== '..')
    )
}
function checkExports(pkg, files) {
    const listed = new Set(files.map((file) => file.path))
    function visit(value) {
        if (typeof value === 'string') {
            if (
                !value.startsWith('./') ||
                !manifestPath(value.slice(2)) ||
                !listed.has(value.slice(2))
            )
                throw new Error(`包导出不存在或不安全：${value}`)
        } else if (Array.isArray(value)) value.forEach(visit)
        else if (value && typeof value === 'object') Object.values(value).forEach(visit)
    }
    visit(pkg.exports)
    for (const key of ['main', 'types'])
        if (pkg[key]) visit(pkg[key].startsWith('./') ? pkg[key] : './' + pkg[key])
}
export async function inspectSource(source, expected) {
    const directory = await realpath(source)
    const pkg = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'))
    if (pkg.name !== expected || typeof pkg.version !== 'string' || !pkg.version)
        throw new Error(`产物包名或版本不匹配：需要 ${expected}`)
    const files = await inventory(directory)
    if (files.some((file) => file.path.startsWith('node_modules/')))
        throw new Error('同步来源必须是生成产物，不能包含已安装依赖')
    checkExports(pkg, files)
    let manifestBytes
    if (files.some((file) => file.path === 'manifest.json')) {
        manifestBytes = await readFile(path.join(directory, 'manifest.json'))
        const manifest = JSON.parse(manifestBytes)
        if (!Array.isArray(manifest.outputs)) throw new Error('产物 manifest 缺少 outputs 清单')
        const expectedFiles = new Map()
        for (const file of manifest.outputs) {
            if (
                !manifestPath(file.path) ||
                !/^[a-f0-9]{64}$/.test(file.sha256 ?? '') ||
                expectedFiles.has(file.path)
            )
                throw new Error('产物 manifest 路径、hash 或重复项无效')
            expectedFiles.set(file.path, file.sha256)
        }
        const actualFiles = files.filter((file) => file.path !== 'manifest.json')
        if (
            actualFiles.length !== expectedFiles.size ||
            actualFiles.some((file) => expectedFiles.get(file.path) !== file.sha256)
        )
            throw new Error('产物与 manifest 输出清单或 hash 不一致，停止同步')
    } else {
        // SDK builds without a manifest still pin every output byte, not just package.json.
        manifestBytes = Buffer.from(
            JSON.stringify({ name: pkg.name, version: pkg.version, outputs: files }),
        )
    }
    return { directory, pkg, files, digest: hash(manifestBytes) }
}
async function ordinaryDirectory(directory, workspace) {
    if (!inside(workspace, directory)) throw new Error('同步目录超出当前工作区')
    const relative = path.relative(workspace, directory).split(path.sep)
    let current = workspace
    for (const part of relative) {
        current = path.join(current, part)
        await mkdir(current).catch((error) => {
            if (error.code !== 'EEXIST') throw error
        })
        const info = await lstat(current)
        if (!info.isDirectory() || info.isSymbolicLink())
            throw new Error(`同步目录不能是链接：${current}`)
    }
}

/** 显式同步固定产物；预检清单，再整体替换生成目录，失败回滚本次替换。 */
export async function syncVendor(values, { rootDir = root } = {}) {
    if (!values || !Object.keys(values).length)
        throw new Error('至少提供 --low-code、--sdk 或 --workflow 来源')
    const workspace = await realpath(rootDir)
    const vendor = path.join(workspace, 'vendor')
    await ordinaryDirectory(vendor, workspace)
    const lockFile = path.join(vendor, '.lowcode-sync.lock')
    const guard = await open(lockFile, 'wx').catch((error) => {
        if (error.code === 'EEXIST') throw new Error('已有产物同步进行中')
        throw error
    })
    const swaps = []
    let committed = false
    try {
        const lockPath = path.join(vendor, 'lowcode-lock.json')
        const lockInfo = await exists(lockPath)
        if (lockInfo?.isSymbolicLink()) throw new Error('产物锁文件不能是链接')
        const lock = lockInfo ? JSON.parse(await readFile(lockPath, 'utf8')) : {}
        const sources = []
        for (const [key, source] of Object.entries(values)) {
            if (!Object.hasOwn(names, key) || typeof source !== 'string')
                throw new Error(`未知或无效同步参数：${key}`)
            const [folder, expected] = names[key]
            const inspected = await inspectSource(source, expected)
            const destination = path.join(vendor, folder)
            if (
                inspected.directory === destination ||
                inside(destination, inspected.directory) ||
                inside(inspected.directory, destination)
            )
                throw new Error('来源与同步目标不能相同或互相包含')
            if ((await exists(destination))?.isSymbolicLink())
                throw new Error('vendor 产物目录不能是链接')
            const targets = [destination]
            const installed = path.join(workspace, 'node_modules', ...expected.split('/'))
            if (await exists(installed)) {
                const actual = await realpath(installed)
                if (actual !== destination) {
                    if (!inside(path.join(workspace, 'node_modules'), actual))
                        throw new Error('已安装包位置超出当前工程')
                    const existing = JSON.parse(
                        await readFile(path.join(actual, 'package.json'), 'utf8'),
                    )
                    if (existing.name !== expected) throw new Error('已安装包名称不匹配')
                    targets.push(actual)
                }
            }
            sources.push({ ...inspected, targets })
        }
        // Stage all packages before modifying any live generated directory.
        for (const source of sources) {
            for (const target of source.targets) {
                if (!inside(workspace, target)) throw new Error('替换目标超出工作区')
                const stage = `${target}.sync-${randomUUID()}`
                const backup = `${target}.backup-${randomUUID()}`
                await ordinaryDirectory(path.dirname(stage), workspace)
                const swap = {
                    target,
                    stage,
                    backup,
                    replaced: false,
                    hadOriginal: false,
                    carriedDependencies: false,
                }
                swaps.push(swap)
                await mkdir(stage)
                for (const file of source.files) {
                    const data = await readFile(path.join(source.directory, file.path))
                    if (hash(data) !== file.sha256)
                        throw new Error('来源在同步过程中变化，停止同步')
                    const destination = path.join(stage, file.path)
                    await mkdir(path.dirname(destination), { recursive: true })
                    await writeFile(destination, data)
                }
            }
            lock[source.pkg.name] = {
                version: source.pkg.version,
                manifestSha256: source.digest,
                outputCount: source.files.length,
            }
        }
        for (const swap of swaps) {
            if (await exists(swap.target)) {
                await rename(swap.target, swap.backup)
                swap.hadOriginal = true
                // npm file: links can install dependencies inside vendor itself.
                // They belong to npm, not to the generated output manifest.
                if (await exists(path.join(swap.backup, 'node_modules'))) {
                    await rename(
                        path.join(swap.backup, 'node_modules'),
                        path.join(swap.stage, 'node_modules'),
                    )
                    swap.carriedDependencies = true
                }
            }
            await rename(swap.stage, swap.target)
            swap.replaced = true
        }
        const temporaryLock = path.join(vendor, `.lock-${randomUUID()}.json`)
        try {
            await writeFile(temporaryLock, JSON.stringify(lock, null, 4) + '\n')
            await rename(temporaryLock, lockPath)
        } finally {
            await rm(temporaryLock, { force: true })
        }
        committed = true
        for (const swap of swaps)
            if (swap.hadOriginal) await rm(swap.backup, { recursive: true, force: true })
        return { ok: true, packages: lock }
    } catch (error) {
        if (!committed)
            for (const swap of [...swaps].reverse()) {
                if (swap.carriedDependencies)
                    await rename(
                        path.join(swap.replaced ? swap.target : swap.stage, 'node_modules'),
                        path.join(swap.backup, 'node_modules'),
                    )
                if (swap.replaced) await rm(swap.target, { recursive: true, force: true })
                if (swap.hadOriginal) await rename(swap.backup, swap.target)
            }
        throw error
    } finally {
        for (const swap of swaps) await rm(swap.stage, { recursive: true, force: true })
        await guard.close()
        await rm(lockFile, { force: true })
    }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        const { values } = parseArgs({
            options: Object.fromEntries(Object.keys(names).map((key) => [key, { type: 'string' }])),
        })
        console.log(JSON.stringify(await syncVendor(values)))
    } catch (error) {
        console.error(JSON.stringify({ ok: false, error: error.message }))
        process.exitCode = 1
    }
}
