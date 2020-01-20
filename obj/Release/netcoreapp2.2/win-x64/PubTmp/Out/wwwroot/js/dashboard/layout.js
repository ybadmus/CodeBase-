var offices = [];
var ServerUrl = $("#serverUrl").val();
var userid = $("#userId").val();
var url = `${ServerUrl}api/Users/GetAllUserTaxOfficesByUserID?userId=` + userid;

$(document).ready(function () {
    apiCaller(url, "GET", "", setTaxOffice);
});

var setTaxOffice = function (resp) {
    if (resp.length > 1)
        $("#adminTaxOffice").text("Head Office");
    else if (resp.length == 1)
        $("#adminTaxOffice").text(resp[0].taxOfficeName);
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
        },
        statusCode: {
            200: function (response) {
                $('html').hideLoading();
                if (callback) {
                    callback(response.body);
                };
            },
            204: function (response) {
            }
        },
        error: function (error) {
            $('html').hideLoading();
        }
    });
};
