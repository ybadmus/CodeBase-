'use strict';

var ServerUrl = $("#serverUrl").val();
var HeaderName = "WH VAT Returns";
var searchObject = {
    "taxOfficeId": "",
    "periodId": ""
};

$(document).ready(function () {
    SetHeaderNameToHTML();
    InitializeKendoGrid([]);
    hideShowGrid();
    $("#endDate").flatpickr({});
    $("#startDate").flatpickr({});
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
            {   field: "entityName", title: "Entity", width: "" },
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

var SetHeaderNameToHTML = function () {

    $("#pgHeader").text(HeaderName);
};

var searchWht = function () {
    let taxpayerTin = document.getElementById("taxpayerTin").value;
    let filter = document.getElementById("searchFilter").value;
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value

    let url = "";

    if (taxpayerTin == "" && filter == "")
        url = `${ServerUrl}api/wht/SearchWithHoldingVatReturns?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate;

    if (taxpayerTin == "" && filter != "")
        url = `${ServerUrl}api/wht/SearchWithHoldingVatReturns?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&szFilter=` + filter;

    if (taxpayerTin != "" && filter == "")
        url = `${ServerUrl}api/wht/SearchWithHoldingVatReturns?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&tin=` + taxpayerTin;

    if (taxpayerTin != "" && filter != "")
        url = `${ServerUrl}api/wht/SearchWithHoldingVatReturns?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&tin=` + taxpayerTin + `&szFilter=` + filter;

    ApiCaller(url, "GET", "", InitializeKendoGrid);
};

var LoadModalGrid = function (listOfWht) {
    var output = "";
    for (var i = 0; i < listOfWht.length; i++) {
        var thId = i + 1;
        output = output + '<tr style="color: black; font-size: 14px"><td scope="row">' + thId + '</td><td>' + listOfWht[i].entity + '</td><td style="text-align: right">' + parseFloat(listOfWht[i].contractAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
            '</td><td style="text-align: right">' + parseFloat(listOfWht[i].vatableAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td style="text-align: right">' + parseFloat(listOfWht[i].vatWithHeld).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td>' + listOfWht[i].invoiceNo + '</td><td>' + listOfWht[i].date +
            '</td><td><button style="padding: 4px 8px;" onclick="detWHTDetailsByInvNo(this)" id="' + listOfWht[i].invoiceNo +c
            '" title="View item" class="btn btn-success btn-sm btnReturnDetail"><span class="fa fa-file fa-lg"></span></button></td></tr>';
    };

    output = output;

    $("#whtDetailGrid").html(output);
    showHideGrid();
};

var getWHTDetails = function (invoiceNumber) {
    var url = `${ServerUrl}api/wht/GetGWVTByInvoiceNumber?invoiceNumber=${invoiceNumber}`;

    ApiCaller(url, "GET", "", LoadModalDetails);
    gridShowHide();
};

var detWHTDetailsByInvNo = function (e) {
    getWHTDetails(e.id);
}

var GetGWVTByGwvr = function (period, tin) {
    var url = `${ServerUrl}api/wht/GetGWVTByGwvrAsync?periodId=${period}&tin=${tin}`;

    ApiCaller(url, "GET", "", LoadModalGrid);
};

var LoadModalDetails = function (whtDetailsFromServer) {
    var whtDetails = whtDetailsFromServer[0];

    $("#dateSubmitted").text(whtDetails.transactionDate);
    $("#invoiceNo").text(whtDetails.invoiceNumber);
    $("#invoiceDesc").text(whtDetails.invoiceDesc);
    $("#whtType").text(whtDetails.whtType);
    $("#whtStatus").text(whtDetails.status);
    $("#contractAmount").text("GHS " + parseFloat(whtDetails.contractAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#vatWithHeld").text("GHS " + parseFloat(whtDetails.vatWithHeld).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#vatRate").text(whtDetails.vatRate + " %");
    $("#vatableAmount").text("GHS " + parseFloat(whtDetails.vatableAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#contractNo").text(whtDetails.contractNo);
    $("#contractDesc").text(whtDetails.contractDesc);

    $("#vatAgent").text(whtDetails.vatAgentName);
    $("#vatAgentTin").text(whtDetails.vatAgentTIN);
    $("#taxpayerTel").text(whtDetails.taxpayerTel);
    $("#businessLocation").text(whtDetails.businessLocation);
    $("#whvatAgentName").text(whtDetails.whvatAgentName);
    $("#whvatAgentTIN").text(whtDetails.whvatAgentTIN);
    $("#taxOffice").text(whtDetails.taxOffice);

    gridShowHide();
};

$("#listOfTaxOffices").on('change', function () {
    var e = document.getElementById("listOfTaxOffices");
    searchObject.taxOfficeId = e.options[e.selectedIndex].value;
});

$("#searchWHTReturn").click(function (e) {
    searchWht();
});

$("#Grid").on("click", "[role='row']", function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    GetGWVTByGwvr(item.periodId, item.agentTIN);
});

$('#whtDetailsModal').on('hidden.bs.modal', function () {
    $("#detailsModal").modal("show");
});

var hideShowDetails = function () {
    $("#transactionDetails").hide();
    $("#gridDetails").show();
    $("#gridHeader").hide();
}

var hideShowGrid = function () {
    $("#transactionsList").hide();
    $("#gridDetails").hide();
    $("#gridHeader").show();
};

var showHideGrid = function () {
    $("#transactionsList").show();
    $("#gridDetails").hide();
    $("#gridHeader").hide();
}

var gridShowHide = function () {
    $("#transactionsList").hide();
    $("#gridDetails").show();
    $("#gridHeader").hide();
}

$("#backToList").click(function () {
    $("#transactionsList").hide();
    $("#gridDetails").hide();
    $("#gridHeader").show();
}); 

$("#backToGrid").click(function () {
    $("#transactionsList").show();
    $("#gridDetails").hide();
    $("#gridHeader").hide();
});