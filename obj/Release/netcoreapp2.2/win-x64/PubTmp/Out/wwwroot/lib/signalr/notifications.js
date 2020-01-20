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
    })
    .build();


connection.start()
    .then(function () {
        console.log("connected");
    })
    .catch(function (err) {
        return console.error(err.toString());
    });


// PIT OnSave
connection
    .on("pitsavenotification", (message) => {
        console.log("pitsavenotification", { message });
    });


// PIT OnSave
connection
    .on("whtTransactionsavenotification", (message) => {
        console.log("whtTransactionsavenotification", { message });
    });


// PIT OnSave
connection
    .on("whVatTransactionsavenotification", (message) => {
        console.log("whVatTransactionsavenotification", { message });
    });


// PIT OnSave
connection
    .on("whVatReturnsavenotification", (message) => {
        console.log("whVatReturnsavenotification", { message });
    });


// PIT OnSave
connection
    .on("whtReturnsavenotification", (message) => {
        console.log("whtReturnsavenotification", { message });
    });


// ----- Connection Management
connection
    .onreconnecting((error) => {
        console.assert("onreconnecting", connection.state === signalR.HubConnectionState.Reconnecting);
        console.log("trying to reconnect now so wait");
        console.log("connection lost totally");
    })


connection
    .onreconnected((connectionId) => {
        console.assert("reconnected", connection.state === signalR.HubConnectionState.Connected);
        console.log(`Connection reestablished. Connected with connectionId "${connectionId}".`);
    })


connection
    .onclose((error) => {
        console.assert("onclose", connection.state === signalR.HubConnectionState.Disconnected);
        console.log(`Connection closed due to error "${error}". Try refreshing this page to restart the connection.`);
    });


/*
public Task SendPitReturnMessageToCaller(string message)
{
    return Clients.Caller.SendAsync("pitsavenotification", message);
}
        public Task SendWhtTransactionMessageToCaller(string message)
{
    return Clients.Caller.SendAsync("whtTransactionsavenotification", message);
}
        public Task SendWhVatTransactionMessageToCaller(string message)
{
    return Clients.Caller.SendAsync("whVatTransactionsavenotification", message);
}
        public Task SendWhVatReturnMessageToCaller(string message)
{
    return Clients.Caller.SendAsync("whVatReturnsavenotification", message);
}
        public Task SendWhtReturnMessageToCaller(string message)
{
    return Clients.Caller.SendAsync("whtReturnsavenotification", message);
}
*/