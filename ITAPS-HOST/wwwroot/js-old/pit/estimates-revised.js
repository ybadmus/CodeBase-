// Set Year of Assessment info title
$("#YearTitle").attr('title', 'This is the financial year to which the revised estmates relates.');

var ComputeTaxReturns = function () {
    let revisedBusinessIncome = $("#RevisedBusinessIncome").val();
    let revisedEmploymentIncome = $("#RevisedEmploymentIncome").val();
    let revisedInvestmentIncome = $("#RevisedInvestmentIncome").val();
    let totalRevisedIncome = MoneyToNumber(revisedBusinessIncome) + MoneyToNumber(revisedEmploymentIncome) + MoneyToNumber(revisedInvestmentIncome);
    $("#TotalRevisedIncome").val(NumberToMoney(totalRevisedIncome));

    // let annualChargeableIncome = totalRevisedIncome - MoneyToNumber(revisedEmploymentIncome);  -- Initially subtracting from Total Income
    // $("#AnnualChargeableIncome").val(NumberToMoney(annualChargeableIncome));

    $("#AnnualChargeableIncome").val(NumberToMoney(totalRevisedIncome));

    $("#AmountToBePaid").val(0.00);
    $("#RevisedTotalTaxPayable").val(0.00);
};


var GetTaxPayable = function () {
    if (IsPeriodOK() && IsChargeableOK()) {
        var dataModel = {
            Amount: MoneyToNumber($("#AnnualChargeableIncome").val()),
            StartDate: `${AssessmentYear}-01-01`, //FromPeriod,
            EndDate: `${AssessmentYear}-12-31`, //ToPeriod,
        };

        var postData = JSON.stringify(dataModel);
        console.log("GetTaxPayable Model", dataModel);

        // Call Local API
        var postUrl = `?handler=GetTaxPayable`;
        $.post(postUrl, postData, function (data, status) {
            // Log response to console
            // console.log('Response Data: ', data);
            var amountPayable = data.body.nTaxAmount;

            //GetTaxPayable
            $("#RevisedTotalTaxPayable").val(NumberToMoney(amountPayable));
            let employmentIncome = $("#RevisedEmploymentIncome").val();
            let annualChargeableIncome = $("#AnnualChargeableIncome").val();

            // let qtrIncomeTaxPayable = ((MoneyToNumber(annualChargeableIncome) - MoneyToNumber(employmentIncome)) / quarterRemaining);

            let amountAlreadyPaid = $("#AmountAlreadyPaid").val();
            let amountNotPaid = amountPayable - MoneyToNumber(amountAlreadyPaid);
            let qtrIncomeTaxPayable = amountNotPaid > 0 ? amountNotPaid / quarterRemaining : amountPayable;

            $("#AmountToBePaid").val(NumberToMoney(qtrIncomeTaxPayable));


        }).fail(function (response) {
            console.log('Response Error: ' + response.responseText);
        });

    }
};


function PostPitRevisedEstimates() {

    // Show Preloader
    $('body').showLoading();

    let dataModel = {
        TaxPayerId: nameTIN.Id,
        CurrencyId: $("#CurrencyId").val(),
        EstimateId: estimatesData.estimateId,
        AssessmentYear: AssessmentYear,
        FromPeriod: FromPeriod,
        ToPeriod: ToPeriod,
        RevBusinessIncome: MoneyToNumber($("#RevisedBusinessIncome").val()),
        RevEmploymentIncome: MoneyToNumber($("#RevisedEmploymentIncome").val()),
        RevInvestmentOtherIncome: MoneyToNumber($("#RevisedInvestmentIncome").val()),
        RevTotalIncome: MoneyToNumber($("#TotalRevisedIncome").val()),
        RevAnnualTotalChargeableIncome:  MoneyToNumber($("#AnnualChargeableIncome").val()),
        AmtAlreadyPaid: MoneyToNumber($("#AmountAlreadyPaid").val()),
        RevTotalTaxPayable: MoneyToNumber($("#RevisedTotalTaxPayable").val()),
        QuartersOutstanding: MoneyToNumber($("#QuartersOutstandingNo").val()),
        AmtToPay: MoneyToNumber($("#AmountToBePaid").val()),
        NIL: IsNILReturnsChecked(),
        Permissions: nameTIN.Codes,
    };
    var postData = JSON.stringify(dataModel);
    //console.log("Post Data", postData);

    var postUrl = `?handler=PostPITRevisedEsitmates`;
    $.post(postUrl, postData, function (data, status) {
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
        //console.log('Response Error: ' + response.responseText);
        // Hide Preloader
        $('body').hideLoading();
    });
}

// Need here, don't delete!
function DisplayPITData() {

}

// Submit On Declaration
$("#DeclarationSubmit").click(function () {
    PostPitRevisedEstimates();
});