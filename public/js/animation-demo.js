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
      length = this.attrs.length;
      width = this.attrs.width;
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

  ships = [];
  angle = Math.PI/10;

  for (var i = 0; i < 5; i++) {
    var ship = new Kinetic.Shape(shipObj);
    ship.rotate(angle*i);
    ships.push(ship);
    layer.add(ship);
  }

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

  anim.start();
});