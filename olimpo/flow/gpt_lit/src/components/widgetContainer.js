import { LitElement, html, css } from "lit";

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
      <onbotgo-chat
        style=${`display: ${this.isChatShowing ? "inline-block" : "none"}`}
      ></onbotgo-chat>
      <onbotgo-bubble
        @click=${() => (this.isChatShowing = !this.isChatShowing)}
      ></onbotgo-bubble>
    `;
  }
}

customElements.define("onbotgo-chatwidget", WidgetContainer);
