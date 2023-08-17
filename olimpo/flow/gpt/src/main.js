import WidgetContainer from "./components/widgetContainer";

import {
  BubbleIconToggler,
  getBubbleIconTogglerStyles,
} from "./components/bubble/bubbleIconToggler";
import {
  ChatContainer,
  getChatContainerStyles,
} from "./components/chat/chatContainer";
import {
  chatMessage,
  getChatMessageStyles,
} from "./components/chat/chatMessage";
import { ChatInput, getChatInputStyles } from "./components/chat/chatInput";
import { Box } from "./components/box/box";

import { appConfig } from "./app-state/config";
import { theme } from "./app-state/theme";
import { addInlineStylesToElement } from "./utils/addInlineStyles";
import { CustomScrollBar } from "./components/scrollbar/customScrollbar";

export default class Chatbot {
  constructor({ chatflow, theme: customTheme }) {
    appConfig.chatflowID = chatflow;

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
    
    if(icon)
    theme.customIcon = icon
  }

  init() {
    this.registerComponents(
      WidgetContainer,
      BubbleIconToggler,
      ChatContainer,
      chatMessage,
      ChatInput,
      Box,
      CustomScrollBar
    );

    const widgetContainer = new WidgetContainer();

    addInlineStylesToElement({
      element: widgetContainer,
      styles: [
        getBubbleIconTogglerStyles(theme),
        getChatMessageStyles(theme),
        getChatInputStyles(theme),
        getChatContainerStyles(),
      ],
    });

    document.body.appendChild(widgetContainer);
  }

  registerComponents(...classComponents) {
    classComponents.forEach((comp) => customElements.define(comp.tag, comp));
  }
}
