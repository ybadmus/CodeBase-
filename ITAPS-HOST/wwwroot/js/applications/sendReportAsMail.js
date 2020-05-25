var reportEmailRecipients = [];

$("#addEmailOfReport").click(function () {
    reportEmailRecipients.push({
        id: reportEmailRecipients.length + 1,
        emailAddress: $("#recipientEmailInput").val()
    })

    loadReportEmailRecipients(reportEmailRecipients);
});

var validateEmailAddress = function () {
    if($("#recipientEmailInput").val().length >= 5 && $("#recipientEmailInput").val().includes("@")) {
        document.getElementById("addEmailOfReport").disabled = false;
    } else 
    document.getElementById("addEmailOfReport").disabled = true;
};


var loadReportEmailRecipients = function (recipients) {
    let output = "";
    let sortedArray = recipients.sort(function (a, b) {
        return (a.id - b.id);
    });

    for (var i = 0; i < sortedArray.length; i++) {
        output = output + '<tr><td style=" width: 5%;">' + sortedArray[i].id + '</td><td style=" width: 85%;">' + sortedArray[i].emailAddress + '</td><td style=" width: 10%"><button class="btn btn-default" onClick="removeEmail(' + sortedArray[i].id + ')"><i class="fa fa-times" aria-hidden="true" style="color: red;"></i></button></td></tr>';
    }

    output = output;
    $("#loadRecipientsGrid").html(output);
};

var removeEmail = function () {

};