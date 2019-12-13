'use strict';

var ServerUrl = $("#serverUrl").val();
var searchObject = {
    "taxOfficeId": "",
    "periodId": ""
};

$(document).ready(function () {
    SetHeaderNameToHTML();
    InitializeKendoGrid([]);
    GetActivePeriods();
    GetTaxOfficesByUser();
});

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

var HeaderName = "VAT Transactions";

var SetHeaderNameToHTML = function () {

    $("#pgHeader").text(HeaderName);
};

var InitializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 15 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "invoiceNumber", title: "Invoice #", width: "10%" },
            { field: "whVatAgentTIN", title: "TIN", width: "10%", attributes: { style: "text-align:right;" } },
            { field: "whVatAgentName", title: "Name", width: "28%" },
            {
                field: "vatableAmount", title: "Vatable Amount", width: "15%", attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.vatableAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
            //{ field: "vatRate", title: "Tax Rate", width: "10%", attributes: { style: "text-align:right;" } },
            {
                field: "vatWithHeld", title: "WHT Tax", width: "10%", attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.vatWithHeld).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
            { field: "status", title: "Status", width: "10%", attributes: { style: "text-align:center;" } },
            {
                command: [{ name: "view", template: "<button style='padding: 3px 10px;' stitle='View item' class='btn btn-success btn-sm'><i class='fa fa-file-text fa-lg'></i></button>" }],
                title: "Actions",
                width: "7%"
            }
        ]
    });
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

var LoadTaxOffices = function (listOfTaxOffices) {
    var listOfTaxOffices = listOfTaxOffices
    var output = "";
    if (listOfTaxOffices.length > 1) {
        listOfTaxOffices.sort((a, b) => (a.taxOfficeName > b.taxOfficeName) - (a.taxOfficeName < b.taxOfficeName));

        output += '<option value="0" selected>Select Office</option>';
        for (var i = 0; i < listOfTaxOffices.length; i++) {
            output = output + '<option value="' + listOfTaxOffices[i].taxOfficeId + '" >' + listOfTaxOffices[i].taxOfficeName + '</option>';
        };
    }

    output = output;
    $("#tccListOfTaxOffices").html(output);
};

var GetActivePeriods = function () {
    var url = `${ServerUrl}api/CodesApi/GetAllActivePeriods`;
    ApiCaller(url, "GET", "", LoadActivePeriods);
};

var GetTaxOfficesByUser = function () {
    var userid = $("#UserObj").val();
    var url = `${ServerUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    ApiCaller(url, "GET", "", LoadTaxOffices);
};

var searchWht = function () {
    let timePeriod = document.getElementById("timePeriod").value;
    let startenddate = timePeriod.split("to");
    let startDate = startenddate[0].trim();
    let endDate = startenddate[1].trim();
    let taxpayerTin = $("#taxpayerTin").val().trim();
    let filter = $("#searchFilter").val().trim();
    let url = "";

    if (taxpayerTin == "" && filter == "")
        url = `${ServerUrl}api/wht/SearchAllWHVatByTaxOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate;

    if (taxpayerTin == "" && filter != "")
        url = `${ServerUrl}api/wht/SearchAllWHVatByTaxOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&szFilter=` + filter;

    if (taxpayerTin != "" && filter == "")
        url = `${ServerUrl}api/wht/SearchAllWHVatByTaxOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&tin=` + taxpayerTin;

    if (taxpayerTin != "" && filter != "")
        url = `${ServerUrl}api/wht/SearchAllWHVatByTaxOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&tin=` + taxpayerTin + `&szFilter=` + filter;

    ApiCaller(url, "GET", "", InitializeKendoGrid);
}

var getDetails = function (invoiceNumber) {
    var url = `${ServerUrl}api/wht/GetGWVTByInvoiceNumber?invoiceNumber=${invoiceNumber}`;

    ApiCaller(url, "GET", "", LoadModalDetails);
    $("#whtDetailsModal").modal("show");
};

var LoadModalDetails = function (whtDetailsFromServer) {
    var whtDetails = whtDetailsFromServer[0];

    $("#whtStatus").text(whtDetails.status);
    $("#whtType").text(whtDetails.whtType);

    $("#invoiceNo").text(whtDetails.invoiceNumber); //parseFloat(whtDetails.contractAmount.split(".")[0]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#transactionDate").text(whtDetails.transactionDate);
    $("#vatAgent").text(whtDetails.vatAgentName);
    $("#vatAgentTin").text(whtDetails.vatAgentTIN);
    $("#taxpayerTel").text(whtDetails.taxpayerTel);
    $("#businessLocation").text(whtDetails.businessLocation);
    $("#contractAmount").text("GHS " + parseFloat(whtDetails.contractAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#vatWithHeld").text("GHS " + parseFloat(whtDetails.vatWithHeld).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#vatRate").text(whtDetails.vatRate);
    $("#vatableAmount").text("GHS " + parseFloat(whtDetails.vatableAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#whvatAgentName").text(whtDetails.whvatAgentName);
    $("#whvatAgentTIN").text(whtDetails.whvatAgentTIN);

    $("#contractNo").text(whtDetails.contractNo);
    $("#contractDesc").text(whtDetails.contractDesc);
    $("#invoiceDesc").text(whtDetails.invoiceDesc);
};

$("#searchWHTVAT").click(function (e) {
    searchWht();
});

$("#tccListOfTaxOffices").on('change', function () {
    var e = document.getElementById("tccListOfTaxOffices");
    searchObject.taxOfficeId = e.options[e.selectedIndex].value;
});

$("#listOfActivePeriods").on('change', function () {
    var e = document.getElementById("listOfActivePeriods");
    searchObject.periodId = e.options[e.selectedIndex].value;
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    getDetails(item.invoiceNumber);
});

