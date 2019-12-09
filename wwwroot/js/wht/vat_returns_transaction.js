var name = "";
var tin = "";
var userId;
var whtAgentTaxpayerid;
var TaxOfficeId;
var whtBalanceMoney;

var serviceURL = "";

$(document).ready(function () {

   

   

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

                name = TaxPayerData.displayName;
                tin = TaxPayerData.tin;
                userId = TaxPayerData.id;
                whtAgentTaxpayerid = TaxPayerData.id;    
                TaxOfficeId = TaxPayerData.taxOffice.id;

                //console.log(name,tin);

            }

        }).fail(function (response) {
            //console.log('Response Error: ' + response.responseText);
        });

    loadYears();

});

function resetPeriod() {
    var options = "<option value='0' selected disabled>Select Period</option>";
    $("#periodOfVatWHTReturns").html(options);
}

function loadYears() {
    //load year select box with year
    var nowY = new Date().getFullYear();
    var options = "<option value='' disabled selected>Select Year</option>";
    for (var Y = nowY; Y >= 2018; Y--) {
        options += "<option>" + Y + "</option>";
    }
    $("#yearOfVatWHTReturns").html(options);
}


function populateActivePeriods() {
    var dataModel = {

        year: document.getElementById("yearOfVatWHTReturns").value,
        type: 'WHPER'

    };

    var postData = JSON.stringify(dataModel);
    var postUrl = AppServerUrl + "/api/WHT/GetAllActivePeriodsByYearAndType";
    //var postUrl = `?handler=GetAllActivePeriodsByYearAndType/`+year+`/` + type;
    $('body').showLoading();

    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        // console.log('Response Data: ', data);
        if (data.body == null) {
            toastr.warning("No periods available for selected year.");
            resetPeriod();
            document.getElementById('returns_table').hidden = true; 
            //document.getElementById('printTrans').hidden = true;
            $('body').hideLoading();
        }
        else if (data.body.length > 0) {
            $('body').hideLoading();
            var options = "<option value='0' selected disabled>Select Period</option>";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].id}'>${data.body[i].period}</option>`;
            }

            $("#periodOfVatWHTReturns").html(options);

        }

    }).fail(function (response) {
        $('body').hideLoading();
        console.log('Response Error: ' + response.responseText);
    });

}


$("#periodOfVatWHTReturns").change(function () {
    getAllTransactionsByPeriod();
});


function getAllTransactionsByPeriod() {
    // Show Preloader
    $('body').showLoading();

    var dataModel = {       
        periodId: $('#periodOfVatWHTReturns option:selected').val(),
        tin: nameTIN.TIN
    };
    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    //var postUrl = `?handler=GetAllTransactionsByDate`;

    var postUrl = AppServerUrl + "/api/WHT/GetWHVATByPeriodIdAsync";
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);

        vatWhtBalanceMoney = Math.abs(data.body.whvatBalance);

        if (data.body.allWHVatTransactions == null) {
            $('body').hideLoading();
            toastr.warning("No Transactions available yet");
           // document.getElementById('myReturnsTabHeader').hidden = true;
            document.getElementById('returns_table').hidden = true;
            //document.getElementById('vatWhtBalance').value = data.body.whvatBalance;
            document.getElementById('vatWhtPayable').value = data.body.whvatPayable;
            //document.getElementById('vatWhtRefundable').value = data.body.whvatCredit;
            document.getElementById('btnSubmitReturns').disabled = true;
        }

        else {
            $('body').hideLoading();
            
            document.getElementById('returns_table').hidden = false;
           
            var DataSet = [];                        
           
            //console.log(data.body);
            DataSet = data.body.allWHVatTransactions;         
            

            if (Number(data.body.whvatPayable) <= 0) {
                //assign the value for whtBalance before inserting braces
                document.getElementById('returnsMoney').innerHTML = "GHS " + moneyInTxt(Math.abs(data.body.whvatCredit));
                //data.body.whvatPayable = '(' + moneyInTxt(Math.abs(data.body.whvatCredit)) + ')';
                document.getElementById('returnsMoneyType').innerHTML = "VAT Credits";
                document.getElementById('returnsOnlyButt').hidden = false;
                document.getElementById('returnsPayLater').hidden = true;
                document.getElementById('returnsPayNow').hidden = true;
                
            }

            if (Number(data.body.whvatPayable) > 0) {
                document.getElementById('returnsOnlyButt').hidden = true;
                document.getElementById('returnsPayLater').hidden = false;
                document.getElementById('returnsPayNow').hidden = false;
                document.getElementById('returnsMoneyType').innerHTML = "Amount Payable";
                document.getElementById('returnsMoney').innerHTML = "GHS " + moneyInTxt(data.body.whvatPayable); 
            }

            document.getElementById('vatWhtPayable').value = data.body.whvatPayable;
            document.getElementById('vatWhtPayable').value = moneyInTxt(data.body.whvatPayable);
            document.getElementById('vatWhtRefundable').value = moneyInTxt(data.body.whvatCredit);
            document.getElementById('btnSubmitReturns').disabled = false;
            


            //on data bound go through grid and format all numbers to money values
            var onDataBound = function () {
                $('td').each(function () {
                    if ($(this).text() > 0 && $(this).text().includes('.')) {                    
                        $(this).text(commaRemover($(this).text())); //first, clean value by removing all commas
                        $(this).text(moneyInTxt($(this).text(), 'en', 2));                        
                    } 
                    if ($(this).text() != '') {
                        $(this).text(ucwords($(this).text())); //camel case all of them                       
                    }
                });

            };

            $("#returns_table").kendoGrid({
                dataSource: {
                    type: "odata",
                    data: DataSet

                },
                dataBound: onDataBound,
                height: "400px",
                selectable: true,
                resizable: true,
                groupable: false,
                sortable: false,
                //pageable: {
                //    refresh: true,
                //    pageSizes: true,
                //    buttonCount: 5
                //},
                columns: [
                    { field: "date", title: "Date", width: "10%" },
                    { field: "invoiceNo", title: "Invoice #", width: "10%" },
                    { field: "invoiceDesc", title: "Description", width: "26%" },
                    { field: "entity", title: "Entity", width: "20%" },
                    //{ field: "transType", title: "Trans. Type", width: "13%" },
                    { field: "vatType", title: "VAT Type", width: "10%" },
                    //{ field: "vatableAmount", title: "VATable Amount", width: "15%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" } },
                    { field: "vatWithHeld", title: "VAT WithHeld", width: "12%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" } },
                    { field: "grossAmountOfPayment", title: "Gross Amount", width: "12%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" } }   
                                   

                ]
            });


        }

    }).fail(function (response) {
        $('body').hideLoading();
        toastr.warning("Service Unavailable");
        // console.log('Response Error: ' + response.responseText);
    });
}


function PostWithHoldingVatReturn()
 {   
    
    var dataModel = {

        whVatAgentTaxpayerId: whtAgentTaxpayerid,
        whVatAgentTIN: nameTIN.TIN,
        periodId: $("#periodOfVatWHTReturns option:selected").val(),
        taxOfficeId: TaxOfficeId,                
        Permissions: nameTIN.Codes
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    //var postUrl = `?handler=PostWithHoldingVatReturn`;
    var postUrl = AppServerUrl + "/api/WHT/PostWithHoldingVatReturn";
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        // console.log('Response Data: ', data);

        if (data.status == "Successful") {
            toastr.success("Your Transaction has been submitted successfully.");
            //clearFields();
            setTimeout(function () { window.location = `${AppServerUrl}/wht`; }, 1000); //1000 means 1 secs           
        }
        else if (data.code == 409) {
            toastr.warning("You have already submitted VAT Withholding Returns for this period.");

            // Hide Preloader
            $('body').hideLoading();
        }
        else {

            toastr.warning("Your VAT Withholding Returns could not be submitted. Please try again.");

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