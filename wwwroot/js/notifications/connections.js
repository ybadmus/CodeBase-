'use strict';

var domainUrl = window.location.origin === "http://localhost:6290" || "http://psl-app-vm3" ? "http://psl-app-vm3" : window.location.origin;
var serverUrl = $("#serverUrl").val();
var userid = $("#userId").val();
var urlTaxOffice = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

$(document).ready(function () {
    apiCaller(urlTaxOffice, "GET", "", setTaxOffice);
});

var loadNotificationsAllOffices = function (offices) {
    for (var i = 0; i < offices.length; i++) {
        var loadNotificationsUrl = `${serverUrl}api/Notification/GetAllNotifications?taxOfficeId=${offices[i].taxOfficeId}`
        apiCaller(loadNotificationsUrl, 'GET', '', loadNotificationDropdown);
    }
};

var loadNotificationDropdown = function (resp) {
    let output = "";

    if (resp) {
        for (var i = 0; i < resp.length; i++) {

            var imgUrl = "";
            if (resp[i].message.includes("Pit"))
                imgUrl = `${serverUrl}/icons/iconx-pit.png`;
            else if (resp[i].message.includes("Paye"))
                imgUrl = `${serverUrl}/icons/iconx-payee.png`;

            output = output + '<div class="dropdown-item-text dropdown-item-text--lh" style="display: inline-flex;"><div><span>' +
                '<img src = "' + `${imgUrl}` + '" width = "40" height = "40" ></span></div><div style="padding-left: 5px;">' +
                '<span class="" id = "NotificationTitle" style = "color: black;" >' + resp[i].message + '</span>' +
                '<span class="text-dark-gray" id = "NotificationMessage">  ' + resp[i].applicationId + '</span></div></div><div class="dropdown-divider"></div>';
        };
    }

    $("#NotificationItems").prepend(output);
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
    for (var i = 0; i < taxOffices.length; i++) {
        connection.invoke("JoinNotificationGroup", taxOffices[i].taxOfficeId).catch(function (err) {
            return console.error(err.toString());
        });

    }
};

var setTaxOffice = function (resp) {
    var taxOffices = resp;
    if (resp.length > 1)
        $("#adminTaxOffice").text("Head Office");
    else if (resp.length == 1)
        $("#adminTaxOffice").text(resp[0].taxOfficeName);

    joinGroups(taxOffices);
    loadNotificationsAllOffices(taxOffices);
};



connection.start()
    .then(function () {
        console.log("connected");
    }).catch(function (err) {
        return console.error(err.toString());
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