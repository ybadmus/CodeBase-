ej.grids.Grid.Inject(ej.grids.Page, ej.grids.Sort, ej.grids.Filter, ej.grids.Group);

var HeaderName = "My Tasks";
var serverUrl = $("#serverUrl").val();
var searchTccByTaxOffice = `${serverUrl}api/TCC/GetAllTccApplicationByTaxOfficeId`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetTccByIdUrl = `${serverUrl}api/TCC/GetTccApplicationById?tccId=`;
var GetTCCDocuments = `${serverUrl}api/TCC/GetTCCApplicationDocumentByApplicationId`;
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;
var tccMessagesOnlyUrl = `${serverUrl}api/TCC/SendTCCApplicationMessage?id=`;
var ReportDownloadView = `${serverUrl}reportviewer/index`;
var loadPtrCodesUrl = `${serverUrl}api/CodesApi/`;
var appType = "TCC";
var activeApplicationType = "";
var gridGlobal = "";

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
                { field: 'assignedDate', headerText: 'Date Assigned', width: 80 },
                { field: 'applicantName', headerText: 'Applicant', width: 120 },
                { field: 'applicantTIN', headerText: 'TIN', width: 60 },
                { field: 'applicationType', headerText: 'Application Type', width: 90 },
                { field: 'status', headerText: 'Status', width: 100 },
                { type: 'button', width: 30 },
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

$(document).ready(function () {
    initializeKendoGrid([], 1);
    bootstrapPage();
    setTitles();
    searchTcc();

    $("#gridView").show();
});

var setTitles = function () {
    $("#pgHeader").text(HeaderName);
};

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
        error: function () {
            $('html').hideLoading();
            toastr.error("Error connecting to server, Please try again!');
        }
    });
};

var validateSearchEntry = function () {
    let searchItem = $("#searchItem").val().trim();
    if (!searchItem.match(/\S/))
        return false;
    else
        return true;
};

var searchTcc = function () {

    let searchItem = "*";
    if (searchItem.includes('/')) {
        for (var i = 0; i < searchItem.length; i++) {
            if (searchItem[i] === '/')
                replaceAt(searchItem, i, '%2F');
        }
    }
    let url = `${searchTccByTaxOffice}?queryString=` + searchItem.trim();
    apiCaller(url, "GET", "", initializeKendoGrid);

}

$("#btnSearch").click(function (e) {
    searchTcc();
});

$("#searchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTcc();
    }
});

function rowSelected(args) {
    var selectedrecords = gridGlobal.getSelectedRecords();
    onGridSelected(selectedrecords[0]);
};

var onGridSelected = function (item) {
    $("#appId").val(item.applicationId);
    $("#appTypeId").val(item.applicationTypeId);
    $("#taxpayerName").text(item.applicantName);
    $(".modalId").text(testNullOrEmpty(item.applicationNo));
    $(".applicationType").text(item.applicationType);

    appType = item.applicationType;
    activeApplicationType = item.applicationType;

    if (item.applicationType.toUpperCase().trim() === "TCC".toUpperCase())
        prepareDetailsViewTCC();
    if (item.applicationType.toUpperCase().trim() === "WHT Exemption".toUpperCase())
        prepareDetailsViewTEX();
    if (item.applicationType.toUpperCase().trim() === "Disability Relief".toUpperCase()
        || item.applicationType.toUpperCase().trim() === "Old Dependants Relief".toUpperCase()
        || item.applicationType.toUpperCase().trim() === "Old Age Relief".toUpperCase()
        || item.applicationType.toUpperCase().trim() === "Pension Relief".toUpperCase()
        || item.applicationType.toUpperCase().trim() === "Marriage/Responsibility Relief".toUpperCase()
        || item.applicationType.toUpperCase().trim() === "Child Education Relief".toUpperCase()) {
        prepareDetailsViewPTR();
        $("#applicantNamePTR").text(item.applicantName);
        $("#applicantFName").text(item.applicantName);
        $("#applicantTINPTR").text(item.applicantTIN);
    }
};

var loadReliefTypes = function () {
    var url = `${loadPtrCodesUrl}APT`;

    return apiCaller(url, "GET", "", function (resp) { return resp; });
};

var ptrCodesFlow = function (resp) {
    return resp;
};

var prepareDetailsViewTCC = function () {
    hideAndShowThings();
    loadMessages();
    loadDetailsView();
    getTccDocumentsById();
};

var prepareDetailsViewTEX = function () {
    hideAndShowTEXThings();
    loadMessages();
    loadDetailsViewTex();
    getTccDocumentsById();
};

var prepareDetailsViewPTR = function () {
    hideAndShowThingsPTR();
    loadMessages();
    loadDetailsViewPtr();
    getTccDocumentsById();
};

var hideAndShowThingsPTR = function () {
    $("#gridView").hide();
    $("#ptrDetailsGrid").show();
    $("#tccDetailsGrid").hide();
    $("#texDetailsGrid").hide();

    $("#detailsView").show();
};

var hideAndShowTEXThings = function () {
    $("#gridView").hide();
    $("#ptrDetailsGrid").hide();
    $("#tccDetailsGrid").hide();
    $("#ptrDisabilityReliefDetailsGrid").hide();
    $("#ptrMarriageReliefDetailsGrid").hide();
    $("#ptrAgedDepedentReliefDetailsGrid").hide();
    $("#ptrOldAgeReliefDetailsGrid").hide();
    $("#ptrChildWardDepedentReliefDetailsGrid").hide();
    $("#tccRequestEntityDetailsGrid").hide();

    $("#texWHTDetailsGrid").show();
    $("#detailsView").show();
    $("#texDetailsGrid").show();
};

var hideAndShowThings = function () {
    $("#gridView").hide();
    $("#texDetailsGrid").hide();
    $("#ptrDetailsGrid").hide();
    $("#ptrDisabilityReliefDetailsGrid").hide();
    $("#ptrMarriageReliefDetailsGrid").hide();
    $("#ptrAgedDepedentReliefDetailsGrid").hide();
    $("#ptrOldAgeReliefDetailsGrid").hide();
    $("#ptrChildWardDepedentReliefDetailsGrid").hide();
    $("#texWHTDetailsGrid").hide();

    $("#tccRequestEntityDetailsGrid").show();
    $("#detailsView").show();
    $("#tccDetailsGrid").show();
};

$("#backToGrid").click(function () {
    backToView();
});

var backToView = function () {
    $("#gridView").show();
    $("#detailsView").hide();
};

$("#previewApplication").click(function () {

    if (activeApplicationType === "TCC") {
        let appId = $("#appId").val();
        sessionStorage.setItem("tccReportId", appId);
        sessionStorage.setItem("tccLabel", "uniApplicationId");

        window.location.href = `${ReportDownloadView}`;
    } else {

        return toastr.info("No Preview Available");
    }
});