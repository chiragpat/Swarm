$$(document).ready(function(){
  var stage, layers = [], planets = [], env, gameId, setupGame;

  var socket = io.connect();
  window.gameId = window.location.pathname.split( '/' )[2];

  setupGame = function() {
    $$('.wait').remove();
    stage = new Kinetic.Stage({
      container: 'game-container',
      width: 800,
      height: 600
    });

    var owner2 = "";
    var blueCount = 0;
    var redCount = 0;

    for (var i = 0; i < __planets.length; i++) {
      var color = '';
      if(__planets[i].owner === __uname) {
        color = 'blue';
        blueCount++;
      }
      else if(__planets[i].owner !== "") {
        owner2 = __planets[i].owner;
        color = 'red';
        redCount++;
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
      count: blueCount,
      color: 'blue'
    };
    owners[owner2] = {
      count: redCount,
      color: 'red'
    };

    leaderboard = new Leaderboard({
      stage: stage,
      total: __planets.length,
      owners: owners
    });

  };

  socket.on('connect', function(data) {
    console.log('Socket Connected');
    if (players.indexOf("AI") != -1) {
      socket.emit('Joint Game', {id: window.gameId, practice: true});
    }
    else {
      socket.emit('Joint Game', {id: window.gameId, practice: false});
    }

  });

  socket.on('ready', function(data) {
    setupGame();
  });

  socket.on('New Ship', function(data) {
    for (var i = 0; i < planets.length; i++) {
      if(planets[i].owner !== "" && planets[i].ships.length < planets[i].cap) {
        planets[i].addNewShip();
      }
    }
  });

  socket.on('Sent Ships', function(data) {
    planets[data.from].moveShipsTo(planets[data.to], function() {
      planets[data.to].kineticShape.setStroke(planets[data.to].stroke);
      planets[data.from].kineticShape.setStroke(planets[data.from].stroke);
      if (Planet.selected == planets[data.from]) {
        Planet.selected = null;
        Planet.moving = null;
      }
    });
  });

});