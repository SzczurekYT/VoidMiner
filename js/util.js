"use strict";
exports.__esModule = true;
exports.sleep = void 0;
function sleep(secs) {
    return new Promise(function (resolve) { return setTimeout(resolve, secs * 1000); });
}
exports.sleep = sleep;
