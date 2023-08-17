import { theme } from "../../app-state/theme";
import { Box } from "../box/box";
import { WebComponent } from "../webComponent";

const tag = "onbotgo-bubble";

export class BubbleIconToggler extends WebComponent {
  constructor(icon) {
    super();
    this.innerHTML = icon;
    this.innerHTML = this.isIconValid(icon) ? icon : theme.defaultIcon;
  }

  isIconValid(icon) {
    if (!icon) return false;
    const box = new Box();
    box.innerHTML = icon;

    if (
      !["svg", "i", "img"].includes(box.children[0]?.tagName?.toLowerCase())
    ) {
      console.error(`node is not valid.\n allowed nodes: "svg", "i", "img"`);
      return false;
    }
    
    const tagsCounter = {};
    for (let i = 0; i < box.childNodes.length; i++) {
      const tagName = box.childNodes[i]?.tagName?.toLowerCase();
      tagsCounter[tagName] = (tagsCounter[tagName] ?? 0) + 1;

      if (["script"].includes(tagName)) {
        console.error(`Element "<${tagName}>" is not valid.`);
        return false;
      }
    }

    return true;
  }
}

BubbleIconToggler.tag = tag;

export const getBubbleIconTogglerStyles = (theme) => ({
  [tag]: {
    display: "grid",
    "place-items": "center",
    width: "48px",
    height: "48px",
    "background-color": theme.colors.primary,
    fill: "transparent",
    "border-radius": "100px",
    transition: "transform 0.1s linear",
  },

  [`${tag}:hover`]: {
    transform: "scale(1.1)",
  },

  [`${tag} > svg`]: {
    width: "28px",
    height: "28px",
    stroke: "white",
    "stroke-width": "2px",
    "border-image-width": "2",
  },
});
