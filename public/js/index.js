$$(document).ready(function(){
  var slider, validateUserName, validatePassword, validateForm;

  slider = new Swipe(document.getElementById('slider'), {
    speed: 400,
    startSlide: 1,
    continuous: false
  });

  validateUserName = function(uname) {
    var unameRegex = /^[a-z0-9]([a-z0-9_-]{2,15})$/;
    return unameRegex.test(uname);
  };

  validatePassword = function(pwd, cpwd) {
    var pwdRegex = /^[A-Za-z0-9\.\_\-\$]{3,18}$/;
    if (cpwd === undefined || cpwd === null) {
      cpwd = pwd;
    }

    return pwdRegex.test(pwd) && pwdRegex.test(cpwd) && pwd === cpwd;
  };

  validateForm = function($$uname, $$pwd, $$cpwd) {
    if (!$$cpwd) {
      $$cpwd = $$pwd;
    }
    var uname         = $$uname.val(),
        pwd           = $$pwd.val(),
        cpwd          = $$cpwd.val(),
        validUserName = validateUserName(uname),
        validPassword = validatePassword(pwd, cpwd),
        valid         = true;

    $$uname.removeClass('error');
    $$pwd.removeClass('error');
    $$cpwd.removeClass('error');
    $$uname.siblings('div.error').remove();

    if (!validUserName) {
      $$uname.addClass('error');
      valid = false;
    }

    if (!validPassword) {
      $$pwd.addClass('error');
      $$cpwd.addClass('error');
      valid = false;
    }

    return valid;
  };

  $$('[data-slide]').on('tap', function(e) {
    e.preventDefault();
    var slide_no = $$(this).data('slide');
    slider.slide(slide_no);
  });

  $$('.login').on('tap', function(e){
    var $$uname       = $$('.login-container [name="uname"]'),
        $$pwd         = $$('.login-container [name="pwd"]');

    if (validateForm($$uname, $$pwd)) {
      $$.post('/login',
        {uname: $$uname.val(), pwd: $$pwd.val()},
        function(data){
          if (!data.error) {
            location.reload();
          }
          else {
            $$error = $$('<div class="error"></div>');
            $$error.text(data.error);
            $$('.login-container').prepend($$error);
          }
        });
    }

    e.preventDefault();
  });

  $$('.register').on('tap', function(e) {
    var $$uname       = $$('.register-container [name="uname"]'),
        $$pwd         = $$('.register-container [name="pwd"]'),
        $$cpwd        = $$('.register-container [name=cpwd]');

    if (validateForm($$uname, $$pwd, $$cpwd)) {
      $$.post('/register',
        {uname: $$uname.val(), pwd: $$pwd.val()},
        function(data){
          if (!data.error) {
            location.reload();
          }
          else {
            $$error = $$('<div class="error"></div>');
            $$error.text(data.error);
            $$('.register-container').prepend($$error);
          }
        }
      );
    }

    e.preventDefault();
  });

});