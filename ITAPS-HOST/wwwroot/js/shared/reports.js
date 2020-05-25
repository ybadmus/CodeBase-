var reportPreView = `${serverUrl}${reporttype}/`;
var activeTaxOffice = "";
var activeYear = "";
var activeReport = 0;

$("#viewRTP").click(function () {
    var url = "";

    sessionStorage.setItem("rptTaxOffice", activeTaxOffice);
    sessionStorage.setItem("rptYear", activeYear);
    sessionStorage.setItem("rptTaxOfficeLabel", "uniTaxOfficeId");
    sessionStorage.setItem("rptAssessYearLabel", "bgAssessmentYear");

    if(reporttype === "PIT") {
        switch(parseInt(activeReport)) {
            case 1:
                url = `${reportPreView}PITReturnsReport`;
                window.location.replace(url);
                break;
            case 2:
                url  = `${reportPreView}PITTaxOutStandingReport`;
                window.location.replace(url);
                break;
            case 3:
                url  = `${reportPreView}PITTaxOverPaymentReport`;
                window.location.replace(url);
                break;
            case 4:
                url  = `${reportPreView}PITZeroTaxOutstandingReport`;
                window.location.replace(url);
                break;
            default:
              return toastr.info("Invalid Report type selected!")
          }
    } else if(reporttype === "CIT") {
        switch(parseInt(activeReport)) {
            case 1:
                url = `${reportPreView}CITReturnsReport`;
                window.location.replace(url);
                break;
            case 2:
                url = `${reportPreView}CitTaxOutStandingReport`;
                window.location.replace(url);
                break;
            case 3:
                url = `${reportPreView}CITTaxOverPaymentReport`;
                window.location.replace(url);
                break;
            case 4:
                url = `${reportPreView}CITZeroTaxOutstandingReport`;
                window.location.replace(url);
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
