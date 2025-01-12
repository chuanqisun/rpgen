import { attachShadowHtml } from "../shared/attach-html";
import { persistForm } from "../shared/persist-form";

export interface Settings {
  aoaiEndpoint: string;
  aoaiKey: string;
  openaiKey: string;
  azureSpeechRegion: string;
  azureSpeechKey: string;
}

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
  <form method="dialog" id="creds-form">
    <div class="two-column">
      <label for="aoaiEndpoint">AOAI Endpoint</label>
      <input type="url" id="aoaiEndpoint" name="aoaiEndpoint"
        placeholder="https://replace-endpoint-name.openai.azure.com/" />

      <label for="aoaiKey">AOAI Key</label>
      <input type="password" id="aoaiKey" name="aoaiKey" />

      <label for="openaiKey">OpenAI Key</label>
      <input type="password" id="openaiKey" name="openaiKey" />

      <label for="azureSpeechRegion">Azure Speech region</label>
      <input type="text" id="azureSpeechRegion" name="azureSpeechRegion" placeholder="eastus" />

      <label for="azureSpeechKey">Azure Speech key</label>
      <input type="password" id="azureSpeechKey" name="azureSpeechKey" />
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
    const credsForm = this.shadowRoot.querySelector<HTMLFormElement>("#creds-form")!;
    return Object.fromEntries(
      [...credsForm.elements]
        .map((el) => {
          if (el instanceof HTMLInputElement) {
            return [el.name, el.value];
          } else {
            return null;
          }
        })
        .filter((el): el is [string, string] => el !== null)
    ) as any as Settings;
  }
}

export function defineSettingsNode(tagName = "settings-node") {
  if (customElements.get(tagName)) return;
  customElements.define(tagName, SettingsNode);
}
