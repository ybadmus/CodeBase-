﻿var HeaderName = "TCC Approval";
var serverUrl = $("#serverUrl").val();
var searchTccByTaxOffice = `${serverUrl}api/TCC/GetAllTccApplicationPendingApprovalByTaxOfficeId`;
var loadTaxPositionsUrl = `${serverUrl}api/TCC/GetTCCApplicationTaxPositionByApplicationId?applicationId=`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var activeTaxOffice = "";
var selectedStatus;
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;

$("#tccListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("tccListOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
});

var initializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "statusDate", title: "Date", width: '90px' },
            { field: "applicationNo", title: "Application No.", width: '100px' },
            { field: "applicantName", title: "Applicant", width: '20%' },
            { field: "purpose", title: "Purpose", width: '20%' },
            { field: "requestingEntity", title: "Requesting Entity", width: '20%' },
            {
                command: [{
                    name: "view",
                    template: "<button title='View item' class='btn btn-success btn-sm' style=''><span class='fa fa-file fa-lg'></span></button>"
                }],
                title: "Actions",
                width: "70px"
            }
        ]
    });

};

$(document).ready(function () {
    $("#pgHeader").text(HeaderName);
    initializeKendoGrid();
    bootstrapPage();

    $("#taxPosition").hide();
    $("#tccGridView").show();

    $("#expiryDateTcc").flatpickr({
        maxDate: calculateThreeMonths(),
        minDate: 'today'
    });
});

var loadTaxOffices = function (listOfTaxOffices) {
    var output = "";

    listOfTaxOffices.sort((a, b) => (a.taxOfficeName > b.taxOfficeName) - (a.taxOfficeName < b.taxOfficeName));

    output += '<option selected>Choose office</option>';
    for (var i = 0; i < listOfTaxOffices.length; i++) {
        output = output + '<option value="' + listOfTaxOffices[i].taxOfficeId + '" >' + listOfTaxOffices[i].taxOfficeName + '</option>';
    }

    output = output;
    $("#tccListOfTaxOffices").html(output);
};

var calculateYear = function () {
    var previousYear = new Date().getFullYear() - 1;
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1;
    var monthsArray = ["None", "Jan", "Feb", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
    var MonthYear = monthsArray[currentMonth] + ", " + currentYear;

    $("#pgHeader").text(HeaderName);
    $("#previousYear").text(previousYear);
    $("#currentMonthYear").text(MonthYear);
};

var hideAndShow = function () {
    $("#taxPosition").show();
    $("#tccGridView").hide();
};

var bootstrapPage = function () {
    var userid = $("#userId").val();
    var tccUrl = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    apiCaller(tccUrl, "GET", "", loadTaxOffices);
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

var searchTcc = function () {
    if (validateSearchEntry()) {
        let searchItem = $("#searchItem").val().trim();
        if (searchItem.includes('/')) {
            for (var i = 0; i < searchItem.length; i++) {
                if (searchItem[i] === '/')
                    replaceAt(searchItem, i, '%2F');
            }
        }

        let url = `${searchTccByTaxOffice}?officeId=` + activeTaxOffice + "&queryString=" + searchItem;
        apiCaller(url, "GET", "", initializeKendoGrid);
    } else {

        toastr.error("Tax office or search item field is empty");
    }
};

var validateSearchEntry = function () {
    let searchItem = $("#searchItem").val().trim();
    if (!searchItem.match(/\S/) || activeTaxOffice === "")
        return false;
    else
        return true;
};

var prepareDetailsView = function (appId) {
    let url = `${loadTaxPositionsUrl}` + appId;

    calculateYear();
    loadMessages(appId);
    apiCaller(url, "GET", "", loadTaxPositionDetails);
};

var loadTaxPositionDetails = function (listOfSummary) {

    let output = "";

    if (listOfSummary === null)
        return;

    for (var i = listOfSummary.length - 1; i >= 0; i--) {
        var negativeValues = listOfSummary[i].taxOutstanding < 0 ? "(" + Math.abs(listOfSummary[i].taxOutstanding).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ")" : listOfSummary[i].taxOutstanding.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

        output = output + '<tr><td align="center" id="assessmentYear' + i + '">'
            + listOfSummary[i].assessmentYear + '</td><td align="center" style="color: black" class="">'
            + listOfSummary[i].status + '</td><td align="right" style="color: black" class="valueCell">'
            + listOfSummary[i].chargeableIncome.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td align="right" style="color: black"  class="">'
            + listOfSummary[i].taxCharged.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td align="right" style="color: black" class="valueCell">'
            + listOfSummary[i].taxPaid.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td align="right" style="color: black" class="">'
            + negativeValues + '</td></tr>';
    }

    output = output;
    $("#TaxPositionSummaryGrid").html(output);

    hideAndShow();
};

var calculateThreeMonths = function () {
    var d = new Date(),
        month = '' + (d.getMonth() + 4),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
};

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {

    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    $("#appId").val(item.applicationId);
    $("#applicantNameApproval").text(item.applicantName);
    $("#modalId").text(item.applicationNo);
    $("#appNo").text(item.applicationNo);
    prepareDetailsView(item.applicationId);
});

$("#btnSearch").click(function (e) {
    searchTcc();
});

$("#reviseApp").click(function (e) {
    $("#approveDecline").modal("show");
});

$("#searchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTcc();
    }
});

$("#backToGrid").click(function () {
    backToView();
});

var backToView = function () {
    $("#taxPosition").hide();
    $("#tccGridView").show();;
};

$("#approveDeclineReturnBtn").click(function () {

    if (selectedStatus == 2) {

        approveTCC();

    } else {

        let tccId = $("#appId").val();
        let updateUrl = tccUpdateUrl + tccId;

        let ObjectToSend = {
            "status": selectedStatus,
            "taxpayerComment": $("#taxpayerMessage").val(),
            "internalComment": $("#internalMessage").val(),
            "applicationId": tccId
        };

        apiCaller(updateUrl, "PUT", ObjectToSend, successfullyUpdated);
    };
});

var approveTCC = function () {
    let tccId = $("#appId").val();
    let updateUrl = tccUpdateUrl + tccId;

    let ObjectToSend = {
        "status": selectedStatus,
        "taxpayerComment": $("#taxpayerMessage").val(),
        "internalComment": $("#internalMessage").val(),
        "applicationId": tccId,
        "expiryDate": calculateThreeMonths()
    };

    apiCaller(updateUrl, "PUT", ObjectToSend, successfullyUpdated);
};

$("#continueApproval").click(function () {
    approveTCC();
});

var backToGrid = function () {
    setTimeout(function () {
        window.location.href = `${serverUrl}approval/tccapproval`;
    }, 3000);
};
