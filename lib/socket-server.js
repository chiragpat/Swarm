/*eslint no-underscore-dangle:0*/
'use strict';

var searchRoom = '__SEARCHROOM';
var games = require('./routes/games.js');

var handleError = function (socket, error) {
  socket.emit('error', error);
};

var socketServer = function (server) {
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function (socket) {
    console.log('New Socket Connected');

    socket.on('Search', function (data) {
      var uname = data.uname;
      io.of('/').in(searchRoom).clients((err, clients) => {
        if (err) {
          throw err;
        }

        if (clients.length) {
          var opponentSocket = io.sockets.connected[clients[0]];
          opponentSocket.leave(searchRoom);
          socket.emit('Player Found', {uname: opponentSocket.uname});
          opponentSocket.emit('Player Found', {uname: uname});
          games.createGame([opponentSocket.uname, uname], function (createErr, game) {
            if (err) {
              handleError(socket, createErr);
            }
            else {
              socket.emit('Game Created', {url: '/game/' + game._id});
              opponentSocket.emit('Game Created', {url: '/game/' + game._id});
            }
          });
        } else {
          socket.join(searchRoom);
          socket.uname = uname;
        }
      });
    });


    socket.on('Joint Game', function (data) {
      socket.join(data.id);
      io.of('/').in(data.id).clients((err, clients) => {
        if (clients.length === 2 || data.practice) {
          var interval = setInterval(function () {
            io.to(data.id).emit('New Ship');
          }, 10000);

          // io.sockets.in(data.id).interval = interval;
          io.to(data.id).emit('ready');
        }
      });
    });

    socket.on('Sent Ships', function (data) {
      io.to(data.id).emit('Sent Ships', data);
    });

    // socket.on('disconnect', function (data) {
    //   if (data && data.id) {
    //     clearInterval(io.sockets.in(data.id).interval);
    //   }
    //   socket.leave(searchRoom);
    // });

  });
};


module.exports = socketServer;
