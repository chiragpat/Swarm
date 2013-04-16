$$(document).ready(function(){
  var moveShip, env, stage, layer, shipLayer, circle;
  env = $$.environment();

  stage = new Kinetic.Stage({
    container: 'container',
    width: env.screen.width-100,
    height: env.screen.height-100
  });

  layer = new Kinetic.Layer();
  shipLayer = new Kinetic.Layer();

  circle = new Kinetic.Circle({
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
    radius: 30,
    stroke: 'black',
    strokeWidth: 3
  });

  moveShip = new Ship();
  shipLayer.add(moveShip.kineticShape);
  stage.add(shipLayer);

  moveShip.infiniteRandomMove();
});