import { WebComponent } from "../webComponent";
import whatsapp from "./../../assets/icons/whatsapp.svg?raw";
import { whatsappButtonConfig } from "../../app-state/whatsappButton";

const tag = "onbotgo-btn-whatsapp";
export class BtnWhatsapp extends WebComponent {
  constructor() {
    super();
    this.innerHTML = this.renderHTML(this.html(), {});
    this.onclick = () => {
      window.open(
        `https://wa.me/${whatsappButtonConfig.number}?text=${whatsappButtonConfig.msg}`
      );
    };
  }

  html() {
    return `<onbotgo-box>${whatsapp}<onbotgo-box>`;
  }
}

BtnWhatsapp.tag = tag;
export const getBubbleWhatsappIconTogglerStyles = (whatsappButtonConfig) => ({
  [tag]: {
    "box-sizing": "border-box",
    position: "absolute",
    "background-color": "#25D366",
    "border-radius": "300px",
    padding: "8px",
    width: "48px",
    display: "flex",
    height: "48px",
    "align-items": "center",
    "justify-content": "center",
    "font-size": "20px",
    color: "white",
    top: whatsappButtonConfig.position.includes("t") ? "20px" : "auto",
    left: whatsappButtonConfig.position.includes("l") ? "20px" : "auto",
    right: whatsappButtonConfig.position.includes("r") ? "20px" : "auto",
    bottom: whatsappButtonConfig.position.includes("b") ? "20px" : "auto",
    transition: "transform .1s linear",
  },
  [`${tag}:hover`]: { transform: "scale(1.1)" },
  [`${tag} > onbotgo-box`]: {
    width: "35px",
    height: "35px",
    display: "grid",
    "font-size": "10px",
    "place-items": "center",
  },
});
