import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import path = require('path');
import MinerBot from './bot';

let win: BrowserWindow = null;
let minerBot = new MinerBot;

function createWindow() {
    win = new BrowserWindow({
      width: 1920,
      height: 1080,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
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

const renderLog = (message: string) => {
  win.webContents.send('log', message)
}

const reloadView = () => {
  win.webContents.send("reloadView")
}

app.whenReady().then(() => {
  ipcMain.on("start", (event, username: string, password: string) => {
    minerBot.mainloop(username, password, "thevoid.pl")
  })

  ipcMain.on("stop", () => {
    minerBot.stop()
    minerBot = new MinerBot()
  })

  ipcMain.on("updateSettings", (event, settings: {"autocx": boolean, "autofix": boolean, "autodrop": boolean}) => {
    minerBot.updateSettings(settings)
  })
  
  createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

export {renderLog, reloadView}