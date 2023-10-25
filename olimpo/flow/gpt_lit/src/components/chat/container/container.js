import { LitElement, html, css, unsafeCSS } from "lit";
import styles from "./container.css?raw";
import { parseStringToHtml } from "../../../utils/functions/parseStringToHtml";
import sendIcon from "./../../../assets/icons/send.svg?raw";
import micIcon from "./../../../assets/icons/microphone.svg?raw";
import logo from "./../../../assets/icons/logo.svg?raw";
import { handleUploadFile } from "./use-cases/uploadFile";
import { appSetupConfig } from "../../../app-config/setup";
import { sendMessage } from "./use-cases/sendMessage";

const tag = `onbotgo-chat`;

export class ChatContainer extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  static properties = {
    isMicShowing: { type: Boolean },
    attachedFiles: { type: Array },
    isUploadingFile: { type: Boolean },
    messagesHistory: { type: Array },
    message: { type: String },
    chattingWith: { type: String },
    isSendingMessage: { type: Boolean },
  };

  constructor() {
    super();
    this.isMicShowing = false;
    this.attachedFiles = [];
    this.isDisabled = false;
    this.messagesHistory = [
      { content: appSetupConfig.welcomeMessage, type: "apiMessage" },
    ];
  }

  async uploadFileHandler(e) {
    if (!e.target.files[0]) return;
    const type = e.target.files[0].type;
    this.isUploadingFile = true;
    const uploadedFile = await handleUploadFile(e);
    this.attachedFiles = [...this.attachedFiles, { type, ...uploadedFile }];
    this.isUploadingFile = false;
  }

  async onSubmit(message) {
    message = message?.trim() ?? "";
    if (
      (!message && !this.attachedFiles.length && !this.attachedRecord) ||
      this.isSendingMessage
    )
      return;
    this.isSendingMessage = true;
    const history = structuredClone(this.messagesHistory);
    history.splice(0, 1);

    if (this.attachedFiles.length) {
      this.addMessageAndUpdateScroll(
        ...this.attachedFiles.map((af) => ({
          type: "userMessage",
          file: af,
          fileType: af.type.includes("image") ? "image" : af.type,
        }))
      );
    }

    if (this.attachedRecord)
      this.addMessageAndUpdateScroll({
        type: "userMessage",
        file: this.attachedRecord,
        fileType: "audio",
      });

    if (message)
      this.addMessageAndUpdateScroll({ content: message, type: "userMessage" });

    this.addMessageAndUpdateScroll({ type: "loadingMessage" });
    this.isSendingMessage = false;
    this.attachedFiles = [];
    this.attachedRecord = null;
    this.message = "";

    const apiMessages = await sendMessage({
      message: this.message,
      files: this.attachedFiles,
      record: this.attachedRecord,
      chattingWith: this.chattingWith,
    });

    this.removeLoadingMessages();
    if (apiMessages?.data?.process?.length)
      apiMessages.data.process.forEach((process) => {
        this.addMessageAndUpdateScroll({
          type: process.role,
          name: process.name,
          content: process.content,
        });
      });
    if (apiMessages.length)
      apiMessages.forEach((m) => {
        this.addMessageAndUpdateScroll({
          content: m.content,
          type: "apiMessage",
        });
      });
    else
      this.addMessageAndUpdateScroll({
        content: apiMessages.response,
        type: "apiMessage",
      });
    if (apiMessages.redirect) {
      this.chattingWith = "human_agent";
    }
    if (apiMessages.thought) this.showBotThought(apiMessages.thought);
  }

  removeLoadingMessages() {
    this.messagesHistory = this.messagesHistory.filter(
      ({ type }) => type !== "loadingMessage"
    );
  }

  updateMessage(e) {
    this.message = e.target.value;
  }
  updateScrollbar() {
    const messagesContainer = this.renderRoot.querySelector(
      "#onbotgo-messageContainer"
    );
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
  }

  addMessageAndUpdateScroll(...messages) {
    console.log(messages);
    this.messagesHistory = [...this.messagesHistory, ...messages];
    setTimeout(() => this.updateScrollbar(), 0);
  }

  render() {
    return html`<onbotgo-box id="onbotgo-chatheader"> </onbotgo-box>
      <onbotgo-box id="onbotgo-messageContainer">
        ${this.messagesHistory.map(
          (messageHistory) =>
            html`<onbotgo-chatmessage
              .message=${messageHistory}
            ></onbotgo-chatmessage>`
        )}
      </onbotgo-box>
      <onbotgo-box id="onbotgo-input-container">
        <onbotgo-box
          id="onbotgo-attachFileTemplateContainer"
          style=${`display: ${this.isMicShowing ? "none" : "grid"}`}
        >
          <onbotgo-attachfile
            .attachedFiles=${this.attachedFiles}
            .isUploadingFile=${this.isUploadingFile}
            .uploadFileHandler=${(e) => this.uploadFileHandler(e)}
          ></onbotgo-attachfile>
        </onbotgo-box>
        <onbotgo-chatinput
          .onSubmit=${this.onSubmit.bind(this)}
          .updateMessage=${this.updateMessage.bind(this)}
          .message=${this.message}
          .isDisabled=${this.isSendingMessage}
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
