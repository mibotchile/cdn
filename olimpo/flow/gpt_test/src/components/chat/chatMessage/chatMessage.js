import { WebComponent } from "../../webComponent";
import template from "./template.html?raw";
import WaveSurfer from "wavesurfer.js";
import iconPlay from "./../../../assets/icons/play.svg?raw";
import IconPause from "./../../../assets/icons/pause.svg?raw";
import { Box } from "./../../box/box";
import robotImage from "./../../../assets/images/robot.png";
import agentImage from "./../../../assets/images/agent.png";
import userImage from "./../../../assets/images/user.png";
import { theme } from "../../../app-state/theme";

const tag = "onbotgo-chatmessage";
export class chatMessage extends WebComponent {
  wavesurfer;
  message;

  constructor(message, isAgent = false) {
    super();
    this.message = message;
    this.setStyles({
      width: "100%",
      display: "flex",
      minHeight: "max(45px, fit-content)",
      justifyContent:
        message.type === "userMessage" ? "flex-end" : "flex-start",
      alignItems: "center",
    });
    this.innerHTML = this.renderHTML(template, {
      type: message.type,
      fileType: message.fileType,
      file: message.file,
      message: message.message,
      iconPlayPause: iconPlay,
      isPlaying: false,
    })
      .replaceAll("\n", " ")
      .replace(/\n/g, " ");
    if (message.fileType === "audio") {
      let url;
      if (typeof message.file === "string") url = message.file;
      else url = URL.createObjectURL(message.file);
      this.wavesurfer = WaveSurfer.create({
        barHeight: 12,
        height: 24,
        barWidth: 1,
        container: this.querySelector("#waveform"),
        waveColor: "rgba(255, 255, 255, 0.6)",
        progressColor: "white",
        url,
      });

      this.handlePlayPause();
    } else if (message.fileType === "image") {
      const image = document.createElement("img");
      let src =
        typeof message.file === "string"
          ? message.file
          : URL.createObjectURL(message.file);
      image.src = src;
      image.style.objectFit = "cover";
      image.style.minHeight = "100px";
      image.style.minWidth = "100px";
      image.style.maxHeight = "80%";
      image.style.maxWidth = "80%";
      this.querySelector(".onbotgo-message").appendChild(image);
    } else if (!message.fileType && message.type === "userMessage") {
      const messageContainer = this.querySelector(".onbotgo-message");
      this.appendChild(this.getAvatarMessage("userMessage"));
      messageContainer.innerText += message.message;
    } else if (!message.fileType && message.type === "apiMessage") {
      const messageContainer = this.querySelector(".onbotgo-message");
      this.insertBefore(
        this.getAvatarMessage("apiMessage", isAgent),
        messageContainer
      );
      messageContainer.innerHTML += message.message;
    }
    if (message.type === "LoadingMessage") this.setLoadingAnimation();
  }

  handlePlayPause() {
    this.querySelector("#onbotgo-playAudioMessage").onclick = () => {
      this.wavesurfer.play();
    };

    this.wavesurfer.on("play", () => {
      this.querySelector("#onbotgo-playAudioMessage").onclick = () => {
        this.wavesurfer.pause();
      };
      this.querySelector("#onbotgo-playAudioMessage").innerHTML = IconPause;
    });
    this.wavesurfer.on("pause", () => {
      this.querySelector("#onbotgo-playAudioMessage").onclick = () => {
        this.wavesurfer.play();
      };
      this.querySelector("#onbotgo-playAudioMessage").innerHTML = iconPlay;
    });
  }

  setLoadingAnimation() {
    this.querySelectorAll(".dot").forEach((dot, index) =>
      dot.animate([{ transform: "translateY(-5px)", opacity: 0.2 }], {
        direction: "alternate",
        delay: index * 200,
        duration: 500,
        iterations: Infinity,
      })
    );
  }

  getAvatarMessage(from = "api", isAgent = false) {
    const box = new Box();
    let image;
    if (from === "apiMessage" && !isAgent) image = robotImage;
    else if (from === "userMessage") image = userImage;
    else if (isAgent) image = agentImage;
    box.innerHTML = `<img src=${image} width="${25}" height="${25}" />`;
    box.setStyles({
      padding: "5px",
      marginRight: "10px",
      backgroundColor: theme.colors.primary,
      borderRadius: "100px",
      width: "35px !important",
      height: "25px",
      display: "grid",
      placeItems: "center",
    });
    return box;
  }
}

chatMessage.tag = tag;

export const getChatMessageStyles = (theme) => ({
  [`${tag} .onbotgo-message`]: {
    width: "fit-content !important",
    height: "fit-content",
    "border-radius": "6px",
    "align-items": "center",
    padding: "15px 15px",
    color: "white",
    "font-size": "14px",
  },
  [`${tag} > .from-chatbot`]: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
    color: "black",
    "max-width": "65%",
    "z-index": 1,
  },
  [`${tag} .bg-semi-transp`]: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: ".1",
    top: 0,
    "z-index": "-1",
    left: 0,
    "background-color": theme.colors.primary,
  },
  [`${tag} > .from-user`]: {
    "margin-right": "15px",
    "max-width": "65%",
    "background-color": theme.colors.primary,
  },
  [`${tag} .loading-api-message`]: {
    position: "relative",
    "z-index": 1,
    overflow: "hidden",
    "align-items": "center",
    display: "flex !important",
    "flex-direction": "row",
    height: "17px",
    width: "40px !important",
    gap: "5px",
  },
  [`${tag} .dot`]: {
    transform: "translateY(2px)",
    "border-radius": "50px",
    height: "10px",
    "background-color": theme.colors.primary,
    "vertical-align": "middle",
    width: "10px !important",
    display: "inline-block",
  },
});
