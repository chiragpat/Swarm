/* global document, Kinetic, $$, Swipe, window, Ship */
$$(document).ready(function () {
  'use strict';
  var slider, validateUserName, validatePassword, validateForm;

  slider = new Swipe(document.getElementById('slider'), {
    speed: 400,
    startSlide: 1,
    continuous: false
  });

  validateUserName = function (uname) {
    var unameRegex = /^[a-z0-9]([a-z0-9_-]{2,15})$/;
    return unameRegex.test(uname);
  };

  validatePassword = function (pwd, cpwd) {
    var pwdRegex = /^[A-Za-z0-9\.\_\-\$]{3,18}$/;
    if (cpwd === undefined || cpwd === null) {
      cpwd = pwd;
    }

    return pwdRegex.test(pwd) && pwdRegex.test(cpwd) && pwd === cpwd;
  };

  validateForm = function ($$uname, $$pwd, $$cpwd) {
    if (!$$cpwd) {
      $$cpwd = $$pwd;
    }
    var uname = $$uname.val(),
        pwd = $$pwd.val(),
        cpwd = $$cpwd.val(),
        validUserName = validateUserName(uname),
        validPassword = validatePassword(pwd, cpwd),
        valid = true;

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

  $$('[data-slide]').on('tap', function (e) {
    e.preventDefault();
    var slideNo = $$(this).data('slide');
    slider.slide(slideNo);
  });

  $$('.login-container form').on('submit', function (e) {
    e.preventDefault();
    var $$uname = $$('.login-container [name="uname"]'),
        $$pwd = $$('.login-container [name="pwd"]');

    if (validateForm($$uname, $$pwd)) {
      $$.post('/login',
        {uname: $$uname.val(), pwd: $$pwd.val()},
        function (data) {
          if (!data.error) {
            window.location.reload();
          }
          else {
            var $$error = $$('<div class="error"></div>');
            $$error.text(data.error);
            $$('.login-container').prepend($$error);
          }
        });
    }
  });

  $$('.register-container form').on('submit', function (e) {
    var $$uname = $$('.register-container [name="uname"]'),
        $$pwd = $$('.register-container [name="pwd"]'),
        $$cpwd = $$('.register-container [name=cpwd]');

    if (validateForm($$uname, $$pwd, $$cpwd)) {
      $$.post('/register',
        {uname: $$uname.val(), pwd: $$pwd.val()},
        function (data) {
          if (!data.error) {
            window.location.reload();
          }
          else {
            var $$error = $$('<div class="error"></div>');
            $$error.text(data.error);
            $$('.register-container').prepend($$error);
          }
        }
      );
    }

    e.preventDefault();
  });

  var env, stage, layer, ships = [], numShips, i;

  env = $$.environment();
  stage = new Kinetic.Stage({
    container: 'moving-ships',
    width: env.screen.width - 15,
    height: env.screen.height - 15
  });

  layer = new Kinetic.Layer();

  numShips = 8;
  for (i = 0; i < numShips; i++) {
    var ship = new Ship({
      x: Math.floor(Math.random() * stage.getWidth()),
      y: Math.floor(Math.random() * stage.getHeight()),
      length: 15,
      width: 15
    });

    layer.add(ship.kineticShape);
    stage.add(layer);
    ships.push(ship);
    ship.infiniteRandomMove({
      moveDur: 1.25,
      easing: 'linear'
    });
  }


});
