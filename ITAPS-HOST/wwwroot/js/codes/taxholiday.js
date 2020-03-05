var AppServerUrl = $("#serverUrl").val();
var MainGetUrl = `${AppServerUrl}api/TaxHoliday`;
var MainPostUrl = `${AppServerUrl}api/TaxHoliday`;
var MainSearchUrl = `${AppServerUrl}api/TaxHoliday`;
var pageName = "Tax Holiday";

var InitializeKendoGrid = function (data, stage) {
    if (data.length == 0 && stage !== 1) {
        return toastr.info("No Data");
    }

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "code", title: "Code", width: '20%' },
            { field: "description", title: "Description", width: '60%' },
            {
                field: "status",
                template: "#if(status=='A'){# #: 'Active' # #}else{# #: 'Inactive' # #}#",
                title: "Status",
                width: '10%'
            },
            {
                command: [{
                    name: "view",
                    template: "<button title='View item' class='btn btn-success btn-sm'><i class='fa fa-edit'></i></button>"
                }],
                title: "Actions",
                width: "7%"
            }
        ]
    });
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
            $('html').hideLoading();
            toastr.error('An error occured');
        }
    });
}

var SetAddModalToDefault = function () {
    $("#Code").val("");
    $("#Status").val("A");
    $("#Description").val("");
    $("#Note").val("");
};

var SetUpdateModalToDefault = function () {
    $("#UpdateCode").val("");
    $("#UpdateStatus").val("A");
    $("#UpdateDescription").val("");
    $("#UpdateNote").val("");
};

var searchTaxHoliday = function () {
    let searchItem = $("#SearchItem").val();
    let searchItemTrimmed = searchItem.trim();
    let url = `${MainSearchUrl}/SearchTaxHolidayAsync/` + searchItemTrimmed;

    $("#Grid").data("kendoGrid").dataSource.data([]);
    ApiCaller(url.trim(), "GET", "", InitializeKendoGrid);
};

var apiCallSuccess = function (res, objectSent, type) {
    if (type == "POST") {
        toastr.success("Successfully saved");
        UpdateKendoGridLocally(objectSent);
        SetAddModalToDefault();
        $("#modal-add-setup").modal("hide");
    } else if (type == "PUT") {
        toastr.success("Successfully updated");
        UpdateKendoGridLocally(objectSent);
        SetUpdateModalToDefault();
        $("#modal-edit-setup").modal("hide");
    } else if (type == "GET") {
        InitializeKendoGrid(res);
    }
};

$(document).ready(function () {
    $("#pgHeader").text(pageName);
    InitializeKendoGrid([], 1);
    ApiCaller(`${AppServerUrl}api/TaxHoliday/1fa14f0e-e0b6-4845-9665-04e5d741da2f`, "GET", "", "");
});

$("#BtnOpenAddModal").click(function () {

    $("#modal-add-setup").modal("show");
});

$("#SubmitSetup").click(function () {
    let url = `${MainPostUrl}`;
    let code = $("#Code").val();
    let status = $("#Status").val();
    let description = $("#Description").val();
    let note = $("#Note").val();

    let ObjectToSend = {
        "code": code,
        "description": description,
        "notes": note,
        "status": status
    }

    ApiCaller(url, "POST", ObjectToSend, apiCallSuccess);
});

$("#BtnUpdate").click(function () {

    let url = `${MainPostUrl}`;

    let code = $("#UpdateCode").val();
    let status = $("#UpdateStatus").val();
    let description = $("#UpdateDescription").val();
    let note = $("#UpdateNote").val();
    let id = $("#EntryId").val();

    let ObjectToSend = {
        "code": code,
        "description": description,
        "notes": note,
        "status": status,
        "id": id
    }

    ApiCaller(url, "PUT", ObjectToSend, apiCallSuccess);
});

$("#BtnEdit").click(function () {

    document.getElementById('UpdateCode').disabled = true;
    document.getElementById('UpdateStatus').disabled = false;
    document.getElementById('UpdateDescription').disabled = false;
    document.getElementById('UpdateNote').disabled = false;

    $("#BtnEdit").hide();
    $("#BtnUpdate").show();
});

$("body").on("click", "[role='row']", function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    if (item.id == null) {
        toastr.info("Please refresh the page");
        return;
    }

    $("#UpdateCode").val(item.code);
    $("#UpdateStatus").val(item.status);
    $("#UpdateDescription").val(item.description);
    $("#UpdateNote").val(item.notes);
    $("#EntryId").val(item.id);

    $("#modal-edit-setup").modal("show");
});

$('#modal-edit-setup').on('hidden.bs.modal', function () {
    document.getElementById('UpdateCode').disabled = true;
    document.getElementById('UpdateStatus').disabled = true;
    document.getElementById('UpdateDescription').disabled = true;
    document.getElementById('UpdateNote').disabled = true;

    $("#BtnEdit").show();
    $("#BtnUpdate").hide();
});

$("#BtnSearch").click(function () {
    searchTaxHoliday();
});

$("#SearchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTaxHoliday();
    }
});

var UpdateKendoGridLocally = function (obj) {
    var displayedData = $("#Grid").data().kendoGrid.dataSource.data();
    var found = false;

    if (obj.id) {
        for (var i = 0; i < displayedData.length; i++) {
            if (obj.id == displayedData[i].id) {
                found = true;
                displayedData[i].status = obj.status;
                displayedData[i].description = obj.description;
                displayedData[i].code = obj.code;
                displayedData[i].notes = obj.notes;

                InitializeKendoGrid(displayedData);
            }
        }
    }

    if (!found && !obj.id) {

        var objNew = {
            "status": obj.status,
            "description": obj.description,
            "code": obj.code,
            "notes": obj.notes,
        };

        displayedData.unshift(objNew);
        InitializeKendoGrid(displayedData);
    }
}; 

