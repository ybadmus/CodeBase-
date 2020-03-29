var HeaderName = "PTR Approval";
var serverUrl = $("#serverUrl").val();
var searchTexByTaxOffice = `${serverUrl}api/PTR/GetAllPTRPendingApprovalByTaxOfficeId`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetAppDetailsById = `${serverUrl}api/PTR/GetReliefApplicationDetailsByIdAndType?uniApplicationId=`;
var activeTaxOffice = "";
var selectedStatus;
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;
var loadPtrCodesUrl = `${serverUrl}api/CodesApi/`;
var PtrCodes = [];


$("#ptrListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("ptrListOfTaxOffices");
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
            { field: "applicantTIN", title: "TIN", width: '15%' },
            { field: "applicationType", title: "Type", width: '15%' },
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
    bootstrapPage();
});

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
    $("#ptrListOfTaxOffices").html(output);
};

var bootstrapPage = function () {
    $("#pgHeader").text(HeaderName);
    $("#ptrDetails").hide();
    $("#ptrGridView").show();

    $("#expiryDateTcc").flatpickr({
        maxDate: calculateTwelveMonths(),
        minDate: 'today'
    });

    initializeKendoGrid();
    loadReliefTypes();

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

        let url = `${searchTexByTaxOffice}?officeId=` + activeTaxOffice + "&queryString=" + searchItem;
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

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    $("#appId").val(item.applicationId);
    $("#modalId").text(item.applicationNo);
    $("#appNo").text(item.applicationNo);
    $("#currentStatus").text(item.statusId);
    $("#applicantNamePTR").text(item.applicantName);
    $("#applicantTINPTR").text(item.applicantTIN);

    var ptrCode = ""

    for (var i = 0; i < PtrCodes.length; i++) {
        if (PtrCodes[i].description.toUpperCase().trim() === item.applicationType.toUpperCase().trim()) {
            ptrCode = PtrCodes[i].code.trim();
            break;
        }
    };

    prepareDetailsView(item.applicationId, ptrCode);
    hideAndShow();
});

var prepareDetailsView = function (appId, pCode) {
    let url = `${GetAppDetailsById}` + appId + "&applicationTypeCode=" + pCode;

    loadMessages(appId);
    apiCaller(url, "GET", "", loadPtrDetails);
};

var loadPtrDetails = function (resp) {
    $("#appIdHeader").text(resp.applicationNo);
    $("#appStatusHeader").text(resp.status);

    $("#dateSubmittedPTR").text(resp.submittedDate);
    $("#lastUpdatedPTR").text(resp.statusDate);
    $("#assessmentYearPTR").text(resp.assessmentYear);
    $("#dateOfBirthPTR").text(resp.dateOfBirth);
    $("#employerAddressPTR").text(resp.employerAddress);
    $("#employerEmailPTR").text(resp.employerEmail);
    $("#employerNamePTR").text(resp.employerName);
    $("#employerPhonePTR").text(resp.employerPhone);
    $("#employerTINPTR").text(resp.employerTIN);
    $("#endDatePTR").text(resp.endDate);
    $("#genderPTR").text(resp.gender === "M" ? "Male" : resp.gender === "F" ? "Female" : resp.gender);
    $("#maritalStatusPTR").text(resp.maritalStatus);
    $("#mothersMaidenNamePTR").text(resp.mothersMaidenName);
    $("#phoneNoPTR").text(resp.phoneNo);
    $("#startDatePTR").text(resp.startDate);
    $("#appNoTex2").text(resp.applicationNo);

};

var loadReliefTypes = function () {
    var url = `${loadPtrCodesUrl}APT`;

    apiCaller(url, "GET", "", ptrCodesFlow);
};

var ptrCodesFlow = function (resp) {
    PtrCodes = resp;
};

var hideAndShow = function () {
    $("#ptrDetails").show();
    $("#ptrGridView").hide();
};

var loadMessages = function (tccId) {

    let url = `${GetTccCommentsByIdUrl}` + tccId;

    apiCaller(url, "GET", "", appendMessages)
};

$("#backToGrid").click(function () {
    backToView();
});

var backToView = function () {

    $("#ptrDetails").hide();
    $("#ptrGridView").show();
};

$("#approveDeclineReturnBtn").click(function () {

    if (selectedStatus == 2) {

        approvePTR();

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

var approvePTR = function () {
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

$("#continueApproval").click(function () {
    approvePTR();
});

var backToGrid = function () {
    setTimeout(function () {
        window.location.href = `${serverUrl}approval/ptrapproval`;
    }, 3000);
};