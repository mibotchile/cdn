import { theme } from "../../../app-state/theme";
import { Box } from "../../box/box";
import { WebComponent } from "../../webComponent";

const tag = "onbotgo-iconbutton";

export class IconButton extends WebComponent {
  constructor() {
    super();
    this.setStyles({
      display: "grid",
      placeItems: "center",
      verticalAlign: "middle",
      position: "relative",
      cursor: "pointer",
      borderRadius: "200px",
      padding: "7px",
    });

    const colorAttr = this.getAttribute("color");
    const size = this.getAttribute("size");

    let color = "black";
    if (colorAttr === "primary") color = theme.colors.primary;
    if (size) this.setStyles({ width: size, height: size });

    this.setStyles({ color });
    const backgroundColor = new Box();
    backgroundColor.setStyles({
      backgroundColor: color,
      opacity: 0.2,
      position: "absolute",
      width: "100%",
      borderRadius: "200px",
      height: "100%",
      zIndex: 0,
    });
    this.appendChild(backgroundColor);
  }
}

export const getIconButtonStyles = () => ({
  [`${tag}.hidden`]: {
    visibility: "hidden",
  },
});

IconButton.tag = tag;
