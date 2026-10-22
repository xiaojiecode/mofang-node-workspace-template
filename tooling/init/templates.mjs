import { readFileSync } from 'node:fs'

/**
 * 根据节点编码和执行接口读取作者模板，返回“节点内相对路径 → 文件内容”。
 * 模板使用可直接阅读、格式化的 TypeScript 文件维护，保留中文函数说明和 IDE 注解。
 * 这里只替换节点标识与模式，不安装依赖、不访问平台、不保存或发布业务目录；
 * 因此 project 初始化器在尚未 npm ci 的空环境中也能使用。
 */
export function nodeFiles(code, kind) {
    if (!['main', 'stages', 'lifecycle', 'panels'].includes(kind)) throw new Error('未知执行接口')
    const paths = [
        'contract.ts',
        'node.ts',
        'settings/index.ts',
        'business/index.ts',
        'page-program/index.ts',
        'fixtures/input.json',
    ]
    if (kind !== 'panels') paths.push('shared/copy-product.ts', 'executor/index.ts')
    return Object.fromEntries(
        paths.map((relative) => {
            const directory =
                relative === 'executor/index.ts'
                    ? kind
                    : relative === 'business/index.ts'
                      ? kind === 'lifecycle'
                          ? 'lifecycle'
                          : 'stages'
                      : 'common'
            let source = readFileSync(
                new URL(`./templates/${directory}/${relative}`, import.meta.url),
                'utf8',
            )
                .replaceAll('__NODE_CODE__', code)
                .replaceAll(
                    '__NODE_TITLE__',
                    kind === 'lifecycle' ? '生命周期原样传递' : '商品原样传递',
                )
                .replaceAll('__NODE_INTERFACE__', kind)
            if (kind === 'panels' && relative === 'node.ts')
                source = source.replace(/^\s*executor: 'executor\/index\.ts',\n/m, '')
            return [relative, source]
        }),
    )
}
