import { attachShadowHtml } from "../shared/attach-html";
import { persistForm } from "../shared/persist-form";

export class SettingsNode extends HTMLElement {
  shadowRoot = attachShadowHtml(
    this,
    `
<style>
:host {
  .two-column {
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
<button title="Setup">⚙️</button>
<dialog style="width: min(40rem, calc(100vw - 32px))">
  <h2>Azure OpenAI Connection</h2>
  <form method="dialog" id="creds-form">
    <div class="two-column">
      <label for="aoai-endpoint">AOAI Endpoint</label>
      <input type="url" id="aoai-endpoint" name="aoai-endpoint"
        placeholder="https://replace-endpoint-name.openai.azure.com/" />

      <label for="aoai-key">AOAI Key</label>
      <input type="password" id="aoai-key" name="aoai-key" />

      <label for="openai-key">OpenAI Key</label>
      <input type="password" id="openai-key" name="openai-key" />

      <label for="speech-region">Azure Speech region</label>
      <input type="text" id="speech-region" name="speech-region" placeholder="eastus" />

      <label for="speech-key">Azure Speech key</label>
      <input type="password" id="speech-key" name="speech-key" />
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

    const credsForm = this.shadowRoot.querySelector<HTMLFormElement>("#creds-form")!;
    persistForm(credsForm, "settingsNode.creds");
  }

  public getSettings() {
    const aoaiEndpoint = this.shadowRoot.querySelector<HTMLInputElement>("#aoai-endpoint")?.value ?? "";
    const aoaiDeploymentName = this.shadowRoot.querySelector<HTMLInputElement>("#aoai-deployment-name")?.value ?? "";
    const aoaiKey = this.shadowRoot.querySelector<HTMLInputElement>("#aoai-key")?.value ?? "";
    const openaiKey = this.shadowRoot.querySelector<HTMLInputElement>("#openai-key")?.value ?? "";
    const togetherAIKey = this.shadowRoot.querySelector<HTMLInputElement>("#together-ai-key")?.value ?? "";
    const googleAIKey = this.shadowRoot.querySelector<HTMLInputElement>("#googleai-key")?.value ?? "";
    const mapKey = this.shadowRoot.querySelector<HTMLInputElement>("#map-key")?.value ?? "";
    const speechRegion = this.shadowRoot.querySelector<HTMLInputElement>("#speech-region")?.value ?? "";
    const speechKey = this.shadowRoot.querySelector<HTMLInputElement>("#speech-key")?.value ?? "";
    const elevenLabsKey = this.shadowRoot.querySelector<HTMLInputElement>("#eleven-labs-key")?.value ?? "";

    return {
      mapKey,
      aoaiEndpoint,
      aoaiDeploymentName,
      aoaiKey,
      googleAIKey,
      togetherAIKey,
      openaiKey,
      speechRegion,
      speechKey,
      elevenLabsKey,
    };
  }
}

export function defineSettingsNode(tagName = "settings-node") {
  if (customElements.get(tagName)) return;
  customElements.define(tagName, SettingsNode);
}
