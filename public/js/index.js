$$(document).ready(function(){
  var slider = new Swipe(document.getElementById('slider'), {
    speed: 400,
    startSlide: 1,
    continuous: false
  });

  $$('[data-slide]').on('tap', function(e) {
    e.preventDefault();
    var slide_no = $$(this).data('slide');
    slider.slide(slide_no);
  });

});