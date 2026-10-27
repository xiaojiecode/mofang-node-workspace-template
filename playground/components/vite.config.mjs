import { mergeConfig } from 'vite'
import base from '../vite.config.mjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 独立组件预览复用同一 Lit 解析与缓存规则，不占用节点预览端口。
export default mergeConfig(base, {
    root: path.dirname(fileURLToPath(import.meta.url)),
    server: { host: '127.0.0.1', port: 5298, strictPort: true },
})
