import { BrowserWindow, app, ipcMain, Menu } from "electron";
import { join } from "path";

ipcMain.on("context-menu", () => {
  Menu.buildFromTemplate([
    {
      label: "hi",
    },
  ]).popup();
});

ipcMain.on("editor-context-menu", () => {
  Menu.buildFromTemplate([
    {
      label: "Select all",
      accelerator: "CommandOrControl+A",
      click: () => {
        console.log("select all");
      },
    },
    {
      label: "Invert selection",
      accelerator: "CommandOrControl+I",
      click: () => {
        console.log("invert");
      },
    },
  ]).popup();
});

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    titleBarStyle: "hidden",
    show: false,
    backgroundColor: "#1A202C",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.on("ready-to-show", () => {
    win.show();
  });

  if (app.isPackaged) {
    win.loadURL("file://" + join(__dirname, "../ui/dist/index.html"));
  } else {
    win.loadURL("http://localhost:3000");
  }
});
