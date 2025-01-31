import { html_beautify } from "js-beautify";
import type { OpenAILlmNode } from "natural-kit";
import { loadAIBar, user } from "natural-kit";
import { defineSimNpc } from "./components/sim-npc";
import { defineSimPlayer } from "./components/sim-player";
import { defineSimWorld } from "./components/sim-world";
import "./style.css";

loadAIBar();
defineSimWorld();
defineSimPlayer();
defineSimNpc();

const world = document.querySelector("sim-world") as HTMLElement;
const worldEditor = document.querySelector("#world-editor") as HTMLTextAreaElement;
const observer = new MutationObserver(updateSource);
observer.observe(world, { subtree: true, attributes: true, childList: true });

updateSource();

function updateSource() {
  worldEditor.textContent = html_beautify(world.outerHTML.trim(), { indent_size: 2 });
}

const sheet = new CSSStyleSheet();
document.adoptedStyleSheets.push(sheet);

document.querySelector<HTMLButtonElement>(`[data-action="test-chat"]`)?.addEventListener("click", async () => {
  const aoai = await document.querySelector<OpenAILlmNode>("openai-llm-node")!.getClient("aoai");
  const response = await aoai.chat.completions.create({
    messages: [user`Howdy cowboy`],
    model: "gpt-4o-mini",
  });
  console.log(response);
});
