import { WebComponent } from "../webComponent";
import { Box } from "../box/box";

const tag = "onbotgo-chatinput";
export class ChatInput extends WebComponent {
  defaultStyles = {
    height: "8%",
    width: "100%",
    display: "grid",
    gridTemplateColumns: "10fr 1fr",
    alignItems: "center",
    boxShadow: "0 2px 6px -1px rgba(0,0,0,.1)",
  };

  input = document.createElement("input");
  sendIcon = new Box();

  constructor() {
    super();
    this.setStyles(this.defaultStyles);
    this.input;
    this.input.style.maxWidth = "calc(100vw - 129px - 0px)";
    this.input.type = "text";
    this.input.placeholder = "Escribe un mensaje";

    this.sendIcon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="19px" class="send-icon flex " ><path d="M476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0027.14 52 24.65 24.65 0 0016 72.59v113.29a24 24 0 0019.52 23.57l232.93 43.07a4 4 0 010 7.86L35.53 303.45A24 24 0 0016 327v113.31A23.57 23.57 0 0026.59 460a23.94 23.94 0 0013.22 4 24.55 24.55 0 009.52-1.93L476.4 285.94l.19-.09a32 32 0 000-58.8z"></path></svg>';
    this.appendChild(this.input);
    this.appendChild(this.sendIcon);
  }
  onSubmit(callback) {
    this.sendIcon.onclick = (e) => callback(this.input.value);
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
