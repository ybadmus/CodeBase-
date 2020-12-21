$(document).ready(function () {
    loadUserDetials(switchTilesByUserRight);
});

var switchTilesByUserRight = function (response) {

    $("#loggedInUserFUllNameTile").text(response[0].firstName + " " + response[0].lastName);
    $("#szGroupName").text(response[0].szLevel);

    if (response[0].szLevel.toLowerCase() === "officer") {
        $("#approveTCC").hide();
        $("#processTCC").show();
        $("#assignTCC").hide();
        $("#assignBulk").hide();
        $("#reassign").hide();
        $("#allTCC").show();
    } else if (response[0].szLevel.toLowerCase() === "manager") {
        $("#approveTCC").show();
        $("#processTCC").hide();
        $("#assignTCC").show();
        $("#reassign").show();
        $("#assignBulk").show();
        $("#allTCC").show();
    } else if (response[0].szLevel.toLowerCase() === "supervisor") {
        $("#approveTCC").hide();
        $("#processTCC").show();
        $("#assignTCC").show();
        $("#assignBulk").show();
        $("#allTCC").show();
        $("#reassign").show();
    }

};