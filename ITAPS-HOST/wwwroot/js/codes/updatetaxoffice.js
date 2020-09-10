var serverUrl = $("#serverUrl").val();
var activeTaxOffice;
var activeTIN;
var objToSend = {};

$("#searchTaxpayer").click(function () {
    clearDetailsGrid();
    var tin = $("#taxpayerTINCh").val();
    objToSend.Tin = tin;
    var url = `${serverUrl}api/CodesApi/GetTaxpayerDetailsByTin?tin=${tin}`;
    getTaxpayerDetails(url);
});

var clearDetailsGrid = function () {
    $("#taxpayerName").text("");
    $("#tin").text("");
    $("#taxOffice").text("");
    $("#telephoneNo").text("");
    $("#email").text("");
    $("#accountCreationDate").text("");
    $("#nationality").text("");
    $("#currency").text("");
};

var getTaxpayerDetails = function (url) {
    apiCaller(url, "GET", "", loadTaxpayerDetails);
};

var loadTaxpayerDetails = function (resp) {

    if (resp.length < 1)
        return toastr.info("No records for this Tax Office.")
 
    $("#taxpayerName").text(resp[0].name);
    $("#taxpayerNameModal").text(resp[0].name);
    $("#taxpayerNameModal").text(resp[0].name);
    $("#tin").text(resp[0].tin);
    $("#taxOffice").text(resp[0].taxOffice);
    $("#oldTaxOfficeName").text(resp[0].taxOffice);
    $("#telephoneNo").text(resp[0].telephoneNo);
    $("#email").text(resp[0].email);
    $("#accountCreationDate").text(resp[0].accountCreationDate);
    $("#nationality").text(resp[0].nationality);
    $("#currency").text(resp[0].currency);

    $("#taxOfficeModal").text(resp[0].taxOffice);

    $("#changeTaxOfficeButton").show();
};

$("#changeTaxOfficeButton").click(function () {

    $("#changeTaxofficeModal").modal("show");
});

$("#taxpayerTINCh").on("keyup", function () {

    if ($(this).val().length === 11) {

        $("#searchTaxpayer").prop('disabled', false);
    } else {
        $("#searchTaxpayer").prop('disabled', true);
    }
});

var input_element = document.getElementById("taxpayerTINCh");

input_element.addEventListener("drop", function (event) {

    var types = event.dataTransfer.types;

    if (types.length > 2 || types.indexOf("text/plain") === -1)
        event.preventDefault();
    else {
        setTimeout(function () { input_element.value = ""; }, 10);
    }
}, false);

$("#selectOffice").on('change', function () {

    var elem = document.getElementById("selectOffice");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
    var newTaxOfficeName = elem.options[elem.selectedIndex].text;
    objToSend.NewTaxOfficeId = activeTaxOffice;
    $("#newTaxOfficeName").text(newTaxOfficeName);
    if (activeTaxOffice)
        $("#saveNewTaxOffice").prop("disabled", false);
    else 
        $("#saveNewTaxOffice").prop("disabled", true);
});

$("#saveNewTaxOffice").click(function () {

    $("#yesOrNo").modal("show");
});

$("#yesBtn").click(function () {

    var assignTccApplication = `${serverUrl}api/CodesApi/UpdateTaxOffice`;
    apiCaller(assignTccApplication, "PUT", objToSend, callBackFunc);
});

var callBackFunc = function () {

    toastr.success("Tax office successfully changed");
    location.reload();
};