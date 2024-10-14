import { LitElement, html, css } from "lit";
import { whatsappButtonConfig } from "../app-config/whatsappButton";
import "leaflet/dist/leaflet.css";

export class WidgetContainer extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      position: fixed;
      bottom: 20px;
      right: 20px;
    }
    :host *,
    ::before,
    ::after {
      box-sizing: content-box !important;
    }
  `;
  static properties = {
    isChatShowing: { type: Boolean },
  };
  constructor() {
    super();
    this.isChatShowing = true;
  }

  render() {
    return html`
      <div style="height:100%">
        <onbotgo-chat
          style=${`display: ${
            this.isChatShowing ? "flex !important;" : "none;"
          }margin-bottom: ${
            whatsappButtonConfig.active &&
            whatsappButtonConfig.position === "br" &&
            "calc(4dvh + 20px)"
          };`}
        ></onbotgo-chat>
        <onbotgo-bubble
          style=${`margin-bottom: ${
            whatsappButtonConfig.active &&
            whatsappButtonConfig.position === "br" &&
            "calc(4dvh + 20px)"
          };`}
          @click=${() => (this.isChatShowing = !this.isChatShowing)}
        ></onbotgo-bubble>
      </div>
    `;
  }
}

customElements.define("onbotgo-chatwidget", WidgetContainer);
