var serverUrl = $("#serverUrl").val();
var searchPITByTaxOffice = `${serverUrl}api/Transaction/SearchTransactionAsync`;
var pitDetailsUrl = `${serverUrl}api/Transaction/TransactionDetails`;
var activeTaxOffice = "";
var activeYear = "";

var objToSend = {
    "assessmentYear": "",
    "transactionType": "",
    "taxType": "PIT",
    "taxOfficeId": "",
    "tin": "",
    "startDate": "",
    "endDate": "",
};

$(document).ready(function () {
    if (getParameterByName("type") === "annualreturn") {

        bootstrapNotification();
        loadDetails(getParameterByName("pkId"));
    } else if (getParameterByName("type") === "provisional") {

        bootstrapNotification();
        loadDetails(getParameterByName("pkId"));
    } else {

        bootstrapPage();
    }
});

var initializeKendoGrid = function (data, stage) {
    if (data == null || data.length == 0 && stage !== 1) {
        return toastr.info("No Data");
    };

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: false,
        selectable: false,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "submissionDate", title: "Date", width: '100px' },
            { field: "tin", title: "TIN", width: '100px' },
            { field: "entityName", title: "Entity Name", width: '55%' },
            {
                command: [{
                    name: "view",
                    template: "<button title='View item' class='btn btn-success btn-sm' style='margin-right: 2px'><span class='fa fa-file fa-lg'></span></button>"
                }],
                title: "Actions",
                width: "72px"
            }
        ]
    });
};

var bootstrapPage = function () {

    $("#pgHeader").text(HeaderName);
    $("#gridView").show();
    $("#returnDetail").hide();
    $("#estimateDetail").hide();
    $("#endDate").flatpickr({});
    $("#startDate").flatpickr({});

    initializeKendoGrid([], 1);
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

var getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

var validateSearchEntry = function () {
    let searchItem = $("#searchItem").val().trim();
    if (!searchItem.match(/\S/) || activeTaxOffice === "")
        return false;
    else
        return true;
};

var searchPIT = function () {
    objToSend.assessmentYear = activeYear === "" ? new Date().getFullYear() : activeYear;
    objToSend.taxOfficeId = activeTaxOffice;
    objToSend.transactionType = HeaderName === "PIT Return" ? "Return" : "Estimate"
    objToSend.tin = $("#tinHolder").val();
    objToSend.startDate = $("#startDate").val();
    objToSend.endDate = $("#endDate").val();

    let url = `${searchPITByTaxOffice}`;

    $("#Grid").data("kendoGrid").dataSource.data([]);
    apiCaller(url, "POST", objToSend, initializeKendoGrid);
};

var bootstrapNotification = function () {
    $("#pgHeader").text(HeaderName);
    $("#gridView").hide();
    $("#estimateDetail").hide();
    $("#returnDetail").show();
};

$("#btnSearch").click(function () {
    searchPIT();
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {

    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    $(".entityName").text(item.entityName);
    $(".tin").text(item.tin);
    loadDetails(item.id);
});

$("#listOfTaxOffices").on('change', function () {

    var elem = document.getElementById("listOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
});

$("#assessmentYear").on('change', function () {

    var elem = document.getElementById("assessmentYear");
    activeYear = elem.options[elem.selectedIndex].value;
});

$("#backToGrid").click(function () {

    $("#gridView").show();
    $("#returnDetail").hide();
    $("#estimateDetail").hide();
    $(".entityName").text("");
    $(".tin").text("");

    if (getParameterByName("type") === "annualreturn" || getParameterByName("type") === "provisional")
        initializeKendoGrid([], 1);
});

