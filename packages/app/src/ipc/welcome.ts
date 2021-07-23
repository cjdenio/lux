import { BrowserWindow, dialog, IpcMain } from "electron";
import { writeFile } from "fs/promises";
import { encode } from "@msgpack/msgpack";
import { Lux } from "../core";
import { defaultShow } from "@lux/common";

import { basename } from "path";

export default function initWelcomeIpc(
  lux: Lux,
  mainWindow: BrowserWindow,
  ipc: IpcMain
): void {
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

        mainWindow.webContents.send("open-project", show.lastRoute);
        mainWindow.webContents.send(
          "window-title-update",
          show.name || basename(filePath)
        );
      } catch (e) {
        console.error(e);
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
      await writeFile(filePath, encode(defaultShow()));
      const show = await lux.open(filePath);

      mainWindow.webContents.send("open-project", show.lastRoute);
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
