var selectedStatus;
var detailsKendoUpdate;
var statusCodeNames = [{ "StatusName": "ACKNOWLEDGE" }, { "StatusName": "PROCESSING APPLICATION" },
{ "StatusName": "CERTIFICATE ISSUED" }, { "StatusName": "DECLINED" }, { "StatusName": "REQUEST FOR INFO" }, { "StatusName": "PENDING APPROVAL" }];

$("#reviseApplication").click(function () {
    $("#tcc-status-update").modal("show");
});

$("#appStatus").on('change', function () {
    var elem = document.getElementById("appStatus");
    selectedStatus = elem.options[elem.selectedIndex].value;
    fieldValidator();

    if (!isNaN(parseInt(selectedStatus)))
        if (parseInt(selectedStatus) == 2) {

            $("#taxPosition").show();
            $("#updateAppStatus").hide();
        } else {

            $("#taxPosition").hide();
            $("#updateAppStatus").show();
        };
});

$("#internalMessage").keyup(function () {
    fieldValidator();
});

var fieldValidator = function () {
    if (!isNaN(parseInt(selectedStatus)) && ($("#internalMessage").val().match(/\S/)) && lengthInternalMessage()) {

        if (parseInt(selectedStatus) != 2)
            $("#updateAppStatus").attr("disabled", false);

        else
            $("#taxPosition").attr("disabled", false);

    } else {
        $("#updateAppStatus").attr("disabled", true);
        $("#taxPosition").attr("disabled", true);
    }
};

$("#updateAppStatus").click(function (e) {
    e.preventDefault();

    let tccId = $("#appId").val();
    let updateUrl = tccUpdateUrl + tccId;

    if (selectedStatus >= 0 && selectedStatus <= 7) {

        if (selectedStatus < 2) {
            $('html').hideLoading();

            let ObjectToSend = {
                "status": selectedStatus,
                "taxpayerComment": $("#taxpayerMessage").val(),
                "internalComment": $("#internalMessage").val(),
                "applicationId": tccId
            };

            detailsKendoUpdate = {
                "statusId": selectedStatus,
                "appId": tccId
            };

            apiCaller(updateUrl, "PUT", ObjectToSend, updateView);
        }

        if (selectedStatus == 3) {
            $('html').hideLoading();

            let ObjectToSend = {
                "status": 3,
                "taxpayerComment": $("#taxpayerMessage").val(),
                "internalComment": $("#internalMessage").val(),
                "applicationId": tccId
            };

            detailsKendoUpdate = {
                "statusId": 3,
                "appId": tccId
            };

            if ($("#taxpayerMessage").val().length < 5)
                return toastr.info("Message to the Taxpayer is required when Declining Application");

            apiCaller(updateUrl, "PUT", ObjectToSend, updateView);
        }

        if (selectedStatus == 4) {
            $('html').hideLoading();

            let ObjectToSend = {
                "status": 4,
                "taxpayerComment": $("#taxpayerMessage").val(),
                "internalComment": $("#internalMessage").val(),
                "applicationId": tccId
            };

            detailsKendoUpdate = {
                "statusId": 4,
                "appId": tccId
            };

            if ($("#taxpayerMessage").val().length < 5)
                return toastr.info("Message to the Taxpayer is required when Requesting for more Info ");

            apiCaller(updateUrl, "PUT", ObjectToSend, updateView);
        }

        if (selectedStatus == 5) {
            $('html').hideLoading();

            let ObjectToSend = {
                "status": 5,
                "taxpayerComment": $("#taxpayerMessage").val(),
                "internalComment": $("#internalMessage").val(),
                "applicationId": tccId
            };

            detailsKendoUpdate = {
                "statusId": 5,
                "appId": tccId
            };

            apiCaller(updateUrl, "PUT", ObjectToSend, updateView);
        }
    }
    else {

        toastr.warning('Invalid status');
    }
});

var lengthInternalMessage = function () {
    var content = $("#internalMessage").val().trim();

    if (content.length > 5) {
        return true;
    } else {
        return false;
    }
};

var updateInternalMessages = function (message) {
    var loggedInUserName = $(".UserFullName").text().toUpperCase();
    var time = new Date().toLocaleTimeString();

    $("#internalMessageUI").append('<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview"><small style="font-size: 13px;"><b>GRA | </b>' + loggedInUserName + '</small><br><p style="color: black;">' + message + '</p><small style="font-size: 13px;" class="time-right">Today @' + time + '</small></div></div>');
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

    if ($("#commentToStaff").val()) {
        updateTaxpayerMessages($("#commentToStaff").val());
        toastr.success("Message succesfully sent!");
        $("#commentToStaff").val("");
    };
};

var updateKendoGridLocally = function (updateDetails) {
    var displayedData = gridGlobal.dataSource;

    for (var i = 0; i < displayedData.length; i++) {
        if (updateDetails.appId == displayedData[i].applicationId) {
            displayedData[i].status = statusCodeNames[updateDetails.statusId].StatusName;
            displayedData[i].statusId = updateDetails.statusId;
            displayedData[i].statusDate = getCurrentDateMMDDYYY();

            initializeKendoGrid(displayedData);
        }
    };
};

var getCurrentDateMMDDYYY = function () {
    var now = new Date();

    return now.getDate() < 10 ? ("0" + now.getDate() + "/" + ((now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1)) + "/" + now.getFullYear())
        : (now.getDate() + "/" + ((now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1)) + "/" + now.getFullYear());
};

var updateMessageDirectlyStaff = function () {

    if ($("#commentToStaff").val()) {
        updateInternalMessages($("#commentToStaff").val());
        toastr.success("Message succesfully sent!");
        $("#commentToStaff").val("");
    };
};

var updateView = function () {
    toastr.success("Successfully updated!");

    if ($("#internalMessage").val())
        updateInternalMessages($("#internalMessage").val());

    if ($("#taxpayerMessage").val())
        updateTaxpayerMessages($("#taxpayerMessage").val());

    $("#appStatusHeader").text(statusCodeNames[selectedStatus].StatusName);
    $("#tcc-status-update").modal("hide");

    updateKendoGridLocally(detailsKendoUpdate);
    backToView();
};

$("#tcc-status-update").on('hidden.bs.modal', function () {
    $('#appStatus option').prop('selected', function () {
        return this.defaultSelected;
    });
    $("#internalMessage").val("");
    $("#taxpayerMessage").val("");
    $("#updateAppStatus").attr("disabled", true);
    $("#taxPosition").attr("disabled", true);
});

$("#sendMesageTaxpayer").click(function () {
    let tccId = $("#appId").val();
    let message = $("#commentToTaxpayer").val();
    let updateUrl = tccUpdateUrl + tccId;

    let ObjectToSend = {
        "status": parseInt($("#currentStatus").text()),
        "taxpayerComment": message,
        "internalComment": "",
        "applicationId": tccId
    };

    if (message.replace(/\s+/, '').length == 0)
        toastr.warning('Fields empty');
    else
        apiCaller(updateUrl, "PUT", ObjectToSend, updateMessageDirectly);
});

$("#sendInternal").click(function () {
    let tccId = $("#appId").val();
    let message = $("#commentToStaff").val();
    let updateUrl = tccUpdateUrl + tccId;

    let ObjectToSend = {
        "status": parseInt($("#currentStatus").text()),
        "taxpayerComment": "",
        "internalComment": message,
        "applicationId": tccId
    };

    if (message.replace(/\s+/, '').length == 0)
        toastr.warning('Fields empty');
    else
        apiCaller(updateUrl, "PUT", ObjectToSend, updateMessageDirectlyStaff);
});

$("#taxPosition").click(function () {
    let ObjectToSend = {
        "status": 5,
        "taxpayerComment": $("#taxpayerMessage").val(),
        "internalComment": $("#internalMessage").val(),
        "applicationId": $("#appId").val()
    };

    localStorage.setItem('taxpositionObj', JSON.stringify(ObjectToSend));

    window.location.href = `${serverUrl}applications/taxposition?applicantName=` + $("#applicantName").text() + "&taxpayerId=" +
        $("#taxpayerId").text() + "&appId=" + $("#appId").val() + "&applicantTin=" + $("#applicantTIN").text();
});
