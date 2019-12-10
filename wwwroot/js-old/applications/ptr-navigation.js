

// Back Button Click
var MoveBack = function () {
    CurrentTabId = GetPreviousTab().Id;
    ActivateTab();
}

// Next Button Click
var MoveNext = function () {
    // Get CurrentTab Object  
    var CurrentTab = GetCurrentTab();

    //console.log({ CurrentTab });
    switch (CurrentTab.ContentId) {
        case "PTRApplicant": // Applicant
            ValidateApplicant();
            if (!DataCommon.ErrorMessage) {
                // All is good: Go to next tab
                CurrentTabId = GetNextTab().Id;
                ActivateTab();
            }
            break;
        case "PTRAPP0003": // Marriage
            if (MarriageOption === MarriageOptions.M) {
                ValidateMarriage();
                if (!DataMarriage.ErrorMessage) {
                    // All is good: Go to next tab
                    CurrentTabId = GetNextTab().Id;
                    ActivateTab();
                }
            } else {
                ValidateResponsibility();
                if (!DataResponsibility.ErrorMessage) {
                    // All is good: Go to next tab
                    CurrentTabId = GetNextTab().Id;
                    ActivateTab();
                }
            }
            break;
        case "PTRAPP0004": // Children
            ValidateChildren();
            if (!DataChildren.ErrorMessage) {
                // All is good: Go to next tab
                CurrentTabId = GetNextTab().Id;
                ActivateTab();
            }
            break;
        case "PTRAPP0008": // Old Age
            ValidateOldAge();
            if (!DataOldAge.ErrorMessage) {
                // All is good: Go to next tab
                CurrentTabId = GetNextTab().Id;
                ActivateTab();
            }
            break;
        case "PTRAPP0005": // Dependants
            ValidateDependants();
            if (!DataDependants.ErrorMessage) {
                // All is good: Go to next tab
                CurrentTabId = GetNextTab().Id;
                ActivateTab();
            }
            break;
        case "PTRAPP0007": // Disability
            ValidateDisability();
            if (!DataDisability.ErrorMessage) {
                // All is good: Go to next tab
                CurrentTabId = GetNextTab().Id;
                ActivateTab();
            }
            break;
        case "PTRAPP0006": // Pension
            ValidatePension();
            if (!DataPension.ErrorMessage) {
                // All is good: Go to next tab
                CurrentTabId = GetNextTab().Id;
                ActivateTab();
            }
            break;
        case "PTRAPP0009": // Assurance
            ValidateAssurance();
            if (!DataAssurance.ErrorMessage) {
                // All is good: Go to next tab
                CurrentTabId = GetNextTab().Id;
                ActivateTab();
            }
            break;
        case "PTRAPP0010": // Social
            ValidateSocial();
            if (!DataSocial.ErrorMessage) {
                // All is good: Go to next tab
                CurrentTabId = GetNextTab().Id;
                ActivateTab();
            }
            break;
        case "PTRAPP0011": // Applicant's Details
            ValidateTraining();
            if (!DataTraining.ErrorMessage) {
                // All is good: Go to next tab
                CurrentTabId = GetNextTab().Id;
                ActivateTab();
            }
            break;
    }
}


// Activate the Current Tab
function ActivateTab() {
    // console.log(TabList.length);

    if (TabList && TabList.length > 0) {
        // Disable All TabList
        for (let j = 0; j < TabList.length; j++) {
            var tabId = TabList[j].TabId;
            var contentId = TabList[j].ContentId;
            $(`#${tabId}`).removeClass("active").addClass("disabled");
            $(`#${contentId}`).removeClass("active show");
        }

        // Hide All Buttons
        $("#rowBack").prop('hidden', true);
        $("#rowBackNext").prop('hidden', true);
        $("#rowNext").prop('hidden', true);

        // Get CurrentTab Object  
        var CurrentTab = GetCurrentTab();

        // Activate the tab with CurrentTabId
        $(`#${CurrentTab.TabId}`).addClass("active").removeClass("disabled");
        $(`#${CurrentTab.ContentId}`).addClass("active show");

        // Control Active Tab Elements [Buttons]
        $("#SubmitPTRApplication").prop("disabled", true).prop("hidden", true);
        $("#SaveContinuePTRApplication").prop("disabled", true).prop("hidden", true);
        if (CurrentTabId === GetFirstTab().Id) {
            $("#rowNext").removeAttr("hidden");
        } else if (CurrentTabId === GetLastTab().Id) {
            $("#rowBack").removeAttr("hidden");
            $("#SubmitPTRApplication").prop("disabled", false).prop("hidden", false);
            $("#SaveContinuePTRApplication").prop("disabled", true).prop("hidden", true);
        } else {
            $("#rowBackNext").removeAttr("hidden");
            $("#SaveContinuePTRApplication").prop("disabled", false).prop("hidden", false);
            $("#SubmitPTRApplication").prop("disabled", true).prop("hidden", true);
        }

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

function GetTabByContentId(contentId = "PTRApplicant") {
    // Get CurrentTab Object [DEFAULT to ApplicantTab]
    var CurrentTab = TabList.filter(obj => {
        return obj.ContentId === contentId
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
var BuildTabList = function () {

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

    // console.log({ TabList });
    return TabList;
}


// Get Checked Tab Titles
function GetCheckedTabs() {
    var sources = [];

    for (let y = 0; y < PTRApplicationTypesN.length; y++) {
        sources.push(`.Tabx${PTRApplicationTypesN[y].Code}`);
    }
    sources.push(".TabxAll");

    return sources.join(", ");
}

// Get Checked Tab Contents
function GetCheckedContents() {
    var sources = [];

    for (let z = 0; z < PTRApplicationTypesN.length; z++) {
        sources.push(`.Cox${PTRApplicationTypesN[z].Code}`);
    }
    // sources.push(`.Cox${PTRApplicationType.Code}`);
    sources.push(".CoxAll");

    return sources.join(", ");
}

