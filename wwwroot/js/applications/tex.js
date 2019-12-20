var HeaderName = "Tax Exemption";
var serverUrl = $("#serverUrl").val();

$("#tccListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("tccListOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
})

var initializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
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
                    template: "<button title='View item' class='btn btn-success btn-sm' style=''><span class='fa fa-file fa-lg'></span></button>"
                }],
                title: "Actions",
                width: "70px"
            }
        ]
    });
};

$(document).ready(function () {
    initializeKendoGrid();
    bootstrapPage();
    setTitles();

    $("#texGridView").show();
    $("#texDetailsView").hide();
});

var setTitles = function () {
    $("#pgHeader").text(HeaderName);
};

var bootstrapPage = function () {
    var userid = $("#userId").val();
    var tccUrl = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    apiCaller(tccUrl, "GET", "", loadTaxOffices);
};