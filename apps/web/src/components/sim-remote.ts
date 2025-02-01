import { system, user, type OpenAILlmNode } from "natural-kit";
import { useShadow } from "../utils/use-shadow";
import { SCALE_FACTOR } from "./shared/constant";
import template from "./sim-remote.html?raw";
import type { Interactable } from "./sim-world";

export class SimRemote extends HTMLElement implements Interactable {
  static observedAttributes = ["x", "y"];

  shadowRoot = useShadow(this, template);
  container = this.shadowRoot.querySelector(".container") as HTMLImageElement;
  chatbox = this.shadowRoot.querySelector("textarea")!;
  memory = [] as string[];

  connectedCallback() {
    this.container.querySelector(".avatar")!.textContent = this.getAttribute("avatar") ?? "🤖";
  }

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

  async start(options: { other: HTMLElement; prompt: string }) {
    const { other, prompt } = options;
    const llm = await document.querySelector<OpenAILlmNode>("openai-llm-node")!.getClient("aoai");
    const task = await llm.chat.completions.create({
      stream: true,
      model: "gpt-4o-mini",
      messages: [
        system`
You are ${this.getAttribute("name")}, an NPC in an RPG game. Your personality is based on emoji ${this.getAttribute("avatar")}.
${
  this.memory.length
    ? `Here is a record of previous events:
${this.memory.join("\n")} 
  `
    : ""
}
The player ${other.getAttribute("name")} just approached you.

Respond to the player in one short colloquial utterance. Do NOT use any emoji in your response.
        `,
        user`${prompt}`,
      ],
    });

    this.memory.push(`${other.getAttribute("name")}: ${prompt}`);

    this.chatbox.hidden = false;
    this.chatbox.value = "";
    for await (const message of task) {
      this.chatbox.value += message.choices?.[0]?.delta?.content ?? "";
    }

    this.memory.push(`${this.getAttribute("name")}: ${this.chatbox.value}`);
  }

  stop() {
    this.chatbox.hidden = true;
    this.chatbox.value = "";
  }
}

export function defineSimNpc() {
  if (customElements.get("sim-remote")) return;
  customElements.define("sim-remote", SimRemote);
}
