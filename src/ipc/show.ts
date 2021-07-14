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
    if (lux.show === undefined) return [];

    return Object.values(lux.show.fixtures).map((f) => ({
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
      if (lux.show === undefined) return;

      ids.forEach((id) => {
        lux.show!.fixtures[id].properties = {
          ...lux.show!.fixtures[id].properties,
          ...properties,
        };
      });

      await lux.update();
    }
  );

  ipc.handle("grand-master", () => {
    if (lux.show === undefined) return;

    return lux.show.grandMaster;
  });

  ipc.on("grand-master-update", async (e, value) => {
    lux.setGrandMaster(value);

    await lux.update();
  });

  ipc.on("save", async () => {
    await lux.save();
  });

  lux.on("grand-master-update", (v) =>
    mainWindow.webContents.send("grand-master-update", v)
  );

  lux.on("output-update", (output) => {
    mainWindow.webContents.send("output-update", output);
  });
}
