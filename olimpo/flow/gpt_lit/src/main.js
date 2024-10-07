import { appConfig } from "./app-config/setup.js";
import { theme } from "./app-config/theme.js";
import { whatsappButtonConfig } from "./app-config/whatsappButton.js";

//COMPONENTS
import "./components/bubble/bubble.js";
import "./components/widgetContainer.js";
import "./components/bubble/whatsapp.js";
import "./components/chat/container/container.js";
import "./components/chat/chatInput/chatInput.js";
import "./components/chat/attachFile/attachFile.js";
import "./components/chat/chatMessage/chatMessage.js";
import "./components/shared/box/box.js";
import "./components/shared/buttons/icon/iconButton.js";
import "./components/shared/buttons/fab/raisedButton.js";
import "./components/shared/spinner/spinner.js";
import "./components/shared/dropdown/dropdown.js";
import "./components/shared/dropdown/dropdownContent.js";

import toastifyStyles from "toastify-js/src/toastify.css?inline";

export default class Chatbot {
  constructor({
    chatflow,
    chathubChannelId,
    theme: customTheme,
    welcomeMessage,
    projectPath,
    ssl,
    whatsappButton,
    googleApikey,
  }) {
    let root = document.querySelector(":root");

    appConfig.chatflowID = chatflow;
    appConfig.chathubChannelId = chathubChannelId;
    if (projectPath) appConfig.projectPath = projectPath;
    if (welcomeMessage) appConfig.welcomeMessage = welcomeMessage;
    if (ssl) appConfig.ssl = ssl;
    if (welcomeMessage) appConfig.welcomeMessage = welcomeMessage;
    if (googleApikey) appConfig.googleApikey = googleApikey;
    if (!customTheme) return;
    const { typography, colors, icon } = customTheme;
    if (whatsappButton?.active) {
      whatsappButtonConfig.active = true;
      whatsappButtonConfig.number = whatsappButton.number;
      whatsappButtonConfig.position = whatsappButton.position.toLowerCase();
      whatsappButtonConfig.message = whatsappButton.message;
    }

    if (typography)
      Object.keys(typography).forEach(
        (typo) => (theme.typography[typo] = typography[typo])
      );

    if (colors)
      Object.keys(colors).forEach((color) => {
        root.style.setProperty(`--onbotgo-color-${color}`, colors[color]);
        theme.colors[color] = colors[color];
      });

    if (icon) theme.icon = icon;
  }

  init() {
    const widget = document.createElement("onbotgo-chatwidget");

    let whatsappButton;
    if (whatsappButtonConfig.active) {
      whatsappButton = document.createElement("onbotgo-whatsappbubble");
      if (whatsappButtonConfig.position.includes("t"))
        whatsappButton.style.top = "min(2%, 2dvh)";
      if (whatsappButtonConfig.position.includes("l"))
        whatsappButton.style.left = "min(2%, 2dvh)";
      if (whatsappButtonConfig.position.includes("r"))
        whatsappButton.style.right = "min(2%, 2dvh)";
      if (whatsappButtonConfig.position.includes("b"))
        whatsappButton.style.bottom = "min(2%, 2dvh)";
      whatsappButton.onclick = () => {
        window.open(
          `https://wa.me/${whatsappButtonConfig.number}?text=${whatsappButtonConfig.message}`
        );
      };
    }

    const styles = document.createElement("style");
    styles.innerHTML = toastifyStyles;
    widget.prepend(styles);
    document.body.appendChild(widget);
    document.body.appendChild(whatsappButton);
  }
}
