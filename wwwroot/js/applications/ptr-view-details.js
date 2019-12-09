// ==============================================
//          VIEW APPLICATION DETAILS
//===============================================
var ViewPTRApplication = (id) => {
    let AppliedData = FindItemFromList(PTRApplicationsData, id);
    // console.log({ AppliedData });
    GetPTRApplicationDetails(AppliedData.Id, AppliedData.Type.Code);
}

var GetPTRApplicationDetails = (appId, typeCode) => {
    // Show Preloader
    $('body').showLoading();
    var dataModel = {
        TaxYear: typeCode,
        TaxPayerId: appId
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetPTRApplication`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        if (data.status === "Successful") {
            ShowPTRApplicationDetails(data.body, appId, typeCode);
        } else {
            toastr.info("Application details could not be loaded at this moment. Please try again shortly.");
        }
        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (res) {
        // Hide Preloader
        $('body').hideLoading();
    });
}

var ShowPTRApplicationDetails = (body, id, code) => {
    console.log({ body });

    var Details = {
        Code: code,
        Application: {
            Id: id,
            No: body.applicationNo,
            Date: body.submittedDate
        },
        Assessment: {
            Year: body.assessmentYear,
            StartDate: body.startDate,
            EndDate: body.endDate
        },
        Status: {
            Title: titleCase(body.status),
            Date: body.statusDate
        },
        Applicant: {
            DateOfBirth: body.dateOfBirth ? body.dateOfBirth : "N/A",
            EmailAddress: body.emailAddress ? body.emailAddress : "N/A",
            Gender: body.gender === "M" ? "Male" : "Female",
            MaritalStatus: body.maritalStatus ? body.maritalStatus : "N/A",
            MothersMaidenName: body.mothersMaidenName ? body.mothersMaidenName : "N/A",
            PhoneNo: body.phoneNo ? body.phoneNo : "N/A",
        },
        Employer: {
            Address: body.employerAddress ? body.employerAddress : "N/A",
            Email: body.employerEmail ? body.employerEmail : "N/A",
            Name: body.employerName ? body.employerName : "N/A",
            Phone: body.employerPhone ? body.employerPhone : "N/A",
            TIN: body.employerTIN ? body.employerTIN : "N/A",
        }
    };

    // Set Common Header
    var CommonHeader =
        `<div class="row">
            <div class="col-md-6 ml-2">
                <div class="row mb-3 mt-2">
                    <div class="col-md-12">
                        <label>Current Status</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="PTRSpouseFirstName" value="${Details.Status.Title}" disabled style="font-weight: 600">
                            <span class="input-group-append py-0">
                                <button class="btn btn-outline-dark py-0" type="button" onclick="ViewStatusComments('${Details.Application.Id}')" title="View status comments">
                                    View Comments
                                </button>
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>`;

    switch (code) {
        case "APP0003": // Marriage
            Details.SubType = body.subType;
            Details.Spouse = {
                DateOfBirth: body.spouseDateOfBirth ? body.spouseDateOfBirth : "N/A",
                Email: body.spouseEmail ? body.spouseEmail : "N/A",
                FirstName: body.spouseFirstName ? body.spouseFirstName : "N/A",
                Gender: body.spouseGender ? body.spouseGender === "M" ? "Male" : "Female" : "N/A",
                LastName: body.spouseLastName ? body.spouseLastName : "N/A",
                MiddleName: body.spouseMiddleName ? body.spouseMiddleName : "N/A",
                FullName: `${body.spouseFirstName} ${body.spouseMiddleName} ${body.spouseLastName}`,
                Phone: body.spousePhone ? body.spousePhone : "N/A",
                TIN: body.spouseTIN ? body.spouseTIN : "N/A"
            };
            Details.Certificate = {
                RegistrationDate: body.registrationDate ? body.registrationDate : "N/A",
                Document: body.certDocument ? body.certDocument : "N/A",
                IssueNo: body.certIssueNo ? body.certIssueNo : "N/A",
                IssuedBy: body.certIssuedBy ? body.certIssuedBy : "N/A",
                IssuingDate: body.certIssuingDate ? body.certIssuingDate : "N/A",
                SignedBy: body.certSignedBy ? body.certSignedBy : "N/A",
            };
            Details.Caption = "Marriage/Responsibility Relief Application";

            // Marriage Option
            let mBody = `<div class="row">

                            <div class="col-md-6 pr-1">
                                <div class="bordered-group">
                                    <p class="card-title"><b>Spouse's Details</b></p>

                                    <div class="row mb-3" disabled>
                                        <div class="col-md-4 pr-1">
                                            <label>TIN</label>
                                            <input type="text" class="form-control" value="${Details.Spouse.TIN}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4 px-1">
                                            <label>Full Name</label>
                                            <input type="text" class="form-control" value="${Details.Spouse.FullName}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4 pl-1">
                                            <label>Gender</label>
                                            <input type="text" class="form-control" value="${Details.Spouse.Gender}" disabled style="font-weight: 600">
                                        </div>
                                    </div>

                                    <div class="row mb-3 mt-2" disabled>
                                        <div class="col-sm-4 pr-1">
                                            <label>Date of Birth</label><br />
                                            <input type="text" class="form-control" value="${Details.Spouse.DateOfBirth}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4 px-1">
                                            <label>Phone Number</label>
                                            <input type="text" class="form-control" id="PTRSpousePhone" value="${Details.Spouse.Phone}" disabled style="font-weight: 600" >
                                        </div>
                                        <div class="col-md-4 pl-1">
                                            <label>Email Address</label>
                                            <input type="text" class="form-control" id="PTRSpouseEmail" value="${Details.Spouse.Email}" disabled style="font-weight: 600">
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="col-md-6 pl-1">
                                <div class="bordered-group">
                                    <p class="card-title"><b>Marriage Registration Details</b></p>

                                    <div class="row mb-3">
                                        <div class="col-md-4 pr-1">
                                            <label>Registration Date</label>
                                            <input type="text" class="form-control" id="PTRMarriageRegDate" value="${Details.Certificate.RegistrationDate}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4 px-1">
                                            <label>Issue Number</label><br />
                                            <input type="text" class="form-control" id="PTRMarriageDocNumber" value="${Details.Certificate.IssueNo}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4 pl-1">
                                            <label>Issuing Date</label><br />
                                            <input type="text" class="form-control" id="PTRMarriageIssuedOn" value="${Details.Certificate.IssuingDate}" disabled style="font-weight: 600">
                                        </div>
                                    </div>

                                    <div class="row mb-3">
                                        <div class="col-md-4 pr-1">
                                            <label>Issued By</label><br />
                                            <input type="text" class="form-control" id="PTRMarriageIssuedBy" value="${Details.Certificate.IssuedBy}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4 px-1">
                                            <label>Signed By</label><br />
                                            <input type="text" class="form-control" id="PTRMarriageSignedBy" value="${Details.Certificate.SignedBy}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4 pt-3 pl-1">
                                            <span class="btn btn-block btn-outline-dark py-1" onclick="OpenAttachedDocument('${Details.Certificate.Document}')">View Attachment</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>`;

            // console.log(body.responsibilityDetails);

            let responsibilityRows = "", xResponsibilities = [];
            if (body.responsibilityDetails.length > 0 &&
                body.responsibilityDetails[0].firstName &&
                body.responsibilityDetails[0].lastName) {
                for (let k = 0; k < body.responsibilityDetails.length; k++) {
                    let xResponsibility = {
                        Id: k,
                        FirstName: body.responsibilityDetails[k].firstName ? body.responsibilityDetails[k].firstName : "N/A",
                        MiddleName: body.responsibilityDetails[k].middleName ? body.responsibilityDetails[k].middleName : "N/A",
                        LastName: body.responsibilityDetails[k].lastName ? body.responsibilityDetails[k].lastName : "N/A",
                        FullName: body.responsibilityDetails[k].firstName && body.responsibilityDetails[k].lastName ? `${body.responsibilityDetails[k].firstName} ${body.responsibilityDetails[k].middleName} ${body.responsibilityDetails[k].lastName}` : "N/A",
                        Gender: body.responsibilityDetails[k].gender === "M" ? "Male" : body.responsibilityDetails[k].gender === "F" ? "Female" : "N/A",
                        DateOfBirth: body.responsibilityDetails[k].dateOfBirth,
                        BirthCertDocument: body.responsibilityDetails[k].birthCertDocument,
                        BirthCertSignedBy: body.responsibilityDetails[k].birthCertSignedBy,
                        BirthCertIssueNo: body.responsibilityDetails[k].birthCertIssueNo,
                        BirthCertIssueDate: body.responsibilityDetails[k].birthCertIssueDate,
                        BirthCertIssueBy: body.responsibilityDetails[k].birthCertIssueBy,
                    };
                    xResponsibilities.push(xResponsibility);
                    responsibilityRows +=
                        `<tr>
                            <td class="py-0 pl-2">${k + 1}</td>
                            <td class="py-0 pl-2">${xResponsibility.FullName}</td>
                            <td class="py-0 pl-2">${xResponsibility.DateOfBirth}</td>
                            <td class="py-0 pl-2">${GetAgeFromDate(xResponsibility.DateOfBirth)}</td>
                            <td class="py-0 pl-2">${xResponsibility.Gender}</td>
                            <td class="text-center py-0">
                                <button onclick="ViewResponsibilityDetails('${xResponsibility.Id}')" class="btn btn-xs py-1 px-2 m-0"><i class="fa fa-file"></i></button>
                            </td>
                        </tr>`;
                }
            }

            Details.Responsibilities = xResponsibilities;
            let rBody = `<div class="row">
                            <div class="col-md-12">
                                <div class="bordered-group p-0">
                                    <div class="table-responsive border-bottom">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th style="padding-left:5px;width:20px;text-align:center">#</th>
                                                    <th style="padding-left:5px;">Full Name</th>
                                                    <th style="padding-left:5px;">Date of Birth</th>
                                                    <th style="padding-left:5px;">Age</th>
                                                    <th style="padding-left:5px;">Gender</th>
                                                    <th style="padding-left:5px;width:20px;text-align:center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>${responsibilityRows}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            // console.log(Details.SubType);
            let mrBody = Details.SubType == "0" ? mBody : rBody;
            Details.Body = `${CommonHeader}${mrBody}`;

            break;
        case "APP0004": // Children
            let childRows = "", xChildren = [];
            for (let x = 0; x < body.childDetails.length; x++) {
                let xChild = {
                    Id: x,
                    FirstName: body.childDetails[x].firstName ? body.childDetails[x].firstName : "N/A",
                    LastName: body.childDetails[x].lastName ? body.childDetails[x].lastName : "N/A",
                    MiddleName: body.childDetails[x].middleName ? body.childDetails[x].middleName : "N/A",
                    FullName: body.childDetails[x].firstName && body.childDetails[x].lastName ? `${body.childDetails[x].firstName} ${body.childDetails[x].middleName} ${body.childDetails[x].lastName}` : "N/A",
                    BirthDate: body.childDetails[x].childDateOfBirth ? body.childDetails[x].childDateOfBirth : "N/A",
                    BirthCertDocument: body.childDetails[x].birthCertDocument ? body.childDetails[x].birthCertDocument : "N/A",
                    BirthCertIssueDate: body.childDetails[x].birthCertIssueDate ? body.childDetails[x].birthCertIssueDate : "N/A",
                    BirthCertIssueNo: body.childDetails[x].birthCertIssueNo ? body.childDetails[x].birthCertIssueNo : "N/A",
                    BirthCertIssueBy: body.childDetails[x].birthCertIssueBy ? body.childDetails[x].birthCertIssueBy : "N/A",
                    BirthCertSignedBy: body.childDetails[x].birthCertSignedBy ? body.childDetails[x].birthCertSignedBy : "N/A",
                    SchoolName: body.childDetails[x].schoolName ? body.childDetails[x].schoolName : "N/A",
                    CourseTitle: body.childDetails[x].courseTitle ? body.childDetails[x].courseTitle : "N/A",
                    AdmissionDate: body.childDetails[x].dateOfAdmission ? body.childDetails[x].dateOfAdmission : "N/A",
                    LetterReference: body.childDetails[x].admissionReferenceNo ? body.childDetails[x].admissionReferenceNo : "N/A",
                    LetterDocument: body.childDetails[x].admissionLetterDocument ? body.childDetails[x].admissionLetterDocument : "N/A",
                };
                xChildren.push(xChild);
                childRows += `<tr>
                                <td class="py-0 pl-2">${x + 1}</td>
                                <td class="py-0 pl-2">${xChild.FullName}</td>
                                <td class="py-0 pl-2">${xChild.BirthDate}</td>
                                <td class="py-0 pl-2">${xChild.SchoolName}</td>
                                <td class="py-0 pl-2">${xChild.AdmissionDate}</td>
                                <td class="py-0 pl-2">${xChild.CourseTitle}</td>
                                <td class="text-center py-0">
                                    <button onclick="ViewChildDetails('${xChild.Id}')" class="btn btn-xs py-1 px-2 m-0"><i class="fa fa-file"></i></button>
                                </td>
                            </tr>`;
            }

            Details.Children = xChildren;
            Details.Caption = "Children Education Relief Application";
            Details.Body = `${CommonHeader}
                        <div class="row">
                            <div class="col-md-12">
                                <div class="bordered-group p-0">

                                    <div class="table-responsive border-bottom">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th style="padding-left:5px;width:20px;text-align:center">#</th>
                                                    <th style="padding-left:5px;">Child's Name</th>
                                                    <th style="padding-left:5px;">Date of Birth</th>
                                                    <th style="padding-left:5px;">Name of School</th>
                                                    <th style="padding-left:5px;">Admission Date</th>
                                                    <th style="padding-left:5px;">Course Title</th>
                                                    <th style="padding-left:5px;width:20px;text-align:center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>${childRows}</tbody>
                                        </table>

                                    </div>

                                </div>
                            </div>
                        </div>`;
            break;
        case "APP0008": // Old Age
            Details.OldAge = {
                BirthCertIssueNo: body.birthCertIssueNo ? body.birthCertIssueNo : "N/A",
                BirthCertIssueOn: body.birthCertIssuingDate ? body.birthCertIssuingDate : "N/A",
                BirthCertIssueBy: body.birthCertIssueBy ? body.birthCertIssueBy : "N/A",
                BirthCertSignedBy: body.birthCertSignedBy ? body.birthCertSignedBy : "N/A",
                BirthCertDocument: body.birthCertDocument ? body.birthCertDocument : "N/A",
            };
            Details.Caption = "Old Age Relief Application";
            let PreviewOldAgeDoc = "";
            if (Details.OldAge.BirthCertDocument != "N/A" && Details.OldAge.BirthCertDocument.startsWith("data:")) {
                PreviewOldAgeDoc = `<span class="btn btn-outline-dark mt-2" onclick="OpenAttachedDocument('${Details.OldAge.BirthCertDocument}')">View Attachment</span>`;
            }
            Details.Body = `${CommonHeader}
                        <div class="row">

                            <div class="col-md-6 pr-1">
                                <div class="bordered-group mt-2 pb-2">
                                    <p class="card-title">Birth Certificate Details</p>
                                    <div class="row mb-1">
                                        <div class="col-md-6 pr-1">
                                            <label>Issue Number</label><br />
                                            <input type="text" class="form-control" id="OldAgeBirthCertIssueNumber" value="${Details.OldAge.BirthCertIssueNo}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-6 pl-1">
                                            <label>Issuing Date</label><br />
                                            <input type="text" class="form-control" id="OldAgeBirthCertIssuedOn" value="${Details.OldAge.BirthCertIssueOn}" disabled style="font-weight: 600">
                                        </div>
                                    </div>
                                    <div class="row mb-1">
                                        <div class="col-md-6 pr-1">
                                            <label>Issued By</label><br />
                                            <input type="text" class="form-control" id="OldAgeBirthCertIssuedBy" value="${Details.OldAge.BirthCertIssueBy}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-6 pl-1">
                                            <label>Signed By</label><br />
                                            <input type="text" class="form-control" id="OldAgeBirthCertSignedBy" value="${Details.OldAge.BirthCertSignedBy}" disabled style="font-weight: 600">
                                        </div>
                                    </div>
                                    <div class="row mb-1">
                                        <div class="col-md-6 pr-1">${PreviewOldAgeDoc}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6 pl-1">
                                
                            </div>

                        </div>`;
            break;
        case "APP0005": // Aged Dependants
            let dependantRows = "", xDependants = [];
            for (let x = 0; x < body.agedDepandantsDetails.length; x++) {
                let xDependant = {
                    Id: x,
                    FirstName: body.agedDepandantsDetails[x].firstName ? body.agedDepandantsDetails[x].firstName : "N/A",
                    LastName: body.agedDepandantsDetails[x].lastName ? body.agedDepandantsDetails[x].lastName : "N/A",
                    MiddleName: body.agedDepandantsDetails[x].middleName ? body.agedDepandantsDetails[x].middleName : "N/A",
                    FullName: body.agedDepandantsDetails[x].firstName && body.agedDepandantsDetails[x].lastName ? `${body.agedDepandantsDetails[x].firstName} ${body.agedDepandantsDetails[x].middleName} ${body.agedDepandantsDetails[x].lastName}` : "N/A",
                    BirthDate: body.agedDepandantsDetails[x].agedDateOfBirth ? body.agedDepandantsDetails[x].agedDateOfBirth : "N/A",
                    Gender: body.agedDepandantsDetails[x].gender ? body.agedDepandantsDetails[x].gender === "M" ? "Male" : "Female" : "N/A",
                    MaritalStatus: body.agedDepandantsDetails[x].maritalStatus ? body.agedDepandantsDetails[x].maritalStatus : "N/A",
                    BirthCertDocument: body.agedDepandantsDetails[x].birthCertDocument ? body.agedDepandantsDetails[x].birthCertDocument : "N/A",
                    BirthCertIssueDate: body.agedDepandantsDetails[x].birthCertIssueDate ? body.agedDepandantsDetails[x].birthCertIssueDate : "N/A",
                    BirthCertIssueNo: body.agedDepandantsDetails[x].birthCertIssueNo ? body.agedDepandantsDetails[x].birthCertIssueNo : "N/A",
                    BirthCertIssueBy: body.agedDepandantsDetails[x].birthCertIssueBy ? body.agedDepandantsDetails[x].birthCertIssueBy : "N/A",
                    BirthCertSignedBy: body.agedDepandantsDetails[x].birthCertSignedBy ? body.agedDepandantsDetails[x].birthCertSignedBy : "N/A",
                };
                xDependants.push(xDependant);
                dependantRows += `<tr>
                                <td class="py-0 pl-2">${x + 1}</td>
                                <td class="py-0 pl-2">${xDependant.FullName}</td>
                                <td class="py-0 pl-2">${xDependant.BirthDate}</td>
                                <td class="py-0 pl-2">${xDependant.Gender}</td>
                                <td class="py-0 pl-2">${xDependant.MaritalStatus}</td>
                                <td class="text-center py-0">
                                    <button onClick="ViewDependantDetails('${x}')" class="btn btn-xs py-1 px-2 m-0"><i class="fa fa-file"></i></button>
                                </td>
                            </tr>`;
            }

            Details.Dependants = xDependants;
            Details.Caption = "Aged Dependants Relief Application";
            Details.Body = `${CommonHeader}
                        <div class="row">
                            <div class="col-md-12">
                                <div class="bordered-group p-0">
                                    <div class="table-responsive border-bottom">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th style="padding-left:5px;width:20px;text-align:center">#</th>
                                                    <th style="padding-left:5px;">Dependant's Name</th>
                                                    <th style="padding-left:5px;">Date of Birth</th>
                                                    <th style="padding-left:5px;">Gender</th>
                                                    <th style="padding-left:5px;">Marital Status</th>
                                                    <th style="padding-left:5px;width:20px;text-align:center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>${dependantRows}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            break;
        case "APP0007": // Disability
            Details.Disability = {
                Type: body.typeOfDisability ? body.typeOfDisability : "N/A",
                IssueOn: body.disabilityDisclosureDate ? body.disabilityDisclosureDate : "N/A",
                Document: body.disabilityDoc ? body.disabilityDoc : "N/A",
                IssueBy: body.disabilityDocIssueBy ? body.disabilityDocIssueBy : "N/A",
                IssueNo: body.disabilityDocIssueNo ? body.disabilityDocIssueNo : "N/A",
                SignedBy: body.disabilityDocSignedBy ? body.disabilityDocSignedBy : "N/A",
            };
            Details.Caption = "Disability Relief Application";
            let PreviewDisabilityDoc = "";
            if (Details.Disability.Document != "N/A" && Details.Disability.Document.startsWith("data:")) {
                PreviewDisabilityDoc = `<span class="btn btn-outline-dark mt-2" onclick="OpenAttachedDocument('${Details.Disability.Document}')">View Attachment</span>`;
            }
            Details.Body = `${CommonHeader}
                        <div class="row">

                            <div class="col-md-6">
                                <div class="bordered-group mt-2 pb-3">
                                    <p class="card-title"><b>Details of Disability</b></p>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Type of Disability</label><br />
                                            <input type="text" class="form-control" id="PTRTypeOfDisabilityX" value="${Details.Disability.Type}" disabled style="font-weight: 600">
                                        </div>
                                    </div>
                                </div>
                                <div class="bordered-group mt-2 pb-3">
                                    <p class="card-title"><b>Disability Document</b></p>
                                    <div class="row mb-1">
                                        <div class="col-md-6">
                                            <label>Issue Number</label><br />
                                            <input type="text" class="form-control" id="PTRDisabilityDocIssueNumberX" value="${Details.Disability.IssueNo}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-6">
                                            <label>Issuing Date</label><br />
                                            <input type="text" class="form-control" id="PTRDisabilityDocIssuedOnX" value="${Details.Disability.IssueOn}" disabled style="font-weight: 600">
                                        </div>
                                    </div>
                                    <div class="row mb-1">
                                        <div class="col-md-6">
                                            <label>Issued By</label><br />
                                            <input type="text" class="form-control" id="PTRDisabilityDocIssuedByX" value="${Details.Disability.IssueBy}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-6">
                                            <label>Signed By</label><br />
                                            <input type="text" class="form-control" id="PTRDisabilityDocSignedByX" value="${Details.Disability.SignedBy}" disabled style="font-weight: 600">
                                        </div>
                                    </div>
                                    <div class="row mb-1">
                                        <div class="col-md-6">
                                            ${PreviewDisabilityDoc}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            break;
        case "APP0006": // Pension
            Details.Pension = {
                CurrentAge: body.currentAge ? body.currentAge : "N/A",
                YearsContributed: body.yearsContributed ? body.yearsContributed : "N/A",
                YearsOfWork: body.yearsOfWork ? body.yearsOfWork : "N/A",
                IssueOn: body.birthCertIssueDate ? body.birthCertIssueDate : "N/A",
                Document: body.birthCertDocument ? body.birthCertDocument : "N/A",
                IssueBy: body.birthCertIssuedBy ? body.birthCertIssuedBy : "N/A",
                IssueNo: body.birthCertIssueNo ? body.birthCertIssueNo : "N/A",
                SignedBy: body.birthCertSignedBy ? body.birthCertSignedBy : "N/A",
            };
            Details.Caption = "Pension Relief Application";
            let PreviewPensionDoc = "";
            if (Details.Pension.Document != "N/A" && Details.Pension.Document.startsWith("data:")) {
                PreviewPensionDoc = `<span class="btn btn-outline-dark mt-3" onclick="OpenAttachedDocument('${Details.Pension.Document}')">View Attachment</span>`;
            }
            Details.Body = `${CommonHeader}
                        <div class="row">

                            <div class="col-md-7">
                                <div class="bordered-group mt-2 pb-2">
                                    <p class="card-title"><b>Details of Pension Contribution</b></p>
                                    <div class="row mb-3">
                                        <div class="col-md-4">
                                            <label>Current Age</label><br />
                                            <input type="text" class="form-control" id="PTRPensionCurrentAge" value="${Details.Pension.CurrentAge}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4">
                                            <label>No. Years of Work</label><br />
                                            <input type="text" class="form-control" id="PTRPensionYearsOfWork" value="${Details.Pension.YearsOfWork}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4">
                                            <label>No. Years Contributed</label><br />
                                            <input type="text" class="form-control" id="PTRPensionYearsContributed" value="${Details.Pension.YearsContributed}" disabled style="font-weight: 600">
                                        </div>

                                    </div>

                                    <p class="card-title"><b>Birth Certificate Details</b></p>
                                    <div class="row mb-1">
                                        <div class="col-md-4">
                                            <label>Issue Number</label><br />
                                            <input type="text" class="form-control" id="PTRPensionBirthCertIssueNumber" value="${Details.Pension.IssueNo}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4">
                                            <label>Issuing Date</label><br />
                                            <input type="text" class="form-control" id="PTRPensionBirthCertIssuedOn" value="${Details.Pension.IssueOn}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4">
                                            <label>Issued By</label><br />
                                            <input type="text" class="form-control" id="PTRPensionBirthCertIssuedBy" value="${Details.Pension.IssueBy}" disabled style="font-weight: 600">
                                        </div>
                                    </div>
                                    <div class="row mb-1">
                                        <div class="col-md-4">
                                            <label>Signed By</label><br />
                                            <input type="text" class="form-control" id="PTRPensionBirthCertSignedBy" value="${Details.Pension.SignedBy}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-4">${PreviewPensionDoc}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-5">
                                &nbsp;
                            </div>


                        </div>`;
            break;
        case "APP0009": // Life Assurance

            Details.Caption = "Life Assurance Relief Application";
            Details.Body = `${CommonHeader}`;
            break;
        case "APP0010": // Social Security

            Details.Caption = "Social Security Relief Application";
            Details.Body = `${CommonHeader}`;
            break;
        case "APP0011": // Cost of training
            Details.Training = {
                SchoolName: body.schoolName ? body.schoolName : "N/A",
                CourseTitle: body.courseTitle ? body.courseTitle : "N/A",
                CourseDuration: body.courseDuration ? body.courseDuration : "N/A",
                AdmissionDate: body.admissionDate ? body.admissionDate : "N/A",
                LetterReference: body.admissionLetterReferenceNo ? body.admissionLetterReferenceNo : "N/A",
                LetterDocument: body.admissionLetterDocument ? body.admissionLetterDocument : "N/A",
            };
            Details.Caption = "Cost of Training Relief Application";
            let PreviewTrainingDoc = "";
            if (Details.Training.LetterDocument != "N/A" && Details.Training.LetterDocument.startsWith("data:")) {
                PreviewTrainingDoc = `<span class="btn btn-block btn-outline-dark mt-3" onclick="OpenAttachedDocument('${Details.Training.LetterDocument}')">View Attachment</span>`;
            }
            Details.Body = `${CommonHeader}
                        <div class="row">
                            <div class="col-md-6 pr-1">
                                <div class="bordered-group">
                                    <p class="card-title"><b>Training Details</b></p>

                                    <div class="row">
                                        <div class="col-md-5 pr-1">
                                            <label>Institution Name</label>
                                            <input type="text" class="form-control" id="PTRTrainingSchoolName" value="${Details.Training.SchoolName}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-7 pl-1">
                                            <label>Course Title</label>
                                            <input type="text" class="form-control" id="PTRTrainingCourseTitle" value="${Details.Training.CourseTitle}" disabled style="font-weight: 600">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-5 pr-1 my-2">
                                            <label>Duration (Months)</label>
                                            <input type="text" class="form-control" id="PTRTrainingCourseDuration" value="${Details.Training.CourseDuration}" disabled style="font-weight: 600">
                                        </div>
                                    </div>

                                </div>

                                <div class="bordered-group">
                                    <p class="card-title"><b>Attach copy of admission letter</b></p>

                                    <div class="row">
                                        <div class="col-md-6 pr-1">
                                            <label>Admission Date</label>
                                            <input type="text" class="form-control" id="PTRTrainingAdmissionDate" value="${Details.Training.AdmissionDate}" disabled style="font-weight: 600">
                                        </div>
                                        <div class="col-md-6 pl-1">
                                            <label>Reference No.</label>
                                            <input type="text" class="form-control" id="PTRTrainingAdmissionRefNo" value="${Details.Training.LetterReference}" disabled style="font-weight: 600">
                                        </div>
                                    </div>
                                    <div class="row pb-3">
                                        <div class="col-md-6 pr-1">${PreviewTrainingDoc}</div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            break;
    }

    // Show Form
    $("#PageDataBody").prop("hidden", true);
    $("#PTRSwitchBorad").prop("hidden", true);
    $("#PTRDetails").prop("hidden", false);


    // Hide All Tab Titles
    $("li[class*='Tabx']").prop('hidden', true);

    // Hide All Tab Contents
    $("div[class*='Cox']").prop('hidden', true);

    // Show Details Tab & Content
    $(".CoxPTRDetails, .TabxAPP0000, .TabxAPP0099, #PTRAPP0000, #PTRAPP0099").prop('hidden', false);
    $("#pgHeader").text(Details.Caption);


    // DISPLAY COMMON DETAILS
    $("#PTRGeneralTINX").val(nameTIN.TIN);
    $("#PTRGeneralNameX").val(nameTIN.Name);

    $("#PTRGeneralBirthDateX").val(Details.Applicant.DateOfBirth);
    $("#PTRGeneralMaritalX").val(Details.Applicant.MaritalStatus);
    $("#PTRGeneralGenderX").val(Details.Applicant.Gender);
    $("#PTRGeneralPhoneX").val(Details.Applicant.PhoneNo);
    $("#PTRGeneralEmailX").val(Details.Applicant.EmailAddress);
    $("#PTRGeneralMotherNameX").val(Details.Applicant.MothersMaidenName);
    $("#PTRGeneralEmployerTINX").val(Details.Employer.TIN);
    $("#PTRGeneralEmployerNameX").val(Details.Employer.Name);
    $("#PTRGeneralEmployerEmailX").val(Details.Employer.Email);
    $("#PTRGeneralEmployerPhoneX").val(Details.Employer.Phone);
    $("#PTRGeneralEmployerAddressX").val(Details.Employer.Address);

    $("#PTRAPP0099X").html(Details.Body);
    console.log(Details.Body);

    // Store for Re-Use
    PTRApplicationData = Details;
}

var ViewResponsibilityDetails = (pos) => {
    let vResponsibility = PTRApplicationData.Responsibilities[pos];
    // console.log({ vResponsibility });

    $("#PTRMarriageDependantFirstNameX").val(vResponsibility.FirstName);
    $("#PTRMarriageDependantMiddleNameX").val(vResponsibility.MiddleName);
    $("#PTRMarriageDependantLastNameX").val(vResponsibility.LastName);
    $("#PTRMarriageDependantBirthDateX").val(vResponsibility.DateOfBirth);
    $("#PTRMarriageDependantGenderX").val(vResponsibility.Gender);
    $("#PTRMarriageDependantNumberX").val(vResponsibility.BirthCertIssueNo);
    $("#PTRMarriageDependantIssuedOnX").val(vResponsibility.BirthCertIssueDate);
    $("#PTRMarriageDependantIssuedByX").val(vResponsibility.BirthCertIssueBy);
    $("#PTRMarriageDependantSignedByX").val(vResponsibility.BirthCertSignedBy);

    if (vResponsibility.BirthCertDocument != "N/A") {
        $("#ViewMarriageDependantCertX").html(`<span class="btn btn-block btn-outline-dark mt-3" onclick="OpenAttachedDocument('${vResponsibility.BirthCertDocument}')">View Attachment</span>`);
    }

    $("#PTRMarriageDependantModalX").modal("show");
}

var ViewChildDetails = (pos) => {
    let vChild = PTRApplicationData.Children[pos];
    // console.log({ vChild });

    $("#PTRChildFirstNameX").val(vChild.FirstName).prop("disabled", true);
    $("#PTRChildMiddleNameX").val(vChild.MiddleName).prop("disabled", true);
    $("#PTRChildLastNameX").val(vChild.LastName).prop("disabled", true);
    $("#PTRChildBirthDateX").val(vChild.BirthDate).prop("disabled", true);
    $("#PTRChildBirthCertIssueNumberX").val(vChild.BirthCertIssueNo).prop("disabled", true);
    $("#PTRChildBirthCertIssuedOnX").val(vChild.BirthCertIssueDate).prop("disabled", true);
    $("#PTRChildBirthCertIssuedByX").val(vChild.BirthCertIssueBy).prop("disabled", true);
    $("#PTRChildBirthCertSignedByX").val(vChild.BirthCertSignedBy).prop("disabled", true);
    $("#PTRChildSchoolNameX").val(vChild.SchoolName).prop("disabled", true);
    $("#PTRChildAdmissionDateX").val(vChild.AdmissionDate).prop("disabled", true);
    $("#PTRChildCourseX").val(vChild.CourseTitle).prop("disabled", true);
    $("#PTRChildAdmissionRefNoX").val(vChild.LetterReference).prop("disabled", true);
    if (vChild.BirthCertDocument != "N/A") {
        $("#HoldChildBirthCert").prop("hidden", false);
        $("#OpenChildBirthCert").html(`<span class="btn btn-outline-dark mt-3" onclick="OpenAttachedDocument('${vChild.BirthCertDocument}')">View Attachment</span>`);
    }
    if (vChild.LetterDocument != "N/A") {
        $("#OpenChildAdminLetter").html(`<span class="btn btn-outline-dark mt-3" onclick="OpenAttachedDocument('${vChild.LetterDocument}')">View Attachment</span>`);
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
    $("#XChildDetailsModal").modal("show");
}

var ViewDependantDetails = (pos) => {
    let vDependant = PTRApplicationData.Dependants[pos];
    // console.log({ vDependant });

    $("#PTRDependantFirstNameX").val(vDependant.FirstName).prop("disabled", true);
    $("#PTRDependantMiddleNameX").val(vDependant.MiddleName).prop("disabled", true);
    $("#PTRDependantLastNameX").val(vDependant.LastName).prop("disabled", true);
    $("#PTRDependantBirthDateX").val(vDependant.BirthDate).prop("disabled", true);
    $("#PTRDependantGenderX").val(vDependant.Gender).prop("disabled", true);
    $("#PTRDependantMaritalX").val(vDependant.MaritalStatus).prop("disabled", true);
    $("#PTRDependantNumberX").val(vDependant.BirthCertIssueNo).prop("disabled", true);
    $("#PTRDependantIssuedOnX").val(vDependant.BirthCertIssueDate).prop("disabled", true);
    $("#PTRDependantIssuedByX").val(vDependant.BirthCertIssueBy).prop("disabled", true);
    $("#PTRDependantSignedByX").val(vDependant.BirthCertSignedBy).prop("disabled", true);
    if (vDependant.BirthCertDocument != "N/A") {
        $("#OpenDependantBirthCert").prop("hidden", false);
        $("#OpenDependantBirthCert").html(`<span class="btn btn-outline-dark mt-3" onclick="OpenAttachedDocument('${vDependant.BirthCertDocument}')">View Attachment</span>`);
    }

    // Show Modal
    $("#XPTRDependantModal").modal("show");
}

var OpenAttachedDocument = (docData) => {

    if (docData != "N/A" && docData.startsWith("data:")) {

        // Get file type
        let mimeType = (docData.split(";")[0]).replace("data:", "");
        let fileExt = GetExtensionFromMime(mimeType);

        //Usage example:
        Base64ToFile(docData, `joejo_enchill.${fileExt}`, mimeType)
            .then((file) => {
                //console.log(file);

                PromptConfig = {
                    Title: "Preview",
                    Message: `<div style="width:468px!important;height:480px!important;display:block;border:2px solid #0C7AA0;">
                                 <object data="${docData}" type="${mimeType}" style="width:100%!important;display:block;height:480px!important;">
                                    <div class="p-3">
                                        <p><b>Unable to open the attachment.</b></p>
                                        <p><i>Either your browser does not support PDF viewer or PDF viewer plugin is disabled in the browser's settings.</i></p>
                                    </div>
                                  </object>
                             </div>`,
                    Size: "md", //md|lg|sm
                    Positive: {
                        Title: "OK",
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
                ShowPrompt();
            });

    }
}

var PTRStatusComments = [];
var ViewStatusComments = (id) => {
    //console.log({ id });

    // Show Preloader
    $('body').showLoading();

    var postData = JSON.stringify({
        TaxPayerId: id
    });
    // console.log("Post Data", postData);

    var postUrl = `?handler=GetPTRStatusComments`;
    $.post(postUrl, postData, function (data, status) {
        // console.log({ data });

        // Hide Preloader
        $('body').hideLoading();
        if (data.status == "Successful" && data.body) {
            var comments = data.body;
            if (comments.length > 0) {
                PTRStatusComments = [];
                for (let c = 0; c < comments.length; c++) {
                    if (comments[c].comment) {
                        PTRStatusComments.push({
                            From: "GRA",
                            Body: comments[c].comment,
                            Date: comments[c].dateAndTime ? comments[c].dateAndTime : "",
                            Type: "txt"
                        });
                    }
                    if (comments[c].reply) {
                        PTRStatusComments.push({
                            From: "Me",
                            Body: comments[c].reply,
                            Date: comments[c].replyTime ? comments[c].replyTime : "",
                            Type: "txt"
                        });
                    }
                }

                SetPTRStatusComments();
            }
        }
    }).fail(function (response) {
        // Hide Preloader
        $('body').hideLoading();
    });

}

var SetPTRStatusComments = () => {

    var comments = "";
    if (PTRStatusComments && PTRStatusComments.length > 0) {
        // PTRStatusComments.sortBy(function (o) { return -o.Date });
        for (let c = 0; c < PTRStatusComments.length; c++) {
            // Control Message
            var cc = "CommentToMe";
            var cf = PTRStatusComments[c].From;
            if (cf === "Me") {
                cc = "CommentFromMe";
            }
            var cb = PTRStatusComments[c].Body;
            if (PTRStatusComments[c].Type === "img") {
                cb = `<img src="${PTRStatusComments[c].Body}" style="max-width:323px!important;" />`;
            }
            //var cDate = PTRStatusComments[c].Date != null || PTRStatusComments[c].Date != "" ? (new Date(PTRStatusComments[c].Date)).toLocaleDateString("en-US", YearOptions) : "----";
            var cDate = PTRStatusComments[c].Date;// ? PTRStatusComments[c].Date : "";

            comments += `<p class="${cc}"><b style="font-weight:bold;color:#364c66 !important"><i>${cf}</i></b>
                           <br>${cb}<br><small class="text-right" stylr="width: 100%">${cDate}</small></p>`;
        }
        $("#CommentsBox").html(comments);

        // Scroll to The Bottom
        ScollToCommentsBottom();

        // Show modal
        $("#PTRCommentsModal").modal("show");
    }
}

var ScollToCommentsBottom = function () {
    var height = PTRStatusComments.length * 123;
    $("#CommentsBox").animate({ scrollTop: height }, 'slow');
}
