import { WebComponent } from "../../../webComponent";
import leaflet from "leaflet";
import { GoogleProvider } from "leaflet-geosearch";
export class Card extends WebComponent {
  map;
  constructor({ type, id, name, address, image_url, country, location, data }) {
    super();
    this.setStyles({
      boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
      transition: "0.3s",
      width: "72%",
      height: "30dvh",
    });
    const mapContainerId = Math.floor(Math.random() * 10000);
    const mapContainer = document.createElement("div");
    mapContainer.id = mapContainerId;
    mapContainer.style.width = "100%";
    mapContainer.style.height = "100%";

    mapContainer.id = `onbotgo-mapContainer-${mapContainerId}`;
    this.appendChild(mapContainer);

    const observer = new MutationObserver(function (
      mutations,
      mutationInstance
    ) {
      const someDiv = document.getElementById(
        `onbotgo-mapContainer-${mapContainerId}`
      );
      console.log("before find div");
      if (someDiv) {
        const provider = new GoogleProvider({
          apiKey: "AIzaSyBCjdZlTczQqOpJw-XVw88hqyVsBfTi7k8",
        });
        console.log("after find div");
        provider.search({ query: address }).then(([searchResults]) => {
          console.log(searchResults);
          this.map = leaflet
            .map(mapContainer)
            .setView(
              [
                searchResults?.y || -12.046064944817124,
                searchResults?.x || -77.04547005862791,
              ],
              17
            );
          leaflet
            .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            })
            .addTo(this.map);
          leaflet
            .marker([
              searchResults?.y || -12.046064944817124,
              searchResults?.x || -77.04547005862791,
            ])
            .addTo(this.map);
        });
        mutationInstance.disconnect();
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  }
}

const tag = "onbotgo-card";
Card.tag = tag;

export const getCardStyles = (theme) => ({
  [`${tag}:hover`]: {
    "box-shadow": "0 8px 16px 0 rgba(0,0,0,0.2)",
  },
});
