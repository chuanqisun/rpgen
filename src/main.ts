import { loadAIBar } from "./features/ai-bar/loader";
import type { AzureTtsNode } from "./features/ai-bar/nodes/azure-tts-node";
import type { OpenAILlmNode } from "./features/ai-bar/nodes/openai-llm-node";
import type { WebTtsNode } from "./features/ai-bar/nodes/web-tts-node";
import { user } from "./features/llm/message";
import "./style.css";

loadAIBar();

document.querySelector<HTMLButtonElement>(`[data-action="test-chat"]`)?.addEventListener("click", async () => {
  const aoai = await document.querySelector<OpenAILlmNode>("openai-llm-node")!.getClient("aoai");
  const response = await aoai.chat.completions.create({
    messages: [user`Howdy cowboy`],
    model: "gpt-4o-mini",
  });
  console.log(response);
});

document.querySelector<HTMLButtonElement>(`[data-action="test-azure-tts"]`)?.addEventListener("click", async () => {
  const tts = await document.querySelector<AzureTtsNode>("azure-tts-node");
  tts?.queue("Hello world", { onStart: () => console.log("start"), onEnd: () => console.log("end") });
});

document.querySelector<HTMLButtonElement>(`[data-action="test-web-tts"]`)?.addEventListener("click", async () => {
  const tts = await document.querySelector<WebTtsNode>("web-tts-node");
  tts?.queue("Hello world", { onStart: () => console.log("start"), onEnd: () => console.log("end") });
});
