/*eslint no-underscore-dangle:0,no-new:0*/
/* global document, Kinetic, $$, window, io, Planet, console */
$$(document).ready(function () {
  'use strict';

  var stage, layer;
  var socket = io.connect();

  stage = new Kinetic.Stage({
    container: 'spinner-container',
    width: 300,
    height: 300
  });

  layer = new Kinetic.Layer();
  new Planet({
    x: 150,
    y: 150,
    layer: layer,
    numShips: 20,
    radius: 70,
    shipSize: 7
  });

  stage.add(layer);

  socket.on('connect', function () {
    console.log('Connection Established Searching');
    socket.emit('Search', {uname: window.__uname});
  });

  socket.on('Player Found', function (data) {
    console.log('Player Found: ', data.uname);
  });

  socket.on('Game Created', function (data) {
    console.log('Game Created Redirecting');
    window.location.href = data.url;
  });
});
