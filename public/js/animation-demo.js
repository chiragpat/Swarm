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

  planet = new Planet({
    x: stage.getWidth()/2,
    y: stage.getHeight()/2,
    numShips: 0,
    layer: layer
  });

  var j = 0;
  var interval = setInterval(function(){
    if (j > 11) {
      clearInterval(interval);
    }
    planet.addNewShip(new Ship({
      x: Math.floor(Math.random()*stage.getWidth()),
      y: Math.floor(Math.random()*stage.getHeight()),
      rotationRadius: 0
    }));
    j++;
  }, 1000);

  moveShip = new Ship();
  shipLayer.add(moveShip.kineticShape);
  stage.add(layer);
  stage.add(shipLayer);

  moveShip.infiniteRandomMove();
});