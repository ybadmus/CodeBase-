var HeaderName = "Assign Application";
var serverUrl = $("#serverUrl").val();
var searchNewApplications = `${serverUrl}api/TCC/GetAppByOfficeTypeAndStatus`;
var assignTccApplication = `${serverUrl}api/TCC/PostAssignApplication`;
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetTccByIdUrl = `${serverUrl}api/TCC/GetTccApplicationById?tccId=`;
var GetTCCDocuments = `${serverUrl}api/TCC/GetTCCApplicationDocumentByApplicationId`;
var loadPtrCodesUrl = `${serverUrl}api/CodesApi/`;
var activeTaxOffice = "";
var activeOfficer = "";
var activeOfficerName = "";
var grid = "";
var item = "";
var activeApplicationType = "";

$("#listOfTaxOffices").on('change', function () {
    var elem = document.getElementById("listOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
});

$("#assignOfficer").on('change', function () {
    var elem = document.getElementById("assignOfficer");
    activeOfficer = elem.options[elem.selectedIndex].value;
    activeOfficerName = elem.options[elem.selectedIndex].text;
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

var bootstrapPage = function () {
    setTitles();
};

var setTitles = function () {
    $("#pgHeader").text(HeaderName);
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
    $("#assign-update").modal("show");
    prepareAssignmentModal();
});

var prepareModal = function (item) {
    $("#appId").val(item.applicationId);
    $("#appTypeId").val(item.applicationTypeId);
    $(".modalId").text(testNullOrEmpty(item.applicationNo));
    $(".applicationType").text(item.applicationType);
    activeApplicationType = item.applicationType;

    if (item.applicationType.toUpperCase().trim() === "TCC".toUpperCase())
        prepareDetailsViewTCC();
    if (item.applicationType.toUpperCase().trim() === "WHT Exemption".toUpperCase())
        prepareDetailsViewTEX();
    if (item.applicationType.toUpperCase().trim() === "Disability Relief".toUpperCase()
        || item.applicationType.toUpperCase().trim() === "Aged Dependants Relief".toUpperCase()
        || item.applicationType.toUpperCase().trim() === "Old Age Relief".toUpperCase()
        || item.applicationType.toUpperCase().trim() === "Pension Relief".toUpperCase()
        || item.applicationType.toUpperCase().trim() === "Marriage/Responsibility Relief".toUpperCase()
        || item.applicationType.toUpperCase().trim() === "Child/Ward Education Relief".toUpperCase()) {
        prepareDetailsViewPTR();
        $("#applicantNamePTR").text(item.applicantName);
        $("#applicantFName").text(item.applicantName);
        $("#applicantTINPTR").text(item.applicantTIN);
    }
};

var prepareAssignmentModal = function () {
    var url = `${serverUrl}api/Users/GetOffTaxOfficerId?taxOfficeId=` + activeTaxOffice;
    apiCaller(url, "GET", "", loadOfficers)
};

var loadReliefTypes = function () {
    var url = `${loadPtrCodesUrl}APT`;

    return apiCaller(url, "GET", "", ptrCodes);
};

var ptrCodes = function (resp) {
    sessionStorage.setItem("ptrCodes", JSON.stringify(resp));
}

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
        var url = `${searchNewApplications}?officeId=` + activeTaxOffice + "&status=" + newAppsStatus + "&searchitem=" + searchItem;
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
    document.getElementById("assignOfficer").selectedIndex = 0;
    document.getElementById("assignNotes").value = "";
    activeOfficer = "";
});

$("#yesBtn").click(function () {
    assignApplication();
});

$("#assignApplication").click(function () {
    $("#apType").text(activeApplicationType);
    $("#selectedOfficer").text(activeOfficerName);
    $("#yesOrNo").modal("show");
});

$("#assignNotes").keyup(function () {
    fieldValidatorAssign();
});

$("#assignOfficer").change(function () {
    fieldValidatorAssign();
});

var hideAndShowThingsPTR = function () {
    $("#gridView").hide();
    $("#ptrDetailsGrid").show();
    $("#tccDetailsGrid").hide();
    $("#texDetailsGrid").hide();

    $("#detailsView").show();
};

var hideAndShowTEXThings = function () {
    $("#gridView").hide();
    $("#ptrDetailsGrid").hide();
    $("#tccDetailsGrid").hide();
    $("#ptrDisabilityReliefDetailsGrid").hide();
    $("#ptrMarriageReliefDetailsGrid").hide();
    $("#ptrAgedDepedentReliefDetailsGrid").hide();
    $("#ptrOldAgeReliefDetailsGrid").hide();
    $("#ptrChildWardDepedentReliefDetailsGrid").hide();
    $("#tccRequestEntityDetailsGrid").hide();

    $("#texWHTDetailsGrid").show();
    $("#detailsView").show();
    $("#texDetailsGrid").show();
};

var hideAndShowThings = function () {
    $("#gridView").hide();
    $("#texDetailsGrid").hide();
    $("#ptrDetailsGrid").hide();
    $("#ptrDisabilityReliefDetailsGrid").hide();
    $("#ptrMarriageReliefDetailsGrid").hide();
    $("#ptrAgedDepedentReliefDetailsGrid").hide();
    $("#ptrOldAgeReliefDetailsGrid").hide();
    $("#ptrChildWardDepedentReliefDetailsGrid").hide();
    $("#texWHTDetailsGrid").hide();

    $("#tccRequestEntityDetailsGrid").show();
    $("#detailsView").show();
    $("#tccDetailsGrid").show();
};

$("#backToGrid").click(function () {
    backToViewAssign();
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

var prepareDetailsViewPTR = function () {
    hideAndShowThingsPTR();
    loadMessages();
    loadDetailsViewPtr();
    getTccDocumentsById();
};

var fieldValidatorAssign = function () {
    if (activeOfficer && ($("#assignNotes").val().match(/\S/)) && lengthOfNotes()) {

        $("#assignApplication").attr("disabled", false);
    } else {
        $("#assignApplication").attr("disabled", true);
    }
};

var lengthOfNotes = function () {
    var content = $("#assignNotes").val().trim();

    if (content.length > 5) {
        return true;
    } else {
        return false;
    }
};

var assignApplication = function () {
    var objData = [{
        "applicationId": $("#appId").val(),
        "notes": $("#assignNotes").val(),
        "assignerId": "",
        "personnelId": activeOfficer
    }];

    apiCaller(assignTccApplication, "POST", objData, callBackFunc);
};

var callBackFunc = function () {
    var appNo = $("#modalId").text();
    var tccId = $("#appId").val();
    var url = tccUpdateUrl + tccId;

    var ObjectToSend = {
        "status": 0,
        "taxpayerComment": `Your ${activeApplicationType} application - ${appNo} has been assigned to a GRA official for processing.`,
        "internalComment": $("#assignNotes").val(),
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