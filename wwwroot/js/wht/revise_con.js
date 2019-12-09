document.getElementById('searchContract').addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        GetGWTTByContractNumber();
        GetAdminData();
        document.getElementById('WHTPageUpdateDataBody').hidden = false;
       
        //$("#update_table").data('kendoGrid').dataSource.data(DataSet);
        
    }

    if (document.getElementById('searchContract').value == "") {
        document.getElementById('WHTPageUpdateDataBody').hidden = true;
    }
}); 

var currentUserId;

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

            currentUserId = TaxPayerData.id;
            taxOfficeId = TaxPayerData.taxOffice.id;           

        }

    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
    });
}

var GetGWTTByContractNumber = function () {
    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        CodeType: document.getElementById('searchContract').value,
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = AppServerUrl + "/api/WHT/GetGWTTByContractNumber";
    //var postUrl = `?handler=GetGWTTByContractNumber`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);

        if (data.body && data.body.length > 0) {
            document.getElementById('contract_amount').value = moneyInTxt(data.body[0].contractAmount, 'en', 2);
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
                      
            
            if (data.body[0].businessLocation == '') {
                document.getElementById('address').value = "N/A";
            }
            else {
                document.getElementById('address').value = data.body[0].businessLocation;
            }            
           
            document.getElementById('nameOfTaxpayer').value = ucwords(data.body[0].taxpayerName, true);
             
            document.getElementById('descOfContract').value = data.body[0].contractDesc;     
           
            document.getElementById('contract').value = data.body[0].contractNo;

            if (data.body[0].taxpayerTIN == '') {
                document.getElementById('TaxIdentificationNumber').value = "N/A";
            }
            else {
                document.getElementById('TaxIdentificationNumber').value = data.body[0].taxpayerTIN;
            }             
                       
            
            $('body').hideLoading();
        }
        else {
            $('body').hideLoading();
            document.getElementById('WHTPageUpdateDataBody').hidden = true;
            toastr.warning("There is no record of this contract.");
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

var ReviseWithHoldingTaxTransaction = function () {
   
    $('body').showLoading();   

    var dataModel = {
        Permissions: nameTIN.Codes,
        contractNo: document.getElementById('contract').value,
        contractAmt: document.getElementById('contract_amount').value,
        contractDesc: document.getElementById('descOfContract').value,
        userId: currentUserId     
    };

    var putData = JSON.stringify(dataModel);
    console.log("putData", putData);
   
    // Call Local API
    var putUrl = AppServerUrl + '/api/WHT/ReviseWithHoldingTaxTransaction';
   
    //var putUrl = `?handler=ReviseWithHoldingTaxTransaction`;
    $.post(putUrl, putData, function (data, status) {
        // Log response to console
        console.log('Response Data: ', data);

        if (data.status == "Successful") {
            toastr.success("The Contract has been successfully revised.");
            setTimeout(function () { window.location = `${AppServerUrl}/wht`; }, 1000); //1000 means 1 secs           
        } else {
            toastr.warning("The Transaction could not be revised. Please try again.");

            // Hide Preloader
            $('body').hideLoading();
           
        }
    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);

        // Hide Preloader
        $('body').hideLoading();
    });
}
// $("#update_table").data('kendoGrid').dataSource.data(historyData);

$("#searchContractButtIcon").click(function () {
   
    GetGWTTByContractNumber();
    document.getElementById('WHTPageUpdateDataBody').hidden = false;
});



$("#close_update_form").click(function () {
    document.getElementById("WHTPageUpdateDataBody").hidden = true;
    document.getElementById("status").hidden = true;
    document.getElementById("green").hidden = true;
    document.getElementById("red").hidden = true;
    document.getElementById("searchContract").value = "";
});



$(document).on('click', '.updateModal', function () {
    $('#modal_update_form').modal('show');
    console.log("sdasdasda")
})
    
$("#reviseContract").click(function () {
    ReviseWithHoldingTaxTransaction();
    document.getElementById('WHTPageUpdateDataBody').hidden = true;
});


