import { BrowserWindow, IpcMain, Menu } from "electron";

export default function initEditorIpc(mainWindow: BrowserWindow, ipc: IpcMain) {
  ipc.on("fixture-context-menu", () => {
    Menu.buildFromTemplate([
      {
        label: "Delete fixture",
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
