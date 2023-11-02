import { html, LitElement, css } from "lit";

const tag = `onbotgo-spinner`;

export class Spinner extends LitElement {
  static styles = css`
    :host {
      display: grid;
      position: relative;
      place-items: center;
      width: 19px;
      height: 19x;
    }
    div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 19px;
      height: 19px;
      border: 2px solid var(--onbotgo-color-primary);
      border-radius: 50%;
      animation: onbotgo-lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: var(--onbotgo-color-primary) transparent transparent
        transparent;
    }
    div:nth-child(1) {
      animation-delay: -0.45s;
    }
    div:nth-child(2) {
      animation-delay: -0.3s;
    }
    div:nth-child(3) {
      animation-delay: -0.15s;
    }
    .white {
      border-color: white transparent transparent transparent;
    }
    @keyframes onbotgo-lds-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  static properties = {
    color: { type: String },
  };
  render() {
    return html` <div class="${this.color}"></div>
      <div class="${this.color}"></div>
      <div class="${this.color}"></div>
      <div class="${this.color}"></div>`;
  }
}
customElements.define(tag, Spinner);
