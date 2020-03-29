'use strict';

var ServerUrl = $("#serverUrl").val();
var HeaderName = "WH VAT Transactions";
var currentPeriods = [];
var searchObject = {
    "taxOfficeId": "",
    "periodId": ""
};

$(document).ready(function () {
    showHideTrDetails();
    SetHeaderNameToHTML();
    InitializeKendoGrid([], 1);
    GetTaxOfficesByUser();
    $("#endDate").flatpickr({});
    $("#startDate").flatpickr({});
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

var SetHeaderNameToHTML = function () {

    $("#pgHeader").text(HeaderName);
};

var InitializeKendoGrid = function (data, stage) {
    if (data == null || data.length == 0 && stage !== 1) {
        return toastr.info("No Data");
    };

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 15 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "invoiceNumber", title: "Invoice #", width: "15%" },
            { field: "vatAgentName", title: "VAT Agent", width: "20%" },
            { field: "whVatAgentName", title: "WH VAT Agent", width: "20%" },
            {
                field: "vatableAmount", title: "Vatable Amount", width: "15%", attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.vatableAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }  },
            {
                field: "vatWithHeld", title: "Amt WithHeld", width: "15%", attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.vatWithHeld).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                } },
            { field: "status", title: "Status", width: "10%", attributes: { style: "text-align:center;" } },
            {
                command: [{ name: "view", template: "<button title='View item' class='btn btn-success btn-sm' style='margin-right: 2px'><span class='fa fa-file fa-lg'></span></button>" }],
                title: "Actions",
                width: "7%"
            } 
        ]
    });
};

var LoadActivePeriods = function (listOfPeriods) {

    if (listOfPeriods === null)
        return toastr.info("No Data");

    if (listOfPeriods.length > 0) {
        enablePeriodFields();
        currentPeriods = listOfPeriods;

        var output = '<option value="0" selected>Select Period</option>';

        for (var i = 0; i < listOfPeriods.length; i++) {
            output = output + '<option value="' + listOfPeriods[i].id + '" >' + listOfPeriods[i].period + '</option>';
        }

        output = output;

        $("#listOfActivePeriods").html(output);
    } else {

        toastr.info("No Periods");
    }

};

var enablePeriodFields = function () {
    $("#listOfActivePeriods").prop("disabled", false);
    $("#endDate").prop("disabled", true);
    $("#startDate").prop("disabled", true);
};

var disablePeriodFields = function () {
    $("#listOfActivePeriods").prop("disabled", true);
    $("#endDate").prop("disabled", true);
    $("#startDate").prop("disabled", true);

    $("#endDate").val("");
    $("#startDate").val("");
    $("#listOfActivePeriods").empty();
};

var LoadTaxOffices = function (listOfTaxOffices) {
    var listOfTaxOffices = listOfTaxOffices
    var output = "";
    if (listOfTaxOffices.length > 0) {
        listOfTaxOffices.sort((a, b) => (a.taxOfficeName > b.taxOfficeName) - (a.taxOfficeName < b.taxOfficeName));

        output += '<option value="0" selected>Select Office</option>';
        for (var i = 0; i < listOfTaxOffices.length; i++) {
            output = output + '<option value="' + listOfTaxOffices[i].taxOfficeId + '" >' + listOfTaxOffices[i].taxOfficeName + '</option>';
        };
    }

    output = output;
    $("#tccListOfTaxOffices").html(output);
};

var GetActivePeriods = function (year) {
    var url = `${ServerUrl}api/MonoApi/GetAllActivePeriods?year=${year}`;
    ApiCaller(url, "GET", "", LoadActivePeriods);
};

var enableDatePicker = function (periodId) {
    for (var i = 0; i < currentPeriods.length; i++) {
        if (currentPeriods[i].id === periodId) {
            $("#startDate").flatpickr({
                minDate: currentPeriods[i].startDate.substring(0, 4) + '-' + currentPeriods[i].startDate.substring(5, 7) + '-' + currentPeriods[i].startDate.substring(8, currentPeriods[i].startDate.length),
                maxDate: currentPeriods[i].endDate.substring(0, 4) + '-' + currentPeriods[i].endDate.substring(5, 7) + '-' + currentPeriods[i].endDate.substring(8, currentPeriods[i].endDate.length)
            });

            $("#endDate").flatpickr({
                minDate: currentPeriods[i].startDate.substring(0, 4) + '-' + currentPeriods[i].startDate.substring(5, 7) + '-' + currentPeriods[i].startDate.substring(8, currentPeriods[i].startDate.length),
                maxDate: currentPeriods[i].endDate.substring(0, 4) + '-' + currentPeriods[i].endDate.substring(5, 7) + '-' + currentPeriods[i].endDate.substring(8, currentPeriods[i].endDate.length)
            });

            $("#endDate").prop("disabled", false);
            $("#startDate").prop("disabled", false);
        }
    }
};

var GetTaxOfficesByUser = function () {
    var userid = $("#UserObj").val();
    var url = `${ServerUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    ApiCaller(url, "GET", "", LoadTaxOffices);
};

var searchWht = function () {
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value
    let taxpayerTin = document.getElementById("taxpayerTin").value;
    let filter = document.getElementById("searchFilter").value;
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

    $("#Grid").data("kendoGrid").dataSource.data([]);
    ApiCaller(url, "GET", "", InitializeKendoGrid);
}

var getDetails = function (invoiceNumber) {
    var url = `${ServerUrl}api/wht/GetGWVTByInvoiceNumber?invoiceNumber=${invoiceNumber}`;

    ApiCaller(url, "GET", "", LoadModalDetails);
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

    hideShowTrDetail();
};

$("#searchWHT").click(function (e) {
    searchWht();
});

$("#tccListOfTaxOffices").on('change', function () {
    var e = document.getElementById("tccListOfTaxOffices");
    searchObject.taxOfficeId = e.options[e.selectedIndex].value;
});

$("#listOfActivePeriods").on('change', function () {
    var e = document.getElementById("listOfActivePeriods");
    searchObject.periodId = e.options[e.selectedIndex].value;
    enableDatePicker(searchObject.periodId);
});

$("#searchYear").on('change', function () {
    var e = document.getElementById("searchYear");

    disablePeriodFields();
    GetActivePeriods(e.options[e.selectedIndex].value);
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    getDetails(item.invoiceNumber);
});

var hideShowTrDetail = function () {
    $("#gridDetails").show();
    $("#gridHeader").hide();
};

var showHideTrDetails = function () {
    $("#gridDetails").hide();
    $("#gridHeader").show();
}

$("#backToGrid").click(function () {
    $("#gridDetails").hide();
    $("#gridHeader").show();
});
