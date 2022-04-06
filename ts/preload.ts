import { contextBridge, ipcRenderer } from 'electron'

export const API = {
    handleLog: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('log', callback),
    handleViewReload: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on("reloadView", callback),
    start: (username: string, password: string) => ipcRenderer.send("start", username, password),
    stop: () => ipcRenderer.send("stop"),
    updateSettings: (settings: {"autocx": boolean, "autofix": boolean, "autodrop": boolean}) => ipcRenderer.send("updateSettings", settings)    
}

contextBridge.exposeInMainWorld('api', API)