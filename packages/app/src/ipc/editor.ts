import { BrowserWindow, IpcMain, Menu } from "electron";
import { Fixture } from "@lux/common";
import { Lux } from "../core";

export default function initEditorIpc(
  lux: Lux,
  mainWindow: BrowserWindow,
  ipc: IpcMain
) {
  ipc.on("fixture-context-menu", (_e, fixtures: Fixture[]) => {
    if (lux.show === undefined) return;

    Menu.buildFromTemplate([
      {
        label:
          fixtures.length === 1
            ? "Clear fixture"
            : `Clear ${fixtures.length} fixtures`,
        click: async () => {
          for (const fixture of fixtures) {
            lux.show!.universes[fixture.universe].fixtures[
              fixture.id
            ].properties = {};
          }

          mainWindow.webContents.send("update-fixtures-properties", {
            ids: fixtures,
            properties: {},
          });
          await lux.update();
        },
        enabled: fixtures.some(
          (fixture) =>
            lux.show!.universes[fixture.universe].fixtures[fixture.id]
              .properties !== {}
        ),
      },
    ]).popup();
  });

  ipc.on("editor-context-menu", () => {
    Menu.buildFromTemplate([
      {
        label: "Select all",
        accelerator: "CommandOrControl+A",
        click: () => {
          mainWindow?.webContents.send("editor-select-all");
        },
      },
      {
        label: "Invert selection",
        accelerator: "CommandOrControl+I",
        click: () => {
          mainWindow?.webContents.send("editor-invert-selection");
        },
      },
    ]).popup();
  });
}
