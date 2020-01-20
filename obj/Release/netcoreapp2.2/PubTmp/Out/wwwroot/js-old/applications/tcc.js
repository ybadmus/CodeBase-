var TaxPayerData = {},
    TCCEntityData = {},
    TCCDocument = {},
    TCCDocumentTypes = [], 
    TCCDocuments = [],
    YearOptions = { year: 'numeric', month: 'long', day: 'numeric' },
    TCCApplications = [],
    TCCComments = [],
    TCCApplication = {},
    RequestingEntity = {},
    RequestingEntities = [],
    CommentFiles = [],
    EditedDocuments = [],
    CommentFileExts = ["png", "jpg", "jpeg", "pdf"], //, "doc", "docx", "xls", "xlsx", "ppt", "pptx"]
    TCCStatusSuspendedId = "4",
    TCCStatusApprovedId = "2",
    ApplicationType = {
        Id: "e6352196-44bd-4730-8cff-cef4fa914efc",
        Code: "APP0001",
        Description: "TCC"
    }; 

$(document).ready(function () {
    // Get TaxPayer Data
    GetTaxPayerData();
    // Check Local Entity
    $("#LocalEntity").prop("checked", true);

    // Get TCC Applications;
    GetTCCApplications();

    // Correct IntTel
    $("#TCCPhone").css("padding-left", "80px");
});


// Get TaxPayer Data
function GetTaxPayerData() {
    var dataModel = {
        TIN: nameTIN.TIN // Get from localStorage
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
        }
    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
    });
}

// Load Types of Purposes
GetTypeOfPurposes();
function GetTypeOfPurposes() {
    var dataModel = {
        CodeType: "TCCP",
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.body.length > 0) {
            var options = "<option value=''>Select Purpose</option>";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].id}'>${data.body[i].description}</option>`;
            }
            //TypeOfAccount
            $("#TCCPurpose").html(options);

        }
    }).fail(function (response) {
        // console.log('Response Error: ' + response.responseText);
    });

}

GetTCCDocumentTypes();
function GetTCCDocumentTypes() {
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

$('#TCCSearch').keyup(function (event) {
    var keyCode = (event.keyCode ? event.keyCode : event.which);
    // console.log("keyCode: ", keyCode);
    if (keyCode == 9 || keyCode == 13 || keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
        GetTCCEntityData();
    }
});

// Clear Form
var ClearForm = function () {
    // Clear data
    $("#TCCTIN").val("").prop("disabled", true);
    $("#EntityTIN").prop("hidden", false);
    $("#TCCName").val("").prop("disabled", true);
    $("#EntityAddress").prop("hidden", true);
    $("#TCCPhone").val("");
    $("#TCCEmail").val("");
    $("#TCCPurpose").val("");
    $("#TCCExpectedDate").val("");
    $(".flatpickr-input").val("");
    $('#TCCSearch').val("");

    // Control views
    $(".RequestingEntity").prop("hidden", true);
    $("#RequestingSearch").prop("hidden", false);

}

var ResetForm = function () {
    // Clear Form
    ClearForm();

    // Uncheck Foreign Entity
    $("#ForeignEntity").prop("checked", false);

    // Check Local Entity
    $("#LocalEntity").prop("checked", true);
}

$("#ForeignEntity").bind("click", () => {
    WithForeignEntity();
});
var WithForeignEntity = function () {
    
    //
    $(".RequestingEntity").prop("hidden", false);
    $("#RequestingSearch").prop("hidden", true);
    $("#TCCTIN").val("null");
    $("#EntityTIN").prop("hidden", true);
    $("#TCCName").prop("disabled", false);
    $("#EntityAddress").prop("hidden", false);

    // Uncheck Local Entity
    $("#LocalEntity").prop("checked", false);

    // Check Foreign Entity
    $("#ForeignEntity").prop("checked", true);

    // Finally...
    window.intlTelInput(TCCPhone, {
        utilsScript: "~/build/js/utils.js",
    });
    $("#TCCPhone").css("padding-left", "80px");
    $("#TCCName").focus();
}

$("#LocalEntity").bind("click", () => {
    WithLocalEntity();
});
var WithLocalEntity = function () {
    // Clear Form
    ClearForm();

    // Uncheck Foreign Entity
    $("#ForeignEntity").prop("checked", false);

    // Check Local Entity
    $("#LocalEntity").prop("checked", true);

    // Finally...
    $("#TCCSearch").focus();
}

var GetJuridiction = function () {
    if ($('#ForeignEntity:checked').val()) {
        return "A";
    }
    return "L";
}

// Control Employee TIN
var ProperTCCSearchTIN = () => {
    let tccTIN = $("#TCCSearch").val();
    $("#TCCSearch").val(tccTIN.toUpperCase())
}

$("#TCCApplications-tab").bind("click", () => {
    $(".RequestingEntity").prop("hidden", true);
    GetTCCApplications();
})
$("#TCCForm-tab").bind("click", () => {
    $(".RequestingEntity").prop("hidden", true);
    if (GetJuridiction() === "A") {
        $(".RequestingEntity").prop("hidden", false);
    }
})

var GetTCCEntityData = function () {
    let tccSearch = $("#TCCSearch").val();

    if (tccSearch === $("#UserTIN").text() || tccSearch === nameTIN.TIN) {
        // Control layout
        $("#TCCSearch").focus();
        $("#TCCName").val("");
        $("#TCCTIN").val("");
        $(".RequestingEntity").prop("hidden", true);
        $("#RequestingSearch").prop("hidden", false);
        toastr.info("Sorry you cannot apply for TCC with your own TIN.");
    } else if (tccSearch.length === 11) { // Just TIN
        // Show Preloader
        $('body').showLoading();

        IsTINOK = true;
        var dataModel = {
            TIN: tccSearch
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
                // Keep object for future use.
                RequestingEntities = data.body;
                GetTCCEntityResult();
            } else {

                // Control layout
                $("#TCCSearch").focus();
                $("#TCCName").val("");
                $("#TCCTIN").val("");
                $(".RequestingEntity").prop("hidden", true);
                $("#RequestingSearch").prop("hidden", false);
                toastr.info("The requesting entity you entered could not be found. Please check and try again.");
            }
        }).fail(function (response) {

            // Hide Preloader
            $('body').hideLoading();

            // Control layout
            $("#TCCSearch").focus();
            $("#TCCName").val("");
            $("#TCCTIN").val("");
            $(".RequestingEntity").prop("hidden", true);
            $("#RequestingSearch").prop("hidden", false);
            toastr.info("An error occured. Please try again.");
        });
    } else {

        // Control layout
        $("#TCCSearch").focus();
        $("#TCCName").val("");
        $("#TCCTIN").val("");
        $(".RequestingEntity").prop("hidden", true);
        $("#RequestingSearch").prop("hidden", false);
        toastr.info("The requesting entity TIN you entered is invalid! Please check and try again.");
    }
}

var GetTCCEntityResult = function () {
    // console.log({ RequestingEntities });

    if (RequestingEntities.length == 0) {

        // Control layout
        $("#TCCSearch").focus();
        $("#TCCName").val("");
        $("#TCCTIN").val("");
        $(".RequestingEntity").prop("hidden", true);
        $("#RequestingSearch").prop("hidden", false);
        toastr.info("The requesting entity you entered could not be found. Please check and try again.");
    } else if (RequestingEntities.length == 1) {
        RequestingEntity = {
            Name: RequestingEntities[0].entityName,
            TIN: RequestingEntities[0].tin
        }
        GetRequestingEntity();
    } else {
        var htmData = "";
        for (h = 0; h < RequestingEntities.length; h++) {

            htmData += `<tr>
                            <td><a onclick="FindRequestingEntity('${RequestingEntities[h].requestingEntityTin}')" style="cursor:pointer;">${titleCase(RequestingEntities[h].requestingEntityTin)}</a></td>
                            <td><a onclick="FindRequestingEntity('${RequestingEntities[h].requestingEntityTin}')" style="cursor:pointer;">${titleCase(RequestingEntities[h].requestingEntityName)}</a></td>
                            <td class="text-center">
                                <button id="${RequestingEntities[h].requestingEntityTin}" onclick="FindRequestingEntity(this.id)" class="btn btn-xs btn-success py-1 px-2"><i class="fa fa-file-alt"></i></button>
                            </td>
                        </tr>`;
        }
        $("#RequestingEntitiesList").html(htmData);
        $("#RequestingEntitiesModal").modal("show");
    }
}

var FindRequestingEntity = function (tin) {
    var GetItem = $.grep(RequestingEntities, function (obj) { return obj.requestingEntityTin === tin; });
    RequestingEntity = {
        Name: GetItem[0].entityName,
        TIN: GetItem[0].tin
    }
    $("#RequestingEntitiesModal").modal("hide");
    GetRequestingEntity();
}

var GetRequestingEntity = function () {
    // Control layout
    $("#TCCName").val(RequestingEntity.Name);
    $("#TCCTIN").val(RequestingEntity.TIN);
    $(".RequestingEntity").prop("hidden", false);
    $("#RequestingSearch").prop("hidden", true);
    // Finally...
    window.intlTelInput(TCCPhone, {
        utilsScript: "~/build/js/utils.js",
    });
    $("#TCCPhone").css("padding-left", "80px").css("width", "100%").focus();
}

var ShowOtherPurpose = function () {
    var value = $("#TCCPurpose option:selected").text();
    var other = value.toLowerCase();
    if (other.includes("other")) {
        $("#TCCRemarksHolder").prop("hidden", false);
    } else {
        $("#TCCRemarksHolder").prop("hidden", true);
        $("#TCCRemarks").text(value)
    }
}

var IsPhoneValid = true;
var ValidatePhone = function () {
    let phone = $("#TCCPhone").val();

    var countryCode = $(".iti-flag").attr("class");
    var code = countryCode.split(" ")[1];

    // console.log({ code });

    if (phone || phone.length > 0) {
        IsPhoneValid = false;
        // set endpoint and your access key
        var access_key = '05d7f2c6c167f4bd2e737b276e01b594'
        var base_url = 'https://apilayer.net/api/validate';

        // verify phone number via AJAX call
        $.ajax({
            url: `${base_url}?access_key=${access_key}&number=${phone}&country_code=${code}`,
            dataType: 'jsonp',
            success: function (data) {
                // console.log({ data });

                if (data.valid == true && data.line_type == 'mobile') {
                    IsPhoneValid = true;
                }
            }
        }).fail(function (response) {
            //$('body').hideLoading();
        });
    } else {
        IsPhoneValid = true;
    }
}

// Submit Application
var SubmitApplication = function () {
    let email = $("#TCCEmail").val();
    if (!$("#TCCName").val()) {
        // TIN not provided
        toastr.info("Entity Name is required! Please enter requesting entity name and try again.");
        $("#TCCName").focus()
    } else if (GetJuridiction() === "A" && !$("#TCCAddress").val()) {
        // TIN not provided
        toastr.info("Entity Address is required! Please enter requesting entity address and try again.");
    } else if (GetJuridiction() === "L" && $("#TCCTIN").val().length != 11) {
        // TIN not provided
        toastr.info("Entity TIN is required! Please enter requesting entity TIN and try again.");
    } else if (!$("#TCCPurpose").val()) {
        // Other Form inputs not avaliable
        toastr.info("Purpose field is required! Please provide the purpose of this application and try again.");
    } else if (email.length > 0 && !IsEmailValid(email)) {
        // Email provided not valid
        toastr.info("Entity email address is not valid! Please enter a valid email address and try again.");
        $("#TCCEmail").focus()
    } else if (!IsPhoneValid) {
        // Phone number provided not valid
        toastr.info("Entity phone number is not valid! Please enter a valid phone number and try again.");
        $("#TCCPhone").focus()
    } else if ($("#TCCTIN").val() === nameTIN.TIN) {
        // Control layout
        $("#TCCSearch").focus();
        $("#TCCName").val("");
        $("#TCCTIN").val("");
        $(".RequestingEntity").prop("hidden", true);
        $("#RequestingSearch").prop("hidden", false);
        toastr.info("Sorry you cannot apply for TCC with your own TIN.");
    } else {
        // All set, Go!
        GetTCCDecalaration();
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
        PostTCCAppication();
    } else {
        toastr.info("You must read accept the declaration to proceed.");
    }
}

var PostTCCAppication = () => {
    // Show Preloader
    $('body').showLoading();

    // Purpose: $("#TCCPurpose option:selected").text()

    var dataModel = {
        Applicant: TaxPayerData.id,
        PurposeId: $("#TCCPurpose").val(),
        RequestingOffice: $("#TCCName").val(),
        Remarks: $("#TCCRemarks").val(),
        RequestingOfficeTin: $("#TCCTIN").val(),
        RequestingOfficePhone: $("#TCCPhone").val(),
        RequestingOfficeEmail: $("#TCCEmail").val(),
        RequestingEntityAddress: $("#TCCAddress").val(),
        ReqEntityJuristiction: GetJuridiction(),
        TaxOfficeId: TaxPayerData.taxOffice.id,
        UserId: '',
        ApplicationTypeId: ApplicationType.Id,
        Permissions: nameTIN.Codes
    };
    // console.log("dataModel Data", dataModel);
    
    var postData = JSON.stringify(dataModel);
    // console.log("Post Data", postData);
    
    var postUrl = `?handler=PostTCCApplication`;
    $.post(postUrl, postData, function (data, status) {
        // console.log('Response Data: ', data);

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


// GetTCCApplications
function GetTCCApplications () {
    if (TCCApplications && TCCApplications.length > 0) {
        DisplayTCCApplications();
    } else {
        // Show Preloader
        $('body').showLoading();

        var postData = JSON.stringify({
            UniTaxpayerId: nameTIN.Id,
            UniApplicationTypeId: ApplicationType.Id
        });
        // console.log("Post Data", postData);

        var postUrl = `?handler=GetTCCApplications`;
        $.post(postUrl, postData, function (data, status) {
            // console.log('GetTCCApplications Data: ', data);

            // Hide Preloader
            $('body').hideLoading();
            if (data.status == "Successful" && data.body) {
                // console.log("GetTCCApplications", data.body);

                // Sort Data by Date
                data.body.sortBy((d) => { return d.submittedDate }).reverse();

                TCCApplications = [];
                for (d = 0; d < data.body.length;d++) {
                    //console.log(data.body[d]);

                    TCCApplications.push({
                        Id: data.body[d].applicationId,
                        Date: data.body[d].submittedDate,
                        Entity: data.body[d].requestingEntity ? titleCase(data.body[d].requestingEntity) : "",
                        Purpose: data.body[d].purpose ? titleCase(data.body[d].purpose.toLowerCase().includes("other") ? data.body[d].remarks : data.body[d].purpose) : "",
                        Status: data.body[d].status ? titleCase(data.body[d].status) : "",
                        StatusId: data.body[d].statusId
                    });
                };
                DisplayTCCApplications();
            }
        }).fail(function (response) {
            // Hide Preloader
            $('body').hideLoading();
        });
    }    
}

function DisplayTCCApplications() {
    //console.log("TCCApplications", TCCApplications);

    // Dispaly if data
    if (TCCApplications && TCCApplications.length > 0) {
        let tableHolder = `
                    <div class="table-responsive border-bottom" style="max-height: 380px !important;overflow-y:scroll;">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th style="width:10px;text-align:center">#</th>
                                    <th style="width:40px;">Date</th>
                                    <th>Entity Name</th>
                                    <th>Purpose</th>
                                    <th style="width:140px;">Status</th>
                                    <th style="width:20px;text-align:center">Action</th>
                                </tr>
                            </thead>
                            <tbody id="GridTCCApplications"></tbody>
                        </table>
                    </div>`;
        $("#GridTCCHolder").html(tableHolder);

        let tableRows = "";
        for (let x = 0; x < TCCApplications.length; x++) {
            let cc = TCCApplications[x].StatusId === TCCStatusSuspendedId ? `class="text-danger"` : "";
            let btn = TCCApplications[x].StatusId === TCCStatusApprovedId ?
                `<button class="btn btn-xs py-1 px-2 m-0" onclick="ViewTCCCertificate('${TCCApplications[x].Id}')"><i class="fa fa-certificate"></i></button>` :
                `<button class="btn btn-xs py-1 px-2 m-0" onclick="OpenTCCApplication('${TCCApplications[x].Id}')"><i class="fa fa-file"></i></button>`;
            tableRows += `
                        <tr ${cc}>
                            <td>${x + 1}</td>
                            <td>${TCCApplications[x].Date}</td>
                            <td>${TCCApplications[x].Entity}</td>
                            <td>${TCCApplications[x].Purpose}</td>
                            <td>${TCCApplications[x].Status}</td>
                            <td>${btn}</td>
                        </tr>`;
        }
        $("#GridTCCApplications").html(tableRows);
    }
}

var ViewTCCCertificate = function (id) {
    window.location = `${AppServerUrl}/applications/reports/?uniApplicationId=${id}`;
}

var OpenTCCApplication = function (id) {
   
    // Show Preloader
    $('body').showLoading();

    var postData = JSON.stringify({
        TaxPayerId: id
    });
    // console.log({ postData } );

    var postUrl = `?handler=GetTCCApplication`;
    $.post(postUrl, postData, function (data, status) {
        // console.log({ data });

        if (data.status == "Successful" && data.body) {
            //Store for future use

            TCCApplication = data.body;

            var ViewEntity = data.body.requestingEntity ? titleCase(data.body.requestingEntity) : "";
            var ViewPurpose = data.body.purpose ? titleCase(data.body.purpose.toLowerCase().includes("other") ? data.body.remarks : data.body.purpose) : "";

            // Display details of modal form
            $("#DateSentHV").val(data.body.submittedDate);
            //$("#ExpectedDateHV").val(ExpectedDate.toLocaleDateString("en-US", YearOptions));
            $("#EntityTINHV").val(data.body.requestingOfficeTIN && data.body.requestingOfficeTIN != "null" ? data.body.requestingOfficeTIN : "N/A");
            $("#EntityNameHV").val(ViewEntity);
            $("#PhoneNumberHV").val(data.body.requestingOfficePhone ? data.body.requestingOfficePhone : "N/A");
            $("#EmailAddressHV").val(data.body.requestingOfficeEmail ? data.body.requestingOfficeEmail : "N/A");
            $("#PurposeHV").text(ViewPurpose);
            $("#StatusHV").val(titleCase(data.body.status));
            if (data.body.statusId === TCCStatusSuspendedId) {
                $("#StatusHV").removeClass("text-primary").addClass("text-danger");
            }

            $("#CommentsBox").removeClass("height-250").addClass("height-350");
            $("#DocuComm").prop("hidden", true);
            if (data.body.statusId === TCCStatusSuspendedId) {
                $("#CommentsBox").removeClass("height-350").addClass("height-250");
                $("#DocuComm").prop("hidden", false);
            }

            // Launch modal
            $("#TCCHistoryModal").modal("show");

            GetTCCComments(id);
        } else {
            toastr.info("Error getting application details. Please try again later.");
        }
        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (res) {
        // Hide Preloader
        $('body').hideLoading();
        });    
}

var GetTCCComments = function (id) {

    // Show Preloader
    $('body').showLoading();

    var postData = JSON.stringify({
        TaxPayerId: id
    });
    // console.log("Post Data", postData);

    var postUrl = `?handler=GetTCCApplicationComments`;
    $.post(postUrl, postData, function (data, status) {
        // console.log({ data });

        // Hide Preloader
        $('body').hideLoading();
        if (data.status == "Successful" && data.body) {
            var comments = data.body;
            if (comments.length > 0) {
                TCCComments = [];
                for (c = 0; c < comments.length; c++) {
                    if (comments[c].comment) {
                        TCCComments.push({
                            From: "GRA",
                            Body: comments[c].comment,
                            Date: comments[c].dateAndTime ? comments[c].dateAndTime : "",
                            Type: "txt"
                        });
                    }
                    if (comments[c].reply) {
                        TCCComments.push({
                            From: "Me",
                            Body: comments[c].reply,
                            Date: comments[c].replyTime ? comments[c].replyTime : "",
                            Type: "txt"
                        });
                    }
                }

                DisplayTCCComments();
            }
        }
    }).fail(function (response) {
        // Hide Preloader
        $('body').hideLoading();
    });    
    
}

var DisplayTCCComments = function () {
    // console.log("TCCComments", TCCComments);

    var comments = "";
    if (TCCComments && TCCComments.length > 0) {
        // TCCComments.sortBy(function (o) { return -o.Date });
        for (c = 0; c < TCCComments.length; c++) {
            // Control Message
            var cc = "CommentToMe";
            var cf = TCCComments[c].From;
            if (cf === "Me") {
                cc = "CommentFromMe";
            }
            var cb = TCCComments[c].Body;
            if (TCCComments[c].Type === "img") {
                cb = `<img src="${TCCComments[c].Body}" style="max-width:323px!important;" />`;
            }
            //var cDate = TCCComments[c].Date != null || TCCComments[c].Date != "" ? (new Date(TCCComments[c].Date)).toLocaleDateString("en-US", YearOptions) : "----";
            var cDate = TCCComments[c].Date;// ? TCCComments[c].Date : "";

            comments += `<p class="${cc}"><b style="font-weight:bold;color:#364c66 !important"><i>${cf}</i></b>
                           <br>${cb}<br><small class="text-right" stylr="width: 100%">${cDate}</small></p>`;
        }
        $("#CommentsBox").html(comments);

        // Scroll to The Bottom
        ScollToCommentsBottom();
    }
}

var ScollToCommentsBottom = function () {
    var height = TCCComments.length * 123;
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

var IsFileValid = function(file){
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
    return $.grep(TCCDocumentTypes, (item) => item.id === id )[0];
}

var SendComment = function () {
    let commentChat = $("#CommentChat").val();
    if (commentChat) {
        var dataModel = {
            ApplicationId: TCCApplication.applicationId,
            Reply: $("#CommentChat").val(),
            Permissions: nameTIN.Codes,
        }
        PostTCCComment(JSON.stringify(dataModel));
    } else {
        toastr.info("Please enter your comments and try again.");
    }
}

function PostTCCComment(postData) {

    var postUrl = `?handler=PostTCCApplicationComment`;
    $.post(postUrl, postData, function (data, status) {
        //console.log('PostTCCComment Data: ', data);

        if (data.status == "Successful") {
            // Reload comments to get new ones
            toastr.success("Your response has been submitted successfully.");
            $("#CommentChat").val("");
            $("#CommentChat").focus();
            GetTCCComments(TCCApplication.applicationId);
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
        PostTCCDocument();
    }
}

var SaveTCCDocument = function () {
   
    // Get Current Page
    let v = CurrentDocFileId;

    if ($(`#DescriptionDV${v}`).val() &&
        $(`#DocNumberDV${v}`).val() && $(`#IssuedOnDV${v}`).val() &&
        $(`#SignedByDV${v}`).val()) {

        EditedDocuments.push({
            UniAppId: TCCApplication.applicationId,
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

var PostTCCDocument = function() {
    // Show Preloader
    $('body').showLoading();    
    
    var postData = JSON.stringify({
        Documents: EditedDocuments,
        Permissions: nameTIN.Codes
    });

    var postUrl = `?handler=PostTCCDocument`;
    $.post(postUrl, postData, function (data, status) {
        //console.log('PostTCCDocument Data: ', data);

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