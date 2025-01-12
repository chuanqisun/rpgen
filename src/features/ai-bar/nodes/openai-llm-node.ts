import type { SettingsNode } from "./settings-node";

export class OpenAILlmNode extends HTMLElement {
  public async getClient(provider: "aoai" | "openai") {
    let { openaiKey, aoaiEndpoint, aoaiKey } = this.getSettings();
    if (provider === "aoai") {
      if (!aoaiEndpoint || !aoaiKey) throw new Error("Missing AOAI endpoint or key");

      const { AzureOpenAI } = await import("openai");

      const openai = new AzureOpenAI({
        endpoint: aoaiEndpoint,
        apiKey: aoaiKey,
        apiVersion: "2024-10-21",
        dangerouslyAllowBrowser: true,
      });

      return openai;
    } else {
      if (!openaiKey) throw new Error("Missing OpenAI key");

      const { OpenAI } = (await import("openai")).OpenAI;

      const openai = new OpenAI({
        apiKey: openaiKey,
        dangerouslyAllowBrowser: true,
      });

      return openai;
    }
  }

  private getSettings() {
    const settingsNode = document.querySelector<SettingsNode>("settings-node");
    if (!settingsNode) throw new Error("Settings node not found");
    return settingsNode.getSettings();
  }
}

export function defineOpenAILlmNode(tagName = "openai-llm-node") {
  if (customElements.get(tagName)) return;
  customElements.define(tagName, OpenAILlmNode);
}
