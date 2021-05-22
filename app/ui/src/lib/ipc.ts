import { IpcRenderer } from "electron";

declare function require(m: string): any;

let ipc: any;

if (window.hasOwnProperty("require")) {
  console.log("sad");
  ipc = require("electron").ipcRenderer as IpcRenderer;
} else {
  console.log("yay");
  ipc = {};
}

export default ipc;
