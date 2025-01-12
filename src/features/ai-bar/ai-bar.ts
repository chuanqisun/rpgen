import { attachShadowHtml } from "./shared/attach-html";

export class AIBar extends HTMLElement {
  shadowRoot = attachShadowHtml(
    this,
    `
    <style>
:host {
  *,*::before,*::after {
    box-sizing: border-box;
  }

  #widget-container {
    top: 16px;
    left: 50%;
    position: fixed;
    display: flex;
    width: max-content;
    transform: translate(calc(var(--offsetX, 0px) - 50%), var(--offsetY, 0));
    box-shadow: 0 3px 7px 0 rgba(0, 0, 0, .13), 0 1px 2px 0 rgba(0, 0, 0, .11);
    z-index: 2147483647;
  }
}
    </style>
    <div id="widget-container">
      <slot name="toolbar"></slot>
    </div>
`
  );

  connectedCallback() {
    this.querySelector("script")?.remove();
    this.querySelectorAll(`[provides*="toolbar-item"]`).forEach((el) => el.setAttribute("slot", "toolbar"));

    this.addEventListener("event", (event) => {
      const typedEvent = event as CustomEvent;
      this.handleDragged(typedEvent);
      this.handleHide(typedEvent);
    });

    if (this.hasAttribute("auto-hide")) {
      const cancel = setTimeout(() => {
        this.style.display = "none";
      }, 3000);

      this.addEventListener("click", () => clearTimeout(cancel));
    }

    if (this.hasAttribute("hidden")) {
      this.style.display = "none";
    }
  }

  private handleDragged(typedEvent: CustomEvent) {
    if (!typedEvent.detail.dragged) return;
    typedEvent.stopPropagation();

    this.style.setProperty("--offsetX", typedEvent.detail.dragged.deltaX + "px");
    this.style.setProperty("--offsetY", typedEvent.detail.dragged.deltaY + "px");
  }

  private handleHide(typedEvent: CustomEvent) {
    if (!typedEvent.detail.hide) return;
    typedEvent.stopPropagation();
    this.dispatchEvent(new CustomEvent("hide"));

    this.style.display = "none";
  }
}

export function defineAIBar(tagName = "ai-bar") {
  if (customElements.get(tagName)) return;
  customElements.define(tagName, AIBar);
}
