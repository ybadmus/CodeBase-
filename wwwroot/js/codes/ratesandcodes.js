'use strict'

var ServerUrl = $("#serverUrl").val();
var HeaderName = "Tax Rates & Code";
var PostWTR1ObjectToSend = {
    "TaxRateId": "",
    "ParamsIdTaxRate": "",
    "PropertyTaxRate": 0,
    "WhtCodeTaxRate": "",
    "TaxRateDescription": "",
    "TaxRateNotes": "",
    "TaxRateStatus": ""
};

$(document).ready(function () {
    SetHeaderNameToHTML();
    InitializeKendoGrid([]);
    searchTcc();
});

$("#BtnOpenAddModal").click(function () {
    $("#modal-add-setup").modal("show");
    getesidencyAndAccountTypeAsync();
});

$("#SubmitSetup").click(function () {
    let url = `${ServerUrl}api/wht/PostWTR1`;

    PostWTR1ObjectToSend.WhtCodeTaxRate = $("#whtCode").val();
    PostWTR1ObjectToSend.ParamsIdTaxRate = $("#accountAndResidency").val();
    PostWTR1ObjectToSend.PropertyTaxRate = $("#taxRate").val();
    PostWTR1ObjectToSend.TaxRateStatus = $("#status").val();
    PostWTR1ObjectToSend.TaxRateDescription = $("#description").val();
    PostWTR1ObjectToSend.TaxRateNotes = $("#notes").val();

    console.log(PostWTR1ObjectToSend);

    ApiCaller(url, "POST", PostWTR1ObjectToSend, "");
    SetAddModalFieldsToDefault();
});

var SetAddModalFieldsToDefault = function () {
    $("#whtCode").val("");
    $("#accountAndResidency").val("Choose");
    $("#status").val("A");
    $("#taxRate").val("");
    $("#description").val("");
    $("#notes").val("");
};

var InitializeKendoGrid = function (data) {
    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "whtcode", title: "Code", width: "15%" },
            { field: "description", title: "Description", width: "45%" },
            { field: "rate", title: "Rate", width: "80px", attributes: { style: "text-align:right;" } },
            { field: "lastModifiedDate", title: "Date Created", width: "10%", template: '#= formatDate(lastModifiedDate) #'  },
            { field: "status", template: "#if(status=='A'){# #: 'Active' # #}else{# #: 'Inactive' # #}#", title: "Status", width: "10%" },
            {
                command: [{ name: "view", template: "<button title='View item' class='btn btn-success btn-sm'><i class='fa fa-edit'></i></button>" }],
                title: "Actions", width: "8%"
            }
        ]
    });
}

var SetHeaderNameToHTML = function () {
    $("#pgHeader").text(HeaderName);
};

var DateFormatter = function (DateToFormat) {
    let YearOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = new Date(DateToFormat).toLocaleDateString("en-US", YearOptions);

    return formattedDate;
};

var ApiCaller = function (url, type, data, callback) {
    $('html').showLoading();

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

        },
        statusCode: {
            200: function (response) {
                $('html').hideLoading();

                if (callback) {
                    callback(response.body);
                };
            },
            204: function () {
                $('html').hideLoading();
            }
        },
        error: function (error) {

            $('html').hideLoading();
            toastr.error('An error occured');
        }
    });
};

var searchTcc = function () {
    let url = `${ServerUrl}api/wht/GetAllTaxRatesAsync`

    ApiCaller(url, "GET", "", InitializeKendoGrid);
};

var getesidencyAndAccountTypeAsync = function () {
    let url = `${ServerUrl}api/wht/GetAllGwtrAsync`;

    ApiCaller(url, "GET", "", loadResidencyAndAccountTypes);
};

var getesidencyAndAccountTypeUpdateAsync = function () {
    let url = `${ServerUrl}api/wht/GetAllGwtrAsync`;

    ApiCaller(url, "GET", "", loadResidencyAndAccountTypesUpdate);
};

var loadResidencyAndAccountTypes = function (list) {
    var output = '<option value="0" selected>Choose</option>';

    if (list.length > 0) {
        
        for (var i = 0; i < list.length; i++) {
            output = output + '<option value="' + list[i].id + '" >' + list[i].description + '</option>';
        }
    };

    output = output;
    $("#accountAndResidency").html(output);
};

var loadResidencyAndAccountTypesUpdate = function (list) {
    var output = '<option value="0" selected>Choose</option>';

    if (list.length > 0) {
        output += '';
        for (var i = 0; i < list.length; i++) {
            output = output + '<option value="' + list[i].id + '" >' + list[i].description + '</option>';
        }
    };

    output = output;
    $("#accountAndResidencyUpdate").html(output);
};

var loadUpdateModal = function (item) {
    $("#accTypeId").val(item.id);
    $("#whtCodeUpdate").val(item.whtCode);
    $("#accountAndResidencyUpdate").val(item.withholdTaxStatus);
    $("#taxRateUpdate").val(item.taxRate);
    $("#statusUpdate").val(item.status);
    $("#descriptionUpdate").val(item.description);
    $("#noteUpdate").val(item.notes);

    $("#modal-edit-setup").modal("show");
};

var formatDate = function (date) {
    var date = new Date(date);
    var day = date.getDate();
    var month = date.getMonth() + 1;

    day.toString().length > 1 ? day = day : day = '0' + day
    month.toString().length > 1 ? month = month : month = '0' + month

    var year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

$("#Grid").on("click", "[role='row']", function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    console.log(item);
    loadUpdateModal(item);
    getesidencyAndAccountTypeUpdateAsync();
});

$("#BtnEdit").click(function () {

    document.getElementById('whtCodeUpdate').disabled = true;
    document.getElementById('accountAndResidencyUpdate').disabled = false;
    document.getElementById('taxRateUpdate').disabled = false;
    document.getElementById('statusUpdate').disabled = false;
    document.getElementById('descriptionUpdate').disabled = false;
    document.getElementById('noteUpdate').disabled = false;

    $("#BtnEdit").hide();
    $("#BtnUpdate").show();
});

$('#modal-edit-setup').on('hidden.bs.modal', function () {

    document.getElementById('accountAndResidencyUpdate').disabled = true;
    document.getElementById('taxRateUpdate').disabled = true;
    document.getElementById('statusUpdate').disabled = true;
    document.getElementById('descriptionUpdate').disabled = true;
    document.getElementById('noteUpdate').disabled = true;

    $("#BtnEdit").show();
    $("#BtnUpdate").hide();
});

