import { type AxiosInstance } from 'axios';
declare module 'axios' {
    interface AxiosRequestConfig {
        /**
         * 该请求的未认证响应不触发全局登出（请求仍正常带登录态），错误原样
         * 抛给调用方。仅供联调期后端认证尚未打通的接口使用，联调完成后摘掉。
         */
        skipAuthLogout?: boolean;
    }
}
/**
 * 刊登 / 推送等会触发平台真实写入（含图片上传）的接口耗时可达 10~60s —— 与默认的 60s
 * 超时同量级，正常完成也会擦着上限，必须显式放宽。否则后端已完成发布、前端却先超时
 * 报「失败」，用户重试还会在平台上产生重复商品。
 *
 * 取 240s：后端 PRODUCT_PUBLISH_TASK_TIMEOUT_SECONDS 为 180s（同步执行时请求会阻塞到任务结束），
 * 需留出高于它的余量。
 */
export declare const LONG_RUNNING_REQUEST_TIMEOUT_MS = 240000;
export declare const publicApi: AxiosInstance;
export declare const authenticatedApi: AxiosInstance;
