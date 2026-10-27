/**
 * 生成一个 UUID v4 形状的随机 id。
 *
 * `crypto.randomUUID` **只在安全上下文**（HTTPS 或 localhost）存在。用 http 从局域网 IP
 * 访问（例如 http://192.168.50.26:9999）时它是 undefined，直接调用会抛
 * "crypto.randomUUID is not a function" —— 上传图片成功之后才崩，用户看到的就是这句话。
 *
 * 所以不要直接调 `crypto.randomUUID()`，一律走这里：
 * 1. `crypto.getRandomValues` —— 同样是 Crypto 接口，但**不受**安全上下文限制，随机性足够；
 * 2. 再退回 `Math.random`（老浏览器 / 非浏览器环境），只求一个唯一的形状正确的串。
 */
export declare function randomId(): string;
