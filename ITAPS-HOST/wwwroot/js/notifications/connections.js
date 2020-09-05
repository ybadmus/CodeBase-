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

connection.on("ReceiveApplicationStatusMessage", (message) => {

    var imgUrl = `${serverUrl}/icons/iconx-pit.png`;
    var title = "New PIT Notification Received";
    var body = message[0];
    body.submittedDate = new Date().toUTCString(); 

    displayNotification(body, imgUrl, title);
    prependListNotifications(body);
    prependNotificationLocalStorage(body);
});

connection.on("pitsavenotification", (message) => {

    var imgUrl = `${serverUrl}/icons/iconx-pit.png`;
    var title = "New Notification Received";
    var body = message;

    displayNotification(body, imgUrl, title);
    updateNotificationList(imgUrl, message);
});

connection.on("ReceiveNewApplicationNotification", (message) => {
    console.log("ReceiveNewApplicationNotification", { message });
    AppNotifications.push({
        Title: "New Application",
        Message: message
    });
    SetAppNotifications();
});

connection.on("ReceiveNewCITNotification", (message) => {
    console.log("whtTransactionsavenotification", { message });
    AppNotifications.push({
        Title: "WHT Transaction",
        Message: message
    });
    SetAppNotifications();
});

connection.on("ReceiveWithholdingTaxNotification", (message) => {
    console.log("ReceiveWithholdingTaxNotification", { message });
    AppNotifications.push({
        Title: "WHT Returns Submission",
        Message: message
    });
    SetAppNotifications();
});

connection.on("ReceiveWVattNotification", (message) => {
    console.log("ReceiveWVattNotification", { message });
    AppNotifications.push({
        Title: "WHT VAT Submission",
        Message: message
    });
    SetAppNotifications();
});

connection.on("ReceiveNewPayeNotification", (message) => {
    console.log("ReceiveNewPayeNotification", { message });
    AppNotifications.push({
        Title: "PAYE Monthly Submission",
        Message: message
    });
    SetAppNotifications();
});

connection.on("ReceiveNewPayeAnnualNotification", (message) => {
    console.log("ReceiveNewPayeAnnualNotification", { message });
    AppNotifications.push({
        Title: "PAYE Annual Submission",
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