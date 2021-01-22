ej.grids.Grid.Inject(ej.grids.Page, ej.grids.Sort, ej.grids.Filter, ej.grids.Group);

var HeaderName = "Applicant Applications";
var serverUrl = $("#serverUrl").val();
var searchTccByTaxOffice = `${serverUrl}api/TCC/GetAllApplicantApplications`;
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
                { field: 'submittedDate', headerText: 'Date Submitted', width: 80, format: 'yMd' },
                { field: 'statusDate', headerText: 'Last Updated', width: 80, format: 'yMd' },
                { field: 'applicantName', headerText: 'Applicant', width: 120 },
                { field: 'typeOfApplication', headerText: 'Application Type', width: 90 },
                { field: 'status', headerText: 'Status', width: 80 },
                { type: 'button', width: 30 },
            ],
            height: 350,
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

    $("#gridView").show();
});

var bootstrapPage = function () {
    $("#pgHeader").text(HeaderName);

    $("#endDate").flatpickr({
        dateFormat: "Y-m-d"
    });
    $("#startDate").flatpickr({
        dateFormat: "Y-m-d"
    });
};

$("#applicantTin").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTcc();
    }
});

var searchTcc = function () {
    if (validateSearchEntry()) {

        let tin = $("#applicantTin").val().trim();
        let startDate = $("#startDate").val().trim();
        let endDate = $("#endDate").val().trim();

        if (tin.includes('/')) {
            for (var i = 0; i < tin.length; i++) {
                if (searchItem[i] === '/')
                    replaceAt(searchItem, i, '%2F');
            }
        }

        let url = `${searchTccByTaxOffice}?tinNo=${tin}&startDate=${startDate}&endDate=${endDate}`;
        apiCaller(url, "GET", "", initializeKendoGrid);
    } else {

        toastr.error("Fields cannot be empty");
    }
}

var validateSearchEntry = function () {
    let tin = $("#applicantTin").val().trim();
    let startDate = $("#startDate").val().trim();
    let endDate = $("#endDate").val().trim();

    if (!tin.match(/\S/) || !startDate.match(/\S/) || !endDate.match(/\S/))
        return false;
    else
        return true;
};

$("#btnSearch").click(function (e) {
    searchTcc();
});

function rowSelected(args) {
    var selectedrecords = gridGlobal.getSelectedRecords();
    onGridSelected(selectedrecords[0]);
};

var onGridSelected = function (item) {
    $("#appId").val(item.id);
    $("#appTypeId").val(item.applicationTypeId);
    $("#taxpayerName").text(item.applicantName);
    $(".modalId").text(testNullOrEmpty(item.applicationNo));
    $(".applicationType").text(item.typeOfApplication);

    appType = item.typeOfApplication;
    activeApplicationType = item.typeOfApplication;

    if (item.typeOfApplication.toUpperCase().trim() === "TCC".toUpperCase())
        prepareDetailsViewTCC();
    if (item.typeOfApplication.toUpperCase().trim() === "WHT Exemption".toUpperCase())
        prepareDetailsViewTEX();
    if (item.typeOfApplication.toUpperCase().trim() === "Disability Relief".toUpperCase()
        || item.typeOfApplication.toUpperCase().trim() === "Old Dependants Relief".toUpperCase()
        || item.typeOfApplication.toUpperCase().trim() === "Old Age Relief".toUpperCase()
        || item.typeOfApplication.toUpperCase().trim() === "Pension Relief".toUpperCase()
        || item.typeOfApplication.toUpperCase().trim() === "Marriage/Responsibility Relief".toUpperCase()
        || item.typeOfApplication.toUpperCase().trim() === "Child Education Relief".toUpperCase()) {
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