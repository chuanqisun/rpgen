import { defineAIBar } from "./ai-bar";
import { defineDragNode } from "./nodes/drag-node";
import { defineHideBar } from "./nodes/hide-node";
import { defineOpenAILlmNode } from "./nodes/openai-llm-node";

import { defineSettingsNode } from "./nodes/settings-node";

export function loadAIBar() {
  // load container first to set internal event handlers
  defineAIBar();

  defineSettingsNode();
  defineHideBar();
  defineDragNode();
  defineOpenAILlmNode();
}
