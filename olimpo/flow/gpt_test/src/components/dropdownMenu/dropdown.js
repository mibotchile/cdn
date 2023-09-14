import { WebComponent } from "../webComponent";

const tag = "onbotgo-dropdown";

export class Dropdown extends WebComponent {
  constructor() {
    super();
    this.setStyles({ position: "relative" });
    const content = this.querySelector(".onbotgo-dropdown-content");
    const filenames = this.querySelectorAll(".onbotgo-attachedFile-name");

    content.style.display = "none";
    content.style.position = "absolute";
    content.style.backgroundColor = "white";
    content.style.minWidth = "170px";
    content.style.width = "fit-content";
    content.style.borderRadius = "8px";
    content.style.bottom = "100%";
    content.style.left = "50%";
    content.style.transform = "translateX(-50%)";
    content.style.boxShadow = "0px 8px 16px 0px rgba(0, 0, 0, 0.2)";
    content.style.padding = "12px 16px";
    content.style.zIndex = "1";
    content.style.gap = "10px";
    content.style.justifyContent = "space-between";
    content.style.flexDirection = "column";

    filenames.forEach((filename) => {
      filename.style.maxWidth = "180px";
      filename.style.textOverflow = "ellipsis";
      filename.style.overflow = "hidden";
      filename.style.whiteSpace = "nowrap";
      filename.style.minWidth = "170px";
    });

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
    content.style.display === "flex"
      ? (content.style.display = "none")
      : (content.style.display = "flex");
  }
}
Dropdown.tag = tag;
