$$(document).ready(function(){
  var moveShip;
  var env = $$.environment();

  var stage = new Kinetic.Stage({
    container: 'container',
    width: env.screen.width-100,
    height: env.screen.height-100
  });

  var layer = new Kinetic.Layer();

  var circle = new Kinetic.Circle({
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
    radius: 30,
    stroke: 'black',
    strokeWidth: 3
  });

  var shipObj = {
    drawFunc: function(canvas) {
      var context = canvas.getContext();
      x = this.attrs.rotationRadius;
      y = 0;
      var length = this.attrs.length;
      var width = this.attrs.width;
      context.beginPath();
      //Draw the actual ship
      context.moveTo(x, y);
      context.lineTo(x-width/2, y+length/5);
      context.lineTo(x,y-4*length/5);
      context.lineTo(x+width/2, y+length/5);
      context.lineTo(x, y);
      context.closePath();
      canvas.fillStroke(this);
    },
    x: circle.getX(),
    y: circle.getY(),
    length: 3,
    width: 3,
    fill: 'black',
    stroke: 'black',
    strokeWidth: 2,
    rotationRadius: 1.5*circle.getRadius(),
    location: {}
  };

  var shipMovingObj = {
    drawFunc: function(canvas) {
      var context = canvas.getContext();
      x = 0;
      y = -4*this.attrs.length/5;

      var length = this.attrs.length;
      var width = this.attrs.width;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x-width/2, y+length);
      context.lineTo(x, y+length-length/5);
      context.lineTo(x+width/2, y+length);
      context.lineTo(x, y);
      context.closePath();
      canvas.fillStroke(this);
    },

    x: (circle.getX() - 3*circle.getRadius()),
    y: circle.getY(),
    length: 3,
    width: 3,
    fill: 'black',
    stroke: 'black',
    strokeWidth: 2
  };

  ships = [];
  angle = Math.PI/9;

  for (var i = 0; i < 15; i++) {
    var temp_ship = new Kinetic.Shape(shipObj);
    temp_ship.rotate(angle*i);
    temp_ship.attrs.location = {
      x: temp_ship.getX() + (temp_ship.attrs.rotationRadius * Math.cos(temp_ship.getRotation())),
      y: temp_ship.getY() + (temp_ship.attrs.rotationRadius * Math.sin(temp_ship.getRotation()))
    };
    ships.push(temp_ship);
    layer.add(temp_ship);
  }

  var moving_ship = new Kinetic.Shape(shipMovingObj);

  layer.add(moving_ship);
  layer.add(circle);
  stage.add(layer);

  var angularSpeed = Math.PI / 12;
  var j = 0;
  var ptx = Math.floor(Math.random()*stage.getWidth());
  var pty = Math.floor(Math.random()*stage.getHeight());
  var anim = new Kinetic.Animation(function(frame) {
    var angleDiff = frame.timeDiff * angularSpeed / 1000;

    if (ships[0] && Math.round(ships[0].attrs.location.x) == circle.getX() &&
        Math.round(ships[0].attrs.location.y) == circle.getY() - ships[0].attrs.rotationRadius){
      var t_ship = ships[0];
      t_ship.attrs.rotationRadius = 0;
      t_ship.attrs.x = t_ship.attrs.location.x;
      t_ship.attrs.y = t_ship.attrs.location.y;
      ships.splice(0, 1);

      var test = function(x, y, thetaDur){
        if (!x) {
          x = Math.floor(Math.random()*stage.getWidth());
        }

        if (!y) {
          y = Math.floor(Math.random()*stage.getHeight());
        }

        moveShip(t_ship, {x: x, y: y}, thetaDur, test);
      };
      test(ptx, pty, 0.1);
    }
    circle.rotate(angleDiff);
    for (var i = 0; i < ships.length; i++) {
      ships[i].rotate(-2*angleDiff);
      ships[i].attrs.location = {
        x: ships[i].getX() + (ships[i].attrs.rotationRadius * Math.cos(ships[i].getRotation())),
        y: ships[i].getY() + (ships[i].attrs.rotationRadius * Math.sin(ships[i].getRotation()))
      };
    }

  }, layer);

  function infiniteMove(x, y){
    if (!x) {
      x = Math.floor(Math.random()*stage.getWidth());
    }

    if (!y) {
      y = Math.floor(Math.random()*stage.getHeight());
    }
    moveShip(moving_ship, {x: x, y: y}, null,
             infiniteMove);
  }
  setTimeout(function(){
    infiniteMove();
  }, 1000);

  anim.start();

  moveShip = function(ship, pt, thetaDur, cb) {
    var shipVector = {x: 0, y: -1};
    var ptVector = {x: pt.x-ship.getX(), y: pt.y-ship.getY()};

    var theta = Math.acos((shipVector.x*ptVector.x+shipVector.y*ptVector.y)/(Math.sqrt(ptVector.x*ptVector.x+ptVector.y*ptVector.y)));

    if (!thetaDur) {
      thetaDur = 1;
    }
    if (pt.x <= ship.getX()) {
      theta = -theta;
    }

    ship.transitionTo({
      rotation: theta,
      duration: thetaDur,

      callback: function(){
        ship.transitionTo({
          x: pt.x,
          y: pt.y,
          duration: 2,
          easing: "ease-in-out",
          callback: cb
        });
      }
    });
  };
});