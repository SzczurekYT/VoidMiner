import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import {Worker} from "worker_threads"
import path = require('path');

let win: BrowserWindow = null;
const worker = new Worker("./js/workerBot.js")

function createWindow() {
    win = new BrowserWindow({
      width: 1920,
      height: 1080,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegrationInWorker: true
      }
    })

    const menu = Menu.buildFromTemplate([
      {
        label: app.name,
        submenu: [
          {
            click: () => win.webContents.send('log', "Inc"),
            label: 'Increment',
          },
          {
            click: () => win.webContents.send('log', "Dec"),
            label: 'Decrement',
          },
          {
            click: () => win.webContents.openDevTools(),
            label: 'DevTools',
          }
        ]
      }
    ])
    Menu.setApplicationMenu(menu)

    win.loadFile("index.html")
  }  

app.whenReady().then(() => {
  ipcMain.on("start", (event, username: string, password: string) => {
    worker.postMessage(["start", username, password, "thevoid.pl"])
  })

  ipcMain.on("stop", () => {
    worker.postMessage(["stop"])
  })

  ipcMain.on("updateSettings", (event, autocx: boolean, autofix: boolean, autodrop: boolean) => {
    worker.postMessage(["updateSettings", autocx, autofix, autodrop])
  })

  worker.on("message", (data) => {
    if (data[0] === "log") {
      win.webContents.send('log', data[1])
    } else if (data[0] === "reloadView") {
      win.webContents.send("reloadView")
    }
  })
  
  createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })