import { BrowserWindow, IpcMain, Menu } from "electron";
import { Fixture } from "@lux/common";
import { Lux } from "../core";

export default function initEditorIpc(
  lux: Lux,
  mainWindow: BrowserWindow,
  ipc: IpcMain
): void {
  ipc.on("fixture-context-menu", (_e, fixtures: Fixture[]) => {
    if (lux.show === undefined) return;

    Menu.buildFromTemplate([
      {
        label:
          fixtures.length === 1
            ? "Clear Fixture"
            : `Clear ${fixtures.length} Fixtures`,
        click: async () => {
          if (lux.show === undefined) return;

          for (const fixture of fixtures) {
            lux.show.universes[fixture.universe].fixtures[
              fixture.id
            ].properties = {};
          }

          mainWindow.webContents.send("update-fixtures-properties", {
            ids: fixtures.map((f) => f.id),
            properties: {},
          });

          for (const fixture of fixtures) {
            lux.universeUpdateQueue[fixture.universe] = true;
          }
        },
        enabled: fixtures.some(
          (fixture) => Object.keys(fixture.properties).length !== 0
        ),
      },
    ]).popup();
  });

  ipc.on("editor-context-menu", () => {
    Menu.buildFromTemplate([
      {
        label: "Select All",
        accelerator: "CommandOrControl+A",
        click: () => {
          mainWindow?.webContents.send("editor-select-all");
        },
      },
      {
        label: "Invert Selection",
        accelerator: "CommandOrControl+I",
        click: () => {
          mainWindow?.webContents.send("editor-invert-selection");
        },
      },
    ]).popup();
  });

  ipc.on("clear-all", () => {
    if (lux.show === undefined) return;

    for (const universeIndex in lux.show.universes) {
      const universe = lux.show.universes[universeIndex];

      for (const fixtureIndex in universe.fixtures) {
        lux.show.universes[universeIndex].fixtures[fixtureIndex].properties =
          {};
      }

      lux.universeUpdateQueue[universeIndex] = true;
    }

    mainWindow.webContents.send("update-fixtures-properties", {
      properties: {},
    });
  });
}
