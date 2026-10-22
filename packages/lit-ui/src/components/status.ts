import { html } from 'lit'
export function statusNote(title: string, message: string, kind: 'info' | 'error' = 'info') {
  return html`<div class="mf-note" data-kind=${kind} role=${kind === 'error' ? 'alert' : 'status'}>
    <strong>${title}</strong>
    <p>${message}</p>
  </div>`
}
export function sectionHeading(title: string, description: string) {
  return html`<header class="mf-heading">
    <h2>${title}</h2>
    <p>${description}</p>
  </header>`
}
