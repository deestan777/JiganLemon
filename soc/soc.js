$(document).ready(function() {
    setTimeout(function() {
        $.get("/soc/soc.txt", function(data) {
            var container = $("#soc");
            container.html(data);
        }, "text");
    }, 666);
});