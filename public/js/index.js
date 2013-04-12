$$(document).ready(function(){
  var slider = new Swipe(document.getElementById('slider'), {
    speed: 400,
    startSlide: 1
  });

  $$('[data-slide]').on('tap', function(e) {
    var slide_no = $$(this).data('slide');
    e.preventDefault();
    slider.slide(slide_no);
  });

});