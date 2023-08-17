import { ChatInput } from "./chatInput";
import { WebComponent } from "../webComponent";
import { Box } from "../box/box";
import { chatMessage } from "./chatMessage";
import { sendMessage } from "../../api/sendMessage";
import { CustomScrollBar } from "../scrollbar/customScrollbar";

const tag = "onbotgo-chatcontainer";
export class ChatContainer extends WebComponent {
  messagesHistory = [
    {
      message: "¡Hola! ¿En qué puedo ayudarte hoy?",
      type: "apiMessage",
    },
  ];
  scrollableContainer = new Box();
  messagesContainer = new Box();
  chatInput = new ChatInput();
  scrollBar = new CustomScrollBar();

  defaultStyles = {
    bottom: "60px",
    right: "10px",
    position: "absolute",
    display: "inline-block",
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 5px 40px",
    width: "400px",
    maxWidth: "calc(100vw - 90px)",
    maxHeight: "704px",
    height: "70vh",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "10px 20px",
  };

  constructor() {
    super();
    this.classList.add("hidden");
    this.setStyles(this.defaultStyles);
    this.messagesContainer.id = "onbotgo-messageContainer";
    this.scrollBar["data-target-id"] = "scrollableElement";
    this.scrollBar.style.visibility = "hidden";
    this.scrollableContainer.appendChild(this.scrollBar);
    this.scrollableContainer.appendChild(this.messagesContainer);
    this.scrollableContainer.setStyles({
      height: "88%",
      position: "relative",
      overflow: "hidden",
      marginBottom: "15px",
    });
    this.messagesContainer.setStyles({
      height: "calc(100% - 1.5rem)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      position: "relative",
      padding: "1rem",
    });

    this.chatInput.onSubmit(this.onSubmit.bind(this));

    this.appendChild(this.scrollableContainer);
    this.appendChild(this.chatInput);

    this.renderMessages(this.messagesHistory);
  }

  onSubmit(message) {
    message = message.trim();
    if (!message) return;
    try {
      const history = structuredClone(this.messagesHistory);
      history.splice(0, 1);
      const payload = {
        history,
        question: message,
      };

      this.addMessages([{ message: message, type: "userMessage" }]);

      sendMessage(payload).then((apiMessage) => {
        if (!apiMessage.success) throw new Error(apiMessage.msg);

        if (apiMessage.data.process.length)
          apiMessage.data.process.forEach((process) => {
            this.addMessages([
              {
                message: process.content,
                type: process.role,
                name: process.name,
              },
            ]);
          });

        this.addMessages([
          { message: apiMessage.data.answer, type: "apiMessage" },
        ]);
      });
    } catch (err) {}
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

  renderMessages(messages) {
    messages.forEach(
      (m) =>
        !["dataMessage"].includes(m.type) &&
        this.messagesContainer.appendChild(new chatMessage(m))
    );
  }

  addMessages(messages) {
    this.messagesHistory = this.messagesHistory.concat(messages);
    this.renderMessages(messages);
    this.updateScrollbar();
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
}
export const getChatContainerStyles = () => ({
  [`${tag}.hidden`]: {
    visibility: "hidden",
    // "-webkit-animation": "onbotgo-bounce-in-fwd 0.7s ease-in both",
    // animation: "onbotgo-bounce-in-fwd 0.7s ease-in both",
  },
});

ChatContainer.tag = tag;
