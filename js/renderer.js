var log = document.getElementById("log");
var run = document.getElementById("run");
var us = document.getElementById("us");
run.value = "Start";
window.api.handleLog(function (_event, msg) {
    log.innerText = log.innerText + "\n" + msg;
});
window.api.handleViewReload(function (_event) {
    document.getElementById("view").contentWindow.location.reload();
});
run.addEventListener("click", function (ev) {
    if (run.value === "Start") {
        var username = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        window.api.start(username, password);
        run.value = "Stop";
    }
    else if (run.value === "Stop") {
        window.api.stop();
        run.value = "Start";
    }
});
document.getElementById("updateSettings").addEventListener("click", function () {
    var autocx = document.getElementById("autocx").checked;
    var autofix = document.getElementById("autofix").checked;
    var autodrop = document.getElementById("autodrop").checked;
    window.api.updateSettings(autocx, autofix, autodrop);
});
document.getElementById("reload").addEventListener("click", function (_event) {
    document.getElementById('view').src += '';
});
