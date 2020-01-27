var HeaderName = "Personal Tax Exemptions";
var serverUrl = $("#serverUrl").val();
var searchPtrByTaxOffice = `${serverUrl}api/PTR/GetAllPtrApplicationsByTaxOfficeId`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetTCCDocuments = `${serverUrl}api/TCC/GetTCCApplicationDocumentByApplicationId`;
var GetPtrByIdUrl = `${serverUrl}api/PTR/GetReliefApplicationDetailsByIdAndType?uniApplicationId=`;
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;
var loadPtrCodesUrl = `${serverUrl}api/CodesApi/`;
var PtrCodes = [];
var ReportDownloadView = "";
var activeTaxOffice = "";
var appType = "PTR";

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
            { field: "statusDate", title: "Date", width: '90px', format: "{0:MM-dd-yyyy}" },
            { field: "applicantName", title: "Applicant Name", width: "25%" },
            { field: "applicantTIN", title: "TIN", width: "12%" },
            { field: "typeOfApplication", title: "PTR Type", width: "23%" },
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
    $("#ptrListOfTaxOffices").html(output);
};

var bootstrapPage = function () {
    setTitles();
    getTaxOffices();
    loadReliefTypes();

    $("#ptrGridView").show();
    $("#detailsView").hide();

    $("#tccDetailsGrid").hide();
    $("#texDetailsGrid").hide();
    $("#ptrDetailsGrid").show();
};

var loadReliefTypes = function () {
    var url = `${loadPtrCodesUrl}APT`;

    apiCaller(url, "GET", "", ptrCodesFlow);
};

var ptrCodesFlow = function (resp) {
    PtrCodes = resp;
};

var getTaxOffices = function () {
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

        let url = `${searchPtrByTaxOffice}?officeId=` + activeTaxOffice + "&queryString=" + searchItem;
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
    $("#currentStatus").text(item.statusId);
    $("#applicantNamePTR").text(item.applicantName);
    $("#applicantTINPTR").text(item.applicantTIN);

    var ptrCode = ""

    for (var i = 0; i < PtrCodes.length; i++) {
        if (PtrCodes[i].description.toUpperCase().trim() === item.typeOfApplication.toUpperCase().trim()) {
            ptrCode = PtrCodes[i].code.trim();
            break;
        }
    }

    prepareDetailsView(ptrCode);
});

var prepareDetailsView = function (pCode) {
    hideAndShowThings();
    loadMessages();
    loadDetailsViewPtr(pCode);
    getTccDocumentsById();
};

var hideAndShowThings = function () {
    $("#ptrGridView").hide();
    $("#detailsView").show();
};

$("#backToGrid").click(function () {
    backToView();
});

var backToView = function () {
    $("#ptrGridView").show();
    $("#detailsView").hide();
};
