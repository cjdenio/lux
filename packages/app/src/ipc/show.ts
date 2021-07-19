import { BrowserWindow, IpcMain } from "electron";
import { Lux } from "../core";
import {
  FixtureWithDefinition,
  PropertyMap,
  definitions,
  Fixture,
  _,
} from "@lux/common";

export default function initShowIpc(
  lux: Lux,
  mainWindow: BrowserWindow,
  ipc: IpcMain
) {
  ipc.handle("fixtures", (): FixtureWithDefinition[] => {
    if (lux.show === undefined) return [];

    const fixtures: FixtureWithDefinition[] = [];

    for (const universeIndex in lux.show.universes) {
      const universe = lux.show.universes[universeIndex];

      for (const fixtureIndex in universe.fixtures) {
        const fixture = universe.fixtures[fixtureIndex];

        fixtures.push({
          ...fixture,
          definition: definitions[fixture.definitionId],
        });
      }
    }

    return fixtures;
  });

  ipc.handle("output", () => {
    return lux.dmxOutput;
  });

  ipc.on(
    "update-fixtures-properties",
    async (
      e,
      { fixtures, properties }: { fixtures: Fixture[]; properties: PropertyMap }
    ) => {
      if (lux.show === undefined) return;

      for (const fixture of fixtures) {
        lux.show.universes[fixture.universe].fixtures[fixture.id].properties = {
          ...lux.show.universes[fixture.universe].fixtures[fixture.id]
            .properties,
          ...properties,
        };
      }

      for (const fixture of fixtures) {
        lux.universeUpdateQueue[fixture.universe] = true;
      }
    }
  );

  ipc.handle("grand-master", (): number => {
    if (lux.show === undefined) return 0;

    return _(lux.show.grandMaster, 255);
  });

  ipc.on("grand-master-update", async (e, value) => {
    lux.setGrandMaster(value);
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
