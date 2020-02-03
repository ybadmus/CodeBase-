var HeaderName = "";
var pitType = "";
var serverUrl = $("#serverUrl").val();

$(document).ready(function () {
    bootstrapPage();

});

var initializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        dataBound: onDataBound,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "submissionDate", title: "Date", width: '120px' },
            { field: "tin", title: "TIN", width: '20%' },
            { field: "entityName", title: "Entity Name", width: '55%' },
            {
                command: [{
                    name: "view",
                    template: "<button title='View' class='btn btn-success'><i class='fa fa-file-text'></i></button>"
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

    $("#endDate").flatpickr({
        minDate: 'today'
    });

    $("#startDate").flatpickr({
        minDate: 'today'
    });

    setTitles();
    loadOffices();
    initializeKendoGrid();
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
            pitType = "Estimate";
            break;

        case "revisedestimate":

            HeaderName = "Revised Estimates";
            pitType = "RevisedEstimate";
            break;

        case "annualreturn":
            
            HeaderName = "Annual Returns";
            pitType = "Return";
            break;

        case "revisedreturn":

            HeaderName = "Revised Returns";
            pitType = "RevisedReturn";
            break;
    }
}