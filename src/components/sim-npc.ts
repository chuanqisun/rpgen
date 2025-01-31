import { useShadow } from "../utils/use-shadow";
import { SCALE_FACTOR } from "./shared/constant";
import template from "./sim-npc.html?raw";

export class SimNpc extends HTMLElement {
  static observedAttributes = ["x", "y"];

  shadowRoot = useShadow(this, template);
  container = this.shadowRoot.querySelector(".container") as HTMLImageElement;

  attributeChangedCallback(name: string, _oldValue: any, newValue: any) {
    switch (name) {
      case "x": {
        this.container.style.setProperty("--x", `${Number(newValue) * SCALE_FACTOR}px`);
        break;
      }
      case "y": {
        this.container.style.setProperty("--y", `${Number(newValue) * SCALE_FACTOR}px`);
        break;
      }
    }
  }
}

export function defineSimNpc() {
  if (customElements.get("sim-npc")) return;
  customElements.define("sim-npc", SimNpc);
}
