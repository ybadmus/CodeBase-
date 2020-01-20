var fullName, currency, TIN, referenceNumber, taxPayerId, historyData = [], firstName, lastName, emailAddress, phoneNum, onlineData, onlineTransToken, paymentID;
$(document).ready(function () {   
    $(".divAmtTopay").hide();
    $("#PageDataBody select, #amountDue").change(function () {
        allFieldsLoaded();
        this.id === "PaymentMode" ? $(".divAmtTopay").show() : $(".divAmtTopay").hide();
        if (this.id === "PaymentMode" && this.value === "online") {
            $(".divAmtTopay").show();
            $("#amtToPay").val("").keyup();
            $("#btnSubmit").prop("disabled", true);
        } else {
            $(".divAmtTopay").hide();
            $("#amtToPay").val("");
        }
    });

    $("#amtToPay").keyup(function () {
        allFieldsLoaded();
    });

    $("#btnSubmit").click(function () {
        if (!allFieldsLoaded()) return false;
        getReferenceNumber();    
    });

    $(document).on("change","#gridTaxYear", function () {
        getPaymentHistory();
    });
    DisplayUserData();    

    if (localStorage.getItem("YearTaxType")) {
        var data = JSON.parse(localStorage.getItem("YearTaxType"));
        $("#AssessmentYear").val(data.Year);
        $("#transType").val(data.TaxType).change();
        $(".canBeSelectedOnPageRedirect").prop("disabled", true);
    }

    $("#uploadReceipt").click(function (){
        $("#mdlPayment").modal("show");
    });

    $("#btnSubmitSlip").click(function (){
        submitPaySlip();
    });
});

function submitPaySlip() {
    var data = {
        "gpayId": paymentID,
        "cashOrCheque": "",
        "slipNo": $("#dptSlip").val(),
        "chequeNo": $("#dptPaidByContact").val(),
        "paymentDate": $("#dptDate").val(),
        "amtPaid": commaRemover($("#dptAmount").val()),
        "payerName": $("#dptPaidBy").val(),
        "document": ""
    };

    $("body").showLoading();
    $.post(`?handler=PostDepositSlip`, JSON.stringify(data), function (e, status) {
        $("body").hideLoading();
        console.log(e);
    }).fail(function (response) {
        $("body").hideLoading();
        console.log('Response Error: ' + response.responseText);
    });
}

function allFieldsLoaded() {
    $("#btnSubmit").prop("disabled", true);//disable submit button
    if (Number($("#AssessmentYear").val()) === -1) return false;
    if (Number($("#transType").val()) === -1) return false;
    if (Number($("#PaymentMode").val()) === -1) return false;
    if ($("#PaymentMode").val() === "online" && Number(commaRemover($("#amtToPay").val())) <= 0) return false;
    $("#btnSubmit").prop("disabled", false);//if all passes above, enable submit button
    return true;
}

$("#history-tab").kendoGrid({
    sortable: true,
    selectable: true,
    resizable: true,
    toolbar: `<div class="form-horizontal">
                    <div class="col-md-2 col-sm-4">                     
                        <select id="gridTaxYear" class="form-control" style="height:16px !important"><option value="-1">Select Tax Year</option><option value="2018">2018</option></select>
                    </div>
                </div>`,
    pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
    columns: [
        { field: "submittedDate", title: "Date", width: "13%" },
        { field: "referenceNo", title: "Reference Number", width: "22%"},
        { field: "transactionType", title: "Tax Type", width: "18%"},
        { field: "amtPaid", title: "Amount", width: "11%", attributes: { style: "text-align:right;" } },
        { field: "paymentStatus", title: "Status", width: "10%" },
        {
            command: [
                { name: "edit", template: "<button class='editPayment btn btn-success btn-sm' title='View payment details'><span class='fa fa-eye'></span></button>" }
            ],
            title: "Action",
            width: "70px"
        }       
    ]
});

$("#AssessmentYear, #transType").change(function () {
    if (Number($("#AssessmentYear").val()) === -1) return false;
    if (Number($("#transType").val()) === -1) return false;
    if ($("#transType").val() === 'WHT') return false;
    getAmountDue();
});

function getAmountDue() {
    var toDB = {
        taxPayerId: $("#UserTaxPayerId").text(),
        year: $("#AssessmentYear").val(),
        transType: $("#transType").val()
    };
    $("body").showLoading();
    newAjaxRequest(`?handler=GetAmountOwed`, "POST", toDB)
        .done(function (data) {
            $("#amountDue").val(data.body.taxAmount).focusout();
        });
}

function DisplayUserData() {
    var dataModel = {
        TIN: $("#UserTIN").text()
    };
    // Call Local API
    var postUrl = `?handler=GetTaxPayerData`;
    $("body").showLoading();
    $.post(postUrl, JSON.stringify(dataModel), function (data, status) {
        $("body").hideLoading();
        if (data.status === "Successful") {
            fullName = `${data.body.firstName} ${data.body.otherNames} ${data.body.lastName}`; 
            TIN = data.body.tin;
            firstName = data.body.firstName;
            lastName = data.body.lastName;
            currency = data.body.currency.symbol;
            taxPayerId = data.body.id;
            emailAddress = data.body.emailAddress;
            phoneNum = data.body.mobileNumber;
        }
    }).fail(function (response) {
        $("body").hideLoading();
        console.log('Response Error: ' + response.responseText);
    });
}

function getReferenceNumber() {
    var model = {
        transType: $("#transType").val(),
        tin: $("#UserTIN").text()
    };
    $("body").showLoading();
    newAjaxRequest(`?handler=GetReferenceNumber`, "POST", model)
        .done(function (data) {
            $("body").hideLoading();            
            referenceNumber = data.body.referenceCode;

            if ($("#PaymentMode").val() === "bank") {
                PostPaymentDetail();
                return false;
            }

            if ($("#PaymentMode").val() === "online") {                
                makeOnlinePayment();
                return false;
            } 
        });
}

function clearPage() {
    $("#PageDataBody select").val(-1);
    $("#PageDataBody input").val("");
    $("#btnSubmit").prop("disabled", true);
    onlineData = "";
    window.localStorage.removeItem("YearTaxType");    
}

function PostPaymentDetail() {
    $("body").showLoading();
    var dataModelPost = {
        TaxPayerId: taxPayerId,
        AssessmentYear: $("#AssessmentYear").val(),
        AmtToPay: commaRemover($("#amountDue").val()),
        AmtPaid: commaRemover($("#amtToPay").val()),
        AmtBalance: "",
        ReferenceNo: referenceNumber,
        PaymentStatus: "P",
        PaymentMode: $("#PaymentMode").val() === "online" ? "O" : "B",
        TransactionType: $("#transType").val(),
        OtherDetails: "",
        transStatusToken: onlineTransToken || ""
    };

    $.post(`?handler=PostPaymentDetail`, JSON.stringify(dataModelPost), function (data, status) {
        $("body").hideLoading();
        if (data.status === "Successful") {
            if (dataModelPost.PaymentMode === "B") {
                toastr.success("Payment slip created successfully.<br/> Please pay into the GRA account on this slip.<br><br><br>You shall be notified by email/ SMS when the payment clears.<br><br> Thank you!!");
                printToPDF(referenceNumber, TIN, fullName, currency, $("#amountDue").val(), $("#transType").val());
                setTimeout(function () {
                    window.location = `${AppServerUrl}/home`;
                }, 2500); 
            }  
            $("body").showLoading();
            clearPage();
        } else {
            toastr.info("Something unexpected happened, please refresh page and try again later");
        }        
    }).fail(function (response) {
        $("body").hideLoading();
        console.log('Response Error: ' + response.responseText);
        });
}

function getPaymentHistory() {
    var DataModel = {
        TaxPayerId: taxPayerId,
        AssessmentYear: $("#gridTaxYear").val()
    };
    $("body").showLoading();
    historyData = [];
    newAjaxRequest(`?handler=GetPaymentHistory`, "POST", DataModel)
        .done(function (data) {
            console.log(data);
            for (var i = 0; i < data.body.length; i++) {
                historyData.push({
                    amtBalance: moneyInTxt(data.body[i].amtBalance, 'en', 2),
                    amtPaid: moneyInTxt(data.body[i].amtPaid, 'en', 2),
                    amtToPay: moneyInTxt(data.body[i].amtToPay, 'en', 2),
                    assessmentYear: data.body[i].assessmentYear,
                    id: data.body[i].id,
                    otherDetails: data.body[i].otherDetails,
                    paymentMode: data.body[i].paymentMode === "B" ? "Bank" : "Online",
                    paymentStatus: interpretStatus(data.body[i].paymentStatus),
                    referenceNo: data.body[i].referenceNo,
                    submittedDate: moment(data.body[i].submittedDate).format('DD/MM/YYYY'),
                    taxPayerId: data.body[i].taxPayerId,
                    transactionType: data.body[i].transactionType
                });
            }      
            $("#history-tab").data('kendoGrid').dataSource.data([]);
            $("#history-tab").data('kendoGrid').dataSource.data(historyData);            
            $("body").hideLoading();
        });
}

function interpretStatus(val) {
    switch (val) {
        case "A":
            val = "Accepted";
            break;
        case "P":
            val = "Pending";
            break;
        case "F":
            val = "Failed";
            break;
        default:
            val = "Error";
    }
    return val;
}

$(document).on("click", ".editPayment", function (e) {
    var grid = $('#history-tab').data('kendoGrid'),
        dataItem = grid.dataItem($(e.target).closest("tr"));
    loadItemData(dataItem);
    paymentID = dataItem.id;
});

function loadItemData(objectVal) {
    $("#modal-amountDue").html(objectVal.amtToPay);
    $("#paymentMode").html(objectVal.paymentMode);
    $("#AmountBalance").html(objectVal.amtBalance);
    $("#PaymentStatus").html(objectVal.paymentStatus);
    $("#AmountPaid").html(objectVal.amtPaid);
    $("#taxType").html(objectVal.transactionType);
    $("#referenceNo").html(objectVal.referenceNo);
    $("#date").html(objectVal.submittedDate);
    $("#TaxYear").html(objectVal.assessmentYear);
    $("#modal-payment-title").text(objectVal.referenceNo);
    //check if the payment mode is banking and status is pending
    if (objectVal.paymentStatus === "Pending" && objectVal.paymentMode === "Bank") {
        $("#uploadReceipt").css("display", "block");
    } else {
        $("#uploadReceipt").css("display", "none");
    }

    $("#modal-payment").modal("show"); 
}

function makeOnlinePayment() {
    var dataModel = {
        FirstName: firstName,
        LastName: lastName,
        Email: emailAddress,
        Phone: phoneNum,
        Currency: currency,
        Amount: commaRemover($("#amtToPay").val()),
        OrderID: referenceNumber
    };

    newAjaxRequest(`?handler=ExpressPay`, "POST", dataModel)
        .done(function (data) {
            onlineData = JSON.parse(data);           
            onlineTransToken = onlineData.token;
            localStorage.setItem("payToken", onlineTransToken);
            if (Number(onlineData.status) === 1) {  
                toastr.success("Proceed to the payment portal. You would be notified by email/ SMS when the payment clears.<br>Thank you!");
                PostPaymentDetail();
                setTimeout(function () {
                    window.open(`${ExpressPayRequestURL}checkout.php?token=${onlineTransToken}`, '_self'); //'location=yes,height=770,width=720,scrollbars=yes,status=yes'
                }, 1500);     
            } else {
                toastr.info("Your request details may be incorrect. Please refresh page and try again");
            }
            //console.log(data);
            //var john = JSON.parse(data);
            //console.log(john, john.redirect_url, encodeURI(john.Token));
            //console.log("fhs", john.redirect_url.split("?")[0] + "?" + encodeURI(john.Token));
            //window.open(john.redirect_url.split("?")[0] + "?" +encodeURI(john.Token));
        });
}

function makeEmergentPayment() {
    var dataModel = {       
        name: "Nana Kofi Ansah",
        Currency:"GHS",
        Amount: "1",
        Order_id: `Item${parseInt(Math.random()*500)}`
    };
    //$.post(`?handler=EmmergentPay`, JSON.stringify(dataModel), function (data, status) {
    //    console.log(data); return;
    //});
    newAjaxRequest(`?handler=EmmergentPay`, "POST", dataModel)
        .done(function (data) {
            data = JSON.parse(data);
            console.log(data);
            if (Number(data.status_code) === 0) {
                toastr.info(data.status_message);
            }
            console.log(data.redirect_url);
            window.open(data.redirect_url, "_blank");
            //var john = JSON.parse(data);
            //console.log(john, john.redirect_url, encodeURI(john.Token));
            //console.log("fhs", john.redirect_url.split("?")[0] + "?" + encodeURI(john.Token));
            //window.open(john.redirect_url.split("?")[0] + "?" +encodeURI(john.Token));
        });
}

//show proceed button only during payments
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    e.target.id === "history-nav" ? $("#thisFooter").hide() : $("#thisFooter").show();   
});

function getOnlinePaymentStatus(thisToken) {
    var dataModel = {
        Token: thisToken
    };
    
    newAjaxRequest(`?handler=ExpressPayPaymentStatus`, "POST", dataModel)
        .done(function (data) {
            console.log(data);
        });
}

var myVar;

//function myFunction() {
//    myVar = setTimeout(function () { getOnlinePaymentStatus(); }, 30000);
//}

function myStopFunction() {
    clearTimeout(myVar);
}

function getYearsOfPayments() {
    var dataModel = {
        TaxPayerId: taxPayerId
    };
    
    newAjaxRequest(`?handler=GetTaxYearsByTaxPayerID`, "POST", dataModel)
        .done(function (data) {
            console.log(data);
        });
}

function makeRand(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


function determineTaxTypePayment() {
    if ($("#transType option:selected").text() == 'WHT') {
        document.getElementById('amountDue').value = localStorage.getItem("WHT_AmountToPay");
        //console.log("Amount To Pay:", localStorage.getItem("WHT_AmountToPay"));
    }
}

$('.yearsDropdown').ready(function () {
    var beginYear = (new Date()).getFullYear();
    for (var i = beginYear; i >= 1990; i--) {
        $('.yearsDropdown').append($('<option/>', {
            value: i,
            text: i
        }));
    }
});


