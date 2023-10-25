import { LitElement, html, css, unsafeCSS } from "lit";
import { parseStringToHtml } from "../../../utils/functions/parseStringToHtml";
import robotAvatar from "./../../../assets/images/robot.png";
import userAvatar from "./../../../assets/images/user.png";
import agentAvatar from "./../../../assets/images/agent.png";

const tag = "onbotgo-chatmessage";

export class ChatMessage extends LitElement {
  static styles = css`
    :host {
      align-items: center;
      gap: 8px;
      padding: 0 4px 0 8px;
    }
    .onbotgo-message-layout {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .onbotgo-avatar-container {
      border-radius: 100px;
      width: 36px;
      height: 36px;
      background-color: var(--onbotgo-color-primary);
      display: grid;
      place-items: center;
      padding: 2px;
    }
    .align-center {
      align-items: center;
    }
    .onbotgo-message {
      width: fit-content;
      height: fit-content;
      display: flex;
      border-radius: 6px;
      align-items: center;
      padding: 15px 15px;
      color: white;
      font-size: 14px;
      position: relative;
    }
    .from-chatbot {
      display: grid;
      width: 100%;
      overflow: hidden;
      position: relative;
      color: black;
      max-width: 67%;
      z-index: 1;
    }
    .bg-semi-transp {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.1;
      top: 0;
      z-index: -1;
      left: 0;
      background-color: var(--onbotgo-color-primary);
    }
    .from-user {
      margin-right: 8px;
      max-width: 66.5%;
      background-color: var(--onbotgo-color-primary);
    }

    .justify-end {
      display: flex;
      justify-content: flex-end;
    }
    .loading-api-message {
      position: relative;
      z-index: 1;
      overflow: hidden;
      align-items: center;
      display: flex !important;
      flex-direction: row;
      height: 17px;
      width: 40px !important;
      gap: 5px;
    }
    .dot {
      transform: translateY(2px);
      border-radius: 50px;
      height: 10px;
      background-color: var(--onbotgo-color-primary);
      vertical-align: middle;
      width: 10px !important;
      display: inline-block;
      animation: 0.5s onbotgo-typing infinite linear;
      animation-direction: alternate;
    }
    .flex {
      display: flex;
    }

    .delay2 {
      animation-delay: 0.3s;
    }
    .delay3 {
      animation-delay: 0.6s;
    }

    a {
      color: white;
      text-decoration: none;
    }

    @keyframes onbotgo-typing {
      100% {
        opacity: 0.3;
        transform: translateY(-4px);
      }
    }
  `;
  static properties = {
    message: { type: Object },
  };

  getClassBySenderType(sender) {
    switch (sender) {
      case "userMessage":
        return "from-user";
      case "apiMessage":
        return "from-chatbot";
      default:
        "loading-api-message";
    }
  }

  get audioTemplate() {
    if (this.message.type === "userMessage") return html``;
    else if (this.message.type === "apiMessage") return html``;
  }
  get imageTemplate() {
    if (this.message.type === "userMessage")
      return html`<onbotgo-box class="justify-end align-center">
        <onbotgo-box class="from-user onbotgo-message">
          <img src="${this.message.file.url}" width="255" />
        </onbotgo-box>
        ${this.userAvatar}
      </onbotgo-box>`;
    else if (this.message.type === "apiMessage")
      return html` <onbotgo-box class="justify-end align-center">
        <onbotgo-box class="from-chatbot onbotgo-message">
          <img src="${this.message.file.url}" /><onbotgo-box
            class="bg-semi-transp"
          ></onbotgo-box></onbotgo-box
      ></onbotgo-box>`;
  }
  get otherFilesTemplate() {
    if (this.message.type === "userMessage")
      return html`<onbotgo-box class="justify-end align-center">
        <onbotgo-box class="from-user onbotgo-message"
          ><a href="${this.message.file.url}"
            >${this.message.file.name}</a
          ></onbotgo-box
        >
        ${this.userAvatar}</onbotgo-box
      >`;
    else if (this.message.type === "apiMessage")
      return html`
        <onbotgo-box class="onbotgo-message-layout">
          <onbotgo-box class="from-chatbot onbotgo-message">
            <a href="${this.message.file.url}">${this.message.file.name}</a>
            <onbotgo-box class="bg-semi-transp"></onbotgo-box> </onbotgo-box
        ></onbotgo-box>
      `;
  }
  get messageTemplate() {
    if (this.message.type === "userMessage")
      return html`<onbotgo-box class="justify-end align-center">
        <onbotgo-box class="from-user onbotgo-message"
          >${this.message.content}</onbotgo-box
        >${this.userAvatar}
      </onbotgo-box>`;
    else if (this.message.type === "apiMessage")
      return html` <onbotgo-box class="onbotgo-message-layout">
        ${this.botAvatar}${parseStringToHtml(
          '<onbotgo-box class="from-chatbot onbotgo-message">' +
            this.message.content +
            '<onbotgo-box class="bg-semi-transp"></onbotgo-box></onbotgo-box>'
        )}</onbotgo-box
      >`;
  }
  get loadingMessageTemplate() {
    return html`<onbotgo-box class="loading-api-message onbotgo-message">
      <onbotgo-box class="dot "></onbotgo-box>
      <onbotgo-box class="dot delay2"></onbotgo-box>
      <onbotgo-box class="dot delay3"></onbotgo-box>
      <onbotgo-box class="bg-semi-transp"></onbotgo-box>
    </onbotgo-box>`;
  }

  get botAvatar() {
    return html`<onbotgo-box class="onbotgo-avatar-container"
      ><img src="${robotAvatar}" width="28" height="28"
    /></onbotgo-box>`;
  }
  get agentAvatar() {
    return html`<onbotgo-box class="onbotgo-avatar-container"
      ><img src="${agentAvatar}" width="28" height="28"
    /></onbotgo-box>`;
  }

  get userAvatar() {
    return html`<onbotgo-box class="onbotgo-avatar-container"
      ><img src="${userAvatar}" width="28" height="28"
    /></onbotgo-box>`;
  }
  render() {
    console.log(this.message.fileType);
    if (this.message.type === "loadingMessage")
      return this.loadingMessageTemplate;
    else if (this.message.fileType === "audio") return this.audioTemplate;
    else if (this.message.fileType?.includes("image"))
      return this.imageTemplate;
    else if (this.message.file) return this.otherFilesTemplate;
    else return this.messageTemplate;
  }
}

customElements.define(tag, ChatMessage);
