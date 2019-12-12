var ServerUrl = $("#serverUrl").val();
var MainUrl = `${ServerUrl}api/TaxOffice`;
var MainPostUrl = `${ServerUrl}api/TaxOffice`;
var RegionUrl = `${ServerUrl}api/TaxOffice`;
var TaxOfficeTypeUrl = `${ServerUrl}api/TaxOffice`;
var MainSearchUrl = `${ServerUrl}api/TaxOffice`;
var pageName = "Tax Office";
var regionsList = [];
var tottype = [];

var InitializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "code", title: "Code", width: '15%' },
            { field: "name", title: "Name", width: '30%' },
            { field: "taxOfficeType", title: "Office Type", width: '10%' },
            { field: "region", title: "Region", width: '25%' },
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
            toastr.error('An error occured');
        }
    });
};

var AppendRegionsToList = function (listOfRegions) {
    regionsList = listOfRegions;
    var output = '<option value="0" selected>Choose</option>';
    for (var i = 0; i < listOfRegions.length; i++) {
        output = output + '<option name="' + listOfRegions[i].description + '" value="' + listOfRegions[i].id + '">' + listOfRegions[i].description + '</option>';
    }

    output = output;
    $("#Region").html(output);
    $("#UpdateRegion").html(output);
};

var AppendTaxOfficeTypeToList = function (listOfTOT) {
    tottype = listOfTOT;
    var output = '<option value="0" selected>Choose</option>';
    for (var i = 0; i < listOfTOT.length; i++) {
        output = output + '<option name="' + listOfTOT[i].description + '" value="' + listOfTOT[i].id + '">' + listOfTOT[i].description + '</option>';
    }

    output = output;
    $("#UpdateOfficeType").html(output);
    $("#OfficeType").html(output);
};

var GetRegions = function () {

    let url = `${RegionUrl}/GetTaxOfficeTypesAsync/REG`;

    ApiCaller(url, "GET", "", AppendRegionsToList);
};

var GetTaxOfficeType = function () {

    let url = `${TaxOfficeTypeUrl}/GetTaxOfficeTypesAsync/TOT`;

    ApiCaller(url, "GET", "", AppendTaxOfficeTypeToList);
};

var GetAllTaxOffices = function () {

    let url = `${MainUrl}`;

    ApiCaller(url, "GET", "", InitializeKendoGrid)
};

var SetAddModalToDefault = function () {
    $("#Code").val("");
    $("#OfficeType").val("");
    $("#Name").val("");
    $("#Region").val("");
    $("#Status").val("A");
};

var SetUpdateModalToDefault = function () {
    $("#UpdateCode").val("");
    $("#UpdateOfficeType").val("");
    $("#UpdateName").val("");
    $("#UpdateRegion").val("");
    $("#UpdateStatus").val("A");
};

var searchTaxOffices = function () {

    let searchItem = $("#SearchItem").val().trim();
    let url = `${MainSearchUrl}/SearchTaxOfficeAsync/` + searchItem;

    ApiCaller(url.trim(), "GET", "", apiCallSuccess);
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
    InitializeKendoGrid([]);
    GetRegions();
    GetTaxOfficeType();
});

$("#BtnOpenAddModal").click(function () {
    GetRegions();
    GetTaxOfficeType();
    $("#modal-add-setup").modal("show");
});

$("#SubmitSetup").click(function () {
    let url = `${MainPostUrl}`;
    let Code = $("#Code").val();
    let OfficeType = $("#OfficeType").val();
    let Name = $("#Name").val();
    let Region = $("#Region").val();
    let Status = $("#Status").val();

    let ObjectToSend = {
        "code": Code,
        "taxOfficeTypeId": OfficeType,
        "name": Name,
        "regionId": Region,
        "status": Status,
        "taxOfficeType": $("#OfficeType  option:selected").text(),
        "region": $("#Region  option:selected").text()
    };

    ApiCaller(url, "POST", ObjectToSend, apiCallSuccess);
});

$("#BtnUpdate").click(function () {
    let url = `${MainPostUrl}`;
    let Code = $("#UpdateCode").val();
    let OfficeType = $("#UpdateOfficeType").val();
    let Name = $("#UpdateName").val();
    let Region = $("#UpdateRegion").val();
    let Status = $("#UpdateStatus").val();
    let id = $("#EntryId").val();

    let ObjectToSend = {
        "id": id,
        "code": Code,
        "taxOfficeTypeId": OfficeType,
        "name": Name,
        "regionId": Region,
        "status": Status,
        "taxOfficeType": $("#UpdateOfficeType  option:selected").text(),
        "region": $("#UpdateRegion  option:selected").text()
    };

    ApiCaller(url, "PUT", ObjectToSend, apiCallSuccess);
});

$("body").on("click", "[role='row']", function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    if (item.taxOfficeTypeId == null || item.regionId == null) {
        toastr.info("Please refresh the page");
        return;
    }

    $("#UpdateCode").val(item.code);
    $("#UpdateOfficeType").val(item.taxOfficeTypeId);
    $("#UpdateName").val(item.name);
    $("#UpdateRegion").val(item.regionId);
    $("#UpdateStatus").val(item.status);
    $("#EntryId").val(item.id);

    $("#modal-edit-setup").modal("show");
});

$("#BtnEdit").click(function () {
    document.getElementById('UpdateCode').disabled = true;
    document.getElementById('UpdateOfficeType').disabled = false;
    document.getElementById('UpdateName').disabled = false;
    document.getElementById('UpdateRegion').disabled = false;
    document.getElementById('UpdateStatus').disabled = false;

    $("#BtnEdit").hide();
    $("#BtnUpdate").show();
});

$('#modal-edit-setup').on('hidden.bs.modal', function () {
    document.getElementById('UpdateCode').disabled = true;
    document.getElementById('UpdateOfficeType').disabled = true;
    document.getElementById('UpdateName').disabled = true;
    document.getElementById('UpdateRegion').disabled = true;
    document.getElementById('UpdateStatus').disabled = true;

    $("#BtnEdit").show();
    $("#BtnUpdate").hide();
});

$("#BtnSearch").click(function () {
    searchTaxOffices();
});

$("#SearchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTaxOffices();
    }
});

var UpdateKendoGridLocally = function (obj) {
    var displayedData = $("#Grid").data().kendoGrid.dataSource.data();
    var found = false;

    if (obj.id) {
        for (var i = 0; i < displayedData.length; i++) {
            if (obj.id == displayedData[i].id) {
                found = true;
                displayedData[i].code = obj.code;
                displayedData[i].name = obj.name;
                displayedData[i].region = obj.region;
                displayedData[i].status = obj.status;
                displayedData[i].taxOfficeType = obj.taxOfficeType;

                InitializeKendoGrid(displayedData);
            }
        }
    }

    if (!found && !obj.id) {
       
        var objNew = {
            "status": obj.status,
            "code": obj.code,
            "region": obj.region,
            "name": obj.name,
            "taxOfficeType": obj.taxOfficeType,
        };

        displayedData.unshift(objNew);
        InitializeKendoGrid(displayedData);
    }
}; 


//code: "TAO0002"
//id: "0def7fe4-f0a9-430f-9024-04f212bb37ee"
//name: "SPINTEX ROAD-MTO"
//region: "Transaction Type 1"
//regionId: "5a4839bd-b07a-41cb-a868-3abe4986140e"
//status: "A"
//taxOfficeType: "MTO"
//taxOfficeTypeId: "3d42393e-94c8-4503-9d98-11e48e62f87a


