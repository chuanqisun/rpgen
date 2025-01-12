import { attachShadowHtml } from "../shared/attach-html";
import { internalEventName } from "../shared/internal-events";

export class HideNode extends HTMLElement {
  shadowRoot = attachShadowHtml(this, `<button style="font-size: 16px" title="Hide">🙈</button>`);

  connectedCallback() {
    this.setAttribute("provides", "toolbar-item");

    this.shadowRoot.querySelector("button")?.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent(internalEventName, { detail: { hide: true }, bubbles: true }));
    });

    const autoHideOption = this.getAttribute("auto-hide");
    if (autoHideOption === "") {
      this.dispatchEvent(new CustomEvent(internalEventName, { detail: { hide: true }, bubbles: true }));
    } else if (typeof autoHideOption === "string") {
      const timeoutSecs = parseInt(autoHideOption);
      if (isNaN(timeoutSecs)) {
        console.warn(`Invalid auto-hide value: ${autoHideOption}`);
        return;
      }

      const cancel = setTimeout(() => {
        this.dispatchEvent(new CustomEvent(internalEventName, { detail: { hide: true }, bubbles: true }));
      }, timeoutSecs * 1000);

      this.parentElement?.addEventListener("click", () => clearTimeout(cancel));
    }
  }
}

export function defineHideBar(tagName = "hide-node") {
  if (customElements.get(tagName)) return;
  customElements.define(tagName, HideNode);
}
