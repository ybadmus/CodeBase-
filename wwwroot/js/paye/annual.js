var TaxPayerData = {},
    YearOptions = { year: 'numeric', month: 'long', day: 'numeric' },
    PAYEYears = [],
    PAYEYear = {},
    FromPeriod,
    ToPeriod;

$(document).ready(() => {
    // Get list of years
    GetPAYEYears();

    // Get TaxPayer Data
    GetTaxPayerData();
});


var GetPAYEYears = () => {
    let eY = Number(new Date().getFullYear());
    let bY = eY - 20;

    for (let y = eY; y > bY; y--) {
        PAYEYear = { Id: y, Name: y};
        PAYEYears.push(PAYEYear);
    }
    SetPAYEYears();
}

var SetPAYEYears = () => {
    var yOpts = "<option>Choose one</option>";
    for (let x = 0; x < PAYEYears.length; x++) {
        yOpts += `<option value="${PAYEYears[x].Id}">${PAYEYears[x].Name}</option>`;
    }
    $("#PAYEYears").html(yOpts);
}

var SetPeriodValues = function () {
    PAYEYear = $("#PAYEYears").val();
    if (Number(PAYEYear) >= 1990) {
        FromPeriod = new Date(`${PAYEYear}-01-01`);
        ToPeriod = new Date(`${PAYEYear}-12-31`);
        $("#FromPeriod").html(FromPeriod.toLocaleDateString("en-US", YearOptions));
        $("#ToPeriod").html(ToPeriod.toLocaleDateString("en-US", YearOptions));

        // Control Views
        $("#btnResetPeriod").prop("hidden", false);
        $("#YearPeriod").prop("hidden", false);
        $("#PageDataBody").prop("hidden", false);
    } else {
        toastr.info("Please select a valid year.");
        ResetPeriod();
    }
}

var ResetPeriod = function () {
    // Reset Options
    $("#FromPeriod").html("");
    $("#ToPeriod").html("");
    $("#YearPeriod").prop("hidden", true);
    $("#PageDataBody").prop("hidden", true);
    $("#btnResetPeriod").prop("hidden", true);
    $("#PAYEYears").val($("#PAYEYears option:first").val());


}


var GetTaxPayerData = function () {

    var dataModel = {
        TIN: nameTIN.TIN
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerData`;
    $.post(postUrl, postData, (data, status) => {
        // console.log('GetTaxPayerData Data: ', data);

        // Display on view
        if (data.status === "Successful") {
            // Keep object for future use.
            TaxPayerData = data.body;

        }
    }).fail((response) => {
        //console.log('Response Error: ' + response.responseText);
    });
}