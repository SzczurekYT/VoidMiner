const log = document.getElementById("log")
const run = (document.getElementById("run") as HTMLInputElement)
const us = document.getElementById("us")

const updateSettings = () => {
    window.api.updateSettings({
        "autocx": (document.getElementById("autocx") as HTMLInputElement).checked,
        "autofix": (document.getElementById("autofix")  as HTMLInputElement).checked,
        "autodrop": (document.getElementById("autodrop")  as HTMLInputElement).checked
    })
}

run.value = "Start"

window.api.handleLog((event, message: string) => {
    log.innerText = log.innerText + "\n" + message;
})

window.api.handleViewReload((event) => {
    (document.getElementById('view') as HTMLIFrameElement).src += '';
})

run.addEventListener("click", function(ev: MouseEvent) {
    if (run.value === "Start") {
        
        const username = (document.getElementById("email") as HTMLInputElement).value
        const password = (document.getElementById("password") as HTMLInputElement).value

        window.api.start(username, password)
        updateSettings()
        run.value = "Stop";
    } else if (run.value === "Stop") {

        window.api.stop()
        run.value = "Start";
    }

})

const settingElements = Array.from(document.getElementsByClassName("setting"))
for (const setting of settingElements) {
    setting.addEventListener("change", () => {
        updateSettings()
    })
}