ej.grids.Grid.Inject(ej.grids.Page, ej.grids.Sort, ej.grids.Filter, ej.grids.Group, ej.grids.Freeze);

var HeaderName = "Monthly PAYE";
var serverUrl = $("#serverUrl").val();
var searchPayeByTaxOffice = `${serverUrl}api/PayeApi/GetAllCompanyPaye`; //search
var payeDetailsUrl = `${serverUrl}api/PayeApi/GetPayeDetails`; //payeid
var employeeDetails = `${serverUrl}api/PayeApi/GetEmployeeDetails`; //employee details
var activeTaxOffice = "";
var activeTaxOfficeName = "";
var gridGlobal = "";
var activePeriod = "";
var activeEmployeeList = [];
var activeCompany = "";
var activeYear = "";

$(document).ready(function () {
    bootstrapPage();
});

$("#yearsDropdown").on('change', function () {
    var elem = document.getElementById("yearsDropdown");
    activeYear = elem.options[elem.selectedIndex].value;
    if (activeYear == 0) {

        $("#listOfPeriods").prop("disabled", true);
    }
    else {

        $("#listOfPeriods").prop("disabled", false);
        getActivePeriods(activeYear);
    }
});

$("#tccListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("tccListOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
    activeTaxOfficeName = elem.options[elem.selectedIndex].text;
});

$("#listOfPeriods").on('change', function () {
    var elem = document.getElementById("listOfPeriods");
    activePeriod = elem.options[elem.selectedIndex].value;
});

var initializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        dataBound: onDataBound,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "updatedAt", title: "Date", width: '110px', template: '#= kendo.toString(kendo.parseDate(updatedAt), "dd/MM/yyyy")#' },
            { field: "companyName", title: "Name", width: '25%' },
            { field: "companyTIN", title: "TIN", width: '110px' },
            {
                field: "totalNoOfStaff", title: "Total Staffs", width: '15%', attributes: { style: "text-align:right;" }
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
                    template: "<button title='View item' class='btn btn-success btn-sm' style='margin-right: 2px'><span class='fa fa-file fa-lg'></span></button>"
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
    initializeKendoGrid();
    setTitles();
    loadOffices();
    hideAndShow();
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

    output += '<option value="0" selected>Choose Office</option>';
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

var getActivePeriods = function (year) {
    var url = `${serverUrl}api/monoapi/GetAllActivePeriods?year=${year}`;

    apiCaller(url, "GET", "", loadActivePeriods);
};

var loadActivePeriods = function (listOfPeriods) {
    var output = "";

    if (listOfPeriods.length > 0) {
        output += '<option value="0" selected>Choose Period</option>';
        for (var i = 0; i < listOfPeriods.length; i++) {
            output = output + '<option value="' + listOfPeriods[i].id + '" >' + listOfPeriods[i].period + '</option>';
        }
    } else {
        toastr.warning("No periods for this year!");
        $("#listOfPeriods").html('<option value="0" selected>Choose Period</option>');
        $("#listOfPeriods").prop("disabled", true);
    }

    output = output;
    $("#listOfPeriods").html(output);
};

var validateSearchEntry = function () {
    let searchItem = $("#searchItem").val().trim();
    if (!searchItem.match(/\S/) || activeTaxOffice === "")
        return false;
    else
        return true;
};

var searchPaye = function () {
    if (validateSearchEntry()) {
        let searchItem = $("#searchItem").val().trim();
        if (searchItem.includes('/')) {
            for (var i = 0; i < searchItem.length; i++) {
                if (searchItem[i] === '/')
                    replaceAt(searchItem, i, '%2F');
            }
        }
        $("#Grid").data("kendoGrid").dataSource.data([]);
        let url = `${searchPayeByTaxOffice}?officeId=` + activeTaxOffice + `&periodId=` + activePeriod + `&queryString=` + searchItem;
        apiCaller(url, "GET", "", initializeKendoGrid);
    } else {

        toastr.error("Tax office, Period or Search term field is empty");
    }
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

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {

    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));
    var detailsUrl = `${payeDetailsUrl}?payeId=` + item.id;
    $("#applicationId").val(item.id);
    activeCompany = item.companyName;

    apiCaller(detailsUrl, "GET", "", loadDetailsView);
});

$("#moreDetailsView").click(function () {
    loadEmployeeTable(activeEmployeeList);
    $("#payeDetailsView").hide();
    $("#employeeListView").show();
});

$("#backToDetailsView").click(function () {
    $("#payeDetailsView").show();
    $("#employeeListView").hide();
});

var convertDateToFormat = function (input) {
    input = input.toString().split("T")[0];
    var datePart = input.match(/\d+/g),
        year = datePart[0],
        month = datePart[1], day = datePart[2];

    return day + '/' + month + '/' + year;
};

var loadDetailsView = function (resp) {

    if (resp && resp.length > 0) {
        var totalCashEmolument = resp[0].managementPay + resp[0].otherPay;
        var totalTaxDeduction = resp[0].managementTax + resp[0].otherTax;
        activeEmployeeList = resp[0].payeChild;

        $("#payeGridView").hide();
        $("#employeeDetails").hide();
        $("#monDetails").show();
        $("#payeDetailsView").show();
        $("#employeeListView").hide();

        if (!resp[0].companyName) {
            $("#taxpayerName").text(activeCompany);
        } else {
            $("#taxpayerName").text(resp[0].companyName);
        };

        $("#dateSubmitted").text(convertDateToFormat(resp[0].createdAt));

        if (!resp[0].taxOfficeName) {
            $("#taxOfficeName").text(activeTaxOfficeName);
        } else {
            $("#taxOfficeName").text(resp[0].taxOfficeName);
        };

        $("#companyTIN").text(resp[0].companyTIN);
        $("#companyAddress").text(resp[0].companyAddress);
        $("#companyPhone").text(resp[0].companyPhone);
        $("#companyEmail").text(resp[0].companyEmail);

        //$("#companyName").text(resp[0].taxpayerName);
        $("#taxpayerTIN").text(resp[0].taxpayerTIN);
        $("#taxpayerPhone").text(resp[0].taxpayerPhone);
        $("#taxpayerEmail").text(resp[0].taxpayerEmail);

        $("#periodYear").text(resp[0].periodYear);
        $("#periodMonth").text(resp[0].periodMonth);

        $("#managementNo").text(resp[0].managementNo);
        $("#otherNo").text(resp[0].otherNo);
        $("#totalNoOfStaff").text(resp[0].managementNo + resp[0].otherNo);

        $("#managementPay").text(parseFloat(resp[0].managementPay).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#otherPay").text(parseFloat(resp[0].otherPay).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#totalCashEmolument").text(parseFloat(totalCashEmolument).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

        $("#managementTax").text(parseFloat(resp[0].managementTax).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#otherTax").text(parseFloat(resp[0].otherTax).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#totalTaxDeduction").text(parseFloat(totalTaxDeduction).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

        $("#startingStaff").text(resp[0].startingStaff);
        $("#engagedStaff").text(resp[0].engagedStaff);
        $("#disengagedStaff").text(resp[0].disengagedStaff);
    } else {

        $('html').hideLoading();
        toastr.info("An error occured when loading the details");
    }
    
};

var loadEmployeeTable = function (data) {

    document.getElementById("employeesGrid").innerHTML = "";

    var grid = new ej.grids.Grid({
        dataSource: data,
        enableHover: true,
        frozenColumns: 2,
        columns: [
            { field: 'empName', headerText: 'Employee Name', width: 250 },
            { field: 'empTin', headerText: 'TIN', width: 150 },
            { field: 'empPosition', headerText: 'Position', width: 180 },
            { field: 'empSerialNumber', headerText: 'Serial No', width: 150 },
            { field: 'empResidential', headerText: 'Non-Resident', width: 150 },
            { field: 'basicSalary', headerText: 'Basic Salary', textAlign: 'Right', width: 150 },
            { field: 'cashAllowances', headerText: 'Cash Allowance', textAlign: 'Right', width: 180 },
            { field: 'bonusIncome', headerText: 'Bonus Income', textAlign: 'Right', width: 150 },
            { field: 'overtimeIncome', headerText: 'Overtime Income', textAlign: 'Right', width: 150 },
            { field: 'nonCashBenefit', headerText: 'Non-Cash Benefit', textAlign: 'Right', width: 150 },
            { field: 'overtimeIncome', headerText: 'Tier 3', textAlign: 'Right', width: 150 },
            { field: 'severancePayPaid', headerText: 'Severance Pay Paid', textAlign: 'Right', width: 150 },
            { field: 'empPhone', headerText: 'Phone', width: 150 },
            { field: 'empEmail', headerText: 'Email', width: 200 }
        ],
        height: 350,
        pageSettings: { pageSize: 10 },
        allowGrouping: false,
        allowPaging: true,
        allowSorting: false,
        allowFiltering: true,
        filterSettings: { type: 'Menu' },
        rowSelected: rowSelected,
    });

    grid.appendTo('#employeesGrid');
    gridGlobal = grid;
};

function rowSelected(args) {
    var selectedrecords = gridGlobal.getSelectedRecords();
    onGridSelected(selectedrecords[0]);
};

var onGridSelected = function (item) {
    loadEmployeeView(item.id);
};

var getDetailsEmployee = function (employeeId) {
    $("#payeGridView").hide();
    $("#employeeDetails").show();
    $("#monDetails").hide();
};

$("#backToGridEmployee").click(function () {
    $("#payeGridView").hide();
    $("#employeeDetails").hide();
    $("#monDetails").show();
});

$("#employeeGrid").on("click", '.btnRow', function (e) {
    $("#payeGridView").hide();
    $("#employeeDetails").show();
    $("#monDetails").hide();

    loadEmployeeView(e.currentTarget.id);
});

var loadEmployeeView = function (employeeId) {
    var appId = $("#applicationId").val();
    var employeeDetailsUrl = `${employeeDetails}?empId=` + employeeId + "&payeId=" + appId;

    apiCaller(employeeDetailsUrl, "GET", "", employeeView);
};

var employeeView = function (resp) {
    $("#empTin").text(resp[0].empTin);
    $("#empName").text(resp[0].empName);
    $("#empPhone").text(resp[0].empPhone);
    $("#empEmail").text(resp[0].empEmail);
    $("#empPosition").text(resp[0].empPosition);
    $("#empSerialNumber").text(resp[0].empSerialNumber);
    $("#empResidential").text(resp[0].empResidential);
    $("#basicSalary").text(parseFloat(resp[0].basicSalary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#cashAllowances").text(parseFloat(resp[0].cashAllowances).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bonusIncome").text(parseFloat(resp[0].bonusIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#overtimeIncome").text(parseFloat(resp[0].overtimeIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#secondaryEmployement").text(parseFloat(resp[0].secondaryEmployement).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#nonCashBenefit").text(parseFloat(resp[0].nonCashBenefit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#providentRate").text(resp[0].providentRate);
    $("#severancePayPaid").text(parseFloat(resp[0].severancePayPaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#employeeDetails").show();
    $("#monDetails").hide();
};

