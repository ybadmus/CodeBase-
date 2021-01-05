var HeaderName = "Tax Position";
var isCheckBoxSelected = false;
var isCheckBoxSelectedGRA = false;
var isCheckBoxSelectedPaye = false;
var isCheckBoxSelectedAll = false;
var ServerUrl = $("#serverUrl").val();
var postTaxPosition = `${ServerUrl}api/TCC/PostTaxPositionSummary?appId=`;
let tccUpdateUrl = `${ServerUrl}api/TCC/UpdateTCCApplication?id=`;
var statusColumn0 = "";
var statusColumn1 = "";
var statusColumn2 = "";
var taxCodeId = "";
  
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
            + '<td align="right" style="color: black; width: 20%; padding: 0px 3px;" class="valueCell"><input id="chargeableIncomeColumn' + i + '" style="width: 100%;border:none;border-radius: 5px;text-align: right;padding: 2px 5px;cursor: no-drop;" readonly="true" /></td>'
            + '<td align="right" style="color: black; width: 18%;" id="taxChargedColumn' + i + '" class=""></td>'
            + '<td align="right" style="color: black; width: 20%; padding: 0px 3px;" class="valueCell"><input id="taxPaidColumn' + i + '" style="width: 100%;border:none;border-radius: 5px;text-align: right;padding: 2px 5px;cursor: no-drop;" readonly="true" /></td>'
            + '<td align="right" style="color: black; width: 18%;" id="taxOutstandingColumn' + i + '" class=""></td></tr>';
    }

    output = output;
    $("#TaxPositionSummaryGrid").html(output);

    var cells = document.querySelectorAll("tr input");

    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("keyup", handler);
    }
};

var handler = function () {

    const allowedRegex = /[0-9]/g;

    if (!event.key.match(allowedRegex)) {
        return event.preventDefault();
    }

    if (event.target.id === "taxPaidColumn0") {

        if ($("#chargeableIncomeColumn0").val() == 0.00 || $("#chargeableIncomeColumn0").val() == "" || $("#chargeableIncomeColumn0").val() == 0) {
            $("#taxPaidColumn0").val("");
            return toastr.info("Tax paid without corresponding Chargeable income is not allowed!");
        }

    }

    if (event.target.id === "taxPaidColumn1") {

        if ($("#chargeableIncomeColumn1").val() == 0.00 || $("#chargeableIncomeColumn1").val() == "" || $("#chargeableIncomeColumn1").val() == 0) {
            $("#taxPaidColumn1").val("");
            return toastr.info("Tax paid without corresponding Chargeable income is not allowed!");
        }

    }

    if (event.target.id === "taxPaidColumn2") {

        if ($("#chargeableIncomeColumn2").val() == 0.00 || $("#chargeableIncomeColumn2").val() == "" || $("#chargeableIncomeColumn2").val() == 0) {
            $("#taxPaidColumn2").val("");
            return toastr.info("Tax paid without corresponding Chargeable income is not allowed!");
        }

    }

};

var changeType = function (event) {

    if (event.value === "individual") {

        $("#chooseTaxRateDiv").hide();
        $("#taxPositionGrid").show();

        taxCodeId = "";
    }


    if (event.value === "company") {

        $("#taxPositionGrid").hide();
        $("#chooseTaxRateDiv").show();
    }
};


$("#listOfCodes").on('change', function () {
    var elem = document.getElementById("listOfCodes");

    if (elem.options[elem.selectedIndex].value !== "") {

        $("#taxPositionGrid").show();

        taxCodeId = elem.options[elem.selectedIndex].value;
    } else {

        taxCodeId = "";
        $("#taxPositionGrid").hide();
    }

});

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
    searchTaxRates();
};

var searchTaxRates = function () {
    var url = `${ServerUrl}api/TaxRates/GetAllGcir`;
    apiCaller(url, "GET", "", loadTaxRates);
};

var loadTaxRates = function (listOfRates) {
    var output = "";

    listOfRates.sort((a, b) => (a.code > b.code) - (a.code < b.code));

    output += '<option selected value="">Select Rate</option>';
    for (var i = 0; i < listOfRates.length; i++) {
        output = output + '<option name="' + listOfRates[i].code + '" value="' + listOfRates[i].id + '" >' + listOfRates[i].code + " - " + listOfRates[i].sector + " (" + listOfRates[i].taxRate + ' %)</option>';
    }

    output = output;
    $("#listOfCodes").html(output);
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

$("#TaxPositionSummaryGrid").on('focusout', '.valueCell', function (event) {

    if (parseFloat(event.target.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') == "NaN") {

        return event.preventDefault();

    } else {
        let amount = parseFloat(event.target.value.split(".")[0].replace(",", ""));
        $("#" + event.target.id).val(parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    }

    if (event.target.id === "chargeableIncomeColumn0" && $("#chargeableIncomeColumn0").val() == 0.00) {

        $("#chargeableIncomeColumn0").val("");
        $("#taxPaidColumn0").val("");
        return toastr.info("Chargeable income must be greater than Zero (0)");

    } else if (event.target.id === "chargeableIncomeColumn1" && $("#chargeableIncomeColumn1").val() == 0.00) {

        $("#chargeableIncomeColumn1").val("");
        $("#taxPaidColumn1").val("");
        return toastr.info("Chargeable income must be greater than Zero (0)");

    } else if (event.target.id === "chargeableIncomeColumn2" && $("#chargeableIncomeColumn2").val() == 0.00) {

        $("#chargeableIncomeColumn2").val("");
        $("#taxPaidColumn2").val("");
        return toastr.info("Chargeable income must be greater than Zero (0)");
    }

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

    if (event.currentTarget.lastChild.id === "chargeableIncomeColumn0") {

        let startdate = $("#assessmentYear0").text() + "-1-1";
        let enddate = $("#assessmentYear0").text() + "-12-31";
        let amount = parseFloat(event.target.value.split(".")[0].replaceAll(",", ""));


        var url = `${ServerUrl}api/Transaction/TaxCalculatorAsync?amount=` + amount + `&startdate=` + startdate + `&enddate=` + enddate + `&tin=` + $("#taxpayerTin").val() + `&taxCodeId=` + taxCodeId;

        if (amount > 0) {

            apiCaller(url, "GET", "", updateTaxCharged);

        } else {

            toastr.info("Chargeable income must be greater than Zero (0)");
            $("#chargeableIncomeColumn0").val("");
            $("#taxPaidColumn0").val("");
            return event.preventDefault();

        }

    } else if (event.currentTarget.lastChild.id === "chargeableIncomeColumn1") {

        let startdate = $("#assessmentYear1").text() + "-1-1";
        let enddate = $("#assessmentYear1").text() + "-12-31";
        let amount = parseFloat(event.target.value.split(".")[0].replaceAll(",", ""));

        var url = `${ServerUrl}api/Transaction/TaxCalculatorAsync?amount=` + amount + `&startdate=` + startdate + `&enddate=` + enddate + `&tin=` + $("#taxpayerTin").val() + `&taxCodeId=` + taxCodeId;

        if (amount > 0) {

            apiCaller(url, "GET", "", updateTaxCharged);

        } else {

            toastr.info("Chargeable income must be greater than Zero (0)");
            $("#chargeableIncomeColumn1").val("");
            $("#taxPaidColumn1").val("");
            return event.preventDefault();

        }

    } else if (event.currentTarget.lastChild.id === "chargeableIncomeColumn2") {

        let startdate = $("#assessmentYear2").text() + "-1-1";
        let enddate = $("#assessmentYear2").text() + "-12-31";
        let amount = parseFloat(event.target.value.split(".")[0].replaceAll(",", ""));

        var url = `${ServerUrl}api/Transaction/TaxCalculatorAsync?amount=` + amount + `&startdate=` + startdate + `&enddate=` + enddate + `&tin=` + $("#taxpayerTin").val() + `&taxCodeId=` + taxCodeId;

        if (amount > 0) {

            apiCaller(url, "GET", "", updateTaxCharged);

        } else {

            toastr.info("Chargeable income must be greater than Zero (0)");
            $("#chargeableIncomeColumn2").val("");
            $("#taxPaidColumn2").val("");
            return event.preventDefault();

        }
    }

    if (event.currentTarget.lastChild.id === "taxPaidColumn0") {

        var taxOustanding0 = parseFloat($("#taxChargedColumn0").text() !== "" ? $("#taxChargedColumn0").text().replace(/,/g, '') : 0) - parseFloat($("#taxPaidColumn0").val() !== "" ? $("#taxPaidColumn0").val().replace(/,/g, '') : 0);
        $("#taxOutstandingColumn0").text(taxOustanding0 < 0 ? '(' + Math.abs(taxOustanding0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ')' : taxOustanding0.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    } else if (event.currentTarget.lastChild.id === "taxPaidColumn1") {

        var taxOustanding1 = parseFloat($("#taxChargedColumn1").text() !== "" ? $("#taxChargedColumn1").text().replace(/,/g, '') : 0) - parseFloat($("#taxPaidColumn1").val() !== "" ? $("#taxPaidColumn1").val().replace(/,/g, '') : 0);
        $("#taxOutstandingColumn1").text(taxOustanding1 < 0 ? '(' + Math.abs(taxOustanding1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ')' : taxOustanding1.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    } else if (event.currentTarget.lastChild.id === "taxPaidColumn2") {

        var taxOustanding2 = parseFloat($("#taxChargedColumn2").text() !== "" ? $("#taxChargedColumn2").text().replace(/,/g, '') : 0) - parseFloat($("#taxPaidColumn2").val() !== "" ? $("#taxPaidColumn2").val().replace(/,/g, '') : 0);
        $("#taxOutstandingColumn2").text(taxOustanding2 < 0 ? '(' + Math.abs(taxOustanding2).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ')' : taxOustanding2.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    }

});

$("#saveTaxPositionSummary").click(function (e) {
    e.preventDefault();

    if ($("#taxPaidColumn0").val().trim() == "" || $("#taxPaidColumn1").val().trim() == "" || $("#taxPaidColumn2").val().trim() == "")
        return toastr.info("Tax paid fields cannot be empty");

    var summaryData = [];

    var row1 = {
        "status": statusColumn0,
        "assessmentYear": $("#assessmentYear0").text(),
        "chargeableIncome": $("#chargeableIncomeColumn0").val() === "NIL" ? 0 : $("#chargeableIncomeColumn0").val(),
        "taxCharged": $("#taxChargedColumn0").text() === "NIL" ? 0 : $("#taxChargedColumn0").text(),
        "taxOutstanding": $("#taxOutstandingColumn0").text().includes('(') ? $("#taxOutstandingColumn0").text().substring(1, $("#taxOutstandingColumn0").text().length - 1) : $("#taxOutstandingColumn0").text() === "NIL" ? 0 : $("#taxOutstandingColumn0").text(),
        "taxPaid": $("#taxPaidColumn0").val() === "NIL" ? 0 : $("#taxPaidColumn0").val()
    }

    summaryData.push(row1);

    var row2 = {
        "status": statusColumn1,
        "assessmentYear": $("#assessmentYear1").text(),
        "chargeableIncome": $("#chargeableIncomeColumn1").val() === "NIL" ? 0 : $("#chargeableIncomeColumn1").val(),
        "taxCharged": $("#taxChargedColumn1").text() === "NIL" ? 0 : $("#taxChargedColumn1").text(),
        "taxOutstanding": $("#taxOutstandingColumn1").text().includes('(') ? $("#taxOutstandingColumn1").text().substring(1, $("#taxOutstandingColumn1").text().length - 1) : $("#taxOutstandingColumn1").text() === "NIL" ? 0 : $("#taxOutstandingColumn1").text(),
        "taxPaid": $("#taxPaidColumn1").val() === "NIL" ? 0 : $("#taxPaidColumn1").val()
    }

    summaryData.push(row2);

    var row3 = {
        "status": statusColumn2,
        "assessmentYear": $("#assessmentYear2").text(),
        "chargeableIncome": $("#chargeableIncomeColumn2").val() === "NIL" ? 0 : $("#chargeableIncomeColumn2").val(),
        "taxCharged": $("#taxChargedColumn2").text() === "NIL" ? 0 : $("#taxChargedColumn2").text(),
        "taxOutstanding": $("#taxOutstandingColumn2").text().includes('(') ? $("#taxOutstandingColumn2").text().substring(1, $("#taxOutstandingColumn2").text().length - 1) : $("#taxOutstandingColumn2").text() === "NIL" ? 0 : $("#taxOutstandingColumn2").text(),
        "taxPaid": $("#taxPaidColumn2").val() === "NIL" ? 0 : $("#taxPaidColumn2").val()
    }

    summaryData.push(row3);

    var arrayObject = {
        TaxPositions: summaryData,
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
    if (statusColumn0 === "NLT" || statusColumn0 == "") {

        if (statusColumn0 === "NLT")
            notLiableTax(1);

        if (statusColumn0 == "") {

            $("#chargeableIncomeColumn0").val("");
            $("#taxChargedColumn0").text("");
            $("#taxOutstandingColumn0").text("");
            $("#taxPaidColumn0").val("");
        }

        $("#taxPaidColumn0").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        document.getElementById('taxPaidColumn0').setAttribute('readonly', true);
        $("#chargeableIncomeColumn0").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        document.getElementById('chargeableIncomeColumn0').setAttribute('readonly', true);

    } else {

        $("#chargeableIncomeColumn0").val("");
        $("#taxChargedColumn0").text("");
        $("#taxOutstandingColumn0").text("");
        $("#taxPaidColumn0").val("");

        $("#taxPaidColumn0").removeAttr("readonly")
        $("#taxPaidColumn0").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:pointer;");
        $("#chargeableIncomeColumn0").removeAttr("readonly")
        $("#chargeableIncomeColumn0").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:pointer;");
    }
});

$("#TaxPositionSummaryGrid").on('change', '#statusColumn1', function () {
    var elem = document.getElementById("statusColumn1");
    statusColumn1 = elem.options[elem.selectedIndex].value;
    if (statusColumn1 === "NLT" || statusColumn1 == "") {

        if (statusColumn1 === "NLT")
            notLiableTax(2);

        if (statusColumn1 == "") {

            $("#chargeableIncomeColumn1").val("");
            $("#taxChargedColumn1").text("");
            $("#taxOutstandingColumn1").text("");
            $("#taxPaidColumn1").val("");
        }

        $("#taxPaidColumn1").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        document.getElementById('taxPaidColumn1').setAttribute('readonly', true);
        $("#chargeableIncomeColumn1").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        document.getElementById('chargeableIncomeColumn1').setAttribute('readonly', true);


    } else {

        $("#chargeableIncomeColumn1").val("");
        $("#taxChargedColumn1").text("");
        $("#taxOutstandingColumn1").text("");
        $("#taxPaidColumn1").val("");

        $("#taxPaidColumn1").removeAttr("readonly")
        $("#taxPaidColumn1").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:pointer;");
        $("#chargeableIncomeColumn1").removeAttr("readonly")
        $("#chargeableIncomeColumn1").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:pointer;");
    }
});

$("#TaxPositionSummaryGrid").on('change', '#statusColumn2', function () {
    var elem = document.getElementById("statusColumn2");
    statusColumn2 = elem.options[elem.selectedIndex].value;
    if (statusColumn2 === "NLT" || statusColumn2 == "") {

        if (statusColumn2 === "NLT")
            notLiableTax(3);

        if (statusColumn2 == "") {

            $("#chargeableIncomeColumn2").val("");
            $("#taxChargedColumn2").text("");
            $("#taxOutstandingColumn2").text("");
            $("#taxPaidColumn2").val("");
        }

        $("#taxPaidColumn2").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        document.getElementById('taxPaidColumn2').setAttribute('readonly', true);
        $("#chargeableIncomeColumn2").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:no-drop;");
        document.getElementById('chargeableIncomeColumn2').setAttribute('readonly', true);

    } else {

        $("#chargeableIncomeColumn2").val("");
        $("#taxChargedColumn2").text("");
        $("#taxOutstandingColumn2").text("");
        $("#taxPaidColumn2").val("");

        $("#taxPaidColumn2").removeAttr("readonly")
        $("#taxPaidColumn2").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:pointer;");
        $("#chargeableIncomeColumn2").removeAttr("readonly")
        $("#chargeableIncomeColumn2").prop("style", "width:100%;border:none;border-radius:5px;text-align:right;padding:2px 5px;cursor:pointer;");
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