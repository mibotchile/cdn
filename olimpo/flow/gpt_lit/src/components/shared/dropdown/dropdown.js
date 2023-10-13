import { LitElement, html, css } from "lit";

const tag = `onbotgo-dropdown`;

export class Dropdown extends LitElement {
  static styles = css`
    :host {
      position: relative;
    }
  `;
  render() {
    return html`<slot></slot>`;
  }
}

customElements.define(tag, Dropdown);
