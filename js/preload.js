"use strict";
exports.__esModule = true;
exports.API = void 0;
var electron_1 = require("electron");
exports.API = {
    handleLog: function (callback) { return electron_1.ipcRenderer.on('log', callback); },
    handleViewReload: function (callback) { return electron_1.ipcRenderer.on("reloadView", callback); },
    start: function (username, password) { return electron_1.ipcRenderer.send("start", username, password); },
    stop: function () { return electron_1.ipcRenderer.send("stop"); },
    updateSettings: function (autocx, autofix, autodrop) { return electron_1.ipcRenderer.send("updateSettings", autocx, autofix, autodrop); }
};
electron_1.contextBridge.exposeInMainWorld('api', exports.API);
