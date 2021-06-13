import { BrowserWindow, IpcMain } from "electron";
import { FixtureWithDefinition, Lux } from "../core";
import definitions, { FixtureDefinition } from "../core/definitions";
import { PropertyMap } from "../core/types/Property";

export default function initShowIpc(
  lux: Lux,
  mainWindow: BrowserWindow,
  ipc: IpcMain
) {
  ipc.handle("fixtures", (): FixtureWithDefinition[] => {
    return Object.values(lux.fixtures).map((f) => ({
      ...f,
      definition: definitions[f.definitionId],
    }));
  });

  ipc.handle("output", () => {
    return lux.dmxOutput;
  });

  ipc.on(
    "update-fixtures-properties",
    async (
      e,
      { ids, properties }: { ids: number[]; properties: PropertyMap }
    ) => {
      ids.forEach((id) => {
        lux.fixtures[id].properties = {
          ...lux.fixtures[id].properties,
          ...properties,
        };
      });

      await lux.update();
    }
  );

  ipc.handle("grand-master", () => {
    return lux.grandMaster;
  });

  ipc.on("grand-master-update", async (e, value) => {
    lux.setGrandMaster(value);

    await lux.update();
  });

  lux.on("grand-master-update", (v) =>
    mainWindow.webContents.send("grand-master-update", v)
  );

  lux.on("output-update", (output) => {
    mainWindow.webContents.send("output-update", output);
  });
}
