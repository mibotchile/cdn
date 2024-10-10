import { html, LitElement, css } from "lit";

const tag = `onbotgo-raisedbutton`;

export class RaisedButtonFile extends LitElement {
  static properties = {
    text: { type: String },
  };
  render() {
    return html`<onbotgo-box class="bg-semi-transp"></onbotgo-box
      ><slot></slot>`;
  }

  static styles = css`
    .bg-semi-transp {
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: var(--onbotgo-color-primary);
    }

    :host {
      box-sizing: border-box;
      z-index: 1;
      overflow: hidden;
      position: relative;
      padding: 10px 15px;
      color: white;
      border-radius: 6px;
      width: 100%;
      display: inline-block;
      text-align: center;
      cursor: default;
    }
    .bg-semi-transp:hover {
      position: absolute;
      z-index: -1;
      width: 100%;
      top: 0;
      left: 0;
      height: 100%;
      background-color: var(--onbotgo-color-primary);
      opacity: 0.9;
    }
  `;
}
customElements.define(tag, RaisedButtonFile);
