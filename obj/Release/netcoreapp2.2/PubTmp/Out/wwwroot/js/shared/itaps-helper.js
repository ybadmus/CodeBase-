// Call To Local Server API Configuration
var AppServerUrl = $("#AppServerUrl").val();
var NotificationUrl = $("#NotificationUrl").val();
var userTIN = $("#UserTIN").text();
var pageUrl = window.location.pathname;
var userURLS = JSON.parse(localStorage.getItem("userURLS"));
var sessionData = JSON.parse(localStorage.getItem("sessionData"));
// Get Current Date
var CurrentDate = new Date().toLocaleDateString();
// Define NIL Data
var NILDisplay = "NIL";
var NILValue = 0.00;
var NullDisplay = "";
var NullValue = null;

$.ajaxSetup({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'RequestVerificationToken': $('input:hidden[name="__RequestVerificationToken"]').val()
    }
});

$(document).ready(() => {
    
    // Trigger DataPicker
    //$(".DatePicker").flatpickr({
    //    dateFormat: "d-m-Y"
    //});

    // Past Date Operations
    //$(".PastDatePicker").flatpickr({
    //    maxDate: "today",
    //    dateFormat: "d-m-Y"
    //});

    // Future Date Operations
    //$(".FutureDatePicker").flatpickr({
    //    minDate: "today",
    //    dateFormat: "d-m-Y"
    //});

});

/********** ACCORDION SECTION **********/
$(function() {
    $('.accordion').find('.accordion__title').click(function() {
        $(this).toggleClass('active');
        $(this).next().slideToggle('fast');
        $('.accordion__content').not($(this).next()).slideUp('fast');
        $('.accordion__title').not($(this)).removeClass('active');
    });
});

/* PAGE TITLE */
function pageTitle(pgValue) {
    //var selectedEntity = JSON.parse(localStorage.getItem("selectedEntity"));
    $('#pgHeader, #pgCrumb, .PageTitle').html(`${pgValue}`);
    document.title = pgValue;
}

function UUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function revealCurrentMenu(URLpath) {
    let splittedPath = URLpath.split(`/`);
    if (splittedPath.length <= 2) {
        $(`.sidebar-menu-item.${splittedPath[splittedPath.length - 1]}`).addClass('active');
        return;
    }

    $(`.${splittedPath[splittedPath.length - 2]}`).children('ul').children(`li.${splittedPath[splittedPath.length-1]}`).addClass(`active`);
    $(`.sidebar-menu-item.${splittedPath[splittedPath.length - 2]}`).addClass(`active ${splittedPath[splittedPath.length - 1] ? 'open' : ''}`);
}

//menu indicator
//revealCurrentMenu(window.location.pathname);

//Example value = '500' standard='en' or 'fr' if you want decimal places dec must be > 0
function moneyInTxt(value, standard, dec = 2) {
    nf = new Intl.NumberFormat(standard, {
        minimumFractionDigits: dec,
        maximumFractionDigits: 2
    });
    return nf.format(Number(value) ? value : 0.00);
}


function commaRemover(value) {
    value = value.replace(/,/g, '');
    return parseFloat(value);
}

$('.formatInputComma').focusout(function() {
    $(this).val(commaRemover($(this).val())); //first, clean value by removing all commas
    $(this).val(moneyInTxt($(this).val(), 'en', 2));
});


$('.formatInputComma').focus(function() {
    $(this).val(Number($(this).val()) === 0 ? "" : commaRemover($(this).val()));
});

$('.formatInputComma').keydown(function(e) {
    if (!e.key.match(/^[0-9.()]+$/) && Number(e.key.length) === 1) {
        e.preventDefault();
        return;
    }
});

$('.yearsDropdown').ready(function() {
    var beginYear = (new Date()).getFullYear();
    for (var i = beginYear; i >= 1990; i--) {
        $('.yearsDropdown').append($('<option/>', {
            value: i,
            text: i
        }));
    }
});

// Verified Modal Timer
$('.modal-auto-clear').on('shown.bs.modal', function() {
    var timer = $(this).data('timer') ? $(this).data('timer') : 7000;
    $(this).delay(timer).fadeOut(200, function() {
        $(this).modal('hide');
    });
});

/*NUMBER TO MONEY [ALTERNATE] */
function NumberToMoney(value) {
    var money = moneyInTxt(value, 'en', 2); //value.formatMoney(2, ',', '.');
    if (value < 0) {
        var removeSign = money.replace('-', '');
        var addBrackets = '(' + removeSign + ')';
        money = addBrackets;
    }
    return money;
}

/* MONEY TO TEXT [ALTERNATE] */
function MoneyToText(money) {
    // Check and convert negative value
    var openBracket = "(";
    var closeBracket = ")";
    var text = money.replace(/,/g, ""); // Remove all comma
    if (money.includes(openBracket) || money.includes(closeBracket)) {
        // If Negative money, remove brackets and precede minus sign
        var removeOpenBracket = text.replace(openBracket, "");
        var removeCloseBracket = removeOpenBracket.replace(closeBracket, "");
        text = "-" + removeCloseBracket + "";
    }
    return NILToZero(text);
}

/* MONEY TO NUMBER [ALTERNATE] */
function MoneyToNumber(money) {
    // Check and convert negative value
    var openBracket = "(";
    var closeBracket = ")";
    var text = money.replace(/,/g, "");
    if (money.includes(openBracket) || money.includes(closeBracket)) {
        // If Negative money, remove brackets and precede with minus sign
        var removeOpenBracket = text.replace(openBracket, "");
        var removeCloseBracket = removeOpenBracket.replace(closeBracket, "");
        text = "-" + removeCloseBracket + "";
    }
    // Convert to Negative Number
    var number = Number(NILToZero(text));
    return number;
}

// Convert NIL to 0.00
function NILToZero(value) {
    return value === NILDisplay ? NILValue : value;
}

var msg = {
    success: "Data submitted successfully",
    conflict: "A conflict occurred, please refresh page and try again",
    unauthorized: "Unauthorized. Please login and try again.",
    emailNotice: "<br /><br />You will be notified via email shortly",
    notFound: "No match found",
    fail: "Sorry, something unexpected happened. Please refresh page and try again",
    contactAdmin: "<br /><br />Contact Admin if this persists.",
    passwordChange: "Password changed successfully",
    oldpassword: "Your current password is not correct"
};

//All ajax requests are made through this
function newAjaxRequest(url, method, data = "") {
    return $.ajax({
            url: url,
            method: method,
            crossDomain: true,
            data: JSON.stringify(data)
        }).done(function() {
            $('body').hideLoading();
        })
        .fail(function (xhr) {
            $('body').hideLoading();
            switch (xhr.status) {
                case 401:
                    toastr.info(msg.unauthorized);
                    break;
                case 404:
                    toastr.info(msg.notFound);
                    break;
                case 409:
                    toastr.info(msg.conflict);
                    break;
                default:
                    toastr.info(msg.fail + msg.contactAdmin);
                    break;
            }
        });
}


function apiCaller (url, type, data, callback) {
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
            toastr.error('An error occured');
        }
    });
};

//capitalize words
function ucwords(str, force = true) {
    str = force ? str.toLowerCase() : str;
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        function (firstLetter) {
            return firstLetter.toUpperCase();
        });
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

// Automatic Logout Timer
var logoutTimer;
var startTimer  = function (duration, display) {
    logoutTimer = 0;
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        console.log({ duration, diff, minutes, seconds });

        display.textContent = minutes + ":" + seconds;

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }

        // Show TimeOut Model;
        if (diff === 31) {
            $('#ScreenTimeOutModal').modal('show');
        }

        // Logout
        if (diff === 1) {
            var serverUrl = $("#serverUrl").val();
            window.location = `${serverUrl}/Home/Logout`;
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    logoutTimer = setInterval(timer, 1000);
}


// OnLoad events listener
window.onload = function () {
    InitializeTimer();
};

// Selected web page events listener
var webEvents = ['keyup', 'touchend', 'click'];
webEvents.forEach(function (eventName) {
    window.addEventListener(eventName, function () {
        // Modal is not shown
        if (!($("#ScreenTimeOutModal").data('bs.modal') || {})._isShown) {
            clearInterval(logoutTimer);
            InitializeTimer();
        }
    }, true);
});

// Initialize the timer
var InitializeTimer = function () {
    var fiveMinutes = 60 * 5, // 60 * 5 => 5mins
        display = document.querySelector('#ScreenTimeOutView');
     startTimer(fiveMinutes, display); // Comment|Uncomment this line to Disable|Enable timer.
}

// I want to continue staying on page.
var ContinueToStay = function () {
    // Reload current page.
    //window.location.reload();
    clearInterval(logoutTimer);
    InitializeTimer();

    var serverUrl = $("#serverUrl").val();
    var url = `${serverUrl}api/TCC/RenewToken`;
    apiCaller(url, "GET");

    $('#ScreenTimeOutModal').modal('hide');
}

function RoundTo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

/************* SORT BY [DATE] ************/
// Option I
(function () {
    if (typeof Object.defineProperty === 'function') {
        try { Object.defineProperty(Array.prototype, 'sortBy', { value: sb }); } catch (e) { }
    }
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

    function sb(f) {
        for (var i = this.length; i;) {
            var o = this[--i];
            this[i] = [].concat(f.call(o, o, i), o);
        }
        this.sort(function (a, b) {
            for (var i = 0, len = a.length; i < len; ++i) {
                if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
            }
            return 0;
        });
        for (var i = this.length; i;) {
            this[--i] = this[i][this[i].length - 1];
        }
        return this;
    }
})();


var IsEmailValid = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
