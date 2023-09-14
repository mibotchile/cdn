import { theme } from "../../app-state/theme";
import { WebComponent } from "../webComponent";

const tag = "onbotgo-box";
export class Box extends WebComponent {
  constructor() {
    super();
    this.setStyles({
      fontFamily: theme.typography.primary,
    });
  }
}
Box.tag = tag;
