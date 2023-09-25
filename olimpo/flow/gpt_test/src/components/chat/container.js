import { WebComponent } from "../webComponent";
import { chatMessage } from "./chatMessage/chatMessage";
import { sendMessage } from "../../api/sendMessage";
import { ChatInput } from "./chatInput/chatInput";
import { CustomScrollBar } from "../scrollbar/customScrollbar";

import template from "./container.html?raw";
import attachFileTemplate from "./attachFile/template.html?raw";

import logo from "../../assets/logo.html?raw";
import microphone from "./../../assets/icons/microphone.svg?raw";
import paperclip from "./../../assets/icons/paperclip.svg?raw";
import trashIcon from "./../../assets/icons/trashIcon.svg?raw";
import iconPlus from "./../../assets/icons/plus.svg?raw";
import sendIcon from "./../../assets/icons/send.svg?raw";
import { appConfig } from "../../app-state/config";
import { SessionStorage } from "../../app-state/SessionStorage";
import tarjetaOhLogo from "./../../assets/images/financiera_oh.png";
import { theme } from "../../app-state/theme";
import { uploadFile } from "../../api/uploadFile";
import { sendComprobante } from "../../api/sendCoomprobante";

const tag = "onbotgo-chatcontainer";
export class ChatContainer extends WebComponent {
  messagesHistory = [
    {
      message: appConfig.welcomeMessage,
      type: "apiMessage",
    },
    ...(SessionStorage.messagesHistory.get() ?? []),
  ];
  attachedFiles = [];
  attachedRecord;

  header;
  messagesContainer;
  scrollBar;
  chatInput;
  attachFileInput;
  btnOnbotgoAttachInput;
  btnattachNewFile;
  isRecordSelected = false;

  defaultStyles = {
    bottom: "60px",
    right: "10px",
    position: "absolute",
    display: "flex",
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 5px 40px",
    flexDirection: "column",
    width: "400px",
    gap: "10px",
    maxWidth: "calc(100vw - 90px)",
    maxHeight: "704px",
    height: "70vh",
    backgroundColor: "white",
    borderRadius: "8px",
    paddingBottom: "10px",
  };

  constructor() {
    super();
    this.setStyles(this.defaultStyles);
    this.classList.add("hidden");
    this.render();
    this.addEventListener("onbotgo-delete-record", () => {
      this.isRecordSelected = false;
      this.attachedRecord = null;
      this.getChild("#onbotgo-btnrecordSend").style.display = "none";
      this.getChild("#onbotgo-btnrecord").style.display = "grid";
      this.getChild("#onbotgo-chatinput").style.display = "grid";
      this.getChild("#onbotgo-attachFileTemplateContainer").style.display =
        "grid";
      this.getChild("#onbotgo-micrecord").style.display = "none";
      this.updateScrollbar();
    });
    this.addEventListener("onbotgo-stop-record", (record) => {
      this.attachedRecord = record.detail;
      this.getChild("#onbotgo-btnrecordSend").onclick = () => {
        this.onSubmit();
        this.getChild("#onbotgo-chatinput").style.display = "grid";
        this.getChild("#onbotgo-btnrecord").style.display = "grid";
        this.getChild("#onbotgo-btnrecordSend").style.display = "none";
        this.renderAttachTemplate();
        this.getChild("#onbotgo-btnrecordSend").onclick = () => {};
      };
    });
  }

  onSubmit(message) {
    message = message?.trim() ?? "";
    if (!message && !this.attachedFiles.length && !this.attachedRecord) return;
    const history = structuredClone(this.messagesHistory);
    history.splice(0, 1);
    const payload = {
      message:
        this.attachedFiles.length && !message && !this.attachedRecord
          ? "Adjunto comprobante de pago"
          : message,
      url: (this.attachedFiles || []).map(({ url }) => url),
      unique_id: appConfig.messageHistoryId,
    };

    if (this.attachedFiles.length) {
      this.addMessages(
        this.attachedFiles.map((af) => ({
          type: "userMessage",
          file: af,
          fileType: af.type.includes("image") ? "image" : af.type,
        }))
      );
      this.attachedFiles = [];
      this.renderAttachTemplate();
      this.messagesContainer.querySelectorAll("img").forEach((img) => {
        img.onload = () => this.updateScrollbar();
      });
    }

    if (this.attachedRecord)
      this.addMessages([
        {
          type: "userMessage",
          file: this.attachedRecord,
          fileType: "audio",
        },
      ]);
    if (message) this.addMessages([{ message: message, type: "userMessage" }]);

    this.renderMessages([{ type: "LoadingMessage" }]);
    this.updateScrollbar();

    this.isRecordSelected = false;
    this.attachedRecord = null;
    this.chatInput.getChild("input").value = "";
    this.getChild("#onbotgo-chatinput").style.display = "grid";
    this.getChild("#onbotgo-attachFileTemplateContainer").style.display =
      "grid";
    this.getChild("#onbotgo-micrecord").style.display = "none";
    this.updateScrollbar();
    if (payload.url.length)
      payload.url.forEach((url) => {
        sendMessage({
          ...payload,
          message: `envio comprobante de pago, esta es la url "${url}"`,
          url: undefined,
        })
          .then((apiMessage) => {
            // if (!apiMessage.success) throw new Error(apiMessage.msg);
            if (apiMessage?.unique_id)
              appConfig.messageHistoryId = apiMessage.unique_id;
            if (apiMessage?.data?.process?.length)
              apiMessage.data.process.forEach((process) => {
                this.addMessages([
                  {
                    type: process.role,
                    name: process.name,
                    content: process.content,
                  },
                ]);
              });

            this.addMessages([
              { message: apiMessage.response, type: "apiMessage" },
            ]);
          })
          .catch((err) => console.log(err))
          .finally(() => {
            this.messagesContainer
              .querySelectorAll(".loading-api-message")
              ?.forEach((node) => node.remove());

            this.updateScrollbar();
          });
      });
    else
      sendMessage(payload)
        .then((apiMessage) => {
          // if (!apiMessage.success) throw new Error(apiMessage.msg);
          if (apiMessage?.unique_id)
            appConfig.messageHistoryId = apiMessage.unique_id;
          if (apiMessage?.data?.process?.length)
            apiMessage.data.process.forEach((process) => {
              this.addMessages([
                {
                  type: process.role,
                  name: process.name,
                  content: process.content,
                },
              ]);
            });

          this.addMessages([
            { message: apiMessage.response, type: "apiMessage" },
          ]);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.messagesContainer
            .querySelectorAll(".loading-api-message")
            ?.forEach((node) => node.remove());

          this.updateScrollbar();
        });
  }

  toggle() {
    if (this.classList.contains("hidden")) {
      this.scrollBar.style.visibility = "hidden";
      this.classList.remove("hidden");
    } else {
      this.classList.add("hidden");

      if (this.messagesContainer.scrollTop > 0)
        this.scrollBar.style.visibility = "visible";
    }
  }

  async attachFile(e) {
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
    try {
      this.chatInput.onSubmit = () => null;
      // this.chatInput.querySelector(
      //   ".send-icon-box"
      // ).innerHTML = `<style>.lds-ring {
      //   display: inline-block;
      //   position: relative;
      //   width: 19px;
      //   height: 19x;
      // }
      // .lds-ring div {
      //   box-sizing: border-box;
      //   display: block;
      //   position: absolute;
      //   width: 19px;
      //   height: 19px;
      //   border: 8px solid ${theme.colors.primary};
      //   border-radius: 50%;
      //   animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      //   border-color: ${theme.colors.primary} transparent transparent transparent;
      // }
      // .lds-ring div:nth-child(1) {
      //   animation-delay: -0.45s;
      // }
      // .lds-ring div:nth-child(2) {
      //   animation-delay: -0.3s;
      // }
      // .lds-ring div:nth-child(3) {
      //   animation-delay: -0.15s;
      // }
      // @keyframes lds-ring {
      //   0% {
      //     transform: rotate(0deg);
      //   }
      //   100% {
      //     transform: rotate(360deg);
      //   }
      // }</style><div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
      const res = await uploadFile(payload);
      this.attachedFiles.find(({ name }) => name === payload[0].name).url =
        res.data[0].url;
      // this.chatInput.querySelector(
      //   ".send-icon-box"
      // ).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="19px" class="send-icon flex" fill="currentColor">
      //   <path d="M476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0027.14 52 24.65 24.65 0 0016 72.59v113.29a24 24 0 0019.52 23.57l232.93 43.07a4 4 0 010 7.86L35.53 303.45A24 24 0 0016 327v113.31A23.57 23.57 0 0026.59 460a23.94 23.94 0 0013.22 4 24.55 24.55 0 009.52-1.93L476.4 285.94l.19-.09a32 32 0 000-58.8z"></path>
      // </svg>`;
    } catch (err) {}

    this.attachedFiles.push(e.target.files[0]);
    this.renderAttachTemplate();
  }

  renderMessages(messages) {
    messages.forEach(
      (m) =>
        !["dataMessage"].includes(m.type) &&
        this.messagesContainer.appendChild(new chatMessage(m))
    );
  }

  addMessages(messages, { updateScrollbar } = { updateScrollbar: false }) {
    this.messagesHistory = this.messagesHistory.concat(messages);
    this.renderMessages(messages);
    if (updateScrollbar) this.updateScrollbar();
  }

  updateScrollbar() {
    this.scrollBar.setScrollThumbHeight();

    this.messagesContainer.scrollTo(0, this.messagesContainer.scrollHeight);
    if (
      this.messagesContainer.scrollTop > 0 &&
      this.scrollBar.style.visibility === "hidden"
    )
      this.scrollBar.style.visibility = "visible";
  }

  renderAttachTemplate() {
    this.getChild("#onbotgo-attachFileTemplateContainer").innerHTML =
      this.renderHTML(attachFileTemplate, {
        attachedFiles: this.attachedFiles,
        paperclipIcon: paperclip,
        iconPlus: iconPlus,
        trashIcon: trashIcon,
      });
    this.attachFileInput = this.querySelector("#onbotgoAttachFileInput");
    this.btnOnbotgoAttachInput =
      this.querySelector("#btnOnbotgoAttachInput") ??
      this.querySelector("#btnOnbotgoAttachInputMenu");
    this.btnattachNewFile = this.querySelector("#onbotgo-btnattachNewFile");

    this.btnOnbotgoAttachInput.onclick = () => {
      if (!this.attachedFiles.length) return this.attachFileInput.click();
    };
    this.btnattachNewFile.onclick = () => this.attachFileInput.click();
    this.attachFileInput.onchange = (e) => this.attachFile(e);
  }
  render() {
    this.innerHTML = this.renderHTML(template, {
      logo,
      micIcon: microphone,
      paperclipIcon: paperclip,
      attachedFiles: this.attachedFiles,
      trashIcon,
      iconPlus,
      sendIcon: sendIcon,
      isRecordSelected: this.isRecordSelected,
    });
    this.renderAttachTemplate();

    const micRecord = this.querySelector("onbotgo-micrecord");
    const dropdown = this.querySelector("onbotgo-dropdown");
    this.messagesContainer = this.querySelector("#onbotgo-messageContainer");

    this.chatInput = this.querySelector(ChatInput.tag);
    this.scrollBar = this.querySelector(CustomScrollBar.tag);
    this.header = this.querySelector("#onbotgo-chatheader");
    this.header.style.display = "flex";
    this.header.style.width = "100%";
    this.header.style.justifyContent = "center";
    this.header.style.backgroundColor = theme.colors.primary;
    const logoHeader = this.header.getChild("img");
    logoHeader.src = tarjetaOhLogo;
    logoHeader.style.objectFit = "cover";

    this.getChild("#onbotgo-btnrecordSend").style.display = "none";
    this.querySelector("#onbotgo-btnrecord").onclick = () => {
      this.isRecordSelected = true;
      this.getChild("#onbotgo-btnrecord").style.display = "none";
      this.getChild("#onbotgo-btnrecordSend").style.display = "grid";
      this.getChild("#onbotgo-chatinput").style.display = "none";
      this.getChild("#onbotgo-attachFileTemplateContainer").style.display =
        "none";
      this.getChild("#onbotgo-micrecord").style.display = "flex";
      this.renderAttachTemplate();
      this.updateScrollbar();
    };

    this.chatInput.onSubmit(this.onSubmit.bind(this));
    this.renderMessages(this.messagesHistory);

    if (this.isRecordSelected) {
      dropdown.style.display = "none";
      this.chatInput.style.display = "none";
      micRecord.style.display = "flex";
    } else {
      dropdown.style.display = "grid";
      this.btnattachNewFile.style.display = "grid";
      this.chatInput.style.display = "grid";
      micRecord.style.display = "none";
    }

    this.querySelectorAll(".onbotgo-attachedFile").forEach((elem, i) => {
      elem.querySelector("i").onclick = (e) => {
        this.attachedFiles.splice(i, 1);
        this.renderAttachTemplate();
        if (this.attachedFiles.length)
          this.querySelector(".onbotgo-dropdown-content").style.display =
            "flex";
        e.stopPropagation();
      };
    });
  }
}

export const getChatContainerStyles = (theme) => ({
  [`${tag}.hidden`]: {
    visibility: "hidden",
  },
  [`${tag} .onbotgo-messageContainer`]: {
    display: "flex !important",
  },
  [`${tag} .onbotgo-chat-footer`]: {
    "font-family": theme.typography.primary,
    display: "flex !important",
    "align-items": "center",
    "justify-content": "flex-end",
    gap: "5px",
  },
  [`${tag} .onbotgo-icon-paperclip path`]: {
    stroke: theme.colors.primary,
  },
});

ChatContainer.tag = tag;
