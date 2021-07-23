import type { IpcRenderer } from "electron";

const ipc: IpcRenderer = window.require("electron").ipcRenderer;

export default ipc;
