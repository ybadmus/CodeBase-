ej.grids.Grid.Inject(ej.grids.Page, ej.grids.Sort, ej.grids.Filter, ej.grids.Group);

var HeaderName = "Re-assign Applications in Bulk";
var serverUrl = $("#serverUrl").val();
var searchNewApplications = `${serverUrl}api/TCC/GetAllAssignedApplicationsToReassign`;
var assignTccApplication = `${serverUrl}api/TCC/ReAssignApplication`;
var GetTCCDocuments = `${serverUrl}api/TCC/GetTCCApplicationDocumentByApplicationId`;
var loadPtrCodesUrl = `${serverUrl}api/CodesApi/`;
var activeTaxOffice = "";
var activeOfficer = "";
var activeOfficerName = "";
var gridGlobal = "";
var currentRecord = "";

$("#listOfTaxOffices").on('change', function () {
    var elem = document.getElementById("listOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
});

$("#assignOfficer").on('change', function () {
    var elem = document.getElementById("assignOfficer");
    activeOfficer = elem.options[elem.selectedIndex].value;
    activeOfficerName = elem.options[elem.selectedIndex].text;
});

$(document).ready(function () {
    initializeGrid([]);
    $("#pgHeader").text(HeaderName);
});

$("#assApplication").click(function (e) {
    $("#assign-update").modal("show");
    prepareAssignmentModal();
});

var initializeGrid = function (data) {
    document.getElementById("Grid").innerHTML = "";

    var grid = new ej.grids.Grid({
        dataSource: data,
        selectionSettings: { enableToggle: true, checkboxOnly: true },
        columns: [
            { type: 'checkbox', width: 30 },
            { field: 'applicationNo', headerText: 'Application No.', width: 80 },
            { field: 'assignedTo', headerText: 'Assigned To', width: 100,},
            { field: 'applicantName', headerText: 'Applicant', width: 100 },
            { field: 'applicantTIN', headerText: 'TIN', width: 60 },
            { field: 'applicationType', headerText: 'Application Type', width: 100 },
            { field: 'status', headerText: 'Status', width: 100 }
        ],
        height: 350,
        pageSettings: { pageSize: 10 },
        allowGrouping: false,
        allowPaging: true,
        allowSorting: true,
        allowFiltering: true,
        filterSettings: { type: 'Menu' },
        rowSelected: rowSelected,
    });

    grid.appendTo('#Grid');
    gridGlobal = grid;
};

function rowSelected(args) {
    var selectedrecords = gridGlobal.getSelectedRecords();
    if (selectedrecords.length > 0)
        $("#assApplication").show();
}

var prepareAssignmentModal = function () {
    var url = `${serverUrl}api/Users/GetOffTaxOfficerId?taxOfficeId=` + activeTaxOffice;
    apiCaller(url, "GET", "", loadOfficers)
};

var loadOfficers = function (listOfOfficers) {
    var output = "";

    listOfOfficers.sort((a, b) => (a.name > b.name) - (a.name < b.name));

    output += '<option selected>Choose officer</option>';
    for (var i = 0; i < listOfOfficers.length; i++) {
        output = output + '<option name="' + listOfOfficers[i].name + '" value="' + listOfOfficers[i].userId + '" >' + listOfOfficers[i].name + " (" + listOfOfficers[i].level + ') </option>';
    }

    output = output;
    $("#assignOfficer").html(output);
};

$("#assign-update").on('hidden.bs.modal', function () {
    document.getElementById("assignOfficer").selectedIndex = 0;
    document.getElementById("assignNotes").value = "";
    activeOfficer = "";
});

$("#btnSearch").click(function (e) {
    searchTcc();
});

$("#searchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTcc();
    }
});

$("#Grid").click(function () {
    setTimeout(function () {
        var selectedrecords = gridGlobal.getSelectedRecords();
        if (selectedrecords.length <= 0)
            $("#assApplication").hide();
    }, 250)
});

$("#assignNotes").keyup(function () {
    fieldValidatorAssign();
});

$("#assignOfficer").change(function () {
    fieldValidatorAssign();
});

var searchTcc = function () {
    if (validateSearchEntry()) {
        var newAppsStatus = 0;
        var searchItem = $("#searchItem").val().trim();
        if (searchItem.includes('/')) {
            for (var i = 0; i < searchItem.length; i++) {
                if (searchItem[i] === '/')
                    replaceAt(searchItem, i, '%2F');
            }
        }

        var url = `${searchNewApplications}?officeId=` + activeTaxOffice + "&status=" + newAppsStatus + "&searchitem=" + searchItem;
        apiCaller(url, "GET", "", initializeGrid);
    } else {

        toastr.error("Tax office or search item field is empty");
    }
};

var fieldValidatorAssign = function () {
    if (activeOfficer && ($("#assignNotes").val().match(/\S/)) && lengthOfNotes()) {

        $("#assignApplication").attr("disabled", false);
    } else {
        $("#assignApplication").attr("disabled", true);
    }
};

$("#assignApplication").click(function () {

    var selectedrecords = gridGlobal.getSelectedRecords();
    var output = "[ ";

    for (var i = 0; i < selectedrecords.length; i++) {
        output += '<b><span>' + selectedrecords[i].applicationNo + '</span></b> - <span>' + selectedrecords[i].applicationType + '</span>, ';
    }
    output += " ]";

    $("#listOfAssignedApplications").html(output);

    $("#selectedOfficer").text(activeOfficerName);
    $("#yesOrNo").modal("show");
});

var lengthOfNotes = function () {
    var content = $("#assignNotes").val().trim();

    if (content.length > 5) {
        return true;
    } else {
        return false;
    }
};

var assignApplication = function () {
    var objData = [];
    var selectedrecords = gridGlobal.getSelectedRecords();

    for (var i = 0; i < selectedrecords.length; i++) {
        var obj = {
            "applicationId": selectedrecords[i].applicationId,
            "notes": $("#assignNotes").val(),
            "personnelId": activeOfficer
        }
        objData.push(obj);
    }

    apiCaller(assignTccApplication, "PUT", objData, callBackFunc);
};

$("#yesBtn").click(function () {
    assignApplication();
});

var callBackFunc = function () {
    var selectedRecords = gridGlobal.getSelectedRecords();
    var dataSource = gridGlobal.dataSource;

    for (var i = 0; i < dataSource.length; i++) {
        for (var j = 0; j < selectedRecords.length; j++) {
            if (dataSource[i].applicationId === selectedRecords[j].applicationId)
                dataSource.splice(i, 1);
        }
    };

    initializeGrid(dataSource);

    $('#assign-update').modal('hide');
    $('#yesOrNo').modal('hide');
    $("#assApplication").hide();

    toastr.success("Applications successfully assigned");
};
