import { html, LitElement, css } from "lit";
import { appConfig } from "../../../../app-config/setup";
import { GoogleProvider } from "leaflet-geosearch";
import { map as createMap, tileLayer, marker } from "leaflet";
import { parseStringToHtml } from "../../../../utils/functions/parseStringToHtml";

const tag = `onbotgo-interactivemap`;

export class InteractiveMapFile extends LitElement {
  static properties = {
    cardInfo: { type: Object },
    template: { type: LitElement },
    isSearching: { type: Boolean },
  };
  constructor() {
    super();
    this.isSearching = false;
  }
  get mapActionButton() {
    return html`<onbotgo-raisedbutton
      @click=${appConfig.callbacks?.addressButton?.action &&
      ((e) => appConfig.callbacks.addressButton.action(this.cardInfo, e))}
      >${appConfig.callbacks.addressButton.text}</onbotgo-raisedbutton
    >`;
  }

  get backgroundMap() {
    return html`<onbotgo-box class="background-map-container"
      ><onbotgo-box class="bg-semi-transp"></onbotgo-box>
      <p>Proyecto: ${this.cardInfo.name}</p>
      <p>Precio: ${this.cardInfo.data.precio}</p>
      <p>Dirección: ${this.cardInfo.address || ""} ${this.cardInfo.location}</p>
      <p>Cuartos: ${this.cardInfo.data.cantidad_total_de_unidades || "--"}</p>
      ${appConfig.callbacks.addressButton && this.mapActionButton}
    </onbotgo-box>`;
  }
  async modalMap() {
    const mapContainer = parseStringToHtml(`<onbotgo-box
     style="height:250px; width: 285px;display: inline-block"
    ></onbotgo-box>`)[0];
    const provider = new GoogleProvider({
      apiKey: appConfig.googleApikey,
    });
    this.isSearching = true;
    provider
      .search({
        query: ` ${this.cardInfo.location || ""} ${
          this.cardInfo.address || ""
        }`,
      })
      .then(async ([searchResults]) => {
        const map = createMap(mapContainer).setView(
          [
            searchResults?.y || -12.046064944817124,
            searchResults?.x || -77.04547005862791,
          ],
          17
        );

        tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        marker([
          searchResults?.y || -12.046064944817124,
          searchResults?.x || -77.04547005862791,
        ]).addTo(map);
        if (
          ["function"].includes(
            typeof appConfig.callbacks?.addressButton?.action
          ) ||
          appConfig.callbacks?.addressButton?.action instanceof Promise
        )
          this.template = html` <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/gh/mibotchile/cdn@v0.7.19/olimpo/flow/gpt_lit/dist/style.css"
            /><onbotgo-box
              >${mapContainer} ${this.mapActionButton}</onbotgo-box
            >`;
        await this.updateComplete.then(() => map.invalidateSize());
      })
      .catch((err) => console.log(err));
  }

  render() {
    switch (this.cardInfo.render_map) {
      case "backgroud":
        return this.backgroundMap;
      case "modal":
        if (!this.isSearching) this.modalMap();
        return this.template || "cargando mapa...";
    }
  }

  static styles = css`
    :host {
      position: relative;
      width: 75%;
    }
    .bg-semi-transp {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.1;
      top: 0;
      z-index: -1;
      left: 0;
      background-color: var(--onbotgo-color-primary);
    }
    .background-map-container {
      padding: 15px;
      width: fit-content;
      height: fit-content;
      display: flex;
      flex-direction: column;
      border-radius: 6px;
      align-items: start;
      padding: 15px 15px;
      color: black;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }
    .background-map-container > p {
      margin: 5px 0;
    }
  `;
}
customElements.define(tag, InteractiveMapFile);
