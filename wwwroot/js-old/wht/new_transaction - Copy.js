var container = {};
var amount;
var taxpayerName;

// Get TaxPayer Data
var TaxPayerData = {};
var userId;
var periodId;
var taxOfficeId;
var whtAgentTaxpayerid;
var postalAddress;
var taxpayerPhone;
var taxpayerEmailAdd;
var getflRate, nhilRate, taxRate, whVatRate;
var RatesData = [];
var AttachmentFiles = [];
var DataSet = [];

//var BrowseMarriageCertificate = (el) => {
//    // Show Preloader
//    $('body').showLoading();

//    // Reset AttachmentFiles to Empty
//    AttachmentFiles = [];
//    AttachmentFiles.length = 0;
//    for (j = 0; j < el.files.length; j++) {
//        // Convert file to base64
//        GetEncodedAttachmentFile(el.files[j]);
//    }
//    setTimeout(function () {
//        //If any valid files
//        if (AttachmentFiles && AttachmentFiles.length > 0) {
//            // Get First Object
//            MarriageCertificate = AttachmentFiles[0];
//        }

//        // Hide Preloader
//        $('body').hideLoading();
//    }, 1000); // Delay 1Sec for the file collection to be loaded completely...

//}

var attachedData = {};

Dropzone.options.uploadWidget = {
    
    paramName: 'file',
    maxFilesize: 10, // MB
    maxFiles: 1,
    dictDefaultMessage: 'Drag your excel file here to upload, or click to select one',
    addRemoveLinks: true,
    autoProcessQueue: false,
    acceptedFiles: ".xlsx",  
    dictInvalidFileType: "Please upload only excel file types",
    
   
    accept: function (file, done) {
       
        var ext = (file.name).split('.')[1]; // get extension from file name
        if (ext != 'xlsx' || ext == 'png') {
            done("Please upload only excel file types"); // error message for user
        }
        else {           
            done();
        } // accept file
    },
    init: function () {
        var self = this;
        self.options.addRemoveLinks = true;

        var submitButton = document.querySelector("#upload");
        myDropzone = this;
        submitButton.addEventListener("click", function () {
            //toastr.info("Upload button works");
            myDropzone.processQueue();
        });

        this.on("complete", function (file) {
            if (this.getQueuedFiles().length == 0 && this.getUploadingFiles().length == 0) {
                var _this = this;

                $('body').showLoading();
                // Reset AttachmentFiles to Empty
                AttachmentFiles = [];
                AttachmentFiles.length = 0;
                for (j = 0; j < this.files.length; j++) {
                    // Convert file to base64
                    console.log(this.files[j]);
                   // GetEncodedAttachmentFile(this.files[j]);
                }
                setTimeout(function () {
                    //If any valid files
                    if (AttachmentFiles && AttachmentFiles.length > 0) {
                        // Get First Object
                        attachedData = AttachmentFiles[0];
                        console.log("Attached Data:", attachedData);
                    }

                    // Hide Preloader
                    $('body').hideLoading();
                }, 1000); // Delay 1sec for the file collection to be loaded completely...
                toastr.success("Successfully uploaded " + file.name);

                _this.removeAllFiles();
                $('#modal-import-trans-form').modal('hide');


                //now we can populate the grid with file content here
                $("#import_grid").kendoGrid({
                    dataSource: {
                        type: "odata",
                        data: DataSet

                    },
                   
                    //dataBound: onDataBound,
                    height: "400px",
                    selectable: true,
                    resizable: true,
                    groupable: false,
                    sortable: false,
                    pageable: {
                        refresh: true,
                        pageSizes: true,
                        buttonCount: 5
                    },
                    columns: [

                        { field: "date", title: "Date", width: "8%" },
                        { field: "contractNo", title: "Contract #", width: "10%" },
                        { field: "contDescription", title: "Description", width: "14%" },
                        { field: "invoiceNo", title: "Invoice #", width: "8%" },
                        { field: "transDescription", title: "Description", width: "14%" },
                        { field: "entity", title: "Entity", width: "12%" },
                        { field: "whType", title: "WH Type", width: "8%" },
                        { field: "taxWithHeld", title: "Amt. Withheld", width: "8%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" } },
                        { field: "grossAmountOfPayment", title: "Gross Amount", width: "8%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" } },
                        { field: "vatableAmt", title: "VATable Amount", width: "8%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" } },
                        
                    ]
                });
                document.getElementById('submitImportTrans').disabled = false;
            }
            
            else {
                toastr.warning("File could not be uploaded. Please try again");
            }
        });
       
        this.on("addedfile", function (file) {   
            self.options.dictRemoveFile = "" + file.name;
            //this.emit("thumbnail", file, "~/icons/iconx-excel.png");
            if ((file.name).split('.')[1] == 'xlsx') {
                $(file.previewElement).find(".dz-image img").attr("src", "/icons/iconx-excel.jpg")
            }
            
            file.previewElement.addEventListener("click", function () {
                self.removeFile(file);
                
            });
        });

        //this.on("removedfile", function (file) { toastr.warning("File Removed"); });
        this.on("maxfilesexceeded", function (file) {            
            toastr.error("Max number reached.");
            self.removeFile(file);
        });

    }
};


$(document).ready(function () {


    $(".datepicker").flatpickr({
        maxDate: "today",
        dateFormat: "d-m-Y"
    });

    //$("#transDate").click(function () {
    //    $("#transDate").datepicker({ dateFormat: 'dd-mm-yyyy' });
    //});

    //$(".phoneNumbers").css("width", "280px");
    $(".phoneNumbers").focus(function () {
        if (!this.value) {
            $(this).css("padding-left", "88px");
        }
    });
  
    document.getElementById('submitTrans').disabled = true;   

    getVatTypes();

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
            periodId = TaxPayerData.id;
            taxOfficeId = TaxPayerData.taxOffice.id;
            whtAgentTaxpayerid = TaxPayerData.id;           

           // console.log(TaxPayerData);

        }

    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
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


function viewTaxPayerForm() {
  
    //populate residency
    populateResidency();

    $('#invoiceDiv').css({ 'height': '435px' });
    $("#taxpayerinfo").prop("hidden", false); 
    $("#taxpayerinfo2").prop("hidden", false);
    $("#taxpayerinfo3").prop("hidden", false);    
    $("#nontaxpayerphone").prop("hidden", true);
    $("#nontaxpayerinfo").prop("hidden", true);
    $("#nontaxpayerinfo2").prop("hidden", true);
    $("#nontaxpayeraddress").prop("hidden", true);

    //clear Non Taxpayer fields
    $('#nameOfNonTaxPayer,  #emailOfNonTaxpayer, #phoneOfNonTaxPayer, #residencyOfNonTaxPayer, #addOfNonTaxPayer').val('');
            
    $("#transDate").focus();
    document.getElementById('taxCalculations').hidden = false;     
}

function viewNonTaxPayerForm() {

    //populate residency
    populateResidency();

    $('#nameOfTaxpayer, #TaxIdentificationNumber,  #emailOfTaxpayer, #phoneOfTaxPayer, #residencyOfTaxPayer').val('');
    $('#invoiceDiv').css({ 'height': '435px' });
    $("#nontaxpayerinfo").prop("hidden", false);
    $("#nontaxpayerphone").prop("hidden", false);
    $("#nontaxpayeraddress").prop("hidden", false);
    $("#nontaxpayerinfo").prop("hidden", false);
    $("#nontaxpayerinfo2").prop("hidden", false);
    $("#taxpayerinfo").prop("hidden", true);
    $("#taxpayerinfo2").prop("hidden", true);
    $("#taxpayerinfo3").prop("hidden", true);

    //clear Taxpayer fields
    


    $("#transDate").focus();
    document.getElementById('taxCalculations').hidden = false;     
}

$("#btnGetTransactionModal").click(function () {
    document.getElementById("WHTPageDataBody").hidden = false;
    document.getElementById("WHTPageImportDataBody").hidden = true;
});

$("#btnImport").click(function () {
    document.getElementById("WHTPageImportDataBody").hidden = false;
    document.getElementById("WHTPageDataBody").hidden = true;
});

$("#cancelTrans").click(function () {
    document.getElementById("WHTPageDataBody").hidden = true;
}); 

function checkAmountValues() {
    var contr_amount = Number(commaRemover(document.getElementById('contract_amount').value));
    var gross_amount = Number(commaRemover(document.getElementById('amount').value));

    //console.log(contr_amount);
    //console.log(gross_amount);

    if (gross_amount > contr_amount) {
        toastr.warning("Gross Amount can not be greater than Contract Amount. Please enter the right amount");
        document.getElementById('submitTrans').disabled = true;
        document.getElementById('amountCalculations').hidden = true;
    }
    else {
        document.getElementById('amountCalculations').hidden = false;

    }
    
}

function checkAmountValuesBefore() {
    if (document.getElementById('amount').value != '') {
        var contr_amount = Number(commaRemover(document.getElementById('contract_amount').value));
        var gross_amount = Number(commaRemover(document.getElementById('amount').value));

        //console.log(contr_amount);
        //console.log(gross_amount);

        if (gross_amount > contr_amount) {
            toastr.warning("Gross Amount can not be greater than Contract Amount. Please enter the right amount");
            document.getElementById('submitTrans').disabled = true;
            document.getElementById('amountCalculations').hidden = true;
        }
        else {
            document.getElementById('amountCalculations').hidden = false;

        }
    }

}
   

function submitNewTransaction() {
    PostWHTTransaction();
    document.getElementById("WHTPageDataBody").hidden = true;
}
    
document.getElementById('invoice').addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        checkInvoiceNumberLenth();    
          
    }
}); 

document.getElementById('emailOfNonTaxpayer').addEventListener("blur", function (event) {
    isEmailValid(document.getElementById('emailOfNonTaxpayer').value)    
}); 

document.getElementById('emailOfTaxpayer').addEventListener("blur", function (event) {
    isEmailValid(document.getElementById('emailOfTaxpayer').value)
}); 

function getTINData() {
    //document.getElementById("nameOfTaxpayer").value = "Augustine Akoto Larbi-Ampofo";
    GetTaxPayerEntityData();
    checkInvoiceNumber();
}

function populateResidency() {
    var dataModel = {
        CodeType: "RES",
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.body.length > 0) {
            //var options = "<option value=''>Please select</option>";
            var options = "<option value='0' selected disabled>Select Residency Type</option>";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].id}'>${data.body[i].description}</option>`;
            }
            //Residency Type
            $("#residencyOfNonTaxPayer").html(options);
            $("#residencyOfTaxPayer").html(options);

        }
    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
    });

}

function checkInvoiceNumberLenth() {

    if (document.getElementById('invoice').value == '') {
        toastr.warning("Invoice number cannot be left blank");
        document.getElementById('registrationCheck').hidden = true;
        document.getElementById('contractAndTransDec').hidden = true;
    }
    else {
        document.getElementById('registrationCheck').hidden = false;
        document.getElementById('contractAndTransDec').hidden = false;
    }
}

function checkInvoiceNumber() {
   
        $('#invoiceDiv').css({ 'height': '435px' });
        var dataModel = {
            CodeType: document.getElementById("invoice").value,
        };

        var postData = JSON.stringify(dataModel);

        var postUrl = `?handler=CheckInvoiceNumber`;
        //console.log('Checking the Invoice number:')
        $.post(postUrl, postData, function (data, status) {
            // Log response to console
            //console.log('Invoice Number Exists?: ', data)
            if (data.body == false) {
                document.getElementById('registrationCheck').hidden = false;                
                document.getElementById('contractAndTransDec').hidden = false;
            }
            else {
                clearSomeFields();
                document.getElementById('registrationCheck').hidden = true;
                document.getElementById('contractAndTransDec').hidden = true;
                document.getElementById('taxpayerinfo').hidden = true;
                document.getElementById('taxpayerinfo2').hidden = true;
                document.getElementById('taxpayerinfo3').hidden = true;
               
                toastr.warning("This Invoice has already been entered by this Entity. Please try another.")
            }

        }).fail(function (response) {
            console.log('Response Error: ' + response.responseText);
        });
       
}

function getVatTypes() {
    
    var postUrl = AppServerUrl + "/api/WHT/GetAllVatRates";
   
    $.post(postUrl, null, function (data, status) {
        // Log response to console
        //console.log('VAT Types Data: ', data);
        if (data.body.length > 0) {
           
            var options = "<option value='0' selected disabled>Select VAT Type</option>";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].id}'>${data.body[i].name}</option>`;
               
            }
            //Residency Type
            $("#vatType").html(options);
        }       

    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
        });
       
}

function checkIfVatRateIsLoadedBeforeComputingValues() {

    var id = document.getElementById("vatType").value;
    if (id == 0) {
        //do nothing
        //console.log("I'm doing nothing");
    }
    else {
        getVatRates();
    }

    
}

function getVatRates() {

    var postUrl = AppServerUrl + "/api/WHT/GetAllVatRates";
    var id = document.getElementById("vatType").value;

    $.post(postUrl, null, function (data, status) {
        // Log response to console
        //console.log('Rates Data: ', data);
        
        if (data.body.length > 0) {
           
            for (var i = 0; i < data.body.length; i++) {

                if (id == data.body[i].id) {
                    getflRate = data.body[i].getflRate;
                    nhilRate = data.body[i].nhilRate;
                    taxRate = data.body[i].rate;
                    whVatRate = data.body[i].whVatRate;
                }
            }

            //console.log("GETFL:", getflRate)
            //console.log("NHIL:", nhilRate)
            //console.log("Rate:", taxRate)
            //console.log("WHVAT:", whVatRate)
            document.getElementById('getflRateLabel').textContent = moneyInTxt(getflRate, 'en', 2);
            document.getElementById('nhilRateLabel').textContent = moneyInTxt(nhilRate, 'en', 2);
            document.getElementById('vatWHTAmountRateLabel').textContent = moneyInTxt(whVatRate, 'en', 2);

            RatesData.push(getflRate);
            RatesData.push(nhilRate);
            RatesData.push(taxRate);
            RatesData.push(whVatRate);

            //calc nhil
            amount = document.getElementById("amount").value;
            var nhil = ((nhilRate/100) * Number(commaRemover(amount))).toFixed(2);
            document.getElementById("NHIL").value = moneyInTxt(nhil, 'en', 2);

            //calc getfund
            
            var getfund = ((getflRate/100) * Number(commaRemover(amount))).toFixed(2);
            document.getElementById("getFund").value = moneyInTxt(getfund, 'en', 2);

            //calc vatable amt
            nhil = document.getElementById("NHIL").value;
            var temp_vatable = (((Number(commaRemover(amount)) + Number(commaRemover(nhil)) + Number(commaRemover(getfund)))).toFixed(2));
            document.getElementById("vatAmount").value = moneyInTxt(temp_vatable, 'en', 2);

            //calc vat withholding amt      
            vat_amount = document.getElementById("vatAmount").value;
            var vatWithHolding = ((whVatRate / 100) * Number(commaRemover(amount))).toFixed(2);
            document.getElementById("vatWHTAmount").value = moneyInTxt(vatWithHolding, 'en', 2);
                                                 
            //show taxrate
            document.getElementById("taxRate").value = taxRate;

            //console.log("Rates for Vat type selected: ", RatesData);
            RatesData = [];
            
        }

    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
    });

    //return RatesData;
}

function populateWHTType() {
    var code;

    if (document.getElementById("TaxIdentificationNumber").value == "") {
        code = document.getElementById("residencyOfNonTaxPayer").value;        
        //code = "11111"
    }
    else {      
        code = document.getElementById("residencyOfTaxPayer").value;
        //code = "22222"
    }
    //console.log(code);

    var dataModel = {
        CodeType: code
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetWHTTypeByResStatus`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
       // console.log('Response Data: ', data);
        if (data.body.length > 0) {
            //var options = "<option value=''>Please select</option>";
            var options = "<option value='0' selected disabled>Select WHT Type</option>";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].taxRate}' id='${data.body[i].whtCode}' class='wht'>${data.body[i].description}</option>`;
            }
            //Residency Type
            $("#whtType").html(options);
        }
        else {
            var options = "<option value='0' selected disabled>No WHT Type Available</option>";
            $("#whtType").html(options);
        }
    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
    });

}

function calTaxWithHeld() {
    var whtRate = document.getElementById("whtType").value;
    vat_amount = document.getElementById("vatAmount").value;
    var phoneCheck = document.getElementById('phoneOfNonTaxPayer').value + '' + document.getElementById('phoneOfTaxPayer').value;
    var taxWithHeld = ((whtRate / 100) * Number(commaRemover(vat_amount))).toFixed(2);
    
    document.getElementById('whtRateLabel').textContent = moneyInTxt($("#whtType option:selected").val(), 'en', 2);
    document.getElementById("taxWTH").value = moneyInTxt(taxWithHeld, 'en', 2); 

    var vatWHTAmount = document.getElementById("vatWHTAmount").value;
    var totalWithheld = NumberToMoney((commaRemover(taxWithHeld) + commaRemover(vatWHTAmount)));

    document.getElementById("totalTaxWTH").value = totalWithheld;

    var paymentAmount = document.getElementById('amount').value;
    var withHeld = document.getElementById("totalTaxWTH").value;

    //console.log("Withheld: ", commaRemover(withHeld));
    //console.log("Payment Amt: ", commaRemover(paymentAmount));

    document.getElementById("netPayAmt").value = NumberToMoney(commaRemover(paymentAmount) - commaRemover(withHeld));

    //check if required fields have been filled
    if (document.getElementById('invoice').value != '' && document.getElementById('taxWTH').value != '' && document.getElementById('transDate').value != '' && phoneCheck != '') {
              
        document.getElementById('submitTrans').disabled = false;

    }
    else {
        toastr.warning("Please make sure all required fields have been filled");
    }
   
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

var GetTaxPayerEntityData = function () {
    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        CodeType:  document.getElementById('TaxIdentificationNumber').value,
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
            document.getElementById('nameOfTaxpayer').value = "";
            toastr.warning("Invalid TIN");
        }

        if (data.body.length > 0) {
            $('body').hideLoading();
            document.getElementById('nameOfTaxpayer').value = ucwords(data.body[0].requestingEntityName);
            var numb = data.body[0].phoneNo;
            $("#phoneOfTaxPayer").css("padding-left", "88px");
            //display phone number without country code
            if (numb.substring(0, 4) == '+233') {
                document.getElementById('phoneOfTaxPayer').value = numb.substring(4, numb.length);
            }
            else {
                document.getElementById('phoneOfTaxPayer').value = numb.substring(1, numb.length);
            }
                      
            document.getElementById('emailOfTaxpayer').value = data.body[0].emailAddress;   
           

        }
       
       
        
    }).fail(function (response) {
        $('body').hideLoading();
        toastr.warning("Invalid TIN");
       // console.log('Response Error: ' + response.responseText);
    });
}

function toCamelCase() {
    var nameText = document.getElementById('nameOfNonTaxPayer').value;
    document.getElementById('nameOfNonTaxPayer').value = ucwords(nameText);
}

function clearFields() {
    $('#nameOfNonTaxPayer, #nameOfTaxpayer, #emailOfTaxpayer, #emailOfNonTaxpayer, #phoneOfNonTaxPayer, #phoneOfTaxPayer, #transDate, #invoice, #contractNum, #descOfContract, #descOfTrans').val('');
    $('#TaxIdentificationNumber, #residencyOfTaxPayer, #residencyOfNonTaxPayer, #addOfNonTaxPayer').val('');
    $('#contract_amount, #amount, #vatType, #whtType, #taxWTH, #NHIL, #getFund, #taxRate, #vatAmount, #vatWHTAmount, #taxWHT, #netPayAmt').val('');
    document.getElementById("yesTaxPayer").checked = false;
    document.getElementById("nonTaxPayer").checked = false;
    document.getElementById('whtRateLabel').textContent = '';
    document.getElementById('getflRateLabel').textContent = '';
    document.getElementById('nhilRateLabel').textContent = '';
    document.getElementById('contractAndTransDec').hidden = true;
    $('#invoiceDiv').css({ 'height': '92px' });
}

function clearSomeFields() {
    
    $('#transDate, #descOfContract, #descOfTrans, #TaxIdentificationNumber').val('');    
    document.getElementById("yesTaxPayer").checked = false;
    document.getElementById("nonTaxPayer").checked = false;
    
}

function clearTINdetails() {
    document.getElementById('emailOfTaxpayer').value = '';
    document.getElementById('nameOfTaxpayer').value = '';
    document.getElementById('phoneOfTaxPayer').value = '';
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

    //switch the phones for taxpayers and non taxpayers for the data {if taxpayer on  itaps or not}
    if (document.getElementById("nameOfNonTaxPayer").value == "") {
        PhoneNumber = document.getElementById('phoneOfTaxPayer').value;
    }
    else {
        PhoneNumber = document.getElementById('phoneOfNonTaxPayer').value;
    }
     //console.log(code);

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
            

            if (json.valid == true && json.line_type == 'landline') {
                document.getElementById("phoneOfTaxPayer").style.borderColor = "darkred";
                document.getElementById("phoneOfNonTaxPayer").style.borderColor = "darkred";
                
                toastr.warning('Landlines are not accepted. Please use a mobile number.')
            }

            else if (json.valid == false) {
                document.getElementById("phoneOfTaxPayer").style.borderColor = "darkred";
                document.getElementById("phoneOfNonTaxPayer").style.borderColor = "darkred";
                
                toastr.warning('Invalid Phone Number');
            }
            else if (json.valid == true && json.line_type == 'mobile') {
                document.getElementById("phoneOfTaxPayer").style.borderColor = "green";
                document.getElementById("phoneOfNonTaxPayer").style.borderColor = "green";

                setTimeout(function () {
                    document.getElementById("phoneOfTaxPayer").style.border = '1px solid #dbdfe4';
                    document.getElementById("phoneOfNonTaxPayer").style.border = '1px solid #dbdfe4';
                }, 1000);               
                
               
            }

        }
    }).fail(function (response) {
        $('body').hideLoading();
        toastr.warning('Number validation failed. Please try re-entering your number')
        
    });
   
}

function resetForm() {
    
    clearFields();
    $("#taxpayerinfo").prop("hidden", true);
    $("#taxpayerinfo2").prop("hidden", true);
    $("#taxpayerinfo3").prop("hidden", true);
    $("#nontaxpayerphone").prop("hidden", true);
    $("#nontaxpayerinfo").prop("hidden", true);
    $("#nontaxpayerinfo2").prop("hidden", true);
    $("#nontaxpayeraddress").prop("hidden", true); 
    $("#taxCalculations").prop("hidden", true); 
    $("#registrationCheck").prop("hidden", true);
    //console.log("Resetting the form");

}

function checkAllRequiredFields() {
    var contract = document.getElementById("contractNum").value;
    var invoice = document.getElementById("invoice").value;
    var conDesc = document.getElementById("descOfContract").value;
    var invDesc = document.getElementById("descOfTrans").value;
    var tDate = document.getElementById("transDate").value;

    if (contract == '' || invoice == '' || conDesc == '' || invDesc == ''
        || tDate == '') {
        return false;
    }
    else {
        return true;
    }
}

var PostWHTTransaction = function() {
       
    //switch the names for taxpayers and non taxpayers for the data {if taxpayer on  itaps or not}
    if (document.getElementById("nameOfNonTaxPayer").value == ""){
        taxpayerName = document.getElementById("nameOfTaxpayer").value;
        busLocation = "";
        taxpayerEmail = document.getElementById("emailOfTaxpayer").value;
        taxpayerTel = document.getElementById("phoneOfTaxPayer").value;
        resStatusId = document.getElementById("residencyOfTaxPayer").value;

    }
    else {
        taxpayerName = document.getElementById("nameOfNonTaxPayer").value;
        taxpayerEmail = document.getElementById("emailOfNonTaxpayer").value;
        busLocation = document.getElementById("addOfNonTaxPayer").value;
        taxpayerTel = document.getElementById("phoneOfNonTaxPayer").value;
        resStatusId = document.getElementById("residencyOfNonTaxPayer").value;
    }

    //PostWHTTransaction
    var tDate = document.getElementById("transDate").value;
    
    var dataModel = {
        whtAgentTaxpayerId: whtAgentTaxpayerid,
        tin: document.getElementById("TaxIdentificationNumber").value,
        transactionDate: tDate.substring(6, tDate.length) + '-' + tDate.substring(3, 5) + '-' + tDate.substring(0, 2),
        //periodId: periodId,
        resStatusId: resStatusId,
        taxOfficeId: taxOfficeId,
        userId: userId,
        invoiceNumber: document.getElementById("invoice").value,
        busLocation: busLocation,
        taxpayerName: taxpayerName,
        whtAgentTIN: nameTIN.TIN,
        whtType: document.getElementById("whtType").getElementsByClassName("wht")[document.getElementById("whtType").selectedIndex-1].id,
        contractAmt: document.getElementById("contract_amount").value,
        grossPaymentAmt: document.getElementById("amount").value,
        taxRate: document.getElementById('whtRateLabel').textContent,
        //taxRate: document.getElementById("taxRate").value,
        taxWithHeld: document.getElementById('taxWTH').value,          
        taxpayerTel: taxpayerTel,
        taxpayerEmail: taxpayerEmail,
        vatableAmt: document.getElementById('vatAmount').value,
        vatTypeId: "76fc27c6-7033-47cc-b97d-6816f82f1654",
        contractNo: document.getElementById("contractNum").value,  
        contractDesc: document.getElementById("descOfContract").value,
        invoiceDesc: document.getElementById("descOfTrans").value,
        Permissions: nameTIN.Codes
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    //check if require fields have been filled

        if (checkAllRequiredFields() == false) {
            toastr.error("Unsuccessful Transaction. Please make sure all required fields have been filled")
        }
        else {
            //Call Local API
            var postUrl = `?handler=PostWHTTransaction`;
            $.post(postUrl, postData, function (data, status) {
                // Log response to console
                //console.log('Response Data: ', data);

                if (data.status == "Successful") {
                    toastr.success("Your Transaction has been submitted successfully.");
                    //clearFields();
                    //setTimeout(function () { window.location = `${AppServerUrl}/wht`; }, 1000); //1000 means 1 secs       
                    setTimeout(resetForm(), 1000);
                } else {

                    toastr.warning("Your Transaction could not be submitted. Please try again.");

                    // Hide Preloader
                    $('body').hideLoading();
                }
            }).fail(function (response) {
                console.log('Response Error: ' + response.responseText);
                clearFields();
                // Hide Preloader
                $('body').hideLoading();
            });
        }
     
}

