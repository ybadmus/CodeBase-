var TaxPayerData = {},
    AssessmentYear = 0,
    YearOptions = { year: 'numeric', month: 'long', day: 'numeric' },
    FromPeriod,
    ToPeriod,
    TabList = [],
    CurrentTabId = 0,
    OtherPurposeId = "86f32679-ad0e-4ea8-9459-0fcbcb0c95c1",
    ChildEducationData = {},
    ChildrenEducationData = [],
    OldAgeData = {},
    AgedDependantData = {},
    AgedDependantsData = [],
    DisabilityData = {},
    VoluntaryPensionData = {},
    LifeAssuranceData = {},
    SocialSecurityData = {},
    CostofTrainingData = {},
    PTRApplicationData = {},
    PTRApplication,
    ApplicationTypes = [],
    PTRApplicationErrors = [],
    MaritalStatuses = [],
    ReliefApplicationsData = {},
    CommongApplicationData = {},
    PTRApplicationsData = [],
    StaticApplicationCodes = [
        "APP0003",
        "APP0004",
        "APP0005",
        "APP0006",
        "APP0007",
        "APP0008",
        "APP0009",
        "APP0010",
        "APP0011"
    ],
    ControlApplicationCodes = [
        "APP0009",
        "APP0010",
        "APP0011"
    ],
    DisqualifyApplicationCodes = [],
    PTRApplicationTypes = [], // All of them
    PTRApplicationTypesApplied = [], // Already Applied For
    PTRApplicationTypesUnApplied = [], // Un-Applied For
    PTRApplicationTypesDisqualify = [], // Disqalified by Age|etc.
    PTRApplicationTypesN = [], // New Selection Made
    PTRApplicationTypesE = [], // Error with Form Inputs
    PTRApplicationTypesX = [], // Submission Successful
    PTRApplicationTypesY = [], // Submission Failed
    PTRApplicationType = {},
    PTRFormErrorMessage = "Please fill in the required fields";


$(document).ready(function () {
    // Tax Years
    SetAssessmentYears();

    GetTaxPayerData();
    GetMaritalStatus();

    // Default Marriage Relief Option
    MarriageOptionM();
    
});

// Set Input as Tel
var SetAsIntlTelInputField = (el) => {
    window.intlTelInput(el, {
        utilsScript: "~/build/js/utils.js",
    });
}

var GetCurrentAge = (birthday) => {
    birthday = new Date(birthday);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var SetAssessmentYears = () => {
    /**/
    let yr = Number(new Date().getFullYear());
    var yOpts = "<option>Choose one</option>";
    for (let y = yr + 1; y >= yr; y--) {
        yOpts += `<option value="${y}">${y}</option>`;
    }
    /**/
    /**
    let yr = Number(new Date().getFullYear()) - 29;
    var yOpts = "<option>Choose one</option>";
    for (let y = yr + 28; y >= yr; y--) {
        yOpts += `<option value="${y}">${y}</option>`;
    }
    **/
    $("#AssessmentYear").html(yOpts);
    
}


// Load Marital Statuses
function GetMaritalStatus() {
    var dataModel = {
        CodeType: "MRS",
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.body.length > 0) {
            for (let i = 0; i < data.body.length; i++) {
                MaritalStatuses.push({
                    Id: data.body[i].id,
                    Description: data.body[i].description
                });
            }
            SetMaritalStatus();
        }
    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);
    });

}

var SetMaritalStatus = () => {
    var options = "<option value=''>Choose one</option>";
    for (let i = 0; i < MaritalStatuses.length; i++) {
        options += `<option value='${MaritalStatuses[i].Id}'>${MaritalStatuses[i].Description}</option>`;
    }
    //Select elements
    $("#PTRGeneralMarital, #PTRDependantMarital").html(options);
}

var FindItemFromList = (List, Id) => {
    let findItem = List.filter((newList) => newList.Id === Id);
    return findItem.length === 1 ? findItem[0] : null;
}

var FindItemsFromList = (List, Items) => {
    let findItems = List.filter((item) => Items.includes(item.Code));
    return findItems;
}

var InPTRApplicationsData = (id) => {
    let findItem = PTRApplicationsData.filter((newList) => newList.Type.Id === id);
    return findItem.length >= 1 ? findItem[0] : null;
}

$(".toProperNoun").bind("change, keyup", (el) => {
    let val = el.target;
    $(val).val($(val).val().toUpperCase())
});

// Load Application Types
var GetApplicationTypes = () => {

    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        CodeType: "APT",
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console

        // Empty list
        ApplicationTypes = [];
        PTRApplicationTypes = [];

        if (data.body && data.body.length > 0) {
            for (let i = 0; i < data.body.length; i++) {
                ApplicationTypes.push({
                    Id: data.body[i].id,
                    Code: data.body[i].code,
                    Description: data.body[i].description,
                    IsDev: ControlApplicationCodes.includes(data.body[i].code) ? false : true
                });
            }

            // Ensure we'r working with just PTR
            PTRApplicationTypes = FindItemsFromList(ApplicationTypes, StaticApplicationCodes);
            PTRApplicationTypes.sort((a, b) => (a.Code > b.Code) ? 1 : ((b.Code > a.Code) ? -1 : 0));

        }
        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);
        // Hide Preloader
        $('body').hideLoading();
    });
}

var SetApplicationTypes = () => {

}

var GetTaxPayerData = function() {

    // Show Preloader
    $('body').showLoading();

    // AutoPopulate
    $("#PTRTIN").val(nameTIN.TIN);
    $("#PTRName").val(nameTIN.Name);

    var dataModel = {
        TIN: nameTIN.TIN
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerData`;
    $.post(postUrl, postData, function (data, status) {
        // console.log('GetTaxPayerData Data: ', data);

        // Display on view
        if (data.status === "Successful") {
            // Keep object for future use.
            TaxPayerData = data.body;

            // AutoPopulate
            $("#PTRGeneralPhone").val(TaxPayerData.mobileNumber);
            $("#PTRGeneralEmail").val(TaxPayerData.emailAddress);

            ExtendTaxPayerData();

            // Hide Preloader
            $('body').hideLoading();
        }
    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
        // Hide Preloader
        $('body').hideLoading();
    });
}

var ExtendTaxPayerData = () => {

    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        TIN: nameTIN.TIN
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerEntityData`;
    $.post(postUrl, postData, function (data, status) {
        // console.log('GetTaxPayerData Data: ', data);

        // Display on view
        if (data.status === "Successful" && data.body && data.body.length > 0) {
            // Keep object for future use.
            TaxPayerData.maritalStatus = data.body[0].maritalStatus;
            TaxPayerData.mothersMaidenName = data.body[0].mothersMaidenName;
            TaxPayerData.age = data.body[0].age;
            TaxPayerData.gender = data.body[0].gender;
            TaxPayerData.dateOfBirth = data.body[0].dateOfBirth;

            // Set Current Age
            $("#PTRPensionCurrentAge").val(TaxPayerData.age);

            // Has Gender ?
            if (TaxPayerData.gender) {
                let genO = TaxPayerData.gender == "M" ?
                    `<option value="M">Male</option><option value="F">Female</option>` :
                    `<option value="F">Female</option><option value="M">Male</option>`;
                let genV = TaxPayerData.gender == "M" ? "Male" : "Female";
                $("#PTRGeneralGender").html(genO).prop("disabled", true).prop("hidden", true);
                $(`<input type="text" class="form-control" value="${genV}" disabled style="font-weight: 600">`).insertAfter("#PTRGeneralGender");
            }

            // Has DateOfBirth
            if (TaxPayerData.dateOfBirth) {
                $("#PTRGeneralBirthDate").val(TaxPayerData.dateOfBirth).prop("disabled", true).prop("hidden", true);
                $(`<input type="text" class="form-control" value="${TaxPayerData.dateOfBirth}" disabled style="font-weight: 600">`).insertAfter("#PTRGeneralBirthDate");
            }

            // Has MothersMaidenName
            if (TaxPayerData.mothersMaidenName) {
                $("#PTRGeneralMotherName").val(TaxPayerData.mothersMaidenName).prop("disabled", true);
            }

            // Has MothersMaidenName
            if (TaxPayerData.maritalStatus) {
                $("#PTRGeneralMarital option").filter(function () {
                    //may want to use $.trim in here
                    return $(this).text() == TaxPayerData.maritalStatus;
                }).prop('selected', true);
            }

            // Check for OldAge + Pension (x<=60)
            if (Number(TaxPayerData.age) <= 60) {
                // Disqualified
                DisqualifyApplicationCodes.push("APP0006");
                DisqualifyApplicationCodes.push("APP0008");
                //Controlled (To Avoid Duplicate)
                ControlApplicationCodes.push("APP0006");
                ControlApplicationCodes.push("APP0008");
            }
            
            // GetApplicationTypes
            GetApplicationTypes();

            // Hide Preloader
            $('body').hideLoading();
        }

    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
        // Hide Preloader
        $('body').hideLoading();
    });
}

// Set Periods Using Selected Year
var SetPeriodValues = function () {

    //
    AssessmentYear = $("#AssessmentYear").val();
    if (Number(AssessmentYear) >= 1990) {
        $(".SelectedYear").text(AssessmentYear)
        FromPeriod = new Date(`${AssessmentYear}-01-01`);
        ToPeriod = new Date(`${AssessmentYear}-12-31`);
        $("#FromPeriod").html(FromPeriod.toLocaleDateString("en-US", YearOptions));
        $("#ToPeriod").html(ToPeriod.toLocaleDateString("en-US", YearOptions));

        // Reset PTRApplicationType
        PTRApplicationType = {};

        // Get Applied by year
        GetPTRApplicationsByYear();


        // Get Relief Data
        GetDataResponsibilitiesData();
        GetChildrenEducationData();
        GetAgedDependantsData();

    } else {
        toastr.info("Please select a valid year.");
        ResetPeriod();
    }
}

var GetPTRApplicationsByYear = () => {
    PTRApplicationsData = [];
    PTRApplicationTypesApplied = [];
    PTRApplicationTypesUnApplied = [];
    PTRApplicationTypesDisqualify = [];

    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        TaxYear: AssessmentYear,
        TaxPayerId: nameTIN.Id
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetPTRApplicationsByYear`;
    $.post(postUrl, postData, function (data, status) {

        // Display on view
        if (data.status === "Successful" && data.body) {
            // Keep object for future use.
            for (let i = 0; i < data.body.length; i++) {
                PTRApplicationsData.push({
                    Id: data.body[i].applicationId,
                    Code: data.body[i].applicationNo,
                    Type: {
                        Id: data.body[i].applicationTypeId,
                        Code: data.body[i].applicationTypeCode,
                        Description: data.body[i].applicationType,
                    },
                    Status: {
                        Date: data.body[i].statusDate,
                        Description: data.body[i].status
                    },
                    Date: data.body[i].submittedDate
                });
            }
        }
        SetPTRSwitchBoard();

        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (response) {
        // Hide Preloader
        $('body').hideLoading();
    });
}

var SetPTRSwitchBoard = () => {
    PTRApplicationTypesUnApplied = [];
    PTRApplicationTypesApplied = [];
    PTRApplicationTypesDisqualify = [];

    // Show PTR Setup
    $("#YearPeriod").prop("hidden", false);
    $("#PageDataBody").prop("hidden", false);
    $("#btnResetPeriod").prop("hidden", false);

    var tblSwitchBoard = "", appliedCount = 0;
    for (let x = 0; x < PTRApplicationTypes.length; x++) {
        let AppliedData = InPTRApplicationsData(PTRApplicationTypes[x].Id);
        
        if (AppliedData && AppliedData.Id) {
            // Already Applied
            PTRApplicationTypesApplied.push(PTRApplicationTypes[x]);
            // Set SwitchBoard Table Rows with Applied List
            if (PTRApplicationTypes[x].IsDev) {
                appliedCount++;
                tblSwitchBoard +=
                    `<tr>
                        <td>${appliedCount}</th>
                        <td>${AppliedData.Type.Description}</th>
                        <td>${AppliedData.Date}</th>
                        <td>${AppliedData.Status.Description}</th>
                        <td>
                            <button onclick="ViewPTRApplication('${AppliedData.Id}')" class="btn btn-xs py-1 px-2 m-0" title="View Details"><i class="fa fa-file"></i></button>
                            <button onclick="PreviewPTRApplication('${AppliedData.Id}')" class="btn btn-xs py-1 px-2 m-0" title="Print Preview"><i class="fa fa-print"></i></button>
                        </td>
                    </tr>`;
            }
        } else {
            // Not Applied Yet
            PTRApplicationTypesUnApplied.push(PTRApplicationTypes[x]);
        };

        // Disqualified
        if (DisqualifyApplicationCodes.includes(PTRApplicationTypes[x].Code)) {
            PTRApplicationTypesDisqualify.push(PTRApplicationTypes[x]);
        }
    }
    $("#GridSetPTRApplications").html(tblSwitchBoard);


    $("#PageDataBody").prop("hidden", true);
    $("#PTRDetails").prop("hidden", true);
    $("#PTRSwitchBorad").prop("hidden", false);
}

$("#AddPTRApplication").bind("click", () => {
    AddPTRApplication();
})
var AddPTRApplication = () => {

    if ((PTRApplicationTypesUnApplied && PTRApplicationTypesUnApplied.length > 0) ||
        (PTRApplicationTypesApplied && PTRApplicationTypesApplied.length > 0)) {
        var checkBoxes = "";

        // Un-Applied
        for (let x = 0; x < PTRApplicationTypesUnApplied.length; x++) {
            if (PTRApplicationTypesUnApplied[x].IsDev) {
                checkBoxes +=
                    `<label class="row ml-3 mb-3 checkgroup">
                        ${PTRApplicationTypesUnApplied[x].Description}
                        <input type="checkbox" id="${PTRApplicationTypesUnApplied[x].Code}" onclick="PTRApplicationOK('${PTRApplicationTypesUnApplied[x].Id}')" />
                        <span class="checkmark"></span>
                    </label>`;
            }
        }
        
        // Applied
        for (let x = 0; x < PTRApplicationTypesApplied.length; x++) {
            if (PTRApplicationTypesApplied[x].IsDev) {
                checkBoxes +=
                    `<label class="row ml-3 mb-3 checkgroup" style="cursor:default;">
                        ${PTRApplicationTypesApplied[x].Description} &nbsp; <small class="text-primary">[Already applied for]</small>
                        <input type="checkbox" id="${PTRApplicationTypesApplied[x].Code}" checked="checked" disabled="disabled"/>
                        <span class="checkmark applied"></span>
                    </label>`;
            }
        }

        console.log({ PTRApplicationTypesDisqualify });
        // Disqualified
        for (let x = 0; x < PTRApplicationTypesDisqualify.length; x++) {
            checkBoxes +=
                `<label class="row ml-3 mb-3 checkgroup disqualified" style="cursor:default;">
                    ${PTRApplicationTypesDisqualify[x].Description} &nbsp; <small class="text-primary">[Applicant must be 60 years and above]</small>
                    <input type="checkbox" id="${PTRApplicationTypesDisqualify[x].Code}" disabled="disabled"/>
                    <span class="checkmark"></span>
                </label>`;
        }
        

        // Display
        $("#PTRApplicationCheckBoxes").html(checkBoxes);

        // Show PTR Setup Modal 
        $("#PTRSetupModal").modal("show");
    } else {
        toastr.info("Error loading relief types. Please try again.");
        SetPeriodValues();
    }
}

var ResetPeriod = function () {
    // Reset Options
    $("#FromPeriod").html("");
    $("#ToPeriod").html("");
    $("#YearPeriod").prop("hidden", true);
    $("#PageDataBody").prop("hidden", true);
    $("#PTRDetails").prop("hidden", true);
    $("#PTRSwitchBorad").prop("hidden", true);
    $("#btnResetPeriod").prop("hidden", true);
    $("#AssessmentYear").val($("#AssessmentYear option:first").val());
    $("#pgHeader").text("Personal Relief Application");
    ResetForm();
    ResetAllBrowseLabels();
}

var ResetForm = function () {

    // Hide All Tab Titles
    $("li[class*='Tabx']").prop('hidden', true);

    // Hide All Tab Contents
    $("div[class*='Cox']").prop('hidden', true);

    // Disable All TabList
    if (TabList && TabList.length > 0) {
        for (let j = 0; j < TabList.length; j++) {
            var tabId = TabList[j].TabId;
            var contentId = TabList[j].ContentId;
            $(`#${tabId}`).removeClass("active").addClass("disabled");
            $(`#${contentId}`).removeClass("active show");
        }
    }
}

// View PTR Application Details
var ViewPTRApplication = () => {
    $("#PageDataBody").prop("hidden", true);
    $("#PTRDetails").prop("hidden", false);
    $("#PTRSwitchBorad").prop("hidden", true);
}


// [Check which application is under focus]
// PTR Application
var PTRApplicationOK = () => {

    // Empty Application Types
    PTRApplicationTypesN = [];

    // Store PTR Types
    for (let w = 0; w < PTRApplicationTypesUnApplied.length; w++) {
        if ($(`#${PTRApplicationTypesUnApplied[w].Code}:checked`).val()) {
            let selType = FindItemFromList(PTRApplicationTypes, PTRApplicationTypesUnApplied[w].Id);
            PTRApplicationTypesN.push(selType);
        }
    }   
}

// Modal Dailog OK
var PTRSetUpOK = function () {
    // Reset Proccessing Application Types
    PTRApplicationTypesE = [];
    PTRApplicationTypesX = [];
    PTRApplicationTypesY = [];

    // console.log({ PTRApplicationTypesN });

    // Control CheckBox Elements
    if (!IsPeriodOK()) {
        toastr.error("Please select a valid year.");
    } else if (!(PTRApplicationTypesN && PTRApplicationTypesN.length > 0)) {
        toastr.error("Please select at least one Personal Relief.");
    } else {

        $("#PageDataBody").prop("hidden", false);
        $("#PTRDetails").prop("hidden", true);
        $("#PTRSwitchBorad").prop("hidden", true);

        // Hide Modal
        $("#PTRSetupModal").modal("hide");

        // Hide All Tab Titles
        $("li[class*='Tabx']").prop('hidden', true);

        // Hide All Tab Contents
        $("div[class*='Cox']").prop('hidden', true);

        // Reset Browse Labels
        ResetAllBrowseLabels();

        CurrentTabId = 0

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


        // Rebuild TabList Array
        BuildTabList();

        // Control Active Tab Elements
        ActivateTab();
        
    }
}


var ResetAllBrowseLabels = function () {
    // Reset all Browse Buttons Labels
    $("#BrowseMarCert").html(`<i class="fa fa-paperclip"></i> Attach Marriage Certificate`);
    $("#BrowseChildBirthCert").html(`<i class="fa fa-paperclip"></i> Attach Birth Certificate`);
    $("#BrowseChildAdm").html(`<i class="fa fa-paperclip"></i> Attach Adminission Letter`);
    $("#BrowseDependantCert").html(`<i class="fa fa-paperclip"></i> Attach Birth Certificate`);
    $("#BrowsePTRPensionBirth").html(`<i class="fa fa-paperclip"></i> Attach Birth Certificate`);
    $("#BrowsePTRDisabilityDoc").html(`<i class="fa fa-paperclip"></i> Attach Disability Document`);
    $("#BrowsePTRTrainingAdm").html(`<i class="fa fa-paperclip"></i> Attach Adminission Letter`);
}

// Modal Dialog Cancel
var PTRSetUpCancel = function () {
    // Show Reset Button
    $("#btnResetPeriod").removeAttr("hidden");
}


function IsPeriodOK() {
    if (FromPeriod != "" && FromPeriod != null && ToPeriod != "" && ToPeriod != null) {
        return true;
    }
    return false;
}

// Get PTR Application Type by Code.
var GetPTRTypeByCode = (list, code) => $.grep(list, (item) => item.Code === code)[0];


var CorrectDatePicker = (date) => {
    let splitz = date.includes("-") ? date.split("-") : date.includes("/") ? date.split("/") : [];
    return splitz.length === 3 ? `${splitz[2]}-${splitz[1]}-${splitz[0]}T00:00:00.000Z` : new Date(date);
}
var ResetDatePicker = (date) => {
    let flx = date.split("T");
    let pik = flx[0];
    let spl = pik.split("-");
    return `${spl[2]}-${spl[1]}-${spl[0]}`;
}

var GetAgeFromDate = (date, xDayMonth = false) => {
    
    if (xDayMonth) {
        // Exchange Day-Month Positions
        let xpt = [];
        if (date.includes("/")) {
            xpt = date.split("/");
        } else {
            xpt = date.split("-");
        }
        date = `${xpt[1]}/${xpt[0]}/${xpt[2]}`;
    }
    var dob = new Date(date);
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

