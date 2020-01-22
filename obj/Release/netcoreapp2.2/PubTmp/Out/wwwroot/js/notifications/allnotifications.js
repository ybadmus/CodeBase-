var HeaderName = "All Notifications";
var serverUrl = $("#serverUrl").val();

$(document).ready(function () {
    initializeKendoGrid();
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
            { field: "date", title: "Date", width: '90px', format: "{0:MM-dd-yyyy}" },
            { field: "sender", title: "Sender", width: '17%' },
            { field: "applicationType", title: "Application Type", width: '20%' },
            { field: "status", title: "Status", width: '20%' },
            {
                command: [{
                    name: "view",
                    template: "<button title='View item' class='btn btn-light btn-sm' style='margin-right: 2px'><span class='fa fa-file fa-lg'></span></button>"
                }],
                title: "Actions",
                width: "90px"
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
    $("#tccListOfTaxOffices").html(output);
};

var bootstrapPage = function () {
    loadOffices();
    setTitles();
};

var loadOffices = function () {
    var userid = $("#userId").val();
    var officesUrl = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    apiCaller(officesUrl, "GET", "", loadTaxOffices);
};

