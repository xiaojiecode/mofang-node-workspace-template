# 图标与业务目录

图标、目录数据从 `@mofang/browser` 导入。所有图标使用本地矢量路径或仓库 SVG 资源，不依赖外部运行时，不使用 `unsafeSVG` 插入任意标记。

## 按需图标

`uiIcon(name,{size?,color?,label?})` 支持 `search/close/chevron-down/chevron-up/chevron-right/settings/check/warning`。`currencyIcon(code,props)` 支持 `USD/CNY/EUR/GBP/JPY/KRW/INR/RUB`，人民币/日元符号可相同，但可访问名称不同。默认 `currentColor`，图标不单独作为按钮；操作需用可聚焦、有名称的按钮承载。

平台使用原始品牌 SVG 的压缩产物，保留品牌色。业务页面已知平台时优先静态入口：`alibaba1688Icon`、`tiktokShopIcon`、`amazonIcon`、`aliexpressIcon`、`temuIcon`、`shopeeIcon`、`sheinIcon`、`mercadoLibreIcon`、`kwaiShopIcon`、`americanasIcon`、`magaluIcon`、`lazadaIcon`、`ozonIcon`、`ebayIcon`、`walmartIcon`。各入口只引用本平台资源，接受 `size?/label?`；完整最终名称以公开导出为准。

```ts
import { amazonIcon, currencyIcon, textField } from '@mofang/browser'
const brand = amazonIcon({ size: 24, label: 'Amazon' })
const amount = textField({
    name: 'amount',
    label: '金额',
    value: '',
    suffixIcon: currencyIcon('USD'),
    onChange: (value) => {
        /* 回写宿主草稿 */
    },
})
```

`platformIcon(platformId,props)` 为运行时动态查表，适合完整预览目录；它保留目录中全部平台 SVG，不能因只传 `'amazon'` 就当成按需。未知 ID 返回空模板，不替换成其它品牌。`platformLinks({label?,items})` 的item为`{id,label,icon,href?}`；有核实官网链接才传入，不以图标推导授权关系。

源码资产在 `lib/browser/ui/assets/source/platforms/`，来源及许可状态见同目录 `manifest.json`；运行只导入 `assets/platforms/` 优化产物。品牌商标不沿用本仓库代码许可证，不把未核实的原型出处写成官方授权。

更新源 SVG 后运行 `npm run icons:optimize`，再 `npm run icons:check` 和 `npm run icons:verify`。缓存与Chrome路径按工程环境显式传入，禁止把日志写进资产目录。压缩固定 SVGO，保留 viewBox、固有宽高和 ID；不开默认路径合并，避免小图重叠边缘改变。校验检查可解析、安全元素/属性/引用、viewBox、双尺寸栅格差异、每个静态入口实际包含的资源。用 `metafile.outputs.inputs.bytesInOutput`，不能只数 `inputs`（被tree-shake的模块也可能出现在inputs）。不为压缩引入新的宿主共享资源契约。

## 平台、地区与币种

公开目录：`currencies`、`countryRegions`、`platforms`、`platformSites`。

- `Currency`：`code,symbol,name`。
- `CountryRegion`：`code`为ISO2，`name,currencyCode`。
- `Platform`：`id,name,iconKey?`。
- `PlatformSite`：`platformId,regionCode,currencyCode`。

`sitesOfPlatform(platformId)` 只返回已定义站点，未知平台为空数组；`currencyOfPlatformSite(platformId,regionCode)` 未知组合返回 `undefined`。`currencyName(code)` 查本地已知币种中文名，不推断汇率。目录描述站点当地币种，不代表结算、汇率、授权或在线接口覆盖。

平台、地区和币种不是一一对应。切换平台后根据已定义关系更新站点候选，原站点不在关系内就显式清除，不保留隐含错误组合。无关系展示空态，不兜底USD；有平台图标也不自动填所有国家。业务选品能力是否开放由真实能力契约决定，不能根据预置目录决定。
