var HeaderName = "CIT Returns";

var hideAndShowThings = function () {
    $("#gridView").hide();
    $("#estimatesDetailsView").hide();
    $("#returnDetail").show();

    $("#returnDetailsGrid1").show();
    $("#returnDetailsGrid2").show();
    $("#returnDetailsGrid3").hide();
    $("#returnDetailsGrid4").hide();
    $("#returnDetailsGrid5").hide();
    $("#returnDetailsGrid6").hide();

    $("#previousDetail1").hide();
    $("#previousDetail2").hide();
    $("#moreDetail1").show();
    $("#moreDetail2").hide();

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
        $("#assessmentYear").text(resp.assessmentYear);
        $("#fromPeriod").text(resp.fromPeriod);
        $("#toPeriod").text(resp.toPeriod);
        $("#createDate").text(resp.createDate);
        $("#nil").text(resp.nil);
        $("#tripsDocumentNo").text(resp.tripsDocumentNo);

        loadCtr1(resp.ctr1[0]);
        loadCtr2(resp.ctr2[0]);
        //loadTc(resp);
        //LoadTr(resp);

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

var moreDetails = function (stage) {
    if (stage === 1) {
        $("#returnDetailsGrid1").hide();
        $("#returnDetailsGrid2").hide();
        $("#returnDetailsGrid3").show();
        $("#returnDetailsGrid4").show();
        $("#returnDetailsGrid5").hide();

        $("#moreDetail1").hide();
        $("#moreDetail2").show();
        $("#previousDetail1").show();
        $("#previousDetail2").hide();

    } else if (stage === 2) {
        $("#returnDetailsGrid1").hide();
        $("#returnDetailsGrid2").hide();
        $("#returnDetailsGrid3").hide();
        $("#returnDetailsGrid4").hide();
        $("#returnDetailsGrid5").show();

        $("#moreDetail1").hide();
        $("#moreDetail2").hide();
        $("#previousDetail1").hide();
        $("#previousDetail2").show();
    }
};

var previousDetail = function (stage) {
    if (stage === 1) {
        $("#returnDetailsGrid1").show();
        $("#returnDetailsGrid2").show();
        $("#returnDetailsGrid3").hide();
        $("#returnDetailsGrid4").hide();
        $("#returnDetailsGrid5").hide();

        $("#moreDetail1").show();
        $("#moreDetail2").hide();
        $("#previousDetail1").hide();
        $("#previousDetail2").hide();

    } else if (stage === 2) {
        $("#returnDetailsGrid1").hide();
        $("#returnDetailsGrid2").hide();
        $("#returnDetailsGrid3").show();
        $("#returnDetailsGrid4").show();
        $("#returnDetailsGrid5").hide();

        $("#moreDetail1").hide();
        $("#moreDetail2").show();
        $("#previousDetail1").show();
        $("#previousDetail2").hide();
    }
}

var loadAgedDependentReliefDetail = function (resp) {
    let output = "";
    var dependants = resp[0].agedDepandantsDetails.sort(function (a, b) {
        return (a.firstName - b.firstName);
    });

    for (var i = 0; i < dependants.length; i++) {
        output = output + '<tr><td align="">' + dependants[i].firstName + " " + dependants[i].middleName + " " + dependants[i].lastName + '</td>'
            + '<td align="" style="color: black">' + dependants[i].agedDateOfBirth + '</td>'
            + '<td align="center" style="color: black">' + dependants[i].gender + '</td>'
            + '<td align="center" style="color: black">' + dependants[i].maritalStatus + '</td>'
            + '<td><button style="padding: 4px 8px;" onclick="previewDependent(this)" id="' + dependants[i].dependentId +
            '" title="View item" class="btn btn-success btn-sm btnReturnDetail"><span class="fa fa-file fa-lg"></span></button></td>';
    }

    output = output;
    $("#listOfDirectors").html(output);
    sessionStorage.setItem("listOfDirectors", JSON.stringify(resp));
};

var previewChildDependent = function (rowInfo) {
    var appDetail = JSON.parse(sessionStorage.getItem("listOfDirectors"));
    var dependants = appDetail[0].childDetails;
    for(var i = 0; i < dependants.length; i++) {
        if (dependants[i].dependantId === rowInfo.id) {
            return loadChildWardDependantReliefModal(dependants[i]);
        }
    }
}