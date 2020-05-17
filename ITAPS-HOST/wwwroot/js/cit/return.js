var HeaderName = "CIT Returns";

var hideAndShowThings = function () {
    $("#gridView").hide();
    $("#returnDetail").show();

    $("#returnDetailsGrid1").show();
    $("#returnDetailsGrid2").show();
    $("#returnDetailsGrid3").hide();
    $("#returnDetailsGrid4").hide();
    $("#returnDetailsGrid5").hide();
    $("#returnDetailsGrid6").hide();
    $("#returnDetailsGrid7").hide();
    $("#returnDetailsGrid8").hide();

    $("#previousDetail1").hide();
    $("#previousDetail2").hide();
    $("#previousDetail3").hide();
    $("#moreDetail1").show();
    $("#moreDetail2").hide();
    $("#moreDetail3").hide();
};

var bootstrapNotification = function () {
    loadOffices();

    $("#pgHeader").text(HeaderName);
    $("#gridView").hide();
    $("#estimateDetail").hide();
    $("#returnDetail").show();
};

var loadDetails = function (trId) {
    let url = `${citDetailsUrl}${trId}`;

    apiCaller(url, "GET", "", loadForm)
};

var searchPIT = function () {
    objToSend.assessmentYear = activeYear === "" ? new Date().getFullYear() : activeYear;
    objToSend.taxOfficeId = activeTaxOffice;
    objToSend.transactionType = "Return";
    objToSend.tin = $("#tinHolder").val();
    objToSend.startDate = $("#startDate").val();
    objToSend.endDate = $("#endDate").val();

    let url = `${searchPITByTaxOffice}`;

    $("#Grid").data("kendoGrid").dataSource.data([]);
    apiCaller(url, "POST", objToSend, initializeKendoGrid);
};

var loadForm = function (response) {

    if (response && response.length !== 0) {
        let resp = response[0];

        $("#taxpayerName").text(resp.taxpayerName);
        $("#taxpayerTin").text(resp.taxpayerTin);
        $("#assessmentYear2").text(resp.assessmentYear);
        $("#fromPeriod").text(resp.fromPeriod);
        $("#toPeriod").text(resp.toPeriod);
        $("#createDate").text(resp.createDate);
        $("#nil").text(resp.nil);
        $("#tripsDocumentNo").text(resp.tripsDocumentNo);

        loadCtr1(resp.ctr1[0]);
        loadCtr2(resp.ctr2[0]);
        loadCtr3(resp.ctr3[0]);
        loadDirectors(resp.ctr4);

        hideAndShowThings();
    } else
        toastr.error("An error occured");
};

var loadCtr1 = function (resp) {
    $("#cashAssestsReturnCurr").text(parseFloat(resp.cashAssestsReturnCurr).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#cashAssetsOtherCurr").text(parseFloat(resp.cashAssetsOtherCurr).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsOtherCurrentAssets").text(parseFloat(resp.bsOtherCurrentAssets).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#bsStocks").text(parseFloat(resp.bsStocks).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#accountReceivables").text(parseFloat(resp.accountReceivables).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalCurrentAssets").text(parseFloat(resp.totalCurrentAssets).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#fixedCurrent").text(parseFloat(resp.fixedCurrent).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#otherAssets").text(parseFloat(resp.otherAssets).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalAssets").text(parseFloat(resp.totalAssets).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tradePayablesReturnCurr").text(parseFloat(resp.tradePayablesReturnCurr).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#tradePayablesOtherCurr").text(parseFloat(resp.tradePayablesOtherCurr).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalTradePayables").text(parseFloat(resp.totalTradePayables).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#otherPayablesReturnCurr").text(parseFloat(resp.otherPayablesReturnCurr).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#otherPayablesOtherCurr").text(parseFloat(resp.otherPayablesOtherCurr).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalOtherPayables").text(parseFloat(resp.totalOtherPayables).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalPayables").text(parseFloat(resp.totalPayables).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#shareholdersFund").text(parseFloat(resp.shareholdersFund).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalPayablesAndFund").text(parseFloat(resp.totalPayablesAndFund).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
};

var loadCtr2 = function (resp) {
    $("#localIncome").text(parseFloat(resp.localIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#exportIncome").text(parseFloat(resp.exportIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalBusIncome").text(parseFloat(resp.totalBusIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#investmentIncome").text(parseFloat(resp.investmentIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#otherIncome").text(parseFloat(resp.otherIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalCompanyIncome").text(parseFloat(resp.totalCompanyIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#opExpenReturnCurr").text(parseFloat(resp.opExpenReturnCurr).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#opExpensesForeignCurr").text(parseFloat(resp.opExpensesForeignCurr).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalOperatingCost").text(parseFloat(resp.totalOperatingCost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#directorsRenum").text(parseFloat(resp.directorsRenum).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#labourCosts").text(parseFloat(resp.labourCosts).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#interestExpensesReturnCurr").text(parseFloat(resp.interestExpensesReturnCurr).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#interestExpForeignCurr").text(parseFloat(resp.interestExpForeignCurr).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalInteretsExpenses").text(parseFloat(resp.totalInteretsExpenses).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalGeneralAdminExpenses").text(parseFloat(resp.totalGeneralAdminExpenses).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#depreciation").text(parseFloat(resp.depreciation).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#foreignExchangeLosses").text(parseFloat(resp.foreignExchangeLosses).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalPayablesAndFund").text(parseFloat(resp.totalPayablesAndFund).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalExpenses").text(parseFloat(resp.totalExpenses).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#netCompanyProfitOrLoss").text(parseFloat(resp.netCompanyProfitOrLoss).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
};

var loadCtr3 = function (resp) {
    $("#netCompanyProfitOrLoss").text(parseFloat(resp.netCompanyProfitOrLoss).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#nonallowableDeductions").text(parseFloat(resp.nonallowableDeductions).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#adjustedNetProfitLoss").text(parseFloat(resp.adjustedNetProfitLoss).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    
    $("#nonTaxableIncome").text(parseFloat(resp.nonTaxableIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#adjustedIncome").text(parseFloat(resp.adjustedIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#capitalAllowance").text(parseFloat(resp.capitalAllowance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#carryForwardLosses").text(parseFloat(resp.carryForwardLosses).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#otherAllowableDeduction").text(parseFloat(resp.otherAllowableDeduction).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    
    $("#totalAllowableDeduction").text(parseFloat(resp.totalAllowableDeduction).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalChargeableIncome").text(parseFloat(resp.totalChargeableIncome).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#chargeableIncomeTaxDiffRate").text(parseFloat(resp.chargeableIncomeTaxDiffRate).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#chargeableIncomeTaxNormalRate").text(parseFloat(resp.chargeableIncomeTaxNormalRate).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxCode").text(parseFloat(resp.taxCode).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    
    $("#taxRate").text(parseFloat(resp.taxRate).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxLiability").text(parseFloat(resp.taxLiability).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxRebateCode").text(parseFloat(resp.taxRebateCode).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#rateofTaxRebate").text(parseFloat(resp.rateofTaxRebate).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#amountTaxRebate").text(parseFloat(resp.amountTaxRebate).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxPayable").text(parseFloat(resp.taxPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#citaxedDiffRateA").text(parseFloat(resp.citaxedDiffRateA).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxCodeA").text(parseFloat(resp.taxCodeA).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxRateA").text(parseFloat(resp.taxRateA).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxPayableA").text(parseFloat(resp.taxPayableA).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#citaxedDiffRateB").text(parseFloat(resp.citaxedDiffRateB).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#taxCodeB").text(parseFloat(resp.taxCodeB).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxRateB").text(parseFloat(resp.taxRateB).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxPayableB").text(parseFloat(resp.taxPayableB).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#citaxedDiffRateC").text(parseFloat(resp.citaxedDiffRateC).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxCodeC").text(parseFloat(resp.taxCodeC).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#taxRateC").text(parseFloat(resp.taxRateC).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#taxPayableC").text(parseFloat(resp.taxPayableC).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalTaxPayableOnCidiffRate").text(parseFloat(resp.totalTaxPayableOnCidiffRate).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalTaxPayable").text(parseFloat(resp.totalTaxPayable).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#withholdingTaxCredits").text(parseFloat(resp.withholdingTaxCredits).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

    $("#taxesPaidDirectly").text(parseFloat(resp.taxesPaidDirectly).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#priorPeriodCredits").text(parseFloat(resp.priorPeriodCredits).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#totalDirectPayCredits").text(parseFloat(resp.totalDirectPayCredits).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#incomeTaxOutstandingOverpayment").text(parseFloat(resp.incomeTaxOutstandingOverpayment).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    $("#statutoryLevies").text(parseFloat(resp.statutoryLevies).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
};

var moreDetails = function (stage) {
    if (stage === 1) {
        $("#returnDetailsGrid1").hide();
        $("#returnDetailsGrid2").hide();
        $("#returnDetailsGrid3").show();
        $("#returnDetailsGrid4").show();
        $("#returnDetailsGrid5").hide();
        $("#returnDetailsGrid6").hide();
        $("#returnDetailsGrid7").hide();
        $("#returnDetailsGrid8").hide();

        $("#moreDetail1").hide();
        $("#moreDetail2").show();
        $("#moreDetail3").hide();
        $("#previousDetail1").show();
        $("#previousDetail2").hide();
        $("#previousDetail3").hide();

    } else if (stage === 2) {
        $("#returnDetailsGrid1").hide();
        $("#returnDetailsGrid2").hide();
        $("#returnDetailsGrid3").hide();
        $("#returnDetailsGrid4").hide();
        $("#returnDetailsGrid5").show();
        $("#returnDetailsGrid6").show();
        $("#returnDetailsGrid7").hide();
        $("#returnDetailsGrid8").hide();

        $("#moreDetail1").hide();
        $("#moreDetail2").hide();
        $("#moreDetail3").show();
        $("#previousDetail1").hide();
        $("#previousDetail2").show();
        $("#previousDetail3").hide();
    } else if (stage === 3) {
        $("#returnDetailsGrid1").hide();
        $("#returnDetailsGrid2").hide();
        $("#returnDetailsGrid3").hide();
        $("#returnDetailsGrid4").hide();
        $("#returnDetailsGrid5").hide();
        $("#returnDetailsGrid6").hide();
        $("#returnDetailsGrid7").show();
        $("#returnDetailsGrid8").show();

        $("#moreDetail1").hide();
        $("#moreDetail2").hide();
        $("#moreDetail3").hide();
        $("#previousDetail1").hide();
        $("#previousDetail2").hide();
        $("#previousDetail3").show();
    }
};

var previousDetail = function (stage) {
    if (stage === 1) {
        $("#returnDetailsGrid1").show();
        $("#returnDetailsGrid2").show();
        $("#returnDetailsGrid3").hide();
        $("#returnDetailsGrid4").hide();
        $("#returnDetailsGrid5").hide();
        $("#returnDetailsGrid6").hide();
        $("#returnDetailsGrid7").hide();
        $("#returnDetailsGrid8").hide();

        $("#moreDetail1").show();
        $("#moreDetail2").hide();
        $("#moreDetail3").hide();
        $("#previousDetail1").hide();
        $("#previousDetail2").hide();
        $("#previousDetail3").hide();
    } else if (stage === 2) {
        $("#returnDetailsGrid1").hide();
        $("#returnDetailsGrid2").hide();
        $("#returnDetailsGrid3").show();
        $("#returnDetailsGrid4").show();
        $("#returnDetailsGrid5").hide();
        $("#returnDetailsGrid6").hide();
        $("#returnDetailsGrid7").hide();
        $("#returnDetailsGrid8").hide();

        $("#moreDetail1").hide();
        $("#moreDetail2").show();
        $("#moreDetail3").hide();
        $("#previousDetail1").show();
        $("#previousDetail2").hide();
        $("#previousDetail3").hide();
    } else if (stage === 3) {
        $("#returnDetailsGrid1").hide();
        $("#returnDetailsGrid2").hide();
        $("#returnDetailsGrid3").hide();
        $("#returnDetailsGrid4").hide();
        $("#returnDetailsGrid5").show();
        $("#returnDetailsGrid6").show();
        $("#returnDetailsGrid7").hide();
        $("#returnDetailsGrid8").hide();

        $("#moreDetail1").hide();
        $("#moreDetail2").show();
        $("#moreDetail3").hide();
        $("#previousDetail1").hide();
        $("#previousDetail2").show();
        $("#previousDetail3").hide();
    }

}

var loadDirectors = function (resp) {
    let output = "";

    for (var i = 0; i < resp.length; i++) {
        output = output + '<tr><td align="">' + resp[i].directorsName+ '</td>'
            + '<td align="" style="color: black">' + resp[i].directorsTin + '</td>'
            + '<td align="center" style="color: black">' + resp[i].directorsSalary + '</td>'
            + '<td><button style="padding: 4px 8px;" onclick="previewDirector(this)" id="' + resp[i].directorId +
            '" title="View item" class="btn btn-success btn-sm"><span class="fa fa-file fa-lg"></span></button></td>';
    }

    output = output;
    $("#listOfDirectors").html(output);
    sessionStorage.setItem("listOfDirectors", JSON.stringify(resp));
};

var previewDirector = function (rowInfo) {
    var directors = JSON.parse(sessionStorage.getItem("listOfDirectors"));
    for (var i = 0; i < directors.length; i++) {
        if (directors[i].directorId === rowInfo.id) {
            return loadDirectorDetailsModal(directors[i]);
        }
    }
}

var loadDirectorDetailsModal = function (resp) {
    $(".directorFullNameModalDetails").text(resp.directorsName);
    $(".directorTINModalDetails").text(resp.directorsTin);
    $(".residentialStatusModalDetails").text(resp.resStatus);
    $(".salaryDirectorModalDetails").text(resp.directorsSalary);
    $(".interestDirectorModalDetails").text(resp.interst);
    $(".otherAllowanceDirectorModalDetails").text(resp.otherAllowances);
    $(".loansDirectorModalDetails").text(resp.loans);
    $(".totalDirectorModalDetails").text(resp.total);

    $("#directorDetailModal").modal("show");
};

$("#backToGrid").click(function () {

    $("#gridView").show();
    $("#returnDetail").hide();

    if (getParameterByName("type") === "annualreturn" || getParameterByName("type") === "provisional")
        initializeKendoGrid([], 1);
});