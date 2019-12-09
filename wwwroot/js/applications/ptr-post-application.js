
/* ====================================================
 *       SAVE & CONTINUE [OR] SUBMIT PTR APPLICATION
 * ===================================================*/
// Define Save or Submit Options
var SaveOrSubmitOptions = {
    Save: "Save",
    Submit: "Submit"
};
// Set {DEFAULT} Save or Submit Option to {SUBMIT}
var SaveOrSubmitOption = SaveOrSubmitOptions.Submit;

// Save & Conitnue Button Clicked
var SavePTRApplication = () => {
    SaveOrSubmitOption = SaveOrSubmitOptions.Save;
    PostPTRApplication();
}

// Submit Button Clicked [Resort to {DEFAULT}={SUBMIT}]
var PostPTRApplication = () => {

    // Validate Common Data
    ValidateApplicant();

    // Are We Good to go?
    if (PTRApplicationTypesN && PTRApplicationTypesN.length > 0 && !DataCommon.ErrorMessage) {

        // Get Form Data
        BuildApplicationsData();

    }

    // If there are no errors
    if (!ReliefApplicationsData.ErrorMessage) {

        // Was it Save&Continue OR Submit
        if (SaveOrSubmitOption === SaveOrSubmitOptions.Save) {
            SubmitPTRApplication();
        } else {
            GetTCCDecalaration();
        }
    }

}


//Declaration
var GetTCCDecalaration = () => {
    //Open Declaration
    var CurrentUserTIN = $("#UserTIN").text();
    var ActiveTaxPayerTIN = nameTIN.TIN;
    $("#DeclarationAssociateX").prop("hidden", true);
    if (CurrentUserTIN != ActiveTaxPayerTIN) {
        $("#DeclarationAssociateX").removeAttr("hidden");
        $("#DeclarationAssociateNameX").html(nameTIN.Name);
    }

    $("#PTRDeclarationModal").modal('show');
}

var SetTCCDecalaration = () => {
    if ($("#VerifiedX").prop("checked") == true) {
        $("#PTRDeclarationModal").modal('hide');
        SubmitPTRApplication();
    } else {
        toastr.info("You must read accept the declaration to proceed.");
    }
}

var SubmitPTRApplication = () => {
    console.log({ ReliefApplicationsData });

    // Show Preloader
    $('body').showLoading();

    // Prepare POST data
    var postData = JSON.stringify(ReliefApplicationsData);

    // Call Local API
    $.post(`?handler=PostApplicationsPTR`, postData, function (data, status) {
        // Check for errors
        CheckPTRApplicationErrors(data);
        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (res) {
        // Hide Preloader
        $('body').hideLoading();
    });

}

var CheckPTRApplicationErrors = (data) => {
    // console.log({ data });

    // Marriage Relief
    var TypeMarriage = GetPTRTypeByCode(PTRApplicationTypesN, "APP0003");
    if (TypeMarriage && MarriageOption === MarriageOptions.M) {
        if (data.marriage && data.marriage.status === "Successful") {
            PTRApplicationTypesX.push(TypeMarriage);
        } else {
            PTRApplicationTypesY.push(TypeMarriage);
        }
    }

    // Responsibility Relief
    var TypeResponsibility = GetPTRTypeByCode(PTRApplicationTypes, "APP0003");
    if (TypeMarriage && MarriageOption === MarriageOptions.R) {
        if (data.responsibility && data.responsibility.status === "Successful") {
            PTRApplicationTypesX.push(TypeResponsibility);
        } else {
            PTRApplicationTypesY.push(TypeResponsibility);
        }
    }



    // Children Education
    var TypeChildren = GetPTRTypeByCode(PTRApplicationTypesN, "APP0004");
    if (TypeChildren) {
        if (data.children && data.children.status === "Successful") {
            PTRApplicationTypesX.push(TypeChildren);
        } else {
            PTRApplicationTypesY.push(TypeChildren);
        }
    }

    // Old Age
    var TypeOldAge = GetPTRTypeByCode(PTRApplicationTypesN, "APP0008");
    if (TypeOldAge) {
        if (data.oldAge && data.oldAge.status === "Successful") {
            PTRApplicationTypesX.push(TypeOldAge);
        } else {
            PTRApplicationTypesY.push(TypeOldAge);
        }
    }

    // Aged Dependants
    var TypeDependants = GetPTRTypeByCode(PTRApplicationTypesN, "APP0005");
    if (TypeDependants) {
        if (data.dependants && data.dependants.status === "Successful") {
            PTRApplicationTypesX.push(TypeDependants);
        } else {
            PTRApplicationTypesY.push(TypeDependants);
        }
    }

    // Disability
    var TypeDisability = GetPTRTypeByCode(PTRApplicationTypesN, "APP0007");
    if (TypeDisability) {
        if (data.disability && data.disability.status === "Successful") {
            PTRApplicationTypesX.push(TypeDisability);
        } else {
            PTRApplicationTypesY.push(TypeDisability);
        }
    }

    // Voluntary Pension
    var TypePension = GetPTRTypeByCode(PTRApplicationTypesN, "APP0006");
    if (TypePension) {
        if (data.pension && data.pension.status === "Successful") {
            PTRApplicationTypesX.push(TypePension);
        } else {
            PTRApplicationTypesY.push(TypePension);
        }
    }


    // Life Assurance
    var TypeAssurance = GetPTRTypeByCode(PTRApplicationTypesN, "APP0009");
    if (TypeAssurance) {
        if (data.assurance && data.assurance.status === "Successful") {
            PTRApplicationTypesX.push(TypeAssurance);
        } else {
            PTRApplicationTypesY.push(TypeAssurance);
        }
    }

    // Social Security
    var TypeSocial = GetPTRTypeByCode(PTRApplicationTypesN, "APP0010");
    if (TypeSocial) {
        if (data.social && data.social.status === "Successful") {
            PTRApplicationTypesX.push(TypeSocial);
        } else {
            PTRApplicationTypesY.push(TypeSocial);
        }
    }

    // Cost of Training
    var TypeTraining = GetPTRTypeByCode(PTRApplicationTypesN, "APP0011");
    if (TypeTraining) {
        if (data.training && data.training.status === "Successful") {
            PTRApplicationTypesX.push(TypeTraining);
        } else {
            PTRApplicationTypesY.push(TypeTraining);
        }
    }


    // Check if any error exists
    if (PTRApplicationTypesY && PTRApplicationTypesY.length > 0) {
        // Errors exist - Go and correct them.
        toastr.info("Some of your applications could not be submitted. Please check and try again.");
        RestartPTRApplicationProcess();
    } else {
        // No errors - API returns success
        toastr.success("Your applications has been submitted successfully.");

        // Was it Save&Continue OR Submit
        if (SaveOrSubmitOption === SaveOrSubmitOptions.Submit) {
            // It Was Submit : All is done, go back to Applications main page
            setTimeout(function () { window.location = `${AppServerUrl}/applications`; }, 1000); //1000 means 1 secs
        } else {
            // It Was Save&Continue : Move to next tab
            MoveNext();
        }
    }

}

var RestartPTRApplicationProcess = () => {

    // [Error] + [Failed] is the [New] Application Types array
    PTRApplicationTypesN = PTRApplicationTypesY;

    // Empty the rest of the Application Types array
    PTRApplicationTypesE = [];
    PTRApplicationTypesX = [];
    PTRApplicationTypesY = [];

    // Hide All Tab Titles
    $("li[class*='Tabx']").prop('hidden', true);

    // Hide All Tab Contents
    $("div[class*='Cox']").prop('hidden', true);


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

    // Move To Page 2
    MoveNext();
}

