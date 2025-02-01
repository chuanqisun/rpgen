import { startParty } from "../p2p";
import { useShadow } from "../utils/use-shadow";
import { SCALE_FACTOR } from "./shared/constant";
import template from "./sim-world.html?raw";

export interface Interactable {
  start: (options: { other: HTMLElement; prompt: string }) => Promise<void>;
  stop: () => void;
}

export class SimWorld extends HTMLElement {
  shadowRoot = useShadow(this, template);
  simBox = this.shadowRoot.querySelector<HTMLElement>(".sim-box")!;
  conn = startParty();

  connectedCallback() {
    this.simBox.style.setProperty("--width", `${Number(this.getAttribute("width")) * SCALE_FACTOR}px`);
    this.simBox.style.setProperty("--height", `${Number(this.getAttribute("height")) * SCALE_FACTOR}px`);

    const observer = new MutationObserver(() => {
      this.dispatchEvent(new Event("worldchanged"));
    });
    observer.observe(this, { subtree: true, attributes: true, childList: true });

    // render remote peers
    this.conn.addEventListener("message", (event) => {
      try {
        const { type, x, y, id, name, avatar } = JSON.parse(event.data) as Record<string, any>;
        switch (type) {
          case "location": {
            const existingPlayer = this.querySelector(`[player="${id}"]`);

            if (existingPlayer) {
              existingPlayer.setAttribute("x", x);
              existingPlayer.setAttribute("y", y);
              existingPlayer.setAttribute("name", name);
              existingPlayer.setAttribute("avatar", avatar);
            } else {
              const player = document.createElement("sim-npc");
              player.setAttribute("player", id);
              player.setAttribute("x", x);
              player.setAttribute("y", y);
              player.setAttribute("name", name);
              player.setAttribute("avatar", avatar);
              this.appendChild(player);
            }
            break;
          }
          case "leave": {
            const player = this.querySelector(`[player="${id}"]`);
            if (player) {
              player.remove();
            }
            break;
          }
        }
      } catch (error) {
        console.warn("error handling message", event.data);
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
