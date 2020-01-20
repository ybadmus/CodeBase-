

/* ======================================
 *        VALIDATE APPLICATION DATA
 * =================================== */
var DataCommon = {};
var ValidateApplicant = () => {
    let dob = $("#PTRGeneralBirthDate").val();
    DataCommon = {
        DateOfBirth: dob ? CorrectDatePicker(dob) : "",
        Age: dob ? GetAgeFromDate(CorrectDatePicker(dob)) : 0,
        MaritalStatus: $("#PTRGeneralMarital").val(),
        Gender: $("#PTRGeneralGender").val(),
        PhoneNo: $("#PTRGeneralPhone").val(),
        EmailAddress: $("#PTRGeneralEmail").val(),
        MothersMaidenName: $("#PTRGeneralMotherName").val(),
        EmployerTIN: $("#PTRGeneralEmployerTIN").val(),
        EmployerName: $("#PTRGeneralEmployerName").val(),
        EmployerEmail: $("#PTRGeneralEmployerEmail").val(),
        EmployerPhone: $("#PTRGeneralEmployerPhone").val(),
        EmployerAddress: $("#PTRGeneralEmployerAddress").val(),
        ErrorMessage: ""
    };

    if (!DataCommon) {
        DataCommon.ErrorMessage = `${PTRFormErrorMessage}: All fields marked <i class="text-danger">*</i> are required.`;
    } else if (!DataCommon.Gender) {
        DataCommon.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Gender]&nbsp;</b> field is required.`;
    } else if (!DataCommon.DateOfBirth) {
        DataCommon.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Date of Birth]&nbsp;</b> field is required.`;
    } else if (!DataCommon.MaritalStatus) {
        DataCommon.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Marital Status]&nbsp;</b> field is required.`;
    } else if (!DataCommon.MothersMaidenName) {
        DataCommon.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Mother's Maiden Name]&nbsp;</b> field is required.`;
    } else if (!(DataCommon.EmployerTIN && DataCommon.EmployerTIN.length === 11)) {
        DataCommon.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Employer's TIN]&nbsp;</b> field is required.`;
    } else if (!DataCommon.EmployerName) {
        DataCommon.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Employer's Name]&nbsp;</b> field is required.`;
    } else if (!DataCommon.EmployerAddress) {
        DataCommon.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Employer's Address]&nbsp;</b> field is required.`;
    } else {
        DataCommon.ErrorMessage = "";
    }

    // -- DELETE LATER
    // DataCommon.ErrorMessage = "";

    $("#PTRErrorGeneral").text("").prop("hidden", true);
    if (DataCommon.ErrorMessage) {
        $("#PTRErrorGeneral").html(DataCommon.ErrorMessage).prop("hidden", false);
        CurrentTabId = GetTabByContentId("PTRApplicant").Id;
        ActivateTab();
    }
}

var DataMarriage = {};
var ValidateMarriage = () => {
    let dob = $("#PTRSpouseBirthDate").val();
    let dom = $("#PTRMarriageRegDate").val();
    let doc = $("#PTRMarriageIssuedOn").val();
    DataMarriage = {
        SpouseTIN: $("#PTRSpouseTIN").val(),
        SpouseFirstName: $("#PTRSpouseFirstName").val(),
        SpouseMiddleName: $("#PTRSpouseMiddleName").val(),
        SpouseLastName: $("#PTRSpouseLastName").val(),
        SpouseFullName: $("#PTRSpouseFullName").val(),
        SpouseDateOfBirth: dob ? CorrectDatePicker(dob) : "",
        SpouseGender: $("#PTRSpouseGender").val(),
        SpousePhone: $("#PTRSpousePhone").val(),
        SpouseEmail: $("#PTRSpouseEmail").val(),
        RegistrationDate: dom ? CorrectDatePicker(dom) : "",
        CertIssueNo: $("#PTRMarriageDocNumber").val(),
        CertIssuingDate: doc ? CorrectDatePicker(doc) : "",
        CertIssuedBy: $("#PTRMarriageIssuedBy").val(),
        CertSignedBy: $("#PTRMarriageSignedBy").val(),
        CertDocument: MarriageCertificate.Data,
        ErrorMessage: ""
    };

    if (!DataMarriage) {
        DataMarriage.ErrorMessage = `${PTRFormErrorMessage}: All fields marked <i class="text-danger">*</i> are required.`;
    } else if (!DataMarriage.SpouseTIN) {
        DataMarriage.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Spouse's TIN]&nbsp;</b> field is required.`;
    } else if (!DataMarriage.SpouseFullName) {
        DataMarriage.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Spouse's Full Name]&nbsp;</b> field is required.`;
    } else if (!DataMarriage.SpouseDateOfBirth) {
        DataMarriage.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Spouse's Date of Birth]&nbsp;</b> field is required.`;
    } else if (!DataMarriage.SpouseGender) {
        DataMarriage.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Spouse's Gender]&nbsp;</b> field is required.`;
    } else if (!DataMarriage.RegistrationDate) {
        DataMarriage.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Marriage Registration Data]&nbsp;</b> field is required.`;
    } else if (!DataMarriage.CertIssueNo) {
        DataMarriage.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Marriage Certificate Issue Number]&nbsp;</b> field is required.`;
    } else if (!DataMarriage.CertIssuingDate) {
        DataMarriage.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Marriage Certificate Issuing Date]&nbsp;</b> field is required.`;
    } else if (!DataMarriage.CertIssuedBy) {
        DataMarriage.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Marriage Certificate Issued By]&nbsp;</b> field is required.`;
    } else if (!DataMarriage.CertSignedBy) {
        DataMarriage.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Marriage Certificate Signed By]&nbsp;</b> field is required.`;
    } else if (!DataMarriage.CertDocument) {
        DataMarriage.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Marriage Certificate Attachment]&nbsp;</b> is required.`;
    } else {
        DataMarriage.ErrorMessage = "";
    }

    $("#PTRErrorMarriage").text("").prop("hidden", true);
    if (DataMarriage.ErrorMessage) {
        $("#PTRErrorMarriage").html(DataMarriage.ErrorMessage).prop("hidden", false);
        CurrentTabId = GetTabByContentId("PTRAPP0003").Id;
        ActivateTab();
        MarriageOptionM();
    }
}

var DataResponsibility = {};
var ValidateResponsibility = () => {

    let id = DataResponsibility && DataResponsibility.Id ? DataResponsibility.Id : UUIDv4();
    let dob = $("#PTRMarriageDependantBirthDate").val();
    let doc = $("#PTRMarriageDependantIssuedOn").val();

    DataResponsibility = {
        Id: id,
        FirstName: $("#PTRMarriageDependantFirstName").val(),
        MiddleName: $("#PTRMarriageDependantMiddleName").val(),
        LastName: $("#PTRMarriageDependantLastName").val(),
        RespDateOfBirth: dob ? CorrectDatePicker(dob) : "",
        RespGender: $("#PTRMarriageDependantGender").val(),
        BirthCertIssueNo: $("#PTRMarriageDependantNumber").val(),
        BirthCertIssueDate: doc ? CorrectDatePicker(doc) : "",
        BirthCertIssuedBy: $("#PTRMarriageDependantIssuedBy").val(),
        BirthCertSignedBy: $("#PTRMarriageDependantSignedBy").val(),
        BirthCertDocument: ResponsibilityBirthCertificate.Data,
        // Error Message
        ErrorMessage: ""
    };

    if (!DataResponsibility) {
        DataResponsibility.ErrorMessage = `${PTRFormErrorMessage}: All fields marked <i class="text-danger">*</i> are required.`;
    } else if (!DataResponsibility.FirstName) {
        DataResponsibility.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[First Name]&nbsp;</b> field is required.`;
    } else if (!DataResponsibility.LastName) {
        DataResponsibility.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Last Name]&nbsp;</b> field is required.`;
    } else if (!DataResponsibility.RespDateOfBirth) {
        DataResponsibility.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Date of Birth]&nbsp;</b> field is required.`;
    } else if (!DataResponsibility.RespGender) {
        DataResponsibility.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Gender]&nbsp;</b> field is required.`;
    } else if (!DataResponsibility.BirthCertIssueNo) {
        DataResponsibility.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issue Number]&nbsp;</b> field is required.`;
    } else if (!DataResponsibility.BirthCertIssueDate) {
        DataResponsibility.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issuing Date]&nbsp;</b> field is required.`;
    } else if (!DataResponsibility.BirthCertIssuedBy) {
        DataResponsibility.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issued By]&nbsp;</b> field is required.`;
    } else if (!DataResponsibility.BirthCertSignedBy) {
        DataResponsibility.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Signed By]&nbsp;</b> field is required.`;
    } else if (!DataResponsibility.BirthCertDocument) {
        DataResponsibility.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Attachment]&nbsp;</b> is required.`;
    } else {
        DataResponsibility.ErrorMessage = "";
    }

    $("#PTRErrorMarriageDependant").text("").prop("hidden", true);
    if (DataResponsibility.ErrorMessage) {
        $("#PTRErrorMarriageDependant").html(DataResponsibility.ErrorMessage).prop("hidden", false);
    }
}

var DataResponsibilities = [];
var ValidateResponsibilities = () => {
    $("#PTRErrorMarriage").text("").prop("hidden", true);
    if (DataResponsibilities && DataResponsibilities.length) {
        let ErrMsg = "";
        for (let x = 0; x < DataResponsibilities.length; x++) {
            if (DataResponsibilities[x].ErrorMessage) {
                ErrMsg = DataResponsibilities[x].ErrorMessage;
            }
        }

        if (ErrMsg) {
            $("#PTRErrorMarriage").html(ErrMsg).prop("hidden", false);
            CurrentTabId = GetTabByContentId("PTRAPP0005").Id;
            ActivateTab();
            MarriageOptionR();
        }
    }
}

var DataChild = {};
var ValidateChild = () => {
    let id = DataChild && DataChild.Id ? DataChild.Id : UUIDv4();
    let dob = $("#PTRChildBirthDate").val();
    let doc = $("#PTRChildBirthCertIssuedOn").val();
    let doa = $("#PTRChildAdmissionDate").val();
    DataChild = {
        Id: id,
        // Personal Details
        ChildFirstName: $("#PTRChildFirstName").val(),
        ChildMiddleName: $("#PTRChildMiddleName").val(),
        ChildLastName: $("#PTRChildLastName").val(),
        ChildDateOfBirth: dob ? CorrectDatePicker(dob) : "",
        BirthCertIssueNo: $("#PTRChildBirthCertIssueNumber").val(),
        BirthCertIssueDate: doc ? CorrectDatePicker(doc) : "",
        BirthCertIssueBy: $("#PTRChildBirthCertIssuedBy").val(),
        BirthCertSignedBy: $("#PTRChildBirthCertSignedBy").val(),
        BirthCertDocument: ChildBirthCertificate.Data,
        // School Details
        SchoolName: $("#PTRChildSchoolName").val(),
        AdmissionDate: doa ? CorrectDatePicker(doa) : "",
        AdmissionLetterRefNo: $("#PTRChildAdmissionRefNo").val(),
        AdmissionLetterDocument: ChildAdmissionLetter.Data,
        // Error Message
        ErrorMessage: ""
    };

    if (!DataChild) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: All fields marked <i class="text-danger">*</i> are required.`;
    } else if (!DataChild.ChildFirstName) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's First Name]&nbsp;</b> field is required.`;
    } else if (!DataChild.ChildLastName) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's Last Name]&nbsp;</b> field is required.`;
    } else if (!DataChild.ChildDateOfBirth) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's Date of Birth]&nbsp;</b> field is required.`;
    } else if (!DataChild.BirthCertIssueNo) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's Birth Certificate Issue Number]&nbsp;</b> field is required.`;
    } else if (!DataChild.BirthCertIssueDate) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's Birth Certificate Issuing Date]&nbsp;</b> field is required.`;
    } else if (!DataChild.BirthCertIssueBy) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's Birth Certificate Issued By]&nbsp;</b> field is required.`;
    } else if (!DataChild.BirthCertSignedBy) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's Birth Certificate Signed By]&nbsp;</b> field is required.`;
    } else if (!DataChild.BirthCertDocument) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's Birth Certificate Attachment]&nbsp;</b> is required.`;
    } else if (!DataChild.SchoolName) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's School Name]&nbsp;</b> field is required.`;
    } else if (!DataChild.AdmissionDate) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's Admision Date]&nbsp;</b> field is required.`;
    } else if (!DataChild.AdmissionLetterRefNo) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's Admision Reference Number]&nbsp;</b> field is required.`;
    } else if (!DataChild.AdmissionLetterDocument) {
        DataChild.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Child's Admision Letter Attachment]&nbsp;</b> is required.`;
    } else {
        DataChild.ErrorMessage = "";
    }

    $("#PTRErrorChild").text("").prop("hidden", true);
    if (DataChild.ErrorMessage) {
        $("#PTRErrorChild").html(DataChild.ErrorMessage).prop("hidden", false);
    }
}

var DataChildren = [];
var ValidateChildren = () => {
    $("#PTRErrorChildren").text("").prop("hidden", true);
    if (DataChildren && DataChildren.length) {
        let ErrMsg = "";
        for (let x = 0; x < DataChildren.length; x++) {
            if (DataChildren[x].ErrorMessage) {
                ErrMsg = DataChildren[x].ErrorMessage;
            }
        }

        if (ErrMsg) {
            $("#PTRErrorChildren").html(ErrMsg).prop("hidden", false);
            CurrentTabId = GetTabByContentId("PTRAPP0004").Id;
            ActivateTab();
        }
    }
}

var DataOldAge = {};
var ValidateOldAge = () => {

    let doc = $("#OldAgeBirthCertIssuedOn").val();
    DataOldAge = {
        BirthCertIssueNo: $("#OldAgeBirthCertIssueNumber").val(),
        BirthCertIssuingDate: doc ? CorrectDatePicker(doc) : "",
        BirthCertIssuedBy: $("#OldAgeBirthCertIssuedBy").val(),
        BirthCertSignedBy: $("#OldAgeBirthCertSignedBy").val(),
        BirthCertDocument: OldAgeBirthCertificate.Data,
        // Error Message
        ErrorMessage: ""
    };

    if (!DataOldAge) {
        DataOldAge.ErrorMessage = `${PTRFormErrorMessage}: All fields marked <i class="text-danger">*</i> are required.`;
    } else if (!DataOldAge.BirthCertIssueNo) {
        DataOldAge.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issue Number]&nbsp;</b> field is required.`;
    } else if (!DataOldAge.BirthCertIssuingDate) {
        DataOldAge.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issuing Date]&nbsp;</b> field is required.`;
    } else if (!DataOldAge.BirthCertIssuedBy) {
        DataOldAge.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issued By]&nbsp;</b> field is required.`;
    } else if (!DataOldAge.BirthCertSignedBy) {
        DataOldAge.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Signed By]&nbsp;</b> field is required.`;
    } else if (!DataOldAge.BirthCertDocument) {
        DataOldAge.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Attachment]&nbsp;</b> is required.`;
    } else {
        DataOldAge.ErrorMessage = "";
    }

    $("#PTRErrorOldAge").text("").prop("hidden", true);
    if (DataOldAge.ErrorMessage) {
        $("#PTRErrorOldAge").html(DataOldAge.ErrorMessage).prop("hidden", false);
        CurrentTabId = GetTabByContentId("PTRAPP0008").Id;
        ActivateTab();
    }
}

var DataDependant = {};
var ValidateDependant = () => {

    let dob = $("#PTRDependantBirthDate").val();
    let doc = $("#PTRDependantIssuedOn").val();

    let id = DataDependant && DataDependant.Id ? DataDependant.Id : UUIDv4();

    DataDependant = {
        Id: id,
        FirstName: $("#PTRDependantFirstName").val(),
        MiddleName: $("#PTRDependantMiddleName").val(),
        LastName: $("#PTRDependantLastName").val(),
        DateOfBirth: dob ? CorrectDatePicker(dob) : "",
        Gender: $("#PTRDependantGender").val(),
        MaritalStatus: $("#PTRDependantMarital").val(),
        BirthCertIssueNo: $("#PTRDependantNumber").val(),
        BirthCertIssueDate: doc ? CorrectDatePicker(doc) : "",
        BirthCertIssuedBy: $("#PTRDependantIssuedBy").val(),
        BirthCertSignedBy: $("#PTRDependantSignedBy").val(),
        BirthCertDocument: DependantCertificate.Data,
        // Error Message
        ErrorMessage: ""
    };

    if (!DataDependant) {
        DataDependant.ErrorMessage = `${PTRFormErrorMessage}: All fields marked <i class="text-danger">*</i> are required.`;
    } else if (!DataDependant.FirstName) {
        DataDependant.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[First Name]&nbsp;</b> field is required.`;
    } else if (!DataDependant.LastName) {
        DataDependant.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Last Name]&nbsp;</b> field is required.`;
    } else if (!DataDependant.DateOfBirth) {
        DataDependant.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Date of Birth]&nbsp;</b> field is required.`;
    } else if (!DataDependant.Gender) {
        DataDependant.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Gender]&nbsp;</b> field is required.`;
    } else if (!DataDependant.MaritalStatus) {
        DataDependant.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Marital Status]&nbsp;</b> field is required.`;
    } else if (!DataDependant.BirthCertIssueNo) {
        DataDependant.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issue Number]&nbsp;</b> field is required.`;
    } else if (!DataDependant.BirthCertIssueDate) {
        DataDependant.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issuing Date]&nbsp;</b> field is required.`;
    } else if (!DataDependant.BirthCertIssuedBy) {
        DataDependant.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issued By]&nbsp;</b> field is required.`;
    } else if (!DataDependant.BirthCertSignedBy) {
        DataDependant.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Signed By]&nbsp;</b> field is required.`;
    } else if (!DataDependant.BirthCertDocument) {
        DataDependant.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Attachment]&nbsp;</b> is required.`;
    } else {
        DataDependant.ErrorMessage = "";
    }

    $("#PTRErrorDependant").text("").prop("hidden", true);
    if (DataDependant.ErrorMessage) {
        $("#PTRErrorDependant").html(DataDependant.ErrorMessage).prop("hidden", false);
    }
}

var DataDependants = [];
var ValidateDependants = () => {
    $("#PTRErrorDependants").text("").prop("hidden", true);
    if (DataDependants && DataDependants.length) {
        let ErrMsg = "";
        for (let x = 0; x < DataDependants.length; x++) {
            if (DataDependants[x].ErrorMessage) {
                ErrMsg = DataDependants[x].ErrorMessage;
            }
        }

        if (ErrMsg) {
            $("#PTRErrorDependants").html(ErrMsg).prop("hidden", false);
            CurrentTabId = GetTabByContentId("PTRAPP0005").Id;
            ActivateTab();
        }
    }
}

var DataDisability = {};
var ValidateDisability = () => {

    let doc = $("#PTRDisabilityDocIssuedOn").val();
    DataDisability = {
        TypeOfDisability: $("#PTRTypeOfDisability").val(),
        DisabilityDocIssueNo: $("#PTRDisabilityDocIssueNumber").val(),
        DisabilityDocIssuingDate: doc ? CorrectDatePicker(doc) : "",
        DisabilityDocIssueBy: $("#PTRDisabilityDocIssuedBy").val(),
        DisabilityDocSignedBy: $("#PTRDisabilityDocSignedBy").val(),
        DisabilityDocDocument: DisabilityDocument.Data,
        // Error Message
        ErrorMessage: ""
    }

    if (!DataDisability) {
        DataDisability.ErrorMessage = `${PTRFormErrorMessage}: All fields marked <i class="text-danger">*</i> are required.`;
    } else if (!DataDisability.TypeOfDisability) {
        DataDisability.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Type of Disability]&nbsp;</b> field is required.`;
    } else if (!DataDisability.DisabilityDocDocument) {
        DataDisability.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Disability Document Attachment]&nbsp;</b> is required.`;
    } else if (!DataDisability.DisabilityDocIssueNo) {
        DataDisability.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Disability Document Issue Number]&nbsp;</b> field is required.`;
    } else if (!DataDisability.DisabilityDocIssuingDate) {
        DataDisability.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Disability Document Issuing Date]&nbsp;</b> field is required.`;
    } else if (!DataDisability.DisabilityDocIssueBy) {
        DataDisability.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Disability Document Issued By]&nbsp;</b> field is required.`;
    } else if (!DataDisability.DisabilityDocSignedBy) {
        DataDisability.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Disability Document Signed By]&nbsp;</b> field is required.`;
    } else {
        DataDisability.ErrorMessage = "";
    }

    $("#PTRErrorDisability").text("").prop("hidden", true);
    if (DataDisability.ErrorMessage) {
        $("#PTRErrorDisability").html(DataDisability.ErrorMessage).prop("hidden", false);
        CurrentTabId = GetTabByContentId("PTRAPP0007").Id;
        ActivateTab();
    }
}

var DataPension = {};
var ValidatePension = () => {

    let doc = $("#PTRPensionBirthCertIssuedOn").val();
    DataPension = {
        CurrentAge: $("#PTRPensionCurrentAge").val(),
        YearsWorked: $("#PTRPensionYearsOfWork").val(),
        YearsContributed: $("#PTRPensionYearsContributed").val(),
        BirthCertIssueNo: $("#PTRPensionBirthCertIssueNumber").val(),
        BirthCertIssueDate: doc ? CorrectDatePicker(doc) : "",
        BirthCertIssuedBy: $("#PTRPensionBirthCertIssuedBy").val(),
        BirthCertSignedBy: $("#PTRPensionBirthCertSignedBy").val(),
        BirthCertDocument: PensionBirthCertificate.Data,
        // Error Message
        ErrorMessage: ""
    }
    if (!DataPension) {
        DataPension.ErrorMessage = `${PTRFormErrorMessage}: All fields marked <i class="text-danger">*</i> are required.`;
    } else if (!DataPension.CurrentAge) {
        DataPension.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Current Age]&nbsp;</b> field is required.`;
    } else if (!DataPension.YearsWorked) {
        DataPension.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[No. Years of Work]&nbsp;</b> field is required.`;
    } else if (!DataPension.YearsContributed) {
        DataPension.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[No. Years Contributed]&nbsp;</b> field is required.`;
    } else if (!DataPension.BirthCertIssueNo) {
        DataPension.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issue Number]&nbsp;</b> field is required.`;
    } else if (!DataPension.BirthCertIssueDate) {
        DataPension.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issuing Date]&nbsp;</b> field is required.`;
    } else if (!DataPension.BirthCertIssuedBy) {
        DataPension.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Issued By]&nbsp;</b> field is required.`;
    } else if (!DataPension.BirthCertSignedBy) {
        DataPension.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Signed By]&nbsp;</b> field is required.`;
    } else if (!DataPension.BirthCertDocument) {
        DataPension.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Birth Certificate Attachment]&nbsp;</b> is required.`;
    } else {
        DataPension.ErrorMessage = "";
    }

    $("#PTRErrorPension").text("").prop("hidden", true);
    if (DataPension.ErrorMessage) {
        $("#PTRErrorPension").html(DataPension.ErrorMessage).prop("hidden", false);
        CurrentTabId = GetTabByContentId("PTRAPP0006").Id;
        ActivateTab();
    }
}

var DataAssurance = {};
var ValidateAssurance = () => {

    $("#PTRErrorAssurance").text("").prop("hidden", true);
    /*
    if (!(marriageData && marriageData.SpouseFirstName && marriageData.SpouseLastName &&
        marriageData.SpouseTIN && marriageData.SpouseDateOfBirth)) {
        $("#PTRErrorMarriage").text("Please provide all the required fields.").prop("hidden", false);
    } else {
        // Can Move Now.
        CurrentTabId = GetNextTab().Id;
        ActivateTab();
    }
    */
}

var DataSocial = {};
var ValidateSocial = () => {

    $("#PTRErrorSocial").text("").prop("hidden", true);
    /*
    if (!(marriageData && marriageData.SpouseFirstName && marriageData.SpouseLastName &&
        marriageData.SpouseTIN && marriageData.SpouseDateOfBirth)) {
        $("#PTRErrorMarriage").text("Please provide all the required fields.").prop("hidden", false);
    } else {
        // Can Move Now.
        CurrentTabId = GetNextTab().Id;
        ActivateTab();
    }
    */
}

var DataTraining = {};
var ValidateTraining = () => {
    DataTraining = {
        SchoolName: $("#PTRTrainingSchoolName").val(),
        CourseTitle: $("#PTRTrainingCourseTitle").val(),
        CourseDuration: $("#PTRTrainingCourseDuration").val(),
        AdmissionDate: CorrectDatePicker($("#PTRTrainingAdmissionDate").val()),
        AdmissionLetterRefNo: $("#PTRTrainingAdmissionRefNo").val(),
        AdmissionLetterDocument: AdmissionDocument.Data,
        // Error Message
        ErrorMessage: ""
    }

    if (!DataTraining) {
        DataTraining.ErrorMessage = `${PTRFormErrorMessage}: All fields marked <i class="text-danger">*</i> are required.`;
    } else if (!DataTraining.TypeOfDisability) {
        DataTraining.ErrorMessage = `${PTRFormErrorMessage}: <b>&nbsp;[Type of Disability]&nbsp;</b> field is required.`;
    } else {
        DataTraining.ErrorMessage = "";
    }

    $("#PTRErrorTraining").text("").prop("hidden", true);
    if (DataTraining.ErrorMessage) {
        $("#PTRErrorTraining").html(DataTraining.ErrorMessage).prop("hidden", false);
        CurrentTabId = GetTabByContentId("PTRAPP0011").Id;
        ActivateTab();
    }

    $("#PTRErrorTraining").text("").prop("hidden", true);
    if (!(trainingData && trainingData.SchoolName && trainingData.CourseTitle &&
        trainingData.AdmissionLetterDocument)) {
        $("#PTRErrorTraining").text("Please provide all the required fields.").prop("hidden", false);
    } else {
        // Can Move Now.
        CurrentTabId = GetNextTab().Id;
        ActivateTab();
    }
}


/* ======================================
 *        BUILD APPLICATIONS DATA
 * =================================== */
var BuildApplicationsData = () => {

    // Relief Types
    var TypeMarriage = GetPTRTypeByCode(PTRApplicationTypes, "APP0003");
    var TypeResponsibility = GetPTRTypeByCode(PTRApplicationTypes, "APP0003");
    var TypeChildren = GetPTRTypeByCode(PTRApplicationTypes, "APP0004");
    var TypeOldAge = GetPTRTypeByCode(PTRApplicationTypes, "APP0008");
    var TypeDependants = GetPTRTypeByCode(PTRApplicationTypes, "APP0005");
    var TypeDisability = GetPTRTypeByCode(PTRApplicationTypes, "APP0007");
    var TypePension = GetPTRTypeByCode(PTRApplicationTypes, "APP0006");
    var TypeAssurance = GetPTRTypeByCode(PTRApplicationTypes, "APP0009");
    var TypeSocial = GetPTRTypeByCode(PTRApplicationTypes, "APP0010");
    var TypeTraining = GetPTRTypeByCode(PTRApplicationTypes, "APP0011");

    // Combined Data
    ReliefApplicationsData = {
        ApplicationTypes: PTRApplicationTypesN,
    };

    // Get Data from selected tab pages
    for (let k = 0; k < PTRApplicationTypesN.length; k++) {
        switch (PTRApplicationTypesN[k].Code) {
            case "APP0003": // Marriage
                if (MarriageOption === MarriageOptions.M) {
                    ValidateMarriage();
                    if (!DataMarriage.ErrorMessage) {
                        // Marriage is Good to Go
                        ReliefApplicationsData.Marriage = {
                            Applicant: nameTIN.Id,
                            PurposeId: OtherPurposeId,
                            Remarks: TypeMarriage.Description,
                            TaxOfficeId: TaxPayerData.taxOffice.id,
                            ApplicationTypeId: TypeMarriage.Id,
                            UserId: "",
                            AssessmentYear: AssessmentYear,
                            StartDate: FromPeriod,
                            EndDate: ToPeriod,
                            DateOfBirth: DataCommon.DateOfBirth,
                            MaritalStatus: DataCommon.MaritalStatus,
                            Gender: DataCommon.Gender,
                            PhoneNo: DataCommon.PhoneNo,
                            EmailAddress: DataCommon.EmailAddress,
                            MothersMaidenName: DataCommon.MothersMaidenName,
                            EmployerTIN: DataCommon.EmployerTIN,
                            EmployerName: DataCommon.EmployerName,
                            EmployerEmail: DataCommon.EmployerEmail,
                            EmployerPhone: DataCommon.EmployerPhone,
                            EmployerAddress: DataCommon.EmployerAddress,
                            Permissions: nameTIN.Codes,
                            MarriageRelief: DataMarriage
                        }
                    } else {
                        ReliefApplicationsData.ErrorMessage = DataMarriage.ErrorMessage;
                    }
                } else {
                    ValidateResponsibilities();
                    if (!DataResponsibilities.ErrorMessage) {
                        // Marriage is Good to Go
                        ReliefApplicationsData.Responsibility = {
                            Applicant: nameTIN.Id,
                            PurposeId: OtherPurposeId,
                            Remarks: TypeResponsibility.Description,
                            TaxOfficeId: TaxPayerData.taxOffice.id,
                            ApplicationTypeId: TypeResponsibility.Id,
                            UserId: "",
                            AssessmentYear: AssessmentYear,
                            StartDate: FromPeriod,
                            EndDate: ToPeriod,
                            DateOfBirth: DataCommon.DateOfBirth,
                            MaritalStatus: DataCommon.MaritalStatus,
                            Gender: DataCommon.Gender,
                            PhoneNo: DataCommon.PhoneNo,
                            EmailAddress: DataCommon.EmailAddress,
                            MothersMaidenName: DataCommon.MothersMaidenName,
                            EmployerTIN: DataCommon.EmployerTIN,
                            EmployerName: DataCommon.EmployerName,
                            EmployerEmail: DataCommon.EmployerEmail,
                            EmployerPhone: DataCommon.EmployerPhone,
                            EmployerAddress: DataCommon.EmployerAddress,
                            Permissions: nameTIN.Codes,
                            ResponsibilityRelief: DataResponsibilities
                        }
                    } else {
                        ReliefApplicationsData.ErrorMessage = DataResponsibilities.ErrorMessage;
                    }
                }

                break;
            case "APP0004": // Children
                ValidateChildren();
                if (!DataChildren.ErrorMessage) {
                    // Children is Good to Go
                    ReliefApplicationsData.Children = {
                        Applicant: nameTIN.Id,
                        PurposeId: OtherPurposeId,
                        Remarks: TypeChildren.Description,
                        TaxOfficeId: TaxPayerData.taxOffice.id,
                        ApplicationTypeId: TypeChildren.Id,
                        UserId: "",
                        AssessmentYear: AssessmentYear,
                        StartDate: FromPeriod,
                        EndDate: ToPeriod,
                        DateOfBirth: DataCommon.DateOfBirth,
                        MaritalStatus: DataCommon.MaritalStatus,
                        Gender: DataCommon.Gender,
                        PhoneNo: DataCommon.PhoneNo,
                        EmailAddress: DataCommon.EmailAddress,
                        MothersMaidenName: DataCommon.MothersMaidenName,
                        EmployerTIN: DataCommon.EmployerTIN,
                        EmployerName: DataCommon.EmployerName,
                        EmployerEmail: DataCommon.EmployerEmail,
                        EmployerPhone: DataCommon.EmployerPhone,
                        EmployerAddress: DataCommon.EmployerAddress,
                        Permissions: nameTIN.Codes,
                        ChildrenEducationRelief: DataChildren
                    }
                } else {
                    ReliefApplicationsData.ErrorMessage = DataChildren.ErrorMessage;
                }
                break;
            case "APP0008": // Old Age
                ValidateOldAge();
                if (!DataOldAge.ErrorMessage) {
                    // Old Age is Good to Go
                    ReliefApplicationsData.OldAge = {
                        Applicant: nameTIN.Id,
                        PurposeId: OtherPurposeId,
                        Remarks: TypeOldAge.Description,
                        TaxOfficeId: TaxPayerData.taxOffice.id,
                        ApplicationTypeId: TypeOldAge.Id,
                        UserId: "",
                        AssessmentYear: AssessmentYear,
                        StartDate: FromPeriod,
                        EndDate: ToPeriod,
                        DateOfBirth: DataCommon.DateOfBirth,
                        MaritalStatus: DataCommon.MaritalStatus,
                        Gender: DataCommon.Gender,
                        PhoneNo: DataCommon.PhoneNo,
                        EmailAddress: DataCommon.EmailAddress,
                        MothersMaidenName: DataCommon.MothersMaidenName,
                        EmployerTIN: DataCommon.EmployerTIN,
                        EmployerName: DataCommon.EmployerName,
                        EmployerEmail: DataCommon.EmployerEmail,
                        EmployerPhone: DataCommon.EmployerPhone,
                        EmployerAddress: DataCommon.EmployerAddress,
                        Permissions: nameTIN.Codes,
                        OldAgeRelief: DataOldAge
                    }
                } else {
                    ReliefApplicationsData.ErrorMessage = DataOldAge.ErrorMessage;
                }
                break;
            case "APP0005": // Aged Dependants
                ValidateDependants();
                if (!DataDependants.ErrorMessage) {
                    // Dependants is Good to Go
                    ReliefApplicationsData.Dependants = {
                        Applicant: nameTIN.Id,
                        PurposeId: OtherPurposeId,
                        Remarks: TypeDependants.Description,
                        TaxOfficeId: TaxPayerData.taxOffice.id,
                        ApplicationTypeId: TypeDependants.Id,
                        UserId: "",
                        AssessmentYear: AssessmentYear,
                        StartDate: FromPeriod,
                        EndDate: ToPeriod,
                        DateOfBirth: DataCommon.DateOfBirth,
                        MaritalStatus: DataCommon.MaritalStatus,
                        Gender: DataCommon.Gender,
                        PhoneNo: DataCommon.PhoneNo,
                        EmailAddress: DataCommon.EmailAddress,
                        MothersMaidenName: DataCommon.MothersMaidenName,
                        EmployerTIN: DataCommon.EmployerTIN,
                        EmployerName: DataCommon.EmployerName,
                        EmployerEmail: DataCommon.EmployerEmail,
                        EmployerPhone: DataCommon.EmployerPhone,
                        EmployerAddress: DataCommon.EmployerAddress,
                        Permissions: nameTIN.Codes,
                        AgedDependantRelief: DataDependants
                    }
                } else {
                    ReliefApplicationsData.ErrorMessage = DataDependants.ErrorMessage;
                }
                break;
            case "APP0007": // Disability
                ValidateDisability();
                if (!DataDisability.ErrorMessage) {
                    // Disability is Good to Go
                    ReliefApplicationsData.Disability = {
                        Applicant: nameTIN.Id,
                        PurposeId: OtherPurposeId,
                        Remarks: TypeDisability.Description,
                        TaxOfficeId: TaxPayerData.taxOffice.id,
                        ApplicationTypeId: TypeDisability.Id,
                        UserId: "",
                        AssessmentYear: AssessmentYear,
                        StartDate: FromPeriod,
                        EndDate: ToPeriod,
                        DateOfBirth: DataCommon.DateOfBirth,
                        MaritalStatus: DataCommon.MaritalStatus,
                        Gender: DataCommon.Gender,
                        PhoneNo: DataCommon.PhoneNo,
                        EmailAddress: DataCommon.EmailAddress,
                        MothersMaidenName: DataCommon.MothersMaidenName,
                        EmployerTIN: DataCommon.EmployerTIN,
                        EmployerName: DataCommon.EmployerName,
                        EmployerEmail: DataCommon.EmployerEmail,
                        EmployerPhone: DataCommon.EmployerPhone,
                        EmployerAddress: DataCommon.EmployerAddress,
                        Permissions: nameTIN.Codes,
                        DisabilityRelief: DataDisability
                    }
                } else {
                    ReliefApplicationsData.ErrorMessage = DataDisability.ErrorMessage;
                }
                break;
            case "APP0006": // Pension
                ValidatePension();
                if (!DataPension.ErrorMessage) {
                    // Pension is Good to Go
                    ReliefApplicationsData.Pension = {
                        Applicant: nameTIN.Id,
                        PurposeId: OtherPurposeId,
                        Remarks: TypePension.Description,
                        TaxOfficeId: TaxPayerData.taxOffice.id,
                        ApplicationTypeId: TypePension.Id,
                        UserId: "",
                        AssessmentYear: AssessmentYear,
                        StartDate: FromPeriod,
                        EndDate: ToPeriod,
                        DateOfBirth: DataCommon.DateOfBirth,
                        MaritalStatus: DataCommon.MaritalStatus,
                        Gender: DataCommon.Gender,
                        PhoneNo: DataCommon.PhoneNo,
                        EmailAddress: DataCommon.EmailAddress,
                        MothersMaidenName: DataCommon.MothersMaidenName,
                        EmployerTIN: DataCommon.EmployerTIN,
                        EmployerName: DataCommon.EmployerName,
                        EmployerEmail: DataCommon.EmployerEmail,
                        EmployerPhone: DataCommon.EmployerPhone,
                        EmployerAddress: DataCommon.EmployerAddress,
                        Permissions: nameTIN.Codes,
                        VoluntaryPensionRelief: DataPension
                    }
                } else {
                    ReliefApplicationsData.ErrorMessage = DataPension.ErrorMessage;
                }
                break;
            case "APP0009": // Life Assurance
                ValidateAssurance();
                if (!DataAssurance.ErrorMessage) {
                    // Assurance is good to Go
                    ReliefApplicationsData.Assurance = {
                        Applicant: nameTIN.Id,
                        PurposeId: OtherPurposeId,
                        Remarks: TypeAssurance.Description,
                        TaxOfficeId: TaxPayerData.taxOffice.id,
                        ApplicationTypeId: TypeAssurance.Id,
                        UserId: "",
                        AssessmentYear: AssessmentYear,
                        StartDate: FromPeriod,
                        EndDate: ToPeriod,
                        DateOfBirth: DataCommon.DateOfBirth,
                        MaritalStatus: DataCommon.MaritalStatus,
                        Gender: DataCommon.Gender,
                        PhoneNo: DataCommon.PhoneNo,
                        EmailAddress: DataCommon.EmailAddress,
                        MothersMaidenName: DataCommon.MothersMaidenName,
                        EmployerTIN: DataCommon.EmployerTIN,
                        EmployerName: DataCommon.EmployerName,
                        EmployerEmail: DataCommon.EmployerEmail,
                        EmployerPhone: DataCommon.EmployerPhone,
                        EmployerAddress: DataCommon.EmployerAddress,
                        Permissions: nameTIN.Codes,
                        LifeAssuranceRelief: DataAssurance
                    }
                } else {
                    ReliefApplicationsData.ErrorMessage = DataAssurance.ErrorMessage;
                }
                break;
            case "APP0010": // Social Security
                ValidateSocial();
                if (!DataSocial.ErrorMessage) {
                    // Social is Good to Go
                    ReliefApplicationsData.Social = {
                        Applicant: nameTIN.Id,
                        PurposeId: OtherPurposeId,
                        Remarks: TypeSocial.Description,
                        TaxOfficeId: TaxPayerData.taxOffice.id,
                        ApplicationTypeId: TypeSocial.Id,
                        UserId: "",
                        AssessmentYear: AssessmentYear,
                        StartDate: FromPeriod,
                        EndDate: ToPeriod,
                        DateOfBirth: DataCommon.DateOfBirth,
                        MaritalStatus: DataCommon.MaritalStatus,
                        Gender: DataCommon.Gender,
                        PhoneNo: DataCommon.PhoneNo,
                        EmailAddress: DataCommon.EmailAddress,
                        MothersMaidenName: DataCommon.MothersMaidenName,
                        EmployerTIN: DataCommon.EmployerTIN,
                        EmployerName: DataCommon.EmployerName,
                        EmployerEmail: DataCommon.EmployerEmail,
                        EmployerPhone: DataCommon.EmployerPhone,
                        EmployerAddress: DataCommon.EmployerAddress,
                        Permissions: nameTIN.Codes,
                        SocialSecurityRelief: DataSocial
                    }
                } else {
                    ReliefApplicationsData.ErrorMessage = DataSocial.ErrorMessage;
                }
                break;
            case "APP0011": // Cost for Training
                ValidateTraining();
                if (!DataTraining.ErrorMessage) {
                    // Training is good to Go
                    ReliefApplicationsData.Training = {
                        Applicant: nameTIN.Id,
                        PurposeId: OtherPurposeId,
                        Remarks: TypeTraining.Description,
                        TaxOfficeId: TaxPayerData.taxOffice.id,
                        ApplicationTypeId: TypeTraining.Id,
                        UserId: "",
                        AssessmentYear: AssessmentYear,
                        StartDate: FromPeriod,
                        EndDate: ToPeriod,
                        DateOfBirth: DataCommon.DateOfBirth,
                        MaritalStatus: DataCommon.MaritalStatus,
                        Gender: DataCommon.Gender,
                        PhoneNo: DataCommon.PhoneNo,
                        EmailAddress: DataCommon.EmailAddress,
                        MothersMaidenName: DataCommon.MothersMaidenName,
                        EmployerTIN: DataCommon.EmployerTIN,
                        EmployerName: DataCommon.EmployerName,
                        EmployerEmail: DataCommon.EmployerEmail,
                        EmployerPhone: DataCommon.EmployerPhone,
                        EmployerAddress: DataCommon.EmployerAddress,
                        Permissions: nameTIN.Codes,
                        CostOfTrainingRelief: DataTraining
                    }
                } else {
                    ReliefApplicationsData.ErrorMessage = DataTraining.ErrorMessage;
                }
                break;
        }
    }
}
