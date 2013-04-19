$$(document).ready(function(){
  var moveShip, env, stage, layer, shipLayer, planet, planet2, layer2, selected = null;
  env = $$.environment();

  stage = new Kinetic.Stage({
    container: 'container',
    width: env.screen.width-100,
    height: env.screen.height-100
  });

  layer = new Kinetic.Layer();
  layer2 = new Kinetic.Layer();
  layer3 = new Kinetic.Layer();
  shipLayer = new Kinetic.Layer();

  planet = new Planet({
    x: stage.getWidth()/2,
    y: stage.getHeight()/2,
    numShips: 5,
    layer: layer
  });

  planet2 = new Planet({
    x: 150,
    y: 150,
    numShips: 5,
    layer: layer2
  });

  planet3 = new Planet({
    x: 350,
    y: 350,
    numShips: 5,
    layer: layer3
  });

  var j = 0;
  // var interval = setInterval(function(){
  //   if (j > 11) {
  //     clearInterval(interval);
  //   }
  //   planet.addNewShip(new Ship({
  //     x: Math.floor(Math.random()*stage.getWidth()),
  //     y: Math.floor(Math.random()*stage.getHeight()),
  //     rotationRadius: 0
  //   }));
  //   // planet.addNewShip();
  //   j++;
  // }, 5000);
  // 
  // setTimeout(function(){
  //   planet.moveShipsTo(planet2);
  // }, 5000);

  planet.kineticShape.on('tap click', function() {
    if (selected) {
      selected.moveShipsTo(planet);
      selected.kineticShape.setFill('');
      planet.kineticShape.setFill('');
      selected = null;
    }
    else {
      selected = planet;
      planet.kineticShape.setFill('#4eba53');
    }
  });

  planet2.kineticShape.on('tap click', function() {
    if (selected) {
      selected.moveShipsTo(planet2);
      selected.kineticShape.setFill('');
      planet2.kineticShape.setFill('');
      selected = null;
    }
    else {
      selected = planet2;
      planet2.kineticShape.setFill('#4eba53');
    }
  });

  planet3.kineticShape.on('tap click', function() {
    if (selected) {
      selected.moveShipsTo(planet3);
      selected.kineticShape.setFill('');
      planet3.kineticShape.setFill('');
      selected = null;
    }
    else {
      selected = planet3;
      planet3.kineticShape.setFill('#4eba53');
    }
  });

  moveShip = new Ship();
  shipLayer.add(moveShip.kineticShape);
  stage.add(layer);
  stage.add(layer2);
  stage.add(layer3);
  stage.add(shipLayer);

  moveShip.infiniteRandomMove();
});