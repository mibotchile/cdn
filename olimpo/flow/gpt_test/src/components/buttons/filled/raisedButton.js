import { appConfig } from "../../../app-state/config";
import { theme } from "../../../app-state/theme";
import { Box } from "../../box/box";
import { WebComponent } from "../../webComponent";

export class RaisedButton extends WebComponent {
  constructor(messageData) {
    super();
    this.setStyles({
      display: "inline-block",
      boxSizing: "border-box",
      width: "100%",
      textAlign: "center",
      position: "relative",
      fontFamily: theme.typography.primary,
      overflow: "hidden",
      fontSize: "14px",
      color: "white",
      padding: "8px 0",
      zIndex: 2,
      borderRadius: "6px",
      marginTop: "16px",
    });
    this.classList.add("addressActionButton");
    const backgroundButton = new Box();
    backgroundButton.classList.add("bg-semi-transp");
    this.innerText = appConfig.callbacks.addressButton.text;
    this.appendChild(backgroundButton);
    if (appConfig.callbacks?.addressButton?.action)
      this.onclick = (e) =>
        appConfig.callbacks.addressButton.action(messageData, e);
  }
}

const tag = "onbotgo-raisedbutton";
RaisedButton.tag = tag;
export const getRaisedButtonStyles = (theme) => ({
  [`${tag} .bg-semi-transp`]: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: "1",
    top: 0,
    "z-index": "-1",
    left: 0,
    "background-color": theme.colors.primary,
  },
  [`${tag}:hover .bg-semi-transp`]: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: ".9",
    top: 0,
    "z-index": "-1",
    left: 0,
    "background-color": theme.colors.primary,
  },
});
