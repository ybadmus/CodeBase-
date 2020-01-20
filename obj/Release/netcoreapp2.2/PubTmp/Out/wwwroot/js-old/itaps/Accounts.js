var taxConsultantTIN = "";
var selectedRoles, selectedRolesTexts, AssociatesID, myTIN, loadedAssociatesData = [], updateFlag = "U", associationID = "", fullName = "", enteredTIN = "";
DisplayUserData();
function DisplayUserData() {
    var dataModel = {
        TIN: $("#UserTIN").text()
    };

    var postData = JSON.stringify(dataModel);
    // console.log('dataModel Data: ', dataModel);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerData`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('GetTaxPayerData Data: ', data);
        if (data.status === "Successful") {
            $(".UserTIN").text(data.body.tin);
            $(".UserFirstName").text(data.body.firstName);
            $(".UserLastName").text(data.body.lastName);
            $(".UserOtherNames").text(data.body.otherNames);
            $(".UserMobileNumber").val(data.body.mobileNumber);
            $(".UserEmailAddress").val(data.body.emailAddress);
            $(".UserDigitalAddress").val(data.body.digitalAddress);
            $(".UserPostalAddress").html(data.body.postalAddress);
            var taxOfficeOpts = `<option value="${data.body.taxOffice.id}">${data.body.taxOffice.name}</option>`;
            $("#txtTaxOffice").html(taxOfficeOpts);
            $("#txtSSnit").val(data.body.ssnit);
            var taxNatOpts = `<option value="${data.body.nationality.id}">${data.body.nationality.name}</option>`;
            $("#txtNationality").html(taxNatOpts);
            $("#txtTaxConsTIN").val(data.body.taxConsultant.tin);
            $("#txtTaxConsName").val(data.body.taxConsultant.name);
            if (data.body.taxConsultant.tin != null) {
                GetTaxConsultant(data.body.taxConsultant.tin);
            } else {
                //has no tax consultant
                $(".taxConsult").prop("disabled", true).val("");
                $('input[name=radioConsultants][value=I]').attr('checked', true);
            }
            !data.body.otherNames ? $("#otherNamesDiv").hide() : $("#otherNamesDiv").show();//show other names only if other names is available           
        }
    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
    });
}


//has a tax consultant
function GetTaxConsultant(consultantTIN) {
    $(".taxConsult").prop("disabled", false);
    $("#txtTaxConsTIN").val(consultantTIN);
    $('input[name=radioConsultants][value=A]').attr('checked', true);

    var dataModel = {
       TIN: consultantTIN
    };
    $.post(`?handler=GetTaxPayerData`, JSON.stringify(dataModel), function (data, status) {
        if (data.status === "Successful") {
            $("#txtTaxConsName").val(`${data.body.displayName}`);
        }
    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
    });
}

$(document).ready(function () {
    //prevent copy and paste in TIn fields
    $('.tinField').bind("cut copy paste", function (e) {
        e.preventDefault();
        $('.tinField').bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });

    $(".password").val("");//clear all values in password reset column    
    //$("#spanOtherNames").text() === "" ? $("#otherNamesDiv").hide() : $("#otherNamesDiv").show();//show other names only if other names is available    
    getAllAssociatesByUser();//On page ready, load all associates

    $("#divAssociates").kendoGrid({
        dataSource: { data: [], pageSize: 5 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        toolbar: [
            {name: "", template: `<button type='button' class='btn btn-primary btn-sm float-right' id='addAssociate'>Add Associates</button>`}
        ],
        columns: [
            { field: "tin", title: "TIN", width: "20%" },
            { field: "fullName", title: "Full Name" }, 
            { field: "isAdmin", title: "Admin", width: "20%" }, 
            {
                command: [
                    { name: "edit", template: "<button class='editAssociate btn btn-success btn-sm' title='Edit Associates roles'><span class='fa fa-pencil-alt'></span></button>" }
                ],
                title: "Action",
                width: "70px"
            }
        ]
    });

    $("#addAssociate").click(function () {        
        $(this).find('input[type="checkbox"]').prop('checked', false);
        $(this).find(".transButtons").prop("disabled", true);
        $("#txtFullName").hide();
        $('#txtAssocActions').multipleSelect('uncheckAll');
        $("#modal-associates").modal("show");
        $("#modal-associates-title").text("Add Associate");
        updateFlag = "U";
        $("#btnAdd").text("Add").prop("disabled", true);
        associationID = "";
        $("#disassociate").hide();
        $(this).find('input[type=text]').val('');
        $("#txtSearchAssociate").val("").prop("disabled",false);
    });


    $("#txtTaxConsTIN, #txtSearchAssociate, #txtLLTIN") //#txtSearchAssociate,
        .keydown(function (e) {    
            if (!e.key.match(/^[0-9a-zA-Z]+$/) && Number(e.key.length) === 1) {
                e.preventDefault();
                return;
            }

            if (Number($(this).val().length) === 11 && Number(e.key.length) === 1) {
                e.preventDefault();
                return;
            }
        })
        .keyup(function (e) {
            thisID = this.id;
            //if ($(this).val().charAt(0).toLowerCase() !== 'p') {
            //    $(this).val("");
            //    return;
            //}  To be replaced with another service to bring taxpayer details
            if ($.trim(this.value.toLowerCase()) === $.trim($("#txtUserTinOnNavbar").text().toLowerCase())) {
                toastr.info("Sorry! You cannot add yourself");
                $(this).val("");
                enteredTIN = "";
                return;
            }
            if (Number($(this).val().length) === 11 && Number(e.key.length) === 1) {
                if ($(this).val() !== enteredTIN) {
                    if (this.id === "txtSearchAssociate") {
                        $('#txtFullName').fadeOut("slow");
                        $("#associatesFullName").val("");
                    } else {
                        $("#txtTaxConsName, .LLData").val("");
                    } 
                    var dataModel = {
                        "TIN": $(this).val()
                    };

                    $("body").showLoading();
                    $.post(`?handler=GetTaxPayerData`, JSON.stringify(dataModel), function (data, status) {
                        $("body").hideLoading();
                        if (data.status === "Successful") {                           
                            if (thisID === "txtTaxConsTIN") {
                                $("#txtTaxConsName").val(ucwords(`${data.body.lastName} ${data.body.firstName} ${data.body.otherNames}`));
                                $("#btnUpdateTaxConsultant").prop("disabled", false);
                                return false;
                            }

                            if (thisID === "txtSearchAssociate") {
                                $("#txtFullName").fadeIn("slow");
                                $("#associatesFullName").val(ucwords(`${data.body.lastName} ${data.body.firstName} ${data.body.otherNames}`));
                                $("#tinName").text(ucwords(`${data.body.lastName} ${data.body.firstName} ${data.body.otherNames}`));
                                AssociatesID = data.body.id;
                                return false;
                            }

                            if (thisID === "txtLLTIN") {
                                $("#txtLLName").val(ucwords(`${data.body.lastName} ${data.body.firstName} ${data.body.otherNames}`));
                                $("#txtLLPhone").val(data.body.mobNo);
                                return false;
                            }
                        } else {
                            toastr.info("Sorry! No taxpayer found");
                        }
                    }).fail(function (response) {
                        $("body").hideLoading();
                        console.log('Response Error: ' + response.responseText);
                        $("#btnUpdateTaxConsultant").prop("disabled", true);
                        });

                    enteredTIN = $(this).val();
                }                
                return;
            }

            
        }).focusout(function () {
            var thisID = this.id;            
        });

    $("#chkDisclaim").change(function () {
        $("#btnSubmit").prop("disabled", $("#chkDisclaim").is(':checked') ? false : true);       
    });
    
    $("#txtAssocActions").change(function () {  
        revealAddBtn();
        selectedRoles = $('#txtAssocActions').multipleSelect('getSelects');
        selectedRolesTexts = $('#txtAssocActions').multipleSelect('getSelects', "text");       
    });

    function revealAddBtn() {
        if (Number($('#txtAssocActions').multipleSelect('getSelects').length) < 1) {
            $("#btnAdd").prop("disabled", true);
        } else {
            $("#btnAdd").prop("disabled", false);
        }
    }

    //do these before any modal pops up
    $("#modal-disclaimer").on('show.bs.modal', function () {
        $(this).find('input[type="checkbox"]').prop('checked', false);
        $("#ulRoles").html();
        var lis = '';
        for (var i = 0; i < selectedRolesTexts.length; i++) {
            lis += `<li>${selectedRolesTexts[i]}</li>`;
        }
        $("#ulRoles").html(lis);
    });
    
    $("#btnSubmit").click(function () {   
        addAssociate();
    });


    function addAssociate() {
        $('body').showLoading();
        rolesData = fnRolesData();
        console.log("addAssociate: ", rolesData);
        newAjaxRequest(!associationID ? `?handler=AddTaxAssociate` : `?handler=UpdateTaxAssociate`, "POST", rolesData)
            .done(function () {
                toastr.success(!associationID ? "New Associate added successfully" : "Associate's roles updated successfully");
                getAllAssociatesByUser();
                $(".modal").modal("hide");
            });
    }
 
    function getAllAssociatesByUser() {       
        $('body').showLoading();
        newAjaxRequest(`?handler=GetTaxPayerAssociates`, "POST", { TaxPayerId: nameTIN.Id})
            .done(function (data) {
                 $("#divAssociates").data('kendoGrid').dataSource.data([]);
                loadedAssociatesData = data.body;   
                if (loadedAssociatesData) {
                    for (var i = 0; i < loadedAssociatesData.length; i++) {
                        loadedAssociatesData[i].isAdmin = loadedAssociatesData[i].isAdmin === "Y" ? "Admin" : "";
                    }
                    $("#divAssociates").data('kendoGrid').dataSource.data(loadedAssociatesData);
                }                
            });
    }

    function fnRolesData() {        
        var tap6 = [];
        for (var i = 0; i < selectedRoles.length; i++) {
            tap6.push({
                roleId: selectedRoles[i],
                associateId: AssociatesID
            });
        }
        return {          
            "id": associationID,
            "taxPayerId": nameTIN.Id, // $("#UserTaxPayerId").text(),
            "associatedTaxPayerId": AssociatesID,
            "updateFlag": updateFlag,
            "isAdmin": $("#chkAdminOption").is(":checked") ? "Y" : "N",
            "tap6": tap6
        };
    }

    $(document).on("click", ".editAssociate", function (e) {
        var grid = $('#divAssociates').data('kendoGrid'),
            dataItem = grid.dataItem($(e.target).closest("tr"));
        editMode = 1;
        selectedRoles = [];
        for (var i = 0; i < dataItem.tap6.length; i++) {
            selectedRoles.push(dataItem.tap6[i].roleId);
        }
        $('#txtAssocActions').multipleSelect('setSelects', selectedRoles);
        updateFlag = "U";        
        $("#txtSearchAssociate").val(dataItem.tin).prop("disabled", true);
        $("#associatesFullName").val(ucwords(dataItem.fullName)).prop("disabled", true).closest(".form-row").fadeIn("slow");
        $("#modal-associates").modal("show");
        $("#modal-associates-title").text(ucwords(dataItem.fullName));
        $("#btnAdd").text("Update").prop("disabled", true);
        $("#disassociate").show();
        AssociatesID = dataItem.associatedTaxpayerId;
        associationID = dataItem.id;
        fullName = ucwords(dataItem.fullName);
    });

    $("#disassociate").click(function () {
       // $("#modal-remove").modal("show");
        toastr.options = {
            "positionClass": "toast-top-right",
            "preventDuplicates": true,
            "onclick": null,
            "timeOut": "5000000000",
            "extendedTimeOut": "1000000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        
        releaseAssociationModalButtons(false);
        toastr["info"](`Are you sure you want to disassociate <b>${fullName}</b> from your account?<br /><br /><button id="btnFinalDisassociate" type="button" class="btn btn-success">Yes</button>&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-light" id="cancelDisassociation">Cancel</button>`);
    });
    $(document).on("click", "#btnFinalDisassociate", function () {
        $('body').showLoading();
        updateFlag = "D";
        rolesData = fnRolesData();

        newAjaxRequest(`?handler=UpdateTaxAssociate`, "POST", rolesData)
            .done(function () {
                toastr.success("Disassociation completed");
                getAllAssociatesByUser();
                $(".modal").modal("hide");
            });
    });

    $(".password").focusout(function () {
        let passData = $(this).val();
        if (CheckPassword(passData) === false) {
            displayPasswordInfoToast();
            $(this).focus();
            return;
        }
        /*
        if ($(this).val()) {
            if (!hasLowerCase($(this).val()) || !hasUpperCase($(this).val()) || !isAlphaNumeric($(this).val()) || $(this).val().length < 8) {
                displayPasswordInfoToast();
                $(this).focus();
                return;
            }
        }
        */
    });

    $("#txtCurrentPassword, #txtNewPassword").focusout(function () {
        if ($(this).val()) {
            if ($("#txtCurrentPassword").val() === $("#txtNewPassword").val()) {
                toastr.info("Your current password cannot be the same as your new password. Please modify your new password!");
                $(this).focus();
                return;
            }
        }
    });

    $(".newPass").keyup(function () {
        if ($("#txtConfirmPassword").val() && $("#txtNewPassword").val()) {
            if ($("#txtConfirmPassword").val() !== $("#txtNewPassword").val()) {
                $(".newPass").css("border-color", "#dc3545");
                $("#btnChangePassword").prop("disabled", true);
            } else {
                $(".newPass").css("border-color", "#00acac ");
                $("#btnChangePassword").prop("disabled", false);
            }
        }       
    });

    function hasLowerCase(str) {
        return /[a-z]/.test(str);
    }

    function hasUpperCase(str) {
        return /[A-Z]/.test(str);
    }

    function isAlphaNumeric(str) {
        return /([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/.test(str);
        // return (/([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/.test(str));
    }

    function displayPasswordInfoToast() {
        $("#btnChangePassword").prop("disabled", true);
        toastr.info("Password must contain atleast a capital letter, a small letter, a number, special characters (. , * @) and atleast eight (8) characters long");
    }

    $("#btnChangePassword").click(function () {
        var dataToSend = {
            "strEmail": $("#txtEmail").val(),
            "strPhoneNo": $("#txtPhone").val(),
            "strTin": $("#UserTIN").text(),
            "strOldPassword": $("#txtCurrentPassword").val(),
            "strNewPassword": $("#txtNewPassword").val(),
            "strConfirmPassword": $("#txtConfirmPassword").val()
        };
        if (!dataToSend.strOldPassword || !dataToSend.strNewPassword || !dataToSend.strConfirmPassword) {
            toastr.info("Please fill all fields");
            return false;
        }
        $('body').showLoading();
        newAjaxRequest(`?handler=ChangePassword`, "POST", dataToSend)
            .done(function () {
                toastr.success("Password changed successfully");
                $(".password").val("");
                $("#btnChangePassword").prop("disabled", true);
            });
    });
    
    $(document).on("click", "#cancelDisassociation", function () {
        releaseAssociationModalButtons(true, 1);
    });

    function releaseAssociationModalButtons(val, id="") {
        $("#modal-associates").find("button, input[type=checkbox]").prop("disabled", !val);
        if (Number(id)===1) {
            $("#modal-associates").find(".transButtons").prop("disabled", val);
        }        
    }

    $("#btnUpdatePersonal").click(function () {
        userDetails();
    });

    function userDetails() {
        var userData = {
            TIN: $("#UserTIN").text(),
            TaxOffice: $("#txtTaxOffice").val(),
            MobNo: $("#txtPhone").val(),
            Email: $("#txtEmail").val(),
            SSNIT: $("#txtSSnit").val(),
            Nationality: $("#txtNationality").val(),
            Address: $("#txtDigitalAddress").val(),
            PostalAddress: $("#txtPostalAddress").val()
        };
        // console.log("userDetails:", userData);

        $('body').showLoading();
        newAjaxRequest(`?handler=UpdateUserDetails`, "POST", userData)
            .done(function (data) {
                $('body').showLoading();
                
                //console.log("userDetails data:", data);
                if (data.status === "Successful") {
                    toastr.success("User details updated successfully");
                    setTimeout(function () { location.reload(); }, 1000); //1000 means 1 secs
                } else {
                    toastr.warning(`Sorry, update failed. Please try again.`);
                    $('body').hideLoading();
                }
            });
    }


    $("input[name=radioConsultants]").change(function () {
        if (this.value === "I") {
            $(".taxConsult").prop("disabled", true).val("");
            $("#btnUpdateTaxConsultant").prop("disabled", false);
        } else {
            $(".taxConsult").prop("disabled", false);
            $("#btnUpdateTaxConsultant").prop("disabled", true);
        }
    });

    $("#btnUpdateTaxConsultant").click(function () {
        var model = {
            "id": "",
            "taxPayerId": $("#UserTaxPayerId").text(),
            "consultantTin": $("#txtTaxConsTIN").val(),
            "status": $('input[name=radioConsultants]').val()
        };

        $('body').showLoading();
        newAjaxRequest(`?handler=ChangeTaxConsultant`, "POST", model)
            .done(function (data) {
                //reloadSessionData();

                if (data.status === "Successful") {
                    toastr.success("Tax Consultant details updated successfully.");
                    setTimeout(function () { location.reload(); }, 1000); //1000 means 1 secs
                } else {
                    toastr.warning(`Tax Consultant details update failed. Please try again.`);
                    $('body').hideLoading();
                }
                $("#btnUpdateTaxConsultant").prop("disabled", true);
            });
    });

    loadGenericCodes("TAM", "#txtAccMethods");//load accounting methods
    loadGenericCodes("TES", "#txtLoadTenancyStatus");//load tenancy status
    loadGenericCodes("ATR", "#txtAssocActions");//load association roles

    function loadGenericCodes(codeType, selectTagId = "") {
        newAjaxRequest(`?handler=GetGenericCodes`, "POST", { CodeType: codeType})
            .done(function (data) {
                // console.log("loadGenericCodes data:", data);

                if (!selectTagId) {
                    return data;
                } else {
                    if (data.body.length > 0) {
                        var options = "";
                        for (var i = 0; i < data.body.length; i++) {
                            options += `<option value='${data.body[i].id}'>${data.body[i].description}</option>`;
                        }
                        //TypeOfAccount
                        $(selectTagId).html(options);

                    }
                }                
            });
    }
    setTimeout(function () { $("#txtCurrentPassword").val(""); }, 800);

   
});

$(window).load(function () {
    setTimeout(function () { $("#txtCurrentPassword").val(""); }, 800);
});

// To check a password between 8 to 20 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
function CheckPassword(pass) {
    var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
    if (pass.match(decimal)) {
        // alert('Correct, good to go...');
        return true;
    }
    // alert('Wrong...! Try again.');
    return false;
}
