import type { AzureTtsNode, OpenAILlmNode, SttRecognizedEventDetails, WebSttNode, WebTtsNode } from "natural-kit";
import { AzureSttNode, loadAIBar, sttRecognizedEventName, user } from "natural-kit";
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

document.querySelector<HTMLButtonElement>(`[data-action="test-azure-stt"]`)?.addEventListener(
  "click",
  async () => {
    const stt = document.querySelector<AzureSttNode>("azure-stt-node")!;
    await stt.startMicrophone();
    const trigger = document.querySelector<HTMLButtonElement>(`[data-action="test-azure-stt"]`)!;
    trigger.textContent = "Hold to speak";

    trigger.addEventListener("mousedown", async () => {
      trigger.textContent = "Release to send";
      stt?.start();
    });

    trigger.addEventListener("mouseup", async () => {
      trigger.textContent = "Hold to speak";
      stt?.stop();
    });

    stt.addEventListener(sttRecognizedEventName, (e) => {
      const detail = (e as CustomEvent<SttRecognizedEventDetails>).detail;
      console.log(detail);
    });
  },
  { once: true }
);

document.querySelector<HTMLButtonElement>(`[data-action="test-web-stt"]`)?.addEventListener(
  "click",
  async () => {
    const stt = document.querySelector<WebSttNode>("web-stt-node")!;
    const trigger = document.querySelector<HTMLButtonElement>(`[data-action="test-web-stt"]`)!;
    trigger.textContent = "Hold to speak";

    trigger.addEventListener("mousedown", async () => {
      trigger.textContent = "Release to send";
      stt?.start();
    });

    trigger.addEventListener("mouseup", async () => {
      trigger.textContent = "Hold to speak";
      stt?.stop();
    });

    stt.addEventListener(sttRecognizedEventName, (e) => {
      const detail = (e as CustomEvent<SttRecognizedEventDetails>).detail;
      console.log(detail);
    });
  },
  { once: true }
);
