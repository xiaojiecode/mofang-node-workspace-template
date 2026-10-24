# 动画过渡

`fade`、`slide`、`scale`、`collapse` 从 `@mofang/browser` 导出，配合宿主的 `panelStyles` 使用。它们是 Lit 模板函数，不需要注册 Custom Element，也不参与业务状态推进。

```ts
import { html } from 'lit'
import { collapse, fade, scale, slide, panelStyles } from '@mofang/browser'

// 在 Lit 面板中使用 static styles = [panelStyles]。
// show 来自调用方响应式属性，content 是持续传入的同一个模板位置。
const content = html`<label>备注 <input /></label>`
fade({ show, duration: 180 }, content)
slide({ show, direction: 'up' }, content)
scale({ show }, content)
collapse({ show }, content)
```

| 参数        | 类型                                  | 行为                                                               |
| ----------- | ------------------------------------- | ------------------------------------------------------------------ |
| `show`      | `boolean`                             | 必填；首次渲染直接采用该状态，后续切换时播放动画                   |
| `duration`  | `number`                              | 毫秒，默认 180；0 或负值立即切换；非有限数使用默认值               |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | 仅 `slide`，进入时移动的方向，默认 `up`；移动距离 12px，退出时反向 |

`fade` 改变透明度，`slide` 叠加位移，`scale` 在 96% 与原尺寸之间变化。`collapse` 改变高度，展开期间跟踪内容高度，结束后恢复自然布局。`onHidden` 可在退出并隐藏后关闭原生容器；该通知不在卸载时触发。快速切换从当前画面接续，普通内容重绘不重启动画。

关闭开始后，包装元素立即设为 `inert` 和 `aria-hidden="true"`；退出结束后以 `hidden` 移出布局。内容从第一次渲染起始终挂载，内部订阅也会继续运行，输入及子组件状态得以保留。不要在外部写 `show ? fade(...) : nothing`，也不要在隐藏时把 `content` 换成 `nothing`，否则内容会由调用方直接卸载。

触发器的 `aria-expanded`、`aria-controls` 和必要的焦点返回由调用方负责，组件不猜测哪个按钮应该接收焦点。系统启用“减少动态效果”时直接切换；偏好在动画中变化时立即结束动画。宿主断开或父模板清除时取消动画和监听，重新连接时显示当前状态，不回放旧动画。

组件增加两层块级包装，不直接用于 `tr`、`option` 或行内文字。动画只作用于外层，布局、边距、颜色及内容变换放在内部模板。`fade`、`slide`、`scale` 的关闭动画期间仍占据布局空间，结束后移除占位；需要连续改变占位高度时使用 `collapse`。

独立预览及浏览器回归：

```sh
MF_CACHE_DIR=/path/to/task-cache node tooling/verify/transitions.mjs
```

需要使用指定 Chrome 时设置 `MF_CHROME_PATH`。命令生成 `transitions/preview.html` 和截图，分别验证可读和压缩产物；仅运行本地组件，不访问平台。
