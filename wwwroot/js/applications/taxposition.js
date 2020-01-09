﻿var HeaderName = "Tax Position";
var isCheckBoxSelected = false;
var isCheckBoxSelectedGRA = false;
var isCheckBoxSelectedPaye = false;
var isCheckBoxSelectedAll = false;
var ServerUrl = $("#serverUrl").val();
var postTaxPosition = `${ServerUrl}api/TCC/PostTaxPositionSummary?taxpayerId=`;
let tccUpdateUrl = `${ServerUrl}api/TCC/UpdateTCCApplication?id=`;

var LoadTaxSummaryTable = function (listOfSummary) {

    let output = "";
    let sortedArray = listOfSummary.sort(function (a, b) {
        return (a.assessmentYear - b.assessmentYear);
    });

    for (var i = 0; i < sortedArray.length; i++) {
        output = output + '<tr><td align="center" id="assessmentYear' + i + '">' + listOfSummary[i].assessmentYear + '</td><td align="center" style="color: black" contenteditable="true" id="statusColumn' + i
            + '" class=""></td><td align="right" style="color: black" contenteditable="true"  id="chargeableIncomeColumn' + i
            + '" class="valueCell"></td><td align="right" style="color: black" id="taxChargedColumn' + i
            + '" class=""></td><td align="right" style="color: black" contenteditable="true" id="taxPaidColumn' + i
            + '" class="valueCell"></td><td align="right" style="color: black" id="taxOutstandingColumn' + i
            + '" class=""></td></tr>';
    }

    output = output;
    $("#TaxPositionSummaryGrid").html(output);
};

var apiCaller = function (url, type, data, callback) {
    $('html').showLoading();

    $.ajax({
        url: url,
        type: type,
        crossDomain: true,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        headers: {
        },
        dataType: 'json',
        success: function (response) {
            if (callback) {
                callback(response.body);
            };
            $('html').hideLoading();
        },
        error: function (error) {
            $('html').hideLoading();
            toastr.error('An error occured');
        }
    });
};

$(document).ready(function () {

    var previousYear = new Date().getFullYear() - 1;
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1;
    var monthsArray = ["None", "Jan", "Feb", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
    var MonthYear = monthsArray[currentMonth] + ", " + currentYear;

    $("#pgHeader").text(HeaderName);
    $("#previousYear").text(previousYear);
    $("#currentMonthYear").text(MonthYear);

    bootstrapPage();
});

var bootstrapPage = function () {
    var d = new Date();
    var data = [];

    for (let i = d.getFullYear(); i >= d.getFullYear() - 2; i--) {
        data.push({
            assessmentYear: i, status: "", chargeableIncome: "", taxCharged: "", taxPaid: "", taxOutstanding: ""
        });
    };

    LoadTaxSummaryTable(data);
};

$("#confirmationBox").on('click', function () {
    if ($(this).is(':checked')) {
        isCheckBoxSelected = true;
        if (isCheckBoxSelectedAll && isCheckBoxSelectedGRA && isCheckBoxSelectedPaye)
            $("#saveTaxPositionSummary").removeAttr('disabled');
    } else {
        isCheckBoxSelected = false;
        $("#saveTaxPositionSummary").attr("disabled", true);
    }
});

$("#confirmationBoxPaye").on('click', function () {
    if ($(this).is(':checked')) {
        isCheckBoxSelectedPaye = true;
        if (isCheckBoxSelectedAll && isCheckBoxSelectedGRA && isCheckBoxSelected)
            $("#saveTaxPositionSummary").removeAttr('disabled');
    } else {
        isCheckBoxSelectedPaye = false;
        $("#saveTaxPositionSummary").attr("disabled", true);
    }
});

$("#confirmationBoxAll").on('click', function () {
    if ($(this).is(':checked')) {
        isCheckBoxSelectedAll = true;
        if (isCheckBoxSelected && isCheckBoxSelectedGRA && isCheckBoxSelectedPaye)
            $("#saveTaxPositionSummary").removeAttr('disabled');
    } else {
        isCheckBoxSelectedAll = false;
        $("#saveTaxPositionSummary").attr("disabled", true);
    }
});

$("#confirmationBoxGRA").on('click', function () {
    if ($(this).is(':checked')) {
        isCheckBoxSelectedGRA = true;
        if (isCheckBoxSelectedAll && isCheckBoxSelected && isCheckBoxSelectedPaye)
            $("#saveTaxPositionSummary").removeAttr('disabled');
    } else {
        isCheckBoxSelectedGRA = false;
        $("#saveTaxPositionSummary").attr("disabled", true);
    }
});

$("#TaxPositionSummaryGrid").on('focus', '.valueCell', function (event) {
    if (event.target.innerText === "")
        $("#" + event.target.id).text("");
    else {
        var val = parseFloat(event.target.innerText.replace(/,/g, ''));
        $("#" + event.target.id).text(val);
    }
});

$("#TaxPositionSummaryGrid").on('focusout', '.valueCell', function (event) {

    $("#" + event.target.id).text(parseFloat(event.target.innerText).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') === "NaN" ? "" : parseFloat(event.target.innerText).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    var taxOustanding0 = parseFloat($("#taxChargedColumn0").text() !== "" ? $("#taxChargedColumn0").text().replace(/,/g, '') : 0) - parseFloat($("#taxPaidColumn0").text() !== "" ? $("#taxPaidColumn0").text().replace(/,/g, '') : 0);
    var taxOustanding1 = parseFloat($("#taxChargedColumn1").text() !== "" ? $("#taxChargedColumn1").text().replace(/,/g, '') : 0) - parseFloat($("#taxPaidColumn1").text() !== "" ? $("#taxPaidColumn1").text().replace(/,/g, '') : 0);
    var taxOustanding2 = parseFloat($("#taxChargedColumn2").text() !== "" ? $("#taxChargedColumn2").text().replace(/,/g, '') : 0) - parseFloat($("#taxPaidColumn2").text() !== "" ? $("#taxPaidColumn2").text().replace(/,/g, '') : 0);

    var updateTaxCharged = function (res) {
        let taxChargedColumn = "";

        if (event.target.id === "chargeableIncomeColumn0") {
            taxChargedColumn = "taxChargedColumn0";
        } else if (event.target.id === "chargeableIncomeColumn1") {
            taxChargedColumn = "taxChargedColumn1";
        } else if (event.target.id === "chargeableIncomeColumn2") {
            taxChargedColumn = "taxChargedColumn2";
        }

        $("#" + taxChargedColumn).text(parseFloat(res[0].nTaxAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    };

    $("#taxOutstandingColumn0").text(taxOustanding0 < 0 ? '(' + Math.abs(taxOustanding0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ')' : taxOustanding0.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxOutstandingColumn1").text(taxOustanding1 < 0 ? '(' + Math.abs(taxOustanding1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ')' : taxOustanding1.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxOutstandingColumn2").text(taxOustanding2 < 0 ? '(' + Math.abs(taxOustanding2).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ')' : taxOustanding2.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    if (event.currentTarget.id === "chargeableIncomeColumn0") {

        let startdate = $("#assessmentYear0").text() + "-1-1";
        let enddate = $("#assessmentYear0").text() + "-12-31";
        let amount = parseFloat(event.target.innerText.split(".")[0].replace(",", ""));

        var url = `${ServerUrl}api/Transaction/TaxCalculatorAsync?amount=` + amount + `&startdate=` + startdate + `&enddate=` + enddate;

        if (amount > 0)
            apiCaller(url, "GET", "", updateTaxCharged);

    } else if (event.currentTarget.id === "chargeableIncomeColumn1") {

        let startdate = $("#assessmentYear1").text() + "-1-1";
        let enddate = $("#assessmentYear1").text() + "-12-31";
        let amount = parseFloat(event.target.innerText.split(".")[0].replace(",", ""));

        var url = `${ServerUrl}api/Transaction/TaxCalculatorAsync?amount=` + amount + `&startdate=` + startdate + `&enddate=` + enddate;

        if (amount > 0)
            apiCaller(url, "GET", "", updateTaxCharged);

    } else if (event.currentTarget.id === "chargeableIncomeColumn2") {

        let startdate = $("#assessmentYear2").text() + "-1-1";
        let enddate = $("#assessmentYear2").text() + "-12-31";
        let amount = parseFloat(event.target.innerText.split(".")[0].replace(",", ""));

        var url = `${ServerUrl}api/Transaction/TaxCalculatorAsync?amount=` + amount + `&startdate=` + startdate + `&enddate=` + enddate;

        if (amount > 0)
            apiCaller(url, "GET", "", updateTaxCharged);
    }
});

$("#saveTaxPositionSummary").click(function (e) {
    e.preventDefault();

    var summaryData = [];

    var row1 = {
        "id": "",
        "status": $("#statusColumn0").text(),
        "assessmentYear": $("#assessmentYear0").text(),
        "chargeableIncome": $("#chargeableIncomeColumn0").text(),
        "taxCharged": $("#taxChargedColumn0").text(),
        "taxOutstanding": $("#taxOutstandingColumn0").text().includes('(') ? $("#taxOutstandingColumn0").text().substring(1, $("#taxOutstandingColumn0").text().length - 1) : $("#taxOutstandingColumn0").text(),
        "taxPaid": $("#taxPaidColumn0").text()
    }

    summaryData.push(row1);

    var row2 = {
        "id": "",
        "status": $("#statusColumn1").text(),
        "assessmentYear": $("#assessmentYear1").text(),
        "chargeableIncome": $("#chargeableIncomeColumn1").text(),
        "taxCharged": $("#taxChargedColumn1").text(),
        "taxOutstanding": $("#taxOutstandingColumn1").text().includes('(') ? $("#taxOutstandingColumn1").text().substring(1, $("#taxOutstandingColumn1").text().length - 1) : $("#taxOutstandingColumn1").text(),
        "taxPaid": $("#taxPaidColumn1").text()
    }

    summaryData.push(row2);

    var row3 = {
        "id": "",
        "status": $("#statusColumn2").text(),
        "assessmentYear": $("#assessmentYear2").text(),
        "chargeableIncome": $("#chargeableIncomeColumn2").text(),
        "taxCharged": $("#taxChargedColumn2").text(),
        "taxOutstanding": $("#taxOutstandingColumn2").text().includes('(') ? $("#taxOutstandingColumn2").text().substring(1, $("#taxOutstandingColumn2").text().length - 1) : $("#taxOutstandingColumn2").text(),
        "taxPaid": $("#taxPaidColumn2").text()
    }

    summaryData.push(row3);

    var arrayObject = {
        Summary: summaryData
    };

    var url = `${postTaxPosition}` + $("#taxpayerId").val() + "&appId=" + $("#appId").val();

    apiCaller(url, 'POST', arrayObject, updateApplication);
});

var updateApplication = function () {
    toastr.success('Tax position successfully saved!');

    var updateUrl = tccUpdateUrl + $("#appId").val();
    var Obje = JSON.parse(localStorage.getItem('taxpositionObj'));

    let ObjectToSend = {
        "status": Obje.status,
        "taxpayerComment": Obje.taxpayerComment,
        "internalComment": Obje.internalComment,
        "applicationId": Obje.applicationId,
    };

    apiCaller(updateUrl, "PUT", ObjectToSend, notify);
};

var notify = function () {
    toastr.success('Application is pending approval');

    setTimeout(function () {
        window.location.href = "/applications/tcc";
    }, 3000);
};