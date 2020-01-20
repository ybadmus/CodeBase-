var id1 = "147a8a24-ae0b-43d4-9e00-34379625426f";
var id2 = "abd04939-6488-437e-9e07-bc785ab4e4ea";
var ServiceURL = 'http://psl-app-vm3/TaxPayerMonoAPI/';
var pARget = "api/PartnershipReturn/GetAllGPARAsync";
var pARgetById = "api/PartnershipReturn/GetGPARByIdAsync/51ADF289-9003-4FB4-823D-9F38B6D7D63E";
var remittanceData = [];
var partnerData = [];
var incomeSourceData = [];
var taxHolidayData = [];
var amountRem = [];
var dataItem;
var amountRemittanceArray = [];
var data;
var Currentdate = new Date().toLocaleDateString();

// http://psl-app-vm3/TaxPayerMonoAPI/api/TaxPayerTaxHoliday/GetGTAHAllAsync




$('#PartnershipSheet-tab, #BusinessInfoSheet-tab, #incomeStatement-tab, #partnershipAdjustment-tab, #generalInfo-tab, #balanceSheet-tab, #btnBack, #btnNext, #prev1, #prev2, #nxt1, #nxt2').on('click', function() {
    if (IsPeriodOK()) {
        $(".validate-value").prop('disabled', false);
    } else {
        $(".validate-value").prop('disabled', true);
        toastr.warning('Select A Vaild Year!');
    }
});


var getCurrentAssets = function() {
    // Current Assets
    var stockInventories = document.getElementById('stockInventories').value;
    var receivables = document.getElementById('receivables').value;
    var cashBankBalance = document.getElementById('cashBankBalance').value;
    var prePayment = document.getElementById('prePayment').value;
    var otherCurrentAssets = document.getElementById('otherCurrentAssets').value;
    var totalCurrentAssetsA = Number(commaRemover(stockInventories)) + Number(commaRemover(receivables)) + Number(commaRemover(cashBankBalance)) + Number(commaRemover(prePayment)) + Number(commaRemover(otherCurrentAssets));
    document.getElementById('totalCurrentAssets').value = moneyInTxt(totalCurrentAssetsA, 'en', 2);

    // Non-Current Assets
    var land = document.getElementById('land').value;
    var building = document.getElementById('building').value;
    var furnitureEquipments = document.getElementById('furnitureEquipments').value;
    var motorVehicles = document.getElementById('motorVehicles').value;
    var otherAssets = document.getElementById('otherAssets').value;
    var totalNonCurrentAssetsA = Number(commaRemover(land)) + Number(commaRemover(building)) + Number(commaRemover(furnitureEquipments)) + Number(commaRemover(motorVehicles)) + Number(commaRemover(otherAssets));
    document.getElementById('totalNonCurrentAssets').value = moneyInTxt(totalNonCurrentAssetsA, 'en', 2);
    var totalAssetsAB = totalNonCurrentAssetsA + totalCurrentAssetsA;
    document.getElementById('totalAssets').value = moneyInTxt(totalAssetsAB, 'en', 2);

    // Current Payable Assets
    var billPayable = document.getElementById('billPayable').value;
    var loansOverdraft = document.getElementById('loansOverdraft').value;
    var accurals = document.getElementById('accurals').value;
    var otherPayables = document.getElementById('otherPayables').value;
    var totalCurrentPayablesC = Number(commaRemover(billPayable)) + Number(commaRemover(loansOverdraft)) + Number(commaRemover(accurals)) + Number(commaRemover(otherPayables));
    document.getElementById('totalCurrentPayables').value = moneyInTxt(totalCurrentPayablesC, 'en', 2);

    // Capital
    var capitalBF = document.getElementById('capitalBF').value;
    var netProfit = document.getElementById('netProfit').value;
    var drawings = document.getElementById('drawings').value;
    var totalCapitalMinus = Number(commaRemover(netProfit)) - Number(commaRemover(drawings));
    document.getElementById('capitalAddition').value = moneyInTxt(totalCapitalMinus, 'en', 2);
    var totalcapitalEH = Number(commaRemover(capitalBF)) + Number(totalCapitalMinus);
    document.getElementById('netCapitalCF').value = moneyInTxt(totalcapitalEH, 'en', 2);
    var totalCapital = totalCurrentPayablesC + totalcapitalEH;
    document.getElementById('totalCapital').value = moneyInTxt(totalCapital, 'en', 2);

    //Income Statement
    var businessIncomeLocal = document.getElementById('businessIncomeLocal').value;
    var businessIncomeExport = document.getElementById('businessIncomeExport').value;
    var totalBusIncome = Number(commaRemover(businessIncomeLocal)) + Number(commaRemover(businessIncomeExport));
    document.getElementById('totalBusinessIncome').value = moneyInTxt(totalBusIncome, 'en', 2);
    var investmentIncome = document.getElementById('investmentIncome').value;
    var otherIncome = document.getElementById('otherIncome').value;
    var totalPartIncome = Number(commaRemover(investmentIncome)) + Number(commaRemover(otherIncome));
    var totalBoth = totalBusIncome + totalPartIncome;
    document.getElementById('totalPartnershipIncome').value = moneyInTxt(totalBoth, 'en', 2);

    var localCurrencies = document.getElementById('localCurrencies').value;
    var cedisEquivalentOfForex = document.getElementById('cedisEquivalentOfForex').value;
    var totalOperatingExpenses = Number(commaRemover(localCurrencies)) + Number(commaRemover(cedisEquivalentOfForex));
    document.getElementById('totalOperatingExpenses').value = moneyInTxt(totalOperatingExpenses, 'en', 2);


    var staffLabourCosts = document.getElementById('staffLabourCosts').value;
    var localCurrenciesI = document.getElementById('localCurrenciesI').value;
    var cedisEquivalentOfForexI = document.getElementById('cedisEquivalentOfForexI').value;
    var totalInterestExpenses = document.getElementById('totalInterestExpenses').value;
    var totalInterestExpenses = Number(commaRemover(staffLabourCosts)) + Number(commaRemover(localCurrenciesI)) + Number(commaRemover(cedisEquivalentOfForexI));
    document.getElementById('totalInterestExpenses').value = moneyInTxt(totalInterestExpenses, 'en', 2);

    var depreciation = document.getElementById('depreciation').value;
    var foreignExchangeLosses = document.getElementById('foreignExchangeLosses').value;
    var otherCostsNExpenses = document.getElementById('otherCostsNExpenses').value;
    var totalDFO = Number(commaRemover(depreciation)) + Number(commaRemover(foreignExchangeLosses)) + Number(commaRemover(otherCostsNExpenses));
    var totalGenAdminExpenses = totalInterestExpenses + totalDFO;
    document.getElementById('totalGenAdminExpenses').value = moneyInTxt(totalGenAdminExpenses, 'en', 2);
    var totalExpensesI = totalOperatingExpenses + totalGenAdminExpenses;
    document.getElementById('totalExpensesI').value = moneyInTxt(totalExpensesI, 'en', 2);

    var netPartnershipProfitLoss = totalPartIncome - totalExpensesI;
    document.getElementById('netPartnershipProfitLoss').value = moneyInTxt(netPartnershipProfitLoss, 'en', 2);


    // Partnership Income Adjustment\
    var netPartnershipIncome = document.getElementById('netPartnershipIncome').value = moneyInTxt(netPartnershipProfitLoss, 'en', 2);
    var otherIncomeII = document.getElementById('otherIncomeII').value;
    var rent = document.getElementById('rent').value;
    var interestIII = document.getElementById('interestIII').value;
    var totalRemittances = document.getElementById('totalRemittances').value;
    var totalIncomeRecieved = document.getElementById('totalIncomeRecieved').value
    var totalIncomeRecievedII = Number(commaRemover(netPartnershipIncome)) + Number(commaRemover(interestIII)) + Number(commaRemover(otherIncomeII)) + Number(commaRemover(rent)) + Number(commaRemover(totalRemittances)) + Number(commaRemover(totalIncomeRecieved));

    document.getElementById('totalPartnershipIncomeII').value = moneyInTxt(totalIncomeRecievedII, 'en', 2);

    var totalPartnershipBusinessProfit = document.getElementById('totalPartnershipBusinessProfit').value = moneyInTxt(totalIncomeRecievedII, 'en', 2);
    var depreciationII = document.getElementById('depreciationII').value;
    var nonAllowanceDeduction = document.getElementById('nonAllowanceDeduction').value;
    var totalDepreciateNonAllowanceDeduct = Number(commaRemover(depreciationII)) + Number(commaRemover(nonAllowanceDeduction));
    var totalAddBacks = document.getElementById('totalAddBacks').value = moneyInTxt(totalDepreciateNonAllowanceDeduct, 'en', 2);

    var totalPartnershipIncomeU = Number(commaRemover(totalPartnershipBusinessProfit)) + Number(commaRemover(totalAddBacks));
    document.getElementById('totalPartnershipIncomeIII').value = moneyInTxt(totalPartnershipIncomeU, 'en', 2);

    var capitalAllowanceI = document.getElementById('capitalAllowanceI').value;

    var adjustedPartnershipIncome = totalPartnershipIncomeU - Number(commaRemover(capitalAllowanceI));
    document.getElementById('adjustedPartnershipIncome').value = moneyInTxt(adjustedPartnershipIncome, 'en', 2);


    var salaryDrawings = $('#salaryDrawings').val();
    var interestOnCapital = $('#interestOnCapital').val();
    var partnerCommission = $('#partnerCommission').val();
    var partnerShareOfProfit = $('#partnerShareOfProfit').val();
    var totalNonCurrentAssetsA = Number(commaRemover(salaryDrawings)) + Number(commaRemover(interestOnCapital)) + Number(commaRemover(partnerCommission)) + Number(commaRemover(partnerShareOfProfit));
    $('#partnerTotalIncome').value = moneyInTxt(totalNonCurrentAssetsA, 'en', 2);
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
    var isValid = true;
    $('.validate-value').each(function() {
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

$('#DeclarationSubmit').on('click', function() {
    let assessmentyear = $("#yearOfAssessment").val();
    let datefromperiod = new Date(`${assessmentyear}-01-01`);
    let FrmPeriod = datefromperiod.getFullYear() + "-" + (datefromperiod.getMonth() + 1) + "-" + datefromperiod.getDate();
    let datetoperiod = new Date(`${assessmentyear}-12-31`);
    let TPeriod = datetoperiod.getFullYear() + "-" + (datetoperiod.getMonth() + 1) + "-" + datetoperiod.getDate()
    var capitalBFPost = document.getElementById('capitalBF').value;
    var capitalAdditionPost = document.getElementById('capitalAddition').value
    var capBFnCapAdd = Number(commaRemover(capitalBFPost)) + Number(commaRemover(capitalAdditionPost));
    var partnershipData = {
        "TokenType": TokenType,
        "TokenAccess": TokenAccess,
        "TaxpayerId": TaxpayerId,
        "AssessmentYear": assessmentyear,
        "FromPeriod": FrmPeriod + "T14:03:08.718Z",
        "ToPeriod": TPeriod + "T14:03:08.718Z",
        "Par1": [{
            "BalanceSheetDate": "2019-03-01T10:42:35.332Z", //document.getElementById('balanceSheetDate').value,
            "Stocks": document.getElementById('stockInventories').value,
            "Receivables": document.getElementById('receivables').value,
            "BankBalance": document.getElementById('cashBankBalance').value,
            "Prepayment": document.getElementById('prePayment').value,
            "OtherCurrentAssets": document.getElementById('otherCurrentAssets').value,
            "Land": document.getElementById('land').value,
            "Building": document.getElementById('building').value,
            "FurnitureAndEquipments": document.getElementById('furnitureEquipments').value,
            "MotorVehicles": document.getElementById('motorVehicles').value,
            "OtherAssets": document.getElementById('otherAssets').value,
            "BillsPayable": document.getElementById('billPayable').value,
            "LoansOrOverdraft": document.getElementById('loansOverdraft').value,
            "Accruals": document.getElementById('accurals').value,
            "OtherPayables": document.getElementById('otherPayables').value,
            "CapitalBf": document.getElementById('capitalBF').value,
            "AddNetProfit": document.getElementById('netProfit').value,
            "LessDrawings": document.getElementById('drawings').value,
            "CapitalAddition": document.getElementById('capitalAddition').value,
            "NetCapitalCf": document.getElementById('netCapitalCF').value = moneyInTxt(capBFnCapAdd, 'en', 2),
        }],
        "Par2": [{
            "BusinessIncomeLocal": document.getElementById('businessIncomeLocal').value,
            "BusinessIncomeExport": document.getElementById('businessIncomeExport').value,
            "InvestmentIncome": document.getElementById('investmentIncome').value,
            "OtherIncome": document.getElementById('otherIncome').value,
            "LocalCurrencies": document.getElementById('localCurrencies').value,
            "CedisEquivalentOfForex": document.getElementById('cedisEquivalentOfForex').value,
            "LabourCosts": document.getElementById('staffLabourCosts').value,
            "IntExpensesLocalCurrencies": document.getElementById('localCurrenciesI').value,
            "IntExpensesCedisEquivOfForex": document.getElementById('cedisEquivalentOfForexI').value,
            "Depreciation": document.getElementById('depreciation').value,
            "ForeignExchangeLosses": document.getElementById('foreignExchangeLosses').value,
            "OtherCostsAndExpenses": document.getElementById('otherCostsNExpenses').value,
            "NetPartnershipIncome": document.getElementById('netPartnershipProfitLoss').value,
            "PartnershipOtherIncome": document.getElementById('otherIncomeII').value,
            "RentValue": document.getElementById('rent').value,
            "Interest": document.getElementById('interestIII').value,
            "RemitOutsideGhana": document.getElementById('totalRemittances').value,
            "CommissionsReceived": document.getElementById('totalIncomeRecieved').value,
            "IncomeReceivedexcludedSources": document.getElementById('totalIncomeRecieved').value,
            "AddBacksDepreciation": document.getElementById('depreciationII').value,
            "NonAllowableDeduction": document.getElementById('nonAllowanceDeduction').value,
            "CapitalAllowance": document.getElementById('capitalAllowanceI').value,
            "AdjustedPartnershipIncome": document.getElementById('adjustedPartnershipIncome').value,
        }],
        "Par3": [{
            "DormantId": document.getElementById('dormancyID').value,
            "Tin": "P0000013102",
            "Name": document.getElementById('nameOfPartner').value,
            "Address": document.getElementById('addressOfPartner').value,
            "Salary": document.getElementById('salaryDrawings').value,
            "InterestOnCapital": document.getElementById('interestOnCapital').value,
            "Commission": document.getElementById('partnerCommission').value,
            "ProfitSharingRatio": document.getElementById('profitSharingRatio').value,
            "ShareOfProfit": document.getElementById('partnerShareOfProfit').value,
        }]
    };

    var postPartnershipData = JSON.stringify(partnershipData);

    PostPartnershipReturns(postPartnershipData);

});
/* Everything Network Related */



// Post
function PostPartnershipReturns(postPartnershipData) {
    var postUrl = `${AppServerUrl}/api/partnership/PostPartnershipReturns`;
    $('body').showLoading()
    $.post(postUrl, postPartnershipData, function(data, status) {
        console.log('Response Data: ', data);
        $('body').hideLoading()
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

// Get
function GetPartnershipReturnsId() {
    var url = `${ServiceURL}${pARgetById}`;
    jQuery.ajax({
        url: url,
        type: 'GET',
        headers: {
            'Authorization': `Bearer ${TokenAccess}`,
        },
        success: function(response) {
            //console.log(response)
            var data = JSON.stringify(response)
        }
    });
}


// Active Or Inactive.
function populateDormancy() {
    var variable = 'PDS';
    const url = `${ServiceURL}api/GenericCodes/GetGCOTByTypeAsync/${variable}`;
    $.get(url, function(data, status) {
        var options = "<option value='0' selected disabled>Select Dormancy</option>";
        $(data).each(function(i, val) {
            options += "<option value='" + val.id + "'>" + val.description + "</option>";
        });
        $('#dormancyID').html(options);
    }).fail(function(response) {
        console.log('Response Error: ' + response.responseText);
    });
}

$(document).ready(function() {
    populateDormancy();
    //GetPartnershipReturns();
    GetPartnershipReturnsId();
});


function commaRemover(someValue) {
    var new_string = someValue.replace(/,/g, "");
    return new_string;
}

$("#remitanceAdd").click(function() {
    //Reset Fields
    $("#nameRemittances").val("");
    $("#amountRemittances").val("");
});

/* Kendo Grid Related */
var KendoRemittances = function() {
    var nameRemittances = $('#nameRemittances').val();
    var amountRemittances = $('#amountRemittances').val();
    var total = 0;

    remittanceData.push({ nameRemittances: nameRemittances, amountRemittances: amountRemittances })
    grid = $("#grid").kendoGrid({
        dataSource: { data: remittanceData, pageSize: 10 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: false, buttonCount: 5 },
        columns: [
            { field: "nameRemittances", title: "Name Of Remittances", width: '35%' },
            { field: "amountRemittances", title: "Amount", width: '35%', attributes: { style: "text-align:right;" } },
            {
                command: [{
                        name: "edit",
                        template: "<button title='Edit item' class='editRemi btn btn-success btn-sm mr-1'><i class='fa fa-edit'></i></button>"
                    },
                    {
                        name: "delete",
                        template: "<button title='Delete item' class='btn btn-danger btn-sm deleteRemi'><i class='fa fa-trash'></i></button>"
                    }
                ],
                title: "Action",
                width: "30%"
            }
        ]
    });
    remittanceData.forEach(item => {
        var remitancesValue = item.amountRemittances;
        var remittanceTotal = Number(commaRemover(remitancesValue));
        total += remittanceTotal
        document.getElementById('totalRemittances').value = moneyInTxt(total, 'en', 2);
    });
}

$('#saveRemittance').on('click', function() {
    KendoRemittances([]);
    getCurrentAssets();
});

$(document).on("click", ".deleteRemi", function(e) {
    var grid = $("#grid").data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    var removeRemi = grid.dataSource;
    var index = removeRemi.indexOf(dataItem);

    if (index > -1) {
        removeRemi.remove(dataItem);
        //removeRemi = removeRemi.filter(item => item !== index)

    }

});

//EDIT ACTION ON GRID
$(document).on("click", ".editRemi", function(e) {
    $('#modal-remi').modal('show');
    var grid = $("#grid").data("kendoGrid");
    var row = grid.select();
    var data = grid.dataItem(row);
});


$("#partnerInfo").click(function() {
    //Reset Fields
    $("#nameOfPartner").val("");
    $("#addressOfPartner").val("");
    $("#dateOfFirstProduction").val("");
    $("salaryDrawings").val("");
    $("dormancyID").val("");
});

var KendoPartnerInfo = function() {
    var valueDormancy;
    var nameOfPartner = $('#nameOfPartner').val();
    var addressOfPartner = $('#addressOfPartner').val();
    var salaryDrawings = $('#salaryDrawings').val();
    var dormancyID = $('#dormancyID').val();

    switch (dormancyID) {
        case id1:
            valueDormancy = "Inactive"
            break;
        case id2:
            valueDormancy = "Active"
            break;
        default:
            tenaName = "Owned"
            break;
    }
    var interestOnCapital = $('#interestOnCapital').val();
    var partnerCommission = $('#partnerCommission').val();
    var profitSharingRatio = $('#profitSharingRatio').val();
    var partnerShareOfProfit = $('#partnerShareOfProfit').val();
    var totalNonCurrentAssetsA = Number(commaRemover(salaryDrawings)) + Number(commaRemover(interestOnCapital)) + Number(commaRemover(partnerCommission)) + Number(commaRemover(partnerShareOfProfit));
    var partnerTotalIncome = $('#partnerTotalIncome').value = moneyInTxt(totalNonCurrentAssetsA, 'en', 2);;

    partnerData.push({ nameOfPartner: nameOfPartner, addressOfPartner: addressOfPartner, dormancyID: valueDormancy, salaryDrawings: salaryDrawings, interestOnCapital: interestOnCapital, partnerCommission: partnerCommission, profitSharingRatio: profitSharingRatio, partnerShareOfProfit: partnerShareOfProfit, partnerTotalIncome: partnerTotalIncome })
    grid = $("#incomeStatTable").kendoGrid({
        dataSource: { data: partnerData, pageSize: 10 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "nameOfPartner", title: "Name Of Partner", width: '10%' },
            // { field: "addressOfPartner", title: "Address Of Partner", width: '10%' },
            { field: "salaryDrawings", title: "salary Drawings", width: '8%', attributes: { style: "text-align:right;" } },
            { field: "interestOnCapital", title: "Interest On Capital", width: '10%', attributes: { style: "text-align:right;" } },
            { field: "partnerCommission", title: "Commission", width: '7%', attributes: { style: "text-align:right;" } },
            { field: "profitSharingRatio", title: "Profit Sharing Ratio", width: '10%' },
            { field: "partnerShareOfProfit", title: "Partner Share Of Profit", width: '12%' },
            { field: "dormancyID", title: "Dormancy", width: '8%' },
            { field: "partnerTotalIncome", title: "Partner Total Income", width: '10%', attributes: { style: "text-align:right; color: blue;" } },
            {
                command: [{
                        name: "edit",
                        template: "<button title='Edit item' class='editPartner btn btn-success btn-sm mr-1'><i class='fa fa-edit'></i></button>"
                    },
                    {
                        name: "delete",
                        template: "<button title='Delete item' class='btn btn-danger btn-sm deletePartner'><i class='fa fa-trash'></i></button>"
                    }
                ],
                title: "Action",
                width: "7%"
            }
        ]
    });
}

$('#savePartnerData').on('click', function() {
    KendoPartnerInfo([]);
});

//DELETE ACTION ON GRID
$(document).on("click", ".deletePartner", function(e) {
    var grid = $("#incomeStatTable").data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    grid.dataSource.remove(dataItem);

});

//EDIT ACTION ON GRID
$(document).on("click", ".editPartner", function(e) {
    $('#modal-partner').modal('show');
    var grid = $("#incomeStatTable").data("kendoGrid");
    var row = grid.select();
    var data = grid.dataItem(row);
});


// Income Sources Grid
$("#otherSource").click(function() {
    //Reset Fields
    $("#incomeSourceName").val("");
    $("#incomeSourceAmount").val("");
});


var KendoIncomeSource = function() {
    var incomeSourceName = $('#incomeSourceName').val();
    var incomeSourceAmount = $('#incomeSourceAmount').val();
    var totalI = 0;

    incomeSourceData.push({ incomeSourceName: incomeSourceName, incomeSourceAmount: incomeSourceAmount })
    grid = $("#otherSources").kendoGrid({
        dataSource: { data: incomeSourceData, pageSize: 10 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "incomeSourceName", title: "Name Of Source", width: '40%' },
            { field: "incomeSourceAmount", title: "Amount", width: '40%', attributes: { style: "text-align:right;" } },
            {
                command: [{
                        name: "edit",
                        template: "<button title='Edit item' class='editIncomeSource btn btn-success btn-sm mr-1'><i class='fa fa-edit'></i></button>"
                    },
                    {
                        name: "delete",
                        template: "<button title='Delete item' class='btn btn-danger btn-sm deleteIncomeSource'><i class='fa fa-trash' onclick='removeItemWithId()'></i></button>"
                    }
                ],
                title: "Action",
                width: "20%"
            }
        ]
    });

    incomeSourceData.forEach(item => {
        var incomeSources = item.incomeSourceAmount;
        var incomeSourcesTotal = Number(commaRemover(incomeSources));
        totalI += incomeSourcesTotal
        document.getElementById('totalIncomeRecieved').value = moneyInTxt(totalI, 'en', 2);

    });
}

$('#saveIncomeReceived').on('click', function() {
    KendoIncomeSource([]);
    getCurrentAssets();
});

$(document).on("click", ".deleteIncomeSource", function(e) {
    var grid = $("#otherSources").data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    grid.dataSource.remove(dataItem);

});

//EDIT ACTION ON GRID
$(document).on("click", ".editIncomeSource", function(e) {
    $('#modal-otherSources').modal('show');
    var grid = $("#otherSources").data("kendoGrid");
    var row = grid.select();
    var data = grid.dataItem(row);
});


$("#addHoliday").click(function() {
    //Reset Fields
    $("#typeOfHoliday").val("");
    $("#effectiveDate").val("");
    $("#dateOfFirstProduction").val("");
    $(".flatpickr-input").val("");
});
// Tax Holiday Grid
var KendoTaxHoliday = function() {
    var typeOfHoliday = $('#typeOfHoliday').val();
    var effectiveDate = $('#effectiveDate').val();
    var dateOfFirstProduction = $('#dateOfFirstProduction').val();

    taxHolidayData.push({ typeOfHoliday: typeOfHoliday, effectiveDate: effectiveDate, dateOfFirstProduction: dateOfFirstProduction });
    grid = $("#taxHoliday").kendoGrid({
        dataSource: { data: taxHolidayData, pageSize: 10 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "typeOfHoliday", title: "Type Of Holiday", width: '40%' },
            { field: "effectiveDate", title: "Effective Date", width: '25%' },
            { field: "dateOfFirstProduction", title: "Date Of First Production", width: '25%' },
            {
                command: [{
                        name: "edit",
                        template: "<button title='Edit item' class='editTaxHoliday btn btn-success btn-sm mr-1'><i class='fa fa-edit'></i></button>"
                    },
                    {
                        name: "delete",
                        template: "<button title='Delete item' class='btn btn-danger btn-sm deleteTaxHoliday'><i class='fa fa-trash'></i></button>"
                    }
                ],
                title: "Action",
                width: "10%"
            }
        ]
    });
}

$('#saveTaxHoliday').on('click', function() {
    KendoTaxHoliday([]);
});

$(document).on("click", ".deleteTaxHoliday", function(e) {
    var grid = $("#taxHoliday").data("kendoGrid");
    var dataItem = grid.dataItem($(this).closest("tr"));
    grid.dataSource.remove(dataItem);

});

//EDIT ACTION ON GRID
$(document).on("click", ".editTaxHoliday", function(e) {
    $('#modal-taxholiday').modal('show');
    var grid = $("#taxHoliday").data("kendoGrid");
    var row = grid.select();
    var data = grid.dataItem(row);
});