var HeaderName = "Monthly PAYE";
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
            { field: "dateSubmitted", title: "Date", width: '90px', format: "{0:MM-dd-yyyy}" },
            { field: "companyName", title: "Company", width: '17%' },
            { field: "totalNoOfStaff", title: "Total Staffs", width: '20%' },
            { field: "totalCashEmolument", title: "Total Cash Emolument", width: '20%' },
            { field: "taxDeducted", title: "Tax Deducted", width: '20%' },
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

var bootstrapPage = function () {
    setTitles();
    loadOffices();
    getActivePeriods();
    hideAndShow();
    initilizeEmployeeTable();
};

var hideAndShow = function () {
    $("#payeGridView").show();
    $("#monDetails").hide();
    $("#employeeDetails").hide();
};

var setTitles = function () {
    $("#pgHeader").text(HeaderName);
};

var loadTaxOffices = function (listOfTaxOffices) {
    var output = "";

    listOfTaxOffices.sort((a, b) => (a.taxOfficeName > b.taxOfficeName) - (a.taxOfficeName < b.taxOfficeName));

    output += '<option selected>Choose Office</option>';
    for (var i = 0; i < listOfTaxOffices.length; i++) {
        output = output + '<option value="' + listOfTaxOffices[i].taxOfficeId + '" >' + listOfTaxOffices[i].taxOfficeName + '</option>';
    }

    output = output;
    $("#tccListOfTaxOffices").html(output);
};

var loadOffices = function () {
    var userid = $("#userId").val();
    var officesUrl = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    apiCaller(officesUrl, "GET", "", loadTaxOffices);
};

var getActivePeriods = function () {
    var url = `${serverUrl}api/monoapi/GetAllActivePeriods`;
    apiCaller(url, "GET", "", loadActivePeriods);
};

var loadActivePeriods = function (listOfPeriods) {
    var output = "";

    if (listOfPeriods.length > 0) {
        output += '<option value="0" selected>Choose Period</option>';
        for (var i = 0; i < listOfPeriods.length; i++) {
            output = output + '<option value="' + listOfPeriods[i].id + '" >' + listOfPeriods[i].period + '</option>';
        }
    };

    output = output;
    $("#listOfPeriods").html(output);
};

var searchPaye = function () {
    $("#payeGridView").hide();
    $("#employeeDetails").hide();
    $("#monDetails").show();
};

$("#btnSearch").click(function (e) {
    searchPaye();
});

$("#searchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchPaye();
    }
});

$("#backToGrid").click(function () {
    hideAndShow();
});

var initilizeEmployeeTable = function () {

    var obj = [{
        "empName": "Francis Oduro",
        "empTin": "P54853698774",
        "empPosition": "Senior",
        "basicSalary": "45000",
    }, {
        "empName": "Ama Ghana",
        "empTin": "P89457621397",
        "empPosition": "Senior",
        "basicSalary": "45000",
    }, {
        "empName": "Kwame Mensah",
        "empTin": "P78901452361",
        "empPosition": "Junior",
        "basicSalary": "152000",
    }, {
        "empName": "Adjoa Foowa",
        "empTin": "C78901245367",
        "empPosition": "Junior",
        "basicSalary": "1200",
    },
    {
        "empName": "Ama Mensima",
        "empTin": "P7891246304",
        "empPosition": "Junior",
        "basicSalary": "124000",
    }];

    loadEmployeeTable(obj);
};

var loadEmployeeTable = function (listOfItems) {
    var output = ""
    var sortedArray = listOfItems;

    for (var i = 0; i <= sortedArray.length - 1; i++) {
        output = output + '<tr><td style="color: black" contenteditable="true" id="empName' + i
            + '" class="valueCell"> ' + sortedArray[i].empName + ' </td><td style="color: black" contenteditable="true" id="empName' + i
            + '" class="valueCell"> ' + sortedArray[i].empTin + ' </td><td style="color: black" contenteditable="true" id="empPosition' + i
            + '" class="valueCell"> ' + sortedArray[i].empPosition + ' </td><td align="right" style="color: black" contenteditable="true"  id="basicSalary' + i
            + '" class="valueCell"> ' + parseInt(sortedArray[i].basicSalary ? sortedArray[i].basicSalary : 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
            + '</td><td style="color: black" id="btnEmp' + i + '" class=""><button title="View item" onclick="getDetailsEmployee('+ i +')" class="btn btn-success btn-sm" style=""><span class="fa fa-file fa - lg"></span></button></td></tr>';
    }

    output = output;
    $("#employeeGrid").html(output);
};

var getDetailsEmployee = function (employeeId) {
    console.log(employeeId);

    $("#payeGridView").hide();
    $("#employeeDetails").show();
    $("#monDetails").hide();
};

$("#backToGridEmployee").click(function () {
    $("#payeGridView").hide();
    $("#employeeDetails").hide();
    $("#monDetails").show();
});