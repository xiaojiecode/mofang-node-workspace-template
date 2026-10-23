import { LitElement, html, css } from 'lit';

type PanelSDK = import('@mofang/workflow-sdk').MofangSDK;
type PanelContext = import('@mofang/workflow-sdk').NodeContext;
type PanelActivity = import('@mofang/workflow-sdk').NodeActivity;
type PanelMessage = import('@mofang/workflow-sdk').MofangMessage;
type PanelTarget = import('@mofang/workflow-sdk').ContextRequestOptions;
type ExecutionHost = LitElement & { sdk?: PanelSDK; mofangsdk?: PanelSDK };

// ===== 执行过程：复制到业务 Lit 源码，保持只导入 lit =====
const executionStyles = css`
  .mf-execution { margin: 0 0 20px; color: inherit; border-bottom: 1px solid var(--border, currentColor); padding-bottom: 16px; }
  .mf-execution-head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .mf-execution-head strong { font-size: 15px; }
  .mf-execution-head button, .mf-execution-error button { margin-left: auto; font: inherit; color: inherit; background: var(--surface-alt, transparent); border: 1px solid var(--border, currentColor); border-radius: 6px; padding: 4px 10px; cursor: pointer; }
  .mf-execution button:hover { text-decoration: underline; text-underline-offset: 3px; }
  .mf-execution button:focus-visible, .mf-execution summary:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
  .mf-execution-progress { margin: 8px 0; line-height: 1.6; overflow-wrap: anywhere; }
  .mf-execution-body { display: grid; gap: 12px; }
  .mf-execution-body h4 { font-size: 13px; margin: 0 0 6px; }
  .mf-execution pre { margin: 0; font: inherit; white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.7; }
  .mf-execution-muted { font-size: 12px; color: var(--muted, inherit); margin: 4px 0; }
  .mf-execution-scroll { max-height: 18rem; overflow: auto; scrollbar-color: var(--muted, auto) transparent; }
  .mf-execution-log { padding-left: 20px; margin: 8px 0 0; }
  .mf-execution-log li + li { margin-top: 12px; }
  .mf-execution-log p { margin: 3px 0; white-space: pre-wrap; overflow-wrap: anywhere; }
  .mf-execution summary { cursor: pointer; }
  .mf-execution-error { color: var(--bad, var(--low, inherit)); }
  .mf-execution-tools { display: flex; gap: 6px 16px; flex-wrap: wrap; font-size: 12px; }
`;

const executionStatus: Record<string, string> = {
  pending: '待执行', ready: '待执行', queued: '排队中', running: '执行中',
  waiting_external: '执行中', waiting: '等待中', waiting_user: '等待确认',
  waiting_next: '等待下一步', paused: '已暂停', settling: '结清中',
  succeeded: '已完成', failed: '执行失败', cancelled: '已取消', skipped: '已跳过',
};
const executionText = (value: unknown) => typeof value === 'string' ? value : '';
const executionObject = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

class NodeExecutionController {
  private sdk?: PanelSDK;
  private context: PanelContext | null = null;
  private key = '';
  private stopContext?: () => void;
  private stopLive: (() => void)[] = [];
  private timer?: ReturnType<typeof setInterval>;
  private live = false;
  private generation = 0;
  private reading = false;
  private afterSeq = 0;
  private activities: PanelActivity[] = [];
  private reasoning = new Map<string, string>();
  private tools = new Map<string, { name: string; status: string }>();
  private stage: { name: string; text: string } | null = null;
  private liveStage = false;
  private activityError = '';
  private messageError = '';
  private connected = false;
  private open = true;
  private initialized = false;

  constructor(private host: ExecutionHost) { host.addController(this); }

  hostConnected() { this.host.requestUpdate(); }
  hostUpdate() { this.syncContext(); }
  hostDisconnected() {
    this.stopContext?.();
    this.stopContext = undefined;
    this.endLive();
    ++this.generation;
    this.sdk = undefined;
    this.key = '';
  }

  private syncContext() {
    const sdk = this.host.sdk ?? this.host.mofangsdk;
    if (!sdk) {
      if (this.sdk) {
        this.hostDisconnected();
        this.context = null;
        this.activities = [];
        this.reasoning.clear();
        this.tools.clear();
        this.stage = null;
        this.activityError = '';
        this.messageError = '';
      }
      return;
    }
    const context = sdk.context.getSnapshot();
    const key = JSON.stringify([context?.workflowId, context?.nodeInstanceId,
      context?.runId, context?.nodeRunId, context?.view]);
    if (this.sdk !== sdk || this.key !== key) {
      this.stopContext?.();
      this.endLive();
      ++this.generation;
      this.sdk = sdk;
      this.key = key;
      this.context = context;
      this.afterSeq = 0;
      this.reading = false;
      this.activities = [];
      this.reasoning.clear();
      this.tools.clear();
      this.stage = null;
      this.liveStage = false;
      this.activityError = '';
      this.messageError = '';
      this.connected = false;
      this.initialized = false;
      this.open = context?.state.closure !== 'closed';
      this.stopContext = sdk.context.subscribe(() => {
        this.syncContext();
        this.host.requestUpdate();
      });
      if (context?.nodeRunId && context.view !== 'preview') void this.readActivities();
    }
    this.context = context;
    const live = Boolean(context?.runId && context.nodeRunId &&
      context.view === 'current' && context.state.closure !== 'closed');
    if (live && !this.live) this.beginLive();
    else if (!live && this.live) {
      this.endLive();
      void this.readActivities();
    }
  }

  private beginLive() {
    const sdk = this.sdk!;
    const context = this.context!;
    const filter = { workflowId: context.workflowId, runId: context.runId,
      nodeRunId: context.nodeRunId };
    this.live = true;
    const generation = this.generation;
    const accept = (event: PanelMessage) => generation === this.generation && event.scope?.workflowId === filter.workflowId &&
      event.scope?.runId === filter.runId && event.scope?.nodeRunId === filter.nodeRunId;
    try {
      this.stopLive.push(sdk.messages.onStage((event) => {
        if (!accept(event)) return;
        this.liveStage = true;
        this.stage = { name: executionText(event.data?.stage), text: executionText(event.data?.text) };
        this.host.requestUpdate();
      }, filter));
      this.stopLive.push(sdk.messages.onMessage((event) => {
        if (!accept(event)) return;
        this.liveStage = true;
        this.stage = { name: this.stage?.name ?? '', text: executionText(event.data?.text) };
        this.host.requestUpdate();
      }, filter));
      this.stopLive.push(sdk.messages.onReasoning((event) => {
        if (!accept(event)) return;
        const data = event.data;
        if (typeof data?.delta !== 'string') return;
        const id = JSON.stringify([data.turnId, data.itemId, data.summaryIndex]);
        this.reasoning.set(id, (this.reasoning.get(id) ?? '') + data.delta);
        this.host.requestUpdate();
      }, filter));
      this.stopLive.push(sdk.messages.onTool((event) => {
        if (!accept(event)) return;
        const id = executionText(event.data?.toolCallId);
        if (!id) return;
        this.tools.set(id, { name: executionText(event.data?.toolName),
          status: executionText(event.data?.status) });
        this.host.requestUpdate();
      }, filter));
      this.stopLive.push(sdk.messages.subscribe({ ...filter, types: ['workflow.node_activity.appended'] },
        (event) => { if (accept(event)) void this.readActivities(); }));
      this.stopLive.push(sdk.messages.onConnectionChange((connected) => {
        if (generation !== this.generation) return;
        this.connected = connected;
        if (connected) void this.readActivities();
        this.host.requestUpdate();
      }, filter));
    } catch (error) {
      this.messageError = error instanceof Error ? error.message : '实时过程订阅失败';
    }
    // 只补读已保存活动，不另建 SSE 或刷新权威上下文。
    this.timer = setInterval(() => void this.readActivities(), 30_000);
  }

  private endLive() {
    for (const stop of this.stopLive.splice(0)) stop();
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    this.live = false;
    this.connected = false;
  }

  private async readActivities() {
    const sdk = this.sdk;
    const context = this.context;
    if (this.reading || !sdk || !context?.runId || !context.nodeRunId || context.view === 'preview') return;
    this.reading = true;
    const generation = this.generation;
    const { runId, nodeRunId } = context;
    try {
      for (;;) {
        const page = await sdk.activities.list({ runId, nodeRunId, afterSeq: this.afterSeq, limit: 100 });
        if (generation !== this.generation) return;
        if (page.items.some((item) => item.runId !== runId || item.nodeRunId !== nodeRunId))
          throw new Error('活动记录不属于当前节点执行');
        const next = Math.max(this.afterSeq, ...page.items.map((item) => item.seq));
        if (page.items.length && next <= this.afterSeq) throw new Error('活动读取游标未推进');
        const added = page.items.filter((item) => item.seq > this.afterSeq);
        this.activities.push(...added);
        for (const item of added) {
          const data = executionObject(item.dataJson);
          if (this.liveStage || item.kind !== 'tool_call' || data.toolName !== 'publish_message') continue;
          const args = executionObject(data.arguments);
          this.stage = { name: executionText(args.stage), text: executionText(args.message) };
        }
        this.afterSeq = next;
        if (page.items.length < 100) break;
      }
      this.initialized = true;
      this.activityError = '';
    } catch (error) {
      if (generation === this.generation)
        this.activityError = error instanceof Error ? error.message : '读取已保存活动失败';
    } finally {
      if (generation === this.generation) { this.reading = false; this.host.requestUpdate(); }
    }
  }

  private activityText(item: PanelActivity) {
    if (item.content) return item.content;
    if (item.kind === 'tool_call') return executionText(executionObject(item.dataJson).toolName);
    return '';
  }

  render() {
    const context = this.context;
    const status = context?.state.status ?? '';
    const label = executionStatus[status] ?? (status || '等待执行身份');
    const savedThinking = this.activities.filter((item) => item.kind === 'thinking');
    const thoughts = this.reasoning.size ? [...this.reasoning.values()] : savedThinking.map((item) => item.content);
    const toolStatus: Record<string, string> = { started: '执行中', completed: '已完成', succeeded: '已完成', failed: '失败', cancelled: '已取消' };
    return html`
      <section class="mf-execution" aria-label="节点执行过程">
        <div class="mf-execution-head">
          <strong>执行过程</strong><span role="status" aria-live="polite">${label}</span>
          <button type="button" aria-expanded=${String(this.open)} @click=${() => { this.open = !this.open; this.host.requestUpdate(); }}>${this.open ? '收起过程' : '展开过程'}</button>
        </div>
        <p class="mf-execution-progress" aria-live="polite">${this.stage ? html`${this.stage.name}${this.stage.name && this.stage.text ? ' · ' : ''}${this.stage.text}` : label}</p>
        ${!this.open ? '' : html`<div class="mf-execution-body">
          <div><h4>模型思考摘要</h4>${thoughts.length ? html`<p class="mf-execution-muted">${this.reasoning.size ? '实时接收的公开摘要' : '已保存的公开摘要'}</p>` : ''}<div class="mf-execution-scroll">${thoughts.length ? thoughts.map((text) => html`<pre>${text}</pre>`) : html`<p class="mf-execution-muted">暂未收到公开思考摘要</p>`}</div></div>
          ${this.tools.size ? html`<div class="mf-execution-tools">${[...this.tools.values()].slice(-8).map((tool) => html`<span>${tool.name} · ${toolStatus[tool.status] ?? tool.status}</span>`)}</div>` : ''}
          ${this.live ? html`<p class="mf-execution-muted">${this.connected ? '实时消息已连接' : '实时消息连接中，已保存活动仍可读取'}</p>` : ''}
          ${this.messageError ? html`<p class="mf-execution-error" role="alert">${this.messageError}</p>` : ''}
          ${this.activityError ? html`<div class="mf-execution-error" role="alert">${this.activityError}<button type="button" @click=${() => void this.readActivities()}>重新读取活动</button></div>` : ''}
          <details><summary>已保存活动（${this.activities.length}）</summary>
            <ol class="mf-execution-log mf-execution-scroll">${this.activities.map((item) => html`<li><strong>${item.title}</strong><p>${this.activityText(item)}</p></li>`)}</ol>
            ${!this.activities.length ? html`<p class="mf-execution-muted">${!context?.nodeRunId ? '尚未创建节点执行' : this.initialized ? '暂无已保存活动' : context.view === 'preview' ? '预览不连接真实执行' : '正在读取活动…'}</p>` : ''}
          </details>
        </div>`}
      </section>`;
  }
}
// ===== 执行过程（结束） =====

export default class NodePanel extends LitElement {
  static properties = { sdk: { attribute: false }, target: { attribute: false }, ui: { attribute: false } };
  declare sdk: PanelSDK | undefined;
  declare target: PanelTarget | undefined;
  declare ui: { onClose?: () => void; onOpenSettings?: () => void } | undefined;
  private execution = new NodeExecutionController(this);
  static styles = [executionStyles, css`:host { display: block; padding: 20px; } pre { white-space: pre-wrap; overflow-wrap: anywhere; }`];

  render() {
    const resource = this.sdk?.context.getState();
    return html`${this.execution.render()}
      ${resource?.error ? html`<p role="alert">${resource.error.message}</p>` :
        resource?.loading ? html`<p role="status">正在读取节点…</p>` :
        html`<h3>节点结果</h3><pre>${resource?.data?.output?.values ? JSON.stringify(resource.data.output.values, null, 2) : '尚无正式输出'}</pre>`}`;
  }
}
