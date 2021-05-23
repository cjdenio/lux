import { IpcRenderer } from "electron";

declare function require(m: string): any;

let ipc: IpcRenderer;

export default ipc = require("electron").ipcRenderer as IpcRenderer;
