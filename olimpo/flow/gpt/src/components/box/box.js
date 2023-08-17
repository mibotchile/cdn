import { WebComponent } from "../webComponent";

const tag = "onbotgo-box";
export class Box extends WebComponent {
  constructor() {
    super();
    this.setStyles({ display: "inline-block", width: "100%" });
  }
}
Box.tag = tag;
