var activeTaxOffice = "";
var activeYear = "";

$("#listOfTaxOffices").on('change', function () {
    var elem = document.getElementById("listOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
});

$("#assessmentYear").on('change', function () {
    var elem = document.getElementById("assessmentYear");
    activeYear = elem.options[elem.selectedIndex].value;
});

var validateSearchEntry = function () {
    let searchItem = $("#searchItem").val().trim();
    if (!searchItem.match(/\S/) || activeTaxOffice === "")
        return false;
    else
        return true;
};

var searchPIT = function () {
    objToSend.assessmentYear = activeYear === "" ? new Date().getFullYear() : activeYear;
    objToSend.taxOfficeId = activeTaxOffice;

    objToSend.tin = $("#tinHolder").val();
    objToSend.startDate = $("#startDate").val();
    objToSend.endDate = $("#endDate").val();

    let url = `${searchPITByTaxOffice}`;

    $("#Grid").data("kendoGrid").dataSource.data([]);
    apiCaller(url, "POST", objToSend, initializeKendoGrid);
};

$("#btnSearch").click(function () {
    searchPIT();
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {

    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    prepareDetailsView(item.id);
});

var prepareDetailsView = function (trId) {

    hideAndShowThings();
    if (objToSend.transactionType === "Estimate")
        loadDetailsViewEstimates(trId);
    else if (objToSend.transactionType === "Return")
        loadDetailsViewReturns(trId);
};

var hideAndShowThings = function () {
    if (objToSend.transactionType === "Estimate") {
        $("#gridView").hide();
        $("#estimatesDetailsView").show();
        $("#returnsDetailsView").hide();
    } else if (objToSend.transactionType === "Return") {
        $("#gridView").hide();
        $("#estimatesDetailsView").hide();
        $("#returnsDetailsView").show();
    }
};

$("#backToGrid").click(function () {
    $("#gridView").show();
    $("#estimatesDetailsView").hide();
    $("#returnsDetailsView").hide();
});

$("#backToGrid2").click(function () {
    $("#gridView").show();
    $("#estimatesDetailsView").hide();
    $("#returnsDetailsView").hide();
});

$("#moreDetails").click(function () {
    $("#estimateDetailsGrid1").hide();
    $("#estimateDetailsGrid2").hide();
    $("#estimateDetailsGrid3").show();
    $("#estimateDetailsGrid4").show();
    $("#estimateDetailsGrid5").show();

    $("#moreDetailsPrev").show();
    $("#moreDetails").hide();
});

$("#moreDetailsPrev").click(function () {
    $("#estimateDetailsGrid1").show();
    $("#estimateDetailsGrid2").show();
    $("#estimateDetailsGrid3").hide();
    $("#estimateDetailsGrid4").hide();
    $("#estimateDetailsGrid5").hide();

    $("#moreDetailsPrev").hide();
    $("#moreDetails").show();
});

var loadDetailsViewEstimates = function (trId) {
    let url = `${pitDetailsUrl}`;

    let objSend = {
        "transactionId": trId,
        "taxType": "PIT",
        "transactionType": objToSend.transactionType
    };

    apiCaller(url, "POST", objSend, loadDetailsEstimates)
};

var loadDetailsViewReturns = function (trId) {
    let url = `${pitDetailsUrl}`;

    let objSend = {
        "transactionId": trId,
        "taxType": "PIT",
        "transactionType": objToSend.transactionType
    };

    apiCaller(url, "POST", objSend, loadDetailsReturns)
};

var loadDetailsEstimates = function (response) {
    let resp = response[0];

    $("#assessmentYearView").text(resp.assessmentYear);
    $("#startDateView").text(resp.startDate);
    $("#endDateView").text(resp.endDate);
    $("#nationality").text(resp.nationality);
    $("#businessIncome").text(parseFloat(resp.businessIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#employmentIncome").text(parseFloat(resp.employmentIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#investmentOtherIncome").text(parseFloat(resp.investmentOtherIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalIncome").text(parseFloat(resp.totalIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#annualChargeableIncome").text(parseFloat(resp.annualChargeableIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#annualTotalIncomeTaxPayable").text(parseFloat(resp.annualTotalIncomeTaxPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#quarterlyIncomeTaxPayable").text(parseFloat(resp.quarterlyIncomeTaxPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
};

var loadDetailsReturns = function (response) {
    let resp = response[0];

    $("#assessmentYearViewReturn").text(resp.assessmentYear);
    $("#startDateViewReturn").text(resp.startDate);
    $("#endDateViewReturn").text(resp.endDate);
    $("#nationalityReturn").text(resp.nationality);
    $("#accMethodReturn").text(resp.accountingMethod);

    loadBs(resp);
    loadIn(resp);
    loadTc(resp);
    LoadTr(resp);
};

var loadBs = function (resp) {
    $("#bsBalanceSheetDate").text(resp.bsBalanceSheetDate);
    $("#bsStocks").text(parseFloat(resp.bsStocks).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsReceivables").text(parseFloat(resp.receivables).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsCashBalance").text(parseFloat(resp.bsCashBalance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsPrepayment").text(parseFloat(resp.bsPrepayment).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsOtherCurrentAssets").text(parseFloat(resp.bsOtherCurrentAssets).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsLand").text(parseFloat(resp.bsLand).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsBuilding").text(parseFloat(resp.bsBuilding).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsEquipment").text(parseFloat(resp.bsEquipment).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsMotorVehicle").text(parseFloat(resp.bsMotorVehicle).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsOtherAssets").text(parseFloat(resp.bsOtherAssets).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsBillsPayable").text(parseFloat(resp.bsBillsPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsLoans").text(parseFloat(resp.bsLoans).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsAccruals").text(parseFloat(resp.bsAccruals).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsOtherPayables").text(parseFloat(resp.bsOtherPayables).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsCapitalBF").text(parseFloat(resp.bsCapitalBF).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsNetProfit").text(parseFloat(resp.bsNetProfit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsDrawings").text(parseFloat(resp.bsDrawings).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
};

var loadIn = function (resp) {
    $("#insOperatingCost").text(parseFloat(resp.insOperatingCost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insGeneralAndAdminExpense").text(parseFloat(resp.insGeneralAndAdminExpense).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insLabourCost").text(parseFloat(resp.insLabourCost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insInterestExpenses").text(parseFloat(resp.insInterestExpenses).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insDepreciation").text(parseFloat(resp.insDepreciation).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insOtherPayables").text(parseFloat(resp.insOtherPayables).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#insBasicSalary").text(parseFloat(resp.insBasicSalary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insCashAllowance").text(parseFloat(resp.insCashAllowance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insExcessBonus").text(parseFloat(resp.insExcessBonus).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insOtherCashBenefit").text(parseFloat(resp.insOtherCashBenefit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#insRentElement").text(parseFloat(resp.insRentElement).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insCarElement").text(parseFloat(resp.insCarElement).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insOtherElements").text(parseFloat(resp.insOtherElements).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#insDirectorsFee").text(parseFloat(resp.insDirectorsFee).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insCommission").text(parseFloat(resp.insCommission).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insRoyalty").text(parseFloat(resp.insRoyalty).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insCharges").text(parseFloat(resp.insCharges).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insAnnuity").text(parseFloat(resp.insAnnuity).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#insTaxableRentIncome").text(parseFloat(resp.insTaxableRentIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insDiscounts").text(parseFloat(resp.insDiscounts).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#insPremium").text(parseFloat(resp.insPremium).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insInterest").text(parseFloat(resp.insInterest).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#insOthers").text(parseFloat(resp.insOthers).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
};

var loadTc = function (resp) {
    $("#tcDepreciation1").text(parseFloat(resp.tcDepreciation1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcNonAllowableDeductions").text(parseFloat(resp.tcNonAllowableDeductions).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcNonTaxableincome").text(parseFloat(resp.tcNonTaxableincome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcCapitalAllowance1").text(parseFloat(resp.tcCapitalAllowance1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcTotalDeductions").text(parseFloat(resp.tcTotalDeductions).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcNetAdjustedBusinessProfit").text(parseFloat(resp.tcNetAdjustedBusinessProfit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcNetBusinessProfit").text(parseFloat(resp.tcNetBusinessProfit).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#tcNetEmploymentIncome").text(parseFloat(resp.tcNetEmploymentIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcNetInvestmentIncome").text(parseFloat(resp.tcNetInvestmentIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcIncomeTaxDiffRates").text(parseFloat(resp.tcIncomeTaxDiffRates).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcTaxPayable").text(parseFloat(resp.tcTaxPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcTaxCharged").text(parseFloat(resp.tcTaxCharged).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcChargeableIncome").text(parseFloat(resp.tcChargeableIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcCapitalAllowance").text(parseFloat(resp.tcCapitalAllowance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#tcTaxCredits").text(parseFloat(resp.tcTaxCredits).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcPaymentOnAccount").text(parseFloat(resp.tcPaymentOnAccount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcPriorPeriodCredits").text(parseFloat(resp.tcPriorPeriodCredits).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcTotalPayment").text(parseFloat(resp.tcTotalPayment).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
};

var LoadTr = function (resp) {
    $("#tcRelLifeAssurance").text(parseFloat(resp.tcRelLifeAssurance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcRelSocialSecurity").text(parseFloat(resp.tcRelSocialSecurity).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcRelMarriageResponsibility").text(parseFloat(resp.tcRelMarriageResponsibility).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#relChildrenEduc").text(parseFloat(resp.relChildrenEduc).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcRelOldAgeEmployees").text(parseFloat(resp.tcRelOldAgeEmployees).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcRelAgedDependants").text(parseFloat(resp.tcRelAgedDependants).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcRelDisability").text(parseFloat(resp.tcRelDisability).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcRelCostOfTraining").text(parseFloat(resp.tcRelCostOfTraining).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcRelVolPensionContribution").text(parseFloat(resp.tcRelVolPensionContribution).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tcRelOtherAllowableDeductions").text(parseFloat(resp.tcRelOtherAllowableDeductions).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
};