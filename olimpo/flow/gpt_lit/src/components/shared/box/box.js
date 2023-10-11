import { LitElement, css, unsafeCSS, html } from "lit";
import { theme } from "../../../app-config/theme";

const tag = `onbotgo-box`;

export class Box extends LitElement {
  static styles = css`
    :host {
      font-family: ${unsafeCSS(theme.typography.primary)};
    }
  `;
  constructor() {
    super();
  }
  render() {
    return html`<slot></slot>`;
  }
}

customElements.define(tag, Box);
