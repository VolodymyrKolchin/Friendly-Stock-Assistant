var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

$('.accordion').click(function(){
    $(this).toggleClass('active');
    $(this).parent().find('.view').toggleClass('arrow-animate');
});

$(function(){
    $(".fold-table tr.view").on("click", function(){
      $(this).toggleClass("open").next(".fold").toggleClass("open");
    });
  });