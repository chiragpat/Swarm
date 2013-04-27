$$(document).ready(function(){
  var stage, layers = [], planets = [], env, gameId;

  var socket = io.connect();
  window.gameId = window.location.pathname.split( '/' )[2];

  stage = new Kinetic.Stage({
    container: 'game-container',
    width: 800,
    height: 600
  });

  for (var i = 0; i < __planets.length; i++) {
    var color = '';
    if(__planets[i].owner === __uname) {
      color = 'blue';
    }
    else if(__planets[i].owner !== "") {
      color = 'red';
    }
    var layer = new Kinetic.Layer();
    var planet = new Planet({
      x: __planets[i].position.x,
      y: __planets[i].position.y,
      numShips: __planets[i].population,
      layer: layer,
      color: color,
      owner: __planets[i].owner,
      cap: __planets[i].cap,
      index: i,
      socket: socket
    });
    layers.push(layer);
    planets.push(planet);
    stage.add(layer);
  }

  setInterval(function(){
    for (var i = 0; i < planets.length; i++) {
      if(planets[i].owner !== "" && planets[i].ships.length < planets[i].cap) {
        planets[i].addNewShip();
      }
    }
  }, 15000);

  socket.on('connect', function(data){
    console.log('Socket Connected');
    socket.emit('Joint Game', {id: window.gameId});
  });

  socket.on('Sent Ships', function(data) {
    planets[data.from].moveShipsTo(planets[data.to], function() {
      planets[data.to].kineticShape.setStroke(planets[data.to].stroke);
    });
  });
});