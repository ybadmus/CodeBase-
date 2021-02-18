ej.grids.Grid.Inject(ej.grids.Page, ej.grids.Sort, ej.grids.Filter, ej.grids.Group, ej.grids.Freeze);

var HeaderName = "Monthly PAYE";
var serverUrl = $("#serverUrl").val();
var searchPayeByTaxOffice = `${serverUrl}api/PayeApi/GetAllCompanyPaye`;
var payeDetailsUrl = `${serverUrl}api/PayeApi/GetPayeDetails`;
var employeeDetails = `${serverUrl}api/PayeApi/GetEmployeeDetails`;
var activeTaxOffice = "";
var activeTaxOfficeName = "";
var gridGlobal = "";
var gridGlobal2 = "";
var activePeriod = "";
//var activeEmployeeList = [];
var activeCompany = "";
var activeYear = "";
var currentPageNumber = 0;
var totalPageNumber = 0;
var pageSizeEmployees = 500;

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

//var initializeKendoGrid = function (data, stage) {

//    if (data) {
//        if (data.length == 0 && stage !== 1) {
//            return toastr.info("No Data");
//        };

//        $("#Grid").kendoGrid({
//            dataSource: { data: data, pageSize: 8 },
//            sortable: true,
//            selectable: true,
//            dataBound: onDataBound,
//            pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
//            columns: [
//                { field: "submittedDate", title: "Date Submitted", width: '15%', template: '#= kendo.toString(kendo.parseDate(submittedDate), "dd/MM/yyyy")#' },
//                { field: "employerName", title: "Employer Name", width: '30%' },
//                { field: "employerTin", title: "Employer TIN", width: '15%' },
//                {
//                    field: "totalTaxCharged", title: "Total Tax Charged", width: '20%', attributes: { style: "text-align:right;" }, template: function (data) {
//                        return parseFloat(data.totalTaxCharged).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
//                    }
//                },
//                {
//                    field: "totalAmountPaid", title: "Tax Amount Paid", width: '20%', attributes: { style: "text-align:right;" }, template: function (data) {
//                        return parseFloat(data.totalAmountPaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
//                    }
//                },
//                {
//                    command: [{
//                        name: "view",
//                        template: "<button title='View item' class='btn btn-success btn-sm' style='margin-right: 2px'><span class='fa fa-file fa-lg'></span></button>"
//                    }],
//                    title: "Actions",
//                    width: "90px"
//                }
//            ]
//        });
//    } else {

//        toastr.info("No Data");
//    }
//};

var initializeKendoGrid = function (data, stage) {
    document.getElementById("Grid").innerHTML = "";
    if (data == null)
        data = [];

    if (data) {
        if (data.length == 0 && stage !== 1) {
            toastr.info("No Data");
            data = [];
        };

        for (var i = 0; i < data.length; i++) {
            data[i].submittedDate = convertDateToFormatDetails(data[i].submittedDate);
            data[i].totalTaxCharged = parseFloat(data[i].totalTaxCharged).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            data[i].totalAmountPaid = parseFloat(data[i].totalAmountPaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }

        var grid = new ej.grids.Grid({
            dataSource: data,
            selectionSettings: { type: 'Multiple' },
            columns: [
                { field: "submittedDate", headerText: "Date Submitted", width: 80 },
                { field: "employerName", headerText: "Employer Name", width: 120 },
                { field: "employerTin", headerText: "Employer TIN", width: 80 },
                { field: 'totalTaxCharged', headerText: 'Total Tax Charged', width: 100 },
                { field: 'totalAmountPaid', headerText: 'Tax Amount Paid', width: 100 },
            ],
            height: 350,
            pageSettings: { pageSize: 10 },
            allowGrouping: true,
            allowPaging: true,
            allowSorting: false,
            allowFiltering: true,
            filterSettings: { type: 'Menu' },
            rowSelected: rowSelected2,
        });

        grid.appendTo('#Grid');
        gridGlobal2 = grid;
    } else {

        toastr.info("No Data");
    };
};

var convertDateToFormatDetails = function(input) {
    if (input == null || input == undefined)
        return

    var time = input.toString().split("T")[1];
    input = input.toString().split("T")[0];
    var datePart = input.match(/\d+/g),
        year = datePart[0],
        month = datePart[1], day = datePart[2];

    return day + '/' + month + '/' + year + " ";
};

var bootstrapPage = function () {
    initializeKendoGrid([], 1);
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

        //$("#Grid").data("kendoGrid").dataSource.data([]);

        let url = `${searchPayeByTaxOffice}?officeId=` + activeTaxOffice + `&periodId=` + activePeriod + `&searchItem=` + searchItem;
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

//$("body").on('click', '#Grid .k-grid-content .btn', function (e) {

//    var grid = $("#Grid").getKendoGrid();
//    var item = grid.dataItem($(e.target).closest("tr"));
//    var detailsUrl = `${payeDetailsUrl}?payeId=` + item.id;
//    $("#applicationId").val(item.id);

//    apiCaller(detailsUrl, "GET", "", loadDetailsView);
//});

function rowSelected2(args) {
    var selectedrecords = gridGlobal2.getSelectedRecords();
    onGridSelected2(selectedrecords[0]);
};

var onGridSelected2 = function (item) {
    var detailsUrl = `${payeDetailsUrl}?payeId=` + item.id;
    $("#applicationId").val(item.id);

    apiCaller(detailsUrl, "GET", "", loadDetailsView);
};

$("#moreDetailsView").click(function () {
    var url = `${employeeDetails}?payeId=` + $("#applicationId").val(); //pagination here 
    apiCaller(url, "GET", "", loadEmployeeTable)
});

$("#firstPageOftheDocument").click(function () {
    var url = `${employeeDetails}?payeId=` + $("#applicationId").val() + `&PageNumber=${1}&PageSize=${pageSizeEmployees}`;
    apiCaller(url, "GET", "", loadEmployeeTable)
});

$("#previousPageOfDocument").click(function () {
    var url = `${employeeDetails}?payeId=` + $("#applicationId").val() + `&PageNumber=${currentPageNumber > 1 ? currentPageNumber - 1 : 1}&PageSize=${pageSizeEmployees}`;
    apiCaller(url, "GET", "", loadEmployeeTable)
});

$("#nextPageOfDocument").click(function () {
    var url = `${employeeDetails}?payeId=` + $("#applicationId").val() + `&PageNumber=${currentPageNumber >= totalPageNumber ? totalPageNumber : currentPageNumber + 1}&PageSize=${pageSizeEmployees}`; //pagination here 
    apiCaller(url, "GET", "", loadEmployeeTable)
});

$("#lastPageOftheDocument").click(function () {
    var url = `${employeeDetails}?payeId=` + $("#applicationId").val() + `&PageNumber=${totalPageNumber}&PageSize=${pageSizeEmployees}`;
    apiCaller(url, "GET", "", loadEmployeeTable)
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

        $("#payeGridView").hide();
        $("#employeeDetails").hide();
        $("#monDetails").show();
        $("#payeDetailsView").show();
        $("#employeeListView").hide();
        $("#companyName").text(resp[0].employerName);
        $("#dateSubmitted").text(resp[0].submittedDate);
        $("#companyTIN").text(resp[0].employerTin);
        $("#companyTIN2").text(resp[0].employerTin);
        $("#taxOfficeName").text(resp[0].employerTaxOffice);
        $("#companyPhone").text(resp[0].employerPhone);
        $("#companyEmail").text(resp[0].employerEmail);
        $("#periodYear").text(resp[0].assessmentYear);
        $("#periodMonth").text(resp[0].month);
        $("#managementNo").text(resp[0].totalManagementStaff);
        $("#otherNo").text(resp[0].totalOtherStaff);
        $("#totalNoOfStaff").text(resp[0].totalNoStaff);
        $("#managementPay").text(parseFloat(resp[0].totalManagementPay).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#otherPay").text(parseFloat(resp[0].totalOtherPay).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#totalCashEmolument").text(parseFloat(resp[0].totalCashEmolument).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#managementTax").text(parseFloat(resp[0].totalManagementTaxDeducted).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#otherTax").text(parseFloat(resp[0].totalOtherStaffTaxDeducted).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#totalTaxDeduction").text(parseFloat(resp[0].totalTaxCharged).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#totalTaxCharged2").text(parseFloat(resp[0].totalTaxCharged).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#totaltTaxPaid2").text(parseFloat(resp[0].totalAmountPaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        $("#startingStaff").text(resp[0].totalStaffStartOfMonth);
        $("#engagedStaff").text(resp[0].engagedStaff);
        $("#disengagedStaff").text(resp[0].disengagedStaff);

    } else {

        $('html').hideLoading();
        toastr.info("An error occured when loading the details");
    }

};

//var loadEmployeeTable = function (data) {

//    for (var i = 0; i < data.length; i++) {

//        data[i].isSecondaryEmployement ? data[i].isSecondaryEmployement = "YES" : data[i].isSecondaryEmployement = "NO";
//        data[i].isResident ? data[i].isResident = "RESIDENT" : data[i].isResident = "NON RESIDENT";
//        data[i].basicSalary = parseFloat(data[i].basicSalary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].cashAllowances = parseFloat(data[i].cashAllowances).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].bonusIncome = parseFloat(data[i].bonusIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].overtimeIncome = parseFloat(data[i].overtimeIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].nonCashBenefit = parseFloat(data[i].nonCashBenefit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].thirdTierPension = parseFloat(data[i].thirdTierPension).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].severancePayPaid = parseFloat(data[i].severancePayPaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].socialSecurity = parseFloat(data[i].socialSecurity).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].finalTaxOnBonus = parseFloat(data[i].finalTaxOnBonus).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].excessBonus = parseFloat(data[i].excessBonus).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].totalCashEmolument = parseFloat(data[i].totalCashEmolument).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].accommodationElement = parseFloat(data[i].accommodationElement).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].vehicleElement = parseFloat(data[i].vehicleElement).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].totalAssessableIncome = parseFloat(data[i].totalAssessableIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].deductibleReliefs = parseFloat(data[i].deductibleReliefs).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].totalReliefs = parseFloat(data[i].totalReliefs).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].chargeableIncome = parseFloat(data[i].chargeableIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].taxDeductible = parseFloat(data[i].taxDeductible).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].overtimeTax = parseFloat(data[i].overtimeTax).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//        data[i].totalTaxPayableToGra = parseFloat(data[i].totalTaxPayableToGra).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
//    }

//    document.getElementById("employeesGrid").innerHTML = "";

//    var grid = new ej.grids.Grid({
//        dataSource: data,
//        enableHover: true,
//        frozenColumns: 2,
//        columns: [
//            { field: 'empName', headerText: 'Employee Name', width: 230 },
//            { field: 'empTin', headerText: 'TIN', width: 150 },
//            { field: 'empPosition', headerText: 'Position', width: 150 },
//            { field: 'isResident', headerText: 'Resident', textAlign: 'Center', width: 150 },
//            { field: 'isSecondaryEmployement', headerText: 'Secondary Employment', textAlign: 'Center', width: 190 },
//            { field: 'basicSalary', headerText: 'Basic Salary', textAlign: 'Right', width: 170 },
//            { field: 'cashAllowances', headerText: 'Cash Allowance', textAlign: 'Right', width: 170 },
//            { field: 'bonusIncome', headerText: 'Bonus Income', textAlign: 'Right', width: 170 },
//            { field: 'overtimeIncome', headerText: 'Overtime Income', textAlign: 'Right', width: 170 },
//            { field: 'nonCashBenefit', headerText: 'Non-Cash Benefit', textAlign: 'Right', width: 170 },
//            { field: 'thirdTierPension', headerText: 'Tier 3', textAlign: 'Right', width: 170 },
//            { field: 'severancePayPaid', headerText: 'Severance Pay Paid', textAlign: 'Right', width: 170 },
//            { field: 'socialSecurity', headerText: 'Social Security', textAlign: 'Right', width: 170 },
//            { field: 'finalTaxOnBonus', headerText: 'Final Tax On Bonus', textAlign: 'Right', width: 170 },
//            { field: 'excessBonus', headerText: 'Excess Bonus', textAlign: 'Right', width: 170 },
//            { field: 'totalCashEmolument', headerText: 'Total Cash Emolument', textAlign: 'Right', width: 190 },
//            { field: 'accommodationElement', headerText: 'Accomodation Element', textAlign: 'Right', width: 190 },
//            { field: 'vehicleElement', headerText: 'Vehicle Element', textAlign: 'Right', width: 170 },
//            { field: 'totalAssessableIncome', headerText: 'Total Assessable Income', textAlign: 'Right', width: 200 },
//            { field: 'deductibleReliefs', headerText: 'Deductible Reliefs', textAlign: 'Right', width: 170 },
//            { field: 'totalReliefs', headerText: 'Total Relief', textAlign: 'Right', width: 170 },
//            { field: 'chargeableIncome', headerText: 'Chargeable Income', textAlign: 'Right', width: 170 },
//            { field: 'taxDeductible', headerText: 'Tax Deductible', textAlign: 'Right', width: 170 },
//            { field: 'overtimeTax', headerText: 'Overtime Tax', textAlign: 'Right', width: 170 },
//            { field: 'totalTaxPayableToGra', headerText: 'Total Tax Payable to GRA', textAlign: 'Right', width: 200 },
//        ],
//        height: 450,
//        pageSettings: { pageSize: 100 },
//        allowGrouping: false,
//        allowPaging: false,
//        allowSorting: false,
//        allowFiltering: false,
//        filterSettings: { type: 'Menu' },
//    });

//    grid.appendTo('#employeesGrid');
//    gridGlobal = grid;

//    $("#payeDetailsView").hide();
//    $("#employeeListView").show();
//};

var loadEmployeeTable = function (data) {

    $("#pageNumberPagination").text(data.paging.pageNumber);
    $("#totalPagesPagination").text(data.paging.totalPages);
    $("#totalItemsPagination").text(data.paging.totalItems);

    currentPageNumber = data.paging.pageNumber;
    totalPageNumber = data.paging.totalPages

    var data = data.items;

    for (var i = 0; i < data.length; i++) {

        data[i].isSecondaryEmployement ? data[i].isSecondaryEmployement = "YES" : data[i].isSecondaryEmployement = "NO";
        data[i].isResident ? data[i].isResident = "RESIDENT" : data[i].isResident = "NON RESIDENT";
        data[i].basicSalary = parseFloat(data[i].basicSalary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].cashAllowances = parseFloat(data[i].cashAllowances).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].bonusIncome = parseFloat(data[i].bonusIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].overtimeIncome = parseFloat(data[i].overtimeIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].nonCashBenefit = parseFloat(data[i].nonCashBenefit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].thirdTierPension = parseFloat(data[i].thirdTierPension).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].severancePayPaid = parseFloat(data[i].severancePayPaid).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].socialSecurity = parseFloat(data[i].socialSecurity).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].finalTaxOnBonus = parseFloat(data[i].finalTaxOnBonus).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].excessBonus = parseFloat(data[i].excessBonus).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].totalCashEmolument = parseFloat(data[i].totalCashEmolument).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].accommodationElement = parseFloat(data[i].accommodationElement).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].vehicleElement = parseFloat(data[i].vehicleElement).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].totalAssessableIncome = parseFloat(data[i].totalAssessableIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].deductibleReliefs = parseFloat(data[i].deductibleReliefs).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].totalReliefs = parseFloat(data[i].totalReliefs).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].chargeableIncome = parseFloat(data[i].chargeableIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].taxDeductible = parseFloat(data[i].taxDeductible).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].overtimeTax = parseFloat(data[i].overtimeTax).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        data[i].totalTaxPayableToGra = parseFloat(data[i].totalTaxPayableToGra).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    document.getElementById("employeesGrid").innerHTML = "";

    var grid = new ej.grids.Grid({
        dataSource: data,
        enableHover: true,
        frozenColumns: 2,
        columns: [
            { field: 'empName', headerText: 'Employee Name', width: 230 },
            { field: 'empTin', headerText: 'TIN', width: 150 },
            { field: 'empPosition', headerText: 'Position', width: 150 },
            { field: 'isResident', headerText: 'Resident', textAlign: 'Center', width: 150 },
            { field: 'isSecondaryEmployement', headerText: 'Secondary Employment', textAlign: 'Center', width: 190 },
            { field: 'basicSalary', headerText: 'Basic Salary', textAlign: 'Right', width: 170 },
            { field: 'cashAllowances', headerText: 'Cash Allowance', textAlign: 'Right', width: 170 },
            { field: 'bonusIncome', headerText: 'Bonus Income', textAlign: 'Right', width: 170 },
            { field: 'overtimeIncome', headerText: 'Overtime Income', textAlign: 'Right', width: 170 },
            { field: 'nonCashBenefit', headerText: 'Non-Cash Benefit', textAlign: 'Right', width: 170 },
            { field: 'thirdTierPension', headerText: 'Tier 3', textAlign: 'Right', width: 170 },
            { field: 'severancePayPaid', headerText: 'Severance Pay Paid', textAlign: 'Right', width: 170 },
            { field: 'socialSecurity', headerText: 'Social Security', textAlign: 'Right', width: 170 },
            { field: 'finalTaxOnBonus', headerText: 'Final Tax On Bonus', textAlign: 'Right', width: 170 },
            { field: 'excessBonus', headerText: 'Excess Bonus', textAlign: 'Right', width: 170 },
            { field: 'totalCashEmolument', headerText: 'Total Cash Emolument', textAlign: 'Right', width: 190 },
            { field: 'accommodationElement', headerText: 'Accomodation Element', textAlign: 'Right', width: 190 },
            { field: 'vehicleElement', headerText: 'Vehicle Element', textAlign: 'Right', width: 170 },
            { field: 'totalAssessableIncome', headerText: 'Total Assessable Income', textAlign: 'Right', width: 200 },
            { field: 'deductibleReliefs', headerText: 'Deductible Reliefs', textAlign: 'Right', width: 170 },
            { field: 'totalReliefs', headerText: 'Total Relief', textAlign: 'Right', width: 170 },
            { field: 'chargeableIncome', headerText: 'Chargeable Income', textAlign: 'Right', width: 170 },
            { field: 'taxDeductible', headerText: 'Tax Deductible', textAlign: 'Right', width: 170 },
            { field: 'overtimeTax', headerText: 'Overtime Tax', textAlign: 'Right', width: 170 },
            { field: 'totalTaxPayableToGra', headerText: 'Total Tax Payable to GRA', textAlign: 'Right', width: 200 },
        ],
        height: 480,
        pageSettings: { pageSize: 100 },
        allowGrouping: false,
        allowPaging: true,
        allowSorting: false,
        allowFiltering: false,
        filterSettings: { type: 'Menu' },
    });

    grid.appendTo('#employeesGrid');
    gridGlobal = grid;

    $("#payeDetailsView").hide();
    $("#employeeListView").show();
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

var loadEmployeeView = function () {
    var appId = $("#applicationId").val();
    var employeeDetailsUrl = `${employeeDetails}?payeId=` + appId;

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

