'use strict'

var ServerUrl = $("#serverUrl").val();
var MainUrl = `${ServerUrl}api/TaxRates/`;
var dataTableRows = [];
var taxTableLength = 0;

var objSave = {

};

var dateConverter = function (startdate) {
    return startdate.split("T")[0];
};

var initializeKendoGrid = function (data) {

    for (var i = 0; i < data.length; i++) {
        data[i].startdate = data[i].startdate.split("T")[0];
        data[i].endDate = data[i].endDate.split("T")[0];
    };

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "code", title: "Code", width: "90px", },
            { field: "description", title: "Description", width: "25%" },
            { field: "startdate", title: "Start Date", width: "15%" },
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
    $("#pitGridView").show();

    $("#lockDetails").hide();
    $("#editDetails").hide();
    $("#saveRow").hide();

    $("#startDateTR").flatpickr({
    });

    $("#endDateTR").flatpickr({

    });

    $('[data-toggle="tooltip"]').tooltip()
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

    document.getElementById("descriptionTR").setAttribute('contenteditable', 'false');
    document.getElementById("amtBasedTR").setAttribute('contenteditable', 'false');
    document.getElementById("taxFreeAmtTR").setAttribute('contenteditable', 'false');
    document.getElementById("basedOnTableTR").setAttribute('contenteditable', 'false');
    document.getElementById("fixedAmtTableTR").setAttribute('contenteditable', 'false');
    document.getElementById("defaultTR").setAttribute('contenteditable', 'false');


    disableAllTableFields();
};

var disableAllTableFields = function () {

    for (var i = 0; i < taxTableLength; i++) {
        document.getElementById("taxBand" + i).setAttribute('contenteditable', 'false');
        document.getElementById("taxableAmount" + i).setAttribute('contenteditable', 'false');
        document.getElementById("percentage" + i).setAttribute('contenteditable', 'false');
    };
};

var enableAllFields = function () {

    document.getElementById("startDate").setAttribute('contenteditable', 'true');
    document.getElementById("endDate").setAttribute('contenteditable', 'true');
    document.getElementById("description").setAttribute('contenteditable', 'true');
    document.getElementById("amtBased").setAttribute('contenteditable', 'true');
    document.getElementById("taxFreeAmt").setAttribute('contenteditable', 'true');
    document.getElementById("basedOnTable").setAttribute('contenteditable', 'true');
    document.getElementById("fixedAmtTable").setAttribute('contenteditable', 'true');
    document.getElementById("default").setAttribute('contenteditable', 'true');

    document.getElementById("descriptionTR").setAttribute('contenteditable', 'true');
    document.getElementById("amtBasedTR").setAttribute('contenteditable', 'true');
    document.getElementById("taxFreeAmtTR").setAttribute('contenteditable', 'true');
    document.getElementById("basedOnTableTR").setAttribute('contenteditable', 'true');
    document.getElementById("fixedAmtTableTR").setAttribute('contenteditable', 'true');
    document.getElementById("defaultTR").setAttribute('contenteditable', 'true');

    for (var i = 0; i < taxTableLength; i++) {
        document.getElementById("taxBand" + i).setAttribute('contenteditable', 'true');
        document.getElementById("taxableAmount" + i).setAttribute('contenteditable', 'true');
        document.getElementById("percentage" + i).setAttribute('contenteditable', 'true');
    }
};

$("#editBtn").click(function () {
    enableAllFields();

    $("#code").attr("disabled", true); //codes are not editable
});

$("#lockDetails").click(function () {
    disableAllFields();

    $("#lockDetails").hide();
    $("#editDetails").show();

    $("#saveRow").hide();
    $("#newRow").show();


});

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
    $("#code").text(response.code);

    loadTaxTable(response.tax1);
    disableAllFields();
};

var loadTaxTable = function (listOfItems) {
    taxTableLength = listOfItems.length;
    dataTableRows = []; //initialize to empty array;

    let output = "";
    let sortedArray = listOfItems.sort(function (a, b) {
        return (a.taxBanb - b.taxBanb);
    });

    dataTableRows = sortedArray;

    for (var i = 0; i <= sortedArray.length - 1; i++) {
        output = output + '<tr><td align="right" style="color: black" contenteditable="true" id="taxBand' + i
            + '" class="valueCell"> ' + sortedArray[i].taxBanb + ' </td><td align="right" style="color: black" contenteditable="true"  id="taxableAmount' + i
            + '" class="valueCell"> ' + parseInt(sortedArray[i].taxableAmt ? sortedArray[i].taxableAmt : 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' </td><td align="right" contenteditable="true" style="color: black" id="percentage' + i
            + '" class="">' + sortedArray[i].percentage + '</td></tr>';
    }

    //button for editing a row and delete, will be continued later;
    //<td><button id="removeRow' + i + '" class="btn btn-danger btn-sm"><i class="fa fa-minus-circle" aria-hidden="true"></i></button> <button id="saveRow' + i + '" class="btn btn-primary btn-sm"><i class="fa fa-cloud" aria-hidden="true"></i></button></td>

    output = output;
    $("#taxGrid").html(output);
};

var setAllFieldToDefault = function () {

    $("#ratesCode").text("");
    $("#codeId").val("");
    $("#code").text("");
    $("#description").text("");
    $("#amtBased").text("");
    $("#taxFreeAmt").text("");
    $("#basedOnTable").text("");
    $("#fixedAmtTable").text("");
    $("#startDate").text("");
    $("#endDate").text("");
    $("#default").text("");
    //No need to clear table because the add botton loads default values;
};

$("#BtnOpenAddModal").click(function () {
    dataTableRows = [];

    //load a minimum of 5 rows;
    for (let i = 5; i >= 1; i--) {
        dataTableRows.push({
            taxBanb: 0, taxableAmt: 0.00, percentage: 0,
        });
    };

    $("#detailsViewTR").hide();
    $("#AddViewTR").show();

    $("#lockDetails").show();
    $("#editDetails").hide();

    $("#crDetails").show();
    $("#pitGridView").hide();

    enableAllFields();
    loadTaxTable(dataTableRows);
});

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
        taxBanb: 0, taxableAmt: 0.00, percentage: 0,
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

    //remove defaults created!
    dataTableRows.shift();

    dataTableRows.push({
        taxBanb: parseInt($("#taxBand0").text()), taxableAmt: parseInt($("#taxableAmount0").text()), percentage: parseInt($("#percentage0").text()),
    });

    loadTaxTable(dataTableRows);
    disableAllFields();

    $("#lockDetails").hide();
    $("#editDetails").show();
});

$("#backToGrid").click(function () {
    setAllFieldToDefault();

    $("#crDetails").hide();
    $("#pitGridView").show();

    $("#detailsViewTR").hide();
    $("#AddViewTR").hide();
});

$("#editDetails").click(function () {
    enableAllFields();

    $("#lockDetails").show();
    $("#editDetails").hide();
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));
    var url = `${MainUrl}GetAllGtaxByIdAsync?lngId=` + item.id;

    $("#codeId").val(item.id);

    $("#crDetails").show();
    $("#pitGridView").hide();

    $("#detailsViewTR").show();
    $("#AddViewTR").hide();

    $("#editDetails").show();
    $("#lockDetails").hide();

    apiCaller(url, "GET", "", loadItemDetails);
});

$("#saveDetails").click(function () {
    if ($("#codeId").val() === "")
        $("#modal-add-setup").modal("show");
    else
        saveDetailsFlow();
});

var saveDetailsFlow = function () {
    var url = `${MainUrl}PostGtax`;
    var taxBands = [];

    if ($("#codeId").val() !== "") {

        objSave.Id = $("#codeId").val();
        objSave.CompanyId = "d0335a7d-de3a-435f-adf0-e044a599ef84";
        objSave.Code = $("#code").text();

        objSave.Description = $("#description").text();
        objSave.AmtBased = $("#amtBased").text();
        objSave.TaxFreeAmt = parseInt($("#taxFreeAmt").text());
        objSave.PerBasedOnTable = $("#basedOnTable").text();
        objSave.FixedAmtTable = $("#fixedAmtTable").text();
        objSave.Startdate = $("#startDate").text();
        objSave.EndDate = $("#endDate").text();
        objSave.Default = parseInt($("#default").text());
    } else {

        objSave.CompanyId = "d0335a7d-de3a-435f-adf0-e044a599ef84";
        objSave.Code = $("#codeTR").val();

        objSave.Description = $("#descriptionTR").text();
        objSave.AmtBased = $("#amtBasedTR").text();
        objSave.TaxFreeAmt = parseInt($("#taxFreeAmtTR").text());
        objSave.PerBasedOnTable = $("#basedOnTableTR").text();
        objSave.FixedAmtTable = $("#fixedAmtTableTR").text();
        objSave.Startdate = $("#startDateTR").val();
        objSave.EndDate = $("#endDateTR").val();
        objSave.Default = parseInt($("#defaultTR").text());
    }


    for (var i = 0; i < taxTableLength; i++) {

        var taxBandObj = {
            "TaxMasterId": "79521503-9ea4-4aca-819b-0481e679ad7d",
            "TaxBand": parseFloat($("#taxBand" + i).text().replace(/,/g, '')),
            "TaxableAmt": parseFloat($("#taxableAmount" + i).text().replace(/,/g, '')),
            "Percentage": parseFloat($("#percentage" + i).text().replace(/,/g, ''))
        };

        if (taxBandObj.TaxBand === 0 && taxBandObj.TaxableAmt === 0 && taxBandObj.Percentage === 0)
            continue;
        else
            taxBands.push(taxBandObj);
    };

    objSave.Tax1 = taxBands;
    console.log(objSave);

    apiCaller(url, "POST", objSave, successfullySaved);
};

var successfullySaved = function () {
    toastr.success("Successfully saved!");
};

$("#continueSubmit").click(function () {
    saveDetailsFlow();
});
