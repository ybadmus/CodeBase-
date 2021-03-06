﻿var serverUrl = $("#serverUrl").val();
var userid = $("#userId").val();
var urlTaxOffice = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID`;
var urlAssignedMenu = `${serverUrl}api/Users/GetAllMenusByUserId`;
var urlLoadUserDetails = `${serverUrl}api/Users/GetUserDetailsById`;
var timerConstant = 60 * 5;
var timeActivity;
var thirtySecondsTimer;
var globalTimeTracker;
var globalTokenRenewer;

$(document).ready(function () {
    globalTokenRenewer = setInterval(function () { refreshTokenManually() }, 240000);
    loadTaxOfficeName();
    InitializeTimer();
    loadMenus();
});

var menuMapper = function (url) {
    location.href = serverUrl + url;
}

var loadTaxOfficeName = function () {
    if (!sessionStorage.getItem("assignedTaxOfficers"))
        apiCaller(urlTaxOffice, "GET", "", userTaxOffice);
    else
        userTaxOffice(JSON.parse(sessionStorage.getItem("assignedTaxOfficers")));
};

var loadMenus = function () {
    if (!sessionStorage.getItem("assignedMenus"))
        apiCaller(urlAssignedMenu, "GET", "", loadAssignedRoled);
    else
        buildTree(JSON.parse(sessionStorage.getItem("assignedMenus")));
};

var loadAssignedRoled = function (resp) {
    sessionStorage.setItem("assignedMenus", JSON.stringify(resp));
    buildTree(resp);
};

var buildTree = function (menus) {

    var listOfMenus = [];
    var listOfSubMenu = [];
    var listOfNestedSubMenu = [];

    if (menus) {
        for (var i = 0; i < menus.length; i++) {

            if (menus[i].hLevel === 0) {
                listOfMenus.push(menus[i]);
            };

            if (menus[i].hLevel === 1) {
                listOfSubMenu.push(menus[i]);
            };

            if (menus[i].hLevel === 2) {
                listOfNestedSubMenu.push(menus[i]);
            };
        };

        for (var i = 0; i < listOfSubMenu.length; i++) {
            for (var j = 0; j < listOfNestedSubMenu.length; j++) {
                if (listOfSubMenu[i].pkId === listOfNestedSubMenu[j].iParent) {
                    listOfSubMenu[i].children.push(listOfNestedSubMenu[j]);
                }
            }
        };

        for (var i = 0; i < listOfMenus.length; i++) {
            for (var j = 0; j < listOfSubMenu.length; j++) {
                if (listOfMenus[i].pkId === listOfSubMenu[j].iParent) {
                    listOfMenus[i].children.push(listOfSubMenu[j]);
                }
            }
        }

        loadUserMenus(listOfMenus);
    };

};

var loadUserMenus = function (menu) {
    var homeLink = "";

    if (window.location.hostname === "localhost")
        homeLink = "/home";
    else if (window.location.hostname === "psl-app-vm3")
        homeLink = "/itaps-host/home";
    else if (window.location.hostname === "tax.gra-itaps.com") {
        if (window.location.href.split('/').indexOf('itaps-host-test') > 0)
            homeLink = "/itaps-host-test/home";
        else if (window.location.href.split('/').indexOf('itaps-host') > 0)
            homeLink = "/itaps-host/home";
        else return toastr.error("Invalid domain name, please consult your Admin!");
    }
    else
        homeLink = "/itaps-host/home";

    var output = [];
    output.push('<ul class="sidebar-menu">');
    output.push('<li class="sidebar-menu-item home">' +
        '<a class= "sidebar-menu-button" href="' + homeLink + '" >' +
        '<i class="sidebar-menu-icon sidebar-menu-icon--left material-icons">home</i>' +
        '<span class="sidebar-menu-text">Home</span></a></li>');

    for (var i = 0; i < menu.length; i++) {
        output.push('<li class="sidebar-menu-item ' + menu[i].menuName.toLowerCase().split(' ').join('') + '">' +
            '<a class="sidebar-menu-button"  data-toggle="collapse" href="#' + menu[i].link + '">' +
            '<i class="sidebar-menu-icon sidebar-menu-icon--left material-icons">home</i>' +
            '<span class="sidebar-menu-text">' + menu[i].menuName + '</span>' +
            '<span class="ml-auto sidebar-menu-toggle-icon"></span></a>');

        if (menu[i].children && menu[i].children.length !== 0) {
            if (menu[i].link.toLowerCase() == "codes_menu")
                output.push('<ul class="sidebar-submenu collapse" id="' + menu[i].link + '">');
            else
                output.push('<ul class="sidebar-submenu collapse" id="' + menu[i].link + '">');

            let children = menu[i].children;

            for (var j = 0; j < children.length; j++) {

                if (children[j].children && children[j].children.length !== 0) {
                    let subChild = children[j].children;

                    output.push('<li class="sidebar-menu-item"><a class="sidebar-menu-button" data-toggle="collapse" href="#' + children[j].link + '">' +
                        '<span class= "sidebar-menu-text" >' + children[j].menuName + '</span>' +
                        '<span class="ml-auto d-flex align-items-center">' +
                        '<span class="sidebar-menu-toggle-icon"></span>' +
                        '</span></a>');

                    output.push('<ul class="sidebar-submenu collapse " id="' + children[j].link + '">');

                    for (var k = 0; k < subChild.length; k++) {
                        output.push('<li class="sidebar-menu-item">' +
                            '<a class= "sidebar-menu-button" style="pointer: cursor;" onclick="menuMapper(\'' + subChild[k].link + '\')">' +
                            '<span class="sidebar-menu-text" style="cursor: pointer;">' + subChild[k].menuName + '</span>' +
                            '</a></li>');
                    }

                    output.push("</ul></li>");

                } else {

                    output.push('<li class="sidebar-menu-item ' + children[j].menuName.toLowerCase().split(' ').join('') + '">' +
                        '<a class="sidebar-menu-button" onclick="menuMapper(\'' + children[j].link + '\')">' +
                        '<span class="sidebar-menu-text" style="cursor: pointer;">' + children[j].menuName + '</span>' +
                        '</a></li>');

                }

            }

            output.push("</ul>");
        }

        output.push("</li>");
    };

    output.push("</ul>");
    $("#menusHolder").html(output.join(''));

};

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
        }
    });
};

var userTaxOffice = function (resp) {

    if (!sessionStorage.getItem("assignedTaxOffices"))
        sessionStorage.setItem("assignedTaxOffices", JSON.stringify(resp));
    setTaxOfficeName(resp);
    loadTaxOffices(resp);
};

var setTaxOfficeName = function (resp) {

    if (resp) {
        if (resp.length > 1) {
            $("#adminTaxOffice").text("Head Office");
        }
        else if (resp.length == 1) {
            $("#adminTaxOffice").text(resp[0].taxOfficeName);
            //For notification purposes;
            oneOfficeAssigned = true;
        }
    } else {
        toastr.info("No Tax Office assigned to this user!");
    }
};

var loadTaxOffices = function (listOfTaxOffices) {

    var output = "";

    listOfTaxOffices.sort((a, b) => (a.taxOfficeName > b.taxOfficeName) - (a.taxOfficeName < b.taxOfficeName));

    output += '<option value="" selected>Choose office</option>';
    for (var i = 0; i < listOfTaxOffices.length; i++) {
        output = output + '<option value="' + listOfTaxOffices[i].taxOfficeId + '" >' + listOfTaxOffices[i].taxOfficeName + '</option>';
    }

    output = output;
    $("#listOfTaxOffices").html(output);
    $(".listOfTaxOffices").html(output);
};

var loadUserDetials = function (callbackProcess) {

    var url = urlLoadUserDetails + "?userId=" + $("#userId").val();
    apiCaller(url, "GET", "", callbackProcess)
};

$('.yearsDropdown').ready(function () {

    var beginYear = (new Date()).getFullYear();
    $('.yearsDropdown').append('<option value="0">Select Year</option>');
    for (var i = beginYear; i >= 1990; i--) {
        $('.yearsDropdown').append($('<option/>', {
            value: i,
            text: i
        }));
    }
});

var validateSearchEntry = function () {
    let searchItem = $("#searchItem").val().trim();
    if (!searchItem.match(/\S/) || activeTaxOffice === "")
        return false;
    else
        return true;
};

var testNullOrEmpty = function (value) {
    if (!value || value === "null") {
        return "N/A";
    } else
        return value;
};

function noMovement() {

    if (globalTimeTracker == 31) {

        display = document.querySelector('#ScreenTimeOutView');
        display.textContent = "00" + " : " + (globalTimeTracker >= 10 ? globalTimeTracker : "0" + globalTimeTracker);
        $('#ScreenTimeOutModal').modal('show');

        clearInterval(timeActivity);

        thirtySecondsTimer = setInterval(function () {

            globalTimeTracker--;
            display.textContent = "00" + " : " + (globalTimeTracker >= 10 ? globalTimeTracker : "0" + globalTimeTracker);
            if (globalTimeTracker == 1) {

                $('#ScreenTimeOutModal').modal('hide');
                var serverUrl = $("#serverUrl").val();
                localStorage.clear();
                sessionStorage.clear();
                window.location = `${serverUrl}Home/Logout`;
            }

        }, 1000);

    } else {

        globalTimeTracker--;
    }
}

function resetglobalTimeTracker() {

    if (globalTimeTracker <= 31) {

        return;
    }

    globalTimeTracker = timerConstant;
}


var InitializeTimer = function () {

    globalTimeTracker = timerConstant;
    timeActivity = setInterval(function () { noMovement() }, 1000);

    $('html').mousemove(function (event) {

        resetglobalTimeTracker();
    });

    $('html').keypress(function (event) {

        resetglobalTimeTracker();
    });
};

$("#logOut, #mdlLogout, #logMeOut").click(function () {

    localStorage.clear();
    sessionStorage.clear();
});

var continueToStay = function () {

    clearInterval(thirtySecondsTimer);
    InitializeTimer();
    $('#ScreenTimeOutModal').modal('hide');
    refreshTokenManually();
};

var refreshTokenManually = function () {

    var url = `${serverUrl}api/CodesApi/REG`;
    apiCaller(url, "GET", "", isUserAuthenticated)
};

var isUserAuthenticated = function (resp) {

    $('html').hideLoading();

    if (resp.length > 0)

        return;
    else {

        toastr.warning("Your session has timed out, you will be logged out automatically");
        window.location = `${serverUrl}Home/Logout`;
    }
};