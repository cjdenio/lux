import { BrowserWindow, app, ipcMain, Menu } from "electron";
import { join } from "path";
import { Lux, ArtnetOutput } from "./core";

import initShowIpc from "./ipc/show";
import initEditorIpc from "./ipc/editor";
import initWelcomeIpc from "./ipc/welcome";

let mainWindow: BrowserWindow;

const lux = new Lux();
lux.attachOutput(new ArtnetOutput("192.168.1.255")).then(() => {
  console.log("Art-Net successfully connected");
});

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    titleBarStyle: "hidden",
    show: false,
    backgroundColor: "#1A202C",
    title: "Lux",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  initWelcomeIpc(lux, mainWindow, ipcMain);
  initShowIpc(mainWindow, lux, ipcMain);
  initEditorIpc(mainWindow, ipcMain);

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
  });

  if (app.isPackaged) {
    mainWindow.loadURL("file://" + join(__dirname, "../ui/dist/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }
});
