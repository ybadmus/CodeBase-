// It doesn't work without this!
$.ajaxSetup({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'RequestVerificationToken': $('input:hidden[name="__RequestVerificationToken"]').val()
    }
});

var AppTokenId = $("#AppTokenId").val(), VerifyTCCDetails = {};

$(document).ready(() => {
    SetPageLayout();
});

var SetPageLayout = () => {
    if (AppTokenId) {
        $("#QRCodeLoading").prop("hidden", false);
        $("#QRCodeNotfound").prop("hidden", true);
        $("#QRCodeResult").prop("hidden", true);
        $("#TCCVerifyByNumber").prop("hidden", true);

        // Call after 3 seconds
        setTimeout(function () { GetVerifyTCCDetails(); }, 3000);
    } else {
        $("#QRCodeLoading").prop("hidden", true);
        $("#QRCodeNotfound").prop("hidden", true);
        $("#QRCodeResult").prop("hidden", true);
        $("#TCCVerifyByNumber").prop("hidden", false);
    }
}

var GetVerifyTCCDetails = () => {
    if (AppTokenId) {

        var dataModel = {
            CodeType: AppTokenId,
        };

        var postData = JSON.stringify(dataModel);

        // Call Local API
        var postUrl = `?handler=GetVerifyTCCDetails`;
        $.post(postUrl, postData, function (data, status) {
            if (data) {
                VerifyTCCDetails = {
                    TIN: data.tin ? data.tin : "N/A",
                    EntityName: data.entityName ? data.entityName.toUpperCase() : "N/A",
                    TaxOffice: data.taxOffice ? data.taxOffice.toUpperCase() : "N/A",
                    RequestingEntity: data.requestingEntity ? data.requestingEntity.toUpperCase() : "N/A",
                    Purpose: data.purpose ? data.purpose.toUpperCase() : "N/A",
                    DateIssued: data.dateIssued ? data.dateIssued : "N/A",
                    ExpiryDate: data.expiryDate ? data.expiryDate : "N/A"
                };
            } else {
                VerifyTCCDetails = {
                    TIN: "N/A",
                    EntityName: "N/A",
                    TaxOffice: "N/A",
                    RequestingEntity: "N/A",
                    Purpose: "N/A",
                    DateIssued: "N/A",
                    ExpiryDate: "N/A"
                };
            }
            SetVerifyTCCDetails();
        }).fail(function (response) {
            $("#QRCodeLoading").prop("hidden", true);
            $("#QRCodeNotfound").prop("hidden", false);
            $("#QRCodeResult").prop("hidden", true);
        });

    } else {
        $("#QRCodeLoading").prop("hidden", true);
        $("#QRCodeNotfound").prop("hidden", false);
        $("#QRCodeResult").prop("hidden", true);
        $("#TCCVerifyByNumber").prop("hidden", true);
    }
};


var SetVerifyTCCDetails = () => {
    if (VerifyTCCDetails && VerifyTCCDetails.TIN != "N/A") {
        // Display details
        $("#TCCVerifyTIN").text(VerifyTCCDetails.TIN);
        $("#TCCVerifyEntityName").text(VerifyTCCDetails.EntityName);
        $("#TCCVerifyTaxOffice").text(VerifyTCCDetails.TaxOffice);
        $("#TCCVerifyRequestingEntity").text(VerifyTCCDetails.RequestingEntity);
        $("#TCCVerifyPurpose").text(VerifyTCCDetails.Purpose);
        $("#TCCVerifyDateIssued").text(VerifyTCCDetails.DateIssued);
        $("#TCCVerifyExpiringDate").text(VerifyTCCDetails.ExpiryDate);

        // Control View
        $("#QRCodeLoading").prop("hidden", true);
        $("#QRCodeNotfound").prop("hidden", true);
        $("#QRCodeResult").prop("hidden", false);
        $("#TCCVerifyByNumber").prop("hidden", true);
    } else {
        $("#QRCodeLoading").prop("hidden", true);
        $("#QRCodeNotfound").prop("hidden", false);
        $("#QRCodeResult").prop("hidden", true);
        $("#TCCVerifyByNumber").prop("hidden", true);
    }
}


$("#SubmitTCCVerifyKey").bind("click", () => {
    GetVerifyTCCDetails();
})

var GetVerifyTCCDetails = () => {
    let TCCNumber = $("#TCCVerifyKey").val();
    if (TCCNumber && TCCNumber.length > 5) {
        // Show Preloader
        $("#QRCodeLoading").prop("hidden", false);
        $("#QRCodeNotfound").prop("hidden", true);
        $("#QRCodeResult").prop("hidden", true);
        $("#TCCVerifyByNumber").prop("hidden", true);

        var dataModel = {
            CodeType: TCCNumber,
        };

        var postData = JSON.stringify(dataModel);
        //console.log("postData", postData);

        // Call Local API
        var postUrl = `?handler=VerifyTCCDetails`;
        $.post(postUrl, postData, (data, status) => {
            // Log response to console
            if (data) {
                VerifyTCCDetails = {
                    TIN: data.tin ? data.tin : "N/A",
                    EntityName: data.entityName ? data.entityName : "N/A",
                    TaxOffice: data.taxOffice ? data.taxOffice : "N/A",
                    RequestingEntity: data.requestingEntity ? data.requestingEntity : "N/A",
                    Purpose: data.purpose ? data.purpose : "N/A",
                    DateIssued: data.dateIssued ? data.dateIssued : "N/A",
                    ExpiryDate: data.expiryDate ? data.expiryDate : "N/A"
                };
            } else {
                VerifyTCCDetails = {
                    TIN: "N/A",
                    EntityName: "N/A",
                    TaxOffice: "N/A",
                    RequestingEntity: "N/A",
                    Purpose: "N/A",
                    DateIssued: "N/A",
                    ExpiryDate: "N/A"
                };
            }
            SetVerifyTCCDetails();
        }).fail((response) => {
            // Hide Preloader
            $("#QRCodeLoading").prop("hidden", true);
            $("#QRCodeNotfound").prop("hidden", true);
            $("#QRCodeResult").prop("hidden", true);
            $("#TCCVerifyByNumber").prop("hidden", false);

        });
    } else {
        $("#TCCVerifyKey").focus();
    }
}
