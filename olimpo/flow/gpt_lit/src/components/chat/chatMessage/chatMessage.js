import { LitElement, html, css } from "lit";

const tag = "onbotgo-chatmessage";

export class ChatMessage extends LitElement {
  static styles = css``;
  static properties = {
    message: { type: Object },
  };
  render() {
    return html`${this.message.content}`;
  }
}

customElements.define(tag, ChatMessage);
