'use strict';

var ServerUrl = $("#serverUrl").val();
var HeaderName = "Monthly Returns";
var searchObject = {
    "taxOfficeId": "",
    "periodId": ""
};

$(document).ready(function () {
    SetHeaderNameToHTML();
    InitializeKendoGrid([]);
    GetTaxOfficesByUser();
    GetActivePeriods();
});

var InitializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 15 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "agentTIN", title: "TIN", width: "" },
            //{ field: "period", title: "Period", width: "" },
            { field: "entityName", title: "Name", width: "" },
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
            { field: "dateSubmitted", title: "Date Submitted", width: "" },

            //{
            //    field: "amountOutsatnding", title: "Amount Outstanding", width: "", attributes: { style: "text-align:right;" }, template: function (data) {
            //        return parseFloat(data.amountOutsatnding).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
            //    }
            //},
            {
                command: [{ name: "view", template: "<button style='padding: 3px 10px;' title='View item' class='btn btn-success btn-sm'><i class='fa fa-file-text fa-lg'></i></button>" }],
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

$("#tccListOfTaxOffices").on('change', function () {
    var e = document.getElementById("tccListOfTaxOffices");
    searchObject.taxOfficeId = e.options[e.selectedIndex].value;
});

$("#listOfActivePeriods").on('change', function () {
    var e = document.getElementById("listOfActivePeriods");
    searchObject.periodId = e.options[e.selectedIndex].value;
});

$("#searchWHTReturn").click(function () {
    let timePeriod = document.getElementById("timePeriod").value;
    let taxpayerTin = document.getElementById("taxpayerTin").value;
    let filter = document.getElementById("searchFilter").value;

    let startenddate = timePeriod.split("to");
    let startDate = startenddate[0].trim();
    let endDate = startenddate[1].trim();

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
        url = `${ServerUrl}api/wht/SearchMonthlyWithholdingReturnsByOffice.?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&tin=` + taxpayerTin + `&szFilter=` + filter;

    ApiCaller(url, "GET", "", InitializeKendoGrid);
});

var GetTaxOfficesByUser = function () {
    var userid = $("#UserObj").val();
    var url = `${ServerUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;
    ApiCaller(url, "GET", "", LoadTaxOffices);
};

var GetActivePeriods = function () {
    var url = `${ServerUrl}api/CodesApi/GetAllActivePeriods`;
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

var LoadTaxOffices = function (listOfTaxOffices) {
    var listOfTaxOffices = listOfTaxOffices
    var output = "";

    if (listOfTaxOffices.length > 1) {
        listOfTaxOffices.sort((a, b) => (a.taxOfficeName > b.taxOfficeName) - (a.taxOfficeName < b.taxOfficeName));

        $("taxOfficesDiv").show();
        $("#taxOfficesDropdownDiv").show();
        $("#tccTaxOffices").show();

        output += '<option value="0" selected>Select Office</option>';
        for (var i = 0; i < listOfTaxOffices.length; i++) {
            output = output + '<option value="' + listOfTaxOffices[i].taxOfficeId + '" >' + listOfTaxOffices[i].taxOfficeName + '</option>';
        };
    };

    output = output;
    $("#tccListOfTaxOffices").html(output);
};

var LoadModalGrid = function (listOfWht) {
    var output = "";
    for (var i = 0; i < listOfWht.length; i++) {
        var thId = i + 1;
        output = output + '<tr style="color: black; font-size: 14px"><th scope="row">' + thId + '</th><td>' + listOfWht[i].entity + '</td><td style="text-align: right">' + parseFloat(listOfWht[i].contractAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
            '</td><td style="text-align: right">' + parseFloat(listOfWht[i].grossAmountOfPayment).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td style="text-align: right">' + parseFloat(listOfWht[i].taxWithHeld).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</td><td>' + listOfWht[i].invoiceNo + '</td><td>' + listOfWht[i].transType +
            '</td><td><button style="padding: 4px 8px;" onclick="detWHTDetailsByInvNo(this)" id="' + listOfWht[i].invoiceNo +
            '" title="View item" class="btn btn-success btn-sm btnReturnDetail"><i class="fa fa-file-text"></i></button></td></tr>';
    };

    output = output;

    $("#whtDetailGrid").html(output);
    $("#detailsModal").modal("show");
};

var GetGWTTByGwrt = function (period, tin) {
    var url = `${ServerUrl}api/wht/GetGWTTByGwrtAsync?periodId=${period}&tin=${tin}`;

    ApiCaller(url, "GET", "", LoadModalGrid);
    $("#detailsModal").modal("show");
};

var getWHTDetails = function (invoiceNumber) {
    var url = `${ServerUrl}api/wht/GetGWTTByInvoiceNumber?invoiceNumber=${invoiceNumber}`;

    ApiCaller(url, "GET", "", LoadModalDetails);
    $("#whtDetailsModal").modal("show");
    $("#detailsModal").modal("hide");
};

var LoadModalDetails = function (whtDetailsFromServer) {
    var whtDetails = whtDetailsFromServer[0];

    $("#whtType").text(whtDetails.whtType);
    $("#taxpayerName").text(whtDetails.taxpayerName);
    $("#taxpayerTIN").text(whtDetails.taxpayerTIN);
    $("#taxpayerTel").text(whtDetails.taxpayerTel);
    $("#businessLocation").text(whtDetails.businessLocation);
    $("#whtAgentName").text(whtDetails.whtAgentName);
    $("#whAgentTIN").text(whtDetails.whAgentTIN);
    $("#taxOffice").text(whtDetails.taxOffice);
    $("#contractAmount").text("GHS " + parseFloat(whtDetails.contractAmount.split(".")[0]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#grossAmount").text("GHS " + parseFloat(whtDetails.grossAmount.split(".")[0]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxWithHeld").text("GHS " + parseFloat(whtDetails.taxWithHeld.split(".")[0]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#whtRate").text(whtDetails.whtRate);
    $("#vatableAmt").text("GHS " + parseFloat(whtDetails.vatableAmt.split(".")[0]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
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
