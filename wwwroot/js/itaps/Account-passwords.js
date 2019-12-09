$(document).ready(function () {
    //toggle password type format
    $(".switchPass").click(function () {
        var type = $(this).closest(".input-group").children("input").prop("type");
        $(this).closest(".input-group").children("input").prop("type", type === "text" ? "password" : "text");
    });
});
