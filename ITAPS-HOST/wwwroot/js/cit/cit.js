var serverUrl = $("#serverUrl").val();
var searchPITByTaxOffice = `${serverUrl}api/Transaction/SearchTransactionAsync`;
var citDetailsUrl = `${serverUrl}api/Transaction/CITDetailsById?trId=`;
var citEstimatesDetailsUrl = `${serverUrl}api/Transaction/CITEstimatesDetailsById?trId=`;
var citRevEstimatesDetailsUrl = `${serverUrl}api/Transaction/CITRevEstimatesDetailsById?trId=`;
var activeTaxOffice = "";
var activeYear = "";

var objToSend = {
    "assessmentYear": "",
    "transactionType": "",
    "taxType": "CIT",
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
    $("#revisedEstimateDetail").hide();

    $("#endDate").flatpickr({
        dateFormat: "d-m-Y",
    });
    $("#startDate").flatpickr({
        dateFormat: "d-m-Y",
    });

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

var bootstrapNotification = function () {
    $("#pgHeader").text(HeaderName);
    $("#gridView").hide();
    $("#returnDetail").show();
};

$("#btnSearch").click(function () {
    searchPIT();
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {

    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    sessionStorage.setItem("uniCITTransactionLabel", "uniTransactionId");
    sessionStorage.setItem("uniCITTransactionId", item.id);


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



