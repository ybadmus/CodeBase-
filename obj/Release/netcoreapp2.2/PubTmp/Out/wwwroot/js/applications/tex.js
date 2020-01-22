var HeaderName = "Tax Exemptions";
var serverUrl = $("#serverUrl").val();
var searchTexByTaxOffice = `${serverUrl}api/TEX/GetAllTExApplicationByTaxOfficeId`; 
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetTCCDocuments = `${serverUrl}api/TCC/GetTCCApplicationDocumentByApplicationId`;
var GetTexByIdUrl = `${serverUrl}api/TEX/GetWHTExApplicationById?whtId=`;
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;
//var ReportDownloadView = `${ServerUrl}applications/certificate?uniApplicationId=`;
var ReportDownloadView = "";
var activeTaxOffice = "";
var appType = "TEX";

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
            { field: "statusDate", title: "Date", width: '90px', format: "{0:MM-dd-yyyy}" },
            { field: "applicantName", title: "Applicant", width: '20%' },
            { field: "applicantTIN", title: "TIN", width: '100px' },
            { field: "typeOfWithHolding", title: "WHT Type", width: '20%' },
            { field: "status", title: "Status", width: '15%' },
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
    initializeKendoGrid();
    bootstrapPage();
    setTitles();

    $("#texGridView").show();
    $("#detailsView").hide();

    $("#tccDetailsGrid").hide();
    $("#texDetailsGrid").show();
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
    $("#texListOfTaxOffices").html(output);
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
        let url = `${searchTexByTaxOffice}?officeId=` + activeTaxOffice + "&queryString=" + searchItem;
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
    prepareDetailsView();
});

var prepareDetailsView = function () {
    hideAndShowThings();
    loadMessages();
    loadDetailsViewTex();
    getTccDocumentsById();
};

var hideAndShowThings = function () {
    $("#texGridView").hide();
    $("#detailsView").show();
};

$("#backToGrid").click(function () {
    backToView();
});

var backToView = function () {
    $("#texGridView").show();
    $("#detailsView").hide();
};

$("#previewApplication").click(function () {
    let appId = $("#appId").val();
    //let url = `${ReportDownloadView}` + appId;

    //window.open(url, "_blank");
});