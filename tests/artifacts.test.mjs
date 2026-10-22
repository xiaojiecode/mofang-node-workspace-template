import test from 'node:test'
import assert from 'node:assert/strict'
import { inspect, schemaValidator, validPlatformURL } from '../tooling/verify/artifacts.mjs'
test('产物规则拒绝运行时导入、动态 import 和后台宿主 API', () => {
  for (const source of [
    'import x from "x"; export default x',
    'export {default} from "x"',
    'export default ()=>import("lit")',
  ])
    assert.throws(() => inspect(source, 'panel'))
  for (const source of [
    'const program={main(){return fetch("x")}}',
    'const program={main(){return globalThis.fetch("x")}}',
    'import x from "x"',
  ])
    assert.throws(() => inspect(source, 'executor'))
  assert.doesNotThrow(() =>
    inspect(
      'import {LitElement} from "lit";class X extends LitElement{};export {X as default}',
      'panel',
    ),
  )
})
test('数据程序拒绝网络、时钟、随机数与全局对象', () => {
  for (const expression of [
    'fetch("https://example.invalid")',
    'Date.now()',
    'Math.random()',
    'globalThis.fetch("x")',
  ])
    assert.throws(() =>
      inspect('export async function prepareInput(){return ' + expression + '}', 'page-program'),
    )
  assert.doesNotThrow(() =>
    inspect(
      'export async function prepareInput(){const value={Date:"label"};return value.Date}',
      'page-program',
    ),
  )
})
test('URL 不通过 WHATWG 的规范化放过无效原始输入', () => {
  for (const value of [
    'https://example.com\\bad',
    'https://exa\nmple.com',
    'https:example.com',
    'https://example.com/%zz',
    ' https://example.com',
  ])
    assert.equal(validPlatformURL(value), false, value)
  assert.equal(validPlatformURL('https://example.com/a%20b'), true)
})
test('完整 Product 保留字段与货币跨字段约束', async () => {
  const ajv = await schemaValidator(),
    validate = ajv.getSchema('urn:mofang:workflow:type:product:1')
  assert.equal(
    validate({
      basic: { title: '标题', price: 10, currency: 'CNY' },
      collection: { source: 'demo', sourceUrl: 'https://example.invalid' },
      images: [{ url: 'https://example.invalid/p.png' }],
      skus: [{ skuCode: 'a', price: 5 }],
      references: { draftProductId: 'draft' },
    }),
    true,
  )
  assert.equal(validate({ basic: { title: '标题', price: 10 } }), false)
  assert.equal(validate({ basic: { title: '标题', invented: 'x' } }), false)
})
