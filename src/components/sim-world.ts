import { useShadow } from "../utils/use-shadow";
import { SCALE_FACTOR } from "./shared/constant";
import template from "./sim-world.html?raw";

export class SimWorld extends HTMLElement {
  shadowRoot = useShadow(this, template);
  simBox = this.shadowRoot.querySelector<HTMLElement>(".sim-box")!;

  connectedCallback() {
    this.simBox.style.setProperty("--width", `${Number(this.getAttribute("width")) * SCALE_FACTOR}px`);
    this.simBox.style.setProperty("--height", `${Number(this.getAttribute("height")) * SCALE_FACTOR}px`);
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

    return objectsWithGridDistance.slice(0, 1).map((object) => object.child);
  }
}

export function defineSimWorld() {
  if (!customElements.get("sim-world")) {
    customElements.define("sim-world", SimWorld);
  }
}
