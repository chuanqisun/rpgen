import { parseKeyboardShortcut } from "../utils/dom";
import { useShadow } from "../utils/use-shadow";
import { SCALE_FACTOR } from "./shared/constant";
import template from "./sim-player.html?raw";
import type { Interactable, SimWorld } from "./sim-world";

export class SimPlayer extends HTMLElement {
  static observedAttributes = ["x", "y"];

  shadowRoot = useShadow(this, template);
  container = this.shadowRoot.querySelector(".container") as HTMLElement;
  chatbox = this.shadowRoot.querySelector("textarea")!;

  private primaryInteractionTarget: (HTMLElement & Interactable) | undefined = undefined;

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

  connectedCallback() {
    this.closest<SimWorld>("sim-world")?.addEventListener("worldchanged", () => {
      console.log("worldchanged");
      const nearest = (this.closest<SimWorld>("sim-world")?.getNearestObjects(this, { maxGridDistance: 1 }) ?? []).at(0);
      if (nearest !== this.primaryInteractionTarget) {
        this.primaryInteractionTarget?.stop();
        if (nearest) this.primaryInteractionTarget = nearest;
        return;
      }
    });

    window.addEventListener("keydown", (e) => {
      const { combo } = parseKeyboardShortcut(e) ?? {};

      if (this.isChatting()) {
        switch (combo) {
          case "escape": {
            e.preventDefault();
            if (this.chatbox.value) {
              this.chatbox.value = "";
            } else if (!this.chatbox.hidden) {
              this.chatbox.hidden = true;
            }
            break;
          }
          case "enter": {
            e.preventDefault();
            const prompt = this.chatbox.value;
            this.chatbox.value = "";
            this.chatbox.hidden = true;
            if (!prompt) return;

            const nearest = (this.closest<SimWorld>("sim-world")?.getNearestObjects(this, { maxGridDistance: 1 }) ?? []).at(0);
            if (!nearest) return;
            console.log(`${this.getAttribute("name")} -> ${nearest.getAttribute("name")}: ${prompt}`);
            (nearest as any).start({ other: this, prompt });
            break;
          }
        }
      } else {
        switch (combo) {
          case "arrowup": {
            e.preventDefault();
            this.setAttribute("y", (parseInt(this.getAttribute("y") as string) - 1).toString());
            break;
          }

          case "arrowdown": {
            e.preventDefault();
            this.setAttribute("y", (parseInt(this.getAttribute("y") as string) + 1).toString());
            break;
          }

          case "arrowleft": {
            e.preventDefault();
            this.setAttribute("x", (parseInt(this.getAttribute("x") as string) - 1).toString());
            break;
          }

          case "arrowright": {
            e.preventDefault();
            this.setAttribute("x", (parseInt(this.getAttribute("x") as string) + 1).toString());
            break;
          }

          case "enter": {
            e.preventDefault();
            const nearest = (this.closest<SimWorld>("sim-world")?.getNearestObjects(this, { maxGridDistance: 1 }) ?? []).at(0);
            if (!nearest) return;
            nearest.stop();
            this.chatbox.hidden = false;
            this.chatbox.focus();
            break;
          }
        }
      }
    });
  }

  private isChatting() {
    return !this.chatbox.hidden;
  }
}

export function defineSimPlayer() {
  if (customElements.get("sim-player")) return;
  customElements.define("sim-player", SimPlayer);
}
