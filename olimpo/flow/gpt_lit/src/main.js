import { appSetupConfig } from "./app-config/setup.js";
import { theme } from "./app-config/theme.js";

//COMPONENTS
import "./components/bubble/bubble.js";
import "./components/widgetContainer.js";
import "./components/chat/container.js";
import "./components/chat/chatInput/chatInput.js";
import "./components/shared/box/box.js";
import "./components/shared/buttons/icon/iconButton.js";

export default class Chatbot {
  constructor({
    chatflow,
    chathubChannelId,
    theme: customTheme,
    welcomeMessage,
  }) {
    let root = document.querySelector(":root");

    appSetupConfig.chatflowID = chatflow;
    appSetupConfig.chathubChannelId = chathubChannelId;

    if (welcomeMessage) appSetupConfig.welcomeMessage = welcomeMessage;

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
    document.body.appendChild(widget);
  }
}
