import MinerBot from './bot';

let minerBot = new MinerBot;

const renderLog = (message: string) => {
    postMessage(["log", message])
}

const reloadView = () => {
    postMessage(["reloadView"])
}

onmessage = (event: MessageEvent<any>) => {
    if (event.data[0] === "start") {
        minerBot.mainloop(event.data[1], event.data[2], event.data[3])
    } else if (event.data[0] === "stop") {
        minerBot.stop()
        minerBot = new MinerBot()
    } else if (event.data[0] === "updateSettings") {
        minerBot.updateSettings(event.data[1], event.data[2], event.data[3])
    } 
}

export {renderLog, reloadView}