import type { OpenAILlmNode } from "natural-kit";
import { loadAIBar, user } from "natural-kit";
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
