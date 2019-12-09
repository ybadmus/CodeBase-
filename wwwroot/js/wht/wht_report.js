console.log("report ");

$(document).ready(function () {

    //setTimeout(function () {

    //    document.getElementById("viewer_Param_101").value = "P0002289695";
    //    document.getElementById("viewer_Param_102").value = "9-1-2019";
    //    document.getElementById("viewer_Param_103").value = "9-30-2019";

    //    //var list = document.getElementById("viewer_Param_102_hidden");
    //    ////list.options[1].selected == true;
    //    //console.log(list);
    //}, 3500);

    //"~/WHT/AllWHTReports"


    var parameters = [];



    //i am no more using this code for anything but i wont delete it cos its dop[e]
    var getParameters = function () {
        var parameters = window.location.search.substr(1);
        var listParams = [];
        if (parameters != "") {
            var splitValues = parameters.split("&");
            for (var i = 0; i < splitValues.length; i++) {
                var tempValue = splitValues[i].split("=");
                listParams.push({ name: tempValue[0], value: tempValue[1] });// sepearte the name and value of the parameter
            }
        }
        //console.log(listParams);
        return listParams;
    }

    var params = getParameters();
    //console.log(params[0]['value'])


    setTimeout(function () {

        document.getElementById("viewer_Param_101").disabled = true;
        //document.getElementById("viewer_Param_102").value = params[1]['value'];
        //document.getElementById("viewer_Param_103").value = params[2]['value'];


    }, 1500);

});

