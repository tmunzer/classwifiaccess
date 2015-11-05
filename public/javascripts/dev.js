$(document).ready(
    socket.on("dev", "req", function(device){
        var apString = "";
        for (var param in device) {
            apString += param + ": " + device[param] + "</br>";
        }
        $("#test").append("<article style='float:left; width:30%;'>" + apString + '</article>');
    })
);

$('#apiList:checkbox').change(function(){
    alert(this.value);
});
