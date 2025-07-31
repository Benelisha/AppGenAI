import { loadAllFilesRecursively } from "./loadAllFilesRecursively";
import { createRequireFromMap } from "./createRequireFromMap";
import * as React from "react";

export async function renderMiniApp(basePath: string): Promise<React.ComponentType | null> {
  try {
    const files = await loadAllFilesRecursively(basePath);
    const require = createRequireFromMap(files);
    const App = require("App.js").default;
    return App;
  } catch (e) {
    console.error("Error loading MiniApp:", e);
    return null;
  }
}
