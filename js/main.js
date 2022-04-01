"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var worker_threads_1 = require("worker_threads");
var path = require("path");
var win = null;
var worker = new worker_threads_1.Worker("./js/workerBot.js");
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1920,
        height: 1080,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegrationInWorker: true
        }
    });
    var menu = electron_1.Menu.buildFromTemplate([
        {
            label: electron_1.app.name,
            submenu: [
                {
                    click: function () { return win.webContents.send('log', "Inc"); },
                    label: 'Increment'
                },
                {
                    click: function () { return win.webContents.send('log', "Dec"); },
                    label: 'Decrement'
                },
                {
                    click: function () { return win.webContents.openDevTools(); },
                    label: 'DevTools'
                }
            ]
        }
    ]);
    electron_1.Menu.setApplicationMenu(menu);
    win.loadFile("index.html");
}
electron_1.app.whenReady().then(function () {
    electron_1.ipcMain.on("start", function (event, username, password) {
        worker.postMessage(["start", username, password, "thevoid.pl"]);
    });
    electron_1.ipcMain.on("stop", function () {
        worker.postMessage(["stop"]);
    });
    electron_1.ipcMain.on("updateSettings", function (event, autocx, autofix, autodrop) {
        worker.postMessage(["updateSettings", autocx, autofix, autodrop]);
    });
    worker.on("message", function (data) {
        if (data[0] === "log") {
            win.webContents.send('log', data[1]);
        }
        else if (data[0] === "reloadView") {
            win.webContents.send("reloadView");
        }
    });
    createWindow();
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
