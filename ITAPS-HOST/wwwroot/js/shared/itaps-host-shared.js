﻿var serverUrl = $("#serverUrl").val();
var userid = $("#userId").val();
var urlTaxOffice = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID`;
var urlAssignedMenu = `${serverUrl}api/Users/GetAllMenusByUserId`;

$(document).ready(function () {
    loadTaxOfficeName();
    loadMenus();
});

var menuMapper = function (url) {
    location.href = serverUrl + url;
}

var loadTaxOfficeName = function () {
    apiCaller(urlTaxOffice, "GET", "", userTaxOffice);
};

var loadMenus = function () {
    apiCaller(urlAssignedMenu, "GET", "", loadAssignedRoled);
};

var loadAssignedRoled = function (resp) {
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
                if (listOfSubMenu[i].pkID === listOfNestedSubMenu[j].iParent) {
                    listOfSubMenu[i].children.push(listOfNestedSubMenu[j]);
                }
            }
        };

        for (var i = 0; i < listOfMenus.length; i++) {
            for (var j = 0; j < listOfSubMenu.length; j++) {
                if (listOfMenus[i].pkID === listOfSubMenu[j].iParent) {
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
    else if (window.location.hostname === "tax.gra-itaps.com")
        homeLink = "/itaps-host-test/home";
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

var loadUserTiles = function (tiles) {

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

$('.yearsDropdown').ready(function () {
    var beginYear = (new Date()).getFullYear();
    for (var i = beginYear; i >= 1990; i--) {
        $('.yearsDropdown').append($('<option/>', {
            value: i,
            text: i
        }));
    }
});
