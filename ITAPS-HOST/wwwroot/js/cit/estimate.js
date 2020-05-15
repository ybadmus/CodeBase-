var HeaderName = "CIT Estimates";
var hideAndShowThings = function () {
    $("#gridView").hide();
    $("#estimateDetail").show();
};

var bootstrapNotification = function () {
    $("#pgHeader").text(HeaderName);
    $("#gridView").hide();
    $("#estimateDetail").hide();
};

var loadDetails = function (trId) {
    let url = `${citEstimatesDetailsUrl}${trId}`;

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
        $("#estimatedAnnualLevyPayable").text(parseFloat(resp.estimatedAnnualLevyPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#estimatedIncomeTaxPaid").text(parseFloat(resp.estimatedIncomeTaxPaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#estimatedQuarterlyIncomeTaxPayable").text(parseFloat(resp.estimatedQuarterlyIncomeTaxPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#estimatedQuarterlyLevyPayable").text(parseFloat(resp.estimatedQuarterlyLevyPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#taxRate").text(parseFloat(resp.taxRate).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

        hideAndShowThings();
    }
    else
        toastr.error("An error occured");
};

$("#backToGrid").click(function () {

    $("#gridView").show();
    $("#estimateDetail").hide();
});

var searchPIT = function () {
    objToSend.assessmentYear = activeYear === "" ? new Date().getFullYear() : activeYear;
    objToSend.taxOfficeId = activeTaxOffice;
    objToSend.transactionType = "Estimate";
    objToSend.tin = $("#tinHolder").val();
    objToSend.startDate = $("#startDate").val();
    objToSend.endDate = $("#endDate").val();

    let url = `${searchPITByTaxOffice}`;

    $("#Grid").data("kendoGrid").dataSource.data([]);
    apiCaller(url, "POST", objToSend, initializeKendoGrid);
};