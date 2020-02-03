const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://psl-app-vm3/taxpayermonoapi/Notifications")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
            if (retryContext.elapsedMilliseconds < 60000) {
                // If we've been reconnecting for less than 60 seconds so far,
                // wait between 0 and 10 seconds before the next reconnect attempt.
                return Math.random() * 10000;
            } else {
                // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
                return null;
            }
        }
    }).build();

connection.start().then(function () {
    console.log("connected");
}).catch(function (err) {
    return console.error(err.toString());
});

// PIT OnSave
connection.on("pitsavenotification", (message) => {
    console.log("pitsavenotification", { message });

    /*
     applicationId: "d7ff15ea-1e01-4e79-b9e2-4db0bd8879d8"
message: "Pit Saved"
notificationId: "fbd46d65-522a-42ba-bac9-b894e8ce4329"
status: "U"
*/
    displayNotification("PIT Submitted", "http:psl-app-vm3/itaps-host/icons/iconx-pit.png", "New PIT Return");

    AppNotifications.push({
        Title: "PIT Returns",
        Message: message
    });

    SetAppNotifications();
});

// WHT Transaction OnSave
connection.on("whtTransactionsavenotification", (message) => {
    console.log("whtTransactionsavenotification", { message });
    AppNotifications.push({
        Title: "WHT Transaction",
        Message: message
    });
    SetAppNotifications();
});

// WHVAT Transaction OnSave
connection.on("whVatTransactionsavenotification", (message) => {
    console.log("whVatTransactionsavenotification", { message });
    AppNotifications.push({
        Title: "WHVAT Transaction",
        Message: message
    });
    SetAppNotifications();
});

// WHVAT Returns OnSave
connection.on("whVatReturnsavenotification", (message) => {
    console.log("whVatReturnsavenotification", { message });
    AppNotifications.push({
        Title: "WHVAT Returns",
        Message: message
    });
    SetAppNotifications();
});

// WHT Returns OnSave
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

var AppNotifications = [];
var SetAppNotifications = () => {
    if (AppNotifications && AppNotifications.length > 0) {
        let notification = "";
        for (let n = 0; n < AppNotifications.length; n++) {
            notification += `<div class="dropdown-item-text dropdown-item-text--lh">
                                <span class="text-secondary" id="NotificationTitle">${AppNotifications[n].Title}</span>
                                <span class="text-dark-gray" id="NotificationMessage">${AppNotifications[n].Message}</span>
                            </div>
                            <div class="dropdown-divider"></div>`;
        }

        $("#NotificationItems").html(notification);
        $("#NotificationCount").text(AppNotifications.length);
    }
}

(function () {

    console.log("Notification");

    if ("Notification" in window) {

        var permission = Notification.permission;

        if (permission === "denied" || permission === "granted") {
            return;
        }

        Notification.requestPermission();

    }
})();

var displayNotification = function (body, icon, title, link, duration) {
    var link = link || null;
    var duration = duration || 5000;

    var options = {
        body: body,
        icon: icon
    };

    var n = new Notification(title, options);

    if (link) {
        n.onclick = function () {
            window.open(link);
        };
    }

    setTimeout(n.close.bind(n), duration);
}