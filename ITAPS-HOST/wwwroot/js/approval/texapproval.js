var HeaderName = "WH Tax Exemption Approval";
var serverUrl = $("#serverUrl").val();
var searchTexByTaxOffice = `${serverUrl}api/TEX/GetAllTaxExemptionPendingApprovalByTaxOfficeId`;
var searchTexCommissioner = `${serverUrl}api/TEX/GetAllExemptionApplicationForCommissioner`;
var loadTaxPositionsUrl = `${serverUrl}api/TCC/GetTCCApplicationTaxPositionByApplicationId?applicationId=`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetTCCDocuments = `${serverUrl}api/TCC/GetTCCApplicationDocumentByApplicationId`;
var tccMessagesOnlyUrl = `${serverUrl}api/TCC/SendTCCApplicationMessage?id=`;
var GetAppDetailsById = `${serverUrl}api/TEX/GetWHTExApplicationById?whtId=`;
var activeTaxOffice = "";
var activeUserGroup = "";
var ReportDownloadViewTEX = `${serverUrl}reportviewer/texcert`;
var selectedStatus;
var gridGlobal;
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;

$("#texListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("texListOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
});

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
                { field: 'applicantName', headerText: 'Applicant Name', width: 130 },
                { field: 'applicantTIN', headerText: 'Applicant TIN', width: 80 },
                { field: 'applicationType', headerText: 'WHT Type', width: 130 }
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
    bootstrapPage();
    loadUserDetials(userActions);
});

var userActions = function (response) {
    if (response[0].szLevel.toLowerCase() === "manager") {
        $("#approveTccManager").show();
        $("#approveTccDComm").hide();
        $("#approveTcc").hide();
        activeUserGroup = "manager";
    }

    if (response[0].szLevel.toLowerCase() === "commisioner" || response[0].szLevel.toLowerCase() === "commissioner") {
        $("#approveTccManager").hide();
        $("#approveTccDComm").hide();
        $("#approveTcc").show();
        activeUserGroup = "commissioner";
    }

    if (response[0].szLevel.toLowerCase() === "deputy commisioner" || response[0].szLevel.toLowerCase() === "deputy commissioner") {
        $("#approveTccManager").hide();
        $("#approveTccDComm").show();
        $("#approveTcc").hide();
        activeUserGroup = "deputy commissioner";
    }
};

var calculateTwelveMonths = function () {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear() + 1;

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
};

var loadTaxOffices = function (listOfTaxOffices) {
    var output = "";

    listOfTaxOffices.sort((a, b) => (a.taxOfficeName > b.taxOfficeName) - (a.taxOfficeName < b.taxOfficeName));

    output += '<option selected>Choose office</option>';
    for (var i = 0; i < listOfTaxOffices.length; i++) {
        output = output + '<option value="' + listOfTaxOffices[i].taxOfficeId + '" >' + listOfTaxOffices[i].taxOfficeName + '</option>';
    }

    output = output;
    $("#texListOfTaxOffices").html(output);
};

var bootstrapPage = function () {
    $("#pgHeader").text(HeaderName);
    $("#taxPosition").hide();
    $("#texGridView").show();

    $("#expiryDateTcc").flatpickr({
        maxDate: calculateTwelveMonths(),
        minDate: 'today',
        dateFormat: "d-m-Y"
    });

    initializeKendoGrid([], 1);

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

var searchTex = function () {
    if (validateSearchEntry()) {
        let searchItem = $("#searchItem").val().trim();
        if (searchItem.includes('/')) {
            for (var i = 0; i < searchItem.length; i++) {
                if (searchItem[i] === '/')
                    replaceAt(searchItem, i, '%2F');
            }
        }

        let url = "";

        if (activeUserGroup.toLowerCase() == "manager")
            url = `${searchTexByTaxOffice}?officeId=` + activeTaxOffice + "&queryString=" + searchItem;
        else if (activeUserGroup.toLowerCase() == "commissioner" || activeUserGroup.toLowerCase() == "commisioner")
            url = `${searchTexCommissioner}?officeId=` + activeTaxOffice + "&status=" + 7 + "&queryString=" + searchItem;
        else if (activeUserGroup.toLowerCase() == "deputy commissioner" || activeUserGroup.toLowerCase() == "deputy commisioner")
            url = `${searchTexCommissioner}?officeId=` + activeTaxOffice + "&status=" + 6 + "&queryString=" + searchItem;

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

$("#btnSearch").click(function (e) {
    searchTex();
});

$("#searchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTex();
    }
});

$("#reviseApp").click(function (e) {
    $("#approveDecline").modal("show");
});

var onGridSelected = function (item) {

    $("#appId").val(item.applicationId);
    prepareDetailsView(item.applicationId);
}

var prepareDetailsView = function (appId) {
    let urlTaxPosition = `${loadTaxPositionsUrl}` + appId;
    let url = `${GetAppDetailsById}` + appId;

    hideAndShow();
    loadMessages(appId);
    getDocumentsById();
    apiCaller(url, "GET", "", loadAppDetails);
    apiCaller(urlTaxPosition, "GET", "", loadTaxPositionDetails);
};

var loadAppDetails = function (resp) {
    var response = resp[0];

    $("#dateSubmitted").text(response.submittedDate);
    $("#lastUpdated").text(response.statusDate);
    $("#applicantName").text(response.applicantName);
    $("#applicantTin").text(response.applicantTIN);
    $("#typeOfWht").text(response.typeOfWithHolding);
    $("#typeOfApp").text("WHT Tax Exemption");
    $("#residentialStatus").text(response.residentialStatus);
    $("#remarks").text(response.remarks);
    $("#reason").text(response.reasons);
    $("#appNo").text(response.applicationNo);
    $("#appNoMore").text(response.applicationNo);
    $("#appNoDetails").text(response.applicationNo);
    $("#applicationStatus").text(response.status);
    $("#modalId").text(response.applicationNo);
    $("#applicantEmail").text(response.email);
    $("#applicantPhone").text(response.phoneNo);
};

var loadTaxPositionDetails = function (listOfSummaryAPI) {

    if (listOfSummaryAPI != null) {

        var listOfSummary = listOfSummaryAPI[0].taxPositions;

        let output = "";

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

    } else {

        toastr.info("Tax position for this application could not be loaded, Please check if the tax position were added by officer")
        return;
    }

};

$("#taxPositionMoreDetails").click(function () {
    $("#texDetails").hide();
    $("#taxPositionView").show();

    $("#previousDetailBtn").show();
    $("#taxPositionMoreDetails").hide();
});

$("#previousDetailBtn").click(function () {
    $("#taxPositionView").hide();
    $("#texDetails").show();

    $("#taxPositionMoreDetails").show();
    $("#previousDetailBtn").hide();
});

var hideAndShow = function () {
    $("#taxPosition").show();
    $("#texGridView").hide();
    $("#texDetails").show();
    $("#taxPositionView").hide();
    $("#previousDetailBtn").hide();
    $("#taxPositionMoreDetails").show();
};

var loadMessages = function (tccId) {

    let url = `${GetTccCommentsByIdUrl}` + tccId;

    apiCaller(url, "GET", "", appendMessages)
};

$("#backToGrid").click(function () {
    backToView();
});

var backToView = function () {

    $("#taxPosition").hide();
    $("#texGridView").show();
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

        apiCaller(updateUrl, "PUT", ObjectToSend, successfullyUpdated);
    };
});

$("#continueApproval").click(function () {
    $("#yesOrNo").modal("show");
    $("#approveModal").modal("hide");
    $("#approveDecline").modal("hide");

    $("#approvalPurpose").text($("#reason").text());
    $("#approvalApplicantName").text($("#applicantName").text());
    $("#approvalRequestingEntity").text($("#typeOfWht").text());
    $("#approvalExpiryDate").text($("#expiryDateTcc").val());
});

var approveTEX = function () {
    let tccId = $("#appId").val();
    let updateUrl = tccUpdateUrl + tccId;

    let ObjectToSend = {
        "status": selectedStatus,
        "taxpayerComment": $("#taxpayerMessage").val(),
        "internalComment": $("#internalMessage").val(),
        "applicationId": tccId,
        "expiryDate": calculateTwelveMonths()
    };

    apiCaller(updateUrl, "PUT", ObjectToSend, successfullyUpdated);
};

var backToGrid = function () {
    setTimeout(function () {
        window.location.href = `${serverUrl}approval/texapproval`;
    }, 3000);
};

$("#yesBtn").click(function () {
    approveTEX();
});

$("#noYesBtn").click(function () {
    $("#yesOrNo").modal("hide");
    $("#approveModal").modal("show");
    $("#approveDecline").modal("show");
});