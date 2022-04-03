import MinerBot from './bot';
const log = document.getElementById("log")
const run = (document.getElementById("run") as HTMLInputElement)
const us = document.getElementById("us")

let minerBot = new MinerBot;

run.value = "Start"

const renderLog = (message: string) => {
    log.innerText = log.innerText + "\n" + message;
}

const reloadView = () => {
    (document.getElementById('view') as HTMLIFrameElement).src += '';
}

run.addEventListener("click", function(ev: MouseEvent) {
    if (run.value === "Start") {
        
        const username = (document.getElementById("email") as HTMLInputElement).value
        const password = (document.getElementById("password") as HTMLInputElement).value

        minerBot.mainloop(username, password, "thevoid.pl")
        minerBot = new MinerBot()
        run.value = "Stop";
    } else if (run.value === "Stop") {

        minerBot.stop()
        run.value = "Start";
    }

})

document.getElementById("updateSettings").addEventListener("click", () => {
    const autocx: boolean = (document.getElementById("autocx") as HTMLInputElement).checked;
    const autofix: boolean = (document.getElementById("autofix")  as HTMLInputElement).checked;
    const autodrop: boolean = (document.getElementById("autodrop")  as HTMLInputElement).checked;

    minerBot.updateSettings(autocx, autofix, autodrop)
})

document.getElementById("reload").addEventListener("click", reloadView)

export {renderLog, reloadView}