var serverUrl = $("#serverUrl").val();
var objToSend = {};

var requestPasswordChange = function () {
    objToSend.StrEmail = $("#userEmail").val();
    objToSend.StrPhoneNo = $("#phoneNumber").val();
    objToSend.StrOldPassword = $("#oldPassword").val();
    objToSend.StrNewPassword = $("#newPassword").val();
    objToSend.StrConfirmPassword = $("#confirmNewPassword").val();

    var url = serverUrl + "api/Users/ChangePassword";
    apiCaller(url, "POST", objToSend, callBack);
};

var callBack = function () {

    toastr.success("Password successfully changed!");
};

$("#requestChangePassword").click(function () {

    if (verfiyEntry()) 
        $("#yesOrNoChangePassword").modal("show");
});

$("#yesBtnChangePassword").click(function () {

    requestPasswordChange();
});

var verfiyEntry = function () {

    var StrNewPassword = $("#newPassword").val();
    var StrConfirmPassword = $("#confirmNewPassword").val();

    if (StrNewPassword === StrConfirmPassword)
        return true;
    else {
        toastr.error("Password does not match!");
        return false;
    }
};

var makeFieldVisible = function (id) {
    var x = "";

    if (id == "basic-addon3") {
        x = document.getElementById("confirmNewPassword");
    } else if (id == "basic-addon2") {
        x = document.getElementById("newPassword");
    } else {
        x = document.getElementById("oldPassword");
    }

    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
};

$(".input-group-append").hover(function (event) {

    makeFieldVisible(event.target.id);
});