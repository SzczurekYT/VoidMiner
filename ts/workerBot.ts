import { parentPort } from 'worker_threads';
import MinerBot from './bot';

let minerBot = new MinerBot;

const renderLog = (message: string) => {
    parentPort.postMessage(["log", message])
}

const reloadView = () => {
    parentPort.postMessage(["reloadView"])
}

parentPort.on("message", (data) => {
    if (data[0] === "start") {
        minerBot.mainloop(data[1], data[2], data[3])
    } else if (data[0] === "stop") {
        minerBot.stop()
        minerBot = new MinerBot()
    } else if (data[0] === "updateSettings") {
        minerBot.updateSettings(data[1], data[2], data[3])
    } 
})

export {renderLog, reloadView}