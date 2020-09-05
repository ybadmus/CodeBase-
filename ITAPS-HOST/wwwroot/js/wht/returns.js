'use strict';

var ServerUrl = $("#serverUrl").val();
var HeaderName = "WHT Returns";
var searchObject = {
    "taxOfficeId": "",
    "periodId": ""
};

$(document).ready(function () {
    SetHeaderNameToHTML();
    InitializeKendoGrid([]);
   
    hideShowGrid();
    $("#endDate").flatpickr({
        enableTime: true,
        dateFormat: "d-m-Y"
    });
    $("#startDate").flatpickr({
        enableTime: true,
        dateFormat: "d-m-Y"
    });
});

var InitializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 15 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "dateSubmitted", title: "Date Submitted", width: "" },
            {   field: "agentTIN", title: "TIN", width: "" },
            {   field: "entityName", title: "Name", width: "" },
            {
                field: "collectedFromAgent", title: "Amount Collected", width: "", attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.collectedFromAgent).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
            {
                field: "amountPaid", title: "Amount Paid", width: "", attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.amountPaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
            {
                field: "balance", title: "Balance", width: "", attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.balance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
            {
                command: [{ name: "view", template: "<button title='View item' class='btn btn-success btn-sm' style='margin-right: 2px'><span class='fa fa-file fa-lg'></span></button>" }],
                title: "Actions",
                width: "7%"
            }
        ]
    });
};

var SetHeaderNameToHTML = function () {

    $("#pgHeader").text(HeaderName);
};

var ApiCaller = function (url, type, data, callback) {
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

        },
        statusCode: {
            200: function (response) {
                $('html').hideLoading();

                if (callback) {
                    callback(response.body);
                };
            },
            204: function () {
                $('html').hideLoading();
            }
        },
        error: function (error) {

            $('html').hideLoading();
        }
    });
};

$("#listOfTaxOffices").on('change', function () {
    var e = document.getElementById("listOfTaxOffices");
    searchObject.taxOfficeId = e.options[e.selectedIndex].value;
});

$("#listOfActivePeriods").on('change', function () {
    var e = document.getElementById("listOfActivePeriods");
    searchObject.periodId = e.options[e.selectedIndex].value;
});

$("#searchWHTReturn").click(function () {
    let taxpayerTin = document.getElementById("taxpayerTin").value;
    let filter = document.getElementById("searchFilter").value;
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;

    let url = "";

    if (taxpayerTin == "" && filter == "")
        url = `${ServerUrl}api/wht/SearchMonthlyWithholdingReturnsByOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate;

    if (taxpayerTin == "" && filter != "")
        url = `${ServerUrl}api/wht/SearchMonthlyWithholdingReturnsByOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&szFilter=` + filter;

    if (taxpayerTin != "" && filter == "")
        url = `${ServerUrl}api/wht/SearchMonthlyWithholdingReturnsByOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&tin=` + taxpayerTin;

    if (taxpayerTin != "" && filter != "")
        url = `${ServerUrl}api/wht/SearchMonthlyWithholdingReturnsByOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&tin=` + taxpayerTin + `&szFilter=` + filter;

    ApiCaller(url, "GET", "", InitializeKendoGrid);
});

var GetActivePeriods = function () {
    var url = `${ServerUrl}api/MonoApi/GetAllActivePeriods`;
    ApiCaller(url, "GET", "", LoadActivePeriods);
};

var LoadActivePeriods = function (listOfPeriods) {
    var output = "";

    if (listOfPeriods.length > 0) {
        output += '<option value="0" selected>Select Period</option>';
        for (var i = 0; i < listOfPeriods.length; i++) {
            output = output + '<option value="' + listOfPeriods[i].id + '" >' + listOfPeriods[i].period + '</option>';
        }
    };

    output = output;
    $("#listOfActivePeriods").html(output);
};

var LoadModalGrid = function (listOfWht) {
    var output = "";
    for (var i = 0; i < listOfWht.length; i++) {
        var thId = i + 1;
        output = output + '<tr><td scope="row">' + thId + '</td><td>' + listOfWht[i].entity + '</td><td style="text-align: right">' + parseFloat(listOfWht[i].contractAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
            '</td><td style="text-align: right">' + parseFloat(listOfWht[i].grossAmountOfPayment).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td style="text-align: right">' + parseFloat(listOfWht[i].taxWithHeld).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td>' + listOfWht[i].invoiceNo + '</td><td>' + listOfWht[i].transType +
            '</td><td><button style="padding: 4px 8px;" onclick="detWHTDetailsByInvNo(this)" id="' + listOfWht[i].id +
            '" title="View item" class="btn btn-success btn-sm btnReturnDetail"><span class="fa fa-file fa-lg"></span></button></td></tr>';
    };

    output = output;

    $("#whtDetailGrid").html(output);
    hideShowDetails();
};

var GetGWTTByGwrt = function (period, tin) {
    var url = `${ServerUrl}api/wht/GetGWTTByGwrtAsync?periodId=${period}&tin=${tin}`;

    ApiCaller(url, "GET", "", LoadModalGrid);
};

var getWHTDetails = function (invoiceNumber) {
    var url = `${ServerUrl}api/wht/GetGWTTByInvoiceNumber?whtId=${invoiceNumber}`;

    ApiCaller(url, "GET", "", LoadModalDetails);
};

var LoadModalDetails = function (whtDetailsFromServer) {
    var whtDetails = whtDetailsFromServer[0];

    $("#dateSubmitted").text(whtDetails.transactionDate);
    $("#whtType").text(whtDetails.whtType);
    $("#whtStatus").text(whtDetails.status);
    $("#invoiceNo").text(whtDetails.invoiceNumber);

    $("#taxpayerName").text(whtDetails.taxpayerName);
    $("#taxpayerTIN").text(whtDetails.taxpayerTIN);
    $("#taxpayerTel").text(whtDetails.taxpayerTel);
    $("#businessLocation").text(whtDetails.businessLocation);

    $("#whtAgentName").text(whtDetails.whtAgentName);
    $("#whAgentTIN").text(whtDetails.whAgentTIN);
    $("#taxOffice").text(whtDetails.taxOffice === "" ? "N/A" : whtDetails.taxOffice);

    $("#contractAmount").text("GHS " + parseFloat(whtDetails.contractAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#grossAmount").text("GHS " + parseFloat(whtDetails.grossAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxWithHeld").text("GHS " + parseFloat(whtDetails.taxWithHeld).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#whtRate").text(whtDetails.whtRate + " %");
    $("#vatableAmt").text("GHS " + parseFloat(whtDetails.vatableAmt).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    hideShowGridDetails();
};

$("#Grid").on("click", "[role='row']", function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    GetGWTTByGwrt(item.periodId, item.agentTIN);
});

$('#whtDetailsModal').on('hidden.bs.modal', function () {
    $("#detailsModal").modal("show");
});

var detWHTDetailsByInvNo = function (e) {
    getWHTDetails(e.id);
}

var hideShowDetails = function () {
    $("#transactionDetails").hide();
    $("#gridDetails").show();
    $("#gridHeader").hide();
}

var hideShowGrid = function () {
    $("#transactionDetails").hide();
    $("#gridDetails").hide();
    $("#gridHeader").show();
    $("taxOfficesDiv").show();
    $("#taxOfficesDropdownDiv").show();
    $("#tccTaxOffices").show();
}

var hideShowGridDetails = function () {
    $("#transactionDetails").show();
    $("#gridDetails").hide();
    $("#gridHeader").hide();
};

var showGridDetails = function () {
    $("#transactionDetails").hide();
    $("#gridDetails").show();
    $("#gridHeader").show();
};

$("#backToGrid").click(function () {
    $("#transactionDetails").hide();
    $("#gridDetails").show();
    $("#gridHeader").hide();
});

$("#backToList").click(function () {
    $("#transactionDetails").hide();
    $("#gridDetails").hide();
    $("#gridHeader").show();
});

