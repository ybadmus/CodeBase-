﻿var HeaderName = "Monthly PAYE";
var serverUrl = $("#serverUrl").val();
var searchPayeByTaxOffice = `${serverUrl}api/PayeApi/GetAllCompanyPaye`;
var payeDetailsUrl = `${serverUrl}api/PayeApi/GetPayeDetails`;
var employeeDetails = `${serverUrl}api/PayeApi/GetEmployeeDetails`;
var activeTaxOffice = "";
var activePeriod = "";

$(document).ready(function () {
    bootstrapPage();
});

$("#tccListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("tccListOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
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
            { field: "updatedAt", title: "Date", width: '110px', template: '#= kendo.toString(kendo.parseDate(updatedAt), "dd/MM/yyyy")#'  },
            { field: "companyName", title: "Name", width: '25%' },
            { field: "companyTIN", title: "TIN", width: '110px' },
            { field: "totalNoOfStaff", title: "Total Staffs", width: '15%', attributes: { style: "text-align:right;" } },
            { field: "totalCashEmolument", title: "Total Cash Emolument", width: '15%', attributes: { style: "text-align:right;" } },
            { field: "taxDeducted", title: "Tax Deducted", width: '15%', attributes: { style: "text-align:right;" } },
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
    getActivePeriods();
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

    apiCaller(detailsUrl, "GET", "", loadDetailsView);
});


var loadDetailsView = function (resp) {
    $("#payeGridView").hide();
    $("#employeeDetails").hide();
    $("#monDetails").show();

    $("#payerTIN").text(resp[0].payerTIN);
    $("#periodYear").text(resp[0].periodYear);

    $("#managementNo").text(resp[0].managementNo);
    $("#otherNo").text(resp[0].otherNo);

    $("#managementPay").text(resp[0].managementPay);
    $("#otherPay").text(resp[0].otherPay);

    $("#managementTax").text(resp[0].managementTax);
    $("#otherTax").text(resp[0].otherTax);

    $("#startingStaff").text(resp[0].startingStaff);
    $("#engagedStaff").text(resp[0].engagedStaff);
    $("#disengagedStaff").text(resp[0].disengagedStaff);

    loadEmployeeTable(resp[0].payeChild);

}; 

var loadEmployeeTable = function (listOfItems) {
    var output = ""
    var sortedArray = listOfItems;

    for (var i = 0; i <= sortedArray.length - 1; i++) {
        output = output + '<tr id="' + sortedArray[i].id + '"><td style="color: black" contenteditable="true" id="empName' + i
            + '" class="valueCell"> ' + sortedArray[i].empName + ' </td><td style="color: black" contenteditable="true" id="empName' + i
            + '" class="valueCell"> ' + sortedArray[i].empTin + ' </td><td style="color: black" contenteditable="true" id="empPosition' + i
            + '" class="valueCell"> ' + sortedArray[i].empPosition + ' </td><td align="right" style="color: black" contenteditable="true"  id="basicSalary' + i
            + '" class="valueCell"> ' + parseInt(sortedArray[i].basicSalary ? sortedArray[i].basicSalary : 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
            + '</td><td style="color: black" id="' + sortedArray[i].id + '" class="btnRow"><button title="View item" class="btn btn-success btn-sm" style=""><span class="fa fa-file fa - lg"></span></button></td></tr>';
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
    $("#basicSalary").text(resp[0].basicSalary);
    $("#cashAllowances").text(resp[0].cashAllowances);
    $("#bonusIncome").text(resp[0].bonusIncome);
    $("#overtimeIncome").text(resp[0].overtimeIncome);
    $("#secondaryEmployement").text(resp[0].secondaryEmployement);
    $("#nonCashBenefit").text(resp[0].nonCashBenefit);
    $("#providentRate").text(resp[0].providentRate);
    $("#severancePayPaid").text(resp[0].severancePayPaid);
};