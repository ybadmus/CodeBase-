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
            if (callback) {
                callback(response.body);
            };
        },
        error: function (error) {
            console.log(error);
            //TODO: USE TOASTR TO DISPLAY ERROR;
        }
    });
};
