import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import { transform } from 'esbuild'
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { root, cache, dist } from '../tooling/paths.mjs'
// noinspection JSUnusedGlobalSymbols
// 节点产物在各环境共用生产版浏览器 Lit ABI，开发模式只影响业务代码调试。
const litRequire = createRequire(createRequire(import.meta.url).resolve('lit'))
const litAliases = ['lit', 'lit-html', 'lit-element', '@lit/reactive-element'].flatMap((name) => {
    // require.resolve 仅用于定位包；其 node 条件入口不能直接用于浏览器。
    let directory = path.dirname(litRequire.resolve(name))
    while (!existsSync(path.join(directory, 'package.json'))) {
        const parent = path.dirname(directory)
        if (parent === directory) throw new Error(`找不到 Lit 包：${name}`)
        directory = parent
    }
    const metadata = JSON.parse(readFileSync(path.join(directory, 'package.json'), 'utf8'))
    const entry = metadata.module ?? metadata.main
    if (metadata.name !== name || typeof entry !== 'string')
        throw new Error(`Lit 包缺少浏览器入口：${name}`)
    return [
        { find: new RegExp(`^${name}$`), replacement: path.resolve(directory, entry) },
        { find: new RegExp(`^${name}/`), replacement: directory + '/' },
    ]
})

export default defineConfig({
    root: path.join(root, 'playground'),
    cacheDir: path.join(cache, 'vite'),
    optimizeDeps: { include: ['lit', 'lit/directives/live.js'] },
    resolve: {
        alias: [
            ...litAliases,
            { find: '@mofang/browser', replacement: path.join(root, 'lib/browser/index.ts') },
        ],
        dedupe: ['lit', 'lit-html', 'lit-element', '@lit/reactive-element'],
    },
    server: { host: '127.0.0.1', port: 5188, strictPort: true, fs: { allow: [root] } },
    plugins: [
        {
            name: 'artifact-preview',
            configureServer(server) {
                server.middlewares.use('/__artifact', async (req, res, next) => {
                    const match = (req.url ?? '')
                        .split('?')[0]
                        .match(/^\/([a-z][a-z0-9-]*)\/(settings|business)$/)
                    if (!match) return next()
                    try {
                        const source = await readFile(
                            path.join(dist, match[1], match[2] + '.js'),
                            'utf8',
                        )
                        const compiled = await transform(source, {
                            format: 'cjs',
                            target: 'es2017',
                            loader: 'js',
                        })
                        res.setHeader('content-type', 'application/json')
                        res.end(JSON.stringify({ compiled: compiled.code }))
                    } catch (error) {
                        res.statusCode = 500
                        res.end(JSON.stringify({ error: String(error) }))
                    }
                })
            },
        },
    ],
})
