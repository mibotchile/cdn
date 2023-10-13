import { LitElement, css, html } from "lit";

const tag = `onbotgo-iconbutton`;

export class IconButton extends LitElement {
  static styles = css`
    :host {
      display: grid;
      place-items: center;
      vertical-align: middle;
      position: relative;
      cursor: pointer;
      border-radius: 200px;
      padding: 2px;
      box-sizing: border-box;
    }
    button {
      display: grid;
      place-items: center;
      cursor: pointer;
      background-color: transparent;
      border: none;
    }
    .onbotgo-btn-medium {
      height: 32px;
      width: 32px;
    }
    .onbotgo-background-color {
      top: 0;
      left: 0;
      opacity: 0.2;
      position: absolute;
      width: 100%;
      border-radius: 200px;
      height: 100%;
      z-index: 0;
    }
    .onbotgo-btn-primary {
      color: var(--onbotgo-color-primary);
    }
    .onbotgo-btn-primary .onbotgo-background-color {
      background-color: var(--onbotgo-color-primary);
    }
  `;

  static properties = {
    size: { type: String },
    color: { type: String },
  };

  render() {
    return html`<button
      class="onbotgo-btn-${this.color} onbotgo-btn-${this.size}"
    >
      <slot></slot>
      <onbotgo-box class="onbotgo-background-color"></onbotgo-box>
    </button>`;
  }
}

customElements.define(tag, IconButton);
