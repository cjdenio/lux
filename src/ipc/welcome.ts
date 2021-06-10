import { BrowserWindow, dialog, IpcMain, Menu } from "electron";
import { readFile } from "fs/promises";
import { decode } from "@msgpack/msgpack";
import { Fixture, Lux } from "../core";

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
        const rawShow = await readFile(showPath);

        const show = decode(rawShow);

        const { fixtures } = show as { fixtures: { [id: string]: Fixture } };

        lux.fixtures = fixtures;

        mainWindow.webContents.send("open-project");
      } catch (e) {
        console.log(e);
      }
    }
  });
}
