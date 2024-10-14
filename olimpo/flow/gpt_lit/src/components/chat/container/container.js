import { LitElement, html, css, unsafeCSS } from "lit";
import styles from "./container.css?raw";
import { parseStringToHtml } from "../../../utils/functions/parseStringToHtml";
import sendIcon from "./../../../assets/icons/send.svg?raw";
import micIcon from "./../../../assets/icons/microphone.svg?raw";
import logo from "./../../../assets/icons/logo.svg?raw";
import { appConfig } from "../../../app-config/setup";
import { getPrediction, sendMessageApi } from "../../../api/sendMessage";
import { redirectConversation } from "../../../services/websockets/redirect";
import robotImage from "../../../assets/images/robot.png";
import Toastify from "toastify-js";
import { theme } from "../../../app-config/theme";
import { uploadFile } from "../../../api/uploadFile";

const tag = `onbotgo-chat`;

const redirectWebSocket = new redirectConversation();
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
    this.isSendingMessage = false;
    this.messagesHistory = [
      { response: appConfig.welcomeMessage, from: "api", type: "text" },
    ];
  }

  async uploadFileHandler(e) {
    if (!e.target.files[0]) return;
    const { type } = e.target.files[0];
    const payload = [
      {
        name: e.target.files[0].name,
        size: e.target.files[0].size,
        type: e.target.files[0].type,
        buffer: Array.from(
          new Uint8Array(await e.target.files[0].arrayBuffer())
        ),
      },
    ];
    this.isUploadingFile = true;
    const uploadedFile = await uploadFile(payload);
    this.attachedFiles = [
      ...this.attachedFiles,
      { type, name: uploadedFile.data[0].name, url: uploadedFile.data[0].url },
    ];

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

    const payload = {
      channel_id: appConfig.chathubChannelId,
      message:
        this.attachedFiles.length && !message && !this.attachedRecord
          ? "Adjunto comprobante de pago"
          : message,
      url: (this.attachedFiles || []).map(({ url }) => url),
      unique_id: appConfig.messageHistoryId,
    };

    if (this.attachedFiles.length) {
      this.addMessageAndUpdateScroll(
        ...this.attachedFiles.map((af) => ({
          from: "user",
          file: af,
          fileType: af.type.includes("image") ? "image" : af.type,
        }))
      );
      this.attachedFiles = [];
    }

    if (this.attachedRecord)
      this.addMessageAndUpdateScroll({
        from: "user",
        file: this.attachedRecord,
        fileType: "audio",
      });
    if (message)
      this.addMessageAndUpdateScroll({
        type: "text",
        response: message,
        from: "user",
      });

    this.addMessageAndUpdateScroll({ type: "loadingMessage", from: "api" });

    this.attachedRecord = null;
    this.isSendingMessage = true;
    if (this.chattingWith === "human_agent") {
      sendMessageApi({
        content: `${payload.message}\n${payload.url}`,
        conversation_id: appConfig.messageHistoryId,
        channel_id: appConfig.chathubChannelId,
        sender: "user",
      }).finally(() => {
        this.removeLoadingMessages();
        this.updateScrollbar();
        this.isSendingMessage = false;
      });
      return;
    }
    if (payload.url.length)
      payload.url.forEach((url) => {
        getPrediction({
          ...payload,
          message: `envio comprobante de pago, esta es la url "${url}"`,
          url: undefined,
        })
          .then((apiMessage) => {
            if (apiMessage?.unique_id) {
              appConfig.messageHistoryId = apiMessage.unique_id;
              redirectWebSocket.init(appConfig.messageHistoryId);
              redirectWebSocket.onIncomingMessage((message) =>
                this.addMessageAndUpdateScroll(message)
              );
            }
            if (apiMessage?.data?.process?.length)
              apiMessage.data.process.forEach((process) => {
                this.addMessageAndUpdateScroll({
                  type: process.role,
                  name: process.name,
                  response: process.content,
                });
              });

            this.addMessageAndUpdateScroll({
              type: "text",
              ...apiMessage,
              from: "api",
            });

            if (apiMessage.thought && appConfig.showThoughts)
              this.showBotThought(apiMessage.thought);
            if (apiMessage.redirect) {
              this.chattingWith = "human_agent";
            }
          })
          .catch((err) => console.log(err))
          .finally(() => {
            this.removeLoadingMessages();
            this.updateScrollbar();
            this.isSendingMessage = false;
          });
      });
    else
      getPrediction(payload)
        .then((apiMessage) => {
          if (apiMessage?.unique_id) {
            appConfig.messageHistoryId = apiMessage.unique_id;
            redirectWebSocket.init(appConfig.messageHistoryId);
            redirectWebSocket.onIncomingMessage((message) =>
              this.addMessageAndUpdateScroll(message)
            );
          }
          if (apiMessage?.data?.process?.length)
            apiMessage.data.process.forEach((process) => {
              this.addMessageAndUpdateScroll({
                type: process.role,
                name: process.name,
                response: process.content,
              });
            });

          this.addMessageAndUpdateScroll({
            type: "text",
            ...apiMessage,
            from: "api",
          });

          if (apiMessage.redirect) {
            this.chattingWith = "human_agent";
          }
          if (apiMessage.thought && appConfig.showThoughts)
            this.showBotThought(apiMessage.thought);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.removeLoadingMessages();
          this.updateScrollbar();
          this.isSendingMessage = false;
        });
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
    this.messagesHistory = [...this.messagesHistory, ...messages];
    setTimeout(() => this.updateScrollbar(), 0);
  }

  showBotThought(thought) {
    Toastify({
      text: `<div style="display:flex;align-items:center;gap:10px"><img src="${robotImage}" width="30" height="30" /> ${thought}</div>`,
      duration: 5000,
      newWindow: true,
      gravity: "bottom",
      escapeMarkup: false,
      position: "center",
      style: {
        background: theme.colors.primary,
        fontFamily: theme.typography.primary,
        cursor: "normal",
      },
      stopOnFocus: true,
    }).showToast();
  }

  render() {
    return html`<onbotgo-box id="onbotgo-chatheader"> </onbotgo-box>
      <onbotgo-box id="onbotgo-messageContainer">
        ${this.messagesHistory.map(
          (message) =>
            html`<onbotgo-chatmessage
              .message=${message}
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
