$$(document).ready(function(){
  var stage, layers = [], planets = [], env;

  stage = new Kinetic.Stage({
    container: 'game-container',
    width: 800,
    height: 600
  });

  for (var i = 0; i < __planets.length; i++) {
    var layer = new Kinetic.Layer();
    var planet = new Planet({
      x: __planets[i].position.x * stage.getWidth() * 1 / 25,
      y: __planets[i].position.y * stage.getHeight() * 1 / 20,
      numShips: 5,
      layer: layer,
      radius: 35
    });
    console.log("X: " + x + " Y: " + y);
    layers.push(layer);
    planets.push(planet);
    stage.add(layer);
  }

});