import { WebComponent } from "../webComponent";
import { chatMessage } from "./chatMessage/chatMessage";
import { getPrediction, sendMessage } from "../../api/sendMessage";
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
import robotImage from "./../../assets/images/robot.png";
import { appConfig } from "../../app-state/config";
import { SessionStorage } from "../../app-state/SessionStorage";
import { theme } from "../../app-state/theme";
import { uploadFile } from "../../api/uploadFile";
import Toastify from "toastify-js";

const tag = "onbotgo-chatcontainer";
export class ChatContainer extends WebComponent {
  messagesHistory = [
    {
      message: appConfig.welcomeMessage,
      type: "apiMessage",
    },
    ...(SessionStorage.messagesHistory.get() ?? []),
    {
      type: "address",
      id: "1",
      name: "proyecto brisas del mar",
      address: "av republica china 298",
      image_url: "",
      country: "pe",
      location: "",
      data: { proyecto: "valles del campo", precio: "1000", cuartos: 3 },
      render_map: "background",
    },
    {
      type: "address",
      id: "2",
      name: "proyecto manzana verde",
      address: "av puno calle 21",
      image_url: "",
      country: "pe",
      location: "",
      data: { proyecto: "valles del campo", precio: "1000", cuartos: 3 },
      render_map: "modal",
    },
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
  messagesWebsocket;
  chattingWith = "virtual_assistant"; // virtual_assistnat|human_agent
  channelId = "";

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
    this.render();
    this.addEventListener("onbotgo-delete-record", () => {
      this.isRecordSelected = false;
      this.attachedRecord = null;
      // this.getChild("#onbotgo-btnrecordSend").style.display = "none";
      // this.getChild("#onbotgo-btnrecord").style.display = "grid";
      this.getChild("#onbotgo-chatinput").style.display = "grid";
      this.getChild("#onbotgo-attachFileTemplateContainer").style.display =
        "grid";
      // this.getChild("#onbotgo-micrecord").style.display = "none";
      this.updateScrollbar();
    });
    this.addEventListener("onbotgo-stop-record", (record) => {
      this.attachedRecord = record.detail;
      // this.getChild("#onbotgo-btnrecordSend").onclick = () => {
      //   this.onSubmit();
      //   this.getChild("#onbotgo-chatinput").style.display = "grid";
      //   this.getChild("#onbotgo-btnrecord").style.display = "grid";
      //   this.getChild("#onbotgo-btnrecordSend").style.display = "none";
      //   this.renderAttachTemplate();
      //   this.getChild("#onbotgo-btnrecordSend").onclick = () => {};
      // };
    });
  }

  initMessagesWebsocket(conversationId) {
    if (this.messagesWebsocket && this.messagesWebsocket.OPEN) {
      console.log("WS MESSAGES IS CONNECTED ", this.messagesWebsocket);
      return;
    }
    const wsUrl = `${appConfig.ssl ? "wss" : "ws"}://${appConfig.botHost}`;

    const url = `${wsUrl}/messages/${conversationId}/ws`;
    this.messagesWebsocket = new WebSocket(url);
    console.log(this.messagesWebsocket);

    this.messagesWebsocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("ON MESSAGE ", data);
      if (data.event === "incoming_message") {
        const message = data.data;

        this.addMessages(
          [{ message: message.content, type: "apiMessage" }],
          { updateScrollbar: true },
          true
        );
      }
    };

    this.messagesWebsocket.onopen = (event) => {
      console.log("SOCKET CONNECTED ", event);

      this.messagesWebsocket.send(
        JSON.stringify({ event: "connected", data: null })
      );
    };

    this.messagesWebsocket.onerror = (event) => {
      console.log("SOCKET ERRROR ", event);
    };

    this.messagesWebsocket.onclose = (event) => {
      console.log("SOCKET Disconnected", event);
    };
  }

  closeMessagesWebsocket() {
    this.messagesWebsocket.send(JSON.stringify({ event: "close", data: null }));

    this.messagesWebsocket.close();
  }

  onSubmit(message) {
    message = message?.trim() ?? "";
    if (!message && !this.attachedFiles.length && !this.attachedRecord) return;
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
    // this.getChild("#onbotgo-micrecord").style.display = "none";
    this.updateScrollbar();
    const inputElement = this.getChild("input[type=text]");
    inputElement.disabled = true;
    this.getChild("#onbotgo-chatinput").style.backgroundColor =
      "rgba(239,239,239,.6)";
    if (this.chattingWith === "human_agent") {
      sendMessage({
        content: `${payload.message}\n${payload.url}`,
        conversation_id: appConfig.messageHistoryId,
        channel_id: appConfig.chathubChannelId,
        sender: "user",
      }).finally(() => {
        this.querySelector("input").focus();
        this.messagesContainer
          .querySelectorAll(".loading-api-message")
          ?.forEach((node) => node.remove());
        inputElement.disabled = false;
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
              this.initMessagesWebsocket(appConfig.messageHistoryId);
            }
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

            if (apiMessage.thought) this.showBotThought(apiMessage.thought);
            if (apiMessage.redirect) {
              this.chattingWith = "human_agent";
            }

            if (apiMessage?.cards) this.handleCardMessages(apiMessage.cards);
          })
          .catch((err) => console.log(err))
          .finally(() => {
            this.messagesContainer
              .querySelectorAll(".loading-api-message")
              ?.forEach((node) => node.remove());

            this.updateScrollbar();
            inputElement.disabled = false;
            this.getChild("#onbotgo-chatinput").style.backgroundColor = "white";
            inputElement.focus();
          });
      });
    else
      getPrediction(payload)
        .then((apiMessage) => {
          if (apiMessage?.unique_id) {
            appConfig.messageHistoryId = apiMessage.unique_id;
            this.initMessagesWebsocket(appConfig.messageHistoryId);
          }
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

          if (apiMessage.redirect) {
            this.chattingWith = "human_agent";
          }
          if (apiMessage.thought) this.showBotThought(apiMessage.thought);
          if (apiMessage?.cards) this.handleCardMessages(apiMessage.cards);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.messagesContainer
            .querySelectorAll(".loading-api-message")
            ?.forEach((node) => node.remove());
          inputElement.disabled = false;
          this.getChild("#onbotgo-chatinput").style.backgroundColor = "white";
          inputElement.focus();
          this.updateScrollbar();
        });
  }

  handleCardMessages(cards) {
    cards.forEach((card) => {
      this.addMessages([card]);
      if (appConfig.callbacks?.address && card.type === "address")
        appConfig.callbacks?.address(messageData);
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

  showBotThought(thought) {
    if (!appConfig.showThoughts) return;
    Toastify({
      text: `<div style="display:flex;align-items:center;gap:10px"><img src="${robotImage}" width="30" height="30" /> ${thought}</div>`,
      duration: 3000,
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

      onClick: function () {}, // Callback after click
    }).showToast();
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
    const containerBtn = this.querySelector(
      "onbotgo-dropdown onbotgo-iconbutton"
    );
    try {
      containerBtn.querySelector("svg").style.display = "none";
      containerBtn.innerHTML += `<style>.onbotgo-lds-ring {
        display: grid;
        position: relative;
        place-items: center;
        width: 19px;
        height: 19x;
      }
      .onbotgo-lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 19px;
        height: 19px;
        border: 2px solid ${theme.colors.primary};
        border-radius: 50%;
        animation: onbotgo-lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: ${theme.colors.primary} transparent transparent transparent;
      }
      .onbotgo-lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
      }
      .onbotgo-lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
      }
      .onbotgo-lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
      }
      @keyframes onbotgo-lds-ring {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }</style><div class="onbotgo-lds-ring"><div></div><div></div><div></div><div></div></div>`;
      const res = await uploadFile(payload);
      this.attachedFiles.push(e.target.files[0]);
      this.attachedFiles.find(({ name }) => name === payload[0].name).url =
        res.data[0].url;
    } catch (err) {
      console.log(err);
    }
    containerBtn.querySelector("style").remove();
    containerBtn.querySelector(".onbotgo-lds-ring").remove();
    this.renderAttachTemplate();
  }

  renderMessages(messages, isAgent = false) {
    messages.forEach(
      (m) =>
        !["dataMessage"].includes(m.type) &&
        this.messagesContainer.appendChild(new chatMessage(m, isAgent))
    );
  }

  addMessages(
    messages,
    { updateScrollbar } = { updateScrollbar: false },
    isAgent = false
  ) {
    this.messagesHistory = this.messagesHistory.concat(messages);
    this.renderMessages(messages, isAgent);
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

    // const micRecord = this.querySelector("onbotgo-micrecord");
    const dropdown = this.querySelector("onbotgo-dropdown");
    this.messagesContainer = this.querySelector("#onbotgo-messageContainer");

    this.chatInput = this.querySelector(ChatInput.tag);
    this.scrollBar = this.querySelector(CustomScrollBar.tag);
    this.header = this.querySelector("#onbotgo-chatheader");
    this.header.style.display = "flex";
    this.header.style.width = "100%";
    this.header.style.justifyContent = "center";
    this.header.style.backgroundColor = theme.colors.primary;
    // const logoHeader = this.header.getChild("img");
    // logoHeader.src = tarjetaOhLogo;
    // logoHeader.style.objectFit = "cover";

    // this.getChild("#onbotgo-btnrecordSend").style.display = "none";
    // this.querySelector("#onbotgo-btnrecord").onclick = () => {
    //   this.isRecordSelected = true;
    //   this.getChild("#onbotgo-btnrecord").style.display = "none";
    //   this.getChild("#onbotgo-btnrecordSend").style.display = "grid";
    //   this.getChild("#onbotgo-chatinput").style.display = "none";
    //   this.getChild("#onbotgo-attachFileTemplateContainer").style.display =
    //     "none";
    //   // this.getChild("#onbotgo-micrecord").style.display = "flex";
    //   this.renderAttachTemplate();
    //   this.updateScrollbar();
    // };

    this.chatInput.onSubmit(this.onSubmit.bind(this));
    this.renderMessages(this.messagesHistory);

    if (this.isRecordSelected) {
      dropdown.style.display = "none";
      this.chatInput.style.display = "none";
      // micRecord.style.display = "flex";
    } else {
      dropdown.style.display = "grid";
      this.btnattachNewFile.style.display = "grid";
      this.chatInput.style.display = "grid";
      // micRecord.style.display = "none";
    }
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
