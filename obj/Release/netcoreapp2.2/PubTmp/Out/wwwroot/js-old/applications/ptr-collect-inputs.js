
/* ======================================
 *       APPLICANT'S DETAILS
 * =====================================*/

var GetPTREmployerDetails = () => {
    let employerTIN = $("#PTRGeneralEmployerTIN").val();
    if (employerTIN.length === 11) { // Just TIN
        // Show Preloader
        $('body').showLoading();

        IsTINOK = true;
        var dataModel = {
            TIN: employerTIN
        };

        var postData = JSON.stringify(dataModel);

        // Call Local API
        var postUrl = `?handler=GetTaxPayerEntityData`;
        $.post(postUrl, postData, function (data, status) {
            // console.log('GetTaxPayerData Data: ', data);

            // Hide Preloader
            $('body').hideLoading();

            // Display on view
            if (data.status === "Successful" && data.body) {
                // Keep object for future use.
                let Emp = data.body[0];
                $("#PTRGeneralEmployerTIN");
                $("#PTRGeneralEmployerName").val(Emp.entityName);
                $("#PTRGeneralEmployerPhone").val(Emp.phoneNo);
                $("#PTRGeneralEmployerEmail").val(Emp.emailAddress.toLowerCase());
                SetAsIntlTelInputField(PTRGeneralEmployerPhone);
                $("#PTRGeneralEmployerPhone").focus();
            } else {
                // Control layout
                $("#PTRGeneralEmployerTIN").val("").prop("disabled", false).focus();
                $("#PTRGeneralEmployerName, #PTRGeneralEmployerPhone, #PTRGeneralEmployerEmail").val("");
                toastr.info("The Employer's TIN you entered did not match any of our records. Please check and try again.");
            }
        }).fail(function (response) {
            // Hide Preloader
            $('body').hideLoading();

            // Control layout
            $("#PTRGeneralEmployerTIN").val("").prop("disabled", false).focus();
            $("#PTRGeneralEmployerName, #PTRGeneralEmployerPhone, #PTRGeneralEmployerEmail").val("");
            toastr.info("An error occured. Please try again.");
        });
    } else {
        $("#PTRGeneralEmployerTIN").val("").prop("disabled", false).focus();
        $("#PTRGeneralEmployerName, #PTRGeneralEmployerPhone, #PTRGeneralEmployerEmail").val("");
        toastr.info("The Employer's TIN you entered is not valid. Please check and try again.");
    }
}

var GetPTRSpouseDetails = () => {
    let spouseTIN = $("#PTRSpouseTIN").val();
    if (spouseTIN.length === 11) { // Just TIN
        // Show Preloader
        $('body').showLoading();

        IsTINOK = true;
        var dataModel = {
            TIN: spouseTIN
        };

        var postData = JSON.stringify(dataModel);

        // Call Local API
        var postUrl = `?handler=GetTaxPayerEntityData`;
        $.post(postUrl, postData, function (data, status) {
            // console.log({ data });

            // Hide Preloader
            $('body').hideLoading();

            // Display on view
            if (data.status === "Successful" && data.body) {
                // Keep object for future use.
                let Emp = data.body[0];
                $("#PTRSpouseTIN");
                $("#PTRSpouseFirstName").val(Emp.firstName);
                $("#PTRSpouseMiddleName").val(Emp.middleName);
                $("#PTRSpouseLastName").val(Emp.lastName);
                $("#PTRSpouseFullName").val(Emp.entityName);
                $("#PTRSpousePhone").val(Emp.phoneNo);
                $("#PTRSpouseEmail").val(Emp.emailAddress.toLowerCase());
                $("#PTRSpouseBirthDate").val(Emp.dateOfBirth);

                var gen = Emp.gender === "M" ? `<option value="M">Male</option><option value="F">Female</option>` :
                    Emp.gender === "F" ? `<option value="F">Female</option><option value="M">Male</option>` :
                        `<option value="">Choose one</option><option value="M">Male</option><option value="F">Female</option>`;
                $("#PTRSpouseGender").html(gen);

                SetAsIntlTelInputField(PTRSpousePhone);
                $("#PTRSpousePhone").focus();

            } else {
                // Control layout
                $("#PTRSpouseTIN").val("").prop("disabled", false).focus();
                $("#PTRSpouseFullName, #PTRSpousePhone, #PTRSpouseEmail").val("");
                toastr.info("The Spouse's TIN you entered did not match any of our records. Please check and try again.");
            }
        }).fail(function (response) {
            // Hide Preloader
            $('body').hideLoading();

            // Control layout
            $("#PTRSpouseTIN").val("").prop("disabled", false).focus();
            $("#PTRSpouseFullName, #PTRSpousePhone, #PTRSpouseEmail").val("");
            toastr.info("An error occured. Please try again.");
        });
    } else {
        $("#PTRSpouseTIN").val("").prop("disabled", false).focus();
        $("#PTRSpouseFullName, #PTRSpousePhone, #PTRSpouseEmail").val("");
        toastr.info("The Spouse's TIN you entered is not valid. Please check and try again.");
    }
}


/* ======================================
 *       MARRIAGE REFLIEF
 * =====================================*/
var MarriageCertificate = {},
    MarriageOptions = {
        M: "M",
        R: "R"
    }, MarriageOption = {};

var MarriageOptionM = () => {
    $("#ROption").prop("hidden", true);
    $("#MOption").prop("hidden", false);

    // Check
    $("#MOpt").prop("checked", true);

    // Uncheck
    $("#ROpt").prop("checked", false);

    //Set Value
    MarriageOption = MarriageOptions.M;
}

var MarriageOptionR = () => {
    $("#ROption").prop("hidden", false);
    $("#MOption").prop("hidden", true);

    // Uncheck
    $("#MOpt").prop("checked", false);

    // Check
    $("#ROpt").prop("checked", true);

    //Set Value
    MarriageOption = MarriageOptions.R;
}

// Trigger [Files Attachment Module]
var AttachMarriageCertificate = () => {
    // Open File Browser
    $("#MarriageCertificate").trigger("click");
}

var BrowseMarriageCertificate = (el) => {
    // Show Preloader
    $('body').showLoading();

    // Reset AttachmentFiles to Empty
    AttachmentFiles = [];
    AttachmentFiles.length = 0;
    for (let j = 0; j < el.files.length; j++) {
        // Convert file to base64
        GetEncodedAttachmentFile(el.files[j]);
    }
    setTimeout(function () {
        //If any valid files
        if (AttachmentFiles && AttachmentFiles.length > 0) {
            // Get First Object
            MarriageCertificate = AttachmentFiles[0];
            $("#BrowseMarCert").html(`<i class="fa fa-paperclip"></i> [1] File Attached`);
            OpenAttachedDocument(MarriageCertificate.Data);
        }

        // Hide Preloader
        $('body').hideLoading();
    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

}


/* ======================================
 *       MARRIAGE DEPENDENT REFLIEF
 * =====================================*/
var ResponsibilityBirthCertificate = {};

var GetDataResponsibilitiesData = () => {
    DataResponsibilities = [];
    SetDataResponsibilitiesData();
}

var SetDataResponsibilitiesData = () => {
    // console.log({ MarriageDependantsData });

    // Populate Table
    var dependTable = "";
    for (let c = 0; c < DataResponsibilities.length; c++) {
        let age = GetCurrentAge(DataResponsibilities[c].RespDateOfBirth);
        let gender = DataResponsibilities[c].RespGender === "F" ? "Female" : "Male";
        let dob = DataResponsibilities[c].RespDateOfBirth ? ResetDatePicker(DataResponsibilities[c].RespDateOfBirth) : "";
        dependTable +=
            `<tr>
                <td class="py-0 pl-2">${c + 1}</td>
                <td class="py-0 pl-2">${DataResponsibilities[c].FirstName} ${DataResponsibilities[c].MiddleName} ${DataResponsibilities[c].LastName}</td>
                <td class="py-0 pl-2">${dob}</td>
                <td class="py-0 pl-2">${age}</td>
                <td class="py-0 pl-2">${gender}</td>
                <td class="text-center py-0">
                    <button onclick="OpenMarriageDependant('${DataResponsibilities[c].Id}')" class="btn btn-xs py-1 px-2 m-0"><i class="fa fa-edit"></i></button>
                </td>
            </tr>`;
    }
    $("#GridMarriageDependents").html(dependTable);
}

var OpenMarriageDependant = (id) => {
    let getResponsibility = DataResponsibilities.filter(responsibility => {
        return responsibility.Id === id
    })

    DataResponsibility = getResponsibility[0];
    if (DataResponsibility && DataResponsibility.FirstName) {
        $("#PTRMarriageDependantFirstName").val(DataResponsibility.FirstName);
        $("#PTRMarriageDependantMiddleName").val(DataResponsibility.MiddleName);
        $("#PTRMarriageDependantLastName").val(DataResponsibility.LastName);
        $("#PTRMarriageDependantBirthDate").val(ResetDatePicker(DataResponsibility.DateOfBirth));
        let gen = `<option value="M">Male</option><option value="F">Female</option>`;
        if (DataResponsibility.Gender === "F") {
            gen = `<option value="F">Female</option><option value="M">Male</option>`;
        }
        $("#PTRMarriageDependantGender").html(gen);
        $("#PTRMarriageDependantNumber").val(DataResponsibility.BirthCertIssueNo);
        $("#PTRMarriageDependantIssuedOn").val(ResetDatePicker(DataResponsibility.BirthCertIssueDate));
        $("#PTRMarriageDependantIssuedBy").val(DataResponsibility.BirthCertIssuedBy);
        $("#PTRMarriageDependantSignedBy").val(DataResponsibility.BirthCertSignedBy);
    }
    $("#PTRMarriageDependantModal").modal("show");
}

var AddMarriageDependent = () => {
    ResetResponsibilityForm();

    $("#PTRMarriageDependantModal").modal("show");
}

var ResetResponsibilityForm = () => {

    // Empty Responsibility
    DataResponsibility = {};

    // Clear Form
    $("#PTRMarriageDependantFirstName").val("");
    $("#PTRMarriageDependantMiddleName").val("");
    $("#PTRMarriageDependantLastName").val("");
    $("#PTRMarriageDependantBirthDate").val("");
    $("#PTRMarriageDependantGender").html(`<option value="">Choose one</option><option value="M">Male</option><option value="F">Female</option>`);

    $("#PTRMarriageDependantNumber").val("");
    $("#PTRMarriageDependantIssuedOn").val("");
    $("#PTRMarriageDependantIssuedBy").val("");
    $("#PTRMarriageDependantSignedBy").val("");
    $("#BrowseMarriageDependantCert").html(`<i class="fa fa-paperclip"></i> Attach Birth Certificate`);
}

var BrowseResponsibilityBirthCertificate = () => {
    // Open File Browser
    $("#PTRResponsibilityBirthCertificate").trigger("click");
}

var GetResponsibilityBirthCertificate = (el) => {
    // Show Preloader
    $('body').showLoading();

    // Reset AttachmentFiles to Empty
    AttachmentFiles = [];
    AttachmentFiles.length = 0;
    for (let j = 0; j < el.files.length; j++) {
        // Convert file to base64
        GetEncodedAttachmentFile(el.files[j]);
    }
    setTimeout(function () {
        //If any valid files
        if (AttachmentFiles && AttachmentFiles.length > 0) {
            // Get First Object
            ResponsibilityBirthCertificate = AttachmentFiles[0];
            $("#BrowseMarriageDependantCert").html(`<i class="fa fa-paperclip"></i> [1] File Attached`);
            OpenAttachedDocument(ResponsibilityBirthCertificate.Data);
        }

        // Hide Preloader
        $('body').hideLoading();
    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

}

var SaveResponsibilityDetails = () => {

    // Get form details
    ValidateResponsibility();

    // No Errors
    if (!DataResponsibility.ErrorMessage) {
        // Store Data
        var iResponsibility = DataResponsibilities.findIndex(Responsibility => Responsibility.Id === DataResponsibility.Id);
        if (DataResponsibilities[iResponsibility]) {
            DataResponsibilities[iResponsibility] = DataResponsibility;
        } else {
            DataResponsibilities.push(DataResponsibility);
        }

        // Clear Form
        ResetResponsibilityForm();

        // Hide Modal
        $("#PTRMarriageDependantModal").modal("hide");

        // Set Data in Table
        SetDataResponsibilitiesData();
    }
}

/* ======================================
 *       CHILD EDUCATION REFLIEF
 * =====================================*/
var ChildBirthCertificate = {}, ChildAdmissionLetter = {};
var GetChildrenEducationData = () => {
    DataChildren = [];
    SetChildrenEducationData();
}

var SetChildrenEducationData = () => {

    // Populate Table
    var childrenTable = "";
    for (let c = 0; c < DataChildren.length; c++) {
        let admDate = DataChildren[c].AdmissionDate ? ResetDatePicker(DataChildren[c].AdmissionDate) : "";
        let brnDate = DataChildren[c].ChildDateOfBirth ? ResetDatePicker(DataChildren[c].ChildDateOfBirth) : "";
        childrenTable += `
            <tr>
                <td class="py-0 pl-2">${c + 1}</td>
                <td class="py-0 pl-2">${DataChildren[c].ChildFirstName} ${DataChildren[c].ChildMiddleName} ${DataChildren[c].ChildLastName}</td>
                <td class="py-0 pl-2">${brnDate}</td>
                <td class="py-0 pl-2">${DataChildren[c].SchoolName}</td>
                <td class="py-0 pl-2">${admDate}</td>
                <td class="text-center py-0">
                    <button onclick="OpenChildDetails('${DataChildren[c].Id}')" class="btn btn-xs py-1 px-2 m-0"><i class="fa fa-edit"></i></button>
                </td>
            </tr>`;
    }
    $("#GridChildrenReliefDtails").html(childrenTable);
}

var AddChildDetails = () => {
    // Reset Child Form
    ResetChildForm();

    // Close all accordions
    $('.accordion__title').each(function () {
        $(this).removeClass("active");
    });
    $('.accordion__content').each(function () {
        $(this).css("display", "none");;
    });

    // Open the topmost active accordion
    $(".first_accordion_title").addClass("active");
    $(".first_accordion_body").css("display", "block");

    // Show Modal
    $("#ChildDetailsModal").modal("show");
}

var ResetChildForm = () => {
    // Empty Child
    DataChild = {};

    // Reset Child Form
    $("#PTRChildFirstName").val("");
    $("#PTRChildMiddleName").val("");
    $("#PTRChildLastName").val("");
    $("#PTRChildBirthDate").val("");
    $("#PTRChildBirthCertIssueNumber").val("");
    $("#PTRChildBirthCertIssuedOn").val("");
    $("#PTRChildBirthCertIssuedBy").val("");
    $("#PTRChildBirthCertSignedBy").val("");
    $("#PTRChildSchoolName").val("");
    $("#PTRChildAdmissionDate").val("");
    $("#PTRChildAdmissionRefNo").val("");
    $("#BrowseChildBirthCert").html(`<i class="fa fa-paperclip"></i> Attach Birth Certificate`);
    $("#BrowseChildAdm").html(`<i class="fa fa-paperclip"></i> Attach Admission Letter`);
}

var OpenChildDetails = (id) => {
    let getChild = DataChildren.filter(child => {
        return child.Id === id
    })

    DataChild = getChild[0];
    if (DataChild && DataChild.ChildFirstName) {
        $("#PTRChildFirstName").val(DataChild.ChildFirstName);
        $("#PTRChildMiddleName").val(DataChild.ChildMiddleName);
        $("#PTRChildLastName").val(DataChild.ChildLastName);
        $("#PTRChildBirthDate").val(ResetDatePicker(DataChild.ChildDateOfBirth));
        $("#PTRChildBirthCertIssueNumber").val(DataChild.BirthCertIssueNo);
        $("#PTRChildBirthCertIssuedOn").val(ResetDatePicker(DataChild.BirthCertIssueDate));
        $("#PTRChildBirthCertIssuedBy").val(DataChild.BirthCertIssueBy);
        $("#PTRChildBirthCertSignedBy").val(DataChild.BirthCertSignedBy);
        $("#PTRChildSchoolName").val(DataChild.SchoolName);
        $("#PTRChildAdmissionDate").val(ResetDatePicker(DataChild.AdmissionDate));
        $("#PTRChildAdmissionRefNo").val(DataChild.AdmissionLetterRefNo);

        $("#BrowseChildBirthCert, #BrowseChildAdm").html(`<i class="fa fa-paperclip"></i> [1] File Attached`);
    }

    // Close all accordions
    $('.accordion__title').each(function () {
        $(this).removeClass("active");
    });
    $('.accordion__content').each(function () {
        $(this).css("display", "none");;
    });

    // Open the topmost active accordion
    $(".first_accordion_title").addClass("active");
    $(".first_accordion_body").css("display", "block");

    // Show Modal
    $("#ChildDetailsModal").modal("show");
}

var BrowseChildBirthCertificate = () => {
    // Open File Browser
    $("#PTRChildBirthCertificate").trigger("click");
}

// Receive [File Attachment Module] Results
var GetChildBirthCertificate = (el) => {
    // Show Preloader
    $('body').showLoading();

    // Reset AttachmentFiles to Empty
    AttachmentFiles = [];
    AttachmentFiles.length = 0;
    for (let j = 0; j < el.files.length; j++) {
        // Convert file to base64
        GetEncodedAttachmentFile(el.files[j]);
    }
    setTimeout(function () {
        //If any valid files
        if (AttachmentFiles && AttachmentFiles.length > 0) {
            // Get First Object
            ChildBirthCertificate = AttachmentFiles[0];
            $("#BrowseChildBirthCert").html(`<i class="fa fa-paperclip"></i> [1] File Attached`);
            OpenAttachedDocument(ChildBirthCertificate.Data);
        }

        // Hide Preloader
        $('body').hideLoading();
    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

}

var BrowseChildAdmissionLetter = () => {
    // Open File Browser
    $("#PTRChildAdmissionLetter").trigger("click");
}

var GetChildAdmissionLetter = (el) => {
    // Show Preloader
    $('body').showLoading();

    // Reset AttachmentFiles to Empty
    AttachmentFiles = [];
    AttachmentFiles.length = 0;
    for (let j = 0; j < el.files.length; j++) {
        // Convert file to base64
        GetEncodedAttachmentFile(el.files[j]);
    }
    setTimeout(function () {
        //If any valid files
        if (AttachmentFiles && AttachmentFiles.length > 0) {
            // Get First Object
            ChildAdmissionLetter = AttachmentFiles[0];
            $("#BrowseChildAdm").html(`<i class="fa fa-paperclip"></i> [1] File Attached`);
            OpenAttachedDocument(ChildAdmissionLetter.Data);
        }

        // Hide Preloader
        $('body').hideLoading();
    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

}

var SaveChildDetails = () => {

    // Get form details
    ValidateChild();

    // No Errors
    if (!DataChild.ErrorMessage) {
        // Store Data
        var iChild = DataChildren.findIndex(Child => Child.Id === DataChild.Id);
        if (DataChildren[iChild]) {
            DataChildren[iChild] = DataChild;
        } else {
            DataChildren.push(DataChild);
        }

        // Clear Form
        ResetChildForm();

        // Hide Modal
        $("#ChildDetailsModal").modal("hide");

        // Set Data in Table
        SetChildrenEducationData();
    }
}


/* ======================================
 *       OLD AGE REFLIEF
 * =====================================*/
var OldAgeBirthCertificate = {};
var BrowseOldAgeBirthCertificate = () => {
    // Open File Browser
    $("#OldAgeBirthCertificate").trigger("click");
}
var GetOldAgeBirthCertificate = (el) => {
    // Show Preloader
    $('body').showLoading();

    // Reset AttachmentFiles to Empty
    AttachmentFiles = [];
    AttachmentFiles.length = 0;
    for (let j = 0; j < el.files.length; j++) {
        // Convert file to base64
        GetEncodedAttachmentFile(el.files[j]);
    }
    setTimeout(function () {
        //If any valid files
        if (AttachmentFiles && AttachmentFiles.length > 0) {
            // Get First Object
            OldAgeBirthCertificate = AttachmentFiles[0];

            $("#OldAgeFileName").text(OldAgeBirthCertificate.Name);
            $("#OldAgeFileSize").text(OldAgeBirthCertificate.Size);
            $("#OldAgeFileType").text(OldAgeBirthCertificate.Type);

            OpenAttachedDocument(OldAgeBirthCertificate.Data);
        }

        // Hide Preloader
        $('body').hideLoading();
    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

}


/* ======================================
 *       AGED DEPENDANT REFLIEF
 * =====================================*/
var DependantCertificate = {};
var GetAgedDependantsData = () => {
    DataDependants = [];
    SetAgedDependantsData();
}

var SetAgedDependantsData = () => {

    // Populate Table
    var dependantsTable = "";
    for (let c = 0; c < DataDependants.length; c++) {
        var mStatus = FindItemFromList(MaritalStatuses, DataDependants[c].MaritalStatus);
        var gen = DataDependants[c].Gender === "M" ? "Male" : "Female";
        var dob = DataDependants[c].DateOfBirth ? ResetDatePicker(DataDependants[c].DateOfBirth) : "";
        dependantsTable +=
            `<tr>
                <td class="py-0 pl-2">${c + 1}</td>
                <td class="py-0 pl-2">${DataDependants[c].FirstName} ${DataDependants[c].MiddleName} ${DataDependants[c].LastName}</td>
                <td class="py-0 pl-2">${dob}</td>
                <td class="py-0 pl-2">${gen}</td>
                <td class="py-0 pl-2">${mStatus.Description}</td>
                <td class="text-center py-0">
                    <button onclick="OpenDependantDetails('${DataDependants[c].Id}')" class="btn btn-xs py-1 px-2 m-0"><i class="fa fa-edit"></i></button>
                </td>
            </tr>`;
    }
    $("#GridDependantReliefDtails").html(dependantsTable);
}

var OpenDependantDetails = (id) => {
    let getDependant = DataDependants.filter(dependant => {
        return dependant.Id === id
    })

    DataDependant = getDependant[0];

    if (DataDependant && DataDependant.FirstName) {
        let dob = DataDependant.DateOfBirth ? ResetDatePicker(DataDependant.DateOfBirth) : "";
        let doc = DataDependant.BirthCertIssueDate ? ResetDatePicker(DataDependant.BirthCertIssueDate) : "";

        $("#PTRDependantFirstName").val(DataDependant.FirstName);
        $("#PTRDependantMiddleName").val(DataDependant.MiddleName);
        $("#PTRDependantLastName").val(DataDependant.LastName);
        $("#PTRDependantBirthDate").val(dob);
        let gen = `<option value="M">Male</option><option value="F">Female</option>`;
        if (DataDependant.Gender === "F") {
            gen = `<option value="F">Female</option><option value="M">Male</option>`;
        }
        $("#PTRDependantGender").html(gen);
        $(`#PTRDependantMarital option[value="${DataDependant.MaritalStatus}"]`).attr("selected", true);
        $("#PTRDependantNumber").val(DataDependant.BirthCertIssueNo);
        $("#PTRDependantIssuedOn").val(doc);
        $("#PTRDependantIssuedBy").val(DataDependant.BirthCertIssuedBy);
        $("#PTRDependantSignedBy").val(DataDependant.BirthCertSignedBy);
    }
    $("#PTRDependantModal").modal("show");
}

var AddDependantDetails = () => {
    ResetDependantForm();
    $("#PTRDependantModal").modal("show");
}

var ResetDependantForm = () => {

    // Empty Object
    DataDependant = {};

    // Clear Fields
    $("#PTRDependantFirstName").val("");
    $("#PTRDependantMiddleName").val("");
    $("#PTRDependantLastName").val("");
    $("#PTRDependantBirthDate").val("");
    $("#PTRDependantGender").html(`<option value="">Choose one</option><option value="M">Male</option><option value="F">Female</option>`);
    // Reset Marital Statuses
    $("#PTRDependantMarital").val($("#PTRDependantMarital option:first").val());
    $("#PTRDependantNumber").val("");
    $("#PTRDependantIssuedOn").val("");
    $("#PTRDependantIssuedBy").val("");
    $("#PTRDependantSignedBy").val("");
    $("#BrowseDependantCert").html(`<i class="fa fa-paperclip"></i> Attach Birth Certificate`);
}

var BrowseDependantCertificate = () => {
    // Open File Browser
    $("#PTRDependantCertificate").trigger("click");
}

var GetDependantCertificate = (el) => {
    // Show Preloader
    $('body').showLoading();

    // Reset AttachmentFiles to Empty
    AttachmentFiles = [];
    AttachmentFiles.length = 0;
    for (let j = 0; j < el.files.length; j++) {
        // Convert file to base64
        GetEncodedAttachmentFile(el.files[j]);
    }
    setTimeout(function () {
        //If any valid files
        if (AttachmentFiles && AttachmentFiles.length > 0) {
            // Get First Object
            DependantCertificate = AttachmentFiles[0];
            $("#BrowseDependantCert").html(`<i class="fa fa-paperclip"></i> [1] File Attached`);
            OpenAttachedDocument(DependantCertificate.Data);
        }

        // Hide Preloader
        $('body').hideLoading();
    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

}

var SaveDependantDetails = () => {

    // Get form details
    ValidateDependant();

    // No Errors
    if (!DataDependant.ErrorMessage) {
        // Store Data
        var iDependant = DataDependants.findIndex(Dependant => Dependant.Id === DataDependant.Id);
        if (DataDependants[iDependant]) {
            DataDependants[iDependant] = DataDependant;
        } else {
            DataDependants.push(DataDependant);
        }

        // Clear Form
        ResetChildForm();

        // Hide Modal
        $("#PTRDependantModal").modal("hide");

        // Set Data in Table
        SetAgedDependantsData();
    }
}

/* ======================================
 *       DISABILITY REFLIEF
 * =====================================*/
var DisabilityDocument = {};

var BrowsePTRDisabilityDocument = () => {
    // Open File Browser
    $("#PTRDisabilityDocument").trigger("click");
}

var GetPTRDisabilityDocument = (el) => {
    // Show Preloader
    $('body').showLoading();

    // Reset AttachmentFiles to Empty
    AttachmentFiles = [];
    AttachmentFiles.length = 0;
    for (let j = 0; j < el.files.length; j++) {
        // Convert file to base64
        GetEncodedAttachmentFile(el.files[j]);
    }
    setTimeout(function () {
        //If any valid files
        if (AttachmentFiles && AttachmentFiles.length > 0) {
            // Get First Object
            DisabilityDocument = AttachmentFiles[0];
            $("#BrowsePTRDisabilityDoc").html(`<i class="fa fa-paperclip"></i> Attached [1]`);
            OpenAttachedDocument(DisabilityDocument.Data);
        }

        // Hide Preloader
        $('body').hideLoading();
    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

}


/* ======================================
 *       VOLUNTARY PENSION REFLIEF
 * =====================================*/
var PensionBirthCertificate = {};

var BrowsePTRPensionBirthCertificate = () => {
    // Open File Browser
    $("#PTRPensionBirthCertificate").trigger("click");
}

var GetPTRPensionBirthCertificate = (el) => {
    // Show Preloader
    $('body').showLoading();

    // Reset AttachmentFiles to Empty
    AttachmentFiles = [];
    AttachmentFiles.length = 0;
    for (let j = 0; j < el.files.length; j++) {
        // Convert file to base64
        GetEncodedAttachmentFile(el.files[j]);
    }
    setTimeout(function () {
        //If any valid files
        if (AttachmentFiles && AttachmentFiles.length > 0) {
            // Get First Object
            PensionBirthCertificate = AttachmentFiles[0];
            $("#BrowsePTRPensionBirth").html(`<i class="fa fa-paperclip"></i> Attached [1]`);
            OpenAttachedDocument(PensionBirthCertificate.Data);
        }

        // Hide Preloader
        $('body').hideLoading();
    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

}


/* ======================================
 *       LIFE ASSURANCE REFLIEF
 * =====================================*/
var FormLifeAssuranceDetails = () => {
    LifeAssuranceData = {
        // Add LifeAssuranceData

    };
}


/* ======================================
 *       LIFE ASSURANCE REFLIEF
 * =====================================*/
var FormSocialSecurityDetails = () => {
    SocialSecurityData = {
        // Add LifeAssuranceData

    };
}

/* ======================================
 *       COST OF TRAINING REFLIEF
 * =====================================*/
var AdmissionDocument = {};

var BrowsePTRTrainingAdmissionLetter = () => {
    // Open File Browser
    $("#PTRTrainingAdmissionLetter").trigger("click");
}

var GetPTRTrainingAdmissionLetter = (el) => {
    // Show Preloader
    $('body').showLoading();

    // Reset AttachmentFiles to Empty
    AttachmentFiles = [];
    AttachmentFiles.length = 0;
    for (let j = 0; j < el.files.length; j++) {
        // Convert file to base64
        GetEncodedAttachmentFile(el.files[j]);
    }
    setTimeout(function () {
        //If any valid files
        if (AttachmentFiles && AttachmentFiles.length > 0) {
            // Get First Object
            AdmissionDocument = AttachmentFiles[0];
            $("#BrowsePTRTrainingAdm").html(`<i class="fa fa-paperclip"></i> Attached File [1]`);
            OpenAttachedDocument(AdmissionDocument.Data);
        }

        // Hide Preloader
        $('body').hideLoading();
    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

}
