import WidgetContainer, {
  getWidgetContainerInlineStyle,
} from "./components/widgetContainer";

import {
  BubbleIconToggler,
  getBubbleIconTogglerStyles,
} from "./components/bubble/bubbleIconToggler";
import {
  ChatContainer,
  getChatContainerStyles,
} from "./components/chat/container";
import {
  chatMessage,
  getChatMessageStyles,
} from "./components/chat/chatMessage/chatMessage";
import {
  ChatInput,
  getChatInputStyles,
} from "./components/chat/chatInput/chatInput";
import { Box } from "./components/box/box";
import {
  BtnWhatsapp,
  getBubbleWhatsappIconTogglerStyles,
} from "./components/bubble/btnWhatsapp";

import { appConfig } from "./app-state/config";
import { theme } from "./app-state/theme";
import { addInlineStylesToElement } from "./utils/addInlineStyles";
import { CustomScrollBar } from "./components/scrollbar/customScrollbar";
import { IconButton } from "./components/buttons/icon/icon";
import { Dropdown } from "./components/dropdownMenu/dropdown";
import { FabButton } from "./components/buttons/filled/filledButton";
import { MicRecord } from "./components/chat/record/record";
import { whatsappButtonConfig } from "./app-state/whatsappButton";

import toastifyStyles from "toastify-js/src/toastify.css?inline";

export default class Chatbot {
  constructor({
    chatflow,
    chathubChannelId,
    projectPath,
    botHost,
    ssl,
    theme: customTheme,
    welcomeMessage,
    whatsappButton,
  }) {
    appConfig.chatflowID = chatflow;
    if (projectPath) appConfig.projectPath = projectPath;
    if (botHost) appConfig.botHost = botHost;
    if (ssl) appConfig.ssl = ssl;
    if (welcomeMessage) appConfig.welcomeMessage = welcomeMessage;

    appConfig.chathubChannelId = chathubChannelId;

    if (!customTheme) return;
    const { typography, colors, icon } = customTheme;

    if (typography)
      Object.keys(typography).forEach(
        (typo) => (theme.typography[typo] = typography[typo])
      );

    if (colors)
      Object.keys(colors).forEach(
        (color) => (theme.colors[color] = colors[color])
      );

    if (icon) theme.customIcon = icon;
    if (whatsappButton.active) {
      whatsappButtonConfig.active = true;
      whatsappButtonConfig.number = whatsappButton.number;
      whatsappButtonConfig.position = whatsappButton.position.toLowerCase();
      whatsappButtonConfig.msg = whatsappButton.msg;
    }
  }

  init() {
    this.registerComponents(
      WidgetContainer,
      BubbleIconToggler,
      ChatContainer,
      chatMessage,
      ChatInput,
      Box,
      CustomScrollBar,
      IconButton,
      Dropdown,
      FabButton,
      MicRecord,
      BtnWhatsapp
    );

    const widgetContainer = new WidgetContainer();
    const btnWhatsapp = new BtnWhatsapp();

    addInlineStylesToElement({
      element: widgetContainer,
      styles: [
        getBubbleIconTogglerStyles(theme),
        getChatMessageStyles(theme),
        getChatInputStyles(theme),
        getChatContainerStyles(theme),
        getBubbleWhatsappIconTogglerStyles(whatsappButtonConfig),
        getWidgetContainerInlineStyle(),
      ],
    });
    const styles = document.createElement("style");
    styles.innerHTML = toastifyStyles;
    widgetContainer.prepend(styles);
    document.body.appendChild(widgetContainer);
    document.body.appendChild(btnWhatsapp);
  }

  registerComponents(...classComponents) {
    classComponents.forEach((comp) => customElements.define(comp.tag, comp));
  }
}
