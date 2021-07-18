import { BrowserWindow, dialog, IpcMain, Menu } from "electron";
import { readFile, writeFile } from "fs/promises";
import { decode, encode } from "@msgpack/msgpack";
import { Lux } from "../core";
import { Show, defaultShow } from "@lux/common";

import { basename } from "path";

export default function initWelcomeIpc(
  lux: Lux,
  mainWindow: BrowserWindow,
  ipc: IpcMain
) {
  ipc.on("open-project", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: "Open Show",
      filters: [
        {
          name: "Lux Show",
          extensions: ["lux"],
        },
      ],
    });

    if (!canceled) {
      const filePath = filePaths[0];

      try {
        const show = await lux.open(filePath);

        mainWindow.webContents.send("open-project");
        mainWindow.webContents.send(
          "window-title-update",
          show.name || basename(filePath)
        );
      } catch (e) {
        console.log(e);
      }
    }
  });

  ipc.on("create-project", async () => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: "Create Show",
      filters: [
        {
          name: "Lux Show",
          extensions: ["lux"],
        },
      ],
      buttonLabel: "Create",
      nameFieldLabel: "Create As:",
    });

    if (!canceled && filePath) {
      console.log(filePath);

      await writeFile(filePath, encode(defaultShow()));
      const show = await lux.open(filePath);

      mainWindow.webContents.send("open-project");
      mainWindow.webContents.send(
        "window-title-update",
        show.name || basename(filePath)
      );
    }
  });

  ipc.on("close-project", () => {
    lux.close();

    mainWindow.webContents.send("window-title-update", undefined);
  });

  ipc.handle("window-title", (): string | undefined => {
    if (lux.show === undefined) return;

    return lux.show.name || basename(lux.show.path);
  });
}
