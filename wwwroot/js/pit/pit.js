var HeaderName = "";
var serverUrl = $("#serverUrl").val();
var searchPITByTaxOffice = `${serverUrl}api/Transaction/SearchTransactionAsync`;
var pitDetailsUrl = `${serverUrl}api/Transaction/TransactionDetails`;
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
    bootstrapPage();
});

var initializeKendoGrid = function (data, stage) {
    if (data == null || data.length == 0 && stage !== 1) {
        return toastr.info("No Data");
    };

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: false,
        selectable: false,
        dataBound: onDataBound,
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

var onDataBound = function () {

};

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
    $("#listOfTaxOffices").html(output);
};

var bootstrapPage = function () {

    let setupName = getParameterByName("type");
    configureUrls(setupName);

    $("#gridView").show();
    $("#estimatesDetailsView").hide();
    $("#returnsDetailsView").hide();

    $("#moreDetailsPrev").hide();

    $("#estimateDetailsGrid3").hide();
    $("#estimateDetailsGrid4").hide();
    $("#estimateDetailsGrid5").hide();

    $("#endDate").flatpickr({
    });

    $("#startDate").flatpickr({
    });

    setTitles();
    loadOffices();
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

var loadOffices = function () {
    var userid = $("#userId").val();
    var officesUrl = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    apiCaller(officesUrl, "GET", "", loadTaxOffices);
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

var configureUrls = function (setuptype) {
    switch (setuptype) {

        case "annualestimate":

            HeaderName = "Annual Estimates";
            objToSend.transactionType = "Estimate";
            break;

        case "annualreturn":

            HeaderName = "Annual Returns";
            objToSend.transactionType = "Return";
            break;

    }
};

