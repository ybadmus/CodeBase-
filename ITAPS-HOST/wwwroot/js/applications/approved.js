ej.grids.Grid.Inject(ej.grids.Page, ej.grids.Sort, ej.grids.Filter, ej.grids.Group);

var HeaderName = "Approved Applications";
var serverUrl = $("#serverUrl").val();
var activeTaxOffice = "";
var searchAprApps = `${serverUrl}api/TCC/GetAppByOfficeTypeAndStatus`;
var ReportDownloadView = `${serverUrl}reportviewer/index`;
var ReportDownloadViewTEX = `${serverUrl}reportviewer/texcert`;

$(document).ready(function () {

    if (!sessionStorage.getItem("approvedApps") || sessionStorage.getItem("approvedApps") === "null" || JSON.parse(sessionStorage.getItem("approvedApps")).length == 0) {

        initializeKendoGrid([], 1);
        sessionStorage.removeItem("approvedApps");
    }
    else {

        initializeKendoGrid(JSON.parse(sessionStorage.getItem("approvedApps")), 1);
    }

    setTitles();
    $("#gridView").show();
});

var loadGrid = function (resp) {
    if (!resp || resp == null)
        return initializeKendoGrid([], 1);
    sessionStorage.setItem("approvedApps", JSON.stringify(resp));
    initializeKendoGrid(resp);
};

var initializeKendoGrid = function (data, stage) {
    document.getElementById("Grid").innerHTML = "";

    if (data) {
        if (data.length == 0 && stage !== 1) {
            return toastr.info("No Data");
        };

        var grid = new ej.grids.Grid({
            dataSource: data,
            selectionSettings: { type: 'Multiple' },
            columns: [
                { field: 'submittedDate', headerText: 'Date', width: 60, format: 'yMd' },
                { field: 'applicantName', headerText: 'Applicant', width: 120 },
                { field: 'applicantTIN', headerText: 'TIN', width: 60 },
                { field: 'applicationType', headerText: 'Application Type', width: 110 },
                { field: 'status', headerText: 'Status', width: 100 }
            ],
            height: 350,
            pageSettings: { pageSize: 10 },
            allowGrouping: true,
            allowPaging: true,
            allowSorting: false,
            allowFiltering: true,
            filterSettings: { type: 'Menu' },
            rowSelected: rowSelected,
        });

        grid.appendTo('#Grid');
        gridGlobal = grid;
    } else {

        toastr.info("No Data");
    };
};

function rowSelected(args) {

    var selectedrecords = gridGlobal.getSelectedRecords();
    onGridSelected(selectedrecords[0]);
};

var onGridSelected = function (item) {

    if (item.applicationType.toUpperCase() === "TCC") {

        sessionStorage.setItem("tccReportId", item.applicationId);
        sessionStorage.setItem("tccLabel", "uniApplicationId");
        window.location.href = `${ReportDownloadView}`;
    } else if (item.applicationType.toUpperCase() === "WHT Exemption".toUpperCase()) {

        sessionStorage.setItem("texReportId", item.applicationId);
        sessionStorage.setItem("texLabel", "uniApplicationId");
        window.location.href = `${ReportDownloadViewTEX}`;

    } else {

        return toastr.info("No Preview Available");
    }

};

$("#listOfTaxOffices").on('change', function () {
    var elem = document.getElementById("listOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
});

var setTitles = function () {
    $("#pgHeader").text(HeaderName);
};

var validateSearchEntry = function () {

    let searchItem = $("#searchItem").val().trim();
    if (!searchItem.match(/\S/))
        return false;
    else
        return true;
};

$("#searchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTcc();
    }
});

var searchTcc = function () {
    if (validateSearchEntry()) {

        let searchItem = $("#searchItem").val().trim();
        if (searchItem.includes('/')) {
            for (var i = 0; i < searchItem.length; i++) {
                if (searchItem[i] === '/')
                    replaceAt(searchItem, i, '%2F');
            }
        }
        let url = `${searchAprApps}?officeId=${activeTaxOffice}&status=2&searchitem=` + searchItem;
        apiCaller(url, "GET", "", loadGrid);
    } else {

        toastr.error("Tax office or search item field is empty");
    }
}

$("#btnSearch").click(function (e) {
    searchTcc();
});
