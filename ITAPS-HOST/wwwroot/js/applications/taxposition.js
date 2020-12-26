var HeaderName = "Tax Position";
var isCheckBoxSelected = false;
var isCheckBoxSelectedGRA = false;
var isCheckBoxSelectedPaye = false;
var isCheckBoxSelectedAll = false;
var ServerUrl = $("#serverUrl").val();
//var postTaxPosition = `${ServerUrl}api/TCC/PostTaxPositionSummary?taxpayerId=`;
var postTaxPosition = `${ServerUrl}api/TCC/PostTaxPositionSummary?appId=`;
let tccUpdateUrl = `${ServerUrl}api/TCC/UpdateTCCApplication?id=`;
var statusColumn0 = "";
var statusColumn1 = "";
var statusColumn2 = "";

var LoadTaxSummaryTable = function (listOfSummary) {

    let output = "";
    let sortedArray = listOfSummary.sort(function (a, b) {
        return (a.assessmentYear - b.assessmentYear);
    }); 

    for (var i = 0; i < sortedArray.length; i++) {
        output = output + '<tr><td align="center" style="min-width:80px;" id="assessmentYear' + i + '">' + listOfSummary[i].assessmentYear + '</td>'
            + '<td align="center" style="color: black; min-width:180px;"><select type="text" id="statusColumn' + i + '" class="form-control">'
            + '<option value="" selected="selected">Choose Status</option><option value="NID">Not In Dispute</option><option value="PROV">Provisional</option>'
            + '<option value="S/A">Self-Assessment</option><option value="FINAL">Finalized</option><option value="NLT">Not Liable for Tax</option></select></td>'
            + '<td align="right" style="color: black; width: 20%; padding: 0px 3px;" class="valueCell"><input id="chargeableIncomeColumn' + i + '" style="width: 100%; border: 1px solid silver;border-radius: 5px;text-align: right;padding: 2px 5px;" /></td>'
            + '<td align="right" style="color: black; width: 18%;" id="taxChargedColumn' + i + '" class=""></td>'
            + '<td align="right" style="color: black; width: 20%; padding: 0px 3px;" class="valueCell"><input id="taxPaidColumn' + i + '" style="width: 100%;border:1px solid silver;border-radius: 5px;text-align: right;padding: 2px 5px;" /></td>'
            + '<td align="right" style="color: black; width: 18%;" id="taxOutstandingColumn' + i + '" class=""></td></tr>';
    }

    output = output;
    $("#TaxPositionSummaryGrid").html(output);

    var cells = document.querySelectorAll("tr input");

    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("keypress", handler);
    }
};

var handler = function () {

    const allowedRegex = /[0-9]/g;

    if (!event.key.match(allowedRegex)) {
        return event.preventDefault();
    }

    console.log(event);
}

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
    var currentMonth = new Date().getMonth();
    var monthsArray = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
        if (isCheckBoxSelected && isCheckBoxSelectedGRA && isCheckBoxSelectedAll && isCheckBoxSelectedPaye) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        } else if (isCheckBoxSelected && isCheckBoxSelectedGRA && isCheckBoxSelectedAll && !isCheckBoxSelectedPaye) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        } else {
            $("#saveTaxPositionSummary").attr("disabled", true);
        }
    }
    else {
        isCheckBoxSelected = false;
        if (!isCheckBoxSelected && isCheckBoxSelectedGRA && isCheckBoxSelectedAll && !isCheckBoxSelectedPaye) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        } else if (!isCheckBoxSelected && isCheckBoxSelectedGRA && isCheckBoxSelectedAll && isCheckBoxSelectedPaye) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        } else {
            $("#saveTaxPositionSummary").attr("disabled", true);
        }
    }
});

$("#confirmationBoxPaye").on('click', function () {
    if ($(this).is(':checked')) {
        isCheckBoxSelectedPaye = true;
        if (isCheckBoxSelectedPaye && isCheckBoxSelectedAll && isCheckBoxSelectedGRA && isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        } else if (isCheckBoxSelectedPaye && isCheckBoxSelectedAll && isCheckBoxSelectedGRA && !isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        } else {
            $("#saveTaxPositionSummary").attr("disabled", true);
        }
    } else {
        isCheckBoxSelectedPaye = false;
        if (!isCheckBoxSelectedPaye && isCheckBoxSelectedAll && isCheckBoxSelectedGRA && isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        } else if (!isCheckBoxSelectedPaye && isCheckBoxSelectedAll && isCheckBoxSelectedGRA && !isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        } else {
            $("#saveTaxPositionSummary").attr("disabled", true);
        }
    }
});

$("#confirmationBoxAll").on('click', function () {
    if ($(this).is(':checked')) {
        isCheckBoxSelectedAll = true;
        if (isCheckBoxSelectedGRA && isCheckBoxSelectedAll && isCheckBoxSelectedPaye && isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        }
        else if (isCheckBoxSelectedGRA && isCheckBoxSelectedAll && !isCheckBoxSelectedPaye && !isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        }
        else if (isCheckBoxSelectedGRA && isCheckBoxSelectedAll && isCheckBoxSelectedPaye && !isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        }
        else if (isCheckBoxSelectedGRA && isCheckBoxSelectedAll && !isCheckBoxSelectedPaye && isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        } else {
            $("#saveTaxPositionSummary").attr("disabled", true);
        }
    } else {
        isCheckBoxSelectedAll = false;
        $("#saveTaxPositionSummary").attr("disabled", true);
    }
});

$("#confirmationBoxGRA").on('click', function () {
    if ($(this).is(':checked')) {
        isCheckBoxSelectedGRA = true;
        if (isCheckBoxSelectedGRA && isCheckBoxSelectedAll && isCheckBoxSelectedPaye && isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        }
        else if (isCheckBoxSelectedGRA && isCheckBoxSelectedAll && !isCheckBoxSelectedPaye && !isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        }
        else if (isCheckBoxSelectedGRA && isCheckBoxSelectedAll && isCheckBoxSelectedPaye && !isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        }
        else if (isCheckBoxSelectedGRA && isCheckBoxSelectedAll && !isCheckBoxSelectedPaye && isCheckBoxSelected) {
            $("#saveTaxPositionSummary").removeAttr('disabled');
        } else {
            $("#saveTaxPositionSummary").attr("disabled", true);
        }
    } else {
        isCheckBoxSelectedGRA = false;
        $("#saveTaxPositionSummary").attr("disabled", true);
    }
});

//$("#TaxPositionSummaryGrid").on('focus', '.valueCell', function (event) {

//    if (event.target.innerText === "" || event.target.innerText === "\n")
//        $("#" + event.target.id).text("");
//    else {
//        var val = parseFloat(event.target.innerText.replace(/,/g, ''));
//        $("#" + event.target.id).text(val);
//    }

//    $("#" + event.target.id).text(parseFloat(event.target.innerText).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') == "NaN" ? "" : parseFloat(event.target.innerText).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

//    if (event.currentTarget.id === "chargeableIncomeColumn0") {

//        if ($("#chargeableIncomeColumn0").text() === "") {  
//            $("#chargeableIncomeColumn0").text("");
//            $("#taxPaidColumn0").prop("contenteditable", false);

//            if (statusColumn0 === "" || statusColumn0 === "NLT") {


//                return toastr.info("Please select a valid status for the corresonding year.");
//            }
//        } 

//    }

//    if (event.currentTarget.id === "chargeableIncomeColumn") {

//        if ($("#chargeableIncomeColumn1").text() === "") {
//            $("#chargeableIncomeColumn1").text("");
//            $("#taxPaidColumn1").prop("contenteditable", false);

//            if (statusColumn1 === "" || statusColumn1 === "NLT")
//                return toastr.info("Please select a valid status for the corresonding year.");
//        }

//    }

//    if (event.currentTarget.id === "chargeableIncomeColumn") {

//        if ($("#chargeableIncomeColumn2").text() === "") {
//            $("#chargeableIncomeColumn2").text("");
//            $("#taxPaidColumn2").prop("contenteditable", false);

//            if (statusColumn2 === "" || statusColumn2 === "NLT")
//                return toastr.info("Please select a valid status for the corresonding year.");
//        }

//    }


//    if (event.currentTarget.id === "taxPaidColumn0") {

//        if ($("#chargeableIncomeColumn0").text() === "") {
//            $("#taxPaidColumn0").text("");
//            $("#taxChargedColumn0").text("");
//            $("#chargeableIncomeColumn0").text("");
//            $("#taxPaidColumn0").prop("contenteditable", false);

//            return toastr.info("Tax paid without corresponding Chargeable Income is not allowed");
//        } else {

//            $("#taxPaidColumn0").prop("contenteditable", true);
//        }

//    } else if (event.currentTarget.id === "taxPaidColumn1") {

//        if ($("#chargeableIncomeColumn1").text() === "") {
//            $("#taxPaidColumn1").text("");
//            $("#taxChargedColumn1").text("");
//            $("#chargeableIncomeColumn1").text("");
//            $("#taxPaidColumn1").prop("contenteditable", false);

//            return toastr.info("Tax paid without corresponding Chargeable Income is not allowed");
//        } else {

//            $("#taxPaidColumn1").prop("contenteditable", true);
//        }

//    } else if (event.currentTarget.id === "taxPaidColumn2") {

//        if ($("#chargeableIncomeColumn2").text() === "") {
//            $("#taxPaidColumn2").text("");
//            $("#taxChargedColumn2").text("");
//            $("#chargeableIncomeColumn2").text("");
//            $("#taxPaidColumn2").prop("contenteditable", false);

//            return toastr.info("Tax paid without corresponding Chargeable Income is not allowed");
//        } else {

//            $("#taxPaidColumn2").prop("contenteditable", true);
//        }

//    }

//});

//$("#TaxPositionSummaryGrid").on('focusout', '.valueCell', function (event) {

//    $("#" + event.target.id).text(parseFloat(event.target.innerText).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') == "NaN" ? "" : parseFloat(event.target.innerText).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));


//    var updateTaxCharged = function (res) {
//        let taxChargedColumn = "";

//        if (event.target.id === "chargeableIncomeColumn0") {

//            taxChargedColumn = "taxChargedColumn0";
//        } else if (event.target.id === "chargeableIncomeColumn1") {

//            taxChargedColumn = "taxChargedColumn1";
//        } else if (event.target.id === "chargeableIncomeColumn2") {

//            taxChargedColumn = "taxChargedColumn2";
//        }

//        $("#" + taxChargedColumn).text(parseFloat(res[0].nTaxAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
//    };

//    if (event.currentTarget.id === "taxPaidColumn0") {

//        var taxOustanding0 = parseFloat($("#taxChargedColumn0").text() !== "" ? $("#taxChargedColumn0").text().replace(/,/g, '') : 0) - parseFloat($("#taxPaidColumn0").text() !== "" ? $("#taxPaidColumn0").text().replace(/,/g, '') : 0);
//        $("#taxOutstandingColumn0").text(taxOustanding0 < 0 ? '(' + Math.abs(taxOustanding0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ')' : taxOustanding0.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

//    } else if (event.currentTarget.id === "taxPaidColumn1") {

//        var taxOustanding1 = parseFloat($("#taxChargedColumn1").text() !== "" ? $("#taxChargedColumn1").text().replace(/,/g, '') : 0) - parseFloat($("#taxPaidColumn1").text() !== "" ? $("#taxPaidColumn1").text().replace(/,/g, '') : 0);
//        $("#taxOutstandingColumn1").text(taxOustanding1 < 0 ? '(' + Math.abs(taxOustanding1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ')' : taxOustanding1.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

//    } else if (event.currentTarget.id === "taxPaidColumn2") {

//        var taxOustanding2 = parseFloat($("#taxChargedColumn2").text() !== "" ? $("#taxChargedColumn2").text().replace(/,/g, '') : 0) - parseFloat($("#taxPaidColumn2").text() !== "" ? $("#taxPaidColumn2").text().replace(/,/g, '') : 0);
//        $("#taxOutstandingColumn2").text(taxOustanding2 < 0 ? '(' + Math.abs(taxOustanding2).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ')' : taxOustanding2.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

//    }

//    if (event.currentTarget.id === "chargeableIncomeColumn0") {

//        let startdate = $("#assessmentYear0").text() + "-1-1";
//        let enddate = $("#assessmentYear0").text() + "-12-31";
//        let amount = parseFloat(event.target.innerText.split(".")[0].replace(",", ""));

//        var url = `${ServerUrl}api/Transaction/TaxCalculatorAsync?amount=` + amount + `&startdate=` + startdate + `&enddate=` + enddate + `&tin=` + $("#taxpayerTin").val();

//        if (amount > 0 && statusColumn0 !== "" && statusColumn0 !== "NLT") {
//            apiCaller(url, "GET", "", updateTaxCharged);
//        } else {
//            if (statusColumn0 === "") {

//                $("#chargeableIncomeColumn0").text("");
//                $("#chargeableIncomeColumn0").focus();
//                return toastr.info("Please select a valid status for the corresonding year.");

//            } else if (statusColumn0 === "NLT") {

//                return toastr.info("Taxpayer is NOT LIABLE FOR TAX for the selected year.");
//            }
//        }

//    } else if (event.currentTarget.id === "chargeableIncomeColumn1") {

//        let startdate = $("#assessmentYear1").text() + "-1-1";
//        let enddate = $("#assessmentYear1").text() + "-12-31";
//        let amount = parseFloat(event.target.innerText.split(".")[0].replace(",", ""));

//        var url = `${ServerUrl}api/Transaction/TaxCalculatorAsync?amount=` + amount + `&startdate=` + startdate + `&enddate=` + enddate + `&tin=` + $("#taxpayerTin").val();

//        if (amount > 0 && statusColumn1 !== "" && statusColumn1 !== "NLT") {
//            apiCaller(url, "GET", "", updateTaxCharged);
//        } else {
//            if (statusColumn1 === "") {

//                $("#chargeableIncomeColumn1").text("");
//                $("#chargeableIncomeColumn1").focus();
//                return toastr.info("Please select a valid status for the corresonding year.");

//            } else if (statusColumn1 === "NLT") {

//                return toastr.info("Taxpayer is NOT LIABLE FOR TAX for the selected year.");
//            }
//        }

//    } else if (event.currentTarget.id === "chargeableIncomeColumn2") {

//        let startdate = $("#assessmentYear2").text() + "-1-1";
//        let enddate = $("#assessmentYear2").text() + "-12-31";
//        let amount = parseFloat(event.target.innerText.split(".")[0].replace(",", ""));

//        var url = `${ServerUrl}api/Transaction/TaxCalculatorAsync?amount=` + amount + `&startdate=` + startdate + `&enddate=` + enddate + `&tin=` + $("#taxpayerTin").val();

//        if (amount > 0 && statusColumn2 !== "" && statusColumn2 !== "NLT") {
//            apiCaller(url, "GET", "", updateTaxCharged);
//        } else {
//            if (statusColumn2 === "") {

//                $("#chargeableIncomeColumn2").text("");
//                $("#chargeableIncomeColumn2").focus();
//                return toastr.info("Please select a valid status for the corresonding year.");

//            } else if (statusColumn2 === "NLT") {

//                return toastr.info("Taxpayer is NOT LIABLE FOR TAX for the selected year.");
//            }
//        }

//    }
//});

$("#saveTaxPositionSummary").click(function (e) {
    e.preventDefault();

    var summaryData = [];

    var row1 = {
        "status": statusColumn0,
        "assessmentYear": $("#assessmentYear0").text(),
        "chargeableIncome": $("#chargeableIncomeColumn0").text() === "NIL" ? 0 : $("#chargeableIncomeColumn0").text(),
        "taxCharged": $("#taxChargedColumn0").text() === "NIL" ? 0 : $("#taxChargedColumn0").text(),
        "taxOutstanding": $("#taxOutstandingColumn0").text().includes('(') ? $("#taxOutstandingColumn0").text().substring(1, $("#taxOutstandingColumn0").text().length - 1) : $("#taxOutstandingColumn0").text() === "NIL" ? 0 : $("#taxOutstandingColumn0").text(),
        "taxPaid": $("#taxPaidColumn0").text() === "NIL" ? 0 : $("#taxPaidColumn0").text()
    }

    summaryData.push(row1);

    var row2 = {
        "status": statusColumn1,
        "assessmentYear": $("#assessmentYear1").text(),
        "chargeableIncome": $("#chargeableIncomeColumn1").text() === "NIL" ? 0 : $("#chargeableIncomeColumn1").text(),
        "taxCharged": $("#taxChargedColumn1").text() === "NIL" ? 0 : $("#taxChargedColumn1").text(),
        "taxOutstanding": $("#taxOutstandingColumn1").text().includes('(') ? $("#taxOutstandingColumn1").text().substring(1, $("#taxOutstandingColumn1").text().length - 1) : $("#taxOutstandingColumn1").text() === "NIL" ? 0 : $("#taxOutstandingColumn1").text(),
        "taxPaid": $("#taxPaidColumn1").text() === "NIL" ? 0 : $("#taxPaidColumn1").text()
    }

    summaryData.push(row2);

    var row3 = {
        "status": statusColumn2,
        "assessmentYear": $("#assessmentYear2").text(),
        "chargeableIncome": $("#chargeableIncomeColumn2").text() === "NIL" ? 0 : $("#chargeableIncomeColumn2").text(),
        "taxCharged": $("#taxChargedColumn2").text() === "NIL" ? 0 : $("#taxChargedColumn2").text(),
        "taxOutstanding": $("#taxOutstandingColumn2").text().includes('(') ? $("#taxOutstandingColumn2").text().substring(1, $("#taxOutstandingColumn2").text().length - 1) : $("#taxOutstandingColumn2").text() === "NIL" ? 0 : $("#taxOutstandingColumn2").text(),
        "taxPaid": $("#taxPaidColumn2").text() === "NIL" ? 0 : $("#taxPaidColumn2").text()
    }

    summaryData.push(row3);

    var arrayObject = {
        Summary: summaryData,
        PaidTaxLiabilities: isCheckBoxSelected,
        PaidWithholdingTax: isCheckBoxSelectedPaye,
        SubmittedTaxReturns: isCheckBoxSelectedAll,
        RegisteredWithGRA: isCheckBoxSelectedGRA,
        TaxpayerId: $("#taxpayerId").val()
    };

    var url = `${postTaxPosition}` + $("#appId").val();

    apiCaller(url, 'POST', arrayObject, updateApplication);
});

$("#TaxPositionSummaryGrid").on('change', '#statusColumn0', function () {
    var elem = document.getElementById("statusColumn0");
    statusColumn0 = elem.options[elem.selectedIndex].value;
    if (statusColumn0 === "NLT") {

        notLiableTax(1);
        $("#taxPaidColumn0").prop("style", "width:100%;border:1px solid silver;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        $("#taxPaidColumn0").prop("readonly", "");
        $("#chargeableIncomeColumn0").prop("style", "width:100%;border:1px solid silver;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        $("#chargeableIncomeColumn0").prop("readonly", "");
    } else {

        $("#chargeableIncomeColumn0").val("");
        $("#taxChargedColumn0").text("");
        $("#taxOutstandingColumn0").val("");
        $("#taxPaidColumn0").text("");
        $("#taxPaidColumn0").prop("contenteditable", true);
        $("#chargeableIncomeColumn0").prop("contenteditable", true);
    }
});

$("#TaxPositionSummaryGrid").on('change', '#statusColumn1', function () {
    var elem = document.getElementById("statusColumn1");
    statusColumn1 = elem.options[elem.selectedIndex].value;
    if (statusColumn1 === "NLT") {

        notLiableTax(2);
        $("#taxPaidColumn1").prop("style", "width:100%;border:1px solid silver;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        $("#taxPaidColumn1").prop("readonly", "");
        $("#chargeableIncomeColumn1").prop("style", "width:100%;border:1px solid silver;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        $("#chargeableIncomeColumn1").prop("readonly", "");
    } else {

        $("#chargeableIncomeColumn1").val("");
        $("#taxChargedColumn1").text("");
        $("#taxOutstandingColumn1").val("");
        $("#taxPaidColumn1").text("");
        $("#taxPaidColumn1").prop("contenteditable", true);
        $("#chargeableIncomeColumn1").prop("contenteditable", true);
    }
});

$("#TaxPositionSummaryGrid").on('change', '#statusColumn2', function () {
    var elem = document.getElementById("statusColumn2");
    statusColumn2 = elem.options[elem.selectedIndex].value;
    if (statusColumn2 === "NLT") {

        notLiableTax(3);
        $("#taxPaidColumn2").prop("style", "width:100%;border:1px solid silver;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        $("#taxPaidColumn2").prop("readonly", "");
        $("#chargeableIncomeColumn2").prop("style", "width:100%;border:1px solid silver;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        $("#chargeableIncomeColumn2").prop("readonly", "");
    } else {

        $("#chargeableIncomeColumn2").val("");
        $("#taxChargedColumn2").text("");
        $("#taxOutstandingColumn2").val("");
        $("#taxPaidColumn2").text("");
        $("#taxPaidColumn2").prop("contenteditable", true);
        $("#chargeableIncomeColumn2").prop("contenteditable", true);
    }
});

var notLiableTax = function (index) {
    if (index === 1) {

        $("#chargeableIncomeColumn0").val("NIL");
        $("#taxChargedColumn0").text("NIL");
        $("#taxPaidColumn0").val("NIL");
        $("#taxOutstandingColumn0").text("NIL");
    } else if (index === 2) {

        $("#chargeableIncomeColumn1").val("NIL");
        $("#taxChargedColumn1").text("NIL");
        $("#taxPaidColumn1").val("NIL");
        $("#taxOutstandingColumn1").text("NIL");
    } else if (index === 3) {

        $("#chargeableIncomeColumn2").val("NIL");
        $("#taxChargedColumn2").text("NIL");
        $("#taxPaidColumn2").val("NIL");
        $("#taxOutstandingColumn2").text("NIL");
    }
};

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
        window.location.href = `${serverUrl}applications/mytask`;
    }, 3000);
};