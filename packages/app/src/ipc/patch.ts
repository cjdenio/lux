import { BrowserWindow, IpcMain } from "electron";
import { Lux } from "../core";
import { FixtureDefinitionWithId, categories, definitions } from "@lux/common";

export default function initPatchIpc(
  lux: Lux,
  mainWindow: BrowserWindow,
  ipc: IpcMain
): void {
  // Map used here to preserve insertion order
  ipc.handle("definitions", (): Map<string, FixtureDefinitionWithId[]> => {
    const definitionsWithCategories = new Map<
      string,
      FixtureDefinitionWithId[]
    >();

    categories.forEach((c) => {
      definitionsWithCategories.set(c, []);
      definitionsWithCategories.set("Uncategorized", []);
    });

    Object.entries(definitions).forEach(([id, definition]) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      definitionsWithCategories
        .get(definition.category || "Uncategorized")!
        .push({ ...definition, id });
    });

    return definitionsWithCategories;
  });
}
