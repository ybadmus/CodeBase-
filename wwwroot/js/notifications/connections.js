'use strict';

var domainUrl = window.location.origin === "http://localhost:6290" || "http://psl-app-vm3" ? "http://psl-app-vm3" : window.location.origin;
var serverUrl = $("#serverUrl").val();
var userid = $("#userId").val();
var urlTaxOffice = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;
var oneOfficeAssigned = false;

$(document).ready(function () {
    apiCaller(urlTaxOffice, "GET", "", setTaxOffice);
});

var loadNotificationsAllOffices = function (offices) {
    if (offices) {
        for (var i = 0; i < offices.length; i++) {
            var loadNotificationsUrl = `${serverUrl}api/Notification/GetAllNotifications?taxOfficeId=${offices[i].taxOfficeId}`
            apiCaller(loadNotificationsUrl, 'GET', '', loadNotificationDropdown);
        }
    }
};

var loadNotificationDropdown = function (resp) {
    let output = "";
    let outputMainView = "";

    if (resp) {
        for (var i = 0; i < resp.length; i++) {
            var imgUrl = "";
            if (resp[i].message.includes("Pit"))
                imgUrl = `${serverUrl}/icons/iconx-pit.png`;
            else if (resp[i].message.includes("Paye"))
                imgUrl = `${serverUrl}/icons/iconx-payee.png`;

            if (resp[i].status === "U") {
                output = output + '<div class="dropdown-item-text dropdown-item-text--lh" id="notificationItem" style="background-color: #edf2fa;"><div>' +
                    '<img src = "' + `${imgUrl}` + '" width = "48" height = "48" ></div><div style="padding-left: 5px; padding-right: 5px; padding-top: 4px">' +
                    '<div class="" style="font-size: 14px; line-height: 1.10rem;"><span style="font-weight: 600">' + resp[i].userName + "</span><span style='font-weight: 500;'> (" + resp[i].userTIN + ") </span><span> submitted a </span><span style='font-weight: 600'>" + resp[i].taxType + " " + resp[i].transactionType + '</span><span class="oneOffice"> to </span>' +
                    '<span class="oneOffice">  ' + resp[i].taxOfficeName + "</span><span style='font-weight: 600'> on </span><span>" + resp[i].submittedDate + '.</span></div></div></div>';
            } else if (resp[i].status === "R") {
                output = output + '<div class="dropdown-item-text dropdown-item-text--lh" id="notificationItem"><div>' +
                    '<img src = "' + `${imgUrl}` + '" width = "48" height = "48" ></div><div style="padding-left: 5px; padding-right: 5px; padding-top: 4px">' +
                    '<div class="" style="font-size: 14px; line-height: 1.10rem;"><span style="font-weight: 600">' + resp[i].userName + "</span><span style='font-weight: 500;'> (" + resp[i].userTIN + ") </span><span> submitted a </span><span style='font-weight: 600'>" + resp[i].taxType + " " + resp[i].transactionType + '</span><span class="oneOffice"> to </span>' +
                    '<span class="oneOffice">  ' + resp[i].taxOfficeName + "</span><span style='font-weight: 600'> on </span><span>" + resp[i].submittedDate + '.</span></div></div></div>';
            };

            if (mainNotificationView) {
                if (resp[i].status === "U") {
                    outputMainView = outputMainView + '<div class="col-sm-12" id="notificationItemMain" style="background-color: #edf2fa;"><div>' +
                        '<img src = "' + `${imgUrl}` + '" width = "48" height = "48" ></div><div style="padding-left: 5px; padding-right: 5px; padding-top: 4px">' +
                        '<div class="" style="font-size: 14px; line-height: 1.10rem;"><span style="font-weight: 600">' + resp[i].userName + "</span><span style='font-weight: 500;'> (" + resp[i].userTIN + ") </span><span> submitted a </span><span style='font-weight: 600'>" + resp[i].taxType + " " + resp[i].transactionType + '</span><span class="oneOffice"> to </span>' +
                        '<span class="oneOffice">  ' + resp[i].taxOfficeName + "</span><span style='font-weight: 600'> on </span><span>" + resp[i].submittedDate + '.</span></div></div></div>';
                } else if (resp[i].status === "R") {
                    outputMainView = outputMainView + '<div class="col-sm-12" id="notificationItemMain"><div>' +
                        '<img src = "' + `${imgUrl}` + '" width = "48" height = "48" ></div><div style="padding-left: 5px; padding-right: 5px; padding-top: 4px">' +
                        '<div class="" style="font-size: 14px; line-height: 1.10rem;"><span style="font-weight: 600">' + resp[i].userName + "</span><span style='font-weight: 500;'> (" + resp[i].userTIN + ") </span><span> submitted a </span><span style='font-weight: 600'>" + resp[i].taxType + " " + resp[i].transactionType + '</span><span class="oneOffice"> to </span>' +
                        '<span class="oneOffice">  ' + resp[i].taxOfficeName + "</span><span style='font-weight: 600'> on </span><span>" + resp[i].submittedDate + '.</span></div></div></div>';
                };
            }
        };
        $("#loader_div").hide();
    }

    $("#NotificationItems").prepend(output);
    if (mainNotificationView)
        $("#notificationView").prepend(outputMainView);
    if (oneOfficeAssigned)
        $(".oneOffice").css('display', 'none');
};

var loadNotificationsView = function () {

};

const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${domainUrl}/taxpayermonoapi/Notifications`)
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
            if (retryContext.elapsedMilliseconds < 60000) {
                return Math.random() * 10000;
            } else {
                return null;
            }
        }
    }).build();

var joinGroups = function (taxOffices) {
    if (taxOffices) {
        for (var i = 0; i < taxOffices.length; i++) {
            connection.invoke("JoinNotificationGroup", taxOffices[i].taxOfficeId).catch(function (err) {
                return console.error(err.toString());
            });
        }
    }
};

var setTaxOffice = function (resp) {
    setTaxOfficeNameDashBoard(resp);
    joinGroups(resp);
    loadNotificationsAllOffices(resp);
};

var setTaxOfficeNameDashBoard = function (resp) {
    if (resp) {
        if (resp.length > 1) {
            $("#adminTaxOffice").text("Head Office");
        }
        else if (resp.length == 1) {
            $("#adminTaxOffice").text(resp[0].taxOfficeName);
            oneOfficeAssigned = true;
           
        }

    } else {
        toastr.info("No Tax Office assigned to this user!");
    }

};

connection.start()
    .then(function () {
        console.log("connected");
    }).catch(function (err) {
        return console.error(err.toString());
    });

connection.on("ReceiveApplicationStatusMessage", (message) => {

    var imgUrl = `${serverUrl}/icons/iconx-pit.png`;
    var title = "New Notification Received";
    var body = message[0].message;

    displayNotification(body, imgUrl, title);
    updateNotificationList(imgUrl, message[0]);
});

connection.on("pitsavenotification", (message) => {

    var imgUrl = `${serverUrl}/icons/iconx-pit.png`;
    var title = "New Notification Received";
    var body = message[0].message;

    displayNotification(body, imgUrl, title);
    updateNotificationList(imgUrl, message[0]);
});

connection.on("whtTransactionsavenotification", (message) => {
    console.log("whtTransactionsavenotification", { message });
    AppNotifications.push({
        Title: "WHT Transaction",
        Message: message
    });
    SetAppNotifications();
});

connection.on("whVatTransactionsavenotification", (message) => {
    console.log("whVatTransactionsavenotification", { message });
    AppNotifications.push({
        Title: "WHVAT Transaction",
        Message: message
    });
    SetAppNotifications();
});

connection.on("whVatReturnsavenotification", (message) => {
    console.log("whVatReturnsavenotification", { message });
    AppNotifications.push({
        Title: "WHVAT Returns",
        Message: message
    });
    SetAppNotifications();
});

connection.on("whtReturnsavenotification", (message) => {
    console.log("whtReturnsavenotification", { message });
    AppNotifications.push({
        Title: "WHT Returns",
        Message: message
    });
    SetAppNotifications();
});

connection.on("whtAndVatNotify", (message) => {
    console.log("whtAndVatNotify", { message });
    AppNotifications.push({
        Title: "WHT Submission",
        Message: message
    });
    SetAppNotifications();
});

connection.on("ReceivePayeMessage", (message) => {
    console.log("ReceivePayeMessage", { message });
    AppNotifications.push({
        Title: "PAYE Submission",
        Message: message
    });
    SetAppNotifications();
});

connection.onreconnecting((error) => {
    console.assert("onreconnecting", connection.state === signalR.HubConnectionState.Reconnecting);
    console.log("trying to reconnect now so wait");
    console.log("connection lost totally");
})

connection.onreconnected((connectionId) => {
    console.assert("reconnected", connection.state === signalR.HubConnectionState.Connected);
    console.log(`Connection reestablished. Connected with connectionId "${connectionId}".`);
})

connection.onclose((error) => {
    console.assert("onclose", connection.state === signalR.HubConnectionState.Disconnected);
    console.log(`Connection closed due to error "${error}". Try refreshing this page to restart the connection.`);
});


//itaps-host/icons/iconx-payee.png  
//itaps-portal-lite/icons/iconx-tcc.png
//itaps-portal-lite/icons/iconx-ptr.png -tex
//itaps-portal-lite/icons/iconx-hand.png -ptr

