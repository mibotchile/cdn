import { render } from "squirrelly";

export class WebComponent extends HTMLElement {
  setStyles(styles) {
    const stylesProps = Object.keys(styles);
    stylesProps.forEach((prop) => {
      this.style[prop] = styles[prop];
    });
  }
  renderHTML(html, config = {}) {
    return render(html, { ...config });
  }
  getChild(selector) {
    return this.querySelector(selector);
  }
}
