import { defineAIBar } from "./ai-bar";

import { defineSettingsNode } from "./nodes/settings-node";

export function loadAIBar() {
  defineSettingsNode();
  defineAIBar();
}
