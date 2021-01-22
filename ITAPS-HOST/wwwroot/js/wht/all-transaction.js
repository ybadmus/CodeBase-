'use strict';

var ServerUrl = $("#serverUrl").val();
var HeaderName = "WHT Transactions";
var currentPeriods = [];
var searchObject = {
    "taxOfficeId": "",
    "periodId": ""
};

$(document).ready(function () {
    hideShowGrid();
    setHeaderNameToHTML();
    InitializeKendoGrid([], 1);
    $("taxOfficesDiv").show();
    $("#tccTaxOffices").show();
    $("#endDate").flatpickr({
        dateFormat: "d-m-Y"
    });
    $("#startDate").flatpickr({
        dateFormat: "d-m-Y"
    });
});

var commaRemover = function (value) {
    value = value.replace(/,/g, '');
    return parseFloat(value);
}

var moneyInTxt = function (value, standard, dec = 0) {
    nf = new Intl.NumberFormat(standard, {
        minimumFractionDigits: dec,
        maximumFractionDigits: 2
    });
    return nf.format(Number(value) ? value : 0);
}

var ucwords = function (str, force = true) {
    str = force ? str.toLowerCase() : str;
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        function (firstLetter) {
            return firstLetter.toUpperCase();
        });
}

var InitializeKendoGrid = function (data, stage) {
    if (data == null || data.length == 0 && stage !== 1) {
        return toastr.info("No Data");
    };

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 15 },
        sortable: false,
        selectable: false,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "invoiceNumber", title: "Invoice #", width: "15%" },
            { field: "taxpayerName", title: "Taxpayer Name", width: "20%" },
            { field: "whTaxAgentName", title: "Agent Name", width: "20%" },
            {
                field: "contractAmount", title: "Contract Amount", width: "15%", format: "{0:GHS}", attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.contractAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
            {
                field: "taxWithHeld", title: "WHT Tax", width: "15%", attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.taxWithHeld).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
            { field: "status", title: "Status", width: "10%", attributes: { style: "text-align:center;" } },
            {
                command: [{
                    name: "view", template: "<button title='View item' class='btn btn-success btn-sm' style='margin-right: 2px'><span class='fa fa-file fa-lg'></span></button>"
                }],
                title: "Actions",
                width: "10%"
            }
        ]
    });
};

var setHeaderNameToHTML = function () {

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

$("#searchWHT").click(function () {
    let taxpayerTin = document.getElementById("taxpayerTin").value;
    let filter = document.getElementById("searchFilter").value;
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    let url = "";

    if (taxpayerTin == "" && filter == "")
        url = `${ServerUrl}api/wht/SearchWithholdingByOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate;

    if (taxpayerTin == "" && filter != "")
        url = `${ServerUrl}api/wht/SearchWithholdingByOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&szFilter=` + filter;

    if (taxpayerTin != "" && filter == "")
        url = `${ServerUrl}api/wht/SearchWithholdingByOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&tin=` + taxpayerTin;

    if (taxpayerTin != "" && filter != "")
        url = `${ServerUrl}api/wht/SearchWithholdingByOffice?taxOfficeId=` + searchObject.taxOfficeId
            + `&periodId=` + searchObject.periodId + `&startDate=` + startDate + `&endDate=` + endDate + `&tin=` + taxpayerTin + `&szFilter=` + filter;

    $("#Grid").data("kendoGrid").dataSource.data([]);
    ApiCaller(url, "GET", "", InitializeKendoGrid);
});

$("#listOfTaxOffices").on('change', function () {
    var e = document.getElementById("listOfTaxOffices");
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

var GetActivePeriods = function (year) {
    var url = `${ServerUrl}api/MonoApi/GetAllActivePeriods?year=${year}`;
    ApiCaller(url, "GET", "", LoadActivePeriods);
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

    hideShowDetails();
};

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    getWHTDetails(item.id);
});

var hideShowDetails = function () {
    $("#transactionDetails").show();
    $("#gridHeader").hide();
}

var hideShowGrid = function () {
    $("#transactionDetails").hide();
    $("#gridHeader").show();
}

$("#backToGrid").click(function () {
    $("#transactionDetails").hide();
    $("#gridHeader").show();
});
