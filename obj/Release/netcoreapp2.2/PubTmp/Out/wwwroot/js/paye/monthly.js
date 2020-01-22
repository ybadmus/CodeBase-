var HeaderName = "Monthly PAYE";
var serverUrl = $("#serverUrl").val();

$(document).ready(function () {
    initializeKendoGrid();
    setTitles();
});

var initializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        dataBound: onDataBound,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "statusDate", title: "Date", width: '90px', format: "{0:MM-dd-yyyy}" },
            { field: "applicantName", title: "Applicant", width: '17%' },
            { field: "requestingEntity", title: "Requesting Entity", width: '20%' },
            { field: "purpose", title: "Purpose", width: '20%' },
            { field: "status", title: "Status", width: '15%' },
            {
                command: [{
                    name: "view",
                    template: "<button title='View item' class='btn btn-light btn-sm' style='margin-right: 2px'><span class='fa fa-file fa-lg'></span></button>"
                }, {
                    name: "certificate",
                    template: "<button id='certBtn' title='View certificate' class='btn btn-light btn-sm'><span class='fa fa-certificate fa-lg'></span></button>",
                    visible: false
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
};

var loadOffices = function () {
    var userid = $("#userId").val(); 
    var officesUrl = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    apiCaller(officesUrl, "GET", "", loadTaxOffices);
};

