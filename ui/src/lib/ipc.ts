import { IpcRenderer } from "electron";

declare global {
  interface Window {
    require<T>(m: string): T;
  }
}

export default window.require<{ ipcRenderer: IpcRenderer }>("electron")
  .ipcRenderer;
