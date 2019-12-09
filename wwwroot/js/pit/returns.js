// Set Year of Assessment info title
$("#YearTitle").attr('title', 'This is the financial year to which the returns relates.');

// Get List of Businesses for tax payer
var TaxPayerBusinessesData = [];
GetBusinesses();
function GetBusinesses() {
    var dataModel = {
        TaxPayerId: nameTIN.Id
    };
    var postData = JSON.stringify(dataModel);
    // console.log('GetBusinesses Model: ', dataModel);

    // Call Local API
    var postUrl = "?handler=GetTaxPayerBusinesses";
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        // console.log('GetBusinesses Data: ', data);
        
        if (data.body.length > 0) {
            var htmData = "";
            TaxPayerBusinessesData = [];
            for (var i = 0; i < data.body.length; i++) {
                let bzId = data.body[i].id;
                let bzTaxPayerId = data.body[i].taxpayerId;
                let bzAccountingMethodId = data.body[i].accountingMethodId;
                let bzAccountingMethod = data.body[i].accountingMethod;
                let bzTenancyStatusId = data.body[i].tenancyStatusId;
                let bzTenancyStatus = data.body[i].tenancyStatus;
                let bzName = data.body[i].tradingName;
                let bzActivity = data.body[i].businessActivity;
                let bzLandlordTin = data.body[i].landlordTin;
                let bzLandlordName = data.body[i].landlordName;
                let bzLandlordPhone = data.body[i].landlordPhone;
                
                // Keep a copyt in an array.
                TaxPayerBusinessesData.push({
                    Id: bzId,
                    TaxPayerId: bzTaxPayerId,
                    AccountingMethodId: bzAccountingMethodId,
                    AccountingMethod: bzAccountingMethod,
                    TenancyStatusId: bzTenancyStatusId,
                    TenancyStatus: bzTenancyStatus,
                    Name: bzName,
                    Activity: bzActivity,
                    LandlordTin: bzLandlordTin,
                    LandlordName: bzLandlordName,
                    LandlordPhone: bzLandlordPhone,
                });
                // Display in table
                htmData += `<tr><td>${bzName}</td><td>${bzActivity}</td><td>${bzAccountingMethod}</td>
                            <td class="text-center">
                                <button id="${bzId}" onClick="OpenBusinessDetail(this.id)" data-toggle="modal" data-target="#BusinessModal" class="btn btn-xs btn-success py-1 px-2"><i class="fa fa-file-alt"></i></button>
                            </td></tr>`;
            }
            //Business List Table Body
            $("#BusinessListBody").html(htmData);

        }
        
    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
    });
}

var OpenBusinessDetail = function (id) {

    // Get Selected Business   
    var GetBusiness = $.grep(TaxPayerBusinessesData, function (e) { return e.Id == id; });

    //console.log("GetBusiness", GetBusiness[0]);

    let bzId = GetBusiness[0].Id;
    let bzTaxPayerId = GetBusiness[0].TaxPayerId;
    let bzAccountingMethodId = GetBusiness[0].AccountingMethodId;
    let bzAccountingMethod = GetBusiness[0].AccountingMethod;
    let bzTenancyStatusId = GetBusiness[0].TenancyStatusId;
    let bzTenancyStatus = GetBusiness[0].TenancyStatus;
    let bzName = GetBusiness[0].Name;
    let bzActivity = GetBusiness[0].Activity;
    let bzLandlordTin = GetBusiness[0].LandlordTin;
    let bzLandlordName = GetBusiness[0].LandlordName;
    let bzLandlordPhone = GetBusiness[0].LandlordPhone;

    /*
    // Build Opts
    var options = `<option value="${thHolidayId}">${thHolidayType}</option>`;
    for (var i = 0; i < taxHolidayOptData.length; i++) {
        options += `<option value='${taxHolidayOptData[i].Id}'>${taxHolidayOptData[i].Value}</option>`;
    }
    //Populate Select Options
    // $("#HolidayType").html(options);
    */

    // Set Business Details
    $("#BusinessName").val(bzName);
    $("#BusinessActivity").val(bzActivity);
    $("#LandLordTIN").val(bzLandlordTin);
    $("#LandLordPhone").val(bzLandlordPhone);
    $("#LandLordName").val(bzLandlordName);
    $("#TenancyStatus").val(bzTenancyStatus);
    $("#AccountingMethod").val(bzAccountingMethod);

    // Landlord Details
    if (bzTenancyStatus === "Owned") {
        $("#LandLordTIN").val(TaxPayerData.tin);
        $("#LandLordPhone").val(TaxPayerData.mobileNumber);
        $("#LandLordName").val(TaxPayerData.displayName);
    }
    
}

// Load Types of Accounting Methods
GetTypeOfAccount();
function GetTypeOfAccount() {
    var dataModel = {
        CodeType: "TAM",
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.body.length > 0) {
            //var options = "<option value=''>Please select</option>";
            var options = "";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].id}'>${data.body[i].description}</option>`;
            }
            //TypeOfAccount
            $("#TypeOfAccount").html(options);

        }
    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);
    });
    
}

// Load Types of Tenancy Statuses
GetTypeOfTenancy();
function GetTypeOfTenancy() {
    var dataModel = {
        CodeType: "TES",
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.body.length > 0) {
            var options = "";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].id}'>${data.body[i].description}</option>`;
            }
            //TypeOfAccount
            $("#TenancyStatus").html(options);

        }
    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
    });

}

// Load Types of Tax Holidays
var TaxHolidayTypes = [];
GetTaxHolidayTypes();
function GetTaxHolidayTypes() {   
    // Call Local API
    var postUrl = `?handler=GetTaxHolidayTypes`;
    $.post(postUrl, null, function (data, status) {
        // Log response to console
        // console.log('GetTaxHolidayTypes Data: ', data);
        if (data.body.length > 0) {
            // Save a copy for future use
            TaxHolidayTypes = data.body;
            // Fill select options
            var options = "";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].id}'>${data.body[i].description}</option>`;
            }
            //HolidayType
            $("#HolidayType").html(options);

        }
    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
    });
}

// Load Tax Holidays for Tax Payer
var TaxPayerHolidays = [];
GetTaxPayerHolidays();
function GetTaxPayerHolidays() {
    var dataModel = {
        TaxPayerId: nameTIN.Id,
    };

    var postData = JSON.stringify(dataModel);
    // console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerHolidays`;
    $.post(postUrl, postData, function (data, status) {
        // console.log('GetTaxPayerHolidays Data: ', data);
        if (data.body.length > 0) {
            // Save a copy for future use.
            TaxPayerHolidays = data.body;
            // Fill Table rows
            var htmData = "";
            for (j = 0; j < data.body.length; j++) {
                var thId = data.body[j].id;
                var thHolidayType = data.body[j].taxHoliday;
                var thEffectiveDate = new Date(GetDateOrTime(data.body[j].effectiveDate).date);
                var thProductionDate = new Date(GetDateOrTime(data.body[j].firstProductionDate).date);

                htmData += `<tr><td>${thHolidayType}</td><td>${thEffectiveDate.toLocaleDateString("en-US", YearOptions)}</td><td>${thProductionDate.toLocaleDateString("en-US", YearOptions)}</td>
            <td class="text-center">
                <button id="${thId}" onClick="OpenTaxHoliday(this.id)" data-toggle="modal" data-target="#TaxHolidayModal" class="btn btn-xs btn-success py-1 px-2"><i class="fa fa-file-alt"></i></button>
            </td></tr>`;
            }
            $("#TaxHolidayListBody").html(htmData);
        }
    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
    });
    
}

var PostTaxPayerHoliday = function () {
    // Tax Holidays
    var dataModel = {
        TaxPayerId: nameTIN.Id,
        TaxHolidayId: $("#HolidayType").val(),
        EffectiveDate: $("#EffectiveDate").val(),
        FirstProductionDate: $("#ProductionDate").val()
    }
    var postData = JSON.stringify(dataModel);

    var postUrl = `?handler=PostTaxPayerHoliday`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.status === "Successful") {
            // Toast success
            ResetTaxHolidayForm();
            GetTaxPayerHolidays();
        } else {
            // Toast Failure
        }
    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);
    });
}

var ResetTaxHolidayForm = function () {

    // Enable form elements
    $("#EffectiveDate").removeAttr("disabled");
    $("#ProductionDate").removeAttr("disabled");
    $("#EffectiveDate").closest('div').find('.flatpickr-input').removeAttr("disabled");
    $("#ProductionDate").closest('div').find('.flatpickr-input').removeAttr("disabled");
    $("#HolidayType").removeAttr("disabled");
    $("#AddTaxHoliday").removeAttr("hidden");

    //Reset Fields
    $("#EffectiveDate").val("");
    $("#ProductionDate").val("");
    $(".flatpickr-input").val("");
    var options = "";
    for (var i = 0; i < TaxHolidayTypes.length; i++) {
        options += `<option value='${TaxHolidayTypes[i].id}'>${TaxHolidayTypes[i].description}</option>`;
    }
    //Populate Select Options
    $("#HolidayType").html(options);
}

var OpenTaxHoliday = function (id) {
    // Disable form elements
    $("#EffectiveDate").prop("disabled", true);
    $("#ProductionDate").prop("disabled", true);
    $("#EffectiveDate").closest('div').find('.flatpickr-input').prop("disabled", true);
    $("#ProductionDate").closest('div').find('.flatpickr-input').prop("disabled", true);
    $("#HolidayType").prop("disabled", true);
    $("#AddTaxHoliday").prop("hidden", true);

    // console.log("TaxHoliday ID", id);
    // console.log("TaxPayerHolidays", TaxPayerHolidays);
    // Get current tax holiday
    var GetHoliday = $.grep(TaxPayerHolidays, function (obj) { return obj.id === id; });

    //console.log("GetHoliday", GetHoliday[0]);
    
    var thHolidayId = GetHoliday[0].id;
    var thHolidayType = GetHoliday[0].taxHoliday;
    var options = `<option value="${thHolidayId}">${thHolidayType}</option>`;
    for (var i = 0; i < TaxHolidayTypes.length; i++) {
        options += `<option value='${TaxHolidayTypes[i].id}'>${TaxHolidayTypes[i].description}</option>`;
    }

    //Populate Select Options
    $("#HolidayType").html(options);

    // Set Date Value
    var thEffectiveDate = new Date(GetDateOrTime(GetHoliday[0].effectiveDate).date);
    var thProductionDate = new Date(GetDateOrTime(GetHoliday[0].firstProductionDate).date);

    // Set date values
    $("#EffectiveDate").closest('div').find('.flatpickr-input').val(thEffectiveDate.toLocaleDateString("en-US", YearOptions));
    $("#ProductionDate").closest('div').find('.flatpickr-input').val(thProductionDate.toLocaleDateString("en-US", YearOptions));
    
}

// Data object for saved records
var PITData = {}, PITPreviewData = {};
var PITDataToDisplay = "returns"; // returns | revised, savedContinue

// Get PIT Returns By Year
function GetReturnsByYear() {
    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        TaxYear: AssessmentYear,
        TaxPayerId: nameTIN.Id,
    };

    var postData = JSON.stringify(dataModel);
    // console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetPITReturnsByYear`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        // console.log('GetReturnsByYear Data: ', data);
        if (data.status === "Successful" || data.code === 404 || data.code === 204) {
            if (data.body === null || data.body === "") {
                // No Returns found.
                if (currentPathName == returnsRevisedPage) {
                    PromptConfig = {
                        Title: "No PIT Annual Returns",
                        Message: `No PIT Annual Returns found on your account for the year ${AssessmentYear}. Please submit your PIT Annual Returns and try again.`,
                        Positive: {
                            Title: "OK",
                            Action: `pit/${returnsPage}`,
                            Alert: null,
                            Call: null
                        },
                        Negative: {
                            Title: "Cancel",
                            Action: null,
                            Alert: null,
                            Call: null
                        }
                    };
                    ShowPrompt();
                } else {
                    //Else check for Save Continue data.
                    GetSavedContinueByYear();
                }
            }
            else {
                if (currentPathName == returnsPage) {
                    // Transfer to Preview Form
                    PITPreviewData = data.body;

                    // Hide Submit Button on Preview
                    $("#ViewPrintPreview").removeAttr("hidden");
                    // Show Prompt
                    PromptConfig = {
                        Title: "PIT Annual Returns Found",
                        Message: `PIT Annual Returns was found on your account for the year ${AssessmentYear}. Do you want to revise it now, or preview?`,
                        Positive: {
                            Title: "Revise",
                            Action: `pit/${returnsRevisedPage}`,
                            Alert: null,
                            Call: null
                        },
                        Negative: {
                            Title: "Preview",
                            Action: null,
                            Alert: null,
                            Call: ViewPreview
                        }
                    };
                    ShowPrompt();
                } else {
                    //Else check for Save Continue data.
                    GetSavedContinueByYear();
                }
            }
        } else if (data.code === 401) {
            toastr.success("Operation interrupted. Please try again.");
            setTimeout(function () { window.location.reload(true); }, 1000); //1000 means 1 secs
        } else {
            toastr.info("Operation failed. Please try again shortly.");
        }
        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);
        // Hide Preloader
        $('body').hideLoading();
    });
}


// Get Saved PIT Returns
function GetSavedContinueByYear() {
    var dataModel = {
        TaxYear: AssessmentYear,
        TaxPayerId: nameTIN.Id,
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetPITReturnsSC`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        // console.log('GetSavedContinueByYear Data: ', data);
        if (data.status === "Successful") {
            if (data.body === null || data.body === "") {
                // No Saved & Continue Returns found, show fresh PIT Setup Config.
                AllowWithoutEsitmates();
            }
            else {
                // Saved & Continue Returns found, display data & show PIT Setup Config.
                PITData = data.body;
                PITDataToDisplay = "savedContinue";
                DisplayPITSetup();
            }
        }
        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);
    });
}

/********* COMPUTE TAX RETURNS *******/
var ComputeTaxReturns = function () {

    /********** BALANCE SHEET ***********/
    // Current Assets
    let stocksInventories = $("#StocksInventories").val();
    let receivables = $("#Receivables").val();
    let cashBankBalances = $("#CashBankBalances").val();
    let prepayment = $("#Prepayment").val();
    let otherCurrentAssets = $("#OtherCurrentAssets").val();
    let totalCurrentAssets = MoneyToNumber(stocksInventories) + MoneyToNumber(receivables) + MoneyToNumber(cashBankBalances) + MoneyToNumber(prepayment) + MoneyToNumber(otherCurrentAssets);
    $("#TotalCurrentAssets").val(NumberToMoney(totalCurrentAssets));
    

    // Non-Current Assets
    let land = $("#Land").val();
    let building = $("#Building").val();
    let furnitureEquipment = $("#Building").val();
    let motorVehicle = $("#MotorVehicle").val();
    let otherAssets = $("#OtherAssets").val();
    let totalNonCurrentAssets = MoneyToNumber(land) + MoneyToNumber(building) + MoneyToNumber(furnitureEquipment) + MoneyToNumber(motorVehicle) + MoneyToNumber(otherAssets);
    $("#TotalNonCurrentAssets").val(NumberToMoney(totalNonCurrentAssets));
   
    // Total Assets
    let totalAssets = totalCurrentAssets + totalNonCurrentAssets;
    $("#TotalAssets").val(NumberToMoney(totalAssets));
    
    //Current Payables
    let billsPayable = $("#BillsPayable").val();
    let loansOverdraft = $("#LoansOverdraft").val();
    let accruals = $("#Accruals").val();
    let otherPayables = $("#OtherPayables").val();
    let totalCurrentPayables = MoneyToNumber(billsPayable) + MoneyToNumber(loansOverdraft) + MoneyToNumber(accruals) + MoneyToNumber(otherPayables);
    $("#TotalCurrentPayables").val(NumberToMoney(totalCurrentPayables));

    // Capital
    let capitalBF = $("#CapitalBF").val();
    let netProfit = $("#NetProfit").val();
    let drawings = $("#Drawings").val();
    let capitalAdditions = MoneyToNumber(netProfit) - MoneyToNumber(drawings);
    $("#CapitalAdditions").val(NumberToMoney(capitalAdditions));
    let netCapital = MoneyToNumber(capitalBF) + capitalAdditions;
    $("#NetCapital").val(NumberToMoney(netCapital));

    //Total Capital and Payables
    let totalCapitalPayables = totalCurrentPayables + netCapital;
    $("#TotalCapitalPayables").val(NumberToMoney(totalCapitalPayables));

    // Balance Sheet Balance
    // let balanceSheetTotal = totalAssets - totalCapitalPayables;
    // $("#BalanceSheetTotal").val(NumberToMoney(balanceSheetTotal));


    /********** INCOME STATEMENT ***********/
    //Business Expenses
    let grossBusinessIncome = $("#GrossBusinessIncome").val();
    let operatingCost = $("#OperatingCost").val();
    let generalAdminExpenses = $("#GeneralAdminExpenses").val();
    let staffLabourCosts = $("#StaffLabourCosts").val();
    let interestExpenses = $("#InterestExpenses").val();
    let depreciation = $("#Depreciation").val();
    let otherExpenses = $("#OtherExpenses").val();
    let totalBusinessExpenses = MoneyToNumber(operatingCost) + MoneyToNumber(generalAdminExpenses) + MoneyToNumber(staffLabourCosts) + MoneyToNumber(interestExpenses) + MoneyToNumber(depreciation) + MoneyToNumber(otherExpenses);
    $("#TotalBusinessExpenses").val(NumberToMoney(totalBusinessExpenses));
    let netBusinessProfitLoss = MoneyToNumber(grossBusinessIncome) - totalBusinessExpenses;
    $("#NetBusinessProfitLoss").val(NumberToMoney(netBusinessProfitLoss));


    //Employment Income
    // Cash Benefits
    let basicSalary = $("#BasicSalary").val();
    let cashAllowances = $("#CashAllowances").val();
    let otherCashBenefit = $("#OtherCashBenefit").val();
    let excessBonus = $("#ExcessBonus").val();
    let totalCashBenefits = MoneyToNumber(basicSalary) + MoneyToNumber(cashAllowances) + MoneyToNumber(otherCashBenefit) + MoneyToNumber(excessBonus);
    $("#TotalCashBenefits").val(NumberToMoney(totalCashBenefits));
    // Benefits in Kind    
    let rentElement = $("#RentElement").val();
    let carElement = $("#CarElement").val();
    let othersInKind = $("#OthersInKind").val();
    let totalBenefitsInKind = MoneyToNumber(rentElement) + MoneyToNumber(carElement) + MoneyToNumber(othersInKind);
    $("#TotalBenefitsInKind").val(NumberToMoney(totalBenefitsInKind));
    // Totals
    let netEmploymentIncome = totalCashBenefits + totalBenefitsInKind;
    $("#NetEmploymentIncome").val(NumberToMoney(netEmploymentIncome));


    //Investment Incomes    
    let directorFees = $("#DirectorFees").val();
    let commission = $("#Commission").val();
    let royalty = $("#Royalty").val();
    let charges = $("#Charges").val();
    let annuity = $("#Annuity").val();
    let taxableRentIncome = $("#TaxableRentIncome").val();
    let discounts = $("#Discounts").val();
    let premium = $("#Premium").val();
    let interest = $("#Interest").val();
    let otherInvestment = $("#OtherInvestment").val();
    let netInvestmentIncome = MoneyToNumber(directorFees) + MoneyToNumber(commission) + MoneyToNumber(royalty) + MoneyToNumber(charges) + MoneyToNumber(annuity) + MoneyToNumber(taxableRentIncome) + MoneyToNumber(discounts) + MoneyToNumber(premium) + MoneyToNumber(interest) + MoneyToNumber(otherInvestment);
    $("#NetInvestmentIncome").val(NumberToMoney(netInvestmentIncome));

    // Total Income
    let totalIncome = netBusinessProfitLoss + netEmploymentIncome + netInvestmentIncome;
    $("#TotalIncome").val(NumberToMoney(totalIncome));

    /********** TAX COMPUTATION ***********/
    // Same as Net Business Profit / Loss
    let netBusinessProfit = netBusinessProfitLoss;
    $("#NetBusinessProfit").val(NumberToMoney(netBusinessProfit));

    //Add Backs    
    let addBackDepreciation = $("#AddBackDepreciation").val();
    let nonAllowableDeductions = $("#NonAllowableDeductions").val();
    let totalAddBacks = MoneyToNumber(addBackDepreciation) + MoneyToNumber(nonAllowableDeductions);
    $("#TotalAddBacks").val(NumberToMoney(totalAddBacks));

    // Adjusted Profit    
    let adjustedBusinessProfit = netBusinessProfit + totalAddBacks;
    $("#AdjustedBusinessProfit").val(NumberToMoney(adjustedBusinessProfit));

    //Total Deductions    
    let nonTaxableIncome = $("#NonTaxableIncome").val();
    let capitalAllowance = $("#CapitalAllowance").val();
    let totalDeductions = MoneyToNumber(nonTaxableIncome) + MoneyToNumber(capitalAllowance);
    $("#TotalDeductions").val(NumberToMoney(totalDeductions));

    //Net Adjusted Profit
    let netAdjustedBusinessProfit = adjustedBusinessProfit - totalDeductions;
    $("#NetAdjustedBusinessProfit").val(NumberToMoney(netAdjustedBusinessProfit));

    //Same as net Employment Income
    let addNetEmploymentIncome = netEmploymentIncome;
    $("#AddNetEmploymentIncome").val(NumberToMoney(addNetEmploymentIncome));

    //Same as net Investment Income
    let addNetInvestmentIncome = netInvestmentIncome;
    $("#AddNetInvestmentIncome").val(NumberToMoney(addNetInvestmentIncome));

    //Total Assessable Income
    let totalAssessableIncome = netAdjustedBusinessProfit + addNetEmploymentIncome + addNetInvestmentIncome;
    $("#TotalAssessableIncome").val(NumberToMoney(totalAssessableIncome));

    let incomeTaxedAtDifferentRates = $("#IncomeTaxedAtDifferentRates").val();
    // Net Assessable Income
    let netAssessableIncome = totalAssessableIncome - MoneyToNumber(incomeTaxedAtDifferentRates);
    $("#NetAssessableIncome").val(NumberToMoney(netAssessableIncome));

    // Deduct Reliefs    
    let lifeAssurance = $("#LifeAssurance").val();
    let socialSecurity = $("#SocialSecurity").val();
    let marriageResponsibility = $("#MarriageResponsibility").val();
    let childrenEducation = $("#ChildrenEducation").val();
    let oldAge = $("#OldAge").val();
    let agedDependants = $("#AgedDependants").val();
    let disability = $("#Disability").val();
    let costofTraining = $("#CostofTraining").val();
    let voluntaryPensionContribution = $("#VoluntaryPensionContribution").val();
    let otherAllowableDeductions = $("#OtherAllowableDeductions").val();
    let totalAllowableDeductionsReliefs = MoneyToNumber(lifeAssurance) + MoneyToNumber(socialSecurity) + MoneyToNumber(marriageResponsibility) + MoneyToNumber(childrenEducation) + MoneyToNumber(oldAge) + MoneyToNumber(agedDependants) + MoneyToNumber(disability) + MoneyToNumber(costofTraining) + MoneyToNumber(voluntaryPensionContribution) + MoneyToNumber(otherAllowableDeductions);
    $("#TotalAllowableDeductionsReliefs").val(NumberToMoney(totalAllowableDeductionsReliefs));


    let reliefsDeductions = totalAllowableDeductionsReliefs;
    $("#ReliefsDeductions").val(NumberToMoney(reliefsDeductions));

    // Chargeable Income
    let chargeableIncome = netAssessableIncome - totalAllowableDeductionsReliefs;
    $("#AnnualChargeableIncome").val(NumberToMoney(chargeableIncome));
    
    // Payments    
    let taxCredits = $("#TaxCredits").val();
    let paymentOnAccount = $("#PaymentOnAccount").val();
    let priorPeriodCredits = $("#PriorPeriodCredits").val();
    let totalPayments = MoneyToNumber(taxCredits) + MoneyToNumber(paymentOnAccount) + MoneyToNumber(priorPeriodCredits);
    $("#TotalPayments").val(NumberToMoney(totalPayments));

    //GetTaxPayable
    let taxCharged = $("#TaxCharged").val();

    let taxPayableOverpaid = MoneyToNumber(taxCharged) - totalPayments;
    $("#TaxPayableOverpaid").val(NumberToMoney(taxPayableOverpaid));

    var taxLabel = "Tax Payable";
    if (taxPayableOverpaid < 0) {
        taxLabel = "Tax Overpaid";
    }
    $("#TaxLabel").html(taxLabel);
}

// Relief Validations
// A.	Marriage relief  is GH 200 per year
$("#MarriageResponsibility").change(function () {
    ValidadateReliefs($(this), 200, "Maximun value for Marriage Relief  is GH 200 per year");
});

// B.	Child Relief is GH200 per year for a minimum of 2 children
/*
$("#ChildrenEducation").change(function () {

});
*/

// C.	Child Education relief is GH200 per year per child for a maximum of 3 children
$("#ChildrenEducation").change(function () {
    ValidadateReliefs($(this), 600, "Maximun value for Child Education Relief is GHS200 per year per child for a maximum of 3 children");
});

// D.	Disability Relief is 25% of income from  a business or employment
$("#Disability").change(function () {
    let businessIncome = $("#NetBusinessProfitLoss").val();
    let employmentIncome = $("#NetEmploymentIncome").val();
    let baseIncome = (25 / 100) * Math.max(MoneyToNumber(businessIncome), MoneyToNumber(employmentIncome));
    // console.log("baseIncome:", baseIncome);
    ValidadateReliefs($(this), baseIncome, "Maximun value for Disability Relief is 25% of income from a business or employment");
});

// E.	Old Age Relief is GH200 per year for persons above 60years
$("#OldAge").change(function () {
    ValidadateReliefs($(this), 200, "Maximun value for Old Age Relief is GHS200 per year for persons above 60years");
});

//F.	Aged Dependents is GH100 per person per year. Maximum of 2 relatives
$("#AgedDependants").change(function () {
    ValidadateReliefs($(this), 200, "Maximun value for Aged Dependents is GHS100 per person per year. Maximum of 2 relatives");
});

// G.	Education relief is GH200 per year.
$("#CostofTraining").change(function () {
    ValidadateReliefs($(this), 200, "Maximun value for Education Relief is GHS200 per year");
});

var ValidadateReliefs = function (el, amt, msg) {
    let val = $(el).val();
    // console.log(val, msg);
    if (val > amt) {
        $(el).focus();
        $(el).val(0);
        toastr.info(msg);
    }
}

var ReliefsValidated = function () {
    let lifeAssurance = $("#LifeAssurance").val();
    let socialSecurity = $("#SocialSecurity").val();
    let marriageResponsibility = $("#MarriageResponsibility").val();
    let childrenEducation = $("#ChildrenEducation").val();
    let oldAge = $("#OldAge").val();
    let agedDependants = $("#AgedDependants").val();
    let disability = $("#Disability").val();
    let costofTraining = $("#CostofTraining").val();
    let voluntaryPensionContribution = $("#VoluntaryPensionContribution").val();
    let otherAllowableDeductions = $("#OtherAllowableDeductions").val();
    let businessIncome = $("#NetBusinessProfitLoss").val();
    let employmentIncome = $("#NetEmploymentIncome").val();
    let baseIncome = (25/100) * Math.max(MoneyToNumber(businessIncome), MoneyToNumber(employmentIncome));

    if (MoneyToNumber(marriageResponsibility) <= 200
        && MoneyToNumber(childrenEducation) <= 600
        && MoneyToNumber(disability) <= baseIncome
        && MoneyToNumber(oldAge) <= 200
        && MoneyToNumber(agedDependants) <= 200
        && MoneyToNumber(costofTraining) <= 200) {
        return true;
    }
    return false;
}

var GetTaxPayable = function () {

    // Show Preloader
    $('body').showLoading();

    if (IsPeriodOK() && IsChargeableOK()) {
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
            if (data.status === "Successful") {
                var amountPayable = data.body.nTaxAmount;

                //GetTaxPayable
                $("#TaxCharged").val(NumberToMoney(amountPayable));
                let totalPayments = $("#TotalPayments").val();

                let taxPayableOverpaid = MoneyToNumber(amountPayable) - MoneyToNumber(totalPayments);
                $("#TaxPayableOverpaid").val(NumberToMoney(taxPayableOverpaid));

                var taxLabel = "Tax Payable";
                if (taxPayableOverpaid < 0) {
                    taxLabel = "Tax Overpaid";
                }
                $("#TaxLabel").html(taxLabel);

            } else if (data.code === 401) {
                // Perform the Magic (Token Renewal)
                console.log('401 Error: ', 'Lets do the magic...');

            } else {
                toastr.info("Operation failed. Please try again shortly.");
            }            

            // Hide Preloader
            $('body').hideLoading();

        }).fail(function (response) {
            // console.log('Response Error: ' + response.responseText);
            // Hide Preloader
            $('body').hideLoading();
        });
    }
};

// Save & Continue PIT Returns
function SaveAndContinueReturns() {
    
    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        TaxPayerId: nameTIN.Id,
        CurrencyId: $("#CurrencyId").val(),
        AssessmentYear: AssessmentYear,
        FromPeriod: FromPeriod,
        ToPeriod: ToPeriod,
        AccMethodTypeId: $("#TypeOfAccount").val(),
        NIL: IsNILReturnsChecked(),
        BInvIncome: IsInvestmentIncomeChecked(),
        BEmpIncome: IsEmploymentIncomeChecked(),
        BOtherIncome: IsBusinessIncomeChecked(),
        Permissions: nameTIN.Codes,
        PTR1SC: [
            {
                BalanceSheetDate: ToPeriod,
                Stocks: MoneyToNumber($("#StocksInventories").val()),
                Prepayment: MoneyToNumber($("#Prepayment").val()),
                Receivables: MoneyToNumber($("#Receivables").val()),
                CashBalance: MoneyToNumber($("#CashBankBalances").val()),
                OtherCurrentAssets: MoneyToNumber($("#OtherCurrentAssets").val()),
                Land: MoneyToNumber($("#Land").val()),
                Building: MoneyToNumber($("#Building").val()),
                MotorVehicle: MoneyToNumber($("#MotorVehicle").val()),
                Equipment: MoneyToNumber($("#FurnitureEquipment").val()),
                OtherAssets: MoneyToNumber($("#OtherAssets").val()),
                BillsPayable: MoneyToNumber($("#BillsPayable").val()),
                Accruals: MoneyToNumber($("#Accruals").val()),
                Loans: MoneyToNumber($("#LoansOverdraft").val()),
                OtherPayables: MoneyToNumber($("#OtherPayables").val()),
                CapitalBf: MoneyToNumber($("#CapitalBF").val()),
                NetProfit: MoneyToNumber($("#NetProfit").val()),
                Drawings: MoneyToNumber($("#Drawings").val()),
            }
        ],
        PTR2SC: [
            {
                GrossBusinessIncome: MoneyToNumber($("#GrossBusinessIncome").val()),
                OperatingCost: MoneyToNumber($("#OperatingCost").val()),
                GeneralAndAdminExpense: MoneyToNumber($("#GeneralAdminExpenses").val()),
                LabourCost: MoneyToNumber($("#StaffLabourCosts").val()),
                InterestExpenses: MoneyToNumber($("#InterestExpenses").val()),
                Depreciation: MoneyToNumber($("#Depreciation").val()),
                OtherPayables: MoneyToNumber($("#OtherExpenses").val()),
                BasicSalary: MoneyToNumber($("#BasicSalary").val()),
                CashAllowance: MoneyToNumber($("#CashAllowances").val()),
                OtherCashBenefit: MoneyToNumber($("#OtherCashBenefit").val()),
                ExcessBonus: MoneyToNumber($("#ExcessBonus").val()),
                RentElement: MoneyToNumber($("#RentElement").val()),
                CarElement: MoneyToNumber($("#CarElement").val()),
                OtherElements: MoneyToNumber($("#OthersInKind").val()),
                DirectorsFee: MoneyToNumber($("#DirectorFees").val()),
                Commission: MoneyToNumber($("#Commission").val()),
                Royalty: MoneyToNumber($("#Royalty").val()),
                Charges: MoneyToNumber($("#Charges").val()),
                Annuity: MoneyToNumber($("#Annuity").val()),
                TaxableRentIncome: MoneyToNumber($("#TaxableRentIncome").val()),
                Discounts: MoneyToNumber($("#Discounts").val()),
                Premium: MoneyToNumber($("#Premium").val()),
                Interest: MoneyToNumber($("#Interest").val()),
                Others: MoneyToNumber($("#OtherInvestment").val())
            }
        ],
        PTR3SC: [
            {
                NetBusinessProfit: MoneyToNumber($("#NetBusinessProfit").val()),
                Depreciation: MoneyToNumber($("#AddBackDepreciation").val()),
                NonAllowableDeductions: MoneyToNumber($("#NonAllowableDeductions").val()),
                NonTaxableincome: MoneyToNumber($("#NonTaxableIncome").val()),
                CapitalAllowance: MoneyToNumber($("#CapitalAllowance").val()),
                TotalDeductions: MoneyToNumber($("#TotalDeductions").val()),
                NetAdjustedBusinessProfit: MoneyToNumber($("#NetAdjustedBusinessProfit").val()),
                NetEmploymentIncome: MoneyToNumber($("#AddNetEmploymentIncome").val()),
                NetInvestmentIncome: MoneyToNumber($("#AddNetInvestmentIncome").val()),
                IncomeTaxDiffRates: MoneyToNumber($("#IncomeTaxedAtDifferentRates").val()),
                RelLifeAssurance: MoneyToNumber($("#LifeAssurance").val()),
                RelSocialSecurity: MoneyToNumber($("#SocialSecurity").val()),
                RelMarriageResponsibility: MoneyToNumber($("#MarriageResponsibility").val()),
                RelChildrenEduc: MoneyToNumber($("#ChildrenEducation").val()),
                RelOldAgeEmployees: MoneyToNumber($("#OldAge").val()),
                RelAgedDependants: MoneyToNumber($("#AgedDependants").val()),
                RelDisability: MoneyToNumber($("#Disability").val()),
                RelCostOfTraining: MoneyToNumber($("#CostofTraining").val()),
                RelVolPensionContribution: MoneyToNumber($("#VoluntaryPensionContribution").val()),
                RelOtherAllowableDeductions: MoneyToNumber($("#OtherAllowableDeductions").val()),
                ChargeableIncome: MoneyToNumber($("#AnnualChargeableIncome").val()),
                TaxCharged: MoneyToNumber($("#TaxCharged").val()),
                TaxCredits: MoneyToNumber($("#TaxCredits").val()),
                PaymentOnAccount: MoneyToNumber($("#PaymentOnAccount").val()),
                PriorPeriodCredits: MoneyToNumber($("#PriorPeriodCredits").val()),
                TotalPayment: MoneyToNumber($("#TotalPayments").val()),
                TaxPayable: MoneyToNumber($("#TaxPayableOverpaid").val()),
            }
        ]
    };

    var postData = JSON.stringify(dataModel);
    // console.log("Post Data", postData);

    var postUrl = `?handler=PostPITReturnsSC`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        // console.log('Response Data: ', data);
        
        if (data.status == "Successful") {
            toastr.success("Your record has been submitted successfully.");
            setTimeout(function () { window.location = `${AppServerUrl}/pit`; }, 1000); //1000 means 1 secs
        } else if (data.code === 401) {
            // Perform the Magic (Token Renewal)
            console.log('401 Error: ', 'Lets do the magic...');

        } else {
            toastr.info("Your record could not be submitted. Please try again.");

            // Hide Preloader
            $('body').hideLoading();
        }

    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);

        // Hide Preloader
        $('body').hideLoading();
    });

}

// Post PIT Returns
function PostReturns() {
    
    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        TaxPayerId: nameTIN.Id,
        CurrencyId: $("#CurrencyId").val(),
        AssessmentYear: AssessmentYear,
        FromPeriod: FromPeriod,
        ToPeriod: ToPeriod,
        AccMethodTypeId: $("#TypeOfAccount").val(),
        NIL: IsNILReturnsChecked(),
        BInvIncome: IsInvestmentIncomeChecked(),
        BEmpIncome: IsEmploymentIncomeChecked(),
        BOtherIncome: IsBusinessIncomeChecked(),
        Permissions: nameTIN.Codes,
        PTR1: [
            {
                BalanceSheetDate: ToPeriod,
                Stocks: MoneyToNumber($("#StocksInventories").val()),
                Prepayment: MoneyToNumber($("#Prepayment").val()),
                Receivables: MoneyToNumber($("#Receivables").val()),
                CashBalance: MoneyToNumber($("#CashBankBalances").val()),
                OtherCurrentAssets: MoneyToNumber($("#OtherCurrentAssets").val()),
                Land: MoneyToNumber($("#Land").val()),
                Building: MoneyToNumber($("#Building").val()),
                MotorVehicle: MoneyToNumber($("#MotorVehicle").val()),
                Equipment: MoneyToNumber($("#FurnitureEquipment").val()),
                OtherAssets: MoneyToNumber($("#OtherAssets").val()),
                BillsPayable: MoneyToNumber($("#BillsPayable").val()),
                Accruals: MoneyToNumber($("#Accruals").val()),
                Loans: MoneyToNumber($("#LoansOverdraft").val()),
                OtherPayables: MoneyToNumber($("#OtherPayables").val()),
                CapitalBf: MoneyToNumber($("#CapitalBF").val()),
                NetProfit: MoneyToNumber($("#NetProfit").val()),
                Drawings: MoneyToNumber($("#Drawings").val()),
            }
        ],
        PTR2: [
            {
                GrossBusinessIncome: MoneyToNumber($("#GrossBusinessIncome").val()),
                OperatingCost: MoneyToNumber($("#OperatingCost").val()),
                GeneralAndAdminExpense: MoneyToNumber($("#GeneralAdminExpenses").val()),
                LabourCost: MoneyToNumber($("#StaffLabourCosts").val()),
                InterestExpenses: MoneyToNumber($("#InterestExpenses").val()),
                Depreciation: MoneyToNumber($("#Depreciation").val()),
                OtherPayables: MoneyToNumber($("#OtherExpenses").val()),
                BasicSalary: MoneyToNumber($("#BasicSalary").val()),
                CashAllowance: MoneyToNumber($("#CashAllowances").val()),
                OtherCashBenefit: MoneyToNumber($("#OtherCashBenefit").val()),
                ExcessBonus: MoneyToNumber($("#ExcessBonus").val()),
                RentElement: MoneyToNumber($("#RentElement").val()),
                CarElement: MoneyToNumber($("#CarElement").val()),
                OtherElements: MoneyToNumber($("#OthersInKind").val()),
                DirectorsFee: MoneyToNumber($("#DirectorFees").val()),
                Commission: MoneyToNumber($("#Commission").val()),
                Royalty: MoneyToNumber($("#Royalty").val()),
                Charges: MoneyToNumber($("#Charges").val()),
                Annuity: MoneyToNumber($("#Annuity").val()),
                TaxableRentIncome: MoneyToNumber($("#TaxableRentIncome").val()),
                Discounts: MoneyToNumber($("#Discounts").val()),
                Premium: MoneyToNumber($("#Premium").val()),
                Interest: MoneyToNumber($("#Interest").val()),
                Others: MoneyToNumber($("#OtherInvestment").val())
            }
        ],
        PTR3: [
            {
                NetBusinessProfit: MoneyToNumber($("#NetBusinessProfit").val()),
                Depreciation: MoneyToNumber($("#AddBackDepreciation").val()),
                NonAllowableDeductions: MoneyToNumber($("#NonAllowableDeductions").val()),
                NonTaxableincome: MoneyToNumber($("#NonTaxableIncome").val()),
                CapitalAllowance: MoneyToNumber($("#CapitalAllowance").val()),
                TotalDeductions: MoneyToNumber($("#TotalDeductions").val()),
                NetAdjustedBusinessProfit: MoneyToNumber($("#NetAdjustedBusinessProfit").val()),
                NetEmploymentIncome: MoneyToNumber($("#AddNetEmploymentIncome").val()),
                NetInvestmentIncome: MoneyToNumber($("#AddNetInvestmentIncome").val()),
                IncomeTaxDiffRates: MoneyToNumber($("#IncomeTaxedAtDifferentRates").val()),
                RelLifeAssurance: MoneyToNumber($("#LifeAssurance").val()),
                RelSocialSecurity: MoneyToNumber($("#SocialSecurity").val()),
                RelMarriageResponsibility: MoneyToNumber($("#MarriageResponsibility").val()),
                RelChildrenEduc: MoneyToNumber($("#ChildrenEducation").val()),
                RelOldAgeEmployees: MoneyToNumber($("#OldAge").val()),
                RelAgedDependants: MoneyToNumber($("#AgedDependants").val()),
                RelDisability: MoneyToNumber($("#Disability").val()),
                RelCostOfTraining: MoneyToNumber($("#CostofTraining").val()),
                RelVolPensionContribution: MoneyToNumber($("#VoluntaryPensionContribution").val()),
                RelOtherAllowableDeductions: MoneyToNumber($("#OtherAllowableDeductions").val()),
                ChargeableIncome: MoneyToNumber($("#AnnualChargeableIncome").val()),
                TaxCharged: MoneyToNumber($("#TaxCharged").val()),
                TaxCredits: MoneyToNumber($("#TaxCredits").val()),
                PaymentOnAccount: MoneyToNumber($("#PaymentOnAccount").val()),
                PriorPeriodCredits: MoneyToNumber($("#PriorPeriodCredits").val()),
                TotalPayment: MoneyToNumber($("#TotalPayments").val()),
                TaxPayable: MoneyToNumber($("#TaxPayableOverpaid").val()),
            }
        ]
    };

    var postData = JSON.stringify(dataModel);
    // console.log("Post Data", postData);

    var postUrl = `?handler=PostPITReturns`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        // console.log('Response Data: ', data);

        // Hide Preloader
        $('body').hideLoading();

        if (data.status == "Successful") {
            toastr.success("Your record has been submitted successfully.");
            AfterPostReturns();
        } else if (data.code === 401) {
            // Perform the Magic (Token Renewal)
            console.log('401 Error: ', 'Lets do the magic...');

        } else {
            toastr.info("Your record could not be submitted. Please try again.");
        }

    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);

        // Hide Preloader
        $('body').hideLoading();
    });

}

function AfterPostReturns() {
    var taxPayingAmt = $("#TaxPayableOverpaid").val();
    var taxPayingNum = MoneyToNumber(taxPayingAmt);
    if (taxPayingNum < 0) {
        // Tax Refund
        PromptConfig = {
            Title: "Tax Refund",
            Message: `Dear ${nameTIN.Name}, your tax is overpaid by <i>GHS${taxPayingAmt}</i>.<br/> Do you want to apply for tax refund?`,
            Positive: {
                Title: "Yes",
                Action: "pit",
                Alert: `Tax Refund application has been submitted successfully. Thank you.`,
                Call: null
            },
            Negative: {
                Title: "No",
                Action: "pit",
                Alert: null,
                Call: null
            }
        };
        ShowPrompt();

    } else if (taxPayingNum === 0) {
        setTimeout(function () { window.location = `${AppServerUrl}/pit`; }, 1000); //1000 means 1 secs
    } else {
        // Pass Year and TaxType to Payment: Using locaStage.
        var payingModel = {
            Year: AssessmentYear,
            TaxType: "PIT"
        }
        localStorage.setItem("YearTaxType", JSON.stringify(payingModel));

        // Tax Due
        PromptConfig = {
            Title: "Tax Due",
            Message: `Dear ${nameTIN.Name}, your tax due is <i>GHS${taxPayingAmt}</i>.<br/>Do you want to pay now?`,
            Positive: {
                Title: "Yes",
                Action: "payment",
                Alert: null,
                Call: null
            },
            Negative: {
                Title: "No",
                Action: "pit",
                Alert: null,
                Call: null
            }
        };
        ShowPrompt();
    }
}

// Post PIT Revised Returns
function PostRevisedReturns() {

    // REQUIRES [ATR002]
    var dataModel = {
        TaxPayerId: nameTIN.Id,
        CurrencyId: $("#CurrencyId").val(),
        AssessmentYear: AssessmentYear,
        FromPeriod: FromPeriod,
        ToPeriod: ToPeriod,
        AccMethodTypeId: $("#TypeOfAccount").val(),
        NIL: IsNILReturnsChecked(),
        BInvIncome: IsInvestmentIncomeChecked(),
        BEmpIncome: IsEmploymentIncomeChecked(),
        BOtherIncome: IsBusinessIncomeChecked(),
        Permissions: nameTIN.Codes,
        PTR1H: [
            {
                BalanceSheetDate: ToPeriod,
                Stocks: MoneyToNumber($("#StocksInventories").val()),
                Prepayment: MoneyToNumber($("#Prepayment").val()),
                Receivables: MoneyToNumber($("#Receivables").val()),
                CashBalance: MoneyToNumber($("#CashBankBalances").val()),
                OtherCurrentAssets: MoneyToNumber($("#OtherCurrentAssets").val()),
                Land: MoneyToNumber($("#Land").val()),
                Building: MoneyToNumber($("#Building").val()),
                MotorVehicle: MoneyToNumber($("#MotorVehicle").val()),
                Equipment: MoneyToNumber($("#FurnitureEquipment").val()),
                OtherAssets: MoneyToNumber($("#OtherAssets").val()),
                BillsPayable: MoneyToNumber($("#BillsPayable").val()),
                Accruals: MoneyToNumber($("#Accruals").val()),
                Loans: MoneyToNumber($("#LoansOverdraft").val()),
                OtherPayables: MoneyToNumber($("#OtherPayables").val()),
                CapitalBf: MoneyToNumber($("#CapitalBF").val()),
                NetProfit: MoneyToNumber($("#NetProfit").val()),
                Drawings: MoneyToNumber($("#Drawings").val()),
            }
        ],
        PTR2H: [
            {
                GrossBusinessIncome: MoneyToNumber($("#GrossBusinessIncome").val()),
                OperatingCost: MoneyToNumber($("#OperatingCost").val()),
                GeneralAndAdminExpense: MoneyToNumber($("#GeneralAdminExpenses").val()),
                LabourCost: MoneyToNumber($("#StaffLabourCosts").val()),
                InterestExpenses: MoneyToNumber($("#InterestExpenses").val()),
                Depreciation: MoneyToNumber($("#Depreciation").val()),
                OtherPayables: MoneyToNumber($("#OtherExpenses").val()),
                BasicSalary: MoneyToNumber($("#BasicSalary").val()),
                CashAllowance: MoneyToNumber($("#CashAllowances").val()),
                OtherCashBenefit: MoneyToNumber($("#OtherCashBenefit").val()),
                ExcessBonus: MoneyToNumber($("#ExcessBonus").val()),
                RentElement: MoneyToNumber($("#RentElement").val()),
                CarElement: MoneyToNumber($("#CarElement").val()),
                OtherElements: MoneyToNumber($("#OthersInKind").val()),
                DirectorsFee: MoneyToNumber($("#DirectorFees").val()),
                Commission: MoneyToNumber($("#Commission").val()),
                Royalty: MoneyToNumber($("#Royalty").val()),
                Charges: MoneyToNumber($("#Charges").val()),
                Annuity: MoneyToNumber($("#Annuity").val()),
                TaxableRentIncome: MoneyToNumber($("#TaxableRentIncome").val()),
                Discounts: MoneyToNumber($("#Discounts").val()),
                Premium: MoneyToNumber($("#Premium").val()),
                Interest: MoneyToNumber($("#Interest").val()),
                Others: MoneyToNumber($("#OtherInvestment").val())
            }
        ],
        PTR3H: [
            {
                NetBusinessProfit: MoneyToNumber($("#NetBusinessProfit").val()),
                Depreciation: MoneyToNumber($("#AddBackDepreciation").val()),
                NonAllowableDeductions: MoneyToNumber($("#NonAllowableDeductions").val()),
                NonTaxableincome: MoneyToNumber($("#NonTaxableIncome").val()),
                CapitalAllowance: MoneyToNumber($("#CapitalAllowance").val()),
                TotalDeductions: MoneyToNumber($("#TotalDeductions").val()),
                NetAdjustedBusinessProfit: MoneyToNumber($("#NetAdjustedBusinessProfit").val()),
                NetEmploymentIncome: MoneyToNumber($("#AddNetEmploymentIncome").val()),
                NetInvestmentIncome: MoneyToNumber($("#AddNetInvestmentIncome").val()),
                IncomeTaxDiffRates: MoneyToNumber($("#IncomeTaxedAtDifferentRates").val()),
                RelLifeAssurance: MoneyToNumber($("#LifeAssurance").val()),
                RelSocialSecurity: MoneyToNumber($("#SocialSecurity").val()),
                RelMarriageResponsibility: MoneyToNumber($("#MarriageResponsibility").val()),
                RelChildrenEduc: MoneyToNumber($("#ChildrenEducation").val()),
                RelOldAgeEmployees: MoneyToNumber($("#OldAge").val()),
                RelAgedDependants: MoneyToNumber($("#AgedDependants").val()),
                RelDisability: MoneyToNumber($("#Disability").val()),
                RelCostOfTraining: MoneyToNumber($("#CostofTraining").val()),
                RelVolPensionContribution: MoneyToNumber($("#VoluntaryPensionContribution").val()),
                RelOtherAllowableDeductions: MoneyToNumber($("#OtherAllowableDeductions").val()),
                ChargeableIncome: MoneyToNumber($("#AnnualChargeableIncome").val()),
                TaxCharged: MoneyToNumber($("#TaxCharged").val()),
                TaxCredits: MoneyToNumber($("#TaxCredits").val()),
                PaymentOnAccount: MoneyToNumber($("#PaymentOnAccount").val()),
                PriorPeriodCredits: MoneyToNumber($("#PriorPeriodCredits").val()),
                TotalPayment: MoneyToNumber($("#TotalPayments").val()),
                TaxPayable: MoneyToNumber($("#TaxPayableOverpaid").val()),
            }
        ]
    };

    var postData = JSON.stringify(dataModel);
    //console.log("Post Data", postData);

    var postUrl = `?handler=PostPITRevisedReturns`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.status == "Successful") {
            toastr.success("Your record has been submitted successfully.");
            //setTimeout(function () { window.location = `${AppServerUrl}/pit`; }, 1000); //1000 means 1 secs
            AfterPostReturns();
        } else {
            toastr.info("Your record could not be submitted. Please try again.");
        }

    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
    });

}

function DisplayPITSetup() {
    //console.log("PITData: ", PITData);
    if (isNotEmpty(PITData)) {
        // Check Period and Populate FromDate ToDate
        FromPeriod = new Date(GetDateOrTime(PITData.fromPeriod).date);
        ToPeriod = new Date(GetDateOrTime(PITData.toPeriod).date);

        $("#FromPeriod").html(FromPeriod.toLocaleDateString("en-US", YearOptions));
        $("#ToPeriod").html(ToPeriod.toLocaleDateString("en-US", YearOptions));

        // $("#FromPeriod").text(`January 1, ${AssessmentYear}`);
        // $("#ToPeriod").text(`December 31, ${AssessmentYear}`);

        // Show Year Period
        $("#YearPeriod").removeAttr("hidden");

        $("#SetupNILReturns").prop("checked", PITData.nil);
        $("#SetupEmployee").prop("checked", PITData.bEmpIncome);
        $("#SetupBusiness").prop("checked", PITData.bOtherIncome);
        $("#SetupInvestment").prop("checked", PITData.bInvIncome);

        // Show Setup Modal
        $('#PITSetupModal').modal('show');
    }
}

function DisplayPITData() {
    //console.log("PITData: ", PITData);

    if (isNotEmpty(PITData)) {
        var PITDataSub1 = {};
        var PITDataSub2 = {};
        var PITDataSub3 = {};
        switch (PITDataToDisplay) {
            case "returns":
                // Final Returns Data :  Not in use now.
                PITDataSub1 = PITData.ptR1[0];
                PITDataSub2 = PITData.ptR2[0];
                PITDataSub3 = PITData.ptR3[0];
                break;
            case "revised":
                // Final Revised Data: Not in use now.
                PITDataSub1 = PITData.ptR1H[0];
                PITDataSub2 = PITData.ptR2H[0];
                PITDataSub3 = PITData.ptR3H[0];
                break;
            default: // savedContinue
                // Save & Continue Data (Returns & Revised)
                PITDataSub1 = PITData.ptR1SC[0];
                PITDataSub2 = PITData.ptR2SC[0];
                PITDataSub3 = PITData.ptR3SC[0];
                break;
        }

        /********** BALANCE SHEET ***********/
        //console.log("PITDataSub1: ", PITDataSub1);

        // Current Assets
        $("#StocksInventories").val(NumberToMoney(PITDataSub1.stocks));
        $("#Receivables").val(NumberToMoney(PITDataSub1.receivables));
        $("#CashBankBalances").val(NumberToMoney(PITDataSub1.cashBalance));
        $("#Prepayment").val(NumberToMoney(PITDataSub1.prepayment));
        $("#OtherCurrentAssets").val(NumberToMoney(PITDataSub1.otherCurrentAssets));

        // Non-Current Assets
        $("#Land").val(NumberToMoney(PITDataSub1.land));
        $("#Building").val(NumberToMoney(PITDataSub1.building));
        $("#FurnitureEquipment").val(NumberToMoney(PITDataSub1.equipment));
        $("#MotorVehicle").val(NumberToMoney(PITDataSub1.motorVehicle));
        $("#OtherAssets").val(NumberToMoney(PITDataSub1.otherAssets));

        //Current Payables
        $("#BillsPayable").val(NumberToMoney(PITDataSub1.billsPayable));
        $("#LoansOverdraft").val(NumberToMoney(PITDataSub1.loans));
        $("#Accruals").val(NumberToMoney(PITDataSub1.accruals));
        $("#OtherPayables").val(NumberToMoney(PITDataSub1.otherPayables));

        // Capital
        $("#CapitalBF").val(NumberToMoney(PITDataSub1.capitalBf));
        $("#NetProfit").val(NumberToMoney(PITDataSub1.netProfit));
        $("#Drawings").val(NumberToMoney(PITDataSub1.drawings));


        /********** INCOME STATEMENT ***********/
        // console.log("PITDataSub2: ", PITDataSub2);

        //Business Expenses
        $("#GrossBusinessIncome").val(NumberToMoney(PITDataSub2.grossBusinessIncome)); //??
        $("#OperatingCost").val(NumberToMoney(PITDataSub2.operatingCost));
        $("#GeneralAdminExpenses").val(NumberToMoney(PITDataSub2.generalAndAdminExpense));
        $("#StaffLabourCosts").val(NumberToMoney(PITDataSub2.labourCost));
        $("#InterestExpenses").val(NumberToMoney(PITDataSub2.interestExpenses));
        $("#Depreciation").val(NumberToMoney(PITDataSub2.depreciation));
        $("#OtherExpenses").val(NumberToMoney(PITDataSub2.otherPayables)); //??
        // PITDataSub2.otherPayables : 404!

        //Employment Income
        // Cash Benefits
        $("#BasicSalary").val(NumberToMoney(PITDataSub2.basicSalary));
        $("#CashAllowances").val(NumberToMoney(PITDataSub2.cashAllowance));
        $("#OtherCashBenefit").val(NumberToMoney(PITDataSub2.otherCashBenefit));
        $("#ExcessBonus").val(NumberToMoney(PITDataSub2.excessBonus));

        // Benefits in Kind    
        $("#RentElement").val(NumberToMoney(PITDataSub2.rentElement));
        $("#CarElement").val(NumberToMoney(PITDataSub2.carElement));
        $("#OthersInKind").val(NumberToMoney(PITDataSub2.otherElements));

        //Investment Incomes    
        $("#DirectorFees").val(NumberToMoney(PITDataSub2.directorsFee));
        $("#Commission").val(NumberToMoney(PITDataSub2.commission));
        $("#Royalty").val(NumberToMoney(PITDataSub2.royalty));
        $("#Charges").val(NumberToMoney(PITDataSub2.charges));
        $("#Annuity").val(NumberToMoney(PITDataSub2.annuity));
        $("#TaxableRentIncome").val(NumberToMoney(PITDataSub2.taxableRentIncome));
        $("#Discounts").val(NumberToMoney(PITDataSub2.discounts));
        $("#Premium").val(NumberToMoney(PITDataSub2.premium));
        $("#Interest").val(NumberToMoney(PITDataSub2.interest));
        $("#OtherInvestment").val(NumberToMoney(PITDataSub2.others)); //??
        // PITDataSub2.others : 404!


        /********** TAX COMPUTATION ***********/
        // console.log("PITDataSub3: ", PITDataSub3);

        //Add Backs    
        $("#AddBackDepreciation").val(NumberToMoney(PITDataSub3.depreciation));
        $("#NonAllowableDeductions").val(NumberToMoney(PITDataSub3.nonAllowableDeductions));
        $("#AdjustedBusinessProfit").val(NumberToMoney(PITDataSub3.netAdjustedBusinessProfit));
        $("#NetBusinessProfit").val(NumberToMoney(PITDataSub3.netBusinessProfit));
        $("#NetEmploymentIncome").val(NumberToMoney(PITDataSub3.netEmploymentIncome));
        $("#NetInvestmentIncome").val(NumberToMoney(PITDataSub3.netInvestmentIncome));

        //Total Deductions    
        $("#NonTaxableIncome").val(NumberToMoney(PITDataSub3.nonTaxableincome));
        $("#CapitalAllowance").val(NumberToMoney(PITDataSub3.capitalAllowance));

        // Deduct Reliefs    
        $("#LifeAssurance").val(NumberToMoney(PITDataSub3.relLifeAssurance));
        $("#SocialSecurity").val(NumberToMoney(PITDataSub3.relSocialSecurity));
        $("#MarriageResponsibility").val(NumberToMoney(PITDataSub3.relMarriageResponsibility));
        $("#ChildrenEducation").val(NumberToMoney(PITDataSub3.relChildrenEduc));
        $("#OldAge").val(NumberToMoney(PITDataSub3.relOldAgeEmployees));
        $("#AgedDependants").val(NumberToMoney(PITDataSub3.relAgedDependants));
        $("#Disability").val(NumberToMoney(PITDataSub3.relDisability));
        $("#CostofTraining").val(NumberToMoney(PITDataSub3.relCostOfTraining));
        $("#VoluntaryPensionContribution").val(NumberToMoney(PITDataSub3.relVolPensionContribution));
        $("#OtherAllowableDeductions").val(NumberToMoney(PITDataSub3.relOtherAllowableDeductions));
        $("#ReliefsDeductions").val(NumberToMoney(PITDataSub3.totalDeductions));

        // Sundry
        $("#IncomeTaxedAtDifferentRates").val(NumberToMoney(PITDataSub3.incomeTaxDiffRates));
        $("#AnnualChargeableIncome").val(NumberToMoney(PITDataSub3.chargeableIncome));

        //GetTaxPayable
        $("#TaxCharged").val(NumberToMoney(PITDataSub3.taxCharged));

        // Payments
        $("#TaxCredits").val(NumberToMoney(PITDataSub3.taxCredits));
        $("#PaymentOnAccount").val(NumberToMoney(PITDataSub3.paymentOnAccount));
        $("#PriorPeriodCredits").val(NumberToMoney(PITDataSub3.priorPeriodCredits));
        $("#TotalPayments").val(NumberToMoney(PITDataSub3.totalPayment));

        // Payable/Overpaid
        $("#TaxPayableOverpaid").val(NumberToMoney(PITDataSub3.taxPayable));

        // Compute Totals
        ComputeTaxReturns();
    }
}

var ViewPreview = function () {
    // Display Preview Data
    PITData = PITPreviewData;
    PITDataToDisplay = "returns";
    DisplayPITData();
                    

    //Display Preview
    DisplayPrintPreview();

    // Hide Submit Button on Preview
    $("#PreviewSubmit").prop("hidden", true);

    //Open Preview
    $('#PreviewModal').modal('show');
}

function DisplayPrintPreview() {

    // Get All Tax Fields Values and Pass To Respective Preview Span
    $("input[class*='Tax']").each(function () {
        var disId = $(this).attr('id');
        var disVal = $(this).val();
        $(`#${disId}PV`).text(disVal);
        // console.log(disId + ":", disVal);
    });

    // Exceptions

    /*
    // Get Date & Time
    var postUrl = `?handler=GetCurrentDate`;
    $.post(postUrl, null, function (data, status) {
        // Log response to console
        // console.log('GetCurrentDate Data: ', data);
        if (data.status === "Successful") {
            // Year Options
            var dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            var currentDate = new Date(GetDateOrTime(data.body.currentDate).dateTime);//;
            $("#DateSubmittedPV").text(currentDate.toLocaleDateString("en-US", dateOptions))
        }
    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
        });
    */

    $("#AssessmentYearPV").text(AssessmentYear)
    var fromPeriod = $("#FromPeriod").text();
    var toPeriod = $("#ToPeriod").text();
    var fromToPeriod = `From: ${fromPeriod} - To: ${toPeriod}`;
    $("#FromToPeriodPV").text(fromToPeriod);
    $("#ToBalanceSheetPV").text(toPeriod);
    var dSubmitted = new Date();

    if (isNotEmpty(PITData)) {
        // From
        var mPeriod = new Date(GetDateOrTime(PITData.fromPeriod).date);
        var mPeriodDate = mPeriod.toLocaleDateString("en-US", YearOptions);
        // To
        var oPeriod = new Date(GetDateOrTime(PITData.toPeriod).date);
        var oPeriodDate = oPeriod.toLocaleDateString("en-US", YearOptions);
        // FromTo
        var moPeriod = `From: ${mPeriodDate} - To: ${oPeriodDate}`;
        $("#FromToPeriodPV").text(moPeriod);
        $("#ToBalanceSheetPV").text(oPeriodDate);
                
        //console.log("PITData.createDate", PITData.createDate);
        if (PITData.createDate) {
            dSubmitted = new Date(GetDateOrTime(PITData.createDate).dateTime);
        }
    }
    //console.log("dSubmitted:", dSubmitted);

    // Year Options
    var dOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    $("#DateSubmittedPV").text(dSubmitted.toLocaleDateString("en-US", dOptions));

    $("#TaxOfficePV").text($("#CurrentTaxOffice").val())
    $("#LastNamePV").text($("#LastName").val())
    $("#FirstNamePV").text($("#FirstName").val())
    $("#OtherNamesPV").text($("#OtherNames").val())
    $("#TINPV").text($("#TaxIdentificationNumber").val())
    $("#NationalityPV").text($("#Nationality").val())

    // console.log("TaxConsultantData :", TaxConsultantData);
    $("#AccoutingMethodPV").text()

    $("#NetBusinessProfitPV").text($("#NetBusinessProfitLoss").val());
    $("#AddNetEmploymentIncomePV").text($("#NetEmploymentIncome").val());
    $("#AddNetInvestmentIncomePV").text($("#NetInvestmentIncome").val());
    //$("#NetBusinessProfitPV").text($("#Nationality").val());

    // Display Businesses
    var tableBusinesses = "";
    for (t = 0; t < TaxPayerBusinessesData.length; t++) {
        var tId = t + 1;
        tableBusinesses += `<tr><td>${tId}</td><td>${TaxPayerBusinessesData[t].Name}</td>`;
        tableBusinesses += `<td>${TaxPayerBusinessesData[t].Activity}</td></tr>`;
    }
    // Display in table
    $("#BusinessPreviewBody").html(tableBusinesses);

    // Display TaxPayer Holidays
    // console.log("TaxPayerHolidays", TaxPayerHolidays);
    var tableHolidays = "";
    for (h = 0; h < TaxPayerHolidays.length; h++) {
        // var hId = h + 1;
        var hEffectiveDate = new Date(GetDateOrTime(TaxPayerHolidays[h].effectiveDate).date);
        var hProductionDate = new Date(GetDateOrTime(TaxPayerHolidays[h].firstProductionDate).date);

        tableHolidays += `<tr><td>${TaxPayerHolidays[h].taxHoliday}</td>`;
        tableHolidays += `<td>${hEffectiveDate.toLocaleDateString("en-US", YearOptions)}</td>`;
        tableHolidays += `<td>${hProductionDate.toLocaleDateString("en-US", YearOptions)}</td></tr>`;
    }
    // Display in table
    $("#TaxHolidaysPreviewBody").html(tableHolidays);

    // Get TaxConsultant
    if (TaxPayerData.taxConsultant.tin != null) {
        GetTaxConsultants();
    }

}

// Get TaxConsultant
function GetTaxConsultants() {
    var dataModel = {
        TIN: TaxPayerData.taxConsultant.tin
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerData`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        // console.log('GetTaxPayerData Data: ', data.body);
        if (data.status === "Successful") {
            $("#TaxConsultantNamePV").text(data.body.displayName);
            $("#TaxConsultantTINPV").text(data.body.tin);
            $("#TaxConsultantPhonePV").text(data.body.mobileNumber);
            $("#TaxConsultantEmailPV").text(data.body.emailAddress);
        }
    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
    });

}

// Final Submission
$("#DeclarationSubmit").click(function () {
    if (currentPathName == returnsPage) {
        PostReturns();
    } else {
        PostRevisedReturns();
    }    
});