// Get TaxPayer Data
var TaxPayerData = {};
var userId;
var periodId;
var taxOfficeId;
var taxpayerID;
var postalAddress;
var taxpayerPhone;
var taxpayerEmailAdd;
var taxpayerName;
var AttachedFile = [];
var AttachmentFiles = [];
var AttachmentFileExts = ["pdf"]; //, "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
var ExpectedCompanyName = "";
var nameValidationFlag = 0;
var flag = 0;


$(document).ready(function () {
    //alert("you made updates");
    populateTenancy();
    populateRegion();
    //populateCurrency();

    $(".phoneNumbers").focus(function () {
        if (!this.value) {
            $(this).css("padding-left", "88px");
        }
    });

    $(".datepicker").flatpickr({
        maxDate: "today",
        dateFormat: "d-m-Y"
    });

    
});

//All ajax requests are made through this
function newAjaxRequest(url, method, data = "") {
    return $.ajax({
        url: url,
        method: method,
        crossDomain: true,
        data: JSON.stringify(data)
    }).done(function () {

    })
        .fail(function (xhr) {
            switch (xhr.status) {
                case 401:
                    // console.log("msg.unauthorized");
                    break;
                case 404:
                    // console.log("msg.notFound");
                    break;
                case 409:
                    //  console.log("msg.conflict");
                    break;
                default:
                    console.log("msg.fail + msg.contactAdmin");
                    break;
            }
        });
}


function GetAdminData() {
    var dataModel = {
        TIN: nameTIN.TIN // Get from localStorage
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerData`;
    $.post(postUrl, postData, function (data, status) {
        //console.log('GetTaxPayerData Data: ', data);

        // Display on view
        if (data.status === "Successful") {

            // Keep object for future use.
            TaxPayerData = data.body;

            userId = TaxPayerData.id;            
            taxOfficeId = TaxPayerData.taxOffice.id;           

            // console.log(TaxPayerData);
            document.getElementById('admin_email').value = TaxPayerData.emailAddress;

            $("#admin_contact").css("padding-left", "88px");

            var numb = TaxPayerData.mobileNumber;
            //display phone number without country code
            if (numb.substring(0, 4) == '+233') {
                document.getElementById('admin_contact').value = numb.substring(4, numb.length);
            }
            else {
                document.getElementById('admin_contact').value = numb.substring(1, numb.length);
            }

        }

    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
    });
}

//capitalize words
function camelize(str, force = true) {
    str = force ? str.toLowerCase() : str;
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
        function (firstLetter) {
            return firstLetter.toUpperCase();
        });
}

document.getElementById('companyTin').addEventListener("change", function (event) {
    GetTaxPayerEntityData();
    GetTypeOfUser();
});

document.getElementById('auth_tin').addEventListener("change", function (event) {
    GetAuthorizerData();
});

document.getElementById('companyName').addEventListener("change", function (event) {
    CheckIfTINExistsAsync();   
    
});

function GetTypeOfUser() {
    var tin = document.getElementById('companyTin').value;

    var dataModel = {
        strTin: tin
    };

    var postData = JSON.stringify(dataModel);

    $('body').showLoading();  

    //Call Local API   
    var postUrl = AppServerUrl + '/api/WHT/TINValidationAsync';
    $.post(postUrl, postData, function (data, status) {
        $('body').hideLoading();
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.status == 0) {
            toastr.warning(tin + " is not a valid TIN");
            document.getElementById('companyTin').value = '';
            flag = 0;
        }
        if (data.status == 1) {
            toastr.warning(tin + " is already registered");
            document.getElementById('companyTin').value = '';
            flag = 0;
        }
        if (data.status == 1009) { 
            //toastr.warning("Error with Serivce. Please try again later");
            document.getElementById('companyTin').value = '';
            flag = 0;
        }
        if (data.tinType == "P") {
            toastr.warning(tin + " is not a Company TIN");
            document.getElementById('companyTin').value = '';
            flag = 0;
        }

    }).fail(function (response) {
        toastr.warning("TRIPS service is currently down");
        // Hide Preloader
        $('body').hideLoading();
    });

}

var GetTaxPayerEntityData = function () {
    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        CodeType: document.getElementById('companyTin').value,
    };

    var postData = JSON.stringify(dataModel);
    // console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerEntityData`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);

        if (data.caption == "No Content") {
            $('body').hideLoading();
            document.getElementById('companyName').value = "";
            toastr.warning("Invalid TIN");
        }

        if (data.caption == "Internal Server Error") {
            $('body').hideLoading();
            document.getElementById('companyName').value = "";
            toastr.warning("Invalid TIN");
        }

        if (data.body.length > 0) {
            $('body').hideLoading();
            //document.getElementById('companyName').value = camelize(data.body[0].entityName); 
            ExpectedCompanyName = camelize(data.body[0].entityName); 
            //console.log(ExpectedCompanyName);
        }



    }).fail(function (response) {
        $('body').hideLoading();
        toastr.warning("Invalid TIN");
        // console.log('Response Error: ' + response.responseText);
    });
}

var GetAuthorizerData = function () {
    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        CodeType: document.getElementById('auth_tin').value,
    };

    var postData = JSON.stringify(dataModel);
    // console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerEntityData`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);

        if (data.caption == "No Content") {
            $('body').hideLoading();
            document.getElementById('auth_tin').value = "";
            toastr.warning("Invalid TIN");
            flag = 0;
        }

        if (data.caption == "Internal Server Error") {
            $('body').hideLoading();
            document.getElementById('auth_tin').value = "";
            toastr.warning("Invalid TIN");
            flag = 0;
        }

        if (data.body.length > 0) {
            $('body').hideLoading();            
            //console.log(ExpectedCompanyName);
            flag = 1;
        }



    }).fail(function (response) {
        $('body').hideLoading();
        toastr.warning("Invalid TIN");
        // console.log('Response Error: ' + response.responseText);
    });
}


    function populateTenancy() {
            var dataModel = {
                CodeType: "TES",
            };

            var postData = JSON.stringify(dataModel);
            //console.log("postData", postData);

            // Call Local API
            var postUrl = `?handler=GetGenericCodes`;
            $.post(postUrl, postData, function (data, status) {
                // Log response to console
                //console.log('Response Data: ', data);
                if (data.body.length > 0) {
                    var options = "<option disabled selected value='0'>Please select</option>";                    
                    for (var i = 0; i < data.body.length; i++) {
                        options += `<option value='${data.body[i].id}'>${data.body[i].description}</option>`;
                    }
                    //Tenancy Type
                    $('#tenancyType').html(options);


                }
            }).fail(function (response) {
                console.log('Response Error: ' + response.responseText);
            });

    }

    //load Regions
    function populateRegion() {
               
        var dataModel = {
            CodeType: "REG",
        };

        var postData = JSON.stringify(dataModel);
        //console.log("postData", postData);

        // Call Local API
        var postUrl = `?handler=GetGenericCodes`;
        $.post(postUrl, postData, function (data, status) {
            // Log response to console
            //console.log('Response Data: ', data);
            if (data.body.length > 0) {
                var options = "<option disabled selected value='0'>Please select</option>";
                for (var i = 0; i < data.body.length; i++) {
                    options += `<option value='${data.body[i].id}'>${data.body[i].description}</option>`;
                }
                //Tenancy Type
                $('#regionType').html(options);

            }
        }).fail(function (response) {
            console.log('Response Error: ' + response.responseText);
        });


    }

    //load Tax Office Region
    function loadTaxOfficeByRegion() {
        $('body').showLoading();
        
        var dataModel = {
            CodeType: document.getElementById('regionType').value,
        };

        var postData = JSON.stringify(dataModel);
        //console.log("postData", postData);

        // Call Local API
        //var postUrl = `?handler=GetGTAOByRegionIdAsync`;
        var postUrl = AppServerUrl + "/api/WHT/GetGTAOByRegionIdAsync";
        $.post(postUrl, postData, function (data, status) {
            // Log response to console
            //console.log('Response Data: ', data);
            if (data.body.length > 0) {
                $('body').hideLoading();
                document.getElementById('taxOfficeType').disabled = false;
                var options = "<option disabled selected value='0'>Please select</option>";
                for (var i = 0; i < data.body.length; i++) {
                    options += `<option value='${data.body[i].id}'>${data.body[i].name}</option>`;
                }
                //Tenancy Type
                $('#taxOfficeType').html(options);

            } else {
                $('body').hideLoading();
            }

        }).fail(function () {
            $('body').hideLoading();
            toastr.warning("Tax Office could not be loaded");
        });
    }

    //load Currency
    function populateCurrency() {      
        
        // Call Local API        
        var postUrl = AppServerUrl + "/api/WHT/GetGTRCAllAsync";
        
        //var postUrl = `?handler=GetGTRCAllAsync`;

        $.post(postUrl, null, function (data, status) {
            // Log response to console
            //console.log('Response Data: ', data);
            if (data.body.length > 0) {
                var options = "<option disabled selected value='0'>Please select</option>";
                for (var i = 0; i < data.body.length; i++) {
                    options += `<option value='${data.body[i].id}'>${data.body[i].description} (${data.body[i].symbol})</option>`;
                }
                //Tenancy Type
                $('#currencyType').html(options);

            }
        }).fail(function (response) {
            console.log('Response Error: ' + response.responseText);
        });

      
}

    function isEmailValid(email) {

    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;

    if (re.test(String(email).toLowerCase()) == false) {
        toastr.warning('Not a valid Email Format');
        // document.getElementById('btnContinue').disabled = true;
    }
    else {
        return;
    }

}

    function resetForm() {
        $("#company_email, #companyName, #companyTin, #admin_email, #admin_contact, #phoneCIT, #tenancyType, #currencyType, #taxOfficeType, #regionType, #files").val("");
}


    function CheckIfTINExistsAsync() {

        var namesThatPassed = [];
        var nameFromService = ExpectedCompanyName.split(' ');
        var strCompanyName = document.getElementById('companyName').value;

        var namesTyped = strCompanyName.split(' ');

        //console.log(namesThatPassed);
        //console.log(nameFromService);
        //console.log(strCompanyName);
        //console.log(namesTyped);

        for (var i in namesTyped) {
            //console.log(namesTyped[i]);
            if (nameFromService.includes(camelize(namesTyped[i]))) {
                //console.log(namesTyped[i]);
                namesThatPassed.push(camelize(namesTyped[i]));
            }
            //console.log("Names Passed:", namesThatPassed);
        }

        if (namesThatPassed.length > nameFromService.length - 2) {
            //console.log("Passed");
            nameValidationFlag = 1;
            document.getElementById('companyName').value = ExpectedCompanyName;
        }
        else {
            //console.log("Failed");
            nameValidationFlag = 0;
            toastr.warning("Company Name provided does not match TIN provided. Please check and try again.");
            document.getElementById("companyName").style.borderColor = "darkred";

            setTimeout(function () {
                document.getElementById("companyName").style.border = '1px solid #dbdfe4';               
            }, 3000);
        }    
    }

    document.getElementById('company_email').addEventListener("blur", function (event) {
        isEmailValid(document.getElementById('company_email').value)
    });

    document.getElementById('admin_email').addEventListener("blur", function (event) {
        isEmailValid(document.getElementById('admin_email').value)
    }); 

    document.getElementById('files').addEventListener("change", function (event) {
        checkRequiredFields();
    }); 




var IsFileValid = function (file) {
    if (!AttachmentFileExts.includes(file.Ext)) {
        toastr.info(`${file.Name} is an invalid file format. Please select a PDF file.`);
        document.getElementById('submitReg').disabled = true;
        return false;
    }
    if (file.Size > 1048576) {
        toastr.info(`${file.Name} file size is too big. Please select a file not bigger than 1MB.`);
        document.getElementById('submitReg').disabled = true;
        return false;
    }
    return true;
}

var GetEncodedAttachmentFile = (file) => {

    // Reset AttachmentFile
    var AttachmentFile = {};
    AttachmentFile.Size = file.size;
    AttachmentFile.Type = file.type;
    AttachmentFile.Ext = file.name.split('.').pop();
    AttachmentFile.Name = file.name.substring(0, file.name.lastIndexOf("."));
    AttachmentFile.Width = 0;
    AttachmentFile.Height = 0;

    // Initialize file reader
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = ((el) => {
        return (e) => {

            AttachmentFile.Data = e.target.result;
            var imgExts = ["png", "jpg", "jpeg"];
            if (imgExts.includes(AttachmentFile.Ext)) {
                var img = new Image;
                img.src = AttachmentFile.Data;

                img.onload = () => {
                    AttachmentFile.Width = img.width;
                    AttachmentFile.Height = img.height;
                }
            }
            // Check if file type is valid
            if (IsFileValid(AttachmentFile)) {
                AttachmentFiles.push(AttachmentFile);
            }
        };
    })(file);

    // Read in the image file as a data URL.
    reader.readAsDataURL(file);
}


    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object

        // files is a FileList of File objects. List some properties.
     
        for (var i = 0, f; f = files[i]; i++) {
            //console.log(files[i])
            //convert base64
            GetEncodedAttachmentFile(files[i]);
        }       
    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    
    // display file contents
$('#submitReg').click(function () {

    // Show Preloader
    $('body').showLoading();

    checkRequiredFields();

    if (flag == 1) {
        var phone = document.getElementById('phoneCIT').value;
        if (phone.charAt(0) == '0') {
            //remove the 0 at the beginning of the number
            phone = phone.substring(1, phone.length);
        }
        else {
            phone = phone;
        }

        var phone2 = document.getElementById('admin_contact').value;
        if (phone2.charAt(0) == '0') {
            //remove the 0 at the beginning of the number
            phone2 = phone2.substring(1, phone.length);
        }
        else {
            phone2 = phone2;
        }

        var tDate = document.getElementById("dateOfAuth").value;

        var dataModel = {
            Permissions: nameTIN.Codes,
            tin: document.getElementById("companyTin").value,
            email: document.getElementById("company_email").value,
            companyPhone: country_code + phone,
            companyName: document.getElementById("companyName").value,
            currencyId: document.getElementById("currencyType").value,
            taxOfficeId: document.getElementById("taxOfficeType").value,
            tenancyStatusId: document.getElementById("tenancyType").value,
            //admin detail
            adminTin: nameTIN.TIN,
            adminTaxpayerId: userId,
            adminPhone: country_code + phone2,
            adminEmail: document.getElementById("admin_email").value,
            citAuthorityDocx: AttachmentFiles[0].Data,
            //authorizer's  detail
            authorizorTin: document.getElementById("auth_tin").value,
            authorizorPosition: "string",
            rgdNo: document.getElementById("rgd").value,
            dateAuthorized: tDate.substring(6, tDate.length) + '-' + tDate.substring(3, 5) + '-' + tDate.substring(0, 2)
        };

        //console.log(dataModel)
        var postData = JSON.stringify(dataModel);

        //Call Local API   
        var postUrl = AppServerUrl + '/api/WHT/RegisterCompany';
        $.post(postUrl, postData, function (data, status) {
            // Log response to console
            //console.log('Response Data: ', data);

            if (data.status == "Successful") {
                // Hide Preloader
                $('body').hideLoading();
                toastr.success(dataModel.companyName + " Successfully Registered");
                //clearFields();
                setTimeout(function () { window.location = `${AppServerUrl}/home`; }, 2000); //1000 means 1 secs       
                //setTimeout(resetForm(), 1000);
            } else {

                toastr.warning(dataModel.companyName + " has already been registered.");

                // Hide Preloader
                $('body').hideLoading();
            }
        }).fail(function (response) {
            console.log('Response Error: ' + response.responseText);
            // Hide Preloader
            $('body').hideLoading();
        });
    }

    else {
        // Hide Preloader
        $('body').hideLoading();
       // toastr.warning("Please make sure all required fields have been filled");
    }

    
});


    function checkRequiredFields() {
        var compTIN = document.getElementById('companyTin').value;
        var tenancyStatus = document.getElementById('tenancyType').value;
        var adminCon = document.getElementById('admin_contact').value;
        var adminEmail = document.getElementById('admin_email').value;
        var compPhone = document.getElementById('phoneCIT').value;
        var compEmail = document.getElementById('company_email').value;
        var taxOffice = document.getElementById('taxOfficeType').value;
        var currency = document.getElementById('currencyType').value;
        var rgd = document.getElementById('rgd').value;
        var auth_tin = document.getElementById('auth_tin').value;
        var dateOfAuth = document.getElementById('dateOfAuth').value;
        var attache = document.getElementById('files').value;

        if ((compTIN == '' || tenancyStatus == '' || adminCon == '' || adminEmail == '' || rgd == '' || auth_tin == ''
            || compPhone == '' || compEmail == '' || taxOffice == '' || currency == '' || dateOfAuth == '' || attache == '') || nameValidationFlag == 0)
        {
            if (nameValidationFlag == 0) {
                toastr.warning("Please make sure Company name is valid.")
                //document.getElementById('submitReg').disabled = true;
                flag = 0;
            }
            else if (attache == '') {
                toastr.warning("Please make sure you have attached a Consent form.")
                //document.getElementById('submitReg').disabled = true;
                flag = 0;
            }

            else {
                toastr.warning("Please make sure all required fields have been filled.")
                //document.getElementById('submitReg').disabled = true;
                flag = 0;
            }
           
        }
        else
        {
            flag = 1;
            document.getElementById('submitReg').disabled = false;
        }
        
    }
    


    function showCode(id) {
        // console.log(id);
        var code = ($(`#${id}`).parent('.intl-tel-input').find(".selected-dial-code").text());
        var countryCode = $(`#${id}`).parent('.intl-tel-input').find(".iti-flag").attr("class");
        //console.log(countryCode.split(" ")[1] + code);
        country_code = code;

    }

    function validatePhone() {
        $('body').showLoading();
        // send API request
        var countryCode = $(".iti-flag").attr("class");
        var code = countryCode.split(" ")[1];

        var PhoneNumber = document.getElementById('phoneCIT').value;

        console.log(code);

        // set endpoint and your access key
        var free_access_key = '7c37b761adbea422bb6f1beffbd3d234';
        var paid_access_key = '05d7f2c6c167f4bd2e737b276e01b594'
        var phone_number = PhoneNumber;

        // verify phone number via AJAX call
        $.ajax({
            url: 'https://apilayer.net/api/validate?access_key=' + paid_access_key + '&number=' + phone_number + '&country_code=' + code,
            dataType: 'jsonp',
            success: function (json) {
                $('body').hideLoading();


                //if (json.valid == true && json.line_type == 'landline') {
                //    document.getElementById("phoneCIT").style.borderColor = "darkred";
                //    document.getElementById("phoneCIT").style.borderColor = "darkred";

                //    toastr.warning('Landlines are not accepted. Please use a mobile number.')
                //}

                if (json.valid == false) {
                    document.getElementById("phoneCIT").style.borderColor = "darkred";
                    document.getElementById("phoneCIT").style.borderColor = "darkred";

                    toastr.warning('Invalid Contact Number');
                }
                else if (json.valid == true && (json.line_type == 'mobile' || json.line_type == 'landline')) {
                    document.getElementById("phoneCIT").style.borderColor = "green";
                    document.getElementById("phoneCIT").style.borderColor = "green";

                    setTimeout(function () {
                        document.getElementById("phoneCIT").style.border = '1px solid #dbdfe4';
                        document.getElementById("phoneCIT").style.border = '1px solid #dbdfe4';
                    }, 1000);


                }

            }
        }).fail(function (response) {
            $('body').hideLoading();
            toastr.warning('Number validation failed. Please try re-entering your number')

        });

    }


