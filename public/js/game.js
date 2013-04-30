$$(document).ready(function(){
  var stage, layers = [], planets = [], env, gameId;

  var socket = io.connect();
  window.gameId = window.location.pathname.split( '/' )[2];

  stage = new Kinetic.Stage({
    container: 'game-container',
    width: 800,
    height: 600
  });

  var owner2 = "";
  var blue_count = 0;
  var red_count = 0;

  for (var i = 0; i < __planets.length; i++) {
    var color = '';
    if(__planets[i].owner === __uname) {
      color = 'blue';
      blue_count++;
    }
    else if(__planets[i].owner !== "") {
      owner2 = __planets[i].owner;
      color = 'red';
      red_count++;
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

  var owners = {};
  owners[__uname] = {
    count: blue_count,
    color: 'blue' 
  };
  owners[owner2] = {
    count: red_count,
    color: 'red' 
  };

  leaderboard = new Leaderboard({
    stage: stage,
    total: __planets.length,
    owners: owners
  });

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