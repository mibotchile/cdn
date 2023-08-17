import { WebComponent } from "../webComponent";
import { Box } from "../box/box";
import { theme } from "../../app-state/theme";

const tag = "onbotgo-chatmessage";
export class chatMessage extends WebComponent {
  messageBox = new Box();

  constructor(message) {
    super();
    this.setStyles({
      width: "100%",
      display: "flex",
      minHeight: "max(45px,fit-content)",
      justifyContent:
        message.type === "userMessage" ? "flex-end" : "flex-start",
    });

    const classes = {
      userMessage: "from-user",
      apiMessage: "from-chatbot",
    };

    this.messageBox.setStyles({
      width: "fit-content",
      height: "fit-content",
      borderRadius: "6px",
      alignItems: "center",
      padding: "15px 15px",
      fontFamily: theme.typography.primary,
      color: message.type === "userMessage" ? "white" : "black",
    });

    this.messageBox.classList.add(classes[message.type]);

    if(message.type === "userMessage")
    this.messageBox.innerText = message.message;
  else
  this.messageBox.innerHTML = message.message;

    if (message.type !== "userMessage") {
      const chatbotBackground = new Box();
      chatbotBackground.classList.add("bg-semi-transp");
      this.messageBox.appendChild(chatbotBackground);
    }
    this.appendChild(this.messageBox);
  }
}

chatMessage.tag = tag;

export const getChatMessageStyles = (theme) => ({
  [`${tag} > .from-chatbot`]: {
    width: "100%",
    content: "",
    overflow: "hidden",
    position: "relative",
    "max-width": "75%",
    "z-index": 1,
  },
  [`${tag} > .from-chatbot > .bg-semi-transp`]: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: ".1",
    top: 0,
    "z-index": "-1",
    left: 0,
    "background-color": theme.colors.primary,
  },
  [`${tag} > .from-user`]: {
    "margin-right": "15px",
    "max-width": "70%",
    "background-color": theme.colors.primary,
  },
});
