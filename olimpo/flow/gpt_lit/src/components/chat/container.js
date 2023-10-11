import { LitElement, html, css, unsafeCSS } from "lit";
import styles from "./container.css?raw";
import { parseStringToHtml } from "./../../utils/functions/parseStringToHtml";
import sendIcon from "./../../assets/icons/send.svg?raw";
import micIcon from "./../../assets/icons/microphone.svg?raw";
import logo from "./../../assets/icons/logo.svg?raw";

const tag = `onbotgo-chat`;

export class ChatContainer extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    isMicShowing: { type: Boolean },
  };

  constructor() {
    super();
    this.isMicShowing = false;
  }
  render() {
    return html`<onbotgo-box id="onbotgo-chatheader"> </onbotgo-box>
      <onbotgo-box id="container">
        <onbotgo-customscrollbar data-target-id="scrollableElement">
        </onbotgo-customscrollbar>
        <onbotgo-box id="onbotgo-messageContainer"> </onbotgo-box>
      </onbotgo-box>
      <onbotgo-box id="onbotgo-input-container">
        <onbotgo-box
          id="onbotgo-attachFileTemplateContainer"
          style=${`display: ${this.isMicShowing ? "none" : "grid"}`}
        >
        </onbotgo-box>
        <onbotgo-chatinput
          id="onbotgo-chatinput"
          style=${`display: ${this.isMicShowing ? "none" : "grid"}`}
        ></onbotgo-chatinput>
        <onbotgo-micrecord
          id="onbotgo-micrecord"
          style=${`display: ${this.isMicShowing ? "grid" : "none"}`}
        ></onbotgo-micrecord>
        <onbotgo-iconbutton
          id="onbotgo-btnrecordSend"
          color="primary"
          size="36px"
          style=${`display: ${this.isMicShowing ? "grid" : "none"}`}
        >
          ${parseStringToHtml(sendIcon)}
        </onbotgo-iconbutton>
        <onbotgo-iconbutton
          id="onbotgo-btnrecord"
          size="medium"
          color="primary"
          style=${`display: ${this.isMicShowing ? "none" : "grid"}`}
        >
          ${parseStringToHtml(micIcon)}
        </onbotgo-iconbutton>
      </onbotgo-box>
      <onbotgo-box class="onbotgo-chat-footer">
        Powered by ONBOTGO LLC. ${parseStringToHtml(logo)}
      </onbotgo-box>`;
  }
}

customElements.define(tag, ChatContainer);
