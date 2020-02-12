var serverUrl = $("#serverUrl").val();

var updateNotificationList = function (imgUrl, notificationObj) {
    let notification = "";
    notification += `<div class="dropdown-item-text dropdown-item-text--lh" style="display: inline-flex;">
                                <div><span><img src="${imgUrl}" width="40" height="40"></span></div>
                                <div style="padding-left: 5px;"><span class="" id="NotificationTitle" style="color: black;">${notificationObj.message}</span>
                                <span class="text-dark-gray" id="NotificationMessage">${notificationObj.applicationId}</span></div>
                            </div>
                            <div class="dropdown-divider"></div>`;

    $("#NotificationItems").prepend(notification);
};

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
};

(function () {

    if ("Notification" in window) {
        var permission = Notification.permission;

        if (permission === "denied" || permission === "granted") {
            return;
        }

        Notification
            .requestPermission()
            .then(function () {
                displayNotification("", `${serverUrl}/images/itaps.png`, "Notifications enabled");
            });
    }
})();
