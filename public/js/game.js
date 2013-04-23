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
      x: __planets[i].position.x,
      y: __planets[i].position.y,
      numShips: __planets[i].population,
      layer: layer
    });
    console.log("X: "+__planets[i].position.x+" Y: "+__planets[i].position.y);
    layers.push(layer);
    planets.push(planet);
    stage.add(layer);
  }

});