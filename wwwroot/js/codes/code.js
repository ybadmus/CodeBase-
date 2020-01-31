var AppServerUrl = $("#serverUrl").val();
var MainGetUrl = `${AppServerUrl}api/CodesApi/`;
var MainPostUrl = `${AppServerUrl}api/CodesApi/`;
var MainSearchUrl = `${AppServerUrl}api/CodesApi/SearchCodesTableAsync?type=`;
var HeaderName = "";

var initializeKendoGrid = function (data) {
    $("#grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "code", title: "Code", width: '20%' },
            { field: "description", title: "Description", width: '50%' },
            {
                field: "cStatus",
                template: "#if(cStatus=='A'){# #: 'Active' # #}else{# #: 'Inactive' # #}#",
                title: "Status",
                width: '10%'
            },
            {
                command: [{
                    name: "view",
                    template: "<button title='View item' class='btn btn-success btn-sm'><i class='fa fa-edit'></i></button>"
                }],
                title: "Actions",
                width: "72px"
            }
        ]
    });
};

var apiCaller = function (url, type, data, callback) {
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
        if (res.length == 0)
            return toastr.info("No Data");
        initializeKendoGrid(res);
    }
};

var setDefaultModal = function () {
    $("#Code").val("");
    $("#Description").val("");
    $("#Status").val("A");
    $("#Note").val("");
};

var setDefaultUpdateModal = function () {
    $("#UpdateCode").val("");
    $("#UpdateDescription").val("");
    $("#UpdateStatus").val("A");
    $("#UpdateNote").val("");
};

var setHeaderNameToHTML = function () {
    $("#EditModalSetupName").text(HeaderName);
    $("#AddModalSetupName").text(HeaderName);
    $("#pgHeader").text(HeaderName);
};

var searchCodes = function () {
    let searchItem = $("#searchItem").val();
    let searchItemTrimmed = searchItem.trim();
    let url = `${MainSearchUrl}` + "&term=" + `${searchItemTrimmed}`;

    $("#grid").data("kendoGrid").dataSource.data([]);
    apiCaller(url.trim(), "GET", "", apiCallSuccess);
};

var configureUrls = function (setuptype) {
    switch (setuptype) {

        case "region":
            MainGetUrl = `${MainGetUrl}REG`;
            MainPostUrl = `${MainPostUrl}REG`;
            MainSearchUrl = `${MainSearchUrl}REG`;
            HeaderName = "Region";
            break;

        case "taxofficetype":
            MainGetUrl = `${MainGetUrl}TOT`;
            MainPostUrl = `${MainPostUrl}TOT`;
            MainSearchUrl = `${MainSearchUrl}TOT`;
            HeaderName = "Tax Office Type";
            break;

        case "countries":
            MainGetUrl = `${MainGetUrl}CTR`;
            MainPostUrl = `${MainPostUrl}CTR`;
            MainSearchUrl = `${MainSearchUrl}CTR`;
            HeaderName = "Countries";
            break;

        case "nationality":
            MainGetUrl = `${MainGetUrl}NAT`;
            MainPostUrl = `${MainPostUrl}NAT`;
            MainSearchUrl = `${MainSearchUrl}NAT`;
            HeaderName = "Nationality";
            break;

        case "taxpayertype":
            MainGetUrl = `${MainGetUrl}TPT`;
            MainPostUrl = `${MainPostUrl}TPT`;
            MainSearchUrl = `${MainSearchUrl}TPT`;
            HeaderName = "Taxpayer Type";
            break;

        case "identitytype":
            MainGetUrl = `${MainGetUrl}SIT`;
            MainPostUrl = `${MainPostUrl}SIT`;
            MainSearchUrl = `${MainSearchUrl}SIT`;
            HeaderName = "Identity Type";
            break;

        case "patnerdormantstate":
            MainGetUrl = `${MainGetUrl}PDS`;
            MainPostUrl = `${MainPostUrl}PDS`;
            MainSearchUrl = `${MainSearchUrl}PDS`;
            HeaderName = "Partner Dormant State";
            break;

        case "residentialstatus":
            MainGetUrl = `${MainGetUrl}RES`;
            MainPostUrl = `${MainPostUrl}RES`;
            MainSearchUrl = `${MainSearchUrl}RES`;
            HeaderName = "Residential Status";
            break;

        case "tenancystatus":
            MainGetUrl = `${MainGetUrl}TES`;
            MainPostUrl = `${MainPostUrl}TES`;
            MainSearchUrl = `${MainSearchUrl}TES`;
            HeaderName = "Tenancy Status";
            break;

        case "accountingmethod":
            MainGetUrl = `${MainGetUrl}TAM`;
            MainPostUrl = `${MainPostUrl}TAM`;
            MainSearchUrl = `${MainSearchUrl}TAM`;
            HeaderName = "Accounting Method";
            break;

        case "withholdingtaxstatus":
            MainGetUrl = `${MainGetUrl}WTS`;
            MainPostUrl = `${MainPostUrl}WTS`;
            MainSearchUrl = `${MainSearchUrl}WTS`;
            HeaderName = "Withholding Tax Status";
            break;

        case "transactiontype":
            MainGetUrl = `${MainGetUrl}TRT`;
            MainPostUrl = `${MainPostUrl}TRT`;
            MainSearchUrl = `${MainSearchUrl}TRT`;
            HeaderName = "Transaction Type";
            break;

        case "processtype":
            MainGetUrl = `${MainGetUrl}PRT`;
            MainPostUrl = `${MainPostUrl}PRT`;
            MainSearchUrl = `${MainSearchUrl}PRT`;
            HeaderName = "Process Type";
            break;

        case "authorisationcategory":
            MainGetUrl = `${MainGetUrl}AUC`;
            MainPostUrl = `${MainPostUrl}AUC`;
            MainSearchUrl = `${MainSearchUrl}AUC`;
            HeaderName = "Auth Category";
            break;

        case "authorisationtype":
            MainGetUrl = `${MainGetUrl}AUT`;
            MainPostUrl = `${MainPostUrl}AUT`;
            MainSearchUrl = `${MainSearchUrl}AUT`;
            HeaderName = "Authorisation Type";
            break;

        case "mediaUploadType":
            MainGetUrl = `${MainGetUrl}MUT`;
            MainPostUrl = `${MainPostUrl}MUT`;
            MainSearchUrl = `${MainSearchUrl}MUT`;
            HeaderName = "Media Upload Type";
            break;

        case "personalReliefs":
            MainGetUrl = `${MainGetUrl}APT`;
            MainPostUrl = `${MainPostUrl}APT`;
            MainSearchUrl = `${MainSearchUrl}APT`;
            HeaderName = "Personal Relief Type";
            break;

        case "exemptionreason":
            MainGetUrl = `${MainGetUrl}EAR`;
            MainPostUrl = `${MainPostUrl}EAR`;
            MainSearchUrl = `${MainSearchUrl}EAR`;
            HeaderName = "Reasons For WHT Exemptions";
            break;

        case "tccpurposes":
            MainGetUrl = `${MainGetUrl}TCCP`;
            MainPostUrl = `${MainPostUrl}TCCP`;
            MainSearchUrl = `${MainSearchUrl}TCCP`;
            HeaderName = "TCC Purposes";
            break;

        case "payeEmployeePositions":
            MainGetUrl = `${MainGetUrl}PEEP`;
            MainPostUrl = `${MainPostUrl}PEEP`;
            MainSearchUrl = `${MainSearchUrl}PEEP`;
            HeaderName = "Employee Positions";
            break;
    }
};

var getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

$(document).ready(function () {
    let setupName = getParameterByName("type");
    configureUrls(setupName);
    setHeaderNameToHTML();
    initializeKendoGrid([]);
});

$("#btnOpenAddModal").click(function () {
    $("#modal-add-setup").modal("show");
});

$("#SubmitSetup").click(function () {
    let url = `${MainPostUrl}`;
    let Code = $("#Code").val();
    let Description = $("#Description").val();
    let Status = $("#Status").val();
    let Notes = $("#Note").val();

    let ObjectToSend = {
        "id": "",
        "code": Code,
        "description": Description,
        "notes": Notes,
        "cStatus": Status
    };

    apiCaller(url, "POST", ObjectToSend, apiCallSuccess);
});

$("body").on('click', '#grid .k-grid-content .btn', function (e) {
    var grid = $("#grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    $("#UpdateCode").val(item.code);
    $("#UpdateStatus").val(item.cStatus);
    $("#UpdateDescription").val(item.description);
    $("#UpdateNote").val(item.notes);
    $("#EntryId").val(item.id);
    $("#modal-edit-setup").modal("show");
});

$("#BtnEdit").click(function () {
    document.getElementById('UpdateCode').disabled = true;
    document.getElementById('UpdateStatus').disabled = false;
    document.getElementById('UpdateDescription').disabled = false;
    document.getElementById('UpdateNote').disabled = false;

    $("#BtnEdit").hide();
    $("#BtnUpdate").show();
});

$("#BtnUpdate").click(function () {
    let url = `${MainPostUrl}`;
    let regionCode = $("#UpdateCode").val();
    let rgionStatus = $("#UpdateStatus").val();
    let regionDescription = $("#UpdateDescription").val();
    let regionNotes = $("#UpdateNote").val();
    let id = $("#EntryId").val();
    let ObjectToSend = {
        "id": id,
        "code": regionCode,
        "description": regionDescription,
        "notes": regionNotes,
        "cStatus": rgionStatus
    };

    apiCaller(url, "PUT", ObjectToSend, apiCallSuccess);
});

$('#modal-add-setup').on('hidden.bs.modal', function () {
    setDefaultModal();
});

$('#modal-edit-setup').on('hidden.bs.modal', function () {
    document.getElementById('UpdateCode').disabled = true;
    document.getElementById('UpdateStatus').disabled = true;
    document.getElementById('UpdateDescription').disabled = true;
    document.getElementById('UpdateNote').disabled = true;

    $("#BtnEdit").show();
    $("#BtnUpdate").hide();
});

$("#btnSearch").click(function () {
    searchCodes();
});

$("#searchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchCodes();
    }
});

var UpdateKendoGridLocally = function (obj) {
    var displayedData = $("#grid").data().kendoGrid.dataSource.data();
    var found = false;

    if (obj.id) {
        for (var i = 0; i < displayedData.length; i++) {
            if (obj.id == displayedData[i].id) {
                found = true;
                displayedData[i].cStatus = obj.cStatus;
                displayedData[i].description = obj.description;
                displayedData[i].code = obj.code;
                displayedData[i].notes = obj.notes;

                initializeKendoGrid(displayedData);
            }
        }
    }

    if (!found && !obj.id) {
        var objNew = {
            "cStatus": obj.cStatus,
            "description": obj.description,
            "code": obj.code,
            "notes": obj.notes,
        };

        displayedData.unshift(objNew);
        initializeKendoGrid(displayedData);
    }
};

