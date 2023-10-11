import { theme } from "../app-state/theme";
import { BubbleIconToggler } from "./bubble/bubbleIconToggler";
import { ChatContainer } from "./chat/container";

import { WebComponent } from "./webComponent";
const tag = "onbotgo-chatbot";
class widgetContainer extends WebComponent {
  componentStyles = {
    display: "inline-block",
    position: "fixed",
    bottom: "20px",
    right: "20px",
  };

  constructor() {
    super();
    const chatIconToggler = new BubbleIconToggler(theme.customIcon);
    const chatContainer = new ChatContainer();

    chatIconToggler.onclick = () => chatContainer.toggle();

    this.appendChild(chatIconToggler);
    this.appendChild(chatContainer);

    this.setStyles(this.componentStyles);
  }
}

widgetContainer.tag = tag;

export const getWidgetContainerInlineStyle = () => ({
  [`${tag} *, ::before, ::after`]: {
    "box-sizing": "content-box !important",
  },
});
export default widgetContainer;
