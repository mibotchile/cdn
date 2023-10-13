import { LitElement, html, css } from "lit";

const tag = `onbotgo-dropdowncontent`;

export class Dropdown extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      background-color: white;
      min-width: 170px;
      width: fit-content;
      border-radius: 8px;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      padding: 12px 16px;
      z-index: 1;
      gap: 10px;
      justify-content: space-between;
      flex-direction: column;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define(tag, Dropdown);
