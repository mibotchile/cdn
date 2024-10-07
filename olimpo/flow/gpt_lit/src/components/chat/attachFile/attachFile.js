import { html, LitElement, css } from "lit";
import { parseStringToHtml } from "../../../utils/functions/parseStringToHtml";
import paperclipIcon from "../../../assets/icons/paperclip.svg?raw";
import TrashIcon from "../../../assets/icons/trashIcon.svg?raw";
import PlusIcon from "../../../assets/icons/plus.svg?raw";

const tag = `onbotgo-attachfile`;

export class AttachFile extends LitElement {
  static properties = {
    attachedFiles: { type: Array },
    uploadFileHandler: { type: Function },
    isUploadingFile: { type: Boolean },
    isDropdownShowing: { type: Boolean },
  };
  constructor() {
    super();
    this.attachedFiles = [];
  }
  static styles = css`
    :host onbotgo-dropdown {
      display: flex;
      align-items: center;
    }
    .onbotgo-attachedFiles-counter {
      position: absolute;
      top: -3px;
      right: -3px;
      border-radius: 100px;
      z-index: 1;
      background-color: rgb(255, 43, 43);
      color: white;
      font-size: 12px;
      width: 16px;
      height: 16px;
      display: grid;
      place-items: center;
      opacity: 1;
    }
    .onbotgo-attachedFile {
      display: flex !important;
      justify-content: space-between;
      gap: 14px;
      margin: 8px 4px;
    }
    .onbotgo-attachedFile-name {
    }
  `;
  toggleDropdown() {
    this.isDropdownShowing = !this.isDropdownShowing;
  }
  get buttonWithFilesCounter() {
    return html`<onbotgo-iconbutton
      color="primary"
      size="medium"
      id="btnOnbotgoAttachInputMenu"
      @click=${this.toggleDropdown}
    >
      ${parseStringToHtml(paperclipIcon)}
      <onbotgo-box class="onbotgo-attachedFiles-counter"
        >${this.attachedFiles.length}
      </onbotgo-box>
    </onbotgo-iconbutton>`;
  }
  get buttonWithoutFilesCounter() {
    return html`<onbotgo-iconbutton
      id="btnOnbotgoAttachInput"
      color="primary"
      size="medium"
      @click=${() => this.renderRoot.querySelector("input").click()}
    >
      ${parseStringToHtml(paperclipIcon)}
    </onbotgo-iconbutton>`;
  }

  get spinner() {
    return html`<onbotgo-iconbutton
      id="btnOnbotgoAttachInput"
      color="primary"
      size="medium"
      ><onbotgo-spinner></onbotgo-spinner
    ></onbotgo-iconbutton>`;
  }

  render() {
    let buttonTemplate;
    if (this.isUploadingFile) buttonTemplate = this.spinner;
    else if (this.attachedFiles.length)
      buttonTemplate = this.buttonWithFilesCounter;
    else buttonTemplate = this.buttonWithoutFilesCounter;

    return html`<onbotgo-dropdown>
      <input
        id="onbotgoAttachFileInput"
        @change=${this.uploadFileHandler}
        type="file"
        style="display: none"
      />
      ${buttonTemplate}
      ${this.isDropdownShowing && this.attachedFiles.length
        ? html`<onbotgo-dropdowncontent>
        ${this.attachedFiles.map((file) => {
          return html`<onbotgo-box class="onbotgo-attachedFile">
            <span class="onbotgo-attachedFile-name">${file.name}</span>
            <i style="width: 19px !important; color: red; cursor: pointer">
              ${parseStringToHtml(TrashIcon)}
            </i>
          </onbotgo-box>`;
        })}
        <onbotgo-box
          style="margin-top: 4px; display: flex !important; justify-content: center"
        >
          <onbotgo-fab
            id="onbotgo-btnattachNewFile"
            size="medium"
            color="primary"
            @click=${() => this.renderRoot.querySelector("input").click()}
          >
            ${parseStringToHtml(PlusIcon)}
          </onbotgo-fab>
        </onbotgo-box>
      </onbotgo-dropdowncontent>
    </onbotgo-dropdown>`
        : ""}
    </onbotgo-dropdown> `;
  }
}
customElements.define(tag, AttachFile);
