import { attachShadowHtml } from "../shared/attach-html";
import { internalEventName, type InternalEventDetails } from "../shared/internal-events";

export class DragNode extends HTMLElement {
  shadowRoot = attachShadowHtml(
    this,
    `
    <style>
    :host {
      button {
        cursor: move;
        font-size: 16px;
      } 
    }
    </style>
    <button>⣿</button>
    `
  );

  private coords = {
    elementX: 0, // where the element is when the page loads
    elementY: 0,
    mouseStartX: 0, // mouse start position when drag starts
    mouseStartY: 0,
    mouseDeltaX: 0, // how much mouse moved per dragging
    mouseDeltaY: 0,
  };

  connectedCallback() {
    this.setAttribute("provides", "toolbar-item");
    this.shadowRoot.querySelector("button")!.onmousedown = this.dragMouseDown.bind(this);
  }

  private dragMouseDown(mouseEvent: MouseEvent) {
    mouseEvent.preventDefault();
    // get the mouse cursor position at startup:
    this.coords.mouseStartX = mouseEvent.clientX;
    this.coords.mouseStartY = mouseEvent.clientY;
    this.coords.mouseDeltaX = 0;
    this.coords.mouseDeltaY = 0;

    document.onmouseup = this.closeDragElement.bind(this);
    // call a function whenever the cursor moves:
    document.onmousemove = this.elementDrag.bind(this);
  }

  private elementDrag(mouseEvent: MouseEvent) {
    mouseEvent.preventDefault();
    // calculate the new cursor position:
    this.coords.mouseDeltaX = mouseEvent.clientX - this.coords.mouseStartX;
    this.coords.mouseDeltaY = mouseEvent.clientY - this.coords.mouseStartY;

    // set the element's new position:
    const deltaX = this.coords.mouseDeltaX + this.coords.elementX;
    const deltaY = this.coords.mouseDeltaY + this.coords.elementY;
    this.style.setProperty("--offsetX", deltaX + "px");
    this.style.setProperty("--offsetY", deltaY + "px");

    this.dispatchEvent(
      new CustomEvent<InternalEventDetails>(internalEventName, {
        detail: {
          dragged: {
            deltaX,
            deltaY,
          },
        },
        bubbles: true,
      })
    );
  }

  private closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    this.coords.elementX += this.coords.mouseDeltaX;
    this.coords.elementY += this.coords.mouseDeltaY;
    this.style.setProperty("--elementX", this.coords.elementX + "px");
    this.style.setProperty("--elementY", this.coords.elementY + "px");
  }
}

export function defineDragNode() {
  if (customElements.get("drag-node")) return;
  customElements.define("drag-node", DragNode);
}
