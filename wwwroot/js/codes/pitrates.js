'use strict'

var ServerUrl = $("#serverUrl").val();
var MainUrl = `${ServerUrl}api/TaxRates/`;

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
};

var setAllFieldToDefault = function () {

    $("#ratesCode").text("");
    $("#description").text("");
    $("#amtBased").text("");
    $("#taxFreeAmt").text("A");
    $("#basedOnTable").text("");
    $("#fixedAmtTable").text("");
    $("#startDate").text("");
    $("#endDate").text("");
    $("#default").text("");
};

$("#BtnSearch").click(function () {
    searchTaxRates();
});

$("#SearchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTaxRates();
    }
});

$("#BtnOpenAddModal").click(function () {
    $("#crDetails").show();
    $("#pitGridView").hide();
});

$("#backToGrid").click(function () {
    setAllFieldToDefault();
    $("#crDetails").hide();
    $("#pitGridView").show();
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));
    var url = `${MainUrl}GetAllGtaxByIdAsync?lngId=` + item.id;

    $("#codeId").val(item.id);
    apiCaller(url, "GET", "", loadItemDetails);
    disableAllFields();
    $("#crDetails").show();
    $("#pitGridView").hide();
});

$('#modal-add-setup').on('hidden.bs.modal', function () {
    enableAllFields();
    setAllFieldToDefault();
    $("#editBtn").hide();
    $("#submitSetup").show();

    $("#codeId").val("");
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

