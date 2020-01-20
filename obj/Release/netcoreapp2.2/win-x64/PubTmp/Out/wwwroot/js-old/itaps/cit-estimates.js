let current_datetime = new Date();

var ComputePeriodValues = function() {
    //const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "12", "12"];
    let assessmentYear = $("#AssessmentYear").val();
    if (assessmentYear >= 1990) {
        //$("#FromPeriod").val(current_datetime.getDate() + "/" + months[current_datetime.getMonth()] + "/" + assessmentYear);
        $("#ToPeriod").val("31" + "/" + months[11] + "/" + assessmentYear);
        //$("#FromPeriod").val(`${assessmentYear}-01-01 00:00:00`);
        //$("#ToPeriod").val(`${assessmentYear}-12-31 23:59:59`); 
        $("#FromPeriod").val("01" + "/" + months[0] + "/" + assessmentYear);
    } else {
        $("#FromPeriod").val("");
        $("#ToPeriod").val("");
    }
}

//#btnSaveContinue, 
$("#DeclarationSubmit").click(function() {
    let assessmentyear = $("#AssessmentYear").val();
    let datefromperiod = new Date(`${assessmentyear}-01-01`);
    let FrmPeriod = datefromperiod.getFullYear() + "-" + (datefromperiod.getMonth() + 1) + "-" + datefromperiod.getDate();
    let datetoperiod = new Date(`${assessmentyear}-12-31`);
    let TPeriod = datetoperiod.getFullYear() + "-" + (datetoperiod.getMonth() + 1) + "-" + datetoperiod.getDate()
    let annualchargeableincome = $("#revAnnualChargeableIncome").val();
    let annualincomepayable = $("#revAnnualIncomeTaxPayable").val();
    let incometaxalreadypaid = $("#incomeTaxAlreadyPaid").val();
    let incometaxbalancedue = $("#incomeTaxBalanceDue").val();
    let outstandingquarters = $("#numOfQuartersOutstanding").val();
    let taxtopay = $("#incomeTaxAmtToBePaid").val();
    let annuallevypayable = $("#revAnnualLevyPayable").val();
    let levyamountpaid = $("#levyAmtPaid").val();
    let levybalancedue = $("#levyBalDue").val();
    let levyAmtToBePaid = $("#levyAmtToBePaid").val();

    if ($("#FromPeriod").val() == "" || null && $("#ToPeriod").val() == "" || null) {
        toastr.warning("Select A Valid Year!");
    } else {
        let ObjectToSend = {
            "TokenType": TokenType,
            "TokenAccess": TokenAccess,
            "TaxpayerId": TaxpayerId,
            "AssessmentYear": assessmentyear,
            "FromPeriod": FrmPeriod + "T14:03:08.718Z",
            "ToPeriod": TPeriod + "T14:03:08.718Z",
            "RevAnnualChargeableIncome": annualchargeableincome,
            "RevAnnualIncomeTaxPayable": annualincomepayable,
            "IncomeTaxPaid": incometaxalreadypaid,
            "IncomeTaxBalDue": incometaxbalancedue,
            "QuartersOutstanding": outstandingquarters,
            "IncomeTaxToPay": taxtopay,
            "RevAnnualLevyPayable": annuallevypayable,
            "LevyAmtPaid": levyamountpaid,
            "LevyBalDue": levybalancedue,
            "LevyAmtToPay": levyAmtToBePaid
        };
        var dataSend = JSON.stringify(ObjectToSend);
        console.log("ObjectToSend: ", ObjectToSend)
        PostCitRevisedEstimates(dataSend);
    }
});

$('#btnSubmit').click(function(e) {
    var isValid = true;
    $('.validate-input').each(function() {
        if ($.trim($(this).val()) == '') {
            isValid = false;
            $(this).css({ "border": "2px solid red", "background": "" });

        } else {
            $(this).css({ "border": "2px solid green", "background": "" });
        }
    });
    if (isValid == false)
        toastr.warning("Please Fill All Fields to Submit!");
    //e.preventDefault();
    else
        $('#modal-declare').modal('show');
    //console.log('Thank you for submitting');
});

function ClearInputFields() {
    $("#FromPeriod").val("");
    $("#ToPeriod").val("");
    $("#AssessmentYear").val("");
    $("#revAnnualChargeableIncome").val("");
    $("#revAnnualIncomeTaxPayable").val("");
    $("#incomeTaxAlreadyPaid").val("");
    $("#numOfQuartersOutstanding").val("");
    $("#incomeTaxAmtToBePaid").val("");
    $("#revAnnualLevyPayable").val("");
    $("#levyAmtPaid").val("");
    $("#levyBalDue").val("");
    $("#levyAmtToBePaid").val("");
}
//.validate-input
$('#btnNext, #btnBack').click(function() {
    if ($("#AssessmentYear").val("")) {
        console.log("Select The Year");
        toastr.warning("Select a valid year");
        ('.validate-input').
    } else {
        toastr.warning("Year selected")
    }
})

function PostCitRevisedEstimates(postData) {
    console.log("postData", postData);
    $('body').showLoading()
    var postUrl = `${AppServerUrl}/api/CIT/PostCITEstimate`;
    $.post(postUrl, postData, function(data, status) {
        $('body').hideLoading()
        console.log('Response Data: ', data);
        if (data.status == "Failure") {
            toastr.warning("Error submitting your data. " + data.caption);
        }
        if (data.status == "Successful") {
            toastr.success("Your record has been submitted successfully.");
            ClearInputFields();
        } else {
            console.log("An Error Occured " + data.caption);
        }
    }).fail(function(response) {
        console.log('Response Error: ' + response.responseText);
    });
}

// Control Active Tab Elements
ControlActiveTab();

// Save & Continue Button Click
$("#btnBack").click(function() {
    // Enable Personal Info
    $("#PersonalSheet-tab").addClass("active").removeClass("disabled");
    $("#tax_info").addClass("active show");

    // Disable Income Statement
    $("#BusinessInfoSheet-tab").removeClass("active").addClass("disabled");
    $("#tax_calculation").removeClass("active show");

    ControlActiveTab();
});

$("#btnNext").click(function() {
    // Disable Personal Info
    $("#PersonalSheet-tab").removeClass("active").addClass("disabled");
    $("#tax_info").removeClass("active show");

    // Enable Income Statement
    $("#BusinessInfoSheet-tab").addClass("active").removeClass("disabled");
    $("#tax_calculation").addClass("active show");

    ControlActiveTab();
});


function ControlActiveTab() {
    let activeTab = document.querySelector('.tab-content .tab-pane.active').id;
    //console.log("activeTab", activeTab);
    switch (activeTab) {
        case "tax_info":
            // Back & Previous Buttons
            $("#btnBack").prop('hidden', true);
            $("#btnNext").removeAttr("hidden");

            // Save & Submit Buttons
            $("#btnSubmit").prop('hidden', true);
            $("#btnSaveContinue").removeAttr("hidden");
            break;
        case "tax_calculation":
            // Back & Previous Buttons
            $("#btnBack").removeAttr("hidden");
            $("#btnNext").prop('hidden', true);

            // Save & Submit Buttons
            $("#btnSubmit").removeAttr("hidden");
            $("#btnSaveContinue").prop('hidden', true);
            break;
    }
}