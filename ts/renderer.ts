const log = document.getElementById("log")
const run = (document.getElementById("run") as HTMLInputElement)
const us = document.getElementById("us")
run.value = "Start"

window.api.handleLog( (_event, msg) => {
    log.innerText = log.innerText + "\n" + msg;
})

window.api.handleViewReload( (_event) => {
    (document.getElementById("view") as HTMLIFrameElement).contentWindow.location.reload()
})

run.addEventListener("click", function(ev: MouseEvent) {
    if (run.value === "Start") {
        const username = (document.getElementById("email") as HTMLInputElement).value
        const password = (document.getElementById("password") as HTMLInputElement).value
        window.api.start(username, password)
        run.value = "Stop";
    } else if (run.value === "Stop") {
        window.api.stop()
        run.value = "Start";
    }

})

document.getElementById("updateSettings").addEventListener("click", () => {
    const autocx: boolean = (document.getElementById("autocx") as HTMLInputElement).checked;
    const autofix: boolean = (document.getElementById("autofix")  as HTMLInputElement).checked;
    const autodrop: boolean = (document.getElementById("autodrop")  as HTMLInputElement).checked;

    window.api.updateSettings(autocx, autofix, autodrop)  
})

document.getElementById("reload").addEventListener("click", (_event) => {
    (document.getElementById('view') as HTMLIFrameElement).src += '';
})