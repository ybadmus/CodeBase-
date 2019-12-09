document.getElementById('searchInvoice').addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        GetGWTTByInvoiceNumber();
        document.getElementById('WHTPageUpdateDataBody').hidden = false;
        //$("#update_table").data('kendoGrid').dataSource.data(DataSet);
    }

    if (document.getElementById('searchInvoice').value == "") {
        document.getElementById('WHTPageUpdateDataBody').hidden = true;
    }
}); 


var GetGWTTByInvoiceNumber = function () {
    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        CodeType: document.getElementById('searchInvoice').value,
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetGWTTByInvoiceNumber`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        console.log('Response Data: ', data);

        if (data.body && data.body.length > 0) {
            document.getElementById('invoice').value = data.body[0].invoiceNumber;
            //var date = (data.body[0].transactionDate).substring(0, 10);
            //var tempDate = date.substring(8, 10) + "-" + date.substring(5, 7) + "-" + date.substring(0, 4);
            document.getElementById('transDate').value = data.body[0].transactionDate;

            var phonenumb = data.body[0].taxpayerTel;  
            if (phonenumb.substring(0, 4) == '+233') {
                document.getElementById('phoneOfNonTaxPayer').value = phonenumb;
            }
            else if (phonenumb.length == 10 && phonenumb.charAt(0) == '0') {
                document.getElementById('phoneOfNonTaxPayer').value = phonenumb;
            }
            else if (phonenumb.length == 9 && phonenumb.charAt(0) != '0') {
                document.getElementById('phoneOfNonTaxPayer').value = '0' + phonenumb;
            }
            else {
                document.getElementById('phoneOfNonTaxPayer').value = '+233' + phonenumb.substring(1, phonenumb.length);;
            }
                      
            document.getElementById('vatAmount').value = moneyInTxt(data.body[0].vatableAmt);
            if (data.body[0].businessLocation == '') {
                document.getElementById('address').value = "N/A";
            }
            else {
                document.getElementById('address').value = data.body[0].businessLocation;
            }            
            document.getElementById('taxRate').value = moneyInTxt(data.body[0].whtRate);
            document.getElementById('taxWTH').value = moneyInTxt(data.body[0].taxWithHeld, 'en', 2);
            document.getElementById('nameOfTaxpayer').value = ucwords(data.body[0].taxpayerName, true);
            document.getElementById('whtType').value = data.body[0].whtType;     
            document.getElementById('descOfContract').value = data.body[0].contractDesc;     
            document.getElementById('descOfTrans').value = data.body[0].invoiceDesc;   
            document.getElementById('contract').value = data.body[0].contractNo;

            if (data.body[0].taxpayerTIN == '') {
                document.getElementById('TaxIdentificationNumber').value = "N/A";
            }
            else {
                document.getElementById('TaxIdentificationNumber').value = data.body[0].taxpayerTIN;
            }    
            document.getElementById('contract_amount').value = moneyInTxt(data.body[0].contractAmount, 'en', 2);
            document.getElementById('amount').value = moneyInTxt(data.body[0].grossAmount, 'en', 2);
            document.getElementById('status').textContent = data.body[0].status;

            if (data.body[0].status == "ACTIVE") {
                document.getElementById('green').hidden = false;
                document.getElementById('red').hidden = true;
                document.getElementById('status').hidden = false; 
                document.getElementById('revokeButt').disabled = false;
            }
            else {
                document.getElementById('red').hidden = false;
                document.getElementById('green').hidden = true;
                document.getElementById('status').hidden = false;
                document.getElementById('revokeButt').disabled = true;
            }
            
            $('body').hideLoading();
        }
        else {
            $('body').hideLoading();
            document.getElementById('WHTPageUpdateDataBody').hidden = true;
            toastr.warning("No such transaction has been made.");
            document.getElementById('red').hidden = true;
            document.getElementById('green').hidden = true;
            document.getElementById('status').hidden = true;
                
        }



    }).fail(function (response) {
        $('body').hideLoading();
        toastr.warning("No such transaction has been made.");
        document.getElementById('red').hidden = true;
        document.getElementById('green').hidden = true;
        document.getElementById('status').hidden = true;
        // console.log('Response Error: ' + response.responseText);
    });
}

var RevokeTransaction = function () {
    $('body').showLoading();   
    var dataModel = {
        CodeType: document.getElementById('searchInvoice').value
    };

    var putData = JSON.stringify(dataModel);
    //console.log("putData", putData);
   
    // Call Local API
    var putUrl = `?handler=RevokeWithHoldingTaxTransaction`;
    $.post(putUrl, putData, function (data, status) {
        // Log response to console
        console.log('Response Data: ', data);

        if (data.status == "Successful") {
            toastr.success("The Transaction has been successfully revoked.");
            setTimeout(function () { window.location = `${AppServerUrl}/wht`; }, 1000); //1000 means 1 secs           
        } else {
            toastr.warning("The Transaction could not be revoked. Please try again.");

            // Hide Preloader
            $('body').hideLoading();
            document.getElementById('red').hidden = true;
            document.getElementById('green').hidden = true;
            document.getElementById('status').hidden = true;
        }
    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);

        // Hide Preloader
        $('body').hideLoading();
    });
}
// $("#update_table").data('kendoGrid').dataSource.data(historyData);

$("#searchInvoiceButt, #searchInvoiceButtIcon").click(function () {
   
    GetGWTTByInvoiceNumber();
    document.getElementById('WHTPageUpdateDataBody').hidden = false;
});



$("#close_update_form").click(function () {
    document.getElementById("WHTPageUpdateDataBody").hidden = true;
    document.getElementById("status").hidden = true;
    document.getElementById("green").hidden = true;
    document.getElementById("red").hidden = true;
    document.getElementById("searchInvoice").value = "";
});



$(document).on('click', '.updateModal', function () {
    $('#modal_update_form').modal('show');
    console.log("sdasdasda")
})
    
$("#cancelTransaction").click(function () {
    RevokeTransaction();
    document.getElementById('WHTPageUpdateDataBody').hidden = true;
});


