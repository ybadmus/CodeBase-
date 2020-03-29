var serverUrl = $("#serverUrl").val();
var userid = $("#userId").val();
var urlTaxOffice = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;
var oneOfficeAssigned = false;
var mainNotificationView = false;

$(document).ready(function () {

    apiCaller(urlTaxOffice, "GET", "", bootstrapNotifications);
});

var apiCaller = function (url, type, data, callback) {
    $('html').showLoading();

    $.ajax({
        url: url,
        type: type,
        crossDomain: true,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        headers: {
        },
        dataType: 'json',
        success: function (response) {
            if (callback) {
                callback(response.body);
            };
            $('html').hideLoading();
        },
        error: function (error) {
            $('html').hideLoading();
            //toastr.error('An error occured');
        }
    });
};

var prependListNotifications = function (resp) {

    let notification = "";
    let imgUrl = imgAndDetailsUrl(resp).imgUrl;
    let imgDetails = imgAndDetailsUrl(resp).detailsUrl;

    notification += '<a href="' + `${imgDetails}` + '"><div class="dropdown-item-text dropdown-item-text--lh notifiUnread" id="notificationItem" style="background-color: #edf2fa;"><div>' +
        '<img src = "' + `${imgUrl}` + '" width = "48" height = "48" ></div><div style="padding-left: 5px; padding-right: 5px; padding-top: 4px">' +
        '<div class="" style="font-size: 14px; line-height: 1.10rem;"><span style="font-weight: 600">' + resp.userName + "</span><span style='font-weight: 500;'> (" + resp.userTIN + ") </span><span> submitted a </span><span style='font-weight: 600'>" + resp.taxType + " " + resp.transactionType + '</span><span class="oneOffice"> to </span>' +
        '<span class="oneOffice">  ' + resp.taxOfficeName + "</span><span style='font-weight: 600'> on </span><span style='color: #3578E5;'>" + resp.submittedDate + '.</span></div></div></div></a>';

    $("#NotificationItems").prepend(notification);
};

var loadNotificatonsAssignedToUser = function (offices) {
    if (!sessionStorage.getItem("notifications")) {
        if (offices) {
            for (var i = 0; i < offices.length; i++) {
                var loadNotificationsUrl = `${serverUrl}api/Notification/GetAllNotifications?taxOfficeId=${offices[i].taxOfficeId}`
                apiCaller(loadNotificationsUrl, 'GET', '', loadDropdown);
            }
        }
    } else {
        let output =loadDropdownView(JSON.parse(sessionStorage.getItem("notifications")));
        $("#loader_div").hide();
        $("#NotificationItems").prepend(output);
    }
};

var joinGroups = function (taxOffices) {

    if (taxOffices) {
        for (var i = 0; i < taxOffices.length; i++) {
            connection.invoke("JoinNotificationGroup", taxOffices[i].taxOfficeId).catch(function (err) {
                return console.error(err.toString());
            });
        }
    }
};

var prependNotificationLocalStorage = function (newNotification) {
    var localStorageNotifications = JSON.parse(sessionStorage.getItem("notifications"));
    localStorageNotifications.unshift(newNotification);
    sessionStorage.setItem("notifications", JSON.stringify(sessionStorageNotifications));
};

var imgAndDetailsUrl = function (resp) {
    var imgUrl = "";
    var detailsUrl = "";

    if (resp.taxType === "PIT") {
        imgUrl = `${serverUrl}icons/iconx-pit.png`;

        if (resp.transactionType === "Final Return") {
            detailsUrl = `${serverUrl}pit/return?type=annualreturn&pkId=${resp.applicationId}`;
        }
        else if (resp.transactionType === "Provisional Return") {
            detailsUrl = `${serverUrl}pit/estimate?type=provisional&pkId=${resp.applicationId}`;
        }
    }
    else if (resp.taxType === "PAYE") {
        imgUrl = `${serverUrl}icons/iconx-payee.png`;
    }

    return {
        imgUrl: imgUrl,
        detailsUrl: detailsUrl
    };
}

var loadDropdownView = function (resp) {
    var output = "";

    for (var i = 0; i < resp.length; i++) {

        var notificationUrls = imgAndDetailsUrl(resp[i]);
        var imgUrl = notificationUrls.imgUrl;
        var detailsUrl = notificationUrls.detailsUrl;

        if (resp[i].status === "U") {

            output = output + '<a href="' + `${detailsUrl}` + '"><div class="dropdown-item-text dropdown-item-text--lh notifiUnread" id="notificationItem" style="background-color: #edf2fa;"><div>' +
                '<img src = "' + `${imgUrl}` + '" width = "48" height = "48" ></div><div style="padding-left: 5px; padding-right: 5px; padding-top: 4px">' +
                '<div class="" style="font-size: 14px; line-height: 1.10rem;"><span style="font-weight: 600">' + resp[i].userName + "</span><span style='font-weight: 500;'> (" + resp[i].userTIN + ") </span><span> submitted a </span><span style='font-weight: 600'>" + resp[i].taxType + " " + resp[i].transactionType + '</span><span class="oneOffice"> to </span>' +
                '<span class="oneOffice">  ' + resp[i].taxOfficeName + "</span><span style='font-weight: 600'> on </span><span style='color: #3578E5'>" + resp[i].dateSubmitted + '.</span></div></div></div></a>';

        } else if (resp[i].status === "R") {

            output = output + '<a href="' + `${detailsUrl}` + '"><div class="dropdown-item-text dropdown-item-text--lh notifiRead" id="notificationItem"><div>' +
                '<img src = "' + `${imgUrl}` + '" width = "48" height = "48" ></div><div style="padding-left: 5px; padding-right: 5px; padding-top: 4px">' +
                '<div class="" style="font-size: 14px; line-height: 1.10rem;"><span style="font-weight: 600">' + resp[i].userName + "</span><span style='font-weight: 500;'> (" + resp[i].userTIN + ") </span><span> submitted a </span><span style='font-weight: 600'>" + resp[i].taxType + " " + resp[i].transactionType + '</span><span class="oneOffice"> to </span>' +
                '<span class="oneOffice">  ' + resp[i].taxOfficeName + "</span><span style='font-weight: 600'> on </span><span style='color: #3578E5'>" + resp[i].dateSubmitted + '.</span></div></div></div></a>';

        };
    };

    return output;
};

var loadDropdown = function (resp) {
    let output = "";

    if (resp) {
        output = loadDropdownView(resp);
        $("#loader_div").hide();
        $("#NotificationItems").prepend(output);
        addToLocalStorageArray("notifications", resp);
    }
};

var addToLocalStorageArray = function (name, value) {

    var existing = sessionStorage.getItem(name);
    if (!existing)
        existing = [];

    existing = existing.concat(value);
    sessionStorage.setItem(name, JSON.stringify(existing));

};

var bootstrapNotifications = function (resp) {

    joinGroups(resp);
    loadNotificatonsAssignedToUser(resp);
};

var displayNotification = function (body) {

    var construcetedMessage = body.userName + "(" + body.userTIN + ")" + " has submitted " + body.taxType + " " + body.transactionType + " to " + body.taxOfficeName;
    var header = body.taxType + " " + body.transactionType;

    var options = {
        title: header,
        body: construcetedMessage,
        icon: imgAndDetailsUrl(body).imgUrl,
    };

    var n = new Notification(header, options);
    var urlLink = imgAndDetailsUrl(body).detailsUrl;

    if (urlLink) {
        n.onclick = function () {
            window.open(urlLink);
        };
    }

    setTimeout(n.close.bind(n), 3000)
};

$("#notificationView").on('click', '.notifyMain', function (event) {
    var appId = "";
    var appType = "";
    var detailsUrl = "";

    if (event.target.offsetParent.id === "") {
        appId = event.target.id.split("&")[0];
        appType = event.target.id.split("&")[1];
    } else {
        appId = event.target.offsetParent.id.split("&")[0];
        appType = event.target.offsetParent.id.split("&")[1];
    }

    sessionStorage.setItem("detailsId", appId);

    if (appType === "Final Return")
        detailsUrl = `${serverUrl}pit/return?type=annualreturn&pkId=${appId}`;
    else if (appType === "Final Estimates")
        detailsUrl = `${serverUrl}pit/estimate?type=provisional&pkId=${appId}`;

    window.location.replace(detailsUrl);
});

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
