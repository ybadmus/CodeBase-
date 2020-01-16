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

var initializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "code", title: "Code", width: '90px', },
            { field: "sector", title: "Sector", width: '20%' },
            { field: "businessLoc", title: "Location", width: '20%' },
            { field: "taxRate", title: "Tax Rate", width: '70px', attributes: { style: "text-align:right;" } },
            {
                field: "status",
                template: "#if(status=='A'){# #: 'Active' # #}else{# #: 'Inactive' # #}#",
                title: "Status",
                width: '10%'
            },
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
    var url = `${MainUrl}SearchTaxRateAsync?searchItem=` + searchItem;

    apiCaller(url, "GET", "", initializeKendoGrid);
};

$(document).ready(function () {
    initializeKendoGrid([]);
    $("#pgHeader").text("Company Tax Rates");
});

var disableAllFields = function () {
    $("#code").attr("disabled", true);
    $("#taxRate").attr("disabled", true);
    $("#givenTaxHoliday").attr("disabled", true);
    $("#status").attr("disabled", true);
    $("#sector").attr("disabled", true);
    $("#bizLoc").attr("disabled", true);
    $("#holidayRate").attr("disabled", true);
    $("#holidayYears").attr("disabled", true);
    $("#description").attr("disabled", true);
    $("#notes").attr("disabled", true);

    $("#editBtn").show();
    $("#submitSetup").hide();
};

$("#editBtn").click(function () {
    enableAllFields();
    $("#code").attr("disabled", true); //codes are not editable
});

var enableAllFields = function () {
    $("#code").attr("disabled", false);
    $("#taxRate").attr("disabled", false);
    $("#givenTaxHoliday").attr("disabled", false);
    $("#status").attr("disabled", false);
    $("#sector").attr("disabled", false);
    $("#bizLoc").attr("disabled", false);
    $("#holidayRate").attr("disabled", false);
    $("#holidayYears").attr("disabled", false);
    $("#description").attr("disabled", false);
    $("#notes").attr("disabled", false);

    $("#editBtn").hide();
    $("#submitSetup").show();
};

var loadItemDetails = function (resp) {
    var response = resp[0];

    $("#code").val(response.code);
    $("#taxRate").val(response.taxRate);
    $("#givenTaxHoliday").val(response.givenTaxHoliday);
    $("#status").val(response.status);
    $("#sector").val(response.sector);
    $("#bizLoc").val(response.businessLoc);
    $("#holidayRate").val(response.taxHolidayRate);
    $("#holidayYears").val(response.holidayYears);
    $("#description").val(response.description);
    $("#notes").val(response.notes);
};

var setAllFieldToDefault = function () {
    $("#code").val("");
    $("#taxRate").val("");
    $("#givenTaxHoliday").val("");
    $("#status").val("A");
    $("#sector").val("");
    $("#bizLoc").val("");
    $("#holidayRate").val("");
    $("#holidayYears").val("");
    $("#description").val("");
    $("#notes").val("");
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
    $("#modal-add-setup").modal("show");
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));
    var url = `${MainUrl}GetGcirById?lngId=` + item.id;

    $("#codeId").val(item.id);
    apiCaller(url, "GET", "", loadItemDetails);
    disableAllFields();
    $("#modal-add-setup").modal("show");
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