import { BrowserWindow, app, ipcMain, Menu } from "electron";
import { join } from "path";
import Lux from "./core/lib";
import ArtnetOutput from "./core/outputs/artnet";

let mainWindow: BrowserWindow | undefined;

ipcMain.on("fixture-context-menu", () => {
  Menu.buildFromTemplate([
    {
      label: "Delete fixture",
    },
  ]).popup();
});

ipcMain.on("editor-context-menu", () => {
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

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    titleBarStyle: "hidden",
    show: false,
    backgroundColor: "#1A202C",
    title: "Lux",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
  });

  if (app.isPackaged) {
    mainWindow.loadURL("file://" + join(__dirname, "../ui/dist/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:3000");
  }
});
