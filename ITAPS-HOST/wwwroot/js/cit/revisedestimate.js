var HeaderName = "CIT Revised Estimates";
var hideAndShowThings = function () {
    $("#gridView").hide();
    $("#revisedEstimateDetail").show();
    $("#returnDetail").hide();
};

var bootstrapNotification = function () {
    $("#pgHeader").text(HeaderName);
    $("#gridView").hide();
    $("#revisedEstimateDetail").hide();
    $("#returnDetail").show();
};

var loadDetails = function (trId) {
    let url = `${citRevEstimatesDetailsUrl}${trId}`;

    apiCaller(url, "GET", "", loadForm)
};

var loadForm = function (response) {

    if (response) {
        let resp = response[0];

        $("#dateSubmitted").text(resp.submittedDate);
        $("#taxPayerName").text(resp.taxpayerName);
        $("#taxPayerTin").text(resp.taxpayerTIN);
        $("#assessmentYearView").text(resp.assessmentYear);
        $("#startDateView").text(resp.fromPeriod);
        $("#endDateView").text(resp.toPeriod);

        $("#estimatedAnnualChargeableIncome").text(parseFloat(resp.estimatedAnnualChargeableIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#revAnnualIncomeTaxPayable").text(parseFloat(resp.revAnnualIncomeTaxPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#incomeTaxPaid").text(parseFloat(resp.incomeTaxPaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#incomeTaxBalDue").text(parseFloat(resp.incomeTaxBalDue).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#incomeTaxToPay").text(parseFloat(resp.incomeTaxToPay).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#quartersOutstanding").text(parseFloat(resp.quartersOutstanding).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#revAnnualLevyPayable").text(parseFloat(resp.revAnnualLevyPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#levyAmtPaid").text(parseFloat(resp.levyAmtPaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#levyBalDue").text(parseFloat(resp.levyBalDue).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#levyAmtToPay").text(parseFloat(resp.levyAmtToPay).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

        hideAndShowThings();
    }
    else
        toastr.error("An error occured");
};

$("#backToGrid").click(function () {

    $("#gridView").show();
    $("#revisedEstimateDetail").hide();
});

var searchPIT = function () {
    objToSend.assessmentYear = activeYear === "" ? new Date().getFullYear() : activeYear;
    objToSend.taxOfficeId = activeTaxOffice;
    objToSend.transactionType = "RevisedEstimate";
    objToSend.tin = $("#tinHolder").val();
    objToSend.startDate = $("#startDate").val();
    objToSend.endDate = $("#endDate").val();

    let url = `${searchPITByTaxOffice}`;

    $("#Grid").data("kendoGrid").dataSource.data([]);
    apiCaller(url, "POST", objToSend, initializeKendoGrid);
};