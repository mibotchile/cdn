import { WebComponent } from "../../webComponent";
import template from "./template.html?raw";
import playIcon from "./../../../assets/icons/play.svg?raw";
import stopIcon from "./../../../assets/icons/stop.svg?raw";
import trashIcon from "./../../../assets/icons/trashIcon.svg?raw";
import Wavesurfer from "wavesurfer.js";
import recordPlugin from "wavesurfer.js/dist/plugins/record.esm";
import { theme } from "./../../../app-state/theme";

const tag = "onbotgo-micrecord";

export class MicRecord extends WebComponent {
  isRecording = false;
  defaultStyles = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "calc(100% - 34px)",
    padding: "10px 0",
    maxWidth: "100%",
    background: "transparent",
    gap: "10px",
    height: "51px",
  };
  wavesurfer;
  recorder;

  constructor() {
    super();
    this.render();
    this.hideMic();
    this.initMic();
    this.getChild("#onbootgo-delete-record").onclick = () => {
      let event = new Event("onbotgo-delete-record");
      document.querySelector("onbotgo-chatcontainer").dispatchEvent(event);
    };
    this.recorder?.on("record-end", (blob) => {
      let event = new CustomEvent("onbotgo-stop-record", { detail: blob });
      document.querySelector("onbotgo-chatcontainer").dispatchEvent(event);
    });
  }

  render() {
    this.innerHTML = this.renderHTML(template, {
      isRecording: this.isRecording,
      playIcon,
      stopIcon,
      trashIcon,
    });
    this.getChild("#onbotgo-btn-play").onclick = () => {
      this.isRecording = true;
      this.displayMic();
      this.startRecording();
    };
    this.getChild("#onbotgo-btn-stop").onclick = () => {
      this.isRecording = false;
      this.hideMic();
      this.stopRecording();
    };
  }
  initMic() {
    this.wavesurfer = Wavesurfer.create({
      container: this.getChild("#onbotgo-mic-record"),
      waveColor: "lightgray",
      barWidth: 1,
      barHeight: 1,
      fillParent: true,
    });
    this.recorder = this.wavesurfer.registerPlugin(recordPlugin.create());
  }

  startRecording() {
    if (!this.recorder.isRecording()) {
      this.recorder.startRecording();
    }
  }
  stopRecording() {
    if (this.recorder.isRecording()) {
      this.recorder.stopRecording();
    }
  }

  displayMic() {
    const micFeat2 = this.getChild("#onbotgo-mic-record");
    this.getChild("#onbotgo-btn-stop").style.display = "grid";
    [micFeat2].forEach((elem) => {
      elem.style.display = "inline-block";
    });
    const emptyWaveForm = this.getChild("#onbotgo-empty-waveform");
    const btnPlay = this.getChild("#onbotgo-btn-play");
    [btnPlay, emptyWaveForm].forEach((elem) => {
      elem.style.display = "none";
    });
  }

  hideMic() {
    const micFeat2 = this.getChild("#onbotgo-mic-record");
    const btnStop = this.getChild("#onbotgo-btn-stop");
    [micFeat2, btnStop].forEach((elem) => {
      elem.style.display = "none";
    });

    const emptyWaveForm = this.getChild("#onbotgo-empty-waveform");
    this.getChild("#onbotgo-btn-play").style.display = "grid";
    [emptyWaveForm].forEach((elem) => {
      elem.style.display = "inline-block";
    });
  }
}
MicRecord.tag = tag;
