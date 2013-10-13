/* global document, Kinetic, $$, window, Planet, io, Leaderboard */
$$(document).ready(function () {
  'use strict';
  var stage, layers = [], planets = [], setupGame;

  var socket = io.connect();
  window.gameId = window.location.pathname.split('/')[2];

  setupGame = function () {
    $$('.wait').remove();
    stage = new Kinetic.Stage({
      container: 'game-container',
      width: 800,
      height: 600
    });

    var owner2 = '';
    var blueCount = 0;
    var redCount = 0;

    for (var i = 0; i < window.__planets.length; i++) {
      var color = '';
      if (window.__planets[i].owner === window.__uname) {
        color = 'blue';
        blueCount++;
      }
      else if (window.__planets[i].owner !== '') {
        owner2 = window.__planets[i].owner;
        color = 'red';
        redCount++;
      }
      var layer = new Kinetic.Layer();
      var planet = new Planet({
        x: window.__planets[i].position.x,
        y: window.__planets[i].position.y,
        numShips: window.__planets[i].population,
        layer: layer,
        color: color,
        owner: window.__planets[i].owner,
        cap: window.__planets[i].cap,
        index: i,
        socket: socket
      });
      layers.push(layer);
      planets.push(planet);
      stage.add(layer);
    }

    var owners = {};
    owners[window.__uname] = {
      count: blueCount,
      color: 'blue'
    };
    owners[owner2] = {
      count: redCount,
      color: 'red'
    };

    window.leaderboard = new Leaderboard({
      stage: stage,
      total: window.__planets.length,
      owners: owners
    });

  };

  socket.on('connect', function () {
    if (window.players.indexOf('AI') !== -1) {
      socket.emit('Joint Game', {id: window.gameId, practice: true});
    }
    else {
      socket.emit('Joint Game', {id: window.gameId, practice: false});
    }

  });

  socket.on('ready', function () {
    setupGame();
  });

  socket.on('New Ship', function () {
    for (var i = 0; i < planets.length; i++) {
      if (planets[i].owner !== '' && planets[i].ships.length < planets[i].cap) {
        planets[i].addNewShip();
      }
    }
  });

  socket.on('Sent Ships', function (data) {
    planets[data.from].moveShipsTo(planets[data.to], function () {
      planets[data.to].kineticShape.setStroke(planets[data.to].stroke);
      planets[data.from].kineticShape.setStroke(planets[data.from].stroke);
      if (Planet.selected === planets[data.from]) {
        Planet.selected = null;
        Planet.moving = null;
      }
    });
  });

});