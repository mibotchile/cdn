import { WebComponent } from "../webComponent";
import { chatMessage } from "./chatMessage/chatMessage";
import { sendMessage } from "../../api/sendMessage";
import { ChatInput } from "./chatInput/chatInput";
import { CustomScrollBar } from "../scrollbar/customScrollbar";

import logo from "../../assets/logo.html?raw";
import template from "./container.html?raw";
import microphone from "./../../assets/icons/microphone.svg?raw";
import paperclip from "./../../assets/icons/paperclip.svg?raw";
import trashIcon from "./../../assets/icons/trashIcon.svg?raw";
import iconPlus from "./../../assets/icons/plus.svg?raw";

const tag = "onbotgo-chatcontainer";
export class ChatContainer extends WebComponent {
  messagesHistory = [
    {
      message: "¡Hola! ¿En qué puedo ayudarte hoy?",
      type: "apiMessage",
    },
  ];
  attachedFiles = [];

  messagesContainer;
  scrollBar;
  chatInput;
  attachFileInput;
  btnOnbotgoAttachInput;
  btnattachNewFile;

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
    padding: "10px 20px",
  };

  constructor() {
    super();
    this.setStyles(this.defaultStyles);
    // this.classList.add("hidden");
    this.render();
  }

  onSubmit(message) {
    message = message.trim();
    if (!message) return;
    const history = structuredClone(this.messagesHistory);
    history.splice(0, 1);
    const payload = {
      history,
      question: message,
    };

    this.addMessages([{ message: message, type: "userMessage" }]);
    this.renderMessages([{ type: "loadingMessage" }]);
    this.updateScrollbar();

    sendMessage(payload)
      .then((apiMessage) => {
        if (!apiMessage.success) throw new Error(apiMessage.msg);

        if (apiMessage.data.process.length)
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
          { message: apiMessage.data.answer, type: "apiMessage" },
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

  attachFile(e) {
    this.btnOnbotgoAttachInput = this.attachedFiles.push(e.target.files[0]);
    this.render();
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
  render() {
    this.innerHTML = this.renderHTML(template, {
      logo,
      micIcon: microphone,
      paperclipIcon: paperclip,
      attachedFiles: this.attachedFiles,
      trashIcon,
      iconPlus,
    });
    this.attachFileInput = this.querySelector("#onbotgoAttachFileInput");
    this.messagesContainer = this.querySelector("#onbotgo-messageContainer");
    this.btnOnbotgoAttachInput = this.querySelector("#btnOnbotgoAttachInput");
    this.btnattachNewFile = this.querySelector("#onbotgo-btnattachNewFile");
    this.chatInput = this.querySelector(ChatInput.tag);
    this.scrollBar = this.querySelector(CustomScrollBar.tag);

    this.chatInput.onSubmit(this.onSubmit.bind(this));
    this.btnattachNewFile.onclick = () => this.attachFileInput.click();
    this.renderMessages(this.messagesHistory);

    this.btnOnbotgoAttachInput.onclick = () => {
      if (!this.attachedFiles.length) return this.attachFileInput.click();
    };

    this.attachFileInput.onchange = (e) => this.attachFile(e);

    this.querySelectorAll(".onbotgo-attachedFile").forEach((elem, i) => {
      elem.querySelector("i").onclick = (e) => {
        this.attachedFiles.splice(i, 1);
        this.render();
        this.querySelector(".onbotgo-dropdown-content").style.display = "block";
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
