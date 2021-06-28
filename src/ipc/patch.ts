import { BrowserWindow, IpcMain } from "electron";
import { Lux } from "../core";
import definitions, {
  FixtureDefinition,
  FixtureDefinitionWithId,
  categories,
} from "../core/definitions";

export default function initPatchIpc(
  lux: Lux,
  mainWindow: BrowserWindow,
  ipc: IpcMain
) {
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
      definitionsWithCategories
        .get(definition.category || "Uncategorized")!
        .push({ ...definition, id });
    });

    return definitionsWithCategories;
  });
}
