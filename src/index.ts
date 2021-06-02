import { BrowserWindow, app, ipcMain, Menu } from "electron";
import { join } from "path";
import { Lux, ArtnetOutput, Fixture } from "./core";

import { readFile } from "fs/promises";
import initShowIpc from "./ipc/show";
import initEditorIpc from "./ipc/editor";

let mainWindow: BrowserWindow;

const lux = new Lux();
lux.attachOutput(new ArtnetOutput("192.168.1.255")).then(() => {
  console.log("Art-Net successfully connected");
});

readFile("fixtures.json").then((fixtures) => {
  const test = JSON.parse(fixtures.toString()).reduce(
    (acc: { [id: string]: Fixture }, curr: Fixture) => {
      return { ...acc, [curr.id]: curr };
    },
    {}
  );

  lux.fixtures = test;

  console.log("fixtures attached");
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
