import { LitElement, html, css, unsafeCSS } from "lit";
import { parseStringToHtml } from "../../../utils/functions/parseStringToHtml";
import robotAvatar from "./../../../assets/images/robot.png";
import userAvatar from "./../../../assets/images/user.png";
import agentAvatar from "./../../../assets/images/agent.png";
import { appConfig } from "../../../app-config/setup";

const tag = "onbotgo-chatmessage";

export class ChatMessage extends LitElement {
  static properties = {
    message: { type: Object },
  };

  getClassBySenderType(sender) {
    switch (sender) {
      case "user":
        return "from-user";
      case "api":
        return "from-chatbot";
      default:
        return "loading-api-message";
    }
  }
  removeSpinnerAndResize() {
    const spinner = this.renderRoot.querySelector("onbotgo-spinner");
    spinner.remove();
    const file = this.renderRoot.querySelector("#file");
    file.style.width = "255px";
    file.style.height = "auto";
  }

  get audioTemplate() {
    if (this.message.from === "user") return html``;
    else if (this.message.from === "api") return html``;
  }
  get imageTemplate() {
    if (this.message.from === "user")
      return html`<onbotgo-box class="justify-end align-center">
        <onbotgo-box class="from-user onbotgo-message">
          <img
            src="${this.message.file.url}"
            @load=${this.removeSpinnerAndResize}
            width="0"
            id="file"
          />
          <onbotgo-spinner color="white"></onbotgo-spinner>
        </onbotgo-box>
        ${this.userAvatar}
      </onbotgo-box>`;
    else if (this.message.from === "api")
      return html` <onbotgo-box class="justify-end align-center">
        <onbotgo-box class="from-chatbot onbotgo-message">
          <img src="${this.message.file.url}" /><onbotgo-box
            class="bg-semi-transp"
          ></onbotgo-box></onbotgo-box
      ></onbotgo-box>`;
  }
  get otherFilesTemplate() {
    if (this.message.from === "user")
      return html`<onbotgo-box class="justify-end align-center">
        <onbotgo-box class="from-user onbotgo-message"
          ><a href="${this.message.file.url}"
            >${this.message.file.name}</a
          ></onbotgo-box
        >
        ${this.userAvatar}</onbotgo-box
      >`;
    else if (this.message.from === "api")
      return html`
        <onbotgo-box class="onbotgo-message-layout">
          <onbotgo-box class="from-chatbot onbotgo-message">
            <a href="${this.message.file.url}">${this.message.file.name}</a>
            <onbotgo-box class="bg-semi-transp"></onbotgo-box> </onbotgo-box
        ></onbotgo-box>
      `;
  }
  get messageTemplate() {
    if (this.message.from === "user")
      return html`<onbotgo-box class="justify-end align-center">
        <onbotgo-box class="from-user onbotgo-message"
          >${this.message.response}</onbotgo-box
        >${this.userAvatar}
      </onbotgo-box>`;
    else if (this.message.from === "api")
      return html`<onbotgo-box class="onbotgo-message-layout">
        ${this.ApiAvatar}${parseStringToHtml(
          '<onbotgo-box class="from-chatbot onbotgo-message">' +
            this.message.response +
            '<onbotgo-box class="bg-semi-transp"></onbotgo-box></onbotgo-box>'
        )}</onbotgo-box
      >`;
  }
  get loadingMessageTemplate() {
    if (this.message.from === "user")
      return html`<onbotgo-box class="justify-end align-center">
        <onbotgo-box class="from-user onbotgo-message"
          ><onbotgo-spinner color="white"></onbotgo-spinner></onbotgo-box
        >${this.userAvatar}
      </onbotgo-box>`;
    else if (this.message.from === "api")
      return html`<onbotgo-box style="display:flex;flex-direction: row;gap:8px"
        >${this.botAvatar}<onbotgo-box
          class="loading-api-message onbotgo-message"
        >
          <onbotgo-box class="dot "></onbotgo-box>
          <onbotgo-box class="dot delay2"></onbotgo-box>
          <onbotgo-box class="dot delay3"></onbotgo-box>
          <onbotgo-box class="bg-semi-transp"></onbotgo-box> </onbotgo-box
      ></onbotgo-box> `;
  }
  get interactiveTemplate() {
    let template;
    const addressCards = [];
    if (this.message.from === "api")
      template = html`<onbotgo-box class="onbotgo-message-layout">
          ${this.ApiAvatar}${parseStringToHtml(
            '<onbotgo-box class="from-chatbot onbotgo-message">' +
              this.message.response +
              '<onbotgo-box class="bg-semi-transp"></onbotgo-box></onbotgo-box>'
          )}</onbotgo-box
        >
        ${this.message.content.cards.map((card) => {
          switch (card.type) {
            case "address":
              addressCards.push(card);
              return html`<onbotgo-box
                class="onbotgo-message-layout"
                style="margin-top:15px"
              >
                ${this.ApiAvatar}<onbotgo-interactivemap
                  .cardInfo=${card}
                ></onbotgo-interactivemap
              ></onbotgo-box>`;
          }
        })}`;
    if (addressCards.length && appConfig.callbacks?.address)
      appConfig.callbacks.address(addressCards);
    return template;
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

  get ApiAvatar() {
    return this.message.role === "agent" ? this.agentAvatar : this.botAvatar;
  }
  render() {
    if (["loadingMessage"].includes(this.message.type))
      return this.loadingMessageTemplate;
    else if (this.message.fileType === "audio") return this.audioTemplate;
    else if (this.message.fileType?.includes("image"))
      return this.imageTemplate;
    else if (this.message.file) return this.otherFilesTemplate;
    else if (this.message.type === "interactive")
      return this.interactiveTemplate;
    return this.messageTemplate;
  }

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
    .flex-column {
      flex-direction: column;
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
}

customElements.define(tag, ChatMessage);
