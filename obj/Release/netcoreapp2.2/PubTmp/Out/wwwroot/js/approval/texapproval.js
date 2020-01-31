var HeaderName = "TEX Approval";
var serverUrl = $("#serverUrl").val();
var searchTexByTaxOffice = `${serverUrl}api/TEX/GetAllTaxExemptionPendingApprovalByTaxOfficeId`;
var GetTccCommentsByIdUrl = `${serverUrl}api/TCC/GetAllTccApplicationComments?tccId=`;
var GetAppDetailsById = `${serverUrl}api/TEX/GetWHTExApplicationById?whtId=`;
var activeTaxOffice = "";
var selectedStatus; 
var tccUpdateUrl = `${serverUrl}api/TCC/UpdateTCCApplication?id=`;

$("#texListOfTaxOffices").on('change', function () {
    var elem = document.getElementById("texListOfTaxOffices");
    activeTaxOffice = elem.options[elem.selectedIndex].value;
});

var initializeKendoGrid = function (data) {

    $("#Grid").kendoGrid({
        dataSource: { data: data, pageSize: 8 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "statusDate", title: "Date", width: '90px' },
            { field: "applicationNo", title: "Application No.", width: '100px' },
            { field: "applicantName", title: "Applicant", width: '20%' },
            { field: "applicantTIN", title: "Applicant TIN", width: '15%' },
            {
                command: [{
                    name: "view",
                    template: "<button title='View item' class='btn btn-success btn-sm' style=''><span class='fa fa-file fa-lg'></span></button>"
                }],
                title: "Actions",
                width: "70px"
            }
        ]
    });

    //if (data)
    //    if (data.length == 0)
    //        toastr.info("No Exemptions to approve.");
};

$(document).ready(function () {
    bootstrapPage();
});

var calculateThreeMonths = function () {
    var d = new Date(),
        month = '' + (d.getMonth() + 4),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
};

var loadTaxOffices = function (listOfTaxOffices) {
    var output = "";

    listOfTaxOffices.sort((a, b) => (a.taxOfficeName > b.taxOfficeName) - (a.taxOfficeName < b.taxOfficeName));

    output += '<option selected>Choose office</option>';
    for (var i = 0; i < listOfTaxOffices.length; i++) {
        output = output + '<option value="' + listOfTaxOffices[i].taxOfficeId + '" >' + listOfTaxOffices[i].taxOfficeName + '</option>';
    }

    output = output;
    $("#texListOfTaxOffices").html(output);
};

var bootstrapPage = function () {
    $("#pgHeader").text(HeaderName);
    $("#texDetails").hide();
    $("#texGridView").show();

    $("#expiryDateTcc").flatpickr({
        maxDate: calculateThreeMonths(),
        minDate: 'today'
    });

    initializeKendoGrid();

    var userid = $("#userId").val();
    var tccUrl = `${serverUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

    apiCaller(tccUrl, "GET", "", loadTaxOffices);
};

var apiCaller = function (url, type, data, callback) {
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
            if (callback) {
                callback(response.body);
            };
            $('html').hideLoading();
        },
        error: function (error) {
            $('html').hideLoading();
            toastr.error('An error occured');
        }
    });
};

var searchTex = function () {
    if (validateSearchEntry()) {
        let searchItem = $("#searchItem").val().trim();
        if (searchItem.includes('/')) {
            for (var i = 0; i < searchItem.length; i++) {
                if (searchItem[i] === '/')
                    replaceAt(searchItem, i, '%2F');
            }
        }

        let url = `${searchTexByTaxOffice}?officeId=` + activeTaxOffice + "&queryString=" + searchItem;
        apiCaller(url, "GET", "", initializeKendoGrid);

    } else {

        toastr.error("Tax office or search item field is empty");
    }
};

var validateSearchEntry = function () {
    let searchItem = $("#searchItem").val().trim();
    if (!searchItem.match(/\S/) || activeTaxOffice === "")
        return false;
    else
        return true;
};

$("#btnSearch").click(function (e) {
    searchTex();
});

$("#searchItem").on('keypress', function (e) {
    if (e.key === 'Enter') {
        searchTex();
    }
});

$("#reviseApp").click(function (e) {
    $("#approveDecline").modal("show");
});

$("body").on('click', '#Grid .k-grid-content .btn', function (e) {
    var grid = $("#Grid").getKendoGrid();
    var item = grid.dataItem($(e.target).closest("tr"));

    $("#appId").val(item.applicationId);
    prepareDetailsView(item.applicationId);
});

var prepareDetailsView = function (appId) {
    let url = `${GetAppDetailsById}` + appId;

    hideAndShow();
    loadMessages(appId);
    apiCaller(url, "GET", "", loadAppDetails);
};

var loadAppDetails = function (resp) {
    var response = resp[0];

    $("#dateSubmitted").text(response.submittedDate);
    $("#lastUpdated").text(response.statusDate);
    $("#applicantName").text(response.applicantName);
    $("#applicantTin").text(response.applicantTIN);
    $("#typeOfWht").text(response.typeOfWithHolding);
    $("#residentialStatus").text(response.residentialStatus);
    $("#remarks").text(response.remarks);
    $("#reason").text(response.reasons);
    $("#appNoTex").text(response.applicationNo);
    $("#appNoTex2").text(response.applicationNo);
};

var hideAndShow = function () {
    $("#texDetails").show();
    $("#texGridView").hide();
};

var loadMessages = function (tccId) {

    let url = `${GetTccCommentsByIdUrl}` + tccId;

    apiCaller(url, "GET", "", appendMessages)
};

var appendMessages = function (listOfComments) {

    var FName = $("#applicantName").text().split(" ")[0];
    var output = "";

    for (var i = 0; i < listOfComments.length; i++) {
        if (listOfComments[i].commentToTaxpayer) {

            output = output + '<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview"><small style="font-size: 13px;"><b>GRA | </b>' + listOfComments[i].personnelName + '</small><br><p style="color: black;">'
                + listOfComments[i].commentToTaxpayer + '</p><small style="font-size: 13px;" class="time-right">' + listOfComments[i].dateAndTime + '</small></div></div>';
        }

        if (listOfComments[i].taxpayerReply) {
            output = output + '<div style=" padding: 5px; width: 80%; float: right;"><div class="chatview" style="background-color: #f3f1d9;"><small style="font-size: 13px;"><b>Reply from ' + FName.toUpperCase() + '</b></small><br><p style="color: black;">'
                + listOfComments[i].taxpayerReply + '</p ><small style="font-size: 13px;" class="time-right">' + listOfComments[i].taxpayerReplyTime + '</small></div></div>';
        }

        if (listOfComments[i].internalComment) {
            output = output + '<div style=" padding: 5px; width: 80%; float: left;"><div class="chatview" style=";"><small style="font-size: 13px;"><b>GRA | </b>' + listOfComments[i].personnelName + '<b> - Internal Message</b></small><br><p style="color: black;">'
                + listOfComments[i].internalComment + '</p><small style="font-size: 13px;" class="time-right">' + listOfComments[i].dateAndTime + '</small></div></div>';
        }
    }

    output = output;
    $("#chatUI").html(output);
    $('#taxpayerMessageScroll').scrollTop(1000000);
};

$("#backToGrid").click(function () {
    backToView();
});

var backToView = function () {

    $("#texDetails").hide();
    $("#texGridView").show();
};

$("#appStatus").on('change', function () {
    var elem = document.getElementById("appStatus");
    selectedStatus = elem.options[elem.selectedIndex].value;
    $("#approveDeclineReturnBtn").attr("disabled", true);
});

$("#internalMessage").blur(function () {
    if (!isNaN(parseInt(selectedStatus)) && ($("#internalMessage").val().match(/\S/)))
        if (parseInt(selectedStatus) > 0)
            $("#approveDeclineReturnBtn").attr("disabled", false);
        else
            $("#approveDeclineReturnBtn").attr("disabled", true);
});

$("#approveDeclineReturnBtn").click(function () {

    if (selectedStatus == 2) {

        $("#approveModal").modal("show");

    } else {

        let tccId = $("#appId").val();
        let updateUrl = tccUpdateUrl + tccId;

        let ObjectToSend = {
            "status": selectedStatus,
            "taxpayerComment": $("#taxpayerMessage").val(),
            "internalComment": $("#internalMessage").val(),
            "applicationId": tccId
        };

        apiCaller(updateUrl, "PUT", ObjectToSend, successfullyUpdated);
    };
});

$("#continueApproval").click(function () {
    let tccId = $("#appId").val();
    let updateUrl = tccUpdateUrl + tccId;

    let ObjectToSend = {
        "status": selectedStatus,
        "taxpayerComment": $("#taxpayerMessage").val(),
        "internalComment": $("#internalMessage").val(),
        "applicationId": tccId,
        "expiryDate": $("#expiryDateTcc").val()
    };

    apiCaller(updateUrl, "PUT", ObjectToSend, successfullyUpdated);
});

var successfullyUpdated = function () {
    if (selectedStatus == 2) {
        toastr.success("Application has successfully been approved");

        $("#approveModal").modal("hide");
        $("#approveDecline").modal("hide");

        backToGrid();
    };

    if (selectedStatus == 3) {
        toastr.info("Application has been declined");

        $("#approveModal").modal("hide");
        $("#approveDecline").modal("hide");

        backToGrid();
    };

    if (selectedStatus == 1) {
        toastr.success("Application successfully return to applicant");

        $("#approveModal").modal("hide");
        $("#approveDecline").modal("hide");

        backToGrid();
    }
};

var backToGrid = function () {
    setTimeout(function () {
        window.location.href = `${serverUrl}approval/texapproval`;
    }, 3000);
};