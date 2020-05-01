var HeaderName = "My Tasks";
var serverUrl = $("#serverUrl").val();
var searchTccByTaxOffice = `${serverUrl}api/TCC/GetAllTccApplicationByTaxOfficeId`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetTccByIdUrl = `${serverUrl}api/TCC/GetTccApplicationById?tccId=`;
var GetTCCDocuments = `${serverUrl}api/TCC/GetTCCApplicationDocumentByApplicationId`;
let tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;
var ReportDownloadView = `${serverUrl}applications/certificate`;
var loadPtrCodesUrl = `${serverUrl}api/CodesApi/`;
var activeTaxOffice = "";
var appType = "TCC";

$("#tccListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("tccListOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
})

var initializeKendoGrid = function (data, stage) {
    if (data) {
        if (data.length == 0 && stage !== 1) {
            return toastr.info("No Data");
        };

        $("#Grid").kendoGrid({
            dataSource: { data: data, pageSize: 8 },
            sortable: true,
            selectable: true,
            dataBound: onDataBound,
            pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
            columns: [
                { field: "assignedDate", title: "Date", width: '90px', format: "{0:MM-dd-yyyy}" },
                { field: "applicantName", title: "Applicant", width: '17%' },
                { field: "applicantTIN", title: "TIN", width: '15%' },
                { field: "applicationType", title: "Application Type", width: '20%' },
                { field: "status", title: "Status", width: '20%' },
                {
                    command: [{
                        name: "view",
                        template: "<button title='View item' class='btn btn-success btn-sm' style='margin-right: 2px'><span class='fa fa-file fa-lg'></span></button>"
                    }],
                    title: "Actions",
                    width: "90px"
                }
            ]
        });
    }
};

let onDataBound = function () {

};

$(document).ready(function () {
    initializeKendoGrid([], 1);
    bootstrapPage();
    setTitles();

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
    var userid = $("#userId").val(); //save in layout file
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
            toastr.error('An error occured');
        }
    });
};

var loadTccGrid = function (data) {

};

var validateSearchEntry = function () {
    let searchItem = $("#searchItem").val().trim();
    if (!searchItem.match(/\S/) || activeTaxOffice === "")
        return false;
    else
        return true;
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

        $("#Grid").data("kendoGrid").dataSource.data([]);
        let url = `${searchTccByTaxOffice}?officeId=` + activeTaxOffice + "&queryString=" + searchItem;
        apiCaller(url, "GET", "", initializeKendoGrid);
    } else {

        toastr.error("Tax office or search item field is empty");
    }
}

$("#btnSearch").click(function (e) {
    searchTcc();
});

$("#searchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTcc();
    }
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {

    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    $("#appId").val(item.applicationId);
    $("#appTypeId").val(item.applicationTypeId);
    $("#taxpayerName").text(item.applicantName);

    appType = item.applicationType;

    if (item.applicationType === "TCC")
        prepareDetailsViewTCC();
    if (item.applicationType === "WHT Exemption")
        prepareDetailsViewTEX();
    if (item.applicationType === "Disability Relief" || item.applicationType === "Aged Dependants Relief") {
        var PtrCodes = loadReliefTypes();
        $("#applicantNamePTR").text(item.applicantName);
        $("#applicantTINPTR").text(item.applicantTIN);
    }
});

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

var prepareDetailsViewPTR = function (pCode) {
    hideAndShowThingsPTR();
    loadMessages();
    loadDetailsViewPtr(pCode);
    getTccDocumentsById();
};

var hideAndShowThingsPTR = function () {
    $("#gridView").hide();
    $("#detailsView").show();
    $("#ptrDetailsGrid").show();
    $("#tccDetailsGrid").hide();
    $("#texDetailsGrid").hide();
};


var hideAndShowTEXThings = function () {
    $("#gridView").hide();
    $("#detailsView").show();
    $("#ptrDetailsGrid").hide();
    $("#tccDetailsGrid").hide();
    $("#texDetailsGrid").show();
};

var hideAndShowThings = function () {
    $("#gridView").hide();
    $("#detailsView").show();
    $("#ptrDetailsGrid").hide();
    $("#tccDetailsGrid").show();
    $("#texDetailsGrid").hide();
};

$("#backToGrid").click(function () {
    backToView();
});

var backToView = function () {
    $("#gridView").show();
    $("#detailsView").hide();
};

$("#previewApplication").click(function () {
    let appId = $("#appId").val();

    sessionStorage.setItem("tccReportId", appId);
    sessionStorage.setItem("tccLabel", "uniApplicationId");

    window.location.href = `${ReportDownloadView}`;
});