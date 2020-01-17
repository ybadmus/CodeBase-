'use strict'

var ServerUrl = $("#serverUrl").val();
var MainUrl = `${ServerUrl}api/TaxRates/`;
var dataTableRows = [];
var taxTableLength = 0;

var objSave = {
    "Code": "",
    "Sector": "",
    "BusinessLoc": "",
    "TaxRate": 0,
    "Description": "",
    "GivenTaxHoliday": true,
    "TaxHolidayRate": 0,
    "HolidayYears": 0,
    "Notes": "",
    "Status": ""
};

var dateConverter = function (startdate) {
    return startdate.split("T")[0];
};

var initializeKendoGrid = function (data) {

    for (var i = 0; i < data.length; i++) {
        data[i].startdate = data[i].startdate.split("T")[0];
        data[i].endDate = data[i].startdate.split("T")[0];
    };

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "code", title: "Code", width: "90px", },
            { field: "description", title: "Description", width: "25%" },
            { field: "startdate", title: "Start Date", width: "15%"  },
            { field: "endDate", title: "End Date", width: "15%" },
            { field: "amtBased", title: "Amount Based", width: "10%" },
            {
                command: [{
                    name: "view",
                    template: "<button title='View item' class='btn btn-success btn-sm'><i class='fa fa-file fa-lg'></i></button>"
                }],
                title: "Actions",
                width: "90px"
            }
        ]
    });
};

var apiCaller = function (url, type, data, callback) {
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
            $('html').hideLoading();
            if (callback) {
                callback(response.body, data, type);
            };
        },
        error: function (error) {
            $('html').hideLoading();
            toastr.error('An error occured');
        }
    });
};

var searchTaxRates = function () {
    var searchItem = $("#SearchItem").val().trim();
    var url = "";

    if (searchItem === "*")
        url = `${MainUrl}GetAllGtaxAsync`;
    else 
        url = `${MainUrl}GetAllGtaxByYearAsync?year=` + searchItem;

    apiCaller(url, "GET", "", initializeKendoGrid);
};

$(document).ready(function () {
    initializeKendoGrid([]);
    $("#pgHeader").text("PIT Tax Rates");

    $("#crDetails").hide();
    $("#lockDetails").hide();
    $("#pitGridView").show();
    $("#editDetails").hide();
    $("#saveRow").hide();
});

var disableAllFields = function () {

    document.getElementById("startDate").setAttribute('contenteditable', 'false');
    document.getElementById("endDate").setAttribute('contenteditable', 'false');
    document.getElementById("description").setAttribute('contenteditable', 'false');
    document.getElementById("amtBased").setAttribute('contenteditable', 'false');
    document.getElementById("taxFreeAmt").setAttribute('contenteditable', 'false');
    document.getElementById("basedOnTable").setAttribute('contenteditable', 'false');
    document.getElementById("fixedAmtTable").setAttribute('contenteditable', 'false');
    document.getElementById("default").setAttribute('contenteditable', 'false');

    for (var i = 0; i < taxTableLength; i++) {
        document.getElementById("taxBand" + i).setAttribute('contenteditable', 'false');
        document.getElementById("taxableAmount" + i).setAttribute('contenteditable', 'false');
        document.getElementById("percentage" + i).setAttribute('contenteditable', 'false');
    }
};

$("#editBtn").click(function () {
    enableAllFields();
    $("#code").attr("disabled", true); //codes are not editable
});

var enableAllFields = function () {

    document.getElementById("startDate").setAttribute('contenteditable', 'true');
    document.getElementById("endDate").setAttribute('contenteditable', 'true');
    document.getElementById("description").setAttribute('contenteditable', 'true');
    document.getElementById("amtBased").setAttribute('contenteditable', 'true');
    document.getElementById("taxFreeAmt").setAttribute('contenteditable', 'true');
    document.getElementById("basedOnTable").setAttribute('contenteditable', 'true');
    document.getElementById("fixedAmtTable").setAttribute('contenteditable', 'true');
    document.getElementById("default").setAttribute('contenteditable', 'true');

    for (var i = 0; i < taxTableLength; i++) {
        document.getElementById("taxBand" + i).setAttribute('contenteditable', 'true');
        document.getElementById("taxableAmount" + i).setAttribute('contenteditable', 'true');
        document.getElementById("percentage" + i).setAttribute('contenteditable', 'true');
    }
};

var loadItemDetails = function (resp) {
    var response = resp[0];

    $("#ratesCode").text(response.code);
    $("#description").text(response.description);
    $("#amtBased").text(response.amtBased);
    $("#taxFreeAmt").text(response.taxFreeAmt);
    $("#basedOnTable").text(response.perBasedOnTable);
    $("#fixedAmtTable").text(response.fixedAmtTable);
    $("#startDate").text(response.startdate.split("T")[0]);
    $("#endDate ").text(response.endDate.split("T")[0]);
    $("#default").text(response.default);

    loadTaxTable(response.tax1);
    disableAllFields();
};

var loadTaxTable = function (listOfItems) {
    taxTableLength = listOfItems.length;
    dataTableRows = [];

    let output = "";
    let sortedArray = listOfItems.sort(function (a, b) {
        return (a.taxBanb - b.taxBanb);
    });

    dataTableRows = sortedArray;

    for (var i = 0; i <= sortedArray.length - 1; i++) {
        output = output + '<tr><td align="right" style="color: black" contenteditable="true" id="taxBand' + i
            + '" class="valueCell"> ' + listOfItems[i].taxBanb + ' </td><td align="right" style="color: black" contenteditable="true"  id="taxableAmount' + i
            + '" class="valueCell"> ' + parseInt(listOfItems[i].taxableAmt ? listOfItems[i].taxableAmt : 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' </td><td align="right" contenteditable="true" style="color: black" id="percentage' + i
            + '" class="">' + listOfItems[i].percentage + '</td></tr>';
    }

    /*<td><button id="removeRow' + i + '" class="btn btn-danger btn-sm"><i class="fa fa-minus-circle" aria-hidden="true"></i></button> <button id="saveRow' + i + '" class="btn btn-primary btn-sm"><i class="fa fa-cloud" aria-hidden="true"></i></button></td>*/

    output = output;
    $("#taxGrid").html(output);
};

var setAllFieldToDefault = function () {

    $("#ratesCode").text("");
    $("#description").text("");
    $("#amtBased").text("");
    $("#taxFreeAmt").text("");
    $("#basedOnTable").text("");
    $("#fixedAmtTable").text("");
    $("#startDate").text("");
    $("#endDate").text("");
    $("#default").text("");

    //No need to clear table because it handled in the click action of the add button
};

$("#BtnSearch").click(function () {
    searchTaxRates();
});

$("#SearchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTaxRates();
    }
});

$("#newRow").click(function () {
    dataTableRows.push({
        taxBanb: 0, taxableAmt:  0.00, percentage: 0,
    });

    loadTaxTable(dataTableRows);
    $("#lockDetails").show();
    $("#editDetails").hide();
    $("#newRow").hide();
    $("#saveRow").show();
});

$("#saveRow").click(function () {
    $("#newRow").show();
    $("#saveRow").hide();

    dataTableRows.shift();

    dataTableRows.push({
        taxBanb: parseInt($("#taxBand0").text()), taxableAmt: parseInt($("#taxableAmount0").text()), percentage: parseInt($("#percentage0").text()),
    });

    loadTaxTable(dataTableRows);
});

$("#BtnOpenAddModal").click(function () {
    dataTableRows = [];

    for (let i = 5; i >= 1; i--) {
        dataTableRows.push({
            taxBanb: 0, taxableAmt: 0.00, percentage: 0,
        });
    };

    $("#crDetails").show();
    $("#pitGridView").hide();
    enableAllFields();
    loadTaxTable(dataTableRows);
});

$("#backToGrid").click(function () {
    setAllFieldToDefault();
    $("#crDetails").hide();
    $("#pitGridView").show();
    $("#codeId").val("");
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));
    var url = `${MainUrl}GetAllGtaxByIdAsync?lngId=` + item.id;

    $("#codeId").val(item.id);
    $("#crDetails").show();
    $("#pitGridView").hide();
    $("#editDetails").show();

    apiCaller(url, "GET", "", loadItemDetails);
});

$("#submitSetup").click(function () {
    var url = `${MainUrl}PostGcir`;

    if ($("#codeId").val() !== "")
        objSave.Id = $("#codeId").val();

    objSave.Code = $("#code").val();
    objSave.Sector = $("#sector").val();
    objSave.BusinessLoc = $("#bizLoc").val();
    objSave.TaxRate = parseInt($("#taxRate").val());
    objSave.Description = $("#description").val();
    objSave.GivenTaxHoliday = $("#givenTaxHoliday").val();
    objSave.TaxHolidayRate = parseInt($("#holidayRate").val());
    objSave.HolidayYears = parseInt($("#holidayYears").val());
    objSave.Notes = $("#notes").val();
    objSave.Status = $("#status").val();

    apiCaller(url, "POST", objSave, successfullySaved);
});

var successfullySaved = function () {
    toastr.success("Successfully saved!");
    $('#modal-add-setup').modal("hide");
    setAllFieldToDefault();
};

$("#editDetails").click(function () {
    enableAllFields();

    $("#lockDetails").show();
    $("#editDetails").hide();
});

$("#lockDetails").click(function () {
    disableAllFields();

    $("#lockDetails").hide();
    $("#editDetails").show();
});

