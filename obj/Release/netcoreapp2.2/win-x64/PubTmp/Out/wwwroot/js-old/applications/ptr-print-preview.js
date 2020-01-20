

// ==============================================
//          PRINT PREVIEW & DOWNLOAD
//===============================================
$("OpenPrintPreview").bind("click", () => {
    OpenPrintPreview();
})

var PreviewPTRApplication = (id) => {
    let AppliedData = FindItemFromList(PTRApplicationsData, id);
    GetPTRApplicationPreview(AppliedData.Id, AppliedData.Type.Code);

    // Show Modal
    $("#PrintPreviewModal").modal("show");
}

var GetPTRApplicationPreview = (appId, typeCode) => {
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
            ShowPTRApplicationPreview(data.body, appId);
        } else {
            toastr.info("An error occured. Please try again.");
        }
        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (res) {
        // Hide Preloader
        $('body').hideLoading();
    });
}

var ShowPTRApplicationPreview = (body, id) => {
    // Get Appication Header
    let AppliedData = FindItemFromList(PTRApplicationsData, id);

    // Get Application Details
    var Preview = {
        Type: AppliedData.Type,
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

    switch (Preview.Type.Code) {
        case "APP0003":
            Preview.Caption = "";
            Preview.SubType = body.subType;
            Preview.Spouse = {
                DateOfBirth: body.spouseDateOfBirth ? body.spouseDateOfBirth : "N/A",
                Age: body.spouseDateOfBirth ? GetAgeFromDate(body.spouseDateOfBirth, true) : "N/A",
                Email: body.spouseEmail ? body.spouseEmail : "N/A",
                FirstName: body.spouseFirstName ? body.spouseFirstName : "N/A",
                Gender: body.spouseGender ? body.spouseGender === "M" ? "Male" : "Female" : "N/A",
                LastName: body.spouseLastName ? body.spouseLastName : "N/A",
                MiddleName: body.spouseMiddleName ? body.spouseMiddleName : "N/A",
                FullName: `${body.spouseFirstName} ${body.spouseMiddleName} ${body.spouseLastName}`,
                Phone: body.spousePhone ? body.spousePhone : "N/A",
                TIN: body.spouseTIN ? body.spouseTIN : "N/A"
            };
            Preview.Certificate = {
                RegistrationDate: body.registrationDate ? body.registrationDate : "N/A",
                Document: body.certDocument ? body.certDocument : "N/A",
                IssueNo: body.certIssueNo ? body.certIssueNo : "N/A",
                IssuedBy: body.certIssuedBy ? body.certIssuedBy : "N/A",
                IssuingDate: body.certIssuingDate ? body.certIssuingDate : "N/A",
                SignedBy: body.certSignedBy ? body.certSignedBy : "N/A",
            };
            let mBody = `
                    <div class="row mt-3 pt-3" style="margin-bottom: 12px;">
                        <table class="table" style="width:100%!important; font-size:18px !important;">
                            <thead class="thead-light">
                                <tr>
                                    <th colspan="4">Spouse's Information</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td style="width: 20%">Spouse Name</td>
                                    <th colspan="3"><span style="font-weight: bold;">${Preview.Spouse.FullName}</span></th>
                                </tr>
                                <tr>
                                    <td>Spouse TIN</td>
                                    <td><span style="font-weight: bold;">${Preview.Spouse.TIN}</span></td>
                                    <td style="width: 20%">Gender</td>
                                    <td><span style="font-weight: bold;">${Preview.Spouse.Gender}</span></td>
                                </tr>
                                <tr>
                                    <td>Date of Birth</td>
                                    <td><span style="font-weight: bold;">${Preview.Spouse.DateOfBirth}</span></td>
                                    <td style="width: 20%">Current Age</td>
                                    <td><span style="font-weight: bold;">${Preview.Spouse.Age}</span></td>
                                </tr>
                                <tr>
                                    <td>Phone Number</td>
                                    <td><span style="font-weight: bold;">${Preview.Spouse.Phone}</span></td>
                                    <td style="width: 20%">Email Address</td>
                                    <td><span style="font-weight: bold;">${Preview.Spouse.Email}</span></td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                    <div class="row mt-3 pt-3" style="margin-bottom: 12px;">
                        <table class="table" style="width:100%!important; font-size:18px !important;">
                            <thead class="thead-light">
                                <tr>
                                    <th colspan="4">Marriage Registration</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td style="width: 20%">Date</td>
                                    <th colspan="3"><span style="font-weight: bold;">${Preview.Certificate.RegistrationDate}</span></th>
                                </tr>
                                <tr>
                                    <td>Number</td>
                                    <td><span style="font-weight: bold;">${Preview.Certificate.IssueNo}</span></td>
                                    <td style="width: 20%">Issuing Date</td>
                                    <td><span style="font-weight: bold;">${Preview.Certificate.IssuingDate}</span></td>
                                </tr>
                                <tr>
                                    <td>Issued By</td>
                                    <td style="width: 20%"><span style="font-weight: bold;">${Preview.Certificate.IssuedBy}</span></td>
                                    <td>Signed By</td>
                                    <td><span style="font-weight: bold;">${Preview.Certificate.SignedBy}</span></td>
                                </tr>
                            </tbody>

                        </table>
                    </div>`;

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
                        DateOfBirth: body.responsibilityDetails[k].dateOfBirth ? body.responsibilityDetails[k].dateOfBirth : "N/A",
                        Age: body.responsibilityDetails[k].dateOfBirth ? GetAgeFromDate(body.responsibilityDetails[k].dateOfBirth, true) : "N/A",
                        BirthCertDocument: body.responsibilityDetails[k].birthCertDocument,
                        BirthCertSignedBy: body.responsibilityDetails[k].birthCertSignedBy,
                        BirthCertIssueNo: body.responsibilityDetails[k].birthCertIssueNo,
                        BirthCertIssueDate: body.responsibilityDetails[k].birthCertIssueDate,
                        BirthCertIssueBy: body.responsibilityDetails[k].birthCertIssueBy,
                    };
                    xResponsibilities.push(xResponsibility);

                    // console.log({ xResponsibility });

                    responsibilityRows +=
                        `<tr>
                            <td style="width:5px!important;">${k + 1}</td>
                            <td class="py-0 pl-2">${xResponsibility.FullName}</td>
                            <td class="py-0 pl-2">${xResponsibility.DateOfBirth}</td>
                            <td class="py-0 pl-2">${xResponsibility.Age}</td>
                            <td class="py-0 pl-2">${xResponsibility.Gender}</td>
                        </tr>`;
                }
            }

            Preview.Responsibilities = xResponsibilities;
            let rBody = `
                    <div class="row mt-3 pt-3" style="margin-bottom: 12px;">
                        <table class="table" style="width:100%!important; font-size:18px !important;">
                            <thead class="thead-light">
                                <tr>
                                    <th colspan="5">Responsibilities</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th style="width:5px!important;text-align:left;">#</th>
                                    <th style="padding-left:5px;text-align:left;">Full Name</th>
                                    <th style="padding-left:5px;text-align:left;">Date of Birth</th>
                                    <th style="padding-left:5px;text-align:left;">Age</th>
                                    <th style="padding-left:5px;text-align:left;">Gender</th>
                                </tr>
                                ${responsibilityRows}
                            </tbody>
                        </table>
                    </div>`;

            Preview.Body = Preview.SubType == "0" ? mBody : rBody;
            break;
        case "APP0004": // Children
            console.log(body.childDetails);

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
                                <td style="width:5px!important;">${x + 1}</td>
                                <td class="py-0 pl-2">${xChild.FullName}</td>
                                <td class="py-0 pl-2">${xChild.BirthDate}</td>
                                <td class="py-0 pl-2">${xChild.SchoolName}</td>
                                <td class="py-0 pl-2">${xChild.AdmissionDate}</td>
                                <td class="py-0 pl-2">${xChild.CourseTitle}</td>
                            </tr>`;
            }

            Preview.Children = xChildren;
            Preview.Body = `
                    <div class="row mt-3 pt-3" style="margin-bottom: 12px;">
                        <table class="table" style="width:100%!important; font-size:18px !important;">
                            <thead class="thead-light">
                                <tr>
                                    <th colspan="6">Children Education</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th style="width:5px;text-align:left;">#</th>
                                    <th style="padding-left:5px;">Child's Name</th>
                                    <th style="padding-left:5px;">Date of Birth</th>
                                    <th style="padding-left:5px;">Name of School</th>
                                    <th style="padding-left:5px;">Admission Date</th>
                                    <th style="padding-left:5px;">Course Title</th>
                                </tr>
                                ${childRows}
                            </tbody>
                        </table>
                    </div>`;
    }

    
    // Header
    $("#PTRApplicantVW").text(nameTIN.Name);
    $("#PTRTINVW").text(`TIN: ${nameTIN.TIN}`);
    $("#PTRApplicationVW").text(Preview.Type.Description);
    $("#PTRTaxOfficeVW").text(`Tax Office: ${TaxPayerData.taxOffice.name}`);
    $("#DateSubmittedVW").html(`<i style="font-size: 14px;">Date:</i>&nbsp;&nbsp; ${Preview.Application.Date}`);
    $("#CurrentStatusVW").html(`<i style="font-size: 14px;">Status:</i>&nbsp;&nbsp; ${Preview.Status.Title}`);

    // Personal Details
    $("#LastNameVW").text(TaxPayerData.lastName);
    $("#FirstNameVW").text(TaxPayerData.firstName);
    $("#MiddleNameVW").text(TaxPayerData.otherNames);
    $("#TINVW").text(TaxPayerData.tin);
    $("#NationalityVW").text(TaxPayerData.nationality.name);
    let vGender = TaxPayerData.gender === "M" ? "Male" : TaxPayerData.gender === "F" ? "Female" : "N/A";
    $("#GenderVW").text(vGender);
    $("#DateOfBirthVW").text(TaxPayerData.dateOfBirth);
    $("#MaritalStatusVW").text(TaxPayerData.maritalStatus);
    $("#MothersMaidenNameVW").text(TaxPayerData.mothersMaidenName);

    // Employer's Information
    $("#EmployerNameVW").text(Preview.Employer.Name);
    $("#EmployerTINVW").text(Preview.Employer.TIN);
    $("#EmployerAddressVW").text(Preview.Employer.Address);
    $("#EmployerPhoneVW").text(Preview.Employer.Phone);
    $("#EmployerEmailVW").text(Preview.Employer.Email);

    // Specific Body
    $("#PTRBodyVW").html(Preview.Body);
    
}

$("#PTRPrintPreview").bind("click", () => {
    //Hide Preview
    $('#PrintPreviewModal').modal('hide');

    var divContents = $("#PrintContent").html();
    let itmTitle = $("#PTRApplicationVW").val();

    var printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.write(`<html><head><title>${nameTIN.TIN} - Personal Tax Relieve - ${itmTitle}</title>`);
    printWindow.document.write('<link type="text/css" href="css/app.css" rel="stylesheet"/>')
    printWindow.document.write('<style>.table tbody td {vertical-align: middle;}.table td{padding: .35rem 1rem;border-top: 1px solid #efefef;}</style>')
    printWindow.document.write('</head><body >');
    printWindow.document.write(divContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(function () { printWindow.print(); }, 1000);
    //printWindow.close();
});

$("#PTRPrintDownload").bind("click", () => {
    // Reduce font-size from 18px to 10px [For Downlaod Qulaity]
    $("#PrintContent").html($("#PrintContent").html().replace(/18px/g, "10px"))

    var digits = Math.floor(Math.random() * 9000000000) + 1000000000;
    var name = `${nameTIN.TIN}-PTR-${digits}.pdf`;
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
});