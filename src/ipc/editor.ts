import { BrowserWindow, IpcMain, Menu } from "electron";
import { Lux } from "../core";

export default function initEditorIpc(
  lux: Lux,
  mainWindow: BrowserWindow,
  ipc: IpcMain
) {
  ipc.on("fixture-context-menu", (_e, ids: number[]) => {
    Menu.buildFromTemplate([
      {
        label:
          ids.length === 1 ? "Clear fixture" : `Clear ${ids.length} fixtures`,
        click: async () => {
          ids.forEach((id) => {
            lux.fixtures[id].properties = {};
          });
          mainWindow.webContents.send("update-fixtures-properties", {
            ids,
            properties: {},
          });
          await lux.update();
        },
        enabled: ids.some(
          (id) => Object.keys(lux.fixtures[id].properties).length !== 0
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
