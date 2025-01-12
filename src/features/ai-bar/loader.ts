import { defineAIBar } from "./ai-bar";
import { defineDragNode } from "./nodes/drag-node";
import { defineHideBar } from "./nodes/hide-node";

import { defineSettingsNode } from "./nodes/settings-node";

export function loadAIBar() {
  defineSettingsNode();
  defineHideBar();
  defineDragNode();

  defineAIBar();
}
