import { ipcRenderer, contextBridge } from "electron";
import api from "./api";

contextBridge.exposeInMainWorld("api", api);
