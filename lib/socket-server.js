var searchRoom = '__SEARCHROOM';
var games = require('./routes/games.js');

var socketServer = function(server){
  var io = require('socket.io').listen(server);
  // Dont log debug information logging slows down the transmission
  io.set('log level', 0);

  io.sockets.on('connection', function (socket) {
    console.log('New Socket Connected');

    socket.on('Search', function(data){
      var uname = data.uname;
      if (io.sockets.clients(searchRoom).length) {
        var opponentSocket = io.sockets.clients(searchRoom)[0];
        opponentSocket.leave(searchRoom);
        opponentSocket.get('uname', function(err, opponentUname){
          socket.emit('Player Found', {uname: opponentUname});
          opponentSocket.emit('Player Found', {uname: uname});
          games.createGame([opponentUname, uname], function(err, game){
            if (!err) {
              socket.emit('Game Created', {url: '/game/'+game._id});
              opponentSocket.emit('Game Created', {url: '/game/'+game._id});
            }
          });
        });
      }
      else {
        socket.join(searchRoom);
        socket.set('uname', uname);
      }
    });


    socket.on('Joint Game', function(data) {
      socket.join(data.id);
      if (io.sockets.clients(data.id).length == 2 || data.practice) {
        var interval = setInterval(function(){
          io.sockets.in(data.id).emit('New Ship');
        }, 10000);

        io.sockets.in(data.id).interval = interval;
        io.sockets.in(data.id).emit('ready');
      }
    });

    socket.on('Sent Ships', function(data) {
      io.sockets.in(data.id).emit('Sent Ships', data);
    });

    socket.on('disconnect', function(data) {
      clearInterval(io.sockets.in(data.id).interval);
      socket.leave(searchRoom);
    });

  });
};


module.exports = socketServer;