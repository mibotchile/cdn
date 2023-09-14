import { theme } from "../../../app-state/theme";
import { WebComponent } from "../../webComponent";

const tag = "onbotgo-fabbutton";

export class FabButton extends WebComponent {
  constructor() {
    super();
    this.setStyles({
      display: "inline-block",
      verticalAlign: "middle",
      position: "relative",
      cursor: "pointer",
      borderRadius: "200px",
      padding: "7px",
      color: "white",
    });

    const colorAttr = this.getAttribute("color");
    const size = this.getAttribute("size");

    let color = "black";
    if (colorAttr === "primary") color = theme.colors.primary;
    if (size) this.setStyles({ width: size, height: size });

    this.setStyles({
      backgroundColor: colorAttr ? color : "transparent",
      fill: "white",
    });
  }
}

FabButton.tag = tag;
