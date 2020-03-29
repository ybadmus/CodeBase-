var ServerUrl = $("#serverUrl").val();
var MainPostUrl = `${ServerUrl}api/Currency`;
var MainGetUrl = `${ServerUrl}api/Currency`;
var MainSearchUrl = `${ServerUrl}api/Currency`;

var initializeKendoGrid = function (data, stage) {
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
            { field: "description", title: "Description", width: '40%' },
            { field: "symbol", title: "Symbol", width: '10%' },
            {
                field: "status",
                template: "#if(status=='A'){# #: 'Active' # #}else{# #: 'Inactive' # #}#",
                title: "Status",
                width: '10%'
            },
            {
                command: [{
                    name: "view",
                    template: "<button title='View item' class='btn btn-success btn-sm'><i class='fa fa-file fa-lg'></i></button>"
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
            $('html').hideLoading();
            if (callback) {
                callback(response.body, data, type);
            };
        },
        error: function (error) {
            $('html').hideLoading();
            toastr.error('An error occured');
        }
    });
};

var CodesUpdater = function (url, type, data) {

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

            UpdateKendoGridLocally(data.code, data.symbol, data.description, data.notes, data.status, data.id);
            toastr.success('Sucessfully updated');
            $("#modal-edit-setup").modal("hide");
        },
        error: function (error) {
            toastr.error('An error occured');
        }
    });
}

var SetAddModalToDefault = function () {

    $("#Code").val("");
    $("#Symbol").val("");
    $("#Description").val("");
    $("#HomeCurrency").val("");
    $("#Status").val("A");
    $("#Note").val("");
};

var SetUpdateModalToDefault = function () {

    $("#UpdateCode").val("");
    $("#UpdateSymbol").val("");
    $("#UpdateDescription").val("");
    $("#UpdateHomeCurrency").val("");
    $("#UpdateStatus").val("A");
    $("#UpdateNote").val("");
};

var SubmitSetup = function () {

    let url = `${MainPostUrl}`;
    let Code = $("#Code").val();
    let Symbol = $("#Symbol").val();
    let Description = $("#Description").val();
    let HomeCurrency = $("#HomeCurrency").val();
    let Status = $("#Status").val();
    let Note = $("#Note").val();

    let ObjectToSend = {
        "code": Code,
        "symbol": Symbol,
        "description": Description,
        "homeCurrency": HomeCurrency,
        "notes": Note,
        "status": Status
    };

    ApiCaller(url, "POST", ObjectToSend);
 
};

var UpdateSetup = function () {

    let url = `${MainPostUrl}`;
    let Code = $("#UpdateCode").val();
    let Symbol = $("#UpdateSymbol").val();
    let Description = $("#UpdateDescription").val();
    let HomeCurrency = $("#UpdateHomeCurrency").val();
    let Status = $("#UpdateStatus").val();
    let Note = $("#UpdateNote").val();
    let id = $("#EntryId").val();

    let ObjectToSend = {
        "code": Code,
        "symbol": Symbol,
        "description": Description,
        "homeCurrency": HomeCurrency,
        "notes": Note,
        "status": Status,
        "id": id
    };

    CodesUpdater(url, "POST", ObjectToSend);

};

var searchCurrency = function () {

    const searchItem = $("#SearchItem").val().trim();
    let url = `${MainSearchUrl}/SearchCurrency/` + searchItem;

    $("#Grid").data("kendoGrid").dataSource.data([]);
    ApiCaller(url, "GET", "", initializeKendoGrid);
};

$(document).ready(function () {
    initializeKendoGrid([], 1);
    $("#pgHeader").text("Currency");
});

$("#BtnOpenAddModal").click(function () {

    $("#modal-add-setup").modal("show");
});

$("#SubmitSetup").click(function () {

    SubmitSetup();

    SetAddModalToDefault();
    location.reload(true);
});

$("#BtnUpdate").click(function () {

    UpdateSetup();

    SetUpdateModalToDefault();
    //location.reload(true);
});

$("body").on("click", "[role='row']", function (e) {

    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));
    console.log(item);

    $("#UpdateCode").val(item.code);
    $("#UpdateSymbol").val(item.symbol);
    $("#UpdateDescription").val(item.description);
    $("#UpdateHomeCurrency").val(item.homeCurrency);
    $("#UpdateStatus").val(item.status);
    $("#UpdateNote").val(item.notes);
    $("#EntryId").val(item.id);

    $("#modal-edit-setup").modal("show");
});

$("#BtnEdit").click(function () {

    document.getElementById('UpdateCode').disabled = true;
    document.getElementById('UpdateSymbol').disabled = false;
    document.getElementById('UpdateDescription').disabled = false;
    document.getElementById('UpdateHomeCurrency').disabled = false;
    document.getElementById('UpdateStatus').disabled = false;
    document.getElementById('UpdateNote').disabled = false;

    $("#BtnEdit").hide();
    $("#BtnUpdate").show();
});

$('#modal-edit-setup').on('hidden.bs.modal', function () {

    document.getElementById('UpdateCode').disabled = true;
    document.getElementById('UpdateSymbol').disabled = true;
    document.getElementById('UpdateDescription').disabled = true;
    document.getElementById('UpdateHomeCurrency').disabled = true;
    document.getElementById('UpdateStatus').disabled = true;
    document.getElementById('UpdateNote').disabled = true;

    $("#BtnEdit").show();
    $("#BtnUpdate").hide();
});

$("#BtnSearch").click(function () {
    searchCurrency();
});

$("#SearchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchCurrency();
    }
});

var UpdateKendoGridLocally = function (code, symbol, description, notes, status, id) {
    var displayedData = $("#Grid").data().kendoGrid.dataSource.view()

    for (var i = 0; i < displayedData.length; i++) {
        if (id == displayedData[i].id) {
            displayedData[i].status = status;
            displayedData[i].description = description;
            displayedData[i].code = code;
            displayedData[i].symbol = symbol;
            displayedData[i].notes = notes;

            initializeKendoGrid(displayedData);
        }
    }
}
