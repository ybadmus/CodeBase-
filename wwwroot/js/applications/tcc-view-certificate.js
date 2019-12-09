var reportObject = $("#TCCReportViewer").data("ejReportViewer");

//console.log(reportObject);

initViewer();

var parameters = [];

$("#TCCReportViewer").ejReportViewer(
    {
        //exportSettings: { excelFormat: ej.ReportViewer.ExcelFormats.Excel97to2003 },
        zoomFactor: 1,
        printMode: false
    }
);

params = getParameters();

for (var i = 0; i < params.length; i++) {
    parameters.push({ name: params[i].name, labels: [params[i].value], values: [params[i].value], nullable: "true" });// pass the parameter values
}

$("#TCCReportViewer_toolbar_li_pdf").click();

function getParameters() {
    var parameters = window.location.search.substr(1);//get the parameter values from url
    var listParams = [];
    if (parameters != "") {
        var splitValues = parameters.split("&");
        for (var i = 0; i < splitValues.length; i++) {
            var tempValue = splitValues[i].split("=");
            listParams.push({ name: tempValue[0], value: tempValue[1] });// sepearte the name and value of the parameter
        }
    }
    console.log(listParams);

    return listParams;
}

function ajaxBeforeLoad(event) {
    event.model.parameters = parameters;
};

function initViewer() {
    $(".page__container").contents().filter(function () {
        return this.nodeType != 1;
    }).replaceWith("");

};

function eventFire(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
};

eventFire(document.getElementById("TCCReportViewer_toolbar_li_export"), 'click');

    //setInterval(function () {
        //$("#TCCReportViewer_toolbar_li_export").click();

        //if ($('#TCCReportViewer_toolbar_li_pdf').length) {
            //console.log("Exists!");
            //$("#TCCReportViewer_toolbar_li_pdf").click();
            //clearInterval();
        //}
   // }, 100);

    //checkExist();

    //$("#TCCReportViewer_pageviewbodyContainer").ready(function () {

    //    $("#TCCReportViewer_toolbar_li_pdf").click()
    //});
