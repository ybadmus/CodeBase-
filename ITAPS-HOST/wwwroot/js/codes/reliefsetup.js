var gridGlobal = "";
var AppServerUrl = $("#serverUrl").val();
var MainGetUrl = `${AppServerUrl}api/CodesApi/`;
var PostUrl = `${AppServerUrl}api/CodesApi/`;
var reliefType = "";
var yearsDropdown = "";
var activeRelief = "";
var activeReliefNameModal = "";
var itemToSave = {};
var isModalActive = false;
var activeSetupId = "";

$(document).ready(function () {
    $("#pgHeader").text("Personal Tax Relief Rates");
    initializeGrid([]); startDateReliefModal
    loadViewDependecies();
    $("#endDate").flatpickr({});
    $("#startDate").flatpickr({});
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
    setModalDefault();
    loadReliefDetails(item.setupId);
    activeSetupId = item.setupId;
};

var loadReliefDetails = function (id) {

    var url = MainGetUrl + "GetReliefDetails?id=" + id;
    apiCaller(url, "GET", "", loadUpdateModal)
};

var loadUpdateModal = function (data) {
    var data = data[0];
    $(".modal-title").text("Update Tax Relief");
    $("#btnEditField").show();
    $("#btnSaveRelief").hide();

    $("#listOfReliefsModal").val(data.reliefApplicationTypeId);
    $("#typeOfReliefs").val(data.reliefType.includes("Fixed Value") ? "V" : data.reliefType.includes("Rate") ? "R" : "0");
    $("#multiplierCode").val(data.rateMultiplierCode);
    $("#reliefValue").val(data.amountOfRelief);
    $("#reliefStatus").val(data.status);
    $("#startDateReliefModal").val(data.startDate.split('-')[0]);
    $("#endDateReliefModal").val(data.endDate.split('-')[0]);
    $("#selectedStartYear").text(data.startDate.split('-')[0]);
    $("#selectedEndYear").text(data.endDate.split('-')[0]);
    $("#addReliefNotes").val(data.notes);

    disableEnableFieldModal(true);
    $("#addPersonalReliefType").modal("show");
    isModalActive = true;
};

var disableEnableFieldModal = function (val) {
    $("#listOfReliefsModal").prop("disabled", val);
    $("#typeOfReliefs").prop("disabled", val);
    $("#multiplierCode").prop("disabled", val);
    $("#reliefValue").prop("disabled", val);
    $("#reliefStatus").prop("disabled", val);
    $("#startDateReliefModal").prop("disabled", val);
    $("#endDateReliefModal").prop("disabled", val);
    $("#selectedStartYear").prop("disabled", val);
    $("#selectedEndYear").prop("disabled", val);
    $("#addReliefNotes").prop("disabled", val);
};

$("#addRelief").click(function () {
    $("#addPersonalReliefType").modal("show");
    $(".modal-title").text("Add Tax Relief");
    $("#btnEditField").hide();
    $("#btnSaveRelief").show();
    validateModalUpdate();
});

$("#addPersonalReliefType").on('hidden.bs.modal', function () {
    setModalDefault();
    isModalActive = false;
});

$("#btnEditField").click(function () {
    disableEnableFieldModal(false);
    $("#btnEditField").hide();
    $("#btnSaveRelief").show();
    validateModalUpdate();
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
        initializeGrid([]);
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
    activeReliefNameModal = e.options[e.selectedIndex].text;
    validateModalUpdate();
});

$("#typeOfReliefs").on('change', function () {
    var e = document.getElementById("typeOfReliefs");
    if (e.options[e.selectedIndex].value == "F")
        itemToSave.reliefMultiplierCode = "N/A";
    else if (e.options[e.selectedIndex].value == "R" && itemToSave.reliefMultiplierCode == "N/A") {
        toastr.info("Please select multiplier code");
        itemToSave.reliefMultiplierCode = "";
        validateModalUpdate();
    }

    itemToSave.reliefType = e.options[e.selectedIndex].value;
    validateModalUpdate();
});

$("#multiplierCode").on('change', function () {
    var e = document.getElementById("multiplierCode");
    itemToSave.reliefMultiplierCode = e.options[e.selectedIndex].value;
    validateModalUpdate();
});

$("#reliefStatus").on('change', function () {
    var e = document.getElementById("reliefStatus");
    itemToSave.reliefStatus = e.options[e.selectedIndex].value;
    validateModalUpdate();
});

var validateEntry = function () {

    if (itemToSave.reliefName && itemToSave.reliefType && itemToSave.reliefMultiplierCode && itemToSave.reliefStatuss) {

        if (itemToSave.reliefName != "0" && itemToSave.reliefType != "0" && itemToSave.reliefMultiplierCode != "0"
            && itemToSave.reliefStatus != "0") {

            if (lookForEmpytyField())
                $("#btnSaveRelief").prop("disabled", false);
            else
                $("#btnSaveRelief").prop("disabled", true);
        } else {
            $("#btnSaveRelief").prop("disabled", true);
        }
    }

};

var validateModalUpdate = function () {

    if ($("#reliefStatus").val() && $("#typeOfReliefs").val() && $("#multiplierCode").val() && $("#listOfReliefsModal").val()) {

        if ($("#reliefStatus").val() != "0" && $("#typeOfReliefs").val() != "0" && $("#multiplierCode").val() != "0"
            && $("#listOfReliefsModal").val() != "0") {

            if (lookForEmpytyField())
                $("#btnSaveRelief").prop("disabled", false);
            else
                $("#btnSaveRelief").prop("disabled", true);
        } else {
            $("#btnSaveRelief").prop("disabled", true);
        }
    }

};

$("#startDateReliefModal").on("change", function () {

    var e = document.getElementById("startDateReliefModal");
    var value = e.options[e.selectedIndex].value;
    if (value == 0) {

        $("#selectedStartYear").text("");
        $("#endDateReliefModal").prop("disabled", true);
    }
    else {

        $("#selectedStartYear").text(value);
        $("#selectedEndYear").text("");
        populateEndYear(value);
    }

    validateModalUpdate();
});

var populateEndYear = function (data) {

    var output = "";
    var count = parseInt(data) + 5;
    output += '<option value="0" selected>Select Year</option>';
    for (var i = data; i < count; i++) {
        output = output + '<option value="' + i + '" >' + i + '</option>';
    }

    output = output;
    $("#endDateReliefModal").html(output);
    $("#endDateReliefModal").prop("disabled", false);
};

$("#endDateReliefModal").on("change", function () {

    var e = document.getElementById("endDateReliefModal");
    var value = e.options[e.selectedIndex].value;
    if (value == 0)
        $("#selectedEndYear").text("");
    else
        $("#selectedEndYear").text(value);
    validateModalUpdate();
});

$("#reliefValue").on("keyup", function () {

    validateModalUpdate();
});

var lookForEmpytyField = function () {

    var startDate = parseInt($("#startDateReliefModal").val());
    var endDate = parseInt($("#endDateReliefModal").val());
    var amount = parseInt($("#reliefValue").val());
    if (startDate && endDate && amount)
        return true;
    else if (startDate && endDate) {
        if (amount === 0)
            return true;
    }
    return false;
};

var successfullySave = function (data) {

    if (data) {

        setModalDefault();

        data.reliefApplicationType = activeReliefNameModal;
        data.reliefType = data.reliefType === "V" ? "Fixed Value" : data.reliefType === "R" ? "Rate of Employment Income/Business Income" : "N/A";
        data.amountOfRelief = data.reliefValue;
        data.status = data.status === "A" ? "Active" : data.status === "I" ? "Inactive" : "N/A";
        data.startDate = convertDateToFormat(data.startDate);
        data.endDate = convertDateToFormat(data.endDate);

        updateGrid(data);
        toastr.success("Succesfully created!");
        $("#addPersonalReliefType").modal("hide");
    }
};

var successfullyUpdate = function () {
    var url = MainGetUrl + "GetAllTaxReliefsSetupsByDate?year=" + yearsDropdown + "&type=" + activeRelief;
    apiCaller(url.trim(), "GET", "", manipulateDataForDisplay);

    toastr.success("Succesfully updated!");
    $("#addPersonalReliefType").modal("hide");
};

var setModalDefault = function () {
    $("#reliefStatus").val($("#reliefStatus option:first").val());
    $("#multiplierCode").val($("#multiplierCode option:first").val());
    $("#typeOfReliefs").val($("#typeOfReliefs option:first").val());
    $("#listOfReliefsModal").val($("#listOfReliefsModal option:first").val());
    $("#startDateReliefModal").val($("#startDateReliefModal option:first").val());
    $("#endDateReliefModal").val($("#endDateReliefModal option:first").val());
    $("#reliefValue").val("");
    $("#addReliefNotes").val("");
    $("#selectedStartYear").text("");
    $("#selectedEndYear").text("");
};

var updateGrid = function (data) {
    var dataSource = gridGlobal.dataSource;
    dataSource.push(data);
    initializeGrid(dataSource);
};

$("#btnSaveRelief").click(function () {

    if (!isModalActive) {

        var url = PostUrl + "SaveReliefType";
        var item = {
            "reliefId": itemToSave.reliefName,
            "reliefType": itemToSave.reliefType,
            "status": itemToSave.reliefStatus,
            "rateMultiplier": itemToSave.reliefMultiplierCode,
            "notes": $("#addReliefNotes").val(),
            "startDate": $("#startDateReliefModal").val() + "-01-01",
            "endDate": $("#endDateReliefModal").val() + "-12-31",
            "reliefValue": $("#reliefValue").val()
        }

        apiCaller(url, "POST", item, successfullySave);
    } else {

        var url = PostUrl + "UpdatesReliefType?id=" + activeSetupId;
        var item = {
            "reliefId": $("#listOfReliefsModal").val(),
            "reliefType": $("#typeOfReliefs").val(),
            "status": $("#reliefStatus").val(),
            "rateMultiplier": $("#multiplierCode").val(),
            "notes": $("#addReliefNotes").val(),
            "startDate": $("#startDateReliefModal").val() + "-01-01",
            "endDate": $("#endDateReliefModal").val() + "-12-31",
            "reliefValue": $("#reliefValue").val()
        }

        apiCaller(url, "POST", item, successfullyUpdate);
    }
});