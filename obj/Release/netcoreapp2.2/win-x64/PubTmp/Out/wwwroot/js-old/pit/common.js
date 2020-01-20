var estimatesPage = "estimates";
var estimatesRevisedPage = "estimatesRevised";
var returnsPage = "returns";
var returnsRevisedPage = "returnsRevised";

var pageName = "", pageLabel = "";
var currentPathName = getCurrentPageName();

// PromptModal Configuration
var ToastMessage = "";
var PromptNoAction = "";
var PromptConfig = {
    Title: null,
    Message: null,
    Positive: {
        Title: null,
        Action: null,
        Alert: null,
        Call: null
    },
    Negative: {
        Title: null,
        Action: null,
        Alert: null,
        Call: null
    }
};

// Define TabList
var TabList = [];
BuildTabList();

// Set Activate Tab and Control its elements
var CurrentTabId = 0;
ActivateTab();

// Quaters Remaining to Pay
var quarterRemaining = 1;
// GetQuarterRemaining();

// Year Options
var YearOptions = { year: 'numeric', month: 'long', day: 'numeric' };
var FromPeriod, ToPeriod, AssessmentYear;

// PIT estimates
var estimatesData = {};


function getCurrentPageName() {
    var url = window.location.pathname;
    var myPageName = url.substring(url.lastIndexOf('/') + 1);
    return myPageName;
}

switch (currentPathName) {
    case estimatesPage: //"annual-estimates":
        pageLabel = "Annual Estimates";
        pageName = `PIT (${pageLabel})`;
        break;
    case estimatesRevisedPage: //"revised-estimates":
        pageLabel = "Annual Revised Estimates";
        pageName = `PIT (${pageLabel})`;
        break;
    case returnsPage: //"annual-returns":
        pageLabel = "Annual Returns";
        pageName = `PIT (${pageLabel})`;
        break;
    case returnsRevisedPage: //"revised-returns"
        pageLabel = "Annual Revised Returns";
        pageName = `PIT (${pageLabel})`;
        break;
}
pageTitle(pageName);

// Get TaxPayer Data
var TaxPayerData = {};

// Get TaxConsultant Data
var TaxConsultantData = {};


$(document).ready(function () {
    GetTaxPayerData();
});

function GetTaxPayerData() {
    var dataModel = {
        TIN: nameTIN.TIN // Get from localStorage
    };

    var postData = JSON.stringify(dataModel);
    // console.log("nameTIN: ", nameTIN);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerData`;
    $.post(postUrl, postData, function (data, status) {
        // console.log('GetTaxPayerData Data: ', data);

        // Display on view
        if (data.status === "Successful") {
            $("#TaxIdentificationNumber").val(data.body.tin);
            $("#CurrentTaxOffice").val(data.body.taxOffice.name);
            $("#LastName").val(data.body.lastName);
            $("#FirstName").val(data.body.firstName);
            $("#OtherNames").val(data.body.otherNames);
            $("#Nationality").val(data.body.nationality.name);
            $("#TaxPayerId").val(data.body.id);
            $("#CurrencyId").val(data.body.currency.id);
            $("#SSNIT").val(data.body.ssnit);
            $("#PostalAddress").val(data.body.digitalAddress);
            $("#DigitalAddress").val(data.body.postalAddress);

            // Keep object for future use.
            TaxPayerData = data.body;

            // Call to get consultant data
            GetConsultantData();
        }
    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
    });
}

function GetConsultantData() {
    if (isNotEmpty(TaxPayerData)) {
        var dataModel = {
            TIN: TaxPayerData.taxConsultant.tin
        };

        var postData = JSON.stringify(dataModel);
        //console.log("GetConsultantData: ", dataModel);

        // Call Local API
        var postUrl = `?handler=GetTaxPayerData`;
        $.post(postUrl, postData, function (data, status) {
            // console.log('GetConsultantData Data: ', data);

            // Display in view
            if (data.status === "Successful") {
                $("#ConsultantName").val(data.body.displayName);
                $("#ConsultantTIN").val(data.body.tin);

                // Keep object for future use.
                TaxConsultantData = data.body;            
            }
        }).fail(function (response) {
            //console.log('Response Error: ' + response.responseText);
        });
    }
}

var ComputePeriodValues = function () {

    // Reset and Show PopUp
    UnCheckIncomeSources();
    UnCheckNILReturns();

    AssessmentYear = $("#AssessmentYear").val();
    if (Number(AssessmentYear) >= 1990) {

        // Modal Title
        $(".SelectedYear").text(` - ${AssessmentYear}`);
        $(".PITPageTitle").text(pageLabel)

        if (currentPathName === estimatesPage || currentPathName === estimatesRevisedPage) {
            // Check if Tax Payer has Estimates 
            GetPITEstimatesByYear();
        } else if (currentPathName === returnsPage || currentPathName === returnsRevisedPage) {
            // Check if Tax Payer submitted or saved Returns
            GetReturnsByYear();
        } else {
            AllowWithoutEsitmates();
        }
    } else {
        toastr.info("Please select a valid year.");
    }
}

var ResetPeriod = function () {
    if (Number(AssessmentYear) >= 1990) {
        // Reset Form Elements
        $("#btnResetPeriod").prop("hidden", true);
        // $("#btnGetTaxPayable").prop("disabled", true);
        // $("#PageDataBody").prop("hidden", true);
        // Show Modal
        $('#PITSetupModal').modal('show');
    } else {
        toastr.info("No year selected yet.");
    }
}

function AllowWithoutEsitmates() {
    // Check Period and Populate FromDate ToDate
    FromPeriod = new Date(`${AssessmentYear}-01-01`);
    ToPeriod = new Date(`${AssessmentYear}-12-31`);

    //$("#FromPeriod").html(FromPeriod.toLocaleDateString("en-US", YearOptions));
    //$("#ToPeriod").html(ToPeriod.toLocaleDateString("en-US", YearOptions));

    $("#FromPeriod").text(`January 1, ${AssessmentYear}`);
    $("#ToPeriod").text(`December 31, ${AssessmentYear}`);

    // Show Year Period
    $("#YearPeriod").removeAttr("hidden");

    $('#PITSetupModal').modal('show');
}

// Get PIT Estimates by year
function GetPITEstimatesByYear() {
    // Show Preloader
    $('body').showLoading();

    // Get Remaining Quarters
    GetQuarterRemaining();

    // Reset Period
    $("#FromPeriod").val("");
    $("#ToPeriod").val("");
    // Get PIT Estimate for selected year
    var dataModel = {
        TaxYear: AssessmentYear,
        TaxPayerId: nameTIN.Id
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API - Checking for PIT Estimates for the selected year.
    var postUrl = `?handler=GetPITEstimatesByYear`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.status === "Successful" || data.code === 404 || data.code === 204) {
            if (data.body == null || data.body.estimateId == null) {
                if (currentPathName == estimatesPage) {
                    // Check Period and Populate FromDate ToDate
                    FromPeriod = new Date(`${AssessmentYear}-01-01`);
                    ToPeriod = new Date(`${AssessmentYear}-12-31`);

                    $("#FromPeriod").html(FromPeriod.toLocaleDateString("en-US", YearOptions));
                    $("#ToPeriod").html(ToPeriod.toLocaleDateString("en-US", YearOptions));

                    // Show Year Period
                    $("#YearPeriod").removeAttr("hidden");

                    $('#PITSetupModal').modal('show');
                } else {
                    PromptConfig = {
                        Title: "No PIT Annual Estimates",
                        Message: `No PIT Annual Estimates found on your account for the year ${AssessmentYear}. Please submit your PIT Annual Estimates and try again.`,
                        Positive: {
                            Title: "OK",
                            Action: `pit/${estimatesPage}`,
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
                }
            } else {
                if (currentPathName == estimatesPage) {
                    PromptConfig = {
                        Title: "PIT Annual Estimates Found",
                        Message: `PIT Annual Estimates was found on your account for the year ${AssessmentYear}. Would you like to revise it instead?.`,
                        Positive: {
                            Title: "Yes",
                            Action: `pit/${estimatesRevisedPage}`,
                            Alert: null,
                            Call: null
                        },
                        Negative: {
                            Title: "No",
                            Action: null,
                            Alert: null,
                            Call: null
                        }
                    };
                    ShowPrompt();
                
                } else {
                    estimatesData = data.body;

                    // Check Period and Populate FromDate ToDate
                    FromPeriod = new Date(GetDateOrTime(data.body.fromPeriod).date);
                    ToPeriod = new Date(GetDateOrTime(data.body.toPeriod).date);

                    //$("#FromPeriod").html(FromPeriod.toLocaleDateString("en-US", YearOptions));
                    //$("#ToPeriod").html(ToPeriod.toLocaleDateString("en-US", YearOptions));

                    $("#FromPeriod").text(`January 1, ${AssessmentYear}`);
                    $("#ToPeriod").text(`December 31, ${AssessmentYear}`);

                    // Show Year Period
                    $("#YearPeriod").removeAttr("hidden");

                    $('#PITSetupModal').modal('show');
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

// Get Number of quarters remaining
function GetQuarterRemaining() {
    var dataModel = {
        Year: AssessmentYear,
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetQuarterRemaining`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        // console.log('GetQuarterRemaining Data: ', data);
        if (data.status == "Successful") {
            quarterRemaining = data.body.quarterRemaining;
            $("#QuartersOutstandingNo").val(quarterRemaining);
        }
    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);
    });
}

function ShowPITSetupModel() {
    if (currentPathName != estimatesPage && (estimatesData == "" || estimatesData == null)) {
        toastr.info(`No Estimates found for ${AssessmentYear}`);
    } else {
        // Show PopUp
        $(".SelectedYear").text(` - ${AssessmentYear}`);
        $(".PITPageTitle").text(pageLabel)

        UnCheckIncomeSources();
        UnCheckNILReturns();
        $('#PITSetupModal').modal('show');
    }
}

var CheckNILReturns = function () {
    if (IsNILReturnsChecked()) {
        UnCheckIncomeSources();
    }
}

var CheckIncomeSources = function () {
    if (IsIncomeSourceChecked()) {
        UnCheckNILReturns();
    }
}

function UnCheckNILReturns() {
    $("#SetupNILReturns").prop("checked", false);
}

function UnCheckIncomeSources() {
    $("#SetupEmployee").prop("checked", false);
    $("#SetupBusiness").prop("checked", false);
    $("#SetupInvestment").prop("checked", false);
}

var PITSetUpOK = function () {
    if (!IsPeriodOK()) {
        toastr.error("Please select a valid year.");
    } else if (!IsSetupPITValidOK()) {
        toastr.error("Please select at least a 'Source of Income' or 'No Tax Filing'.");
    } else {
        $("#btnResetPeriod").removeAttr("hidden");
        $("#PITSetupModal").modal("hide");
        $("#PageDataBody").removeAttr("hidden");

        // Disable & Set all Tax-Elements To NILL
        $("input[class*='Tax']").val(NILDisplay).prop('disabled', true);

        // Hide All Tab Titles
        $("li[class*='Tabx']").prop('hidden', true);

        // Hide All Tab Contents
        $("div[class*='Cox']").prop('hidden', true);

        // Hide All Accordions Under IncomeStatement
        $("li[class*='Dion']").prop('hidden', true);

        if (IsNILReturnsChecked()) {
            // Control button
            $("#btnSubmit").removeAttr("hidden");
            $("#btnGetTaxPayable").prop('disabled', true);
            $("#btnSaveContinue").prop('hidden', true);

            // Enable & Show Personal Info
            $("#PersonalDetails-tab").removeClass("disabled").removeAttr('hidden').addClass("active");
            $("#PersonalDetails").removeAttr('hidden').addClass("active show");

            // Hide All Otther buttons
            $("#rowBack").prop('hidden', true);
            $("#rowBackNext").prop('hidden', true);
            $("#rowNext").prop('hidden', true);
        } else {
            $("#btnGetTaxPayable").removeAttr("disabled");

            CurrentTabId = 0

            // Enable Selected Tax Source Imput Elements
            let getCheckedElements = GetCheckedElements();
            $(`${getCheckedElements}`).each(function () {
                $(this).val(NILToZero($(this).val())).removeAttr("disabled");
            });

            // Show Selected Tax Source Tab Titles
            let getCheckedTabs = GetCheckedTabs();
            $(`${getCheckedTabs}`).each(function () {
                $(this).removeAttr("hidden");
            });

            // Show Selected Tax Source Tab Contents
            let getCheckedContents = GetCheckedContents();
            $(`${getCheckedContents}`).each(function () {
                $(this).removeAttr("hidden");
            });

            // Show Selected Tax Source Accordions
            let getCheckedAccordions = GetCheckedAccordions();
            $(`${getCheckedAccordions}`).each(function () {
                $(this).removeAttr("hidden");
            });

            //Set Computed Elements to 0.00
            $('.TaxComputedMoney').each(function () {
                $(this).val(NILValue);
            });

            // Rebuild TabList Array
            BuildTabList();

            // Control Active Tab Elements
            ActivateTab();

            // Display any available data.
            DisplayPITData();
        }
    }
}

var PITSetUpCancel = function () {
    // Show Reset Button
    $("#btnResetPeriod").removeAttr("hidden");
    /*
    FromPeriod = "";
    ToPeriod = "";
    $("#AssessmentYear option").prop('selected', function () {
        return this.defaultSelected;
    });    
    $("#YearPeriod").prop("hidden", true);
    */
}

function IsPeriodOK() {
    if (FromPeriod != "" && FromPeriod != null && ToPeriod != "" && ToPeriod != null) {
        return true;
    }
    return false;
}

function IsChargeableOK() {
    let annualChargeable = $("#AnnualChargeableIncome").val();
    if (annualChargeable != "" && annualChargeable != null) {
        return true;
    }
    return false;
}

function IsEmploymentIncomeChecked() {
    return $('#SetupEmployee:checked').val() ? true : false;
}

function IsBusinessIncomeChecked() {
    return $('#SetupBusiness:checked').val() ? true : false;
}

function IsInvestmentIncomeChecked() {
    return $('#SetupInvestment:checked').val() ? true : false;
}

function IsIncomeSourceChecked() {
    return IsEmploymentIncomeChecked() || IsBusinessIncomeChecked() || IsInvestmentIncomeChecked();
}

// Get Checked Input Elements
function GetCheckedElements() {
    var sources = [];
    if (IsEmploymentIncomeChecked()) {
        sources.push(".TaxEmploymentMoney");
    }
    if (IsBusinessIncomeChecked()) {
        sources.push(".TaxBusinessMoney");
    }
    if (IsInvestmentIncomeChecked()) {
        sources.push(".TaxInvestmentMoney");
    }
    sources.push(".TaxAll");
    return sources.join(", ");
}

// Get Checked Tab Titles
function GetCheckedTabs() {
    var sources = [];
    
    if (IsEmploymentIncomeChecked()) {
        sources.push(".TabxEmployment");
    }
    
    if (IsBusinessIncomeChecked()) {
        sources.push(".TabxBusiness");
    }
    
    if (IsInvestmentIncomeChecked()) {
        sources.push(".TabxInvestment");
    }
    
    sources.push(".TabxAll");

    return sources.join(", ");
}

// Get Checked Tab Contents
function GetCheckedContents() {
    var sources = [];
    
    if (IsEmploymentIncomeChecked()) {
        sources.push(".CoxEmployment");
    }
    
    if (IsBusinessIncomeChecked()) {
        sources.push(".CoxBusiness");
    }
    
    if (IsInvestmentIncomeChecked()) {
        sources.push(".CoxInvestment");
    }
    
    sources.push(".CoxAll");

    return sources.join(", ");
}

// Get Checked Accordions
function GetCheckedAccordions() {
    var sources = [];

    if (IsEmploymentIncomeChecked()) {
        sources.push(".DionEmployment");
    }

    if (IsBusinessIncomeChecked()) {
        sources.push(".DionBusiness");
    }

    if (IsInvestmentIncomeChecked()) {
        sources.push(".DionInvestment");
    }

    sources.push(".CoxAll");

    return sources.join(", ");
}

function IsNILReturnsChecked() {
    return $('#SetupNILReturns:checked').val() ? true : false;
}

function IsSetupPITValidOK() {
    return (IsIncomeSourceChecked() && !IsNILReturnsChecked()) || (!IsIncomeSourceChecked() && IsNILReturnsChecked());
}

// Get Date or Time from DateTime Value
function GetDateOrTime(datetime) {
    var fields = datetime.split('T');
    var dateF = fields[0];
    var timeF = fields[1];
    return {
        date: dateF,
        time: timeF,
        dateTime: `${dateF} : ${timeF}`
    }
}


// Check if Object Is Empty
var isEmpty = function (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// Check if Object Is Not Empty
var isNotEmpty = function (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return true;
    }
    return false;
}

// Save & Continue Button Click
$("#btnSaveContinue").click(function () {
    if (!IsPeriodOK()) {
        toastr.info("Please select a valid year.");
    }
    else {
        if (currentPathName === returnsPage || currentPathName === returnsRevisedPage) {
            // Get CurrentTab Object
            var contentId = GetCurrentTab().ContentId;
            if (contentId === "BusinessDetails" || contentId === "PersonalDetails") {
                CurrentTabId = GetNextTab().Id;
                ActivateTab();
            }
            else if (CanSaveNow() === true) {
                SaveAndContinueReturns();
            } else {
                toastr.info("Please enter your tax values to save.");
            }
        } else {
            CurrentTabId = GetNextTab().Id;
            ActivateTab();
        }
    }
});

// Submit Button Click
$("#btnSubmit").click(function () {
    if (!IsPeriodOK()) {
        toastr.info("Please select a valid year.");
    }
    else if (!IsChargeableOK()) {
        toastr.info("Please enter your income values.");
    }
    else {        
        if (currentPathName === returnsPage || currentPathName === returnsRevisedPage) {
            if (CanSaveNow() === true) {
                //Display Preview
                DisplayPrintPreview();
                //Open Preview
                $('#PreviewModal').modal('show');
            } else {
                toastr.info("Please enter your tax values to submit.");
            }
        } else {
            //Open Declaration
            var CurrentUserTIN = $("#UserTIN").text();
            var ActiveTaxPayerTIN = nameTIN.TIN;
            $("#DeclarationAssociate").prop("hidden", true);
            if (CurrentUserTIN != ActiveTaxPayerTIN) {
                $("#DeclarationAssociate").removeAttr("hidden");
                $("#DeclarationAssociateName").html(nameTIN.Name);
            }

            $('#modal-declare').modal('show');
        }
    }
});

var PreviewOK = function () {
    //Hide Preview
    $('#PreviewModal').modal('hide');
    //Open Declaration
    $('#modal-declare').modal('show');
}

var PrintPreview = function () {
    //Hide Preview
    $('#PreviewModal').modal('hide');

    var divContents = $("#PrintContent").html();

    var printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.write(`<html><head><title>${nameTIN.TIN} - PIT Returns - ${AssessmentYear}</title>`);
    printWindow.document.write('<link type="text/css" href="css/app.css" rel="stylesheet"/>')
    printWindow.document.write('<style>.table tbody td {vertical-align: middle;}.table td{padding: .35rem 1rem;border-top: 1px solid #efefef;}</style>')
    printWindow.document.write('</head><body >');
    printWindow.document.write(divContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(function () { printWindow.print(); }, 1000);
    //printWindow.close();
}

var PrintDownload = function () {
    // Reduce font-size from 18px to 10px [For Downlaod Qulaity]
    $("#PrintContent").html($("#PrintContent").html().replace(/18px/g, "10px"))

    var digits = Math.floor(Math.random() * 9000000000) + 1000000000;
    var name = `${nameTIN.TIN}-${AssessmentYear}-${digits}.pdf`;
    // Convert the DOM element to a drawing using kendo.drawing.drawDOM
    kendo.drawing.drawDOM("#PrintContent", {
                paperSize: "A4",
                margin: {
                    left: "2mm",
                    top: "4mm",
                    right: "2mm",
                    bottom: "4mm"
                },
                font: "5px Verdana"
            })
        .then(function (group) {
            // Render the result as a PDF file
            return kendo.drawing.exportPDF(group);
        })
        .done(function (data) {
            // Save the PDF file
            kendo.saveAs({
                dataURI: data,
                fileName: name
            });
            $("#PrintContent").html($("#PrintContent").html().replace(/10px/g, "18px"))
        });
}


// Back Button Click
var MoveBack = function () {
    CurrentTabId = GetPreviousTab().Id;
    ActivateTab();
}

// Next Button Click
var MoveNext = function () {
    CurrentTabId = GetNextTab().Id;
    ActivateTab();
}

// Activate the Current Tab
function ActivateTab() {

    // Disable All TabList
    for (var j = 0; j < TabList.length; j++) {
        var tabId = TabList[j].TabId;
        var contentId = TabList[j].ContentId;
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
    var CurrentTab = GetCurrentTab();

    // Testing
    /*
    console.log("GetFirstTab", GetFirstTab());
    console.log("GetPreviousTab", GetPreviousTab());
    console.log("GetCurrentTab", GetCurrentTab());
    console.log("GetNextTab", GetNextTab());
    console.log("GetLastTab", GetLastTab());
    console.log("GetTabListCount", GetTabListCount());
    */

    // Activate the tab with CurrentTabId
    $(`#${CurrentTab.TabId}`).addClass("active").removeClass("disabled");
    $(`#${CurrentTab.ContentId}`).addClass("active show");

    // Control Active Tab Elements [Buttons]
    if (CurrentTabId === GetFirstTab().Id) {
        $("#rowNext").removeAttr("hidden");
        $("#btnSaveContinue").removeAttr("hidden");
    } else if (CurrentTabId === GetLastTab().Id) {
        $("#rowBack").removeAttr("hidden");
        $("#btnSubmit").removeAttr("hidden");
        if (currentPathName === returnsPage || currentPathName === returnsRevisedPage) {
            $("#btnSaveContinue").removeAttr("hidden");
        }
    } else {
        $("#rowBackNext").removeAttr("hidden");
        $("#btnSaveContinue").removeAttr("hidden");
    }

    // Close all accordions
    $('.accordion__title').each(function () {
        $(this).removeClass("active");
    });
    $('.accordion__content').each(function () {
        $(this).css("display", "none");;
    });

    // Open the topmost active accordion
    if (CurrentTab.ContentId === "IncomeStatement" && IsBusinessIncomeChecked() == false) {
        if (IsEmploymentIncomeChecked()) {
            // Open Employment Accordion
            $(".second_accordion_title").addClass("active");
            $(".second_accordion_body").css("display", "block");
        } else if (IsInvestmentIncomeChecked()) {
            // Open Investment Accordion
            $(".third_accordion_title").addClass("active");
            $(".third_accordion_body").css("display", "block");
        } else {
            $(".first_accordion_title").addClass("active");
            $(".first_accordion_body").css("display", "block");
        }
    } else if (CurrentTab.ContentId === "TaxCalculation" && IsBusinessIncomeChecked() == false) {
        if (IsBusinessIncomeChecked()) {
            $(".first_accordion_title").addClass("active");
            $(".first_accordion_body").css("display", "block");
        } else {
            $(".second_accordion_title").addClass("active");
            $(".second_accordion_body").css("display", "block");
        }
    } else {
        $(".first_accordion_title").addClass("active");
        $(".first_accordion_body").css("display", "block");
    }

}

// Count Number of Visible Tabs
function GetTabListCount() {
    return TabList.length;
}

// Get First Visible Tab
function GetFirstTab() {
    return TabList[0];
}

// Get Previous Visible Tab
function GetPreviousTab() {
    let currentTab = GetCurrentTab();
    return TabList[($.inArray(currentTab, TabList) - 1 + TabList.length) % TabList.length];
}

function GetCurrentTab() {
    // Get CurrentTab Object
    var CurrentTab = TabList.filter(obj => {
        return obj.Id === CurrentTabId
    })
    return CurrentTab[0];
}

// Get Next Visible Tab
function GetNextTab() {
    let currentTab = GetCurrentTab();
    return TabList[($.inArray(currentTab, TabList) + 1) % TabList.length];
}

// Get Last Visible Tab
function GetLastTab() {
    return TabList[TabList.length - 1];
}

// Build TabList Function
function BuildTabList() {
    // Empty TabList
    TabList = [];

    // Rebuild TabList with Non Hidden Tabs
    $('ul.nav-tabs >li').each(function () {
        if ($(this).is(":hidden")) {
            // Ignore Hidden elements
        } else {
            // Get <a> Children of Non Hidden elements
            let id = $(this).index();
            let tabId = $(this).children("a")[0].id;
            let contentId = tabId.slice(0, -4);
            let Tab = { Id: id, TabId: tabId, ContentId: contentId };

            // Push new tab into tablist
            TabList.push(Tab);
        }
    });

    // console.log("TabList", TabList);
    return TabList;
}

function CanSaveNow() {
    if (IsNILReturnsChecked()) {
        return true;
    }
    let totalAssets = $("#TotalAssets").val();
    let totalIncome = $("#TotalIncome").val();
    let totalReliefs = $("#TotalAllowableDeductionsReliefs").val();
    let chargeableIncome = $("#AnnualChargeableIncome").val();
    let canSaveValue = MoneyToNumber(totalAssets) + MoneyToNumber(totalIncome) + MoneyToNumber(totalReliefs) + MoneyToNumber(chargeableIncome);
    if (canSaveValue > 0) {
        return true;
    }
    return false;
}

var ShowPrompt = function () {
    //console.log("PromptConfig", PromptConfig);

    $("#PromptTitle").html(PromptConfig.Title);
    $("#PromptMessage").html(PromptConfig.Message);
    $("#PromptNo").html(PromptConfig.Negative.Title);
    $("#PromptYes").html(PromptConfig.Positive.Title);
    $("#PromptModal").modal("show");
}


var PromptOK = function () {   
    PromptYesNo();
}

var PromptNo = function () {   
    PromptYesNo("No");
}

var PromptYesNo = function (opt = "Yes") {
    // console.log("PromptConfig", PromptConfig);

    var optAlert = PromptConfig.Positive.Alert;
    var optAction = PromptConfig.Positive.Action;
    var optCall = PromptConfig.Positive.Call;
    if (opt != "Yes") {
        optAlert = PromptConfig.Negative.Alert;
        optAction = PromptConfig.Negative.Action;
        optCall = PromptConfig.Negative.Call;
    }

    
    if (optAlert != null && optAlert != "") {
        toastr.success(optAlert);
    }
    
    if (optCall != null) {
        $("#PromptModal").modal("hide");
        Function(optCall());
    } else if (optAction === null) {
        $("#PromptModal").modal("hide");
    } else {
        if (optAlert != null && optAlert != "") {
            setTimeout(function () { window.location = `${AppServerUrl}/${optAction}`; }, 1000); //1000 means 1 secs
        } else {
            window.location = `${AppServerUrl}/${optAction}`;
        }
    }
}

var DownloadPDFDoc =  function(el){

}
