import { html_beautify } from "js-beautify";
import { loadAIBar } from "natural-kit";
import { defineSimPlayer } from "./components/sim-player";
import { defineSimNpc } from "./components/sim-remote";
import { defineSimWorld } from "./components/sim-world";
import "./style.css";

loadAIBar();
defineSimWorld();
defineSimPlayer();
defineSimNpc();

const world = document.querySelector("sim-world") as HTMLElement;
const worldEditor = document.querySelector("#world-editor") as HTMLTextAreaElement;

world.addEventListener("worldchanged", updateSource);
updateSource();

function updateSource() {
  worldEditor.textContent = html_beautify(world.outerHTML.trim(), { indent_size: 2 });
}
