import { WebComponent } from "../webComponent";

const tag = "onbotgo-dropdown";

export class Dropdown extends WebComponent {
  constructor() {
    super();
    this.setStyles({ position: "relative" });
    const content = this.querySelector(".onbotgo-dropdown-content");

    content.style.display = "none";
    content.style.position = "absolute";
    content.style.backgroundColor = "white";
    content.style.minWidth = "160px";
    content.style.borderRadius = "4px";
    content.style.bottom = "100%";
    content.style.right = "0";
    content.style.boxShadow = "0px 8px 16px 0px rgba(0, 0, 0, 0.2)";
    content.style.padding = "12px 16px";
    content.style.zIndex = "1";

    document.body.onclick = (e) => {
      if (this.contains(e.target)) {
        if (content.contains(e.target)) return;
        return this.toggle();
      }
      content.style.display = "none";
    };
  }
  toggle() {
    const content = this.querySelector(".onbotgo-dropdown-content");
    content.style.display === "block"
      ? (content.style.display = "none")
      : (content.style.display = "block");
  }
}
Dropdown.tag = tag;
