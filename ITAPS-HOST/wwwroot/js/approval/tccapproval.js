﻿var HeaderName = "TCC Approval";
var serverUrl = $("#serverUrl").val();
var searchTccByTaxOffice = `${serverUrl}api/TCC/GetAllTccApplicationPendingApprovalByTaxOfficeId`;
var loadTaxPositionsUrl = `${serverUrl}api/TCC/GetTCCApplicationTaxPositionByApplicationId?applicationId=`;
var GetTCCDocuments = `${serverUrl}api/TCC/GetTCCApplicationDocumentByApplicationId`;
var tccMessagesOnlyUrl = `${serverUrl}api/TCC/SendTCCApplicationMessage?id=`;
var loadTCCDetailsUrl = `${serverUrl}api/TCC/GetTccApplicationById?tccId=`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var ReportDownloadView = `${serverUrl}reportviewer/index`;
var activeTaxOffice = "";
var selectedStatus;
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;
var gridGlobal;

$("#tccListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("tccListOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
});

//var initializeKendoGrid = function (data) {

//    $("#Grid").kendoGrid({
//        dataSource: { data: data, pageSize: 8 },
//        sortable: true,
//        selectable: true,
//        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
//        columns: [
//            { field: "statusDate", title: "Date", width: '90px' },
//            { field: "applicationNo", title: "Application No.", width: '15%' },
//            { field: "applicantName", title: "Applicant", width: '20%' },
//            { field: "purpose", title: "Purpose", width: '20%' },
//            { field: "requestingEntity", title: "Requesting Entity", width: '20%' },
//            {
//                command: [{
//                    name: "view",
//                    template: "<button title='View item' class='btn btn-success btn-sm' style=''><span class='fa fa-file fa-lg'></span></button>"
//                }],
//                title: "Actions",
//                width: "70px"
//            }
//        ]
//    });

//};

var initializeKendoGrid = function (data, stage) {
    document.getElementById("Grid").innerHTML = "";
    if (data == null)
        data = [];

    if (data) {
        if (data.length == 0 && stage !== 1) {
            toastr.info("No Data");
            data = [];
        };

        var grid = new ej.grids.Grid({
            dataSource: data,
            selectionSettings: { type: 'Multiple' },
            columns: [
                { field: 'statusDate', headerText: 'Last Updated', width: 80 },
                { field: 'applicationNo', headerText: 'Application No.', width: 80 },
                { field: 'applicantName', headerText: 'Applicant Name', width: 120 },
                { field: 'purpose', headerText: 'Purpose', width: 100 },
                { field: 'requestingEntity', headerText: 'Requesting Entity', width: 120 }
            ],
            height: 400,
            pageSettings: { pageSize: 10 },
            allowGrouping: true,
            allowPaging: true,
            allowSorting: false,
            allowFiltering: true,
            filterSettings: { type: 'Menu' },
            rowSelected: rowSelected,
        });

        grid.appendTo('#Grid');
        gridGlobal = grid;
    } else {

        toastr.info("No Data");
    };
};

function rowSelected(args) {
    var selectedrecords = gridGlobal.getSelectedRecords();
    onGridSelected(selectedrecords[0]);
};

$(document).ready(function () {
    $("#pgHeader").text(HeaderName);
    initializeKendoGrid([], 1);
    bootstrapPage();

    $("#taxPosition").hide();
    $("#tccGridView").show();

    $("#expiryDateTcc").flatpickr({
        maxDate: calculateThreeMonths(),
        minDate: 'today',
        dateFormat: "d-m-Y"
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
    $("#tccDetails").show();
    $("#taxPositionView").hide();
    $("#previousDetailBtn").hide();
    $("#taxPositionMoreDetails").show();
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

            if (response.caption.toLowerCase() == "conflict") {

                $('html').hideLoading();
                return toastr.error("This application has already been approved, please reload the browser and choose another application.");
            }

            if (callback) {
                callback(response.body);
            };

            $('html').hideLoading();
        },
        error: function (error) {

            $('html').hideLoading();

            return toastr.error('An error occured, please reload the browser and try again.');
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
    let urlTaxPosition = `${loadTaxPositionsUrl}` + appId;
    let appTypeId = "870301ea-f62e-4788-9905-7c94a26813d3";

    let urlTCCDetails = `${loadTCCDetailsUrl}` + appId + `&appTypeId=${appTypeId}`;

    calculateYear();
    loadMessages(appId);
    apiCaller(urlTaxPosition, "GET", "", loadTaxPositionDetails);
    apiCaller(urlTCCDetails, "GET", "", loadTccDetails);
};

var loadTaxPositionDetails = function (listOfSummaryAPI) {

    var listOfSummary = listOfSummaryAPI[0].taxPositions;

    let output = "";

    if (listOfSummary === null)
        return;

    for (var i = listOfSummary.length - 1; i >= 0; i--) {
        var negativeValues = listOfSummary[i].taxOutstanding < 0 ? "(" + Math.abs(listOfSummary[i].taxOutstanding).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ")" : listOfSummary[i].taxOutstanding.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

        if (listOfSummary[i].status == "NLT") {

            output = output + '<tr><td align="center" id="assessmentYear' + i + '">'
                + listOfSummary[i].assessmentYear + '</td><td align="center" style="color: black" class="">'
                + listOfSummary[i].status + '</td><td align="right" style="color: black" class="valueCell">NIL</td><td align="right" style="color: black" class="">NIL</td><td align="right" style="color: black" class="valueCell">NIL</td><td align="right" style="color: black" class="">NIL</td></tr>';

        } else {

            output = output + '<tr><td align="center" id="assessmentYear' + i + '">'
                + listOfSummary[i].assessmentYear + '</td><td align="center" style="color: black" class="">'
                + listOfSummary[i].status + '</td><td align="right" style="color: black" class="valueCell">'
                + listOfSummary[i].chargeableIncome.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td align="right" style="color: black"  class="">'
                + listOfSummary[i].taxCharged.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td align="right" style="color: black" class="valueCell">'
                + listOfSummary[i].taxPaid.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td align="right" style="color: black" class="">'
                + negativeValues + '</td></tr>';
        }
       
    }

    output = output;
    $("#TaxPositionSummaryGrid").html(output);

    hideAndShow();

    $("#confirmationBox").prop("checked", listOfSummaryAPI[0].paidTaxLiabilities);
    $("#confirmationBoxPaye").prop("checked", listOfSummaryAPI[0].paidWithholdingTax);
    $("#confirmationBoxAll").prop("checked", listOfSummaryAPI[0].submittedTaxReturns);
    $("#confirmationBoxGRA").prop("checked", listOfSummaryAPI[0].registeredWithGRA);

};

var calculateThreeMonths = function () { 
    var d = new Date(),
        month = '' + (d.getMonth() + 4),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month > 12) {
        year = year + 1;
        month = month % 12;
    }

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
};

var loadTccDetails = function (resp) {
    $("#dateSubmitted").text(testNullOrEmpty(resp[0].submittedDate));
    $("#applicantName").text(testNullOrEmpty(resp[0].applicantName));
    $("#applicantFName").text(testNullOrEmpty(resp[0].applicantName));
    $(".applicationType").text("TCC");
    $(".applicationTaxOffice").text(testNullOrEmpty(resp[0].taxOffice));
    $("#applicantTIN").text(testNullOrEmpty(resp[0].applicantTIN));
    $("#applicantPhone").text(testNullOrEmpty(resp[0].applicantPhoneNo));
    $("#applicantEmail").text(testNullOrEmpty(resp[0].applicantEmailAddress));
    $("#requestEntityName").text(testNullOrEmpty(resp[0].requestingEntity));
    $("#requestingEntityTin").text(testNullOrEmpty(resp[0].requestingOfficeTIN));
    $("#requestingEntityPhone").text(testNullOrEmpty(resp[0].requestingOfficePhone));
    $("#requestingEntityEmail").text(testNullOrEmpty(resp[0].requestingOfficeEmail));
    $("#purposeOfApplication").text(testNullOrEmpty(resp[0].purpose));
    $("#remarkOfApplication").text(testNullOrEmpty(resp[0].remarks));

    $("#appIdHeader").text(testNullOrEmpty(resp[0].applicationNo));
    $("#appStatusHeader").text(testNullOrEmpty(resp[0].status));
    $("#modalId").text(testNullOrEmpty(resp[0].applicationNo));
    $("#statusNameModal").text(testNullOrEmpty(resp[0].status));
    $("#currentStatus").text(resp[0].statusId);
    $("#taxpayerId").text(testNullOrEmpty(resp[0].taxpayerId));
};

var onGridSelected = function (item) {


    $("#appId").val(item.applicationId);
    $("#applicantNameApproval").text(item.applicantName);
    $("#modalId").text(item.applicationNo);
    $("#appNo").text(item.applicationNo);
    $("#appNoDetails").text(item.applicationNo);

    prepareDetailsView(item.applicationId);
    getDocumentsById();
};

//$("body").on('click', '#Grid .k-grid-content .btn', function (e) {

//    var grid = $("#Grid").getKendoGrid();
//    var item = grid.dataItem($(e.target).closest("tr"));

//    $("#appId").val(item.applicationId);
//    $("#applicantNameApproval").text(item.applicantName);
//    $("#modalId").text(item.applicationNo);
//    $("#appNo").text(item.applicationNo);
//    $("#appNoDetails").text(item.applicationNo);

//    prepareDetailsView(item.applicationId);
//    getDocumentsById();
//});

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

        $("#approveModal").modal("show");

    } else {

        let tccId = $("#appId").val();
        let updateUrl = tccUpdateUrl + tccId;

        let ObjectToSend = {
            "status": selectedStatus,
            "taxpayerComment": $("#taxpayerMessage").val(),
            "internalComment": $("#internalMessage").val(),
            "applicationId": tccId
        };

        if ($("#taxpayerMessage").val().length < 5 && selectedStatus == 3)
            return toastr.info("Message to the Taxpayer is required when Declining Application");

        if ($("#taxpayerMessage").val().length < 5 && selectedStatus == 1)
            return toastr.info("Message to the Taxpayer is required when Returning Application");

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
        "expiryDate": convertDate($("#expiryDateTcc").val())
    };

    apiCaller(updateUrl, "PUT", ObjectToSend, successfullyUpdated);
};

var convertDate = function (date) {
    var oldDateArray = date.split("-");
    return oldDateArray[2] + "-" + oldDateArray[1] + "-" + oldDateArray[0];
};

$("#expiryDateTcc").change(function () {
    $("#continueApproval").removeAttr('disabled');
});

$("#continueApproval").click(function () {
    $("#yesOrNo").modal("show");
    $("#approveModal").modal("hide");
    $("#approveDecline").modal("hide");

    $("#approvalPurpose").text($("#purposeOfApplication").text());
    $("#approvalApplicantName").text($("#applicantName").text());
    $("#approvalRequestingEntity").text($("#requestEntityName").text());
    $("#approvalExpiryDate").text($("#expiryDateTcc").val());
});

$("#yesBtn").click(function () {
    approveTCC();
});

$("#noYesBtn").click(function () {
    $("#yesOrNo").modal("hide");
    $("#approveModal").modal("show");
    $("#approveDecline").modal("show");
});

$("#taxPositionMoreDetails").click(function () {
    $("#tccDetails").hide();
    $("#taxPositionView").show();

    $("#previousDetailBtn").show();
    $("#taxPositionMoreDetails").hide();
});

$("#previousDetailBtn").click(function () {
    $("#taxPositionView").hide();
    $("#tccDetails").show();

    $("#taxPositionMoreDetails").show();
    $("#previousDetailBtn").hide();
});

var backToGrid = function () {
    setTimeout(function () {
        window.location.href = `${serverUrl}approval/tccapproval`;
    }, 3000);
};


