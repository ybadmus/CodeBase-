// Back Button Click
var MoveBack = function() {
    if (CurrentTabId > 0) {
        CurrentTabId--;
    }
    ActivateTab();
}

// Next Button Click
var MoveNext = function() {
    if (CurrentTabId < 5) {
        CurrentTabId++;
    }
    ActivateTab();
}

// Define Tabs (list)

var Tabs = [
    { Id: 0, TabId: "generalInfo-tab", ContentId: "generalInfo", BackO: false, Back: false, Next: false, NextO: true },
    { Id: 1, TabId: "PartnershipSheet-tab", ContentId: "PartnershipSheet", BackO: false, Back: true, Next: true, NextO: false },
    { Id: 2, TabId: "BusinessInfoSheet-tab", ContentId: "BusinessInfoSheet", BackO: false, Back: true, Next: true, NextO: false },
    { Id: 3, TabId: "incomeStatement-tab", ContentId: "IncomeStatement", BackO: false, Back: true, Next: true, NextO: false },
    { Id: 4, TabId: "partnershipAdjustment-tab", ContentId: "PartnershipAdjustment", BackO: false, Back: true, Next: true, NextO: false },
    { Id: 5, TabId: "balanceSheet-tab", ContentId: "BalanceSheet", BackO: true, Back: false, Next: false, NextO: false },
];

// Set Activate Tab and Control its elements
var CurrentTabId = 0;
ActivateTab();

// Activate the Current Tab
function ActivateTab() {

    // Disable All Tabs
    for (var j = 0; j < Tabs.length; j++) {
        var tabId = Tabs[j].TabId;
        var contentId = Tabs[j].ContentId;
        $(`#${tabId}`).removeClass("active").addClass("disabled");
        $(`#${contentId}`).removeClass("active show");
    }

    // Hide All Buttons
    $("#rowBack").prop('hidden', true);
    $("#rowBackNext").prop('hidden', true);
    $("#rowNext").prop('hidden', true);

    $("#btnSubmit").prop('hidden', true);
    $("#btnSaveContinue").prop('hidden', true);

    // Get CurrentTab Object
    var CurrentTab = Tabs.filter(obj => {
        return obj.Id === CurrentTabId
    })
    var ActiveTab = CurrentTab[0];

    // Activate the tab with CurrentTabId
    $(`#${ActiveTab.TabId}`).addClass("active").removeClass("d isabled");
    $(`#${ActiveTab.ContentId}`).addClass("active show");

    // Control Active Tab Elements
    if (CurrentTabId === 0) {
        $("#rowNext").removeAttr("hidden");
    } else if (CurrentTabId == 5) {
        $("#rowBack").removeAttr("hidden");
    } else {
        $("#rowBackNext").removeAttr("hidden");
    }


    if (CurrentTabId < 5) {
        $("#btnSaveContinue").removeAttr("hidden");
    } else {
        $("#btnSubmit").removeAttr("hidden");
    }
    ControlActiveTab();
}


function ControlActiveTab() {
    // let activeTabId = document.querySelector('.tab-content .tab-pane.active').id;
    // Get CurrentTab Object
    var CurrentTab = Tabs.filter(obj => {
        return obj.Id === CurrentTabId
    })
    var ActiveTab = CurrentTab[0];
    // console.log("ActiveTab", ActiveTab);
}






// $('#btnSubmit').on('click', function() {
//     $('#modal-declare').modal('show');
// });

/*



function CheckInputComplete() {
    if ($("#stockInventories").val() == "") {
        return false;
    }
    return true;
}

$('#btnSubmit').on('click', function() {
    console.log(CheckInputComplete())
    if (CheckInputComplete()) {
        $('#modal-declare').modal('show');
    } else {
        toastr.warning("Please Fill All Fields to Submit!");
    }

});

var isValid;
$("input").each(function() {
   var element = $(this);
   if (element.val() == "") {
       isValid = false;
   }
});

$('#form_submit_btn').click(function(){
    $('input').each(function() {
        if(!$(this).val()){
            alert('Some fields are empty');
           return false;
        }
    });
});

var inputValidate = $("#stockInventories, #receivables, #cashBankBalance, #prePayment, #otherCurrentAssets, #land, #building, #furnitureEquipments, #motorVehicles, #otherAssets, #billPayable, #loansOverdraft, #accurals, #otherPayables, #otherPayables, #capitalBF, #netProfit, #drawings, #businessIncomeLocal, #businessIncomeExport, #investmentIncome, #otherIncome").val();

var emptyValue = $("#stockInventories").val() == "" && $("#receivables").val() == "" && $("#cashBankBalance").val() == "" && $("#prePayment").val() == "" && $("#otherCurrentAssets").val() == "" && $("#land").val() == "" && $("#building").val() == ""
if ($("#stockInventories").val() == "" && $("#receivables").val() == "" && $("#cashBankBalance").val() == "" && $("#prePayment").val() == "" && $("#otherCurrentAssets").val() == "" && $("#land").val() == "" && $("#building").val() == "")

if ($("#stockInventories").val() == "")

CheckInputComplete()

function CheckInputComplete() {
    var inputValidate = !$("#stockInventories, #receivables, #cashBankBalance, #prePayment, #otherCurrentAssets, #land, #building, #furnitureEquipments, #motorVehicles, #otherAssets, #billPayable, #loansOverdraft, #accurals, #otherPayables, #otherPayables, #capitalBF, #netProfit, #drawings, #businessIncomeLocal, #businessIncomeExport, #investmentIncome, #otherIncome").val();
    if (inputValidate) {
        return false;
    }
    return true;

    // $('input').each(function() {
    //     if (!$(this).val()) {
    //         alert('Some fields are empty');
    //         return false;
    //     }
    //     return true;
    // });
}

$('#btnSubmit').on('click', function() {
    if (CheckInputComplete()) {
        $('#modal-declare').modal('show');
    } else {
        toastr.warning("Please Fill All Fields to Submit!");
        //$('#modal-declare').modal('hide');
    }

});


$('#btnSubmit').click(function(e) {
    var isValid = true;
    $('.validate-input').each(function() {
        if ($.trim($(this).val()) == '') {
            isValid = false;
            $(this).css({ "border": "1px solid red", "background": "#FFCECE" });
        } else {
            $(this).css({ "border": "1px solid green", "background": "" });
        }
    });
    if (isValid == false)
        e.preventDefault();
    else
        $('#modal-declare').modal('show');
    console.log('Thank you for submitting');
});

function CheckInputComplete() {
    var isValid = true;
    $('.validate-input').each(function(e) {
        if ($.trim($(this).val()) == '') {
            $(this).css({ "border": "2px solid red", "background": "#FFCECE" });
            isValid = false;
        } else {
            $(this).css({ "border": "2px solid green", "background": "" });
            isValid = true;
        }
    });
}

$('#btnSubmit').on('click', function() {
    CheckInputComplete();
    if (isValid = true) {
        $('#modal-declare').modal('show');
        console.log("Modal Should Pop Up")
    } else {
        toastr.warning("Please Fill All Fields to Submit!");
    }

});

*/