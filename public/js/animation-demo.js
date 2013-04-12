$$(document).ready(function(){
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
      x = 1.5*circle.getRadius();
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
    strokeWidth: 2
  };

  var shipMovingObj = {
    drawFunc: function(canvas) {
      var context = canvas.getContext();
      x = 0;
      y = 0;

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
  var anim = new Kinetic.Animation(function(frame) {
    var angleDiff = frame.timeDiff * angularSpeed / 1000;
    circle.rotate(angleDiff);
    for (var i = 0; i < ships.length; i++) {
      ships[i].rotate(-2*angleDiff);
    }
  }, layer);

  setTimeout(function(){

    moving_ship.transitionTo({
      rotation: Math.PI/4,
      duration: 1,

      callback: function(){
        moving_ship.transitionTo({
          x: circle.getX(),
          y: circle.getY() - 3*circle.getRadius(),
          duration: 2
        });
      }
    });
  }, 1000);

  anim.start();
});