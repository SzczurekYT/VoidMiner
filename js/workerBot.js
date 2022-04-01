"use strict";
exports.__esModule = true;
exports.reloadView = exports.renderLog = void 0;
var worker_threads_1 = require("worker_threads");
var bot_1 = require("./bot");
var minerBot = new bot_1["default"];
var renderLog = function (message) {
    worker_threads_1.parentPort.postMessage(["log", message]);
};
exports.renderLog = renderLog;
var reloadView = function () {
    worker_threads_1.parentPort.postMessage(["reloadView"]);
};
exports.reloadView = reloadView;
worker_threads_1.parentPort.on("message", function (data) {
    if (data[0] === "start") {
        minerBot.mainloop(data[1], data[2], data[3]);
    }
    else if (data[0] === "stop") {
        minerBot.stop();
        minerBot = new bot_1["default"]();
    }
    else if (data[0] === "updateSettings") {
        minerBot.updateSettings(data[1], data[2], data[3]);
    }
});
