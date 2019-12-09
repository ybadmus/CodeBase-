var TaxPayerData = {},
    ApplicationType = {
        Id: "5bf49af4-19ab-4440-8273-5b037eb1f562",
        Code: "APP0002",
        Description: "WHT Exemption"
    },
    YearOptions = { year: 'numeric', month: 'long', day: 'numeric' },
    OtherPurposeId = "86f32679-ad0e-4ea8-9459-0fcbcb0c95c1",
    WHTEStatusSuspendedId = "4",
    WHTEApplications = [],
    ResidencyTypes = [],
    WHTTypes = [],
    NewWHTEApplications = [],
    NewWHTEApplication = {},
    PostWHTEApplications = [],
    TCCDocument = {},
    TCCDocumentTypes = [],
    TCCDocuments = [],
    CommentFiles = [],
    EditedDocuments = [],
    CommentFileExts = ["png", "jpg", "jpeg", "pdf"], //, "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
    WHTEReasons = [];

$(document).ready(() => {
    // Get TaxPayer Data
    GetTaxPayerData();

    //
    GetTCCDocumentTypes();

    // Get Residency Types
    GetResidencyTypes();

    // Get WHTE Applications
    GetWHTEApplications();

    // Reasons
    GetWHTEReasons();
});

// Get TaxPayer Data
var GetTaxPayerData = () => {
    // AutoPopulate
    $("#WHTETIN").val(nameTIN.TIN);
    $("#WHTEName").val(nameTIN.Name);

    var dataModel = {
        TIN: nameTIN.TIN // Get from localStorage
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerData`;
    $.post(postUrl, postData, function (data, status) {
        //console.log({ data });

        // Display on view
        if (data.status === "Successful") {
            // Keep object for future use.
            TaxPayerData = data.body;

            // AutoPopulate
            $("#WHTETaxOffice").val(TaxPayerData.mobileNumber ? TaxPayerData.mobileNumber : "N/A")
            $("#WHTEPhone").val(TaxPayerData.mobileNumber ? TaxPayerData.mobileNumber : "N/A");
            $("#WHTEEmail").val(TaxPayerData.emailAddress ? TaxPayerData.emailAddress : "N/A");
        }
    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
    });
}

// Load Types of Application
var GetTypeOfApplication = () => {
    var dataModel = {
        CodeType: "APT",
    };

    var postData = JSON.stringify(dataModel);
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, function (data, status) {
        if (data.body && data.body.length > 0) {
            var options = "";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].id}'>${data.body[i].description}</option>`;
            }
        }
    }).fail(function (response) {
    });

}

var GetResidencyTypes = () => {
    var dataModel = {
        CodeType: "RES",
    };
    var postData = JSON.stringify(dataModel);
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, (data, status) => {
        // console.log({ data });

        if (data.body && data.body.length > 0) {
            ResidencyTypes = [];
            for (let i = 0; i < data.body.length; i++) {
                ResidencyTypes.push({
                    Id: data.body[i].id,
                    Description: data.body[i].description
                });
            }
            SetResidencyTypes();
        }
    }).fail((res) => {
    });
}


var GetTCCDocumentTypes = () => {
    var dataModel = {
        CodeType: "MUT",
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.body.length > 0) {

            // Sort Data by data.code
            data.body.sortBy((d) => { return d.code });

            TCCDocumentTypes = data.body;
        }
    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);
    });

}

var SetResidencyTypes = () => {
    let optRes = `<option value="">Choose one</option>`;
    for (let r = 0; r < ResidencyTypes.length; r++) {
        optRes += `<option value="${ResidencyTypes[r].Id}">${ResidencyTypes[r].Description}</option>`;
    }
    $("#WHTEResidency").html(optRes);
}

var FindItemById = (Items, Id) => {
    return $.grep(Items, (Item) => Item.Id === Id)[0];
}


var ResetApplication = () => {
    let tableHolder = "";
    let res = $("#WHTEResidency").val();
    if (res) {
        tableHolder = `
                    <div class="row">
                        <div class="col-md-12">
                            <button onclick="AddWHTEApplication()" class="btn btn-success">Add Record</button>
                        </div>
                    </div>
                    <div class="table-responsive border-bottom">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th style="padding-left:5px;width:20px;text-align:center">#</th>
                                    <th style="padding-left:5px;width:340px;">WHT Type</th>
                                    <th style="padding-left:5px;">Supporting Reason</th>
                                    <th style="padding-left:5px;">Additional Comments</th>
                                    <th style="padding-left:5px;width:20px;text-align:center">Action</th>
                                </tr>
                            </thead>
                            <tbody id="NewWHTEApplications"></tbody>
                        </table>
                    </div>`;
        $("#WHTEResidency").prop("disabled", true);
        $("#ResetResidency").prop("hidden", false);
    }
    $("#NewWHTEHolder").html(tableHolder);

}

var ResetResidency = () => {
    if (NewWHTEApplications && NewWHTEApplications.length > 0) {

    } else {
        
    }

    $("#WHTEResidency").prop("disabled", false).val($("#WHTEResidency option:first").val());
    $("#ResetResidency").prop("hidden", true);
    $("#NewWHTEHolder").html("");
}

var GetWHTTypes = () => {
    let id = $("#WHTEResidency").val();
    if (id) {

        var dataModel = {
            CodeType: id,
        };
        var postData = JSON.stringify(dataModel);
        var postUrl = `?handler=GetWHTTypeByResidence`;
        $.post(postUrl, postData, (data, status) => {
            // console.log({ data });

            if (data.body && data.body.length > 0) {
                WHTTypes = [];
                for (let i = 0; i < data.body.length; i++) {
                    WHTTypes.push({
                        Id: data.body[i].id,
                        Description: data.body[i].description
                    });
                }
                SetWHTTypes();
            }
        }).fail((res) => {

        });

    } else {
        $(`#WHTEType`).html(`<option value="">Choose one</option>`);
    }

}


var SetWHTTypes = (id = null) => {
    let optTyps = `<option value="">Choose one</option>`;
    for (let w = 0; w < WHTTypes.length; w++) {
        let selT = id && id === WHTTypes[w].Id ? "Selected" : "";
        optTyps += `<option value="${WHTTypes[w].Id}" ${selT}>${WHTTypes[w].Description}</option>`;

    }
    $(`#WHTEType`).html(optTyps);
}

var GetWHTEReasons = () => {
    var dataModel = {
        CodeType: "EAR",
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.body.length > 0) {

            // Sort Data by data.code
            data.body.sortBy((d) => { return d.code });

            WHTEReasons = [];
            for (let i = 0; i < data.body.length; i++) {
                WHTEReasons.push({
                    Id: data.body[i].id,
                    Description: data.body[i].description
                });
            }

            SetWHTEReasons();
        }
    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);
    });

}

var SetWHTEReasons = (id = null) => {
    let optRea = `<option value="">Choose one</option>`;
    for (let r = 0; r < WHTEReasons.length; r++) {
        let selT = id && id === WHTEReasons[r].Id ? "Selected" : "";
        optRea += `<option value="${WHTEReasons[r].Id}" ${selT}>${WHTEReasons[r].Description}</option>`;
    }
    $("#WHTEReason").html(optRea);
}


var ShowOtherReasons = function () {
    var value = $("#WHTEReason option:selected").text();
    var other = value.toLowerCase();
    if (other.includes("other")) {
        $("#AdditionalComments").prop("hidden", false);
    } else {
        $("#AdditionalComments").prop("hidden", true);
        $("#WHTEComments").val(value)
    }
}

var AddWHTEApplication = () => {
    // Control Buttons
    $("#SaveWHTEApplication").prop("hidden", false);
    $("#UpdateWHTEApplication").prop("hidden", true);

    // Reset Fields
    SetWHTTypes();
    SetWHTEReasons();
    $(`#WHTEComments`).val("");

    // Show Modal
    $("#AddWHTERecordModal").modal("show");

    // AutoFill WHT Types
    GetWHTTypes();
}


var ShowWHTApplications = () => {
    if (NewWHTEApplications && NewWHTEApplications.length > 0) {

        // Fill Table
        let wtheRow = "";
        for (let m = 0; m < NewWHTEApplications.length; m++) {
            wtheRow += `
                <tr>
                    <td>${NewWHTEApplications[m].Id}</td>
                    <td>${NewWHTEApplications[m].Type.Description}</td>
                    <td>${NewWHTEApplications[m].Reason.Description}</td>
                    <td>${NewWHTEApplications[m].Comments}</td>
                    <td class="text-center py-0">
                        <button onclick="EditWHTEApplication('${NewWHTEApplications[m].Id}')" class="btn btn-xs py-1 px-2 m-0" title="Edit"><i class="fa fa-edit"></i></button>
                    </td>
                </tr>`;

        }
        $("#NewWHTEApplications").html(wtheRow)

        // Enable Submit Button
        if (NewWHTEApplications && NewWHTEApplications.length > 0) {
            $("#SubmitButton").prop("disabled", false);
        } else {
            $("#SubmitButton").prop("disabled", true);
        }
    }
}

var SaveWHTEApplication = () => {
    let typeId = $(`#WHTEType`).val();
    let reasonId = $(`#WHTEReason`).val();
    let comments = $(`#WHTEComments`).val();

    if (typeId && reasonId && comments) {
        // New Object
        let type = FindItemById(WHTTypes, typeId);
        let reason = FindItemById(WHTEReasons, reasonId);
        let pos = $('#NewWHTEApplications tr').length;

        // Get
        NewWHTEApplication = {
            Id: `${pos + 1}`,
            Type: { Id: type.Id, Description: type.Description },
            Reason: { Id: reason.Id, Description: reason.Description },
            Comments: comments
        };

        // Store
        NewWHTEApplications.push(NewWHTEApplication);

        ShowWHTApplications();

        // Hide Modal
        $("#AddWHTERecordModal").modal("hide");

    } else {
        toastr.error("All fields are required.");
    }
}

var EditWHTEApplication = (pos) => {
    NewWHTEApplication = FindItemById(NewWHTEApplications, pos);

    if (NewWHTEApplication) {
        SetWHTTypes(NewWHTEApplication.Type.Id);
        SetWHTEReasons(NewWHTEApplication.Reason.Id);
        $(`#WHTEComments`).val(NewWHTEApplication.Comments);

        // Show Modal
        $("#SaveWHTEApplication").prop("hidden", true);
        $("#UpdateWHTEApplication").prop("hidden", false);
        $("#AddWHTERecordModal").modal("show");
    }
}

var UpdateWHTEApplication = () => {
    let typeId = $(`#WHTEType`).val();
    let reasonId = $(`#WHTEReason`).val();
    let comments = $(`#WHTEComments`).val();

    if (typeId && reasonId && comments) {
        // New Object
        let type = FindItemById(WHTTypes, typeId);
        let reason = FindItemById(WHTEReasons, reasonId);

        // Get
        NewWHTEApplication.Type = { Id: type.Id, Description: type.Description };
        NewWHTEApplication.Reason = { Id: reason.Id, Description: reason.Description };
        NewWHTEApplication.Comments = comments
        
        // Store
        NewWHTEApplications[parseInt(NewWHTEApplication.Id) - 1] = NewWHTEApplication;
        
        ShowWHTApplications();

        // Hide Modal
        $("#AddWHTERecordModal").modal("hide");
        
    } else {
        toastr.error("All fields are required.");
    }
}


var GetApplicantDetails = () => {
    let whtrTIN = $("#WHTETIN").val();
    
    if (whtrTIN === $("#UserTIN").text() && whtrTIN.length === 11) {

        // Show Preloader
        $('body').showLoading();
        
        var dataModel = {
            TIN: whtrTIN
        };

        var postData = JSON.stringify(dataModel);
        // console.log("DisplayTaxpayerData: ", dataModel);

        // Call Local API
        var postUrl = `?handler=GetTaxPayerEntityData`;
        $.post(postUrl, postData, function (data, status) {
            // console.log('GetTaxPayerData Data: ', data);

            // Hide Preloader
            $('body').hideLoading();

            // Display on view
            if (data.status === "Successful" && data.body) {
                //console.log('data.body: ', data.body);

                $("#WHTEName").val(data.body[0].requestingEntityName);

            } else {
                // Control layout
                toastr.info("Invalid TIN. Please check and try again.");
                $("#WHTETIN").focus();
            }
        }).fail(function (res) {

            // Hide Preloader
            $('body').hideLoading();

            // Control layout
            toastr.info("Invalid TIN. Please check and try again.");
            $("#WHTETIN").focus();
        });
    } else {

        // Control layout
        toastr.info("Invalid TIN. Please check and try again.");
        $("#WHTETIN").focus();
    }
}

// Submit Application
var SubmitApplication = () => {
    // console.log({ NewWHTEApplications });

    if (NewWHTEApplications && NewWHTEApplications.length > 0) {
        PostWHTEApplications = [];
        for (let x = 0; x < NewWHTEApplications.length; x++) {
            PostWHTEApplications.push({
                Applicant: TaxPayerData.id,
                ResStatusId: $("#WHTEResidency").val(),
                ReasonId: NewWHTEApplications[x].Reason.Id,
                Reasons: NewWHTEApplications[x].Comments,
                Remarks: NewWHTEApplications[x].Reason.Description,
                TIN: $("#WHTETIN").val(),
                Phone: $("#WHTEPhone").val(),
                WHTId: NewWHTEApplications[x].Type.Id,
                TaxOfficeId: TaxPayerData.taxOffice.id,
                UserId: '',
                ApplicationTypeId: ApplicationType.Id,
                Email: $("#WHTEEmail").val()
            });
        }
        //console.log({ Applications });

        // All set, Go!
        GetTCCDecalaration();
    } else {
        // Ooops... No data
        toastr.info("TIN is required! Please enter your TIN and try again.");
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

    $("#TCCDeclarationModal").modal('show');
}

var SetTCCDecalaration = () => {
    if ($("#VerifiedX").prop("checked") == true) {
        $("#TCCDeclarationModal").modal('hide');
        PostWHTEAppication();
    } else {
        toastr.info("You must read accept the declaration to proceed.");
    }
}

function PostWHTEAppication() {
    // Show Preloader
    $('body').showLoading();
    
    var dataModel = {
        Applications: PostWHTEApplications,
        Permissions: nameTIN.Codes
    };

    var postData = JSON.stringify(dataModel);
    // console.log("Post Data", postData);

    var postUrl = `?handler=PostWHTEAppication`;
    $.post(postUrl, postData, function (data, status) {
        //console.log({ data });

        if (data.status == "Successful") {
            toastr.success("Your application has been submitted successfully.");
            setTimeout(function () { window.location = `${AppServerUrl}/applications`; }, 1000); //1000 means 1 secs
        } else {
            toastr.info("Your application could not be submitted. Please try again.");
        }
        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (res) {
        toastr.error("Sorry something went wrong. Please try again shortly. Contact the System Administrator if problem persist.");
        // Hide Preloader
        $('body').hideLoading();
    });

}

// GetWHTEApplications
function GetWHTEApplications() {
    if (WHTEApplications && WHTEApplications.length > 0) {
        DisplayWHTEApplications();
    } else {
        // Show Preloader
        $('body').showLoading();

        var postData = JSON.stringify({
            TaxPayerId: nameTIN.Id
        });
        //console.log("Post Data", postData);

        var postUrl = `?handler=GetWHTEApplications`;
        $.post(postUrl, postData, function (data, status) {
            // console.log({ data });

            // Hide Preloader
            $('body').hideLoading();
            if (data.status == "Successful" && data.body) {
                //WHTEApplications = data.body;
                data.body.sortBy((d) => { return d.statusDate }).reverse();

                WHTEApplications = [];
                for (d = 0; d < data.body.length; d++) {
                    //console.log(data.body[d]);

                    WHTEApplications.push({
                        Id: data.body[d].applicationId,
                        Date: data.body[d].submittedDate,
                        ReasonDropDown: data.body[d].reasonDropDown,
                        Reasons: data.body[d].reasons,
                        WHTType: data.body[d].typeOfWithHolding,
                        Status: data.body[d].status ? titleCase(data.body[d].status) : "",
                        StatusId: data.body[d].statusId,
                        StatusDate: data.body[d].statusDate
                    });
                };
                DisplayWHTEApplications();
            }
        }).fail(function (res) {
            // Hide Preloader
            $('body').hideLoading();
        });
    }
}

var DisplayWHTEApplications = function () {
    //console.log("WHTEApplications", WHTEApplications);

    // Dispaly if data
    if (WHTEApplications && WHTEApplications.length > 0) {
        let tableHolder = `
                    <div class="table-responsive border-bottom" style="max-height: 380px !important;overflow-y:scroll;">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th style="width:10px;text-align:center">#</th>
                                    <th style="width:40px;">Date</th>
                                    <th>WHT Type</th>
                                    <th style="width:140px;">Status</th>
                                    <th style="width:20px;text-align:center">Action</th>
                                </tr>
                            </thead>
                            <tbody id="GridWHTEApplications"></tbody>
                        </table>
                    </div>`;
        $("#GridWHTEHolder").html(tableHolder);

        let tableRows = "";
        for (let x = 0; x < WHTEApplications.length; x++) {
            let cc = WHTEApplications[x].StatusId === WHTEStatusSuspendedId ? `class="text-danger"` : "";
            tableRows += `
                        <tr ${cc}>
                            <td>${x + 1}</td>
                            <td>${WHTEApplications[x].Date}</td>
                            <td>${WHTEApplications[x].WHTType}</td>
                            <td>${WHTEApplications[x].Status}</td>
                            <td><button class="btn btn-xs btn-success py-1 px-2" onclick="OpenWHTEApplication('${WHTEApplications[x].Id}')"><i class="fa fa-file-alt"></i></button></td>
                        </tr>`;
        }
        $("#GridWHTEApplications").html(tableRows);
        
    }
}

var OpenWHTEApplication = function (id) {

    // Show Preloader
    $('body').showLoading();

    var postData = JSON.stringify({
        TaxPayerId: id
    });
    // console.log("Post Data", postData);

    var postUrl = `?handler=GetWHTEApplication`;
    $.post(postUrl, postData, function (data, status) {
        console.log({ data });

        if (data.status == "Successful" && data.body) {
            //Store for future use

            WHTEApplication = data.body;

            var ViewPurpose = data.body.remarks ? titleCase(data.body.remarks) : "";
            var ViewComments = data.body.reasons ? titleCase(data.body.reasons) : "";
            var ViewWHTType = data.body.typeOfWithHolding ? titleCase(data.body.typeOfWithHolding) : "";

            // Show Hidden Element
            $(".WHTEOnly").prop("hidden", false);
            $(".TCCOnly").prop("hidden", true);
            $("#PurposeHVL").text("Supporting Resaon");

            // Display details of modal form
            $("#DateSentHV").val(data.body.submittedDate);
            // $("#ExpectedDateHV").val(ExpectedDate.toLocaleDateString("en-US", YearOptions));
            // $("#EntityTINHV").val(nameTIN.TIN);
            // $("#EntityNameHV").val(ViewEntity);
            // $("#PhoneNumberHV").val(data.body.phoneNo);
            // $("#EmailAddressHV").val(data.body.email);
            $("#PurposeHV").text(ViewPurpose);
            $("#CommentsHV").val(ViewComments);
            $("#WHTTypeHV").val(ViewWHTType);
            $("#StatusHV").val(titleCase(data.body.status));
            if (data.body.statusId === WHTEStatusSuspendedId) {
                $("#StatusHV").removeClass("text-primary").addClass("text-danger");
            }

            $("#CommentsBox").removeClass("height-250").addClass("height-350");
            $("#DocuComm").prop("hidden", true);
            if (data.body.statusId === WHTEStatusSuspendedId) {
                $("#CommentsBox").removeClass("height-350").addClass("height-250");
                $("#DocuComm").prop("hidden", false);
            }

            // Launch modal
            $("#TCCModalTitle").text("WHTE Application");
            $("#TCCHistoryModal").modal("show");

            GetWHTEComments(id);
        } else {
            toastr.info("Error getting application details. Please try again later.");
        }

        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (response) {
        // Hide Preloader
        $('body').hideLoading();
    });
}

var GetWHTEComments = function (id) {

    // Show Preloader
    $('body').showLoading();

    var postData = JSON.stringify({
        TaxPayerId: id
    });
    // console.log("Post Data", postData);

    var postUrl = `?handler=GetWHTEApplicationComments`;
    $.post(postUrl, postData, function (data, status) {
        // console.log('GetWHTEComments Data: ', data);

        // Hide Preloader
        $('body').hideLoading();
        if (data.status == "Successful") {
            var comments = data.body;
            if (comments.length > 0) {
                WHTEComments = [];
                for (c = 0; c < comments.length; c++) {
                    if (comments[c].comment) {
                        WHTEComments.push({
                            From: "GRA",
                            Body: comments[c].comment,
                            Date: comments[c].dateAndTime ? comments[c].dateAndTime : "",
                            Type: "txt"
                        });
                    }
                    if (comments[c].reply) {
                        WHTEComments.push({
                            From: "Me",
                            Body: comments[c].reply,
                            Date: comments[c].replyTime ? comments[c].replyTime : "",
                            Type: "txt"
                        });
                    }
                }

                DisplayWHTEComments();
            }
        }
    }).fail(function (response) {
        // Hide Preloader
        $('body').hideLoading();
    });

}

var DisplayWHTEComments = function () {
    // console.log("WHTEComments", WHTEComments);

    var comments = "";
    if (WHTEComments && WHTEComments.length > 0) {
        WHTEComments.sortBy((o) => { return -o.Date });
        for (c = 0; c < WHTEComments.length; c++) {
            // Control Message
            var cc = "CommentToMe";
            var cf = WHTEComments[c].From;
            if (cf === "Me") {
                cc = "CommentFromMe";
            }
            var cb = WHTEComments[c].Body;
            if (WHTEComments[c].Type === "img") {
                cb = `<img src="${WHTEComments[c].Body}" style="max-width:323px!important;" />`;
            }
            //var cDate = WHTEComments[c].Date != null || WHTEComments[c].Date != "" ? (new Date(WHTEComments[c].Date)).toLocaleDateString("en-US", YearOptions) : "----";
            var cDate = WHTEComments[c].Date;// ? WHTEComments[c].Date : "";

            comments += `<p class="${cc}"><b style="font-weight:bold;color:#364c66 !important"><i>${cf}</i></b>
                           <br>${cb}<br><small class="text-right" stylr="width: 100%">${cDate}</small></p>`;
        }
        $("#CommentsBox").html(comments);

        // Scroll to The Bottom
        ScollToCommentsBottom();
    }
}

var ScollToCommentsBottom = function () {
    var height = WHTEComments.length * 123;
    $("#CommentsBox").animate({ scrollTop: height }, 'slow');
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

// Comments Attachment Box
$("#CommentAttach").click(function (e) {
    e.preventDefault();
    $("#CommentFiles").val("");
    $("#CommentFiles").trigger('click');
})

var GetCommentFiles = function () {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('CommentFiles').addEventListener('change', HandleFileSelect, false);
    } else {
        // console.log('The File APIs are not fully supported in this browser.');
    }
}

// Comments Attachment Box
$("#CommentAttachMore").click(function (e) {
    e.preventDefault();
    $("#CommentFilesMore").val("");
    $("#CommentFilesMore").trigger('click');
})

var GetCommentFilesMore = function () {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('CommentFilesMore').addEventListener('change', HandleFileSelectMore, false);
    } else {
        // console.log('The File APIs are not fully supported in this browser.');
    }
}

function HandleFileSelect(evt) {
    CommentFiles.length = 0;
    for (j = 0; j < evt.target.files.length; j++) {
        // Convert file to base64
        GetEncodedFile(evt.target.files[j]);
    }
    setTimeout(function () {
        //console.log("CommentFiles", CommentFiles);
        //If any valid files
        if (CommentFiles && CommentFiles.length > 0) {
            //console.log("CommentFiles.length", CommentFiles.length);

            // Show modal
            $("#DocumentAttachmentsModal").modal("show");

            DisplayTCCDocument();
        }
    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

}

function HandleFileSelectMore(evt) {

    for (j = 0; j < evt.target.files.length; j++) {
        // Convert file to base64
        GetEncodedFile(evt.target.files[j]);
    }
    setTimeout(function () {
        //console.log("CommentFiles", CommentFiles);
        //If any valid files
        if (CommentFiles && CommentFiles.length > 0) {
            //console.log("CommentFiles.length", CommentFiles.length);

            DisplayTCCDocument();
        }
    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

}

var GetEncodedFile = function (file) {

    // Reset CommentFile
    var CommentFile = {};
    CommentFile.Size = file.size;
    CommentFile.Type = file.type;
    CommentFile.Ext = file.name.split('.').pop();
    CommentFile.Name = file.name.substring(0, file.name.lastIndexOf("."));

    // Initialize file reader
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            CommentFile.Data = e.target.result;
            // console.log(`CommentFile: `, CommentFile);
            // Check if file type is valid
            if (IsFileValid(CommentFile)) {
                CommentFiles.push(CommentFile);
            }
        };
    })(file);

    // Read in the image file as a data URL.
    reader.readAsDataURL(file);
}

var IsFileValid = function (file) {
    if (!CommentFileExts.includes(file.Ext)) {
        toastr.info("Invalid file type. Please select a valid PDF or image.");
        return false;
    }
    if (file.Size > 1048576) {
        toastr.info("File size too big. File size must not exceed 1MB.");
        return false;
    }
    return true;
}

// DocumentFile Upload Details
var CurrentDocFileId = 0;
var LastDocFileId = 0;

var DisplayTCCDocument = function () {
    // console.log({ CommentFiles });

    // Get Last Document File Id
    LastDocFileId = CommentFiles.length - 1;

    // Create the table
    var DocumentTableLists = "";
    var DocumentTableDetails = "";

    for (v = 0; v < CommentFiles.length; v++) {
        var at = v == 0 ? "active" : "disabled";
        var ac = v == 0 ? "active show" : "";

        // Calculate File Size
        var bSize = CommentFiles[v].Size + "B";
        var kSize = RoundTo(CommentFiles[v].Size / 1024) + "KB";
        var mSize = RoundTo(CommentFiles[v].Size / (1024 * 1024)) + "MB";
        var gSize = RoundTo(CommentFiles[v].Size / (1024 * 1024 * 1024)) + "GB";

        // Cast to lowercase.
        var icox = "../icons/iconx-any.png";
        var xtx = CommentFiles[v].Ext.toLowerCase();
        switch (xtx) {
            case "pdf":
                CommentFiles[v].Document = CommentFiles[v].Data.replace('data:application/pdf;base64,', '');
                icox = "../icons/iconx-pdf.png";
                break;
            case "jpg":
                CommentFiles[v].Document = CommentFiles[v].Data.replace('data:image/jpeg;base64,', '');
                icox = "../icons/iconx-jpg.png";
                break;
            case "jpeg":
                CommentFiles[v].Document = CommentFiles[v].Data.replace('data:image/jpeg;base64,', '');
                icox = "../icons/iconx-jpg.png";
                break;
            case "png":
                CommentFiles[v].Document = CommentFiles[v].Data.replace('data:image/png;base64,', '');
                icox = "../icons/iconx-png.png";
                break;
            case "doc":
                CommentFiles[v].Document = CommentFiles[v].Data.replace('data:application/msword;base64,', '');
                icox = "../icons/iconx-doc.png";
                break;
            case "docx":
                CommentFiles[v].Document = CommentFiles[v].Data.replace('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,', '');
                icox = "../icons/iconx-doc.png";
                break;
            case "xls":
                CommentFiles[v].Document = CommentFiles[v].Data.replace('data:application/vnd.ms-excel;base64,', '');
                icox = "../icons/iconx-xls.png";
                break;
            case "xlsx":
                CommentFiles[v].Document = CommentFiles[v].Data.replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', '');
                icox = "../icons/iconx-xls.png";
                break;
            case "ppt":
                CommentFiles[v].Document = CommentFiles[v].Data.replace('data:application/vnd.ms-powerpoint;base64,', '');
                icox = "../icons/iconx-ppt.png";
                break;
            case "pptx":
                CommentFiles[v].Document = CommentFiles[v].Data.replace('data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,', '');
                icox = "../icons/iconx-ppt.png";
                break;
        }

        var caption = CommentFiles[v].Name.toLowerCase();
        var DocumentTitle = caption.length > 40 ? `${caption.substring(0, 37)}...` : caption;

        var DocumentTableContents = `
                        <div class="card m-0 p-0">
                            <div class="card-body p-0">
                                <div class="bordered-group">
                                    <p class="card-title" style="font-size: 17px !important; font-weight: bold !important; color: #364c66 !important;"><b>File: </b><small id="SelectedFile${v}" class="text text-bold text-primary"></small></p>
                                    <div class="row">
                                        <div class="col-md-12 mb-2">
                                            <label>Document Type <i class="text-danger">*</i></label><br />
                                            <select style="font-weight: 600" id="DescriptionDV${v}" onchange="BuildDocumentInputs(${v})" class="form-control DescriptionDV">
                                                <option>Select Type</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-row" id="DocumentInputs${v}">
                                    </div>
                                </div>
                            </div>
                        </div>`;

        // Table Lists
        DocumentTableLists +=
            `<tr id="THead${v}" style="width:100%;">
                <td style="width:42px;" class="text-center p-0">
                    <button id="TButton${v}" onclick="ControlDocumentDetails(${v})" class="btn btn-xs py-1 px-2 m-0 hover-primary"><i class="fa fa-folder-open"></i></button>
                </td>
                <td style="width:320px;cursor:pointer;" class="py-0 pl-2 hover-primary" onclick="ControlDocumentDetails(${v})">${DocumentTitle}</td>
                <td style="width:86px;" class="py-0 pl-2">${mSize}</td>
                <td style="width:78px;" class="py-0 pl-2">${CommentFiles[v].Ext.toUpperCase()}</td>
            </tr>
            `;

        // Table Details
        DocumentTableDetails += `<div id="TBody${v}" hidden>${DocumentTableContents}</div>`;
    }
    //Table
    $("#DocumentTableLists").html(DocumentTableLists);
    $("#DocumentTableDetails").html(DocumentTableDetails);

    // Hide all but to TBody0
    CurrentDocFileId = 0;
    ControlDocumentDetails(0);

    FillTCCDocumentTypes();
}

var FillTCCDocumentTypes = function () {
    if (TCCDocumentTypes.length > 0) {
        var options = "<option value=''>Select Document Type</option>";
        for (var i = 0; i < TCCDocumentTypes.length; i++) {
            options += `<option value='${TCCDocumentTypes[i].id}'>${TCCDocumentTypes[i].description}</option>`;
        }
        $(".DescriptionDV").html(options);
    }
}

var BuildDocumentInputs = function (v) {

    let descriptionDV = $(`#DescriptionDV${v}`).val();
    let TCCDocumentType = FindTCCDocumentType(descriptionDV);
    //console.log({ TCCDocumentType });

    // Switch Document Type
    let DocumentInputs = "";
    switch (TCCDocumentType.code) {
        case "P3003": //Payment Receipt
            DocumentInputs = `
                            <div class="col-sm-6">
                                <label>Receipt Number <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="DocNumberDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issuing Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control PastDatePicker" id="IssuedOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6" hidden>
                                <label>Expiring Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control InFiftyYearsDate" id="ExpiresOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issued By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="IssuedByDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Signed By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="SignedByDV${v}" style="font-weight: 600">
                            </div>`;
            break;
        case "P6014": // VAT Receipt
            DocumentInputs = `
                            <div class="col-sm-6">
                                <label>Receipt Number <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="DocNumberDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issuing Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control PastDatePicker" id="IssuedOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6" hidden>
                                <label>Expiring Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control InFiftyYearsDate" id="ExpiresOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issued By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="IssuedByDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Signed By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="SignedByDV${v}" style="font-weight: 600">
                            </div>`;
            break;
        case "Z8974": // Other
            DocumentInputs = `
                            <div class="col-sm-6">
                                <label>Issue Number <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="DocNumberDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issuing Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control PastDatePicker" id="IssuedOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6" hidden>
                                <label>Expiring Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control InFiftyYearsDate" id="ExpiresOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issued By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="IssuedByDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Signed By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="SignedByDV${v}" style="font-weight: 600">
                            </div>`;
            break;
        case "P0998": // Audited Account
            DocumentInputs = `
                            <div class="col-sm-6">
                                <label>Issue Number <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="DocNumberDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issuing Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control PastDatePicker" id="IssuedOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6" hidden>
                                <label>Expiring Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control InFiftyYearsDate" id="ExpiresOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Prepared By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="IssuedByDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Signed By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="SignedByDV${v}" style="font-weight: 600">
                            </div>`;
            break;
        case "B7865": // Birth Certificate
            DocumentInputs = `
                            <div class="col-sm-6">
                                <label>Issue Number <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="DocNumberDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issuing Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control PastDatePicker" id="IssuedOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6" hidden>
                                <label>Expiring Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control InFiftyYearsDate" id="ExpiresOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issued By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="IssuedByDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Signed By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="SignedByDV${v}" style="font-weight: 600">
                            </div>`;
            break;
        case "D1002": // Driver's License
            DocumentInputs = `
                            <div class="col-sm-6">
                                <label>License Number <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="DocNumberDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issuing Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control PastDatePicker" id="IssuedOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6" hidden>
                                <label>Expiring Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control InFiftyYearsDate" id="ExpiresOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issued By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="IssuedByDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Signed By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="SignedByDV${v}" style="font-weight: 600">
                            </div>`;
            break;
        case "M4100": // Marriage Certificate
            DocumentInputs = `
                            <div class="col-sm-6">
                                <label>Certificate Number <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="DocNumberDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issuing Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control PastDatePicker" id="IssuedOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6" hidden>
                                <label>Expiring Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control InFiftyYearsDate" id="ExpiresOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issued By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="IssuedByDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Signed By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="SignedByDV${v}" style="font-weight: 600">
                            </div>`;
            break;
        case "N1007": // National ID
            DocumentInputs = `
                            <div class="col-sm-6">
                                <label>National ID Number <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="DocNumberDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issuing Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control PastDatePicker" id="IssuedOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Expiring Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control FutureDatePicker" id="ExpiresOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6" hidden>
                                <label>Issued By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="IssuedByDV${v}" style="font-weight: 600" value="National Identification Authority">
                            </div>
                            <div class="col-sm-6">
                                <label>Signed By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="SignedByDV${v}" style="font-weight: 600">
                            </div>`;
            break;
        case "P2007": // Passport
            DocumentInputs = `
                            <div class="col-sm-6">
                                <label>Passport Number <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="DocNumberDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issuing Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control PastDatePicker" id="IssuedOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Expiring Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control FutureDatePicker" id="ExpiresOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issued By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="IssuedByDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Signed By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="SignedByDV${v}" style="font-weight: 600">
                            </div>`;
            break;
        case "V1009": // Voter's ID
            DocumentInputs = `
                            <div class="col-sm-6">
                                <label>Voter's ID Number <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="DocNumberDV${v}" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Issuing Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control PastDatePicker" id="IssuedOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6">
                                <label>Expiring Date <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control FutureDatePicker" id="ExpiresOnDV${v}" data-toggle="flatpickr" style="font-weight: 600">
                            </div>
                            <div class="col-sm-6" hidden>
                                <label>Issued By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="IssuedByDV${v}" style="font-weight: 600" value="Electoral Commision">
                            </div>
                            <div class="col-sm-6">
                                <label>Signed By <i class="text-danger">*</i></label><br />
                                <input type="text" class="form-control" id="SignedByDV${v}" style="font-weight: 600">
                            </div>`;
            break;
    }

    // Layout Document Elemets
    $(`#DocumentInputs${v}`).html(DocumentInputs);

    // Apply Date Pickers

    // Trigger DataPicker
    $(".flatpickr").flatpickr();

    // Past Date Operations
    $(`#IssuedOnDV${v}`).flatpickr({
        maxDate: "today"
    });

    // Future Date Operations
    $(`#ExpiresOnDV${v}`).flatpickr({
        minDate: "today",
        defaultDate: new Date().fp_incr(18000)
    });

}

var FindTCCDocumentType = function (id) {
    return $.grep(TCCDocumentTypes, (item) => item.id === id)[0];
}

var SendComment = function () {
    let commentChat = $("#CommentChat").val();
    if (commentChat) {
        var dataModel = {
            ApplicationId: WHTEApplication.applicationId,
            Reply: $("#CommentChat").val(),
            Permissions: nameTIN.Codes,
        }
        PostTCCComment(JSON.stringify(dataModel));
    } else {
        toastr.info("Please enter your comments and try again.");
    }
}

function PostTCCComment(postData) {

    var postUrl = `?handler=PostWHTEApplicationComment`;
    $.post(postUrl, postData, function (data, status) {
        //console.log('PostTCCComment Data: ', data);

        if (data.status == "Successful") {
            // Reload comments to get new ones
            toastr.success("Your response has been submitted successfully.");
            $("#CommentChat").val("");
            $("#CommentChat").focus();
            GetWHTEComments(WHTEApplication.applicationId);            
        } else {
            toastr.info("Your response could not be submitted. Please try again.");
            $("#CommentChat").focus();
        }
        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (response) {
        // Hide Preloader
        $("#CommentChat").focus();
        toastr.error("Sorry something went wrong. Please try again shortly. Contact the System Administrator if problem persist.");
        $('body').hideLoading();
    });
}

// Control Document Details
var ControlDocumentDetails = function (v) {
    CurrentDocFileId = v;

    // Control Details
    $("div[id*='TBody']").each(function () {
        $(this).prop("hidden", true);
    });
    $(`#TBody${v}`).prop("hidden", false);

    // Control Text Color
    $("tr[id*='THead']").each(function () {
        $(this).removeClass("text-success");
    });
    $(`#THead${v}`).addClass("text-success");

    // Control Current File
    $("button[id*='TButton']").each(function () {
        $(this).removeClass("text-success").html(`<i class="fa fa-folder"></i>`);
    });
    $(`#TButton${v}`).addClass("text-success").html(`<i class="fa fa-folder-open"></i>`);

    // Show TBody{v}
    $(`#SelectedFile${v}`).text(CommentFiles[v].Name);

}

var SubmitDocument = function () {
    let btn = $("#SubmitDocument").text();
    if (btn === "OK") {
        SaveTCCDocument();
    } else {
        PostWHTEDocument();
    }
}

var SaveTCCDocument = function () {

    // Get Current Page
    let v = CurrentDocFileId;

    if ($(`#DescriptionDV${v}`).val() &&
        $(`#DocNumberDV${v}`).val() && $(`#IssuedOnDV${v}`).val() &&
        $(`#SignedByDV${v}`).val()) {

        EditedDocuments.push({
            UniAppId: WHTEApplication.applicationId,
            Document: CommentFiles[v].Data,
            DocumentDesc: $(`#DescriptionDV${v}`).val(),
            CertNumber: $(`#DocNumberDV${v}`).val(),
            AuthorityIssuer: $(`#IssuedByDV${v}`).val(),
            IssueDate: $(`#IssuedOnDV${v}`).val(),
            ExpiryDate: $(`#ExpiresOnDV${v}`).val(),
            SignedBy: $(`#SignedByDV${v}`).val(),
        });
        // console.log({ EditedDocuments });

        // Control Inputs
        $(`#DescriptionDV${v}`).prop("disabled", true);
        $(`#DocNumberDV${v}`).prop("disabled", true);
        $(`#IssuedByDV${v}`).prop("disabled", true);
        $(`#IssuedOnDV${v}`).prop("disabled", true);
        $(`#ExpiresOnDV${v}`).prop("disabled", true);
        $(`#SignedByDV${v}`).prop("disabled", true);

        // Control Button
        $("#SubmitDocument").text("OK");
        if (EditedDocuments.length === CommentFiles.length) {
            $("#SubmitDocument").text("Submit");
        }

        toastr.success("Record saved successfully.");

    } else {
        toastr.info("All fields are required!");
    }

}

var PostWHTEDocument = function () {
    // Show Preloader
    $('body').showLoading();

    var postData = JSON.stringify({
        Documents: EditedDocuments,
        Permissions: nameTIN.Codes
    });

    var postUrl = `?handler=PostWHTEDocument`;
    $.post(postUrl, postData, function (data, status) {
        //console.log('PostWHTEDocument Data: ', data);

        if (data.status == "Successful") {
            /*
            // Attach comments
            var dataModel = {
                ApplicationId: TCCApplication.applicationId,
                Reply: `Submitted document issued by ${TCCDocument.AuthorityIssuer} with issue number ${TCCDocument.CertNumber}`,
                Permissions: nameTIN.Codes,
            }
            PostTCCComment(JSON.stringify(dataModel));
            */
            toastr.success("Your document has been submitted successfully.");
            setTimeout(function () { window.location = `${AppServerUrl}/home`; }, 1000); //1000 means 1 secs
        } else {
            toastr.info("Your document could not submitted. Please try again.");
        }
        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (response) {
        // Hide Preloader
        toastr.error("Sorry something went wrong. Please try again shortly. Contact the System Administrator if problem persist.");

        $('body').hideLoading();
    });

}