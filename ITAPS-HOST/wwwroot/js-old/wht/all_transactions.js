$(document).ready(function () {

    loadYears();


    function viewReport() {
        console.log("Report")
    }

    //alert("updates made")

    // Trigger DataPicker
    //$(".datepicker").flatpickr();


    // Past Date Operations
    $(".pastDatePicker").flatpickr({
        //maxDate: "today",
        dateFormat: "d-m-Y"
    });

    // Future Date Operations
    $(".futureDatePicker").flatpickr({
        //minDate: "today",
        dateFormat: "d-m-Y"
    });


    function loadYears() {
        //load year select box with year
        var nowY = new Date().getFullYear();
        var options = "<option value='' disabled selected>Select Year</option>";
        for (var Y = nowY; Y >= 2018; Y--) {
            options += "<option>" + Y + "</option>";
        }
        $("#yearOfAllTransactions").html(options);
    }


    $("#periodOfAllTransactions").change(function () {
        validateDateRange();
    });


    var loggedINtin;


    $('#printTrans').click(function () {
        var sDate = $("#startDate").val();
        var StartDate = sDate.substring(3, 5) + '/' + sDate.substring(0, 2) + '/' + sDate.substring(6, sDate.length);

        var eDate = $("#endDate").val();
        var EndDate = eDate.substring(3, 5) + '/' + eDate.substring(0, 2) + '/' + eDate.substring(6, eDate.length);
        window.location.href = AppServerUrl + "/wht/AllWHTReports?" + "szAgentTin=" + loggedINtin + "&StartDate=" + StartDate + "&EndDate=" + EndDate;
    });

    var dataModel = {
        TIN: nameTIN.TIN // Get from localStorage
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerData`;
    $.post(postUrl, postData, function (data, status) {
        //console.log('GetTaxPayerData Data: ', data);

        // Display on view
        if (data.status === "Successful") {

            // Keep object for future use.
            TaxPayerData = data.body;

            userId = TaxPayerData.id;
            periodId = TaxPayerData.id;
            taxOfficeId = TaxPayerData.taxOffice.id;
            whtAgentTaxpayerid = TaxPayerData.id;
            postalAddress = TaxPayerData.postalAddress;
            loggedINtin = TaxPayerData.tin;
        }

    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
    });

});

function resetPeriodandDates() {
    var options = "<option value='0' selected disabled>Select Period</option>";
    $("#periodOfAllTransactions").html(options);
    document.getElementById('startDate').value = '';
    document.getElementById('startDate').disabled = true;

    document.getElementById('endDate').value = '';
    document.getElementById('endDate').disabled = true;
}



function validateDateRange() {

    document.getElementById('transactions_table').hidden = true;

    var id = $('#periodOfAllTransactions option:selected').val();
    var dataModel = {

        year: document.getElementById("yearOfAllTransactions").value,
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
            $('body').hideLoading();
        }

        else if (data.body.length > 0) {
            $('body').hideLoading();
            for (var i = 0; i < data.body.length; i++) {
                if (data.body[i].id == id) {

                    var sDate = (data.body[i].startDate).substring(0, 10);
                    var eDate = (data.body[i].endDate).substring(0, 10);

                    $("#startDate").flatpickr({
                        minDate: sDate.substring(0, 4) + '-' + sDate.substring(5, 7) + '-' + sDate.substring(8, sDate.length),
                        maxDate: eDate.substring(0, 4) + '-' + eDate.substring(5, 7) + '-' + eDate.substring(8, eDate.length),
                        dateFormat: "d-m-Y",
                    });

                    $("#endDate").flatpickr({
                        minDate: sDate.substring(0, 4) + '-' + sDate.substring(5, 7) + '-' + sDate.substring(8, sDate.length),
                        maxDate: eDate.substring(0, 4) + '-' + eDate.substring(5, 7) + '-' + eDate.substring(8, eDate.length),
                        dateFormat: "d-m-Y",
                    });
                }
            }
        }


        //check if start Date is selected
        activateEndDateOnStartDateSelected();

    }).fail(function (response) {
        $('body').hideLoading();
        console.log('Response Error: ' + response.responseText);
    });

}


function populateActivePeriods() {


    var dataModel = {

        year: document.getElementById("yearOfAllTransactions").value,
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
            resetPeriodandDates();
            document.getElementById('transactions_table').hidden = true;
            document.getElementById('printTrans').hidden = true;
            $('body').hideLoading();
        }
        else if (data.body.length > 0) {
            $('body').hideLoading();
            var options = "<option value='0' selected disabled>Select Period</option>";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].id}'>${data.body[i].period}</option>`;
            }

            $("#periodOfAllTransactions").html(options);

        }

    }).fail(function (response) {
        $('body').hideLoading();
        console.log('Response Error: ' + response.responseText);
    });

}

function activateStartDateOnPeriodSelected() {
    //checkdskdhlashdahsdashgdajsgdkagdkad
    document.getElementById('startDate').disabled = false;
}

function activateEndDateOnStartDateSelected() {
    //checkdskdhlashdahsdashgdajsgdkagdkad
    var sDate = document.getElementById('startDate').value;

    if (sDate == '') {
        document.getElementById('endDate').disabled = true;
    }
    else {
        document.getElementById('endDate').disabled = false;
    }
    //console.log('checking to see if start date has been triggered');
}

function getAllTransactionsByDate() {
    // Show Preloader
    $('body').showLoading();
    var sDate = $("#startDate").val();
    var eDate = $("#endDate").val();

    var dataModel = {

        startDate: sDate.substring(6, sDate.length) + '-' + sDate.substring(3, 5) + '-' + sDate.substring(0, 2),
        endDate: eDate.substring(6, eDate.length) + '-' + eDate.substring(3, 5) + '-' + eDate.substring(0, 2),
        periodId: $('#periodOfAllTransactions option:selected').val(),
        tin: nameTIN.TIN

    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    //var postUrl = `?handler=GetAllTransactionsByDate`;

    var postUrl = AppServerUrl + "/api/WHT/GetAllTransactionsByDate";
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);

        if (data.body == null) {
            $('body').hideLoading();
            document.getElementById('transactions_table').hidden = true;
            document.getElementById('printTrans').hidden = true;
            toastr.warning("No Transactions available yet");

        }

        else {
            document.getElementById('transactions_table').hidden = false;
            $('body').hideLoading();
            var DataSet = [];

            //console.log(data.body);
            DataSet = data.body;


            //applying some css based on a condition to the grid
            var onDataBound = function () {
                $('td').each(function () {

                    if ($(this).text() == 'REVOKED') {
                        $(this).css({ 'background-color': '#d9534f' });
                        //$(this).css({ 'color': '#d9534f' });

                    }
                    if ($(this).text() == 'ACTIVE') {
                        $(this).css({ 'background-color': '#5cb85c' });
                    }
                    if ($(this).text() > 0 && $(this).text().includes('.')) {
                        $(this).text(commaRemover($(this).text())); //first, clean value by removing all commas
                        $(this).text(moneyInTxt($(this).text(), 'en', 2));
                    }
                    if ($(this).text() != '') {
                        $(this).text(ucwords($(this).text())); //camel case all of them                       
                    }
                });

            };

            //option to color the whole row
            //var grid = $("#transactions_table").data("kendoGrid");
            //$(grid.tbody).find("> tr").each(function (idx, elem) {
            //    var dataItem = grid.dataItem(elem);
            //    if (dataItem.status == 'REVOKED') {
            //       $(this).css({'background-color': '#f0ad4e' }); 
            //    }
            //})


            function exportToPdf() {
                $("#transactions_table").data("kendoGrid").saveAsPDF();
            }

            $("#transactions_table").kendoGrid({
                dataSource: {
                    type: "odata",
                    data: DataSet

                },
                //toolbar: ["pdf"],
                //toolbar:                    
                //       `<div class= "form-horizontal" style = "float: left !important;">
                //            <div class="col-12">
                //                <button id="export" type="button" name="export" style="min-width:" class="btn btn-default" onclick="alert('exporting');">Export To PDF</button>
                //             </div>
                //         </div >`                       
                //,
                //pdf: {
                //    author: "iTaPS",
                //    creator: "Augustine Akoto",
                //    date: new Date(),
                //    fileName: "All Transactions.pdf",
                //    keywords: "Transactions payments",
                //    landscape: true,
                //    allPages: true,
                //    avoidLinks: true,
                //    repeatHeaders: true,
                //    template: $("#tab-pane").html(),
                //    scale: 0.8,
                //    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                //    paperSize: "A4",
                //    subject: "All Transactions",
                //    title: "Withholding Tax Transactions"
                //},     

                dataBound: onDataBound,
                height: "400px",
                selectable: true,
                resizable: true,
                groupable: true,
                sortable: false,
                //pageable: {
                //    refresh: true,
                //    pageSizes: true,
                //    buttonCount: 5
                //},
                columns: [

                    { field: "date", title: "Date", width: "9%" },
                    { field: "invoiceNo", title: "Invoice #", width: "9%" },
                    { field: "transDescription", title: "Description", width: "20%" },
                    { field: "entity", title: "Entity", width: "18%" },
                    { field: "whType", title: "WH Type", width: "15%" },
                    //{ field: "transType", title: "Trans. Type", width: "9%" },                    
                    //{ field: "contractAmount", title: "Contract Amount", width: "12%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" } },
                    { field: "taxWithHeld", title: "Amt. Withheld", width: "11%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" } },
                    { field: "grossAmountOfPayment", title: "Gross Amount", width: "11%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" } },
                    //{ field: "vatableAmt", title: "VATable Amount", width: "12%", attributes: { style: "text-align:right;" }, headerAttributes: { style: "text-align: right;" } },
                    { field: "status", title: "Status", width: "7%" }


                ]
            });

            document.getElementById('printTrans').hidden = false;
        }

    }).fail(function (response) {
        $('body').hideLoading();
        toastr.danger("Service Unavailable");
        // console.log('Response Error: ' + response.responseText);
    });



    //var PrintPreview = function () {
    //    //Hide Preview
    //    $('#PreviewModal').modal('hide');

    //    var divContents = $("#PrintContent").html();

    //    var printWindow = window.open('', '', 'height=800,width=1000');
    //    printWindow.document.write(`<html><head><title>${nameTIN.TIN} - PIT Returns - ${AssessmentYear}</title>`);
    //    printWindow.document.write('<link type="text/css" href="css/app.css" rel="stylesheet"/>')
    //    printWindow.document.write('<style>.table tbody td {vertical-align: middle;}.table td{padding: .35rem 1rem;border-top: 1px solid #efefef;}</style>')
    //    printWindow.document.write('</head><body >');
    //    printWindow.document.write(divContents);
    //    printWindow.document.write('</body></html>');
    //    printWindow.document.close();
    //    printWindow.focus();
    //    setTimeout(function () { printWindow.print(); }, 1000);
    //    //printWindow.close();
    //}

    function printGrid() {
        var gridElement = $('#transactions_table'),
            printableContent = '',
            win = window.open('', '', 'width=1000, height=800, resizable=1, scrollbars=1'),
            doc = win.document.open();

        var htmlStart =
            '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '<meta charset="utf-8" />' +
            '<title>All Withholding Tax Payments</title>' +
            '<link href="http://kendo.cdn.telerik.com/' + kendo.version + '/styles/kendo.common.min.css" rel="stylesheet" /> ' +
            '<style>' +
            'html { font: 11pt sans-serif; }' +
            '.k-grid { border-top-width: 0; }' +
            '.k-grid, .k-grid-content { height: auto !important; }' +
            '.k-grid-content { overflow: visible !important; }' +
            'div.k-grid table { table-layout: auto; width: 100% !important; }' +
            '.k-grid .k-grid-header th { border-top: 1px solid; }' +
            '.k-grouping-header, .k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
            // '.k-grid-pager { display: none; }' + // optional: hide the whole pager
            '</style>' +
            '</head>' +
            '<body>';

        var htmlEnd =
            '</body>' +
            '</html>';

        var gridHeader = gridElement.children('.k-grid-header');
        if (gridHeader[0]) {
            var thead = gridHeader.find('thead').clone().addClass('k-grid-header');
            printableContent = gridElement
                .clone()
                .children('.k-grid-header').remove()
                .end()
                .children('.k-grid-content')
                .find('table')
                .first()
                .children('tbody').before(thead)
                .end()
                .end()
                .end()
                .end()[0].outerHTML;
        } else {
            printableContent = gridElement.clone()[0].outerHTML;
        }

        doc.write(htmlStart + printableContent + htmlEnd);
        doc.close();
        win.print();
    }



}

