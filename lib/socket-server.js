
var socketServer = function(server){
  var io = require('socket.io').listen(server);
  // Dont log debug information logging slows down the transmission
  io.set('log level', 2);

  io.sockets.on('connection', function (socket) {
    console.log('New Socket Connected');

    socket.on('disconnect', function(data) {
      console.log('Socket Disconnected');
    });
  });
};


module.exports = socketServer;