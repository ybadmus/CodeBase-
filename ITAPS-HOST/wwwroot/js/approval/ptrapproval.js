var HeaderName = "PTR Approval";
var serverUrl = $("#serverUrl").val();
var searchTexByTaxOffice = `${serverUrl}api/PTR/GetAllPTRPendingApprovalByTaxOfficeId`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetAppDetailsById = `${serverUrl}api/PTR/GetReliefApplicationDetailsByIdAndType?uniApplicationId=`;
var activeTaxOffice = "";
var selectedStatus;
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;
var loadPtrCodesUrl = `${serverUrl}api/CodesApi/`;
var PtrCodes = [];
var activeApplicationType = "";


$("#ptrListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("ptrListOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
});

var initializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "statusDate", title: "Date", width: '90px' },
            { field: "applicationNo", title: "Application No.", width: '100px' },
            { field: "applicantName", title: "Applicant", width: '25%' },
            { field: "applicantTIN", title: "TIN", width: '15%' },
            { field: "applicationType", title: "Type", width: '25%' },
            {
                command: [{
                    name: "view",
                    template: "<button title='View item' class='btn btn-success btn-sm' style=''><span class='fa fa-file fa-lg'></span></button>"
                }],
                title: "Actions",
                width: "70px"
            }
        ]
    });
};

$(document).ready(function () {
    bootstrapPage();
});

var calculateTwelveMonths = function () {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear() + 1;

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
};

var loadTaxOffices = function (listOfTaxOffices) {
    var output = "";

    listOfTaxOffices.sort((a, b) => (a.taxOfficeName > b.taxOfficeName) - (a.taxOfficeName < b.taxOfficeName));

    output += '<option selected>Choose office</option>';
    for (var i = 0; i < listOfTaxOffices.length; i++) {
        output = output + '<option value="' + listOfTaxOffices[i].taxOfficeId + '" >' + listOfTaxOffices[i].taxOfficeName + '</option>';
    }

    output = output;
    $("#ptrListOfTaxOffices").html(output);
};

var bootstrapPage = function () {
    $("#pgHeader").text(HeaderName);
    $("#ptrDetails").hide();
    $("#ptrGridView").show();

    $("#expiryDateTcc").flatpickr({
        maxDate: calculateTwelveMonths(),
        minDate: 'today'
    });

    initializeKendoGrid();
    loadReliefTypes();

    var userid = $("#userId").val();
    var tccUrl = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    apiCaller(tccUrl, "GET", "", loadTaxOffices);
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
            if (callback) {
                callback(response.body);
            };
            $('html').hideLoading();
        },
        error: function (error) {
            $('html').hideLoading();
            toastr.error('An error occured');
        }
    });
};

var searchTex = function () {
    if (validateSearchEntry()) {
        let searchItem = $("#searchItem").val().trim();
        if (searchItem.includes('/')) {
            for (var i = 0; i < searchItem.length; i++) {
                if (searchItem[i] === '/')
                    replaceAt(searchItem, i, '%2F');
            }
        }

        let url = `${searchTexByTaxOffice}?officeId=` + activeTaxOffice + "&queryString=" + searchItem;
        apiCaller(url, "GET", "", initializeKendoGrid);

    } else {

        toastr.error("Tax office or search item field is empty");
    }
};

var validateSearchEntry = function () {
    let searchItem = $("#searchItem").val().trim();
    if (!searchItem.match(/\S/) || activeTaxOffice === "")
        return false;
    else
        return true;
};

$("#btnSearch").click(function (e) {
    searchTex();
});

$("#searchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTex();
    }
});

$("#reviseApp").click(function (e) {
    $("#approveDecline").modal("show");
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));
    activeApplicationType = item.applicationType;
    // $("#appId").val(item.applicationId);
    // $("#modalId").text(item.applicationNo);
    // $("#appNo").text(item.applicationNo);
    // $("#currentStatus").text(item.statusId);
    // $("#applicantNamePTR").text(item.applicantName);
    // $("#applicantTINPTR").text(item.applicantTIN);

    var ptrCode = ""

    for (var i = 0; i < PtrCodes.length; i++) {
        if (PtrCodes[i].description.toUpperCase().trim() === item.applicationType.toUpperCase().trim()) {
            ptrCode = PtrCodes[i].code.trim();
            break;
        }
    };

    prepareDetailsView(item.applicationId, ptrCode);
    hideAndShow();
});

var prepareDetailsView = function (appId, pCode) {
    let url = `${GetAppDetailsById}` + appId + "&applicationTypeCode=" + pCode;

    loadMessages(appId);
    apiCaller(url, "GET", "", loadPtrDetails);
};

var loadPtrDetails = function (resp) {
    // $("#appIdHeader").text(resp.applicationNo);
    // $("#appNoDetails").text(response.applicationNo);
    // $("#appStatusHeader").text(resp.status);

    // $("#dateSubmittedPTR").text(resp.submittedDate);
    // $("#lastUpdatedPTR").text(resp.statusDate);
    // $("#assessmentYearPTR").text(resp.assessmentYear);
    // $("#dateOfBirthPTR").text(resp.dateOfBirth);
    // $("#employerAddressPTR").text(resp.employerAddress);
    // $("#employerEmailPTR").text(resp.employerEmail);
    // $("#employerNamePTR").text(resp.employerName);
    // $("#employerPhonePTR").text(resp.employerPhone);
    // $("#employerTINPTR").text(resp.employerTIN);
    // $("#endDatePTR").text(resp.endDate);
    // $("#genderPTR").text(resp.gender === "M" ? "Male" : resp.gender === "F" ? "Female" : resp.gender);
    // $("#maritalStatusPTR").text(resp.maritalStatus);
    // $("#mothersMaidenNamePTR").text(resp.mothersMaidenName);
    // $("#phoneNoPTR").text(resp.phoneNo);
    // $("#startDatePTR").text(resp.startDate);
    // $("#appNoTex2").text(resp.applicationNo);


    $("#appIdHeader").text(testNullOrEmpty(resp.applicationNo));
    $("#appNoDetails").text(resp.applicationNo);
    $("#appStatusHeader").text(testNullOrEmpty(resp.status));
    $("#dateSubmittedPTR").text(testNullOrEmpty(resp.submittedDate));
    $("#assessmentYearPTR").text(testNullOrEmpty(resp.assessmentYear));
    $("#dateOfBirthPTR").text(testNullOrEmpty(resp.dateOfBirth));
    $("#applicantNamePTR").text(resp.applicantName);
    $("#applicantTINPTR").text(resp.applicantTIN);
    $("#employerAddressPTR").text(testNullOrEmpty(resp.employerAddress));
    $("#employerEmailPTR").text(testNullOrEmpty(resp.employerEmail));
    $("#employerNamePTR").text(testNullOrEmpty(resp.employerName));
    $("#employerPhonePTR").text(testNullOrEmpty(resp.employerPhone));
    $("#employerTINPTR").text(testNullOrEmpty(resp.employerTIN));
    $("#endDatePTR").text(testNullOrEmpty(resp.endDate));
    $("#genderPTR").text(resp.gender === "M" ? "Male" : resp.gender === "F" ? "Female" : resp.gender);
    $("#maritalStatusPTR").text(testNullOrEmpty(resp.maritalStatus));
    $("#mothersMaidenNamePTR").text(testNullOrEmpty(resp.mothersMaidenName));
    $("#phoneNoPTR").text(testNullOrEmpty(resp.phoneNo));
    $("#startDatePTR").text(testNullOrEmpty(resp.startDate))
    $("#currentStatus").text(resp.statusId);

    if (activeApplicationType.trim() === "Disability Relief") {
        loadDisabilityReliefDetail(resp);
        $("#ptrMarriageReliefDetailsGrid").hide();
        $("#ptrAgedDepedentReliefDetailsGrid").hide();
        $("#ptrOldAgeReliefDetailsGrid").hide();
        $("#ptrChildWardDepedentReliefDetailsGrid").hide();
        $("#texWHTDetailsGrid").hide();
        $("#tccRequestEntityDetailsGrid").hide();
        $("#ptrDisabilityReliefDetailsGrid").show();
    } else if (activeApplicationType.trim() === "Marriage/Responsibility Relief") {
        loadMarriageReliefDetail(resp);
        $("#ptrDisabilityReliefDetailsGrid").hide();
        $("#ptrAgedDepedentReliefDetailsGrid").hide();
        $("#ptrOldAgeReliefDetailsGrid").hide();
        $("#ptrChildWardDepedentReliefDetailsGrid").hide();
        $("#texWHTDetailsGrid").hide();
        $("#tccRequestEntityDetailsGrid").hide();
        $("#ptrMarriageReliefDetailsGrid").show();
    } else if (activeApplicationType.trim() === "Aged Dependants Relief") {
        loadAgedDependentReliefDetail(resp);
        $("#ptrDisabilityReliefDetailsGrid").hide();
        $("#ptrMarriageReliefDetailsGrid").hide();
        $("#ptrOldAgeReliefDetailsGrid").hide();
        $("#ptrChildWardDepedentReliefDetailsGrid").hide();
        $("#texWHTDetailsGrid").hide();
        $("#tccRequestEntityDetailsGrid").hide();
        $("#ptrAgedDepedentReliefDetailsGrid").show();
    } else if (activeApplicationType.trim() === "Old Age Relief") {
        loadOldAgeReliefDetail(resp);
        $("#ptrDisabilityReliefDetailsGrid").hide();
        $("#ptrMarriageReliefDetailsGrid").hide();
        $("#ptrAgedDepedentReliefDetailsGrid").hide();
        $("#ptrChildWardDepedentReliefDetailsGrid").hide();
        $("#texWHTDetailsGrid").hide();
        $("#tccRequestEntityDetailsGrid").hide();
        $("#ptrOldAgeReliefDetailsGrid").show();
    } else if (activeApplicationType.trim() === "Child/Ward Education Relief") {
        loadChildWardDependentRelief(resp);
        $("#ptrDisabilityReliefDetailsGrid").hide();
        $("#ptrMarriageReliefDetailsGrid").hide();
        $("#ptrAgedDepedentReliefDetailsGrid").hide();
        $("#ptrOldAgeReliefDetailsGrid").hide();
        $("#texWHTDetailsGrid").hide();
        $("#tccRequestEntityDetailsGrid").hide();
        $("#ptrChildWardDepedentReliefDetailsGrid").show();
    }
};

var loadReliefTypes = function () {
    var url = `${loadPtrCodesUrl}APT`;

    apiCaller(url, "GET", "", ptrCodesFlow);
};

var ptrCodesFlow = function (resp) {
    PtrCodes = resp;
};

var hideAndShow = function () {
    $("#ptrDetails").show();
    $("#ptrGridView").hide();
};

var loadMessages = function (tccId) {

    let url = `${GetTccCommentsByIdUrl}` + tccId;

    apiCaller(url, "GET", "", appendMessages)
};

$("#backToGrid").click(function () {
    backToView();
});

var backToView = function () {

    $("#ptrDetails").hide();
    $("#ptrGridView").show();
};

$("#approveDeclineReturnBtn").click(function () {

    if (selectedStatus == 2) {

        approvePTR();

    } else {

        let tccId = $("#appId").val();
        let updateUrl = tccUpdateUrl + tccId;

        let ObjectToSend = {
            "status": selectedStatus,
            "taxpayerComment": $("#taxpayerMessage").val(),
            "internalComment": $("#internalMessage").val(),
            "applicationId": tccId
        };

        apiCaller(updateUrl, "PUT", ObjectToSend, successfullyUpdated);
    };
});

var approvePTR = function () {
    let tccId = $("#appId").val();
    let updateUrl = tccUpdateUrl + tccId;

    let ObjectToSend = {
        "status": selectedStatus,
        "taxpayerComment": $("#taxpayerMessage").val(),
        "internalComment": $("#internalMessage").val(),
        "applicationId": tccId,
        "expiryDate": calculateTwelveMonths()
    };

    apiCaller(updateUrl, "PUT", ObjectToSend, successfullyUpdated);
};

$("#continueApproval").click(function () {
    approvePTR();
});

var backToGrid = function () {
    setTimeout(function () {
        window.location.href = `${serverUrl}approval/ptrapproval`;
    }, 3000);
};

var loadOldAgeReliefDetail = function(resp) {
    $("#oldAgeDocIssueBy").text(testNullOrEmpty(resp[0].birthCertIssueBy));
    $("#oldAgeDocIssueNo").text(testNullOrEmpty(resp[0].birthCertIssueNo));
    $("#oldAgeDocSignedBy").text(testNullOrEmpty(resp[0].birthCertSignedBy));
    $("#oldAgeDocIssueDate").text(testNullOrEmpty(resp[0].birthCertIssuingDate));
    $("#oldAgeReliefBirthDoc").attr("href", resp[0].birthCertDocument);
};

var loadAgedDependantReliefModal = function(resp) {
    $("#agedDependentFullName").text(testNullOrEmpty(resp.firstName + " " + resp.middleName + " " + resp.lastName));
    $("#agedDependentDOB").text(testNullOrEmpty(resp.agedDateOfBirth));
    $("#agedDependentGender").text(testNullOrEmpty(resp.gender === "M" ? "Male" : "Female"));
    $("#agedDependentMStatus").text(testNullOrEmpty(resp.maritalStatus));
    $("#agedDependentbirthCertIssueBy").text(testNullOrEmpty(resp.birthCertIssueBy));
    $("#agedDependentbirthCertIssueDate").text(testNullOrEmpty(resp.certIssuingDate));
    $("#agedDependentbirthCertSignedBy").text(testNullOrEmpty(resp.birthCertSignedBy));
    $("#agedDependentBirthCertDocument").attr("href", resp.birthCertDocument);

    $("#dependentDetails").modal("show");
};

var loadChildWardDependantReliefModal = function(resp) {
    $("#childDependentFullName").text(testNullOrEmpty(resp.firstName + " " + resp.middleName + " " + resp.lastName));
    $("#childDependentSchoolName").text(testNullOrEmpty(resp.schoolName));
    $("#childDependentDateOfAdmission").text(testNullOrEmpty(resp.dateOfAdmission));
    $("#childDependentDOB").text(testNullOrEmpty(resp.childDateOfBirth));
    $("#childDependentadmissionReferenceNo").text(testNullOrEmpty(resp.admissionReferenceNo));
    $("#childDependentBirthCertDocument").attr("href", resp.birthCertDocument);
    $("#childDependentBirthCertIssueNo").text(testNullOrEmpty(resp.birthCertIssueNo));
    $("#childDependentBirthCertIssueDate").text(testNullOrEmpty(resp.birthCertIssueDate));
    $("#childDependentBirthCertIssueBy").text(testNullOrEmpty(resp.birthCertIssueBy));
    $("#achildDependentBirthCertSignedBy").text(testNullOrEmpty(resp.birthCertSignedBy));

    $("#childDependentDetails").modal("show");
};

var loadChildWardDependentRelief = function (resp) {
    let output = "";
    var dependants = resp[0].childDetails.sort(function (a, b) {
        return (a.firstName - b.firstName);
    });

    for (var i = 0; i < dependants.length; i++) {
        output = output + '<tr><td align="">' + dependants[i].firstName + " " + dependants[i].middleName + " " + dependants[i].lastName + '</td>'
            + '<td align="" style="color: black">' + dependants[i].childDateOfBirth + '</td>'
            + '<td align="center" style="color: black">' + dependants[i].schoolName + '</td>'
            + '<td><button style="padding: 4px 8px;" onclick="previewChildDependent(this)" id="' + dependants[i].dependantId +
            '" title="View item" class="btn btn-success btn-sm btnReturnDetail"><span class="fa fa-file fa-lg"></span></button></td>';
    }

    output = output;
    $("#listOfChildWardDependents").html(output);
    sessionStorage.setItem("listOfChildWardDependents", JSON.stringify(resp));
};

var loadAgedDependentReliefDetail = function (resp) {
    let output = "";
    var dependants = resp[0].agedDepandantsDetails.sort(function (a, b) {
        return (a.firstName - b.firstName);
    });

    for (var i = 0; i < dependants.length; i++) {
        output = output + '<tr><td align="">' + dependants[i].firstName + " " + dependants[i].middleName + " " + dependants[i].lastName + '</td>'
            + '<td align="" style="color: black">' + dependants[i].agedDateOfBirth + '</td>'
            + '<td align="center" style="color: black">' + dependants[i].gender + '</td>'
            + '<td align="center" style="color: black">' + dependants[i].maritalStatus + '</td>'
            + '<td><button style="padding: 4px 8px;" onclick="previewDependent(this)" id="' + dependants[i].dependentId +
            '" title="View item" class="btn btn-success btn-sm btnReturnDetail"><span class="fa fa-file fa-lg"></span></button></td>';
    }

    output = output;
    $("#listOfAgedDependents").html(output);
    sessionStorage.setItem("listOfAgedDependents", JSON.stringify(resp));
};

var previewChildDependent = function (rowInfo) {
    var appDetail = JSON.parse(sessionStorage.getItem("listOfChildWardDependents"));
    var dependants = appDetail[0].childDetails;
    for(var i = 0; i < dependants.length; i++) {
        if (dependants[i].dependantId === rowInfo.id) {
            return loadChildWardDependantReliefModal(dependants[i]);
        }
    }
}

var previewDependent = function (rowInfo) {
    var appDetail = JSON.parse(sessionStorage.getItem("listOfAgedDependents"));
    var dependants = appDetail[0].agedDepandantsDetails;
    for(var i = 0; i < dependants.length; i++) {
        if (dependants[i].dependentId === rowInfo.id) {
            return loadAgedDependantReliefModal(dependants[i]);
        }
    }
};


var loadMarriageReliefDetail = function (resp) {
    $("#marriageDetailsCertDoc").attr("href", resp[0].certDocument)
    $("#certIssuingDateMar").text(testNullOrEmpty(resp[0].certIssuingDate));
    $("#spouseEmailMar").text(testNullOrEmpty(resp[0].spouseEmail));
    $("#spouseTIN").text(testNullOrEmpty(resp[0].spouseTIN));
    $("#spousePhone").text(testNullOrEmpty(resp[0].spousePhone));
    $("#spouseDateOfBirth").text(testNullOrEmpty(resp[0].spouseDateOfBirth));
    $("#spouseGender").text(testNullOrEmpty(resp[0].spouseGender === "F" ? "Female" : "Male"));
    $("#registrationDate").text(testNullOrEmpty(resp[0].registrationDate));
    $("#certIssuedBy").text(testNullOrEmpty(resp[0].certIssuedBy));
    $("#certIssueNo").text(testNullOrEmpty(resp[0].certIssueNo));
    $("#certSignedBy").text(testNullOrEmpty(resp[0].certSignedBy));
    $("#nameOfGender").text(testNullOrEmpty(resp[0].spouseFirstName + " " + resp[0].spouseMiddleName + " " + resp[0].spouseLastName));
};

var loadDisabilityReliefDetail = function (resp) {
    $("#typeOfDisability").text(testNullOrEmpty(resp[0].typeOfDisability));
    $("#disabilityDisclosureDate").text(testNullOrEmpty(resp[0].disabilityDisclosureDate));
    $("#disabilityDoc").attr("href", resp[0].disabilityDoc)
    $("#disabilityDocIssueBy").text(testNullOrEmpty(resp[0].disabilityDocIssueBy));
    $("#disabilityDocIssueNo").text(testNullOrEmpty(resp[0].disabilityDocIssueNo));
    $("#disabilityDocSignedBy").text(testNullOrEmpty(resp[0].disabilityDocSignedBy));
};