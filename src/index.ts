import { BrowserWindow, app, ipcMain, Menu, dialog } from "electron";
import { Server } from "node-osc";
import { join, basename } from "path";
import { Lux, ArtnetOutput } from "./core";

import initShowIpc from "./ipc/show";
import initEditorIpc from "./ipc/editor";
import initWelcomeIpc from "./ipc/welcome";
import initPatchIpc from "./ipc/patch";

let mainWindow: BrowserWindow;

const files: string[] = [];

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

app.whenReady().then(async () => {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    titleBarStyle: process.platform === "darwin" ? "hidden" : "default",
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
  initPatchIpc(lux, mainWindow, ipcMain);

  ipcMain.handle("platform", (): NodeJS.Platform => {
    return process.platform;
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    // mainWindow.maximize();

    if (files.length > 0) {
      (async () => {
        const show = await lux.open(files[0]);

        mainWindow.webContents.send("open-project");
        mainWindow.webContents.send(
          "window-title-update",
          show.name || basename(files[0])
        );
      })();
    }
  });

  if (app.isPackaged) {
    mainWindow.loadURL("file://" + join(__dirname, "../ui/dist/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }
});

app.on("open-file", async (_e, path) => {
  files.push(path);
});
