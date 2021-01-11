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
