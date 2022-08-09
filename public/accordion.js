var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        console.log('this.', this);
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
    // console.log('$(this)', $(this));
    // console.log('$(this).parent()', $(this).parent())
    $(this).parent().find('.view').toggleClass('arrow-animate');
    // $(this).parent().find('.content').slideToggle(280);
});

$(function(){
    $(".fold-table tr.view").on("click", function(){
      $(this).toggleClass("open").next(".fold").toggleClass("open");
    });
  });