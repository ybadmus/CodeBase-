$(document).ready(function () {
    loadUserDetials(switchTilesByUserRight);
});

var switchTilesByUserRight = function (response) {
    if(response.szGroupName.toLowerCase() === "officer") {
        $("#approveTCC").hide();
        $("#processTCC").show();
        $("#assignTCC").hide();
        $("#allTCC").show();
    } else if (response.szGroupName.toLowerCase() === "manager") {
        $("#approveTCC").show();
        $("#processTCC").hide();
        $("#assignTCC").hide();
        $("#allTCC").show();
    } else if (response.szGroupName.toLowerCase() === "supervisor") {
        $("#approveTCC").hide();
        $("#processTCC").hide();
        $("#assignTCC").show();
        $("#allTCC").show();
    }
};