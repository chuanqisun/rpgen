import { loadAIBar } from "./features/ai-bar/loader";
import type { OpenAILlmNode } from "./features/ai-bar/nodes/openai-llm-node";
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
