import { attachShadowHtml } from "../shared/attach-html";
import { persistForm } from "../shared/persist-form";

export class OpenAILlmNode extends HTMLElement {
  shadowRoot = attachShadowHtml(
    this,
    `
<style>
:host {
  .rows {
    display: grid;
  }

  input + label {
    margin-top: 0.5rem;
  }

  button {
    font-size: 16px;
  }

  form {
    display: grid;
    gap: 1rem;
  }
}
</style>
<button title="Setup">🤖</button>
<dialog style="width: min(40rem, calc(100vw - 32px))">
  <h2>OpenAI Settings</h2>
  <form method="dialog" id="creds-form">
    <div class="rows">

      <label for="aoaiEndpoint">Azure OpenAI Endpoint</label>
      <input type="url" id="aoaiEndpoint" name="aoaiEndpoint"
        placeholder="https://replace-endpoint-name.openai.azure.com/" />

      <label for="aoaiApiKey">Azure OpenAI API Key</label>
      <input type="password" id="aoaiApiKey" name="aoaiApiKey" />

      <label for="openaiApiKey">OpenAI API Key</label>
      <input type="password" id="openaiApiKey" name="openaiApiKey" />

    </div>
    <button>Done</button>
  </form>
</dialog>
    `
  );

  connectedCallback() {
    this.shadowRoot.querySelector("button")?.addEventListener("click", () => {
      this.shadowRoot.querySelector("dialog")?.showModal();
    });

    persistForm(this.shadowRoot.querySelector("form")!, "openaiLlmNode.creds");
  }

  public async getClient(provider: "aoai" | "openai" = "aoai") {
    let { openaiApiKey, aoaiEndpoint, aoaiApiKey } = this.getSettings();
    if (provider === "aoai") {
      if (!aoaiEndpoint || !aoaiApiKey) throw new Error("Missing AOAI endpoint or key");

      const { AzureOpenAI } = await import("openai");

      const openai = new AzureOpenAI({
        endpoint: aoaiEndpoint,
        apiKey: aoaiApiKey,
        apiVersion: "2024-10-21",
        dangerouslyAllowBrowser: true,
      });

      return openai;
    } else {
      if (!openaiApiKey) throw new Error("Missing OpenAI key");

      const { OpenAI } = (await import("openai")).OpenAI;

      const openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true,
      });

      return openai;
    }
  }

  private getSettings() {
    const aoaiEndpoint = this.shadowRoot.querySelector<HTMLInputElement>("#aoaiEndpoint")?.value ?? "";
    const aoaiApiKey = this.shadowRoot.querySelector<HTMLInputElement>("#aoaiApiKey")?.value ?? "";
    const openaiApiKey = this.shadowRoot.querySelector<HTMLInputElement>("#openaiApiKey")?.value ?? "";

    return {
      aoaiEndpoint,
      aoaiApiKey,
      openaiApiKey,
    };
  }
}

export function defineOpenAILlmNode(tagName = "openai-llm-node") {
  if (customElements.get(tagName)) return;
  customElements.define(tagName, OpenAILlmNode);
}
