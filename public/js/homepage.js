console.log("Connected");
document.addEventListener("DOMContentLoaded", function () {
  $("#loginheadbtn").click(function () {
    if (!$(this).hasClass("active")) {
      $("#loginform").show();
      $("#registerform").hide();
      $(this).addClass("active");
      $("#registerheadbtn").removeClass("active");
    }
    console.log("Login");
  });

  $("#registerheadbtn").click(function () {
    if (!$(this).hasClass("active")) {
      $("#loginform").hide();
      $("#registerform").show();
      $(this).addClass("active");
      $("#loginheadbtn").removeClass("active");
    }
  });
});
