import { defineConfig } from 'vite'
import { transform, build } from 'esbuild'
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { root, cache, dist } from '../../tooling/paths.mjs'
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    root: path.join(root, 'apps/playground'),
    cacheDir: path.join(cache, 'vite'),
    optimizeDeps: { include: ['lit', 'lit/directives/live.js'] },
    resolve: { dedupe: ['lit', 'lit-html', 'lit-element', '@lit/reactive-element'] },
    server: { host: '127.0.0.1', port: 5188, strictPort: true, fs: { allow: [root] } },
    plugins: [
        {
            name: 'artifact-preview',
            configureServer(server) {
                let productionRuntime
                server.middlewares.use('/__production-lit.js', async (_req, res) => {
                    try {
                        productionRuntime ??= build({
                            absWorkingDir: root,
                            stdin: {
                                contents: "export * from 'lit'",
                                resolveDir: root,
                                loader: 'js',
                            },
                            bundle: true,
                            write: false,
                            format: 'esm',
                            platform: 'browser',
                            conditions: ['production'],
                            target: 'es2022',
                            logLevel: 'silent',
                        })
                        const result = await productionRuntime
                        res.setHeader('content-type', 'text/javascript')
                        res.end(result.outputFiles[0].text)
                    } catch (error) {
                        res.statusCode = 500
                        res.end(String(error))
                    }
                })
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
                        const manifest = JSON.parse(
                            await readFile(path.join(dist, match[1], 'manifest.json'), 'utf8'),
                        )
                        const compiled = await transform(source, {
                            format: 'cjs',
                            target: 'es2017',
                            loader: 'js',
                        })
                        res.setHeader('content-type', 'application/json')
                        res.end(
                            JSON.stringify({ compiled: compiled.code, litMode: manifest.litMode }),
                        )
                    } catch (error) {
                        res.statusCode = 500
                        res.end(JSON.stringify({ error: String(error) }))
                    }
                })
            },
        },
    ],
})
