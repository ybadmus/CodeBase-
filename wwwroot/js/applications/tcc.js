var HeaderName = "Tax Clearance Certificate";
var serverUrl = $("#serverUrl").val();
var searchTccByTaxOffice = `${serverUrl}api/TCC/GetAllTccApplicationByTaxOfficeId`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetTccByIdUrl = `${serverUrl}api/TCC/GetTccApplicationById?tccId=`;
var GetTCCDocuments = `${serverUrl}api/TCC/GetTCCApplicationDocumentByApplicationId`;
let tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;
var ReportDownloadView = `${serverUrl}applications/certificate`;
var activeTaxOffice = "";
var appType = "TCC";

$("#tccListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("tccListOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
})

var initializeKendoGrid = function (data, stage) {
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
            { field: "statusDate", title: "Date", width: '90px', format: "{0:MM-dd-yyyy}" },
            { field: "applicantName", title: "Applicant", width: '17%' },
            { field: "requestingEntity", title: "Requesting Entity", width: '20%' },
            { field: "purpose", title: "Purpose", width: '20%' },
            { field: "status", title: "Status", width: '15%' },
            {
                command: [{
                    name: "view",
                    template: "<button title='View item' class='btn btn-success btn-sm' style='margin-right: 2px'><span class='fa fa-file fa-lg'></span></button>"
                }, {
                    name: "certificate",
                        template: "<button id='certBtn' title='View certificate' class='btn btn-light btn-sm'><span class='fa fa-certificate fa-lg'></span></button>",
                    visible: false
                }],
                title: "Actions",
                width: "90px"
            }
        ]
    });
};

let onDataBound = function () {
   
};

$(document).ready(function () {
    initializeKendoGrid([], 1);
    bootstrapPage();
    setTitles();

    $("#tccGridView").show();
    $("#detailsView").hide();

    $("#tccDetailsGrid").show();
    $("#texDetailsGrid").hide();
    $("#ptrDetailsGrid").hide();
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
    prepareDetailsView();
});

var prepareDetailsView = function () {

    hideAndShowThings();
    loadMessages();
    loadDetailsView();
    getTccDocumentsById();
};

var hideAndShowThings = function () {
    $("#tccGridView").hide();
    $("#detailsView").show();
};

$("#backToGrid").click(function () {
    backToView();
});

var backToView = function () {
    $("#tccGridView").show();
    $("#detailsView").hide();
};

$("#previewApplication").click(function () {
    let appId = $("#appId").val();

    localStorage.setItem("tccReportId", appId);
    localStorage.setItem("tccLabel", "uniApplicationId");

    let url = `${ReportDownloadView}`;

    window.open(url, "_blank");
});