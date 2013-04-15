$$(document).ready(function(){
  var moveShip;

  var stage = new Kinetic.Stage({
    container: 'container',
    width: 578,
    height: 200
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
      context.lineTo(x-width/2, y+length);
      context.lineTo(x, y+length-length/5);
      context.lineTo(x+width/2, y+length);
      context.lineTo(x, y);
      context.closePath();
      canvas.fillStroke(this);
    },
    x: circle.getX(),
    y: circle.getY(),
    length: 3,
    width: 3,
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 2,
    rotationRadius: 1.5*circle.getRadius()
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
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 2
  };

  ships = [];
  angle = Math.PI/10;

  for (var i = 0; i < 5; i++) {
    var temp_ship = new Kinetic.Shape(shipObj);
    temp_ship.rotate(angle*i);
    ships.push(temp_ship);
    layer.add(temp_ship);
  }

  var moving_ship = new Kinetic.Shape(shipMovingObj);

  layer.add(moving_ship);
  layer.add(circle);
  stage.add(layer);

  var angularSpeed = Math.PI / 12;
  var j = 0;
  var anim = new Kinetic.Animation(function(frame) {
    var angleDiff = frame.timeDiff * angularSpeed / 1000;
    circle.rotate(angleDiff);
    for (var i = 0; i < ships.length; i++) {
      ships[i].rotate(-2*angleDiff);
    }

  }, layer);

  function infiniteMove(){
    moveShip(moving_ship, {x: Math.floor(Math.random()*stage.getWidth()), y: Math.floor(Math.random()*stage.getHeight())},
             infiniteMove);
  }
  setTimeout(function(){
    infiniteMove();
  }, 1000);

  anim.start();

  moveShip = function(ship, pt, cb) {
    var shipVector = {x: 0, y: -1};
    var ptVector = {x: pt.x-ship.getX(), y: pt.y-ship.getY()};

    var theta = Math.acos((shipVector.x*ptVector.x+shipVector.y*ptVector.y)/(Math.sqrt(ptVector.x*ptVector.x+ptVector.y*ptVector.y)));

    if (pt.x <= ship.getX()) {
      theta = -theta;
    }

    ship.transitionTo({
      rotation: theta,
      duration: 1,

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