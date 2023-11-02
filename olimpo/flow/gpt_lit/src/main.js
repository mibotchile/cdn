import { appConfig } from "./app-config/setup.js";
import { theme } from "./app-config/theme.js";

//COMPONENTS
import "./components/bubble/bubble.js";
import "./components/widgetContainer.js";
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
  }) {
    let root = document.querySelector(":root");

    appConfig.chatflowID = chatflow;
    appConfig.chathubChannelId = chathubChannelId;
    if (projectPath) appConfig.projectPath = projectPath;
    if (welcomeMessage) appConfig.welcomeMessage = welcomeMessage;

    if (welcomeMessage) appConfig.welcomeMessage = welcomeMessage;

    if (!customTheme) return;
    const { typography, colors, icon } = customTheme;

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
    const styles = document.createElement("style");
    styles.innerHTML = toastifyStyles;
    widget.prepend(styles);
    document.body.appendChild(widget);
  }
}
