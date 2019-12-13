'use strict';

var AppServerUrl = $("#serverUrl").val();
var HeaderName = "All Transactions";

var populateActivePeriods = function () {
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

var activateStartDateOnPeriodSelected = function () {
    document.getElementById('startDate').disabled = false;
};

var activateEndDateOnStartDateSelected = function () {
    var sDate = document.getElementById('startDate').value;

    if (sDate == '') {
        document.getElementById('endDate').disabled = true;
    }
    else {
        document.getElementById('endDate').disabled = false;
    }
};

var initializeKendoGrid = function (data) {
    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "date", title: "Date", width: '20%' },
            { field: "invoiceNumber", title: "Invoice #", width: "10%" },
            { field: "taxpayerName", title: "Name", width: "25%" },
            { field: "contractAmount", title: "Contract Amount", width: "15%", format: "{0:GHS}", attributes: { style: "text-align:right;" },
                template: function (data) {
                    return parseFloat(data.contractAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
            {
                field: "taxWithHeld", title: "WHT Tax", width: "15%", attributes: { style: "text-align:right;" },
                template: function (data) {
                    return parseFloat(data.taxWithHeld).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
            },
            { field: "description", title: "Entity", width: '50%' },
            { field: "status", title: "Status", width: "15%", attributes: { style: "text-align:center;" } }
           
        ]
    });
}; 

var setHeaderNameToHTML = function () {
    $("#pgHeader").text(HeaderName);
};

var GetTaxOfficesByUser = function () {
    var userid = $("#UserObj").val();
    var url = `${AppServerUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;
    ApiCaller(url, "GET", "", LoadTaxOffices);
};

var GetActivePeriods = function () {
    var url = `${AppServerUrl}api/MonoApi/GetAllActivePeriods`;
    ApiCaller(url, "GET", "", LoadActivePeriods);
};

var ApiCaller = function (url, type, data, callback) {
    $.ajax({
        url: url,
        type: type,
        crossDomain: true,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        headers: {
        },
        dataType: 'json',
        success: function (response) {
            if (callback) {
                callback(response.body, data, type);
            };
        },
        error: function (error) {
            toastr.error('An error occured');
        }
    });
};

var apiCallSuccess = function (res, objectSent, type) {
    if (type == "POST") {
        toastr.success("Successfully saved");
        UpdateKendoGridLocally(objectSent);
        setDefaultModal();
        $("#modal-add-setup").modal("hide");
    } else if (type == "PUT") {
        toastr.success("Successfully updated");
        UpdateKendoGridLocally(objectSent);
        setDefaultUpdateModal();
        $("#modal-edit-setup").modal("hide");
    } else if (type == "GET") {
        initializeKendoGrid(res);
    }
};

var intializeView = function () {
    GetTaxOfficesByUser();
    //GetActivePeriods();
};

var LoadActivePeriods = function (listOfPeriods) {
    var output = "";

    if (listOfPeriods.length > 0) {
        output += '<option value="0" selected>Select Period</option>';
        for (var i = 0; i < listOfPeriods.length; i++) {
            output = output + '<option value="' + listOfPeriods[i].id + '" >' + listOfPeriods[i].period + '</option>';
        }
    };

    output = output;
    $("#listOfActivePeriods").html(output);
};

var LoadTaxOffices = function (listOfTaxOffices) {
    var listOfTaxOffices = listOfTaxOffices
    var output = '<option value="0" selected>Select Office</option>'; 

    if (listOfTaxOffices.length > 1) {
        listOfTaxOffices.sort((a, b) => (a.taxOfficeName > b.taxOfficeName) - (a.taxOfficeName < b.taxOfficeName));
       
        for (var i = 0; i < listOfTaxOffices.length; i++) {
            output = output + '<option value="' + listOfTaxOffices[i].taxOfficeId + '" >' + listOfTaxOffices[i].taxOfficeName + '</option>';
        };
    };

    output = output;
    $("#tccListOfTaxOffices").html(output);
};

$(document).ready(function () {
    setHeaderNameToHTML();
    initializeKendoGrid([]);
    intializeView();
});