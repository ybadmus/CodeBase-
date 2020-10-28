$("#internalMessage").keyup(function () {
    fieldValidator();
});

var loadMessages = function (tccId) {

    let url = `${GetTccCommentsByIdUrl}` + tccId;

    apiCaller(url, "GET", "", appendMessages)
};

var fieldValidator = function () {
    if (!isNaN(parseInt(selectedStatus)) && ($("#internalMessage").val().match(/\S/)) && lengthInternalMessage())
        $("#approveDeclineReturnBtn").attr("disabled", false);
    else
        $("#approveDeclineReturnBtn").attr("disabled", true);
};

var lengthInternalMessage = function () {
    var content = $("#internalMessage").val().trim();

    if (content.length > 5) {
        return true;
    } else {
        return false;
    }
};

var appendMessages = function (listOfComments) {

    var FName = $("#applicantName").text().split(" ")[0];
    var output = "";
    var outputInternal = "";

    for (var i = 0; i < listOfComments.length; i++) {
        if (listOfComments[i].commentToTaxpayer) {

            output = output + '<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview"><small style="font-size: 13px;"><b>GRA | </b>' + listOfComments[i].personnelName + '</small><br><p style="color: black;">'
                + listOfComments[i].commentToTaxpayer + '</p><small style="font-size: 13px;" class="time-right">' + listOfComments[i].dateAndTime + '</small></div></div>';
        }

        if (listOfComments[i].taxpayerReply) {
            output = output + '<div style=" padding: 5px; width: 80%; float: right;"><div class="chatview" style="background-color: #f3f1d9;"><small style="font-size: 13px;"><b>Reply from ' + FName.toUpperCase() + '</b></small><br><p style="color: black;">'
                + listOfComments[i].taxpayerReply + '</p ><small style="font-size: 13px;" class="time-right">' + listOfComments[i].taxpayerReplyTime + '</small></div></div>';
        }

        if (listOfComments[i].internalComment) {
            outputInternal = outputInternal + '<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview" style=";"><small style="font-size: 13px;"><b>GRA | </b>' + listOfComments[i].personnelName + '<b> - Internal Message</b></small><br><p style="color: black;">'
                + listOfComments[i].internalComment + '</p><small style="font-size: 13px;" class="time-right">' + listOfComments[i].dateAndTime + '</small></div></div>';
        }
    }

    output = output;
    $("#chatUI").html(output);
    $("#internalChatUI").html(outputInternal);

    $('#taxpayerMessageScroll').scrollTop(1000000);
    $('#internalMessageScroll').scrollTop(1000000);
};

var openDivForTab = function (evt, divId) {

    if (divId === "taxpayer") {
        $("#sendMesageTaxpayer").show();
        $("#sendInternal").hide();
    }

    if (divId === "internal") {
        $("#sendInternal").show();
        $("#sendMesageTaxpayer").hide();
    }

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

var updateInternalMessages = function (message) {
    var loggedInUserName = $(".UserFullName").text().toUpperCase();
    var time = new Date().toLocaleTimeString();

    $("#internalChatUI").append('<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview"><small style="font-size: 13px;"><b>GRA | </b>' + loggedInUserName + '</small><br><p style="color: black;">' + message + '</p><small style="font-size: 13px;" class="time-right">Today @' + time + '</small></div></div>');
    $("#commentToStaff").val("");
};

var updateTaxpayerMessages = function (message) {
    var loggedInUserName = $(".UserFullName").text().toUpperCase();
    var time = new Date().toLocaleTimeString();

    $("#chatUI").append('<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview"><small style="font-size: 13px;"><b>GRA | </b>' + loggedInUserName + '</small><br><p style="color: black;">' + message + '</p><small style="font-size: 13px;" class="time-right">Today @' + time + '</small></div></div>');
};

var updateMessageDirectly = function () {

    if ($("#commentToTaxpayer").val()) {
        updateTaxpayerMessages($("#commentToTaxpayer").val());
        toastr.success("Message succesfully sent!");
        $("#commentToTaxpayer").val("");
    };
};

var updateMessageDirectlyStaff = function () {

    if ($("#commentToStaff").val()) {
        updateInternalMessages($("#commentToStaff").val());
        toastr.success("Message successfully sent!");
        $("#commentToStaff").val("");
    };
};

$("#tccMessages").click(function (e) {
    $("#tccMessagesView").modal("show");
});

$("#appStatus").on('change', function () {
    var elem = document.getElementById("appStatus");
    selectedStatus = elem.options[elem.selectedIndex].value;
    fieldValidator();
});

$("#sendInternal").click(function () {
    let tccId = $("#appId").val();
    let message = $("#commentToStaff").val();
    let updateUrl = tccUpdateUrl + tccId;

    let ObjectToSend = {
        "status": 5,
        "taxpayerComment": "",
        "internalComment": message,
        "applicationId": $("#appId").val()
    };

    if (message.replace(/\s+/, '').length == 0)
        toastr.warning('Fields empty');
    else
        apiCaller(updateUrl, "PUT", ObjectToSend, updateMessageDirectlyStaff);
});

$("#sendMesageTaxpayer").click(function () {
    let tccId = $("#appId").val();
    let message = $("#commentToTaxpayer").val();
    let updateUrl = tccUpdateUrl + tccId;

    let ObjectToSend = {
        "status": 5,
        "taxpayerComment": message,
        "internalComment": "",
        "applicationId": $("#appId").val()
    };

    if (message.replace(/\s+/, '').length == 0)
        toastr.warning('Fields empty');
    else
        apiCaller(updateUrl, "PUT", ObjectToSend, updateMessageDirectly);
});

$("#approveDecline").on('hidden.bs.modal', function () {
    $('#appStatus option').prop('selected', function () {
        return this.defaultSelected;
    });
    $("#internalMessage").val("");
    $("#taxpayerMessage").val("");
});

var successfullyUpdated = function () {
    if (selectedStatus == 2) {
        toastr.success("Application has successfully been approved");

        $("#approveModal").modal("hide");
        $("#approveDecline").modal("hide");

        removeEntryFromGrid($("#appId").val());
        previewCertificate();
    };

    if (selectedStatus == 3) {
        toastr.info("Application has been declined");

        $("#approveModal").modal("hide");
        $("#approveDecline").modal("hide");

        backToGrid();
    };

    if (selectedStatus == 1) {
        toastr.success("Application successfully return to applicant");

        $("#approveModal").modal("hide");
        $("#approveDecline").modal("hide");

        backToGrid();
    }
};

var previewCertificate = function () {
    if ($(".applicationType").text() === "TCC") {

        let appId = $("#appId").val();
        sessionStorage.setItem("tccReportId", appId);
        sessionStorage.setItem("tccLabel", "uniApplicationId");
        window.location.href = `${ReportDownloadView}`;
    } else {

        $("#texDetails").hide();
        $("#texGridView").show();
        $("#ptrDetails").hide();
        $("#ptrGridView").show();
        return toastr.info("No Preview Available");
    }

};

var removeEntryFromGrid = function (id) {
    var displayedData = $('#Grid').data("kendoGrid").dataSource.data().toJSON()

    for (var i = 0; i < displayedData.length; i++) {
        if (id == displayedData[i].applicationId) {
            displayedData.splice(i, 1);
            initializeKendoGrid(displayedData);
        }
    };
};
