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
    let tccId = $("#appId").val();
    let url = `${GetTccByIdUrl}` + tccId;

    apiCaller(url, "GET", "", loadDetails)
};

var getTccDocumentsById = function () {
    let tccId = $("#appId").val();
    let url = `${GetTCCDocuments}?id=` + tccId;

    apiCaller(url, "GET", "", appendDocumentsToTable)
};

var loadDetails = function (resp) {
    $("#applicantName").text(resp[0].applicantName);
    $("#applicantFName").text(resp[0].applicantName); //span so using text
    $("#applicantTIN").text(resp[0].applicantTIN);
    $("#applicantPhone").text(resp[0].applicantPhoneNo);
    $("#applicantEmail").text(resp[0].applicantEmailAddress);
    $("#requestEntityName").text(resp[0].requestingEntity);
    $("#requestingEntityTin").text(resp[0].requestingOfficeTIN);
    $("#requestingEntityPhone").text(resp[0].requestingOfficePhone);
    $("#requestingEntityEmail").text(resp[0].requestingOfficeEmail);
    $("#purposeOfApplication").text(resp[0].purpose);
    $("#appIdHeader").text(resp[0].applicationNo); //span so using text
    $("#appStatusHeader").text(resp[0].status);
    $("#modalId").text(resp[0].applicationNo);
    $("#statusNameModal").text(resp[0].status);
    $("#currentStatus").text(resp[0].statusId);
    $("#taxpayerId").text(resp[0].taxpayerId);
    
    decideNextTccStage(resp[0].statusId);
};

var appendApplicantMessages = function (listOfComments) {
    appendInternalMessages(listOfComments);

    var output = "";
    for (var i = 0; i < listOfComments.length; i++) {
        if (listOfComments[i].commentToTaxpayer) {
            output = output + '<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview"><small style="font-size: 12px;"><b>GRA | </b>' + listOfComments[i].personnelName + '</small><br><p style="color: black; font-size: 14px;">'
                + listOfComments[i].commentToTaxpayer + '</p><small style="font-size: 12px;" class="time-right">' + listOfComments[i].dateAndTime + '</small></div></div>';
        }

        if (listOfComments[i].taxpayerReply) {
            output = output + '<div style=" padding: 5px; width: 80%; float: right;"><div class="chatview" style="background-color: #f3f1d9;"><small style="font-size: 12px;"><b>Taxpayer | </b>' + FName.toUpperCase() + '</small><br><p style="color: black; font-size: 14px;">'
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
    if (listOfDocumentsGlobal.length !== 0) {
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

$("#backToGrid").click(function () {
    $("#tccGridView").show();
    $("#tccDetailsView").hide();
});

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
    switch (statusId) {
        case 0:
            $("#processApplication").show();
            $("#acknowledgeStatus").hide();
            $("#addPosition").hide();
            $("#suspendStatus").hide();
            $("#declineStatus").hide();
            $("#previewApplication").hide();
            $("#reviseApplication").show();
            $("#reviseApplication").attr("disabled", false);
            break;
        case 1:
            $("#addTaxPosition").show();
            $("#suspendStatus").show();
            $("#processApplication").hide();
            $("#acknowledgeStatus").hide();
            $("#declineStatus").show();
            $("#previewApplication").hide();
            $("#reviseApplication").show();
            $("#reviseApplication").attr("disabled", false);
            break;
        case 2:
            $("#addPosition").hide();
            $("#processApplication").hide();
            $("#declineStatus").hide();
            $("#suspendStatus").hide();
            $("#acknowledgeStatus").hide();
            $("#previewApplication").show();
            $("#reviseApplication").hide();
            $("#reviseApplication").attr("disabled", false);
            break;
        case 3:
            $("#addPosition").hide();
            $("#declineStatus").hide();
            $("#suspendStatus").hide();
            $("#processApplication").hide();
            $("#acknowledgeStatus").hide();
            $("#previewApplication").hide();
            $("#reviseApplication").show();
            $("#reviseApplication").attr("disabled", false);
            break;
        case 4:
            $("#acknowledgeStatus").hide();
            $("#addPosition").show();
            $("#declineStatus").show();
            $("#processApplication").show();
            $("#acknowledgeStatus").show();
            $("#previewApplication").hide();
            $("#reviseApplication").show();
            $("#reviseApplication").attr("disabled", false);
            break;
        case 5:
            $("#processApplication").hide();
            $("#dismissModal").hide();
            $("#previewTcc").hide();
            $("#downloadTcc").hide();
            $("#acknowledgeStatus").hide();
            $("#previewApplication").hide();
            $("#reviseApplication").show();
            $("#reviseApplication").attr("disabled", true);
            break;
        default:
            toastr.warning("Invalid Entry");
            break;
    }
};

