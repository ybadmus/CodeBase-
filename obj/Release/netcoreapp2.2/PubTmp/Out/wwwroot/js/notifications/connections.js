'use strict';

var domainUrl = window.location.origin === "http://localhost:6290" || "http://psl-app-vm3" ? "http://psl-app-vm3" : window.location.origin;
var serverUrl = $("#serverUrl").val();

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