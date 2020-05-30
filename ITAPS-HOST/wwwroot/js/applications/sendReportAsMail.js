var reportEmailRecipients = [];

$("#addEmailOfReport").click(function () {

    if (reportEmailRecipients.length == 5)
        return toastr.info("Maximum number reached!");

    reportEmailRecipients.push({
        id: reportEmailRecipients.length + 1,
        emailAddress: $("#recipientEmailInput").val()
    })

    loadReportEmailRecipients(reportEmailRecipients);
    $("#recipientEmailInput").val("");
    document.getElementById("addEmailOfReport").disabled = true;
    document.getElementById("sendRepotEmailModalBtn").disabled = false;
});

var validateEmailAddress = function () {
    if ($("#recipientEmailInput").val().length >= 5 && $("#recipientEmailInput").val().includes("@") && isEmailUnique()) {
        document.getElementById("addEmailOfReport").disabled = false;
        return true;
    } else {
        document.getElementById("addEmailOfReport").disabled = true;
        return false;
    }
};

var isEmailUnique = function () {
    var status = true;

    for (var i = 0; i < reportEmailRecipients.length; i++) {
        if ($("#recipientEmailInput").val().toLowerCase() === reportEmailRecipients[i].emailAddress.toLowerCase()) {
            toastr.info("Email already added!");
            status = false;
            return status;
        }
    }

    return status;
};

$('#recipientEmailInput').on('keyup', function () {
    validateEmailAddress();
});

var loadReportEmailRecipients = function (recipients) {
    let output = "";
    let sortedArray = recipients.sort(function (a, b) {
        return (a.id - b.id);
    });

    for (var i = 0; i < sortedArray.length; i++) {
        var id = i + 1;
        output = output + '<tr><td style=" width: 5%;">' + id + '</td><td style=" width: 85%;">' + sortedArray[i].emailAddress + '</td><td style=" width: 10%"><button class="btn btn-default" onClick="removeEmail(' + sortedArray[i].id + ')"><i class="fa fa-times" aria-hidden="true" style="color: red;"></i></button></td></tr>';
    }

    output = output;
    $("#loadRecipientsGrid").html(output);
};

var removeEmail = function (id) {
    for (var i = 0; i < reportEmailRecipients.length; i++) {
        if (id == reportEmailRecipients[i].id) {
            reportEmailRecipients.splice(i, 1);
        }
    };

    loadReportEmailRecipients(reportEmailRecipients);

    if (reportEmailRecipients.length === 0)
        document.getElementById("sendRepotEmailModalBtn").disabled = true;
}; 

$("#sendRepotEmailModalBtn").click(function () {
    sendEmailToRecipients();
});

var callBackReportEmail = function (resp) {
    if (resp.status.toLowerCase() === "succesfull") {
        toastr.success("Attachment successfully sent");
        $("#addEmailRecipientModal").modal("hide");
    }
    else
        toastr.error("Error sending Attachment")
};

$('#addEmailRecipientModal').on('hidden.bs.modal', function () {
    $("#recipientEmailInput").val("");
    reportEmailRecipients = [];
    loadReportEmailRecipients(reportEmailRecipients);
});