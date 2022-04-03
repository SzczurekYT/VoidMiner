const log = document.getElementById("log")
const run = (document.getElementById("run") as HTMLInputElement)
const us = document.getElementById("us")
const worker = new Worker("./js/workerBot.js")
run.value = "Start"

const renderLog = (message: string) => {
    log.innerText = log.innerText + "\n" + message;
}

const reloadView = () => {
    (document.getElementById('view') as HTMLIFrameElement).src += '';
}

worker.onmessage = (event: MessageEvent<any>) => {
    if (event.data[0] === "log") {
        renderLog(event.data[1])
    } else if (event.data[0] === "reloadView") {
      reloadView();
    }
  }

run.addEventListener("click", function(ev: MouseEvent) {
    if (run.value === "Start") {
        const username = (document.getElementById("email") as HTMLInputElement).value
        const password = (document.getElementById("password") as HTMLInputElement).value
        renderLog(password)
        worker.postMessage(["start", username, password, "thevoid.pl"])
        run.value = "Stop";
    } else if (run.value === "Stop") {
        worker.postMessage(["stop"])
        run.value = "Start";
    }

})

document.getElementById("updateSettings").addEventListener("click", () => {
    const autocx: boolean = (document.getElementById("autocx") as HTMLInputElement).checked;
    const autofix: boolean = (document.getElementById("autofix")  as HTMLInputElement).checked;
    const autodrop: boolean = (document.getElementById("autodrop")  as HTMLInputElement).checked;

    worker.postMessage(["updateSettings", autocx, autofix, autodrop])
})

document.getElementById("reload").addEventListener("click", reloadView)