import { LitElement, css, html } from "lit";

const tag = `onbotgo-fab`;

export class FabButton extends LitElement {
  static properties = {
    color: {
      type: String,
    },
    size: { type: String },
  };

  static styles = css`
    .onbotgo-fab-primary {
      background-color: var(--onbotgo-color-primary);
    }
    .onbotgo-fab-medium {
      height: 32px;
      width: 32px;
    }
    button {
      background-color: transparent;
      border: none;
      width: 100%;
      height: 100%;
      display: inline-block;
      vertical-align: middle;
      position: relative;
      cursor: pointer;
      border-radius: 200px;
      padding: 7px;
      color: white;
      fill: white;
    }
  `;

  render() {
    return html`<button
      class="onbotgo-fab-${this.color} onbotgo-fab-${this.size}"
    >
      <slot></slot>
    </button>`;
  }
}

customElements.define(tag, FabButton);
