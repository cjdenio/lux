import { BrowserWindow, dialog, IpcMain, Menu } from "electron";
import { readFile } from "fs/promises";
import { decode } from "@msgpack/msgpack";
import { Lux } from "../core";
import Show from "../core/types/Show";

import { basename } from "path";

export default function initWelcomeIpc(
  lux: Lux,
  mainWindow: BrowserWindow,
  ipc: IpcMain
) {
  ipc.on("open-project", async () => {
    const file = await dialog.showOpenDialog(mainWindow, {
      title: "Open Show",
      filters: [
        {
          name: "Lux show",
          extensions: ["lux"],
        },
      ],
    });

    if (!file.canceled) {
      const showPath = file.filePaths[0];

      try {
        const show = await lux.open(showPath);

        mainWindow.webContents.send("open-project");
        mainWindow.webContents.send(
          "window-title-update",
          show.name || basename(showPath)
        );
      } catch (e) {
        console.log(e);
      }
    }
  });

  ipc.handle("window-title", (): string | undefined => {
    if (lux.show === undefined) return;

    return lux.show.name || basename(lux.show.path);
  });
}
