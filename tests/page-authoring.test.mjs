import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { cache } from '../tooling/paths.mjs'
import { bundle } from '../tooling/build/bundle.mjs'
import { authorJavaScript, inspectAuthorBundle } from '../tooling/build/page-authoring.mjs'
import { inspectPageProgramRuntime } from '../tooling/verify/artifacts.mjs'

await mkdir(cache, { recursive: true })
async function fixture(source, fn, files = {}) {
    const directory = await mkdtemp(path.join(cache, 'page-authoring-'))
    try {
        for (const [name, contents] of Object.entries({ 'page.ts': source, ...files }))
            await writeFile(path.join(directory, name), contents)
        return await fn(path.join(directory, 'page.ts'))
    } finally {
        await rm(directory, { recursive: true, force: true })
    }
}

test('生产完整压缩保留四种作者函数形式，最终模块真实导出和执行一致', async () => {
    for (const source of [
        'export function prepareInput(ctx:unknown){return ctx}',
        'export async function prepareInput(ctx:unknown){return ctx}',
        'export const prepareInput=(ctx:unknown)=>ctx',
        'const input=(ctx:unknown)=>ctx;export {input as prepareInput}',
    ])
        await fixture(source, async (file) => {
            const readable = await bundle(file, 'page-program', {
                format: 'cjs',
                target: 'es2017',
                minify: false,
            })
            const compact = await bundle(file, 'page-program', {
                format: 'cjs',
                target: 'es2017',
                minify: true,
            })
            assert.ok(compact.code.length < readable.code.length)
            inspectPageProgramRuntime(compact.code)
            for (const code of [readable.code, compact.code]) {
                const value = await vm.runInNewContext(
                    `const module={exports:{}};const exports=module.exports;${code};module.exports.prepareInput({kind:'prepared',values:{},usedRefs:[],fieldSources:{}})`,
                    {},
                    { timeout: 1000 },
                )
                assert.equal(
                    JSON.stringify(value),
                    JSON.stringify({
                        kind: 'prepared',
                        values: {},
                        usedRefs: [],
                        fieldSources: {},
                    }),
                )
            }
        })
})

test('不让 TypeScript 擦除未使用非法导入，也不让摇树移除非法全局', async () => {
    for (const source of [
        'import unused from "forbidden-module";export function prepareInput(){return {}}',
        'if(false){fetch("bad")} export function prepareInput(){return {}}',
        'const unused=()=>fetch("bad");export function prepareInput(){return {}}',
        'function unused(){return globalThis.fetch("bad")}export function prepareInput(){return {}}',
        'export function prepareInput(){return false?fetch("bad"):0}',
        'export function prepareInput(){return import("./unused")}',
    ])
        await fixture(source, (file) =>
            assert.rejects(bundle(file, 'page-program', { format: 'cjs' })),
        )
})

test('检查真实本地依赖模块，允许普通辅助函数，拒绝未使用依赖中的禁用全局', async () => {
    await fixture(
        'import {helper} from "./helper";export {helper as prepareInput}',
        async (file) => {
            const output = await bundle(file, 'page-program', { format: 'cjs', minify: true })
            inspectPageProgramRuntime(output.code)
        },
        { 'helper.ts': 'export function helper(ctx:unknown){return ctx}' },
    )
    await fixture(
        'import {helper} from "./helper";export function prepareInput(){return {}}',
        (file) => assert.rejects(bundle(file, 'page-program', { format: 'cjs' }), /禁止访问 fetch/),
        { 'helper.ts': 'export function helper(){return fetch("bad")}' },
    )
})

test('作者分析区分类型与属性，保留合法属性 Date 和显式类型导入', () => {
    inspectAuthorBundle(
        authorJavaScript(
            'import type {Date} from "types-only";export function prepareInput(ctx:Date){const obj={Date:"label"};return obj.Date}',
        ),
        'page-program',
    )
    for (const source of [
        'export const prepareInput=1',
        'export function prepareInput(){};export const extra=1',
        'const input=()=>({});input=1;export {input as prepareInput}',
        'export default function prepareInput(){}',
        'export function prepareInput(){return Math["random"]()}',
    ])
        assert.throws(() => inspectAuthorBundle(authorJavaScript(source), 'page-program'))
})

test('实际产物装载拒绝缺失或非函数导出，不搜索 prepareInput 字样放行', () => {
    for (const source of [
        'const note="prepareInput"',
        'module.exports={prepareInput:1}',
        'module.exports={prepareInput(){},extra:1}',
    ])
        assert.throws(() => inspectPageProgramRuntime(source), /必须仅导出/)
})
