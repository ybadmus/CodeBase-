// "use strict";


$(".modal").draggable({
    handle: ".modal-header"
});
(function () {
    'use strict';
    // Self Initialize DOM Factory Components
    domFactory.handler.autoInit()
    // Connect button(s) to drawer(s)
    var sidebarToggle = document.querySelectorAll('[data-toggle="sidebar"]')
    sidebarToggle = Array.prototype.slice.call(sidebarToggle)
    sidebarToggle.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            var selector = e.currentTarget.getAttribute('data-target') || '#default-drawer'
            var drawer = document.querySelector(selector)
            if (drawer) {
                drawer.mdkDrawer.toggle()
            }
        })
    })
    let drawers = document.querySelectorAll('.mdk-drawer')
    drawers = Array.prototype.slice.call(drawers)
    drawers.forEach((drawer) => {
        drawer.addEventListener('mdk-drawer-change', (e) => {
            if (!e.target.mdkDrawer) {
                return
            }
            document.querySelector('body').classList[e.target.mdkDrawer.opened ? 'add' : 'remove']('has-drawer-opened')
            let button = document.querySelector('[data-target="#' + e.target.id + '"]')
            if (button) {
                button.classList[e.target.mdkDrawer.opened ? 'add' : 'remove']('active')
            }
        })
    })

    // SIDEBAR COLLAPSE MENUS
    $('.sidebar .collapse').on('show.bs.collapse', function (e) {
        e.stopPropagation()
        var parent = $(this).parents('.sidebar-submenu').get(0) || $(this).parents('.sidebar-menu').get(0)
        $(parent).find('.open').find('.collapse').collapse('hide');
        $(this).closest('li').addClass('open');
    });
    $('.sidebar .collapse').on('hidden.bs.collapse', function (e) {
        e.stopPropagation()
        $(this).closest('li').removeClass('open');
    });
    // ENABLE TOOLTIPS
    $('[data-toggle="tooltip"]').tooltip()
    // PRELOADER
    window.addEventListener('load', function () {
        $('.preloader').fadeOut()
        domFactory.handler.upgradeAll()
    })
    
    $('[data-toggle="tab"]').on('hide.bs.tab', function (e) {
        $(e.target).removeClass('active')
    })
})()


$(document).ready(function () {

    //LOGGING OUT ACTION
    $("#LogOut, #mdlLogout, #LogMeOut").click(function () {
        localStorage.clear();
        // console.log("Logout", "Clicked");
    });


    //do these before any modal pops up
    $("#modal-declare").on('show.bs.modal', function () {
        $(this).find('input[type="checkbox"]').prop('checked', false);
        $(this).find(".transButtons").prop("disabled", true);
    });

    $("#verified").change(function () {
        $("#DeclarationSubmit").prop("disabled", $("#verified").is(':checked') ? false : true);
    });

});

// Load list of Tax Payers my account is Associated To
var TaxPayersAssociatedTo = [];
var LoadTaxPayersAssociatedTo = function () {
    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        TaxPayerId: $("#UserTaxPayerId").text()
    };

    var postData = JSON.stringify(dataModel);
    // console.log("LoadTaxPayersAssociatedTo", postData);
    
    // Call Local API
    var postUrl = `?handler=GetTaxPayersAssociated`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        // console.log('LoadTaxPayersAssociatedTo Data: ', data);
        if (data.status == "Successful") {
            var CurrentUserTIN = $("#UserTIN").text();
            var CurrentUserName = $("#UserFullName").text();
            var opts = `<option value="${CurrentUserTIN}">${CurrentUserName}</option>`;
            if (data.body.length > 0) {
                // Keep a copy of the list
                TaxPayersAssociatedTo = data.body;
                // Display in Select Options
                for (var b = 0; b < data.body.length; b++) {
                    opts += `<option value="${data.body[b].taxPayerTin}">${data.body[b].entityName}</option>`;
                }
                // console.log('opts Data: ', { opts });
            }
            $("#SelectedEntity").html(opts);
            $('#SelectEntityModal').modal('show');
        } else {
            toastr.warning(`Could not load your associations. Please try again shortly.`);
            // setTimeout(function () { window.location.reload(true); }, 1000);
        }
        // Hide Preloader
        $('body').hideLoading();
        $('#SelectEntityModal').modal('hide');

    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
        // Hide Preloader
        $('body').hideLoading();
    });

};


// Set the selected Tax Payer as the Active Tax Payer
var ActivateTaxPayer = function () {
    // console.log({ nameTIN });
    var SelectedEntityTIN = $("#SelectedEntity").val();
    var CurrentUserTIN = $("#UserTIN").text();
    var ActiveTaxPayerTIN = nameTIN.TIN;
    // Show Preloader
    $('body').showLoading();

    if (SelectedEntityTIN === ActiveTaxPayerTIN) {
        toastr.info(`No change detected. Tax Payer account selected is already active.`);
        $('body').hideLoading();
        $('#SelectEntityModal').modal('hide');
    } else if (SelectedEntityTIN === CurrentUserTIN) {
        var codes = ["ATR000", "ATR001", "ATR002", "ATR003", "ATR004", "ATR005"];
        nameTIN = {
            Id: $("#UserTaxPayerId").text(),
            TIN: CurrentUserTIN,
            Name: $("#UserFullName").text(),
            Office: "N/A",
            Codes: codes
        }
        SetUserSessionData(nameTIN);
        // console.log("User nameTIN: ", { nameTIN });

        // Set TaxPayer Details
        $("#TaxPayerName").val(nameTIN.Name);
        $("#TaxPayerName").text(nameTIN.Name);
        $("#TaxPayerTaxOffice").text(nameTIN.Office);

        // Bravo!
        toastr.success(`Tax Payer account has been setted successfully.`);
        $('body').hideLoading();
        $('#SelectEntityModal').modal('hide');
    } else {
        var GetSelectedTaxPayer = $.grep(TaxPayersAssociatedTo, function (obj) { return obj.taxPayerTin === SelectedEntityTIN; });
        var SelectedTaxPayer = GetSelectedTaxPayer[0];
        // console.log({ SelectedTaxPayer });

        var roles = SelectedTaxPayer.tap6;
        var codes = [];

        // Is Admin
        if (SelectedTaxPayer.isAdmin === "Y") {
            codes.push("ATR000");
        }

        // Get the associated role codes
        for (let c = 0; c < roles.length; c++) {
            codes.push(roles[c].roleCode);
        }
        localStorage.clear();
        nameTIN = {
            Id: SelectedTaxPayer.taxPayerId,
            TIN: SelectedTaxPayer.taxPayerTin,
            Name: SelectedTaxPayer.entityName,
            Office: "N/A",
            Codes: codes
        };
        SetUserSessionData(nameTIN);
        // console.log("Taxpayer nameTIN: ", { nameTIN });

        // Set TaxPayer Details
        $("#TaxPayerName").val(nameTIN.Name);
        $("#TaxPayerName").text(nameTIN.Name);
        $("#TaxPayerTaxOffice").text(nameTIN.Office);

        // Well done!
        toastr.success(`Tax Payer account has been setted successfully.`);
        $('body').hideLoading();
        $('#SelectEntityModal').modal('hide');
    }
    UpdateActivatedTaxPayer();
};

var CancelActivation = function () {
    $('#SelectEntityModal').modal('hide');
}

function GetAssociatedCodes(tin) {
    // console.log("TaxPayersAssociatedTo", TaxPayersAssociatedTo);
    var codes = [];
    var GetTaxPayerAssociatedTo = $.grep(TaxPayersAssociatedTo, function (obj) { return obj.taxPayerTin == tin; });
    var TaxPayerAssociatedTo = GetTaxPayerAssociatedTo[0];
    for (let t = 0; t < TaxPayerAssociatedTo.tap6.length; t++) {
        codes.push(TaxPayerAssociatedTo.tap6[t].roleCode);
    }    
    return codes.join(":");
}

var UpdateActivatedTaxPayer = () => {

    // If TaxPayer Office is N/A
    if (nameTIN.Office === "N/A") {
        GetActivatedTaxPayerData(nameTIN);
    }

    // Update other loaded Taxpayer Details
    if (typeof GetTaxPayerData === "function") {
        GetTaxPayerData();
    }
}


/*
var connection = new signalR.HubConnectionBuilder().withUrl(NotificationUrl).build();

//Disable send button until connection is established
//document.getElementById("sendButton").disabled = true;

connection.on("pitsavenotification", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    //document.getElementById("messagesList").appendChild(li);
    //console.log({li})
});

connection.start().then(function () {
    //document.getElementById("sendButton").disabled = false;
    //console.log("signalR connected");
}).catch(function (err) {
    return console.error(err.toString());
    });

*/