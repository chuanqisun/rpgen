import { html_beautify } from "js-beautify";
import { loadAIBar } from "natural-kit";
import { defineSimPlayer } from "./components/sim-player";
import { defineSimRemote } from "./components/sim-remote";
import { defineSimWorld, SimWorld } from "./components/sim-world";
import "./style.css";

loadAIBar();
defineSimWorld();
defineSimPlayer();
defineSimRemote();

const world = document.querySelector<SimWorld>("sim-world")!;
const worldEditor = document.querySelector("#world-editor") as HTMLTextAreaElement;

world.addEventListener("worldchanged", updateSource);
updateSource();

function updateSource() {
  worldEditor.textContent = html_beautify(world.outerHTML.trim(), { indent_size: 2 });
}

const initDialog = document.querySelector("dialog")!;
initDialog.showModal();
initDialog.addEventListener("click", (e) => {
  if (!(e.target! as HTMLElement).closest("button")) return;

  const joinType = (e.target as HTMLElement)?.closest("form")?.ariaLabel;
  const form = (e.target as HTMLElement).closest("form") as HTMLFormElement;

  if (!form.checkValidity()) return;

  const formData = new FormData(form);
  switch (joinType) {
    case "Join as human": {
      world.joinAsPlayer({ name: formData.get("name") as string, avatar: formData.get("avatar") as string });
      break;
    }
    case "Join as AI": {
      world.joinAsAI({ name: formData.get("name") as string, avatar: formData.get("avatar") as string, personality: formData.get("personality") as string });
      break;
    }
    case "Join as Observer": {
      break;
    }
  }
});
