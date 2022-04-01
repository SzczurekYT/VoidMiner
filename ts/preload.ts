import { contextBridge, ipcRenderer } from 'electron'

export const API = {
    handleLog: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('log', callback),
    handleViewReload: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on("reloadView", callback),
    start: (username: string, password: string) => ipcRenderer.send("start", username, password),
    stop: () => ipcRenderer.send("stop"),
    updateSettings: (autocx: boolean, autofix: boolean, autodrop: boolean) => ipcRenderer.send("updateSettings", autocx, autofix, autodrop)    
}

contextBridge.exposeInMainWorld('api', API)