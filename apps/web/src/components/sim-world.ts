import { startParty } from "../p2p";
import { useShadow } from "../utils/use-shadow";
import { SCALE_FACTOR } from "./shared/constant";
import template from "./sim-world.html?raw";

export interface Interactable {
  start: (options: { other: HTMLElement; prompt: string }) => Promise<void>;
  stop: () => void;
}

export const conn = startParty();

export class SimWorld extends HTMLElement {
  shadowRoot = useShadow(this, template);
  simBox = this.shadowRoot.querySelector<HTMLElement>(".sim-box")!;

  connectedCallback() {
    this.simBox.style.setProperty("--width", `${Number(this.getAttribute("width")) * SCALE_FACTOR}px`);
    this.simBox.style.setProperty("--height", `${Number(this.getAttribute("height")) * SCALE_FACTOR}px`);

    let lastWorldState = "";

    const observer = new MutationObserver(() => {
      if (lastWorldState === this.outerHTML) return;
      lastWorldState = this.outerHTML;
      const player = document.querySelector("sim-player") as HTMLElement;
      const x = Number(player.getAttribute("x"));
      const y = Number(player.getAttribute("y"));
      conn.send(JSON.stringify({ type: "coord", x, y }));
      this.dispatchEvent(new Event("worldchanged"));
    });
    observer.observe(this, { subtree: true, attributes: true, childList: true });

    conn.addEventListener("message", (event) => {
      // message format: <uuid>: <json-string>
      try {
        const jsonString = event.data.slice(event.data.indexOf(":") + 1).trim();
        console.log("will parse", jsonString);
        const { type, x, y } = JSON.parse(jsonString);
        if (type === "coord") {
          const npc = document.querySelector("sim-npc") as HTMLElement;
          npc.setAttribute("x", x);
          npc.setAttribute("y", y);
        }
      } catch (e) {
        // noop
      }
    });
  }

  getNearestObjects(
    self: HTMLElement,
    options?: {
      maxGridDistance?: number;
    }
  ) {
    const [selfX, selfY] = [Number(self.getAttribute("x")), Number(self.getAttribute("y"))];
    const otherObjects = ([...this.children] as HTMLElement[])
      .filter((child) => child !== self)
      .filter((child) => child.hasAttribute("x") && child.hasAttribute("y") && child.hasAttribute("name"));
    const positionedObjects = otherObjects.map((child) => {
      const [x, y] = [Number(child.getAttribute("x")), Number(child.getAttribute("y"))];
      return { x, y, child };
    });

    const maxGridDistance = options?.maxGridDistance ?? Infinity;

    const objectsWithGridDistance = positionedObjects
      .map((object) => {
        const xDistance = object.x - selfX;
        const yDistance = object.y - selfY;
        const gridDistance = Math.abs(xDistance) + Math.abs(yDistance);
        return { ...object, gridDistance };
      })
      .filter((object) => object.gridDistance <= maxGridDistance)
      .sort((a, b) => a.gridDistance - b.gridDistance); // from closest to farthest

    return objectsWithGridDistance.slice(0, 1).map((object) => object.child as HTMLElement & Interactable);
  }
}

export function defineSimWorld() {
  if (!customElements.get("sim-world")) {
    customElements.define("sim-world", SimWorld);
  }
}
