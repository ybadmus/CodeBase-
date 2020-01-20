// Set Year of Assessment info title
$("#YearTitle").attr('title', 'This is the financial year to which the estmates relates.');

var ComputeTaxReturns = function () {
    let businessIncome = $("#BusinessIncome").val();
    let employmentIncome = $("#EmploymentIncome").val();
    let investmentIncome = $("#InvestmentIncome").val();
    let totalIncome = MoneyToNumber(businessIncome) + MoneyToNumber(employmentIncome) + MoneyToNumber(investmentIncome);
    $("#TotalIncome").val(NumberToMoney(totalIncome));

    // let annualChargeableIncome = totalIncome - MoneyToNumber(employmentIncome); -- Initially subtracting from Total Income.
    // $("#AnnualChargeableIncome").val(NumberToMoney(annualChargeableIncome));

    $("#AnnualChargeableIncome").val(NumberToMoney(totalIncome));

    $("#AnnualTaxPayable").val(0.00);
    $("#QtrIncomeTaxPayable").val(0.00);
}


var GetTaxPayable = function () {
    if (!IsPeriodOK()) {
        toastr.error("Please select a valid year.");
    } else if (!IsChargeableOK()) {
        toastr.error("Please enter your income.");
    } else {
        var dataModel = {
            Amount: MoneyToNumber($("#AnnualChargeableIncome").val()),
            StartDate: `${AssessmentYear}-01-01`, //FromPeriod,
            EndDate: `${AssessmentYear}-12-31`, //ToPeriod,
        };

        var postData = JSON.stringify(dataModel);
        // console.log("GetTaxPayable Model", dataModel);

        
        // Call Local API
        var postUrl = `?handler=GetTaxPayable`;
        $.post(postUrl, postData, function (data, status) {
            // Log response to console
            // console.log('Response Data: ', data);
            var amountPayable = data.body.nTaxAmount;

            //GetTaxPayable
            $("#AnnualTaxPayable").val(NumberToMoney(amountPayable));

            let employmentIncome = $("#EmploymentIncome").val();
            let annualChargeableIncome = $("#AnnualChargeableIncome").val();

            //let qtrIncomeTaxPayable = ((MoneyToNumber(annualChargeableIncome) - MoneyToNumber(employmentIncome)) / quarterRemaining); 

            let qtrIncomeTaxPayable = amountPayable / quarterRemaining;

            $("#QtrIncomeTaxPayable").val(NumberToMoney(qtrIncomeTaxPayable));


        }).fail(function (response) {
            console.log('Response Error: ' + response.responseText);
        });
        
    }
};


// Post PIT Estimates
function PostEstimates() {

    // Show Preloader
    $('body').showLoading();

    // PIT Annual Estimates
    let dataModel = {
        TaxPayerId: nameTIN.Id,
        CurrencyId: $("#CurrencyId").val(),
        AssessmentYear: AssessmentYear,
        FromPeriod: FromPeriod,
        ToPeriod: ToPeriod,
        BusinessIncome: MoneyToNumber($("#BusinessIncome").val()),
        EmploymentIncome:  MoneyToNumber($("#EmploymentIncome").val()),
        InvestmentOtherIncome:  MoneyToNumber($("#InvestmentIncome").val()),
        TotalIncome: MoneyToNumber($("#TotalIncome").val()),
        AnnualChargeableIncome:  MoneyToNumber($("#AnnualChargeableIncome").val()),
        AnnualTotalIncomeTaxPayable: MoneyToNumber($("#AnnualTaxPayable").val()),
        QuarterlyIncomeTaxPayable: MoneyToNumber($("#QtrIncomeTaxPayable").val()),
        NIL: IsNILReturnsChecked(),
        Permissions: nameTIN.Codes,
    };

    var postData = JSON.stringify(dataModel);
    //console.log("Post Data", postData);

    var postUrl = `?handler=PostPITEsitmates`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);

        if (data.status == "Successful") {
            toastr.success("Your record has been submitted successfully.");
            setTimeout(function () { window.location = `${AppServerUrl}/pit`; }, 1000); //1000 means 1 secs           
        } else {
            toastr.info("Your record could not be submitted. Please try again.");

            // Hide Preloader
            $('body').hideLoading();
        }

    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
        // Hide Preloader
        $('body').hideLoading();
    });
    
}

// Need here, don't delete!
function DisplayPITData() {

}

$("#DeclarationSubmit").click(function () {
    PostEstimates();
});