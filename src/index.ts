import { BrowserWindow, app, ipcMain, Menu } from "electron";
import { Server } from "node-osc";
import { join } from "path";
import { Lux, ArtnetOutput } from "./core";

import initShowIpc from "./ipc/show";
import initEditorIpc from "./ipc/editor";
import initWelcomeIpc from "./ipc/welcome";

let mainWindow: BrowserWindow;

const lux = new Lux();
lux.attachOutput(new ArtnetOutput("127.0.0.1")).then(() => {
  console.log("Art-Net successfully connected");
});

const osc = new Server(3333, "0.0.0.0", () => {
  console.log("OSC server started");
});

osc.on("message", async ([path, ...args]) => {
  if (
    path === "/lux/grand-master" &&
    typeof args[0] === "number" &&
    args[0] >= 0 &&
    args[0] <= 255
  ) {
    lux.setGrandMaster(args[0]);
    await lux.update();
  }
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
  initShowIpc(lux, mainWindow, ipcMain);
  initEditorIpc(lux, mainWindow, ipcMain);

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.maximize();
  });

  if (app.isPackaged) {
    mainWindow.loadURL("file://" + join(__dirname, "../ui/dist/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }
});
