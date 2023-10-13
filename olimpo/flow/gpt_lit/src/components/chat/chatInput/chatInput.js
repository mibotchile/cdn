import { parseStringToHtml } from "../../../utils/functions/parseStringToHtml";
import sendIcon from "./../../../assets/icons/send.svg?raw";
import { LitElement, css, html } from "lit";

const tag = `onbotgo-chatinput`;

export class ChatInput extends LitElement {
  static styles = css`
    input {
      border-radius: 6px;
      outline: none;
      border: none;
      height: 100%;
      padding: 0 10px;
      max-width: calc(100vw - 129px);
      font-size: 14px;
    }
    svg {
      cursor: pointer;
      fill: var(--onbotgo-color-primary);
    }
    .send-icon-box {
      width: 100%;
      display: inline-block;
    }
    :host {
      height: 50px;
      display: grid;
      grid-template-columns: 10fr 1fr;
      align-items: center;
      border-radius: 8px;
      box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.1);
    }
  `;

  render() {
    return html`<input type="text" placeholder="Escribe un mensaje" />
      <onbotgo-box class="send-icon-box">
        ${parseStringToHtml(sendIcon)}
      </onbotgo-box>`;
  }
}

customElements.define(tag, ChatInput);
