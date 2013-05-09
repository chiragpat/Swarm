var searchRoom = '__SEARCHROOM';
var games = require('./routes/games.js');

var socketServer = function(server){
  var io = require('socket.io').listen(server);
  // Dont log debug information logging slows down the transmission
  io.set('log level', 2);

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
      console.log(data);
      socket.join(data.id);
    });

    socket.on('Sent Ships', function(data) {
      console.log(data);
      socket.broadcast.to(data.id).emit('Sent Ships', data);
    });

    socket.on('disconnect', function(data) {
      socket.leave(searchRoom);
      console.log('Socket Disconnected');
    });

    // socket.on('sendShips', function(data){

    // });
  });
};


module.exports = socketServer;