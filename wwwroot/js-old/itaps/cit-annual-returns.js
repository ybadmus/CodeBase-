var directorData = [];
var taxHolidayData = [];
var taxCodeRateData = [];
var ServiceURL = 'http://psl-app-vm3/TaxPayerMonoAPI/';
var landlordSheet = document.getElementById("landlordsheet");
var consultantColumn = document.getElementById("consultantColumn");
var stockDiv = document.getElementById("stockDiv");

$(document).ready(function() {
    populateTenancy();

});






var KendoTaxCodeRate = function() {
    var taxCode = $('#taxCode').val();
    var taxRate = $('#taxRate').val();
    var taxPayable = $('#taxPayable').val();

    taxCodeRateData.push({ taxCode: taxCode, taxRate: taxRate, taxPayable: taxPayable });
    grid = $("#sztaxCodeRateTable").kendoGrid({
        dataSource: { data: taxCodeRateData, pageSize: 10 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "taxCode", title: "Tax Code (i)", width: '10%' },
            { field: "taxRate", title: "Tax Rate (ii)", width: '15%' },
            { field: "taxPayable", title: "Tax Payable (iii)", width: '20%' },
            {
                command: [{
                        name: "edit",
                        template: "<button title='Edit item' class='editCriteria btn btn-success btn-sm mr-1'><i class='fa fa-edit'></i></button>"
                    },
                    {
                        name: "delete",
                        template: "<button title='Delete item' class='btn btn-danger btn-sm deleteCriteria'><i class='fa fa-trash' onclick='removeItemWithId()'></i></button>"
                    }
                ],
                title: "Action",
                width: "15%"
            }
        ]
    });
}

$('#saveTaxCodeRate').on('click', function() {
    KendoTaxCodeRate([]);
});


// Tax Holiday Grid
var KendoTaxHoliday = function() {
    var typeOfHoliday = $('#typeOfHoliday').val();
    var effectiveDate = $('#effectiveDate').val();
    var dateOfFirstProduction = $('#effectiveDate').val();

    taxHolidayData.push({ typeOfHoliday: typeOfHoliday, effectiveDate: effectiveDate, dateOfFirstProduction: dateOfFirstProduction })
    grid = $("#ttaxHolidayTable").kendoGrid({
        dataSource: { data: taxHolidayData, pageSize: 10 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "typeOfHoliday", title: "Type Of Holiday", width: '10%' },
            { field: "effectiveDate", title: "Effective Date", width: '15%' },
            { field: "dateOfFirstProduction", title: "Date Of First Production", width: '20%' },
            {
                command: [{
                        name: "edit",
                        template: "<button title='Edit item' class='editCriteria btn btn-success btn-sm mr-1'><i class='fa fa-edit'></i></button>"
                    },
                    {
                        name: "delete",
                        template: "<button title='Delete item' class='btn btn-danger btn-sm deleteCriteria'><i class='fa fa-trash' onclick='removeItemWithId()'></i></button>"
                    }
                ],
                title: "Action",
                width: "15%"
            }
        ]
    });
}

$('#saveTaxHoliday').on('click', function() {
    KendoTaxHoliday([]);
});


// Active Or Inactive.
function populateTenancy() {
    var variable = 'TES';
    const url = `${ServiceURL}api/GenericCodes/GetGCOTByTypeAsync/${variable}`;
    $.get(url, function(data, status) {
        var options = "<option value='0' selected disabled>Select Tenancy</option>";
        $(data).each(function(i, val) {
            options += "<option value='" + val.id + "'>" + val.description + "</option>";
        });
        $('#tenancyId').html(options);
    }).fail(function(response) {
        console.log('Response Error: ' + response.responseText);
    });
}

var KendoDirector = function() {
    //var tinOfDirector = $('#tinOfDirector').val();
    var tenaName;
    var nameOfDirector = $('#nameOfDirector').val();
    var dirFees = $('#dirFees').val();
    var tenancyId = $('#tenancyId').val();
    switch (tenancyId) {
        case 'bb6a5984-fc0d-4d53-989e-26593571e495':
            tenaName = "Rented"
            break;
        case 'dc9c4189-3187-4020-8b44-29cbf3a91e8c':
            tenaName = "Not Applicable"
            break;
        case '53196965-9d9a-4eee-a6ee-f2f1ae2bfb40':
            tenaName = "Owned"
            break;
        default:
            tenaName = "Owned"
            break;
    }
    var dirSalary = $('#dirSalary').val();
    var dirInterest = $('#dirInterest').val();
    var dirAllowances = $('#dirAllowances').val();
    var totalForDirector = Number(commaRemover(dirFees)) + Number(commaRemover(dirSalary)) + Number(commaRemover(dirInterest)) + Number(commaRemover(dirAllowances));
    var dirTotal = $('#dirTotal').value = moneyInTxt(totalForDirector, 'en', 2);
    var dirLoans = $('#dirLoans').val();

    // Data pushed goes here
    directorData.push({ nameOfDirector: nameOfDirector, dirFees: dirFees, tenancyId: tenaName, dirSalary: dirSalary, dirInterest: dirInterest, dirAllowances: dirAllowances, dirTotal: dirTotal, dirLoans: dirLoans })

    grid = $("#directorsTable").kendoGrid({
        dataSource: { data: directorData, pageSize: 10 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "nameOfDirector", title: "Director's Name", width: '15%' },
            { field: "dirFees", title: "Director's Fee", width: '10%', attributes: { style: "text-align:right;" } },
            { field: "dirSalary", title: "Director's Salary", width: '12%', attributes: { style: "text-align:right;" } },
            { field: "dirInterest", title: "Director's Interest", width: '11%', attributes: { style: "text-align:right;" } },
            { field: "dirAllowances", title: "Director's Allowance", width: '13%', attributes: { style: "text-align:right;" } },
            { field: "dirTotal", title: "Total Amount", width: '10%', attributes: { style: "text-align:right; color: blue" } },
            { field: "dirLoans", title: "Loan", width: '9%', attributes: { style: "text-align:right;" } },
            { field: "tenancyId", title: "Tenancy Status", width: '10%' },
            {
                command: [{
                        name: "edit",
                        template: "<button title='Edit item' class='editCriteria btn btn-success btn-sm mr-1'><i class='fa fa-edit'></i></button>"
                    },
                    {
                        name: "delete",
                        template: "<button title='Delete item' class='btn btn-danger btn-sm deleteCriteria'><i class='fa fa-trash' onclick='removeItemWithId()'></i></button>"
                    }
                ],
                title: "Action",
                width: "10%"
            }
        ]
    });

}

$('#saveDirector').on('click', function() {
    KendoDirector([]);
});




function commaRemover(someValue) {
    var new_string = someValue.replace(/,/g, "");
    return new_string;
}

function totalCashAssets() {
    var cash_ass_a = document.getElementById("cashAssetsA").value;
    var cash_ass_b = document.getElementById("cashAssetsB").value;
    var totalCashAss = Number(commaRemover(cash_ass_a)) + Number(commaRemover(cash_ass_b));
    document.getElementById("totalCashAssetsC").value = moneyInTxt(totalCashAss, 'en', 2);

}

function totalCurrentAssets() {
    var totalCashAssC = document.getElementById("totalCashAssetsC").value;
    var stocksD = document.getElementById("stocksD").value;
    var accRecE = document.getElementById("accReceivablesE").value;
    var totalCurrAss = Number(commaRemover(totalCashAssC)) + Number(commaRemover(stocksD)) + Number(commaRemover(accRecE));
    document.getElementById('totalCurrentAssetsF').value = moneyInTxt(totalCurrAss, 'en', 2);
}

function totalAssets() {
    var totalCurrAssF = document.getElementById("totalCurrentAssetsF").value;
    var fixedAssG = document.getElementById("fixedAssetsG").value;
    var otherAssH = document.getElementById("otherAssetsH").value;
    var totalAss = Number(commaRemover(totalCurrAssF)) + Number(commaRemover(fixedAssG)) + Number(commaRemover(otherAssH));
    document.getElementById('totalAssetsI').value = moneyInTxt(totalAss, 'en', 2);
}

function doTotalTradePayables() {
    var tradePayablesA = document.getElementById("tradePayablesA").value;
    var tradePayablesB = document.getElementById("tradePayablesB").value;

    var tradePayablesC = Number(commaRemover(tradePayablesA)) + Number(commaRemover(tradePayablesB));
    document.getElementById('totalTradePayablesC').value = moneyInTxt(tradePayablesC, 'en', 2);
    console.log(tradePayablesC);
}

function doTotalOtherPayables() {
    var otherPayablesD = document.getElementById("otherPayablesD").value;
    var otherPayablesE = document.getElementById("otherPayablesE").value;

    var totalOtherPayablesF = Number(commaRemover(otherPayablesD)) + Number(commaRemover(otherPayablesE));
    document.getElementById("totalOtherPayablesF").value = moneyInTxt(totalOtherPayablesF, 'en', 2);
    console.log(totalOtherPayablesF);
}

function doTotalPayables() {
    var totalTradePayablesC = document.getElementById('totalTradePayablesC').value;
    var totalOtherPayablesF = document.getElementById('totalOtherPayablesF').value;

    var totalPayablesG = Number(commaRemover(totalTradePayablesC)) + Number(commaRemover(totalOtherPayablesF));
    document.getElementById("totalPayablesG").value = moneyInTxt(totalPayablesG, 'en', 2);
    console.log("Total payables = ", totalPayablesG);
}

function doTotalPayShare() {
    var totalPayablesG = document.getElementById('totalPayablesG').value;
    var shareFundH = document.getElementById("shareFundH").value;

    var totalPayShareI = Number(commaRemover(totalPayablesG)) + Number(commaRemover(shareFundH));
    document.getElementById('totalPayShareI').value = moneyInTxt(totalPayShareI, 'en', 2);

}

function doTaxes() {
    var localIncomeA = document.getElementById('localIncomeA').value;
    var exportIncomeB = document.getElementById('exportIncomeB').value;
    var totBusIncomeC = document.getElementById('totBusIncomeC').value;
    var investIncomeD = document.getElementById('investIncomeD').value;
    var otherIncomeE = document.getElementById('otherIncomeE').value;
    var totCompIncomeF = document.getElementById('totCompIncomeF').value;
    var opExpensesG = document.getElementById('opExpensesG').value;
    var opExpensesH = document.getElementById('opExpensesH').value;
    var totOpExpensesI = document.getElementById('totOpExpensesI').value;
    var dirRemunerationJ = document.getElementById('dirRemunerationJ').value;
    var staffCostsK = document.getElementById('staffCostsK').value;
    var interestExpensesL = document.getElementById('interestExpensesL').value;
    var interestExpensesM = document.getElementById('interestExpensesM').value;
    var totInterestExpN = document.getElementById('totInterestExpN').value;
    var totGenExpO = document.getElementById('totGenExpO').value;
    var depreciationP = document.getElementById('depreciationP').value;
    var foreignExLossQ = document.getElementById('foreignExLossQ').value;
    var otherGenExpR = document.getElementById('otherGenExpR').value;
    var totalExpenses = document.getElementById('totalExpenses').value;
    var netCompProfLossT = document.getElementById('netCompProfLossT').value;

    document.getElementById('totBusIncomeC').value = moneyInTxt(Number(commaRemover(localIncomeA)) + Number(commaRemover(exportIncomeB)), 'en', 2);

    document.getElementById('totCompIncomeF').value = moneyInTxt(Number(commaRemover(totBusIncomeC)) + Number(commaRemover(investIncomeD)) + Number(commaRemover(otherIncomeE)), 'en', 2);

    document.getElementById('totOpExpensesI').value = moneyInTxt(Number(commaRemover(opExpensesG)) + Number(commaRemover(opExpensesH)), 'en', 2);

    document.getElementById('totInterestExpN').value = moneyInTxt(Number(commaRemover(interestExpensesL)) + Number(commaRemover(interestExpensesM)), 'en', 2);

    document.getElementById('totGenExpO').value = moneyInTxt(Number(commaRemover(dirRemunerationJ)) + Number(commaRemover(staffCostsK)) + Number(commaRemover(totInterestExpN)), 'en', 2);

    document.getElementById('totalExpenses').value = moneyInTxt(Number(commaRemover(totOpExpensesI)) + Number(commaRemover(totGenExpO)) +
        Number(commaRemover(depreciationP)) + Number(commaRemover(foreignExLossQ)) + Number(commaRemover(otherGenExpR)), 'en', 2);

    document.getElementById('netCompProfLossT').value = moneyInTxt(Number(commaRemover(totCompIncomeF)) - Number(commaRemover(totalExpenses)), 'en', 2);


    //Tax calculation
    var netComProfLossA = document.getElementById('netCompProfLossT').value;
    var nonAllowDedB = document.getElementById('nonAllowDedB').value;
    var adjNetProfLossC = document.getElementById('adjNetProfLossC').value;
    var nonTaxIncomeD = document.getElementById('nonTaxIncomeD').value;
    var adjIncomeE = document.getElementById('adjIncomeE').value;
    var capAllowF = document.getElementById('capAllowF').value;
    var carryForwardG = document.getElementById('carryForwardG').value;
    var otherAllowDedH = document.getElementById('otherAllowDedH').value;
    var totAllowDedI = document.getElementById('totAllowDedI').value;

    document.getElementById('netComProfLossA').value = moneyInTxt(commaRemover(netCompProfLossT), 'en', 2);

    document.getElementById('adjNetProfLossC').value = moneyInTxt(Number(commaRemover(netComProfLossA)) + Number(commaRemover(nonAllowDedB)), 'en', 2);

    document.getElementById('adjIncomeE').value = moneyInTxt(Number(commaRemover(adjNetProfLossC)) - Number(commaRemover(nonTaxIncomeD)), 'en', 2);

    document.getElementById('totAllowDedI').value = moneyInTxt(Number(commaRemover(capAllowF)) + Number(commaRemover(carryForwardG)) + Number(commaRemover(otherAllowDedH)), 'en', 2);


    //chargeable income
    var totChargeIncome = document.getElementById('totChargeIncome').value;
    var chargeIncomeDR = document.getElementById('chargeIncomeDR').value;
    var chargeIncomeNR = document.getElementById('chargeIncomeNR').value;
    var TC = document.getElementById('TC').value;
    var TR = document.getElementById('TR').value;
    var TL = document.getElementById('totChargeIncome').value;
    var tRebate = document.getElementById('tRebate').value;
    var rateOftRebate = document.getElementById('rateOftRebate').value;
    var amtOftRebate = document.getElementById('amtOftRebate').value;
    var tPayable = document.getElementById('tPayable').value;

    document.getElementById('totChargeIncome').value = moneyInTxt(Number(commaRemover(adjIncomeE)) - Number(commaRemover(totAllowDedI)), 'en', 2);
    document.getElementById('TL').value = moneyInTxt(Number(commaRemover(chargeIncomeNR)) * Number(commaRemover(TR)), 'en', 2);
    document.getElementById('amtOftRebate').value = moneyInTxt(Number(commaRemover(TL)) * Number(commaRemover(rateOftRebate)), 'en', 2);
    document.getElementById('tPayable').value = moneyInTxt(Number(commaRemover(TL)) - Number(commaRemover(amtOftRebate)), 'en', 2);


    //chargeable incomes taxed at diff rates
    var tPayablex = document.getElementById('tPayable').value;
    document.getElementById('tPayablex').value = moneyInTxt(Number(commaRemover(tPayablex)), 'en', 2);


    var totTaxChargeIncomeD = document.getElementById('totTaxChargeIncomeD').value;
    var totTaxPayableE = document.getElementById('totTaxPayableE').value;
    var withholdingTaxCredF = document.getElementById('withholdingTaxCredF').value;
    var taxPaidDirG = document.getElementById('taxPaidDirG').value;
    var priorPeriodCredH = document.getElementById('priorPeriodCredH').value;
    var totDirPaymentI = document.getElementById('totDirPaymentI').value;

    var incomeTaxOutstandingJ = document.getElementById('incomeTaxOutstandingJ').value;
    var statLevK = document.getElementById('statLevK').value;


    document.getElementById('incomeTaxOutstandingJ').value = moneyInTxt(Number(commaRemover(totTaxPayableE)) - Number(commaRemover(totDirPaymentI)), 'en', 2);

    //totTaxChargeIncomeD = 156.89 + 256.89 + 326.20;
    document.getElementById('totTaxChargeIncomeD').value = 739.98;

    document.getElementById('totTaxPayableE').value = moneyInTxt(Number(commaRemover(tPayable)) + Number(commaRemover(totTaxChargeIncomeD)), 'en', 2);

    console.log(totTaxChargeIncomeD);

}


let current_datetime = new Date();
var ComputePeriodValues = function() {
    //const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "12", "12"];
    let assessmentYear = $("#yearOfAssessment").val();
    if (assessmentYear >= 1990) {
        $("#startDate").val("01" + "/" + months[0] + "/" + assessmentYear);
        $("#endDate").val("31" + "/" + months[11] + "/" + assessmentYear);
    } else {
        $("#startDate").val("");
        $("#endDate").val("");
    }
}


function IsPeriodOK() {
    let fromPeriod = $("#startDate").val();
    let toPeriod = $("#endDate").val();
    if (fromPeriod != "" && fromPeriod != null && toPeriod != "" && toPeriod != null) {
        return true;
    }

    return false;
}

$('#btnSubmit').click(function(e) {
    // var isValid = true;
    // $('.validate-value').each(function() {
    //     if ($.trim($(this).val()) == '') {
    //         isValid = false;
    //         $(this).css({ "border": "2px solid red", "background": "" });

    //     } else {
    //         $(this).css({ "border": "2px solid green", "background": "" });
    //     }
    // });
    // if (isValid == false)
    //     toastr.warning("Please Fill All Fields to Submit!");
    // //e.preventDefault();
    // else
    $('#modal-declare').modal('show');
    //console.log('Thank you for submitting');
});



$('#DeclarationSubmit').on('click', function() {
    let assessmentyear = $("#yearOfAssessment").val();
    let datefromperiod = new Date(`${assessmentyear}-01-01`);
    let FrmPeriod = datefromperiod.getFullYear() + "-" + (datefromperiod.getMonth() + 1) + "-" + datefromperiod.getDate();
    let datetoperiod = new Date(`${assessmentyear}-12-31`);
    let TPeriod = datetoperiod.getFullYear() + "-" + (datetoperiod.getMonth() + 1) + "-" + datetoperiod.getDate()
    var dirFees = document.getElementById('dirFees').value;
    var dirSalary = document.getElementById('dirSalary').value;
    var dirInterest = document.getElementById('dirInterest').value;
    var dirAllowances = document.getElementById('dirAllowances').value
    var netCompProfLossT = document.getElementById('netCompProfLossT').value;
    var totalForDirector = Number(commaRemover(dirFees)) + Number(commaRemover(dirSalary)) + Number(commaRemover(dirInterest)) + Number(commaRemover(dirAllowances));
    var totalFDirector = moneyInTxt(totalForDirector, 'en', 2);
    console.log('Total For Director : ' + totalFDirector)
    var netCompProfLossT = document.getElementById('netCompProfLossT').value

    let citAnnualReturnData = {
        "TokenType": TokenType,
        "TokenAccess": TokenAccess,
        "TaxpayerId": TaxpayerId,
        "AssessmentYear": assessmentyear,
        "FromPeriod": FrmPeriod + "T14:03:08.718Z",
        "ToPeriod": TPeriod + "T14:03:08.718Z",
        "Ctr1": [{
            "BalanceSheetDate": "2019-03-05T10:14:11.253Z",
            "CashAssestsReturnCurr": document.getElementById("cashAssetsA").value,
            "CashAssetsOtherCurr": document.getElementById("cashAssetsB").value,
            "Stocks": document.getElementById("stocksD").value,
            "AccountReceivables": document.getElementById("accReceivablesE").value,
            "NonCurrent": document.getElementById("fixedAssetsG").value,
            "OtherAssets": document.getElementById("otherAssetsH").value,
            "TradePayablesReturnCurr": document.getElementById("tradePayablesA").value,
            "TradePayablesOtherCurr": document.getElementById("tradePayablesB").value,
            "OtherPayablesReturnCurr": document.getElementById("otherPayablesD").value,
            "OtherPayablesOtherCurr": document.getElementById("otherPayablesE").value,
            "ShareholdersFund": document.getElementById("shareFundH").value,
        }],
        "Ctr2": [{
            "LocalIncome": document.getElementById('localIncomeA').value,
            "ExportIncome": document.getElementById('exportIncomeB').value,
            "InvestmentIncome": document.getElementById('investIncomeD').value,
            "OpExpenReturnCurr": document.getElementById('opExpensesG').value,
            "OpExpensesForeignCurr": document.getElementById('opExpensesH').value,
            "DirectorsRenum": document.getElementById('dirRemunerationJ').value,
            "LabourCosts": document.getElementById('staffCostsK').value,
            "InterestExpensesReturnCurr": document.getElementById('interestExpensesL').value,
            "InterestExpForeignCurr": document.getElementById('interestExpensesM').value,
            "Depreciation": document.getElementById('depreciationP').value,
            "ForeignExchangeLosses": document.getElementById('foreignExLossQ').value,
            "OtherGenAndAdminExpenses": document.getElementById('otherGenExpR').value,
            "NetCompanyProfitOrLoss": document.getElementById('netCompProfLossT').value
        }],
        "Ctr3": [{
            "NetCompanyProfitOrLoss": document.getElementById('netComProfLossA').value = netCompProfLossT,
            "NonallowableDeductions": document.getElementById('nonAllowDedB').value,
            "NonTaxableIncome": document.getElementById('nonTaxIncomeD').value,
            "AdjustedIncome": document.getElementById('adjIncomeE').value,
            "CapitalAllowance": document.getElementById('capAllowF').value,
            "CarryForwardLosses": document.getElementById('carryForwardG').value,
            "OtherAllowableDeduction": document.getElementById('otherAllowDedH').value,
            "ChargeableIncomeTaxDiffRate": document.getElementById('chargeIncomeDR').value,
            "ChargeableIncomeTaxNormalRate": document.getElementById('chargeIncomeNR').value,
            "TaxCodeId": document.getElementById('TC').value,
            "TaxRate": document.getElementById('TR').value,
            "TaxLiability": document.getElementById('totChargeIncome').value,
            "TaxRebate": document.getElementById('tRebate').value,
            "RateofTaxRebate": document.getElementById('rateOftRebate').value,
            "AmountTaxRebate": document.getElementById('amtOftRebate').value,
            "TaxPayable": document.getElementById('tPayable').value,
            "WithholdingTaxCredits": document.getElementById('withholdingTaxCredF').value,
            "TaxesPaidDirectly": document.getElementById('taxPaidDirG').value,
            "PriorPeriodCredits": document.getElementById('priorPeriodCredH').value,
            "IncomeTaxOutstandingOverpayment": document.getElementById('incomeTaxOutstandingJ').value,
            "StatutoryLevies": document.getElementById('statLevK').value
        }],
        "Ctr4": [{
            "DriectorName": document.getElementById('nameOfDirector').value,
            "ResStatusId": document.getElementById('tenancyId').value,
            "DirectorTin": "P000012690X",
            "Fees": document.getElementById('dirFees').value,
            "Salary": document.getElementById('dirSalary').value,
            "Interst": document.getElementById('dirInterest').value,
            "OtherAllowances": document.getElementById('dirAllowances').value,
            "Total": totalFDirector,
            "Loans": document.getElementById('dirLoans').value,
        }]
    }

    var postCITData = JSON.stringify(citAnnualReturnData);
    console.log("Post CIT Data");
    console.log(postCITData);

    PostCITReturns(postCITData);
})

//Post for CIT Annual Returns
function PostCITReturns(postCITData) {
    console.log("postData", postCITData);
    var postUrl = `${AppServerUrl}/api/CIT/PostCITAnnualReturns`;
    console.log(postUrl)
    $('body').showLoading()
    $.post(postUrl, postCITData, function(data, status) {
        $('body').hideLoading()
        console.log('Response Data: ', data);
        if (data.status == "Failure") {
            toastr.warning("Error submitting your data. " + data.caption);
        }
        if (data.status == "Successful") {
            toastr.success("Your record has been submitted successfully.");
        } else {
            console.log("An Error Occured " + data.caption);
        }
    }).fail(function(response) {
        console.log('Response Error: ' + response.responseText);
    });
}

GetTaxRateCode();

function GetTaxRateCode() {
    const url = `${ServiceURL}api/WithholdingTax/GetAllTaxRatesAsync`;
    $.get(url, function(data, status) {
        console.log("GetTaxRateCode: ", data)
        var options = "<option value='0' selected disabled>Select Tax Rate</option>";
        var taxValue;
        $(data).each(function(i, val) {
            options += "<option value='" + val.id + "'>" + val.description + "</option>";
            // var TaxRate = $('#TC').val();
            // switch (TaxRate) {
            //     case id1:
            //         taxValue = "Inactive"
            //         break;
            //     case id2:
            //         taxValue = "Active"
            //         break;
            //     default:
            //         tenaName = "Owned"
            //         break;
            // }
            // document.getElementById('TR').innerHTML = taxValue;
        });
        $('#TC').html(options);
    }).fail(function(response) {
        console.log('Response Error: ' + response.responseText);
    });
}

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
    { Id: 1, TabId: "AddressSheet-tab", ContentId: "addressSheet", BackO: false, Back: true, Next: true, NextO: false },
    { Id: 2, TabId: "sectionC-tab", ContentId: "sectionC", BackO: false, Back: true, Next: true, NextO: false },
    { Id: 3, TabId: "balanceSheet-tab", ContentId: "balanceSheet", BackO: false, Back: true, Next: true, NextO: false },
    { Id: 4, TabId: "taxCalculation-tab", ContentId: "taxCalculation", BackO: false, Back: true, Next: true, NextO: false },
    { Id: 5, TabId: "sectionF-tab", ContentId: "sectionF", BackO: true, Back: false, Next: false, NextO: false },
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
    $(`#${ActiveTab.TabId}`).addClass("active").removeClass("disabled");
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