var reportPreView = `${serverUrl}${reporttype}/`;
var activeTaxOffice = "";
var activeYear = "";
var activeReport = 0;

$("#viewRTP").click(function () {
    sessionStorage.setItem("rptTaxOffice", activeTaxOffice);
    sessionStorage.setItem("rptYear", activeYear);
    sessionStorage.setItem("rptTaxOfficeLabel", "uniTaxOfficeId");
    sessionStorage.setItem("rptAssessYearLabel", "bgAssessmentYear");

    if(reporttype === "PIT") {
        switch(parseInt(activeReport)) {
            case 1:
                var url = `${reportPreView}PITReturnsReport`;
                window.location.replace(url);
                break;
            case 2:
                window.location.href = `${reportPreView}PITTaxOutStandingReport`;
                break;
            case 3:
                window.location.href = `${reportPreView}PITTaxOverPaymentReport`;
                break;
            case 4:
                window.location.href = `${reportPreView}PITZeroTaxOutstandingReport`;
                break;
            default:
              return toastr.info("Invalid Report type selected!")
          }
    } else if(reporttype === "CIT") {
        switch(parseInt(activeReport)) {
            case 1:
                window.location.href = `${reportPreView}CITReturnsReport`;
                break;
            case 2:
                window.location.href = `${reportPreView}CitTaxOutStandingReport`;
                break;
            case 3:
                window.location.href = `${reportPreView}CITTaxOverPaymentReport`;
                break;
            case 4:
                window.location.href = `${reportPreView}CITZeroTaxOutstandingReport`;
                break;
            default:
              return toastr.info("Invalid Report type selected!")
          }
    }
});

$("#listOfTaxOffices").on('change', function () {
    var elem = document.getElementById("listOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
    activateViewreportbutton();
});

$("#assessmentYear").on('change', function () {
    var elem = document.getElementById("assessmentYear");
    activeYear = elem.options[elem.selectedIndex].value;
    activateViewreportbutton();
});

$("#typesOfReport").on('change', function () {
    var elem = document.getElementById("typesOfReport");
    activeReport = elem.options[elem.selectedIndex].value;
    activateViewreportbutton();
});

var activateViewreportbutton = function () {
    if(activeYear && activeTaxOffice && activeReport) 
        $("#viewRTP").prop('disabled', false);
    else 
    $("#viewRTP").prop('disabled', true);
};
