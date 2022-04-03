import { app, BrowserWindow, Menu, ipcMain } from 'electron'

let win: BrowserWindow = null;

function createWindow() {
    win = new BrowserWindow({
      width: 1920,
      height: 1080,
      autoHideMenuBar: true,
      webPreferences: {
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
  createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })