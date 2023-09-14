import { WebComponent } from "../../webComponent";
import { Box } from "../../box/box";
import { theme } from "../../../app-state/theme";
import template from "./template.html?raw";
import sendIcon from "./../../../assets/icons/send.svg?raw";

const tag = "onbotgo-chatinput";

export class ChatInput extends WebComponent {
  defaultStyles = {
    height: "50px",
    display: "grid",
    gridTemplateColumns: "10fr 1fr",
    alignItems: "center",
    boxShadow: "0 2px 6px -1px rgba(0,0,0,.1)",
  };
  input;

  constructor() {
    super();

    this.innerHTML = this.renderHTML(template, { sendIcon: sendIcon });
    this.input = this.querySelector("input");
    this.sendIcon = this.querySelector(Box.tag);

    this.input.style.fontFamily = theme.typography.primary;
    this.setStyles(this.defaultStyles);
  }

  onSubmit(callback) {
    this.sendIcon.onclick = () => callback(this.input.value);
    this.input.onkeydown = (e) => {
      if (!["13", "Enter"].includes(e.key)) return;
      callback(this.input.value);
      this.input.value = "";
    };
  }
}

ChatInput.tag = tag;

export const getChatInputStyles = (theme) => ({
  [`${tag} > input`]: {
    "border-radius": "6px",
    outline: "none",
    border: "none",
    height: "100%",
    padding: "0 10px",
  },
  [`${tag} svg`]: {
    cursor: "pointer",
    fill: theme.colors.primary,
  },
});
