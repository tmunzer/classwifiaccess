$("#password").change(function(){
    if ($("#password").val().length == 0){
        $("#confirm_password_field").val("");
    } else {
        if ($("#password").val() != $("#confirm_password").val()) {
            document.getElementById("confirm_password").setCustomValidity("Passwords Don't Match");
        } else {
            document.getElementById("confirm_password").setCustomValidity('');
        }
    }
});
$("#confirm_password").change(function(){
    if ($("#password").val() != $("#confirm_password").val()) {
        document.getElementById("confirm_password").setCustomValidity("Passwords Don't Match");
    } else {
        document.getElementById("confirm_password").setCustomValidity('');
    }
});




