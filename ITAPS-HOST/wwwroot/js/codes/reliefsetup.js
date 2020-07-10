var gridGlobal = "";
var AppServerUrl = $("#serverUrl").val();
var MainGetUrl = `${AppServerUrl}api/CodesApi/`;
var PostUrl = `${AppServerUrl}api/CodesApi/`;
var reliefType = "";
var yearsDropdown = "";
var activeRelief = "";
var itemToSave = {};

$(document).ready(function () {
    $("#pgHeader").text("Personal Tax Relief Rates");
    initializeGrid([]);
    loadViewDependecies();
    $("#endDate").flatpickr({});
    $("#startDate").flatpickr({});
    $("#startDateReliefModal").flatpickr({});
    $("#endDateReliefModal").flatpickr({});
});

$("#typeOfReliefs").on('change', function () {
    var e = document.getElementById("listOfReliefs");
    reliefType = e.options[e.selectedIndex].value;
    hideOrShowRateMultiplier();
});

$("#listOfReliefs").on('change', function () {
    var e = document.getElementById("listOfReliefs");
    activeRelief = e.options[e.selectedIndex].value;
});

$("#yearsDropdown").on('change', function () {
    var e = document.getElementById("yearsDropdown");
    yearsDropdown = e.options[e.selectedIndex].value;
});

var hideOrShowRateMultiplier = function () {
    if ($("#typeOfReliefs").val() == "R")
        $("#rateMultiplierDiv").show();
    else if ($("#typeOfReliefs").val() == "F")
        $("#rateMultiplierDiv").hide();
};

var loadViewDependecies = function () {
    loadReliefTypes();
    loadMultiplierCode();
};

var loadMultiplierCode = function () {
    var url = `${MainGetUrl}TOI`;
    apiCaller(url, "GET", "", populateMultiplierCode);
};

var loadReliefTypes = function () {
    var url = `${MainGetUrl}APT`;
    apiCaller(url, "GET", "", populateReleifs);
};

var populateReleifs = function (data) {
    var output = "";
    var output2 = "";

    data.sort((a, b) => (a.data > b.data) - (a.data < b.data));
    output += '<option value="0">Select Name</option><option value="*">All</option>';
    output2 += '<option value="0">Select Name</option>';
    for (var i = 0; i < data.length; i++) {
        output = output + '<option value="' + data[i].description + '" >' + data[i].description + '</option>';
        output2 = output2 + '<option value="' + data[i].id + '" >' + data[i].description + '</option>';
    }

    output = output;
    $(".listOfReliefs").html(output);
    $(".listOfReliefs2").html(output2);
};

var populateMultiplierCode = function (data) {
    var output = "";

    data.sort((a, b) => (a.data > b.data) - (a.data < b.data));

    output += '<option value="0" selected>Select Code</option>';
    for (var i = 0; i < data.length; i++) {
        output = output + '<option value="' + data[i].code + '" >' + data[i].description + ' (' + data[i].code + ')</option>';
    }

    output = output;
    $("#multiplierCode").html(output);
};

var initializeGrid = function (data) {
    document.getElementById("Grid").innerHTML = "";

    var grid = new ej.grids.Grid({
        dataSource: data,
        enableHover: true,
        columns: [
            { field: 'reliefApplicationType', headerText: 'Name', width: 250 },
            { field: 'reliefType', headerText: 'Relief Type', width: 350 },
            { field: 'amountOfRelief', headerText: 'Amount', width: 150, textAlign: 'Right' },
            { field: 'status', headerText: 'Status', width: 120 },
            { field: 'startDate', headerText: 'Start Date', width: 140, format: 'yMd' },
            { field: 'endDate', headerText: 'End Date', width: 140, format: 'yMd' }
        ],
        height: 300,
        pageSettings: { pageSize: 8 },
        allowGrouping: false,
        allowPaging: true,
        allowSorting: false,
        allowFiltering: true,
        filterSettings: { type: 'Menu' },
        rowSelected: rowSelected,
    });

    grid.appendTo('#Grid');
    gridGlobal = grid;
};

function rowSelected(args) {
    var selectedrecords = gridGlobal.getSelectedRecords();
    onGridSelected(selectedrecords[0]);
};

var onGridSelected = function (item) {
    loadReliefDetails(item.id);
};

var loadReliefDetails = function () {
    console.log("row selected");
};

$("#addRelief").click(function () {
    $("#addPersonalReliefType").modal("show");
});

$("#btnSearch").click(function () {
    if (yearsDropdown == "")
        return toastr.warning("Please select year");

    if (activeRelief != "0" && yearsDropdown != "0") {

        if (activeRelief == "*")
            activeRelief = "*";

        var url = MainGetUrl + "GetAllTaxReliefsSetupsByDate?year=" + yearsDropdown + "&type=" + activeRelief;
        apiCaller(url.trim(), "GET", "", manipulateDataForDisplay);
    } else {
        toastr.warning("Inalid Entry");
    }

});

var manipulateDataForDisplay = function (resp) {
    if (resp == null) {
        return toastr.info("No Data");
    }

    for (var i = 0; i < resp.length; i++) {
        resp[i].status = resp[i].status == "I" ? "Inactive" : resp[i].status == "A" ? "Active" : "N/A";
        resp[i].startDate = convertDateToFormat(resp[i].startDate);
        resp[i].endDate = convertDateToFormat(resp[i].endDate);
    }

    return initializeGrid(resp);
};

var convertDateToFormat = function (input) {
    input = input.toString().split("T")[0];
    var datePart = input.match(/\d+/g),
        year = datePart[0],
        month = datePart[1], day = datePart[2];

    return day + '/' + month + '/' + year;
};

$("#listOfReliefsModal").on('change', function () {
    var e = document.getElementById("listOfReliefsModal");
    itemToSave.reliefName = e.options[e.selectedIndex].value;
    validateEntry();
});

$("#typeOfReliefs").on('change', function () {
    var e = document.getElementById("typeOfReliefs");
    if (e.options[e.selectedIndex].value == "F")
        itemToSave.reliefMultiplierCode = "N/A";
    else if (e.options[e.selectedIndex].value == "R" && itemToSave.reliefMultiplierCode == "N/A") {
        toastr.info("Please select multiplier code");
        itemToSave.reliefMultiplierCode = "";
        validateEntry();
    }

    itemToSave.reliefType = e.options[e.selectedIndex].value;
    validateEntry();
});

$("#multiplierCode").on('change', function () {
    var e = document.getElementById("multiplierCode");
    itemToSave.reliefMultiplierCode = e.options[e.selectedIndex].value;
    validateEntry();
});

$("#reliefStatus").on('change', function () {
    var e = document.getElementById("reliefStatus");
    itemToSave.reliefStatus = e.options[e.selectedIndex].value;
    validateEntry();
});

var validateEntry = function () {
    if (itemToSave.reliefName != "0" && itemToSave.reliefType != "0" && itemToSave.reliefMultiplierCode != "0"
        && itemToSave.reliefStatus != "0" && itemToSave.reliefName != "" && itemToSave.reliefType != ""
        && itemToSave.reliefMultiplierCode != "" && itemToSave.reliefStatus != "") {

        if (lookForEmpytyField())
            $("#btnSaveRelief").prop("disabled", false);
        else
            $("#btnSaveRelief").prop("disabled", true);
    } else {
        $("#btnSaveRelief").prop("disabled", true);
    }
};

$("#startDateReliefModal").on("change", function () {
    validateEntry();
});

$("#endDateReliefModal").on("change", function () {
    validateEntry();
});

$("#reliefValue").on("keyup", function () {
    validateEntry();
});

var lookForEmpytyField = function () {
    var startDate = $("#startDateReliefModal").val();
    var endDate = $("#endDateReliefModal").val();
    var amount = $("#reliefValue").val();
    if (startDate != "" && endDate != "" && amount != "")
        return true;
    else
        return false;
};

var successfullySave = function (data) {

    if (data.length) {

        $("#reliefStatus").val($("#reliefStatus option:first").val());
        $("#multiplierCode").val($("#multiplierCode option:first").val());
        $("#typeOfReliefs").val($("#typeOfReliefs option:first").val());
        $("#listOfReliefsModal").val($("#listOfReliefsModal option:first").val());
        $("#startDateReliefModal").flatpickr({});
        $("#endDateReliefModal").flatpickr({});
        $("#reliefValue").val("");
        $("#addReliefNotes").val("");

        $("#addPersonalReliefType").mddal("hide");
        toastr.success("Succesfully created!");
    }
   
};

$("#btnSaveRelief").click(function () {
    var url = PostUrl + "";

    var item = {
        "reliefId": itemToSave.reliefName,
        "reliefType": itemToSave.reliefType,
        "status": itemToSave.reliefStatus,
        "rateMultiplier": itemToSave.reliefMultiplierCode,
        "notes": $("#addReliefNotes").val(),
        "startDate": $("#startDateReliefModal").val(),
        "endDate": $("#endDateReliefModal").val(),
        "reliefValue": $("#reliefValue").val()
    }

    apiCaller(url, "POST", item, successfullySave);
});