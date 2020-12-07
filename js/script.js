/*$(function(){

    $('#contact-form').submit( function(e) {

        e.prevendDefault();
        $('.comments').empty();

        var postData = $('#contact-form').serialize();

        $.ajax({
            type: 'POST',
            url: 'php/contact.php',
            data: postData,
            dataType: 'json',
            success: function(result){

                if(result.isSuccess){
                    $('#contact-form').append("<p class='thank-you'> Votre message a bien été envoyé. Merci de m'avoir contacté ! </p>");
                    $('#contact-form')[0].reset();
                }
                else{
                    $('#firstname + .comments').html(result.firstnameError);
                    $('#name + .comments').html(result.nameError);
                    $('#email + .comments').html(result.emailError);
                    $('#phone + .comments').html(result.phoneError);
                    $('#message + .comments').html(result.messageError);
                }
            }
        })
    });
});*/

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
};
