var openDivForTab = function (evt, divId) {
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");

    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(divId).style.display = "block";
    evt.currentTarget.className += " active";
};

var loadMessages = function () {
    let tccId = $("#appId").val();
    let url = `${GetTccCommentsByIdUrl}` + tccId;

    apiCaller(url, "GET", "", appendApplicantMessages)
};

var loadDetailsView = function () {
    let appId = $("#appId").val();
    let appTypeId = $("#appTypeId").val();

    if (appTypeId === "")
        appTypeId = "870301ea-f62e-4788-9905-7c94a26813d3";
        
    let url = `${GetTccByIdUrl}` + appId + `&appTypeId=${appTypeId}`;

    apiCaller(url, "GET", "", loadDetails)
};

var loadDetailsViewTex = function () {
    let appId = $("#appId").val();
    let appTypeId = $("#appTypeId").val();

    if (appTypeId === "")
        appTypeId = "870301ea-f62e-4788-9905-7c94a26813d3";
    let url = `${GetTccByIdUrl}` + appId + `&appTypeId=${appTypeId}`;

    apiCaller(url, "GET", "", loadDetailsTex)
};

var loadDetailsViewPtr = function () {
    let appId = $("#appId").val();
    let appTypeId = $("#appTypeId").val();

    if (appTypeId === "")
        appTypeId = "870301ea-f62e-4788-9905-7c94a26813d3";
    let url = `${GetTccByIdUrl}` + appId + `&appTypeId=${appTypeId}`;

    apiCaller(url, "GET", "", loadDetailsPtr)
};

var getTccDocumentsById = function () {
    let tccId = $("#appId").val();
    let url = `${GetTCCDocuments}?id=` + tccId;

    apiCaller(url, "GET", "", appendDocumentsToTable)
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

var loadDetails = function (resp) {
    decideNextTccStage(resp[0].statusId);

    $("#dateSubmitted").text(testNullOrEmpty(resp[0].submittedDate));
    $("#applicantName").text(testNullOrEmpty(resp[0].applicantName));
    $("#applicantFName").text(testNullOrEmpty(resp[0].applicantName));
    $("#applicantTIN").text(testNullOrEmpty(resp[0].applicantTIN));
    $("#applicantPhone").text(testNullOrEmpty(resp[0].applicantPhoneNo));
    $("#applicantEmail").text(testNullOrEmpty(resp[0].applicantEmailAddress));
    $("#requestEntityName").text(testNullOrEmpty(resp[0].requestingEntity));
    $("#requestingEntityTin").text(testNullOrEmpty(resp[0].requestingOfficeTIN));
    $("#requestingEntityPhone").text(testNullOrEmpty(resp[0].requestingOfficePhone));
    $("#requestingEntityEmail").text(testNullOrEmpty(resp[0].requestingOfficeEmail));
    $("#purposeOfApplication").text(testNullOrEmpty(resp[0].purpose));
    $("#remarkOfApplication").text(testNullOrEmpty(resp[0].remarks));
    $(".applicationTaxOffice").text(testNullOrEmpty(resp[0].taxOffice));

    $("#appIdHeader").text(testNullOrEmpty(resp[0].applicationNo));
    $("#appStatusHeader").text(testNullOrEmpty(resp[0].status));
    $("#modalId").text(testNullOrEmpty(resp[0].applicationNo));
    $("#statusNameModal").text(testNullOrEmpty(resp[0].status));
    $("#currentStatus").text(resp[0].statusId);
    $("#taxpayerId").text(testNullOrEmpty(resp[0].taxpayerId));
};

var loadDetailsTex = function (resp) {
    decideNextTccStage(resp[0].statusId);

    $("#dateSubmittedTex").text(testNullOrEmpty(resp[0].submittedDate));
    $("#applicantNameTex").text(testNullOrEmpty(resp[0].applicantName));
    $("#applicantFName").text(testNullOrEmpty(resp[0].applicantName));
    $("#applicantTINTex").text(testNullOrEmpty(resp[0].applicantTIN));
    $("#applicantPhoneTex").text();
    $("#applicantEmailTex").text(testNullOrEmpty(resp[0].email));
    $("#residentialStatus").text(testNullOrEmpty(resp[0].residentialStatus));
    $("#whtType").text(testNullOrEmpty(resp[0].typeOfWithHolding));
    $("#whtReason").text(testNullOrEmpty(resp[0].reasons));
    $("#whtRemarks").text(testNullOrEmpty(resp[0].remarks));
    $("#applicantPhoneTex").text(testNullOrEmpty(resp[0].phoneNo));
    $(".applicationTaxOffice").text(testNullOrEmpty(resp[0].taxOffice));

    $("#appIdHeader").text(testNullOrEmpty(resp[0].applicationNo)); 
    $("#appStatusHeader").text(testNullOrEmpty(resp[0].status));
    $("#modalId").text(testNullOrEmpty(resp[0].applicationNo));
    $("#statusNameModal").text(testNullOrEmpty(resp[0].status));
    $("#currentStatus").text(resp[0].statusId);
    $("#taxpayerId").text(testNullOrEmpty(resp[0].applicantId));
 };

 var loadDetailsPtr = function (resp) {
    decideNextTccStage(resp[0].statusId);

    $("#appIdHeader").text(testNullOrEmpty(resp[0].applicationNo));
    $("#appStatusHeader").text(testNullOrEmpty(resp[0].status));
    $("#modalId").text(testNullOrEmpty(resp[0].applicationNo));
    $("#statusNameModal").text(testNullOrEmpty(resp[0].status));
    $("#dateSubmittedPTR").text(testNullOrEmpty(resp[0].submittedDate));
    $("#assessmentYearPTR").text(testNullOrEmpty(resp[0].assessmentYear));
    $("#dateOfBirthPTR").text(testNullOrEmpty(resp[0].dateOfBirth));
    $("#applicantNamePTR").text(resp[0].applicantName);
    $("#applicantTINPTR").text(resp[0].applicantTIN);
    $("#employerAddressPTR").text(testNullOrEmpty(resp[0].employerAddress));
    $("#employerEmailPTR").text(testNullOrEmpty(resp[0].employerEmail));
    $("#employerNamePTR").text(testNullOrEmpty(resp[0].employerName));
    $("#employerPhonePTR").text(testNullOrEmpty(resp[0].employerPhone));
    $("#employerTINPTR").text(testNullOrEmpty(resp[0].employerTIN));
    $("#endDatePTR").text(testNullOrEmpty(resp[0].endDate));
    $("#genderPTR").text(resp[0].gender === "M" ? "Male" : resp[0].gender === "F" ? "Female" : resp[0].gender);
    $("#maritalStatusPTR").text(testNullOrEmpty(resp[0].maritalStatus));
    $("#mothersMaidenNamePTR").text(testNullOrEmpty(resp[0].mothersMaidenName));
    $("#phoneNoPTR").text(testNullOrEmpty(resp[0].phoneNo));
    $("#startDatePTR").text(testNullOrEmpty(resp[0].startDate))
    $("#currentStatus").text(resp[0].statusId);

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
    } else if (activeApplicationType.trim() === "Old Dependants Relief") {
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
    } else if (activeApplicationType.trim() === "Child Education Relief") {
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

var testNullOrEmpty = function (value) {
    if (!value || value === "null") {
        return "N/A";
    } else
        return value;
}

var appendApplicantMessages = function (listOfComments) {
    var FName = $("#taxpayerName").text();
    appendInternalMessages(listOfComments);

    var output = "";
    for (var i = 0; i < listOfComments.length; i++) {
        if (listOfComments[i].commentToTaxpayer) {
            output = output + '<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview"><small style="font-size: 12px;"><b>GRA | </b>' + listOfComments[i].personnelName + '</small><br><p style="color: black; font-size: 14px;">'
                + listOfComments[i].commentToTaxpayer + '</p><small style="font-size: 12px;" class="time-right">' + listOfComments[i].dateAndTime + '</small></div></div>';
        }

        if (listOfComments[i].taxpayerReply) {
            output = output + '<div style=" padding: 5px; width: 80%; float: right;"><div class="chatview" style="background-color: #f3f1d9;"><small style="font-size: 12px;"><b>Taxpayer | </b>' + FName.split(" ")[0] + '</small><br><p style="color: black; font-size: 14px;">'
                + listOfComments[i].taxpayerReply + '</p ><small style="font-size: 12px;" class="time-right">' + listOfComments[i].taxpayerReplyTime + '</small></div></div>';
        }
    }

    $("#chatUI").html(output);
};

var appendInternalMessages = function (listOfComments) {

    var output = "";
    for (var i = 0; i < listOfComments.length; i++) {
        if (listOfComments[i].internalComment) {
            output = output + '<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview"><small style="font-size: 12px;"><b>GRA | </b>' + listOfComments[i].personnelName + '</small><br><p style="color: black; font-size: 14px;">'
                + listOfComments[i].internalComment + '</p><small style="font-size: 12px;" class="time-right">' + listOfComments[i].dateAndTime + '</small></div></div>';
        }
    }

    $("#internalMessageUI").html(output);
};

var appendDocumentsToTable = function (listOfDocuments) {
    listOfDocumentsGlobal = listOfDocuments

    let output = "";

    if (listOfDocumentsGlobal && listOfDocumentsGlobal.length !== 0) {
        for (var i = 0; i < listOfDocuments.length; i++) {
            var number = i + 1;
            output = output + '<tr onclick="GetAssociatedBase64Stirng(' + i + ')" id="docId' + i + '" style="cursor: pointer;"><td style="color: black; text-align: center;">'
                + number + '</td><td style="color: black;">' + listOfDocuments[i].documentDesc + '</td><td style="color: black;">' + listOfDocuments[i].createDate
                + '</td></tr >';
        }
    } else {
        output = output + '<br /><tr style="cursor: pointer;"><td colspan=4 style="color: black; text-align: center;">No Data</td></tr >';
    }

    output = output;
    $("#DocumentTableId").html(output);
};

var GetAssociatedBase64Stirng = function (id) {
    let stringT = listOfDocumentsGlobal[id].document;
    let exd = stringT;

    const win = window.open("", "_blank");
    let html = '';

    html += '<html>';
    html += '<head><title>Document</title>'
    html += '</head>';
    html += '<body style="margin:0!important">';
    html += '<embed width="100%" height="100%" src="' + exd + '" type="" />';
    html += '</body>';
    html += '</html>';

    setTimeout(() => {
        win.document.write(html);
    }, 0);
};

var decideNextTccStage = function (statusId) {
    let loc = window.location.href;

    switch (statusId) {
        case 0:

            $("#acknowledgeStatus").hide();
            $("#processApplication").show();
            $("#addTaxPosition").hide();
            $("#declineStatus").hide();
            $("#suspendStatus").hide();
            $("#sendForApproval").hide();

            if (loc.substring(loc.lastIndexOf('/') + 1) === "assign") {

                $("#assApplication").show();
                $("#reviseApplication").hide();
                $("#previewApplication").hide();
                $("#reassApplication").hide();

            } else if (loc.substring(loc.lastIndexOf('/') + 1) === "reassign") {

                $("#assApplication").hide();
                $("#reviseApplication").hide();
                $("#previewApplication").hide();
                $("#reassApplication").show();

            } else {

                $("#previewApplication").hide();
                $("#assApplication").hide();
                $("#reassApplication").hide();
                $("#reviseApplication").show();
                $("#reviseApplication").attr("disabled", false);

            }

            break;
        case 1:

            if (appType === "TCC") {

                $("#acknowledgeStatus").hide();
                $("#processApplication").hide();
                $("#sendForApproval").hide();
                $("#addTaxPosition").show();
                $("#suspendStatus").show();
                $("#declineStatus").hide();

            } else if (appType.toUpperCase() === "WHT Exemption".toUpperCase()) {

                $("#acknowledgeStatus").hide();
                $("#processApplication").hide();
                $("#sendForApproval").hide();
                $("#addTaxPosition").show();
                $("#suspendStatus").show();
                $("#declineStatus").hide();

            } else {

                $("#acknowledgeStatus").hide();
                $("#processApplication").hide();
                $("#addTaxPosition").hide();
                $("#sendForApproval").show();
                $("#suspendStatus").show();
                $("#declineStatus").hide();

            };

            if (loc.substring(loc.lastIndexOf('/') + 1) === "reassign") {

                $("#assApplication").hide();
                $("#reviseApplication").hide();
                $("#previewApplication").hide();
                $("#reassApplication").show();

            } else {

                $("#assApplication").hide();
                $("#reassApplication").hide();
                $("#previewApplication").hide();
                $("#reviseApplication").show();
                $("#reviseApplication").attr("disabled", false);
            }

            break;
        case 2:
            $("#acknowledgeStatus").hide();
            $("#addTaxPosition").hide();
            $("#processApplication").hide();
            $("#declineStatus").hide();
            $("#suspendStatus").hide();
            $("#sendForApproval").hide();


            if (loc.substring(loc.lastIndexOf('/') + 1) === "reassign") {

                $("#assApplication").hide();
                $("#reviseApplication").hide();
                $("#previewApplication").hide();
                $("#reassApplication").show();

            } else {

                $("#assApplication").hide();
                $("#reassApplication").hide();
                $("#previewApplication").show();
                $("#reviseApplication").hide();
                $("#reviseApplication").attr("disabled", true);
            }
           
            break;
        case 3:
            $("#addTaxPosition").hide();
            $("#declineStatus").hide();
            $("#suspendStatus").hide();
            $("#processApplication").hide();
            $("#acknowledgeStatus").hide();
            $("#sendForApproval").hide();

            if (loc.substring(loc.lastIndexOf('/') + 1) === "reassign") {

                $("#assApplication").hide();
                $("#reviseApplication").hide();
                $("#previewApplication").hide();
                $("#reassApplication").show();

            } else {

                $("#assApplication").hide();
                $("#reassApplication").hide();
                $("#previewApplication").hide();
                $("#reviseApplication").hide();
                $("#reviseApplication").attr("disabled", false);
            }

            break;
        case 4:
            $("#acknowledgeStatus").hide();
            $("#processApplication").show();
            $("#addTaxPosition").hide();
            $("#declineStatus").show();
            $("#sendForApproval").hide();
            $("#declineStatus").show();

            if (loc.substring(loc.lastIndexOf('/') + 1) === "reassign") {

                $("#assApplication").hide();
                $("#reviseApplication").hide();
                $("#previewApplication").hide();
                $("#reassApplication").show();

            } else {

                $("#previewApplication").hide();
                $("#assApplication").hide();
                $("#reassApplication").hide();
                $("#reviseApplication").show();
                $("#reviseApplication").attr("disabled", false);
            }
          
            break;
        case 5:
            $("#processApplication").hide();
            $("#dismissModal").hide();
            $("#previewTcc").hide();
            $("#downloadTcc").hide();
            $("#acknowledgeStatus").hide();
            $("#sendForApproval").hide();

            if (loc.substring(loc.lastIndexOf('/') + 1) === "reassign") {

                $("#assApplication").hide();
                $("#reviseApplication").hide();
                $("#previewApplication").hide();
                $("#reassApplication").show();

            } else {

                $("#assApplication").hide();
                $("#reassApplication").hide();
                $("#previewApplication").hide();
                $("#reviseApplication").show();
                $("#reviseApplication").attr("disabled", true);
            }

            break;
        default:
            toastr.warning("Invalid Entry");
            break;
    }
};

$("#appMessages").click(function () {
    $("#messagesAndAttachments").modal("show");
});