var HeaderName = "Assign Application";
var serverUrl = $("#serverUrl").val();
var searchNewTccApplications = `${serverUrl}api/TCC/GetAppByOfficeTypeAndStatus`;
var assignTccApplication = `${serverUrl}api/TCC/PostAssignApplication`;
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;
var activeTaxOffice = "";
var activeOfficer = "";
var grid = "";
var item = "";

var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetTccByIdUrl = `${serverUrl}api/TCC/GetTccApplicationById?tccId=`;
var GetTCCDocuments = `${serverUrl}api/TCC/GetTCCApplicationDocumentByApplicationId`;
var ReportDownloadView = `${serverUrl}applications/certificate`;
var activeTaxOffice = "";
var appType = "TCC";


$("#listOfOffices").on('change', function () {
    var elem = document.getElementById("listOfOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
});

$("#assignOfficer").on('change', function () {
    var elem = document.getElementById("assignOfficer");
    activeOfficer = elem.options[elem.selectedIndex].value;
    var activeOfficerName = elem.options[elem.selectedIndex].text;
    $("#selectedOfficer").text(activeOfficerName);
});

var initializeKendoGrid = function (data, stage) {
    if (data) {
        if (data.length == 0 && stage !== 1) {
            return toastr.info("No Data");
        };

        $("#Grid").kendoGrid({
            dataSource: { data: data, pageSize: 8 },
            sortable: true,
            selectable: true,
            dataBound: onDataBound,
            pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
            columns: [
                { field: "submittedDate", title: "Date", width: '90px', format: "{0:MM-dd-yyyy}" },
                { field: "applicationNo", title: "Application No.", width: '12%' },
                { field: "applicantName", title: "Applicant", width: '20%' },
                { field: "applicantTIN", title: "TIN", width: '20%' },
                { field: "applicationType", title: "Application Type", width: '20%' },
                {
                    command: [{
                        name: "view",
                        template: "<button title='View item' class='btn btn-success btn-sm' style='margin-right: 2px'><span class='fa fa-file fa-lg'></span></button>"
                    }],
                    title: "Action",
                    width: "90px"
                }
            ]
        });
    }
};

var onDataBound = function () {

};

var apiCaller = function (url, type, data, callback) {
    $('html').showLoading();

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
                callback(response.body);
            };
        },
        error: function () {
            $('html').hideLoading();
            toastr.error('An error occured');
        }
    });
};

var validateSearchEntry = function () {
    let searchItem = $("#searchItem").val().trim();
    if (!searchItem.match(/\S/) || activeTaxOffice === "")
        return false;
    else
        return true;
};

var bootstrapPage = function () {
    setTitles();
    var userid = $("#userId").val(); //save in layout file
    var taxOfficeUrl = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    apiCaller(taxOfficeUrl, "GET", "", loadTaxOffices);
};

var setTitles = function () {
    $("#pgHeader").text(HeaderName);
};

var loadTaxOffices = function (listOfTaxOffices) {
    var output = "";

    listOfTaxOffices.sort((a, b) => (a.taxOfficeName > b.taxOfficeName) - (a.taxOfficeName < b.taxOfficeName));

    output += '<option selected>Choose office</option>';
    for (var i = 0; i < listOfTaxOffices.length; i++) {
        output = output + '<option value="' + listOfTaxOffices[i].taxOfficeId + '" >' + listOfTaxOffices[i].taxOfficeName + '</option>';
    }

    output = output;
    $("#listOfOffices").html(output);
};

$(document).ready(function () {
    initializeKendoGrid([], 1);
    bootstrapPage();
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {

    if (!activeTaxOffice)
        return toastr.error("Please select a tax office");

    grid = $("#Grid").getKendoGrid();
    item = grid.dataItem($(e.target).closest("tr"));
    prepareModal(item);
});

$("#assApplication").click(function (e) {
    $("#assign-update").modal("show")
});

var prepareModal = function (item) {

    $("#apNo").text(item.applicationNo);
    $("#apType").text(item.applicationType);
    $("#appTypeId").val(item.applicationTypeId);
    $("#appId").val(item.applicationId);
    $("#modalId").text(testNullOrEmpty(item.applicationNo));
    

    if (item.applicationType === "TCC")
        prepareDetailsViewTCC();
    if (item.applicationType === "WHT Exemption")
        prepareDetailsViewTEX();

    var url = `${serverUrl}api/Users/GetOffTaxOfficerId?taxOfficeId=` + activeTaxOffice;
    apiCaller(url, "GET", "", loadOfficers)
};

var testNullOrEmpty = function (value) {
    if (!value || value === "null") {
        return "N/A";
    } else
        return value;
};

var loadOfficers = function (listOfOfficers) {
    var output = "";

    listOfOfficers.sort((a, b) => (a.name > b.name) - (a.name < b.name));

    output += '<option selected>Choose officer</option>';
    for (var i = 0; i < listOfOfficers.length; i++) {
        output = output + '<option name="' + listOfOfficers[i].name + '" value="' + listOfOfficers[i].userId + '" >' + listOfOfficers[i].name + '</option>';
    }

    output = output;
    $("#assignOfficer").html(output);
};

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

        $("#Grid").data("kendoGrid").dataSource.data([]);
        var url = `${searchNewTccApplications}?officeId=` + activeTaxOffice + "&status=" + newAppsStatus + "&searchitem=" + searchItem;
        apiCaller(url, "GET", "", initializeKendoGrid);
    } else {

        toastr.error("Tax office or search item field is empty");
    }
}

$("#btnSearch").click(function (e) {
    searchTcc();
});

$("#searchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTcc();
    }
});

$("#assign-update").on('hidden.bs.modal', function () {
    document.getElementById("#listOfOffices").selectedIndex = 0;
    document.getElementById("#assignOfficer").selectedIndex = 0;
    activeOfficer = "";
    $("#internalMessage").val("");
});

$("#yesBtn").click(function () {
    assignApplication();
});

$("#assignApplication").click(function () {
    $("#yesOrNo").modal("show");
});

$("#internalMessage").keyup(function () {
    fieldValidatorAssign();
});

$("#assignOfficer").change(function () {
    fieldValidatorAssign();
});

var hideAndShowTEXThings = function () {
    $("#gridView").hide();
    $("#detailsView").show();
    $("#ptrDetailsGrid").hide();
    $("#tccDetailsGrid").hide();
    $("#texDetailsGrid").show();
};

var hideAndShowThings = function () {
    $("#gridView").hide();
    $("#detailsView").show();
    $("#ptrDetailsGrid").hide();
    $("#tccDetailsGrid").show();
    $("#texDetailsGrid").hide();
};

$("#backToGrid").click(function () {
    backToView();
});

var backToViewAssign = function () {
    $("#gridView").show();
    $("#detailsView").hide();
    $("#assignApplication").hide();
};

var prepareDetailsViewTCC = function () {

    hideAndShowThings();
    loadMessages();
    loadDetailsView();
    getTccDocumentsById();
};

var prepareDetailsViewTEX = function () {
    hideAndShowTEXThings();
    loadMessages();
    loadDetailsViewTex();
    getTccDocumentsById();
};

var fieldValidatorAssign = function () {
    if (activeOfficer && ($("#internalMessage").val().match(/\S/)) && lengthInternalMessage()) {

        $("#assignApplication").attr("disabled", false);
    } else {
        $("#assignApplication").attr("disabled", true);
    }
};

var lengthInternalMessage = function () {
    var content = $("#internalMessage").val().trim();

    if (content.length > 5) {
        return true;
    } else {
        return false;
    }
};

var assignApplication = function () {
    var objData = [{
        "applicationId": $("#appId").val(),
        "notes": $("#internalMessage").val(),
        "assignerId": "",
        "personnelId": activeOfficer
    }];

    apiCaller(assignTccApplication, "POST", objData, callBackFunc);
};

var callBackFunc = function () {
    
    updateApplicationToProcessing();
};

var updateApplicationToProcessing = function () {
    var appNo = $("#modalId").text();
    var tccId = $("#appId").val();
    var url = tccUpdateUrl + tccId;

    var ObjectToSend = {
        "status": 1,
        "taxpayerComment": `Your application - ${ appNo } has been assigned to a GRA official for processing`,
        "internalComment": $("#internalMessage").val(),
        "applicationId": $("#appId").val()
    };

    apiCaller(url, "PUT", ObjectToSend, removeItemFromGrid);
};

var removeItemFromGrid = function () {
    toastr.success("Application successfully assigned");
    grid.dataSource.remove(item);
    $('#assign-update').modal('hide');
    $('#yesOrNo').modal('hide');
    backToViewAssign();
};