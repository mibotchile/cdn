import { WebComponent } from "../../webComponent";
import { Box } from "../../box/box";
import { theme } from "../../../app-state/theme";
import template from "./template.html?raw";

const tag = "onbotgo-chatmessage";
export class chatMessage extends WebComponent {
  constructor(message) {
    super();

    this.setStyles({
      width: "100%",
      display: "flex",
      minHeight: "max(45px, fit-content)",
      justifyContent:
        message.type === "userMessage" ? "flex-end" : "flex-start",
    });

    this.innerHTML = this.renderHTML(template, {
      type: message.type,
      message: message.message,
    });
    if (message.type === "LoadingMessage") this.setLoadingAnimation();
  }

  setLoadingAnimation() {
    this.querySelectorAll(".dot").forEach((dot, index) =>
      dot.animate([{ transform: "translateY(-5px)", opacity: 0.2 }], {
        direction: "alternate",
        delay: index * 200,
        duration: 500,
        iterations: Infinity,
      })
    );
  }
}

chatMessage.tag = tag;

export const getChatMessageStyles = (theme) => ({
  [`${tag} .message`]: {
    width: "fit-content !important",
    height: "fit-content",
    "border-radius": "6px",
    "align-items": "center",
    padding: "15px 15px",
    color: "white",
  },
  [`${tag} > .from-chatbot`]: {
    width: "100%",
    content: "",
    overflow: "hidden",
    position: "relative",
    color: "black",
    "max-width": "75%",
    "z-index": 1,
  },
  [`${tag} .bg-semi-transp`]: {
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
  [`${tag} .loading-api-message`]: {
    position: "relative",
    "z-index": 1,
    overflow: "hidden",
    "align-items": "center",
    display: "flex !important",
    "flex-direction": "row",
    height: "17px",
    width: "40px !important",
    gap: "5px",
  },
  [`${tag} .dot`]: {
    transform: "translateY(2px)",
    "border-radius": "50px",
    height: "10px",
    "background-color": theme.colors.primary,
    "vertical-align": "middle",
    width: "10px",
    display: "inline-block",
  },
});
