import { LitElement, html, css } from "lit";
import { theme } from "../../app-config/theme";
import { parseStringToHtml } from "../../utils/functions/parseStringToHtml";

const tag = `onbotgo-whatsappbubble`;

export class WhatsappBubble extends LitElement {
  static styles = css`
    :host {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      background-color: #25d366;
      fill: transparent;
      border-radius: 100px;
      transition: transform 0.1s linear;
      cursor: pointer;
      position: fixed;
    }

    svg {
      width: 28px;
      height: 28px;
      stroke: white;
      stroke-width: 2px;
      border-image-width: 2;
    }
  `;

  render() {
    return html`${parseStringToHtml(theme.icon)}`;
  }
}

customElements.define(tag, WhatsappBubble);
