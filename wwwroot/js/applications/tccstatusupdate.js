var selectedStatus;
var statusCodeNames = [{ "StatusName": "ACKNOWLEDGE" }, { "StatusName": "PROCESSING APPLICATION" },
    { "StatusName": "CERTIFICATE ISSUED" }, { "StatusName": "DECLINED" }, { "StatusName": "REQUEST FOR INFO" }, { "StatusName": "PENDING APPROVAL" }];

$("#reviseApplication").click(function () {
    $("#tcc-status-update").modal("show");
});

$("#appStatus").on('change', function () {
    var elem = document.getElementById("appStatus");
    selectedStatus = elem.options[elem.selectedIndex].value;

    if (!isNaN(parseInt(selectedStatus)) && ($("#internalMessage").val().match(/\S/)))
        $("#updateAppStatus").attr("disabled", false);
});

$("#internalMessage").blur(function () {
    if (!isNaN(parseInt(selectedStatus)) && ($("#internalMessage").val().match(/\S/)))
        $("#updateAppStatus").attr("disabled", false);
});

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

            apiCaller(updateUrl, "PUT", ObjectToSend, updateView);
        }

        if (selectedStatus == 2) {
            $('html').hideLoading();

            genCertTaxPayerComment = $("#commentToTaxpayer").val();
            genCertStaffComment = $("#commentToStaff").val();

            let d = new Date();
            let data = [];

            for (let i = d.getFullYear(); i >= d.getFullYear() - 2; i--) {
                data.push({
                    assessmentYear: i, status: "", chargeableIncome: "", taxCharged: "", taxPaid: "", taxOutstanding: ""
                });
            }

            LoadTaxSummaryTable(data);

            //$("#confirmationModal").modal("show");
            //$("#tccStatusModal").modal("hide");
        }

        if (selectedStatus == 3) {
            $('html').hideLoading();

            let ObjectToSend = {
                "status": 3,
                "taxpayerComment": $("#taxpayerMessage").val(),
                "internalComment": $("#internalMessage").val(),
                "applicationId": tccId
            };

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
            apiCaller(updateUrl, "PUT", ObjectToSend, updateView);
        }
    }
    else {
        toastr.warning('Invalid status');
    }
});

var updateInternalMessages = function (message) {
    var loggedInUserName = $(".UserFirstName").val().toUpperCase();
    var time = new Date().toLocaleTimeString();

    $("#internalMessageUI").append('<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview"><small style="font-size: 13px;"><b>GRA | </b>' + loggedInUserName + '</small><br><p style="color: black;">' + message + '</p><small style="font-size: 13px;" class="time-right">Today @' + time + '</small></div></div>');
    $("#commentToStaff").val("");
};

var updateTaxpayerMessages = function (message) {
    var loggedInUserName = $(".UserFirstName").val().toUpperCase();
    var time = new Date().toLocaleTimeString();

    $("#chatUI").append('<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview"><small style="font-size: 13px;"><b>GRA | </b>' + loggedInUserName + '</small><br><p style="color: black;">' + message + '</p><small style="font-size: 13px;" class="time-right">Today @' + time + '</small></div></div>');
};

var updateView = function () {
    if ($("#internalMessage").val())
        updateInternalMessages($("#internalMessage").val());

    if ($("#taxpayerMessage").val())
        updateTaxpayerMessages($("#taxpayerMessage").val());

    $("#appStatusHeader").text(statusCodeNames[selectedStatus].StatusName);
    $("#tcc-status-update").modal("hide");
}