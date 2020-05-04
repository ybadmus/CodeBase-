var HeaderName = "CIT Estimates";
var hideAndShowThings = function () {
    $("#gridView").hide();
    $("#estimateDetail").show();
    $("#returnDetail").hide();
};

var bootstrapNotification = function () {
    $("#pgHeader").text(HeaderName);
    $("#gridView").hide();
    $("#estimateDetail").hide();
    $("#returnDetail").show();
};

var loadDetails = function (trId) {
    let url = `${pitDetailsUrl}`;

    let objSend = {
        "transactionId": trId,
        "taxType": "CIT",
        "transactionType": "Estimate"
    };

    apiCaller(url, "POST", objSend, loadForm)
};

var loadForm = function (response) {

    if (response) {
        let resp = response[0];

        $("#assessmentYearView").text(resp.assessmentYear);
        $("#startDateView").text(resp.startDate);
        $("#endDateView").text(resp.endDate);
        $("#nationality").text(resp.nationality);
        $("#businessIncome").text(parseFloat(resp.businessIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#employmentIncome").text(parseFloat(resp.employmentIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#investmentOtherIncome").text(parseFloat(resp.investmentOtherIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#totalIncome").text(parseFloat(resp.totalIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#annualChargeableIncome").text(parseFloat(resp.annualChargeableIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#annualTotalIncomeTaxPayable").text(parseFloat(resp.annualTotalIncomeTaxPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#quarterlyIncomeTaxPayable").text(parseFloat(resp.quarterlyIncomeTaxPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

        hideAndShowThings();
    }
    else
        toastr.error("An error occured");
};

$("#backToGrid2").click(function () {

    $("#gridView").show();
    $("#estimateDetail").hide();
});