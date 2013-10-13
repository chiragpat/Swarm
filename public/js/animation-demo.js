/* global document, Ship, Kinetic, $$, window, Planet */
$$(document).ready(function () {
  'use strict';
  var moveShip, env, stage, layer, shipLayer, planet, planet2, planet3, planet4, planet5, planet6, planet7, planets, layer2, layer3, layer4;
  env = $$.environment();
  window.__uname = '';

  stage = new Kinetic.Stage({
    container: 'container',
    width: env.screen.width - 100,
    height: env.screen.height - 100
  });

  layer = new Kinetic.Layer();
  layer2 = new Kinetic.Layer();
  layer3 = new Kinetic.Layer();
  layer4 = new Kinetic.Layer();
  shipLayer = new Kinetic.Layer();

  planet = new Planet({
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
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

  planet4 = new Planet({
    x: 350,
    y: 100,
    numShips: 5,
    layer: layer4
  });

  planet5 = new Planet({
    x: 75,
    y: 100,
    numShips: 5,
    layer: layer4
  });

  planet6 = new Planet({
    x: 150,
    y: 125,
    numShips: 5,
    layer: layer4
  });

  planet7 = new Planet({
    x: 50,
    y: 250,
    numShips: 5,
    layer: layer4
  });

  planets = [planet, planet2, planet3, planet4, planet5, planet6, planet7];

  moveShip = new Ship();
  shipLayer.add(moveShip.kineticShape);
  stage.add(layer);
  stage.add(layer2);
  stage.add(layer3);
  stage.add(layer4);
  stage.add(shipLayer);

  moveShip.infiniteRandomMove();
});
