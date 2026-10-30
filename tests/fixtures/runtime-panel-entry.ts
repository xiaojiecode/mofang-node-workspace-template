import { html } from 'lit'
import { HostPanel, nodeRuntimePanel } from '@mofang/browser'
/** 公共面板正式打包验证入口。 */
export default class TestPanel extends HostPanel {
    protected override render() {
        return html`${nodeRuntimePanel({
            sdk: this.sdk,
            target: this.target,
            panelError: this.panelError,
        })}`
    }
}
