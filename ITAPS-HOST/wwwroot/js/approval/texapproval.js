var HeaderName = "WH Tax Exemption Approval";
var serverUrl = $("#serverUrl").val();
var searchTexByTaxOffice = `${serverUrl}api/TEX/GetAllTaxExemptionPendingApprovalByTaxOfficeId`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetAppDetailsById = `${serverUrl}api/TEX/GetWHTExApplicationById?whtId=`;
var activeTaxOffice = "";
var selectedStatus; 
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;

$("#texListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("texListOfTaxOffices");
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
            { field: "applicantName", title: "Applicant", width: '25%' },
            { field: "applicantTIN", title: "Applicant TIN", width: '15%' },
            { field: "applicationType", title: "WHT Type", width: '30%' },
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
    $("#texListOfTaxOffices").html(output);
};

var bootstrapPage = function () {
    $("#pgHeader").text(HeaderName);
    $("#texDetails").hide();
    $("#texGridView").show();

    $("#expiryDateTcc").flatpickr({
        maxDate: calculateTwelveMonths(),
        minDate: 'today'
    });

    initializeKendoGrid();

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
    prepareDetailsView(item.applicationId);
});

var prepareDetailsView = function (appId) {
    let url = `${GetAppDetailsById}` + appId;

    hideAndShow();
    loadMessages(appId);
    apiCaller(url, "GET", "", loadAppDetails);
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

var hideAndShow = function () {
    $("#texDetails").show();
    $("#texGridView").hide();
};

var loadMessages = function (tccId) {

    let url = `${GetTccCommentsByIdUrl}` + tccId;

    apiCaller(url, "GET", "", appendMessages)
};

$("#backToGrid").click(function () {
    backToView();
});

var backToView = function () {

    $("#texDetails").hide();
    $("#texGridView").show();
};

$("#approveDeclineReturnBtn").click(function () {

    if (selectedStatus == 2) {

        approveTEX();

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
    approveTEX();
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