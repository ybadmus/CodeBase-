var HeaderName = "Annual PAYE";
var serverUrl = $("#serverUrl").val();

$(document).ready(function () {
    initializeKendoGrid();
    setTitles();
    loadOffices();
});

var initializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        dataBound: onDataBound,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "updatedAt", title: "Date", width: '90px', format: "{0:MM-dd-yyyy}" },
            { field: "companyName", title: "Company Name", width: '17%' },
            { field: "companyTIN", title: "TIN", width: '20%' },
            {
                field: "totalNoOfStaff", title: "Total Staffs", width: '15%', attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.totalNoOfStaff).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
            {
                field: "totalCashEmolument", title: "Total Cash Emolument", width: '15%', attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.totalCashEmolument).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
            {
                field: "taxDeducted", title: "Tax Deducted", width: '15%', attributes: { style: "text-align:right;" }, template: function (data) {
                    return parseFloat(data.taxDeducted).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
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
    $("#listOfTaxOffices").html(output);
};

var bootstrapPage = function () {
    loadOffices();
};

var loadOffices = function () {
    var userid = $("#userId").val();
    var officesUrl = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    apiCaller(officesUrl, "GET", "", loadTaxOffices);
};

