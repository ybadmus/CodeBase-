$(document).ready(function () {
    loadUserDetials(switchTilesByUserRight);
});

var switchTilesByUserRight = function (response) {
    if (response[0].szLevel.toLowerCase() === "officer") {
        $("#approveTCC").hide();
        $("#processTCC").show();
        $("#assignTCC").hide();
        $("#allTCC").show();
    } else if (response[0].szLevel.toLowerCase() === "manager") {
        $("#approveTCC").show();
        $("#processTCC").hide();
        $("#assignTCC").hide();
        $("#allTCC").show();
    } else if (response[0].szLevel.toLowerCase() === "supervisor") {
        $("#approveTCC").hide();
        $("#processTCC").hide();
        $("#assignTCC").show();
        $("#allTCC").show();
    }

    $("#loggedInUserFUllNameTile").text(response[0].firstName + " " + response[0].lastName);
};