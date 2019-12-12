'use strict'

var ServerUrl = $("#serverUrl").val();
var HeaderName = "Account Type & Residency";
var GWTRObjectToSend = {
    "id": "",
    "resStatusId": "",
    "withholdTaxStatus": "",
    "WhtStatus": "",
    "DescriptionsWht": ""
}

$(document).ready(function () {
    SetHeaderNameToHTML();
    InitializeKendoGrid([]);
    searchTcc();
});

var InitializeKendoGrid = function (data) {
    var dataFormatted = [];
    if (data) {
        for (var i = 0; i < data.length; i++) {
            let formattedDate = DateFormatter(data[i].lastModifiedDate);
            data[i].lastModifiedDate = formattedDate;
            dataFormatted.push(data[i]);
        }
    }

    $("#Grid").kendoGrid({
        dataSource: { data: dataFormatted ? dataFormatted : [], pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "withholdTaxStatus", title: "Account Type", width: "25%" },
            { field: "resStatus", title: "Residency Status", width: "30%" },
            { field: "lastModifiedDate", title: "Date Created", width: "30%" },
            { field: "status", template: "#if(status=='A'){# #: 'Active' # #}else{# #: 'Inactive' # #}#", title: "Status", width: "10%" },
            {
                command: [{ name: "view", template: "<button title='View item' class='btn btn-success btn-sm'><i class='fa fa-edit'></i></button>" }],
                title: "Actions", width: "8%"
            }
        ]
    });
};

var SetHeaderNameToHTML = function () {
    $("#SetupName").text(HeaderName);
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
        }
    });
};

var searchTcc = function () {
    let url = `${ServerUrl}api/wht/GetAllGwtrAsync`

    ApiCaller(url, "GET", "", InitializeKendoGrid);
};

var DateFormatter = function (DateToFormat) {
    let YearOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = new Date(DateToFormat).toLocaleDateString("en-US", YearOptions);

    return formattedDate;
};

var getResidencyStatusAsync = function () {
    let url = `${ServerUrl}api/CodesApi/RES`;

    ApiCaller(url, "GET", "", loadResidencyStatus);
};

var getResidencyStatusAsyncUpdate = function () {
    let url = `${ServerUrl}api/CodesApi/RES`;

    ApiCaller(url, "GET", "", loadResidencyStatusUpdate);
};

var getAccountTypeAsync = function () {
    let url = `${ServerUrl}api/CodesApi/WTS`;

    ApiCaller(url, "GET", "", loadAccountTypes);
};


var getAccountTypeAsyncUpdate = function () {
    let url = `${ServerUrl}api/CodesApi/WTS`;

    ApiCaller(url, "GET", "", loadAccountTypesUpdate);
};


var loadResidencyStatus = function (listOfPeriods) {
    var output = "";

    if (listOfPeriods.length > 0) {
        output += '<option value="0"><a style="pointer-events: none">Select</a></option>';
        for (var i = 0; i < listOfPeriods.length; i++) {
            output = output + '<option name="' + listOfPeriods[i].description + '" value="' + listOfPeriods[i].id + '" >' + listOfPeriods[i].description + '</option>';
        }
    };

    output = output;
    $("#residencyStatus").html(output);
};

var loadResidencyStatusUpdate = function (listOfPeriods) {
    var output = "";

    if (listOfPeriods.length > 0) {
        //output += '<option value="0"><a style="pointer-events: none">Select</a></option>';
        output += '';
        for (var i = 0; i < listOfPeriods.length; i++) {
            output = output + '<option name="' + listOfPeriods[i].description + '" value="' + listOfPeriods[i].id + '" >' + listOfPeriods[i].description + '</option>';
        }
    };

    output = output;
    $("#residencyStatusUpdate").html(output);
};

var loadAccountTypes = function (listOfPeriods) {
    var output = "";

    if (listOfPeriods.length > 0) {
        output += '<option value="0"><a style="pointer-events: none">Select</a></option>';
        for (var i = 0; i < listOfPeriods.length; i++) {
            output = output + '<option name="' + listOfPeriods[i].description + '" value="' + listOfPeriods[i].id + '" >' + listOfPeriods[i].description + '</option>';
        }
    };

    output = output;
    $("#accountType").html(output);
};

var loadAccountTypesUpdate = function (listOfPeriods) {
    var output = "";

    if (listOfPeriods.length > 0) {
        //output += '<option value="0"><a style="pointer-events: none">Select</a></option>';
        output += '';
        for (var i = 0; i < listOfPeriods.length; i++) {
            output = output + '<option name="' + listOfPeriods[i].description + '" value="' + listOfPeriods[i].id + '" >' + listOfPeriods[i].description + '</option>';
        }
    };

    output = output;
    $("#accountTypeUpdate").html(output);
};

$("#BtnOpenAddModal").click(function () {
    $("#modal-add-setup").modal("show");
    getResidencyStatusAsync();
    getAccountTypeAsync();
});

$("#dateCreated").flatpickr({
    currentDate: "today"
});

$("#SubmitSetup").click(function () {
    let url = `${ServerUrl}api/wht/PostGWTR`;

    GWTRObjectToSend.resStatusId = $("#residencyStatus").val();
    GWTRObjectToSend.withholdTaxStatus = $("#accountType").val();
    GWTRObjectToSend.WhtStatus = $("#accountTypeStatus").val();
    GWTRObjectToSend.DescriptionsWht = $("#descriptionAccType").val();

    ApiCaller(url, "POST", GWTRObjectToSend, "");
    SetAddModalFieldsToDefault();
});

var SetAddModalFieldsToDefault = function () {
    $("#residencyStatus").val("");
    $("#accountType").val("");
    $("#accountTypeStatus").val("A");
    $("#dateCreated").val("");
    $("#descriptionAccType").val("");
};

var loadUpdateModal = function (item) {
    $("#accTypeId").val(item.id);
    $("#residencyStatusUpdate").val(item.resStatusId);
    $("#accountTypeUpdate").val(item.withholdTaxStatusId);
    $("#descriptionAccTypeUpdate").val(item.description);
    $("#dateCreatedUpdate").val(item.lastModifiedDate);
    $("#accountTypeStatusUpdate").val(item.status);


    $("#modal-edit-setup").modal("show");
};

$("#accountType").change(function () {
    var selectedName = $("#accountType option:selected").text() + " &";
    var textArea = $("#descriptionAccType").val();

    if (!textArea.trim() == "") {
        if (textArea.includes("&")) {
            var splitInput = textArea.split("&");
            var newText = textArea.replace(splitInput[0] + "&", selectedName);
        } else
            var newText = selectedName + textArea;

        $("#descriptionAccType").val(newText)
    } else {
        $("#descriptionAccType").val(selectedName)
    }
});

$("#residencyStatus").change(function () {
    var selectedName = $("#residencyStatus option:selected").text();
    var textArea = $("#descriptionAccType").val();

    if (!textArea.trim() == "") {
        var splitInput = textArea.split("&");
        if (splitInput[1] == "")
            var newText = textArea + " " + selectedName;
        else 
            var newText = textArea.replace(splitInput[1], " " + selectedName);

        $("#descriptionAccType").val(newText);
    } else {
        $("#descriptionAccType").val(" " + selectedName);

    }
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    //console.log(item);
    getResidencyStatusAsyncUpdate();
    getAccountTypeAsyncUpdate();
    loadUpdateModal(item);
});

$("#BtnEdit").click(function () {

    document.getElementById('accountTypeUpdate').disabled = false;
    document.getElementById('residencyStatusUpdate').disabled = false;
    document.getElementById('descriptionAccTypeUpdate').disabled = false;
    document.getElementById('dateCreatedUpdate').disabled = false;
    document.getElementById('accountTypeStatusUpdate').disabled = false;

    $("#BtnEdit").hide();
    $("#BtnUpdate").show();
});

$('#modal-edit-setup').on('hidden.bs.modal', function () {

    document.getElementById('accountTypeUpdate').disabled = true;
    document.getElementById('residencyStatusUpdate').disabled = true;
    document.getElementById('descriptionAccTypeUpdate').disabled = true;
    document.getElementById('dateCreatedUpdate').disabled = true;
    document.getElementById('accountTypeStatusUpdate').disabled = true;

    $("#BtnEdit").show();
    $("#BtnUpdate").hide();
});

$("#BtnUpdate").click(function () {
    let url = `${ServerUrl}api/wht/PostGWTR`;

    GWTRObjectToSend.GwtrId = $("#accTypeId").val();
    GWTRObjectToSend.resStatusId = $("#residencyStatusUpdate").val();
    GWTRObjectToSend.withholdTaxStatus = $("#accountTypeUpdate").val();
    GWTRObjectToSend.WhtStatus = $("#accountTypeStatusUpdate").val();
    GWTRObjectToSend.DescriptionsWht = $("#descriptionAccTypeUpdate").val();

    ApiCaller(url, "POST", GWTRObjectToSend, "");
    SetAddModalFieldsToDefault();
});

$("#accountTypeUpdate").change(function () {
    var selectedName = $("#accountTypeUpdate option:selected").text() + " &";
    var textArea = $("#descriptionAccTypeUpdate").val();

    if (!textArea.trim() == "") {
        if (textArea.includes("&")) {
            var splitInput = textArea.split("&");
            var newText = textArea.replace(splitInput[0] + "&", selectedName);
        } else
            var newText = selectedName + textArea;

        $("#descriptionAccTypeUpdate").val(newText)
    } else {
        $("#descriptionAccTypeUpdate").val(selectedName)
    }
});

$("#residencyStatusUpdate").change(function () {
    var selectedName = $("#residencyStatusUpdate option:selected").text();
    var textArea = $("#descriptionAccTypeUpdate").val();

    if (!textArea.trim() == "") {
        var splitInput = textArea.split("&");
        if (splitInput[1] == "")
            var newText = textArea + " " + selectedName;
        else
            var newText = textArea.replace(splitInput[1], " " + selectedName);

        $("#descriptionAccTypeUpdate").val(newText);
    } else {
        $("#descriptionAccTypeUpdate").val(" " + selectedName);

    }
});









