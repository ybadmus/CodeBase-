$(document).ready(() => {
    $("#ItapsReportViewer_viewBlockContainer").prop("hidden", true);
})

var CloseReport = () => {
    window.location = document.referrer;
}