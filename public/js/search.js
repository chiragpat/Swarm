$$(document).ready(function(){
  var env, stage, layer, ships = [], num_ships, i;

  env = $$.environment();

  console.log('Connecting');
  var socket = io.connect();

  stage = new Kinetic.Stage({
    container: 'spinner-container',
    width: 300,
    height: 300
  });

  layer = new Kinetic.Layer();
  planet = new Planet({
    x: 150,
    y: 150,
    layer: layer,
    numShips: 20,
    radius: 70,
    shipSize: 7
  });

  stage.add(layer);

  socket.on('connect', function(data){
    console.log('Connection Established Searching');
    socket.emit('Search', {uname: __uname});
  });

  socket.on('Player Found', function(data){
    console.log('Player Found: ', data.uname);
  });

  socket.on('Game Created', function(data){
    console.log('Game Created Redirecting');
    window.location.href = data.url;
  });
});