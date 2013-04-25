$$(document).ready(function(){
  var stage, layers = [], planets = [], env;

  stage = new Kinetic.Stage({
    container: 'game-container',
    width: 800,
    height: 600
  });

  for (var i = 0; i < __planets.length; i++) {
    var color = "";
    if(__planets[i].owner === __uname) {
      color = "blue";
    }
    else if(__planets[i].owner !== "") {
      color = "red";
    }
    var layer = new Kinetic.Layer();
    var planet = new Planet({
      x: __planets[i].position.x,
      y: __planets[i].position.y,
      numShips: __planets[i].population,
      layer: layer,
      color: color,
      owner: __planets[i].owner
    });
    console.log("X: "+__planets[i].position.x+" Y: "+__planets[i].position.y);
    console.log(__planets[i].owner);
    layers.push(layer);
    planets.push(planet);
    stage.add(layer);
  }

  setInterval(function(){
    for (var i = 0; i < planets.length; i++) {
      if(planets[i].owner !== "") {
        planets[i].addNewShip();
      }
    }
  }, 5000);

});