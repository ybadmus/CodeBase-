var TCCVerifyDetails = {};

$("#SubmitTCCVerifyKey").bind("click", () => {
    GetVerifyTCCDetails();
})

var GetVerifyTCCDetails = () => {
    let TCCNumber = $("#TCCVerifyKey").val();
    if (TCCNumber && TCCNumber.length > 5) {
        // Show Preloader
        $('body').showLoading();

        var dataModel = {
            CodeType: TCCNumber,
        };

        var postData = JSON.stringify(dataModel);
        //console.log("postData", postData);

        // Call Local API
        var postUrl = `?handler=VerifyTCCDetails`;
        $.post(postUrl, postData, (data, status) => {
            // Log response to console
            // console.log({ data });

            if (data.body && data.body.length > 0) {
                VerifyTCCDetails = {
                    TIN: data.body[0].tin ? data.body[0].tin : "N/A",
                    EntityName: data.body[0].entityName ? data.body[0].entityName.toUpperCase() : "N/A",
                    TaxOffice: data.body[0].taxOffice ? data.body[0].taxOffice.toUpperCase() : "N/A",
                    RequestingEntity: data.body[0].requestingEntity ? data.body[0].requestingEntity.toUpperCase() : "N/A",
                    Purpose: data.body[0].purpose ? data.body[0].purpose.toUpperCase() : "N/A",
                    DateIssued: data.body[0].dateIssued ? data.body[0].dateIssued : "N/A",
                    ExpiryDate: data.body[0].expiryDate ? data.body[0].expiryDate : "N/A"
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
                toastr.info("TCC not found.");
            }
            SetVerifyTCCDetails();
            // Hide Preloader
            $('body').hideLoading();
        }).fail((response) => {
            // Hide Preloader
            $('body').hideLoading();

            toastr.info("Some error occurred.");
        });
    } else {
        toastr.info("Please enter a valid TCC number.");
        $("#TCCVerifyKey").focus();
    }
}

var SetVerifyTCCDetails = () => {
    if (VerifyTCCDetails && VerifyTCCDetails.TIN) {
        // console.log({ VerifyTCCDetails });

        $("#TCCVerifyTIN").text(VerifyTCCDetails.TIN);
        $("#TCCVerifyEntityName").text(VerifyTCCDetails.EntityName);
        $("#TCCVerifyTaxOffice").text(VerifyTCCDetails.TaxOffice);
        $("#TCCVerifyRequestingEntity").text(VerifyTCCDetails.RequestingEntity);
        $("#TCCVerifyPurpose").text(VerifyTCCDetails.Purpose);
        $("#TCCVerifyDateIssued").text(VerifyTCCDetails.DateIssued);
        $("#TCCVerifyExpiringDate").text(VerifyTCCDetails.ExpiryDate);
    }
}