var name = "";
var tin = "";
var userId;
var whtAgentTaxpayerid;
var TaxOfficeId;
var whtBalanceMoney;

var serviceURL = "";
var payNowFlag = 0;

$(document).ready(function () {

    
        var dataModel = {
            TIN: nameTIN.TIN // Get from localStorage
        };

        var postData = JSON.stringify(dataModel);

        // Call Local API
        var postUrl = `?handler=GetTaxPayerData`;
        $.post(postUrl, postData, function (data, status) {
            //console.log('GetTaxPayerData Data: ', data);
            $('body').showLoading();
            // Display on view
            if (data.status === "Successful") {

                $('body').hideLoading();
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
            $('body').hideLoading();
            //console.log('Response Error: ' + response.responseText);
        });

    loadYears();

});

function resetPeriod() {
    var options = "<option value='0' selected disabled>Select Period</option>";
    $("#periodOfWHTReturns").html(options);
}



function loadYears() {
    //load year select box with year
    var nowY = new Date().getFullYear();
    var options = "<option value='' disabled selected>Select Year</option>";
    for (var Y = nowY; Y >= 2018; Y--) {
        options += "<option>" + Y + "</option>";
    }
    $("#yearOfWHTReturns").html(options);
}


function populateActivePeriods() {
    var dataModel = {

        year: document.getElementById("yearOfWHTReturns").value,
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

            $("#periodOfWHTReturns").html(options);

        }

      }).fail(function (response) {
        $('body').hideLoading();
        console.log('Response Error: ' + response.responseText);
    });

}


$("#periodOfWHTReturns").change(function () {
    getAllTransactionsByPeriod();
});


function getAllTransactionsByPeriod() {
    // Show Preloader
    $('body').showLoading();

    var dataModel = {       
        periodId: $('#periodOfWHTReturns option:selected').val(),
        tin: nameTIN.TIN
    };
    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    //var postUrl = `?handler=GetAllTransactionsByDate`;

    var postUrl = AppServerUrl + "/api/WHT/GetGWTTByPeriodIdAsync";
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);

        whtBalanceMoney = Math.abs(data.body.whtBalance);

        if (data.body.allWHTaxTransactions == null) {
            $('body').hideLoading();
            toastr.warning("No Transactions available yet");
           // document.getElementById('myReturnsTabHeader').hidden = true;
            document.getElementById('returns_table').hidden = true;
            //document.getElementById('whtBalance').value = data.body.whtBalance;
            document.getElementById('whtPayable').value = data.body.whtPayable;
            //document.getElementById('whtRefundable').value = data.body.whtCredit;
            document.getElementById('btnSubmitReturns').disabled = true;
        }

        else {
            $('body').hideLoading();
            
            document.getElementById('returns_table').hidden = false;
            //document.getElementById('myReturnsTabHeader').hidden = false;

            var DataSet = [];
                        
            //document.getElementById('entityName').textContent = name;
            //document.getElementById('entityTIN').textContent = tin;
            //console.log(data.body);
            DataSet = data.body.allWHTaxTransactions;

            if (data.body.whtPayable < 0) {
                //assign the value for whtBalance before inserting braces
                document.getElementById('returnsMoney').innerHTML = "GHS " + moneyInTxt(Math.abs(data.body.whtPayable));
                data.body.whtPayable = '(' + moneyInTxt(Math.abs(data.body.whtPayable)) + ')';
                document.getElementById('returnsMoneyType').innerHTML = "Tax Credits";
                document.getElementById('returnsOnlyButt').hidden = false;
                document.getElementById('returnsPayLater').hidden = true;
                document.getElementById('returnsPayNow').hidden = true;
                
            }

            if (data.body.whtPayable > 0) {
                document.getElementById('returnsOnlyButt').hidden = true;
                document.getElementById('returnsPayLater').hidden = false;
                document.getElementById('returnsPayNow').hidden = false;
                document.getElementById('returnsMoneyType').innerHTML = "Amount Payable";
                document.getElementById('returnsMoney').innerHTML = "GHS " + moneyInTxt(data.body.whtPayable);
            }

            //document.getElementById('whtBalance').value = moneyInTxt(data.body.whtBalance);
            document.getElementById('whtPayable').value = moneyInTxt(data.body.whtPayable);
            //document.getElementById('whtRefundable').value = moneyInTxt(data.body.whtCredit);
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
                    { field: "contractNo", title: "Contract #", width: "10%" },
                    { field: "invoiceNo", title: "Invoice #", width: "10%" },
                    { field: "invoiceDesc", title: "Description", width: "25%" },
                    { field: "entity", title: "Entity", width: "18%" },
                    { field: "whType", title: "WH Type", width: "17%" },
                    //{ field: "transType", title: "Trans. Type", width: "13%" },
                    //{ field: "contractAmount", title: "Contract Amount", width: "15%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" }},
                    { field: "taxWithHeld", title: "Amt. WithHeld", width: "10%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" }},
                    { field: "grossAmountOfPayment", title: "Gross Amount", width: "10%", attributes: { style: "text-align:right;" }, headerAttributes: {style: "text-align: right;"} }                                   

                ]
            });

            //set wht amount in memory for payment
            var year = $("#periodOfWHTReturns option:selected").text();
            localStorage.setItem("WHT_Year", year.substring(year.length - 4, year.length));
            localStorage.setItem("WHT_Period", $("#periodOfWHTReturns option:selected").val());
            localStorage.setItem("WHT_AmountToPay", moneyInTxt(data.body.whtBalance));           
            

        }

    }).fail(function (response) {
        $('body').hideLoading();
        toastr.warning("Service Unavailable");
        // console.log('Response Error: ' + response.responseText);
    });
}

function redirectToPayment() {
    if (payNowFlag == 0) {
        setTimeout(function () {
            window.location = `${AppServerUrl}/wht`;
        }, 2000);
    }
    else {
        setTimeout(function () {
            window.location = `${AppServerUrl}/payment`;
        }, 2000);
    }
}

function setPayNowFlag() {  
        payNowFlag = 1;      
}


function setPayLaterFlag() {
        payNowFlag = 0;
}


function PostWithHoldingTaxReturn() {
   
    //PostWithHoldingTaxReturn
    var dataModel = {

        whtAgentTaxpayerId: whtAgentTaxpayerid,
        whtAgentTIN: nameTIN.TIN,
        periodId: $("#periodOfWHTReturns option:selected").val(),
        //userId: userId,  
        //whtAmtCollectedAsAgent: Number(document.getElementById("whtPayable").value),
        //whtAmtCollectedFromAgent: Number(document.getElementById("whtRefundable").value),
        //whtBalance: whtBalanceMoney,        
        taxOfficeId: TaxOfficeId,                
        Permissions: nameTIN.Codes
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=PostWithHoldingTaxReturn`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);

        if (data.status == "Successful") {
            toastr.success("Your Transaction has been submitted successfully.");
            //clearFields();
            //setTimeout(function () { window.location = `${AppServerUrl}/wht`; }, 1000); //1000 means 1 secs             
        }
        else if (data.code == 409) {
            toastr.warning("You have already submitted Returns for this period.");

            // Hide Preloader
            $('body').hideLoading();
        }
        else {
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