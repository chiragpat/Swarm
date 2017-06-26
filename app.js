'use strict';
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./lib/routes'),
    players = require('./lib/routes/players'),
    games = require('./lib/routes/games'),
    http = require('http'),
    path = require('path'),
    socketServer = require('./lib/socket-server');

var dust = require('consolidate').dust;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var errorhandler = require('errorhandler');
var app = express();

app.engine('dust', dust);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'dust');
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({
  secret: 'shhitsasecret',
  store: new MongoStore({
    'url': process.env.SWARM_DB_URL,
    'clear_interval': 3600,
    auto_reconnect: true
  }),
  resave: false,
  saveUninitialized: false
}));

app.get('/', routes.index);

app.post('/login', players.login);
app.post('/register', players.register);
app.get('/logout', players.logout);
app.get('/home', players.home);

app.get('/search', games.search);
app.get('/play', games.play);
app.get('/practice', games.practice);
app.get('/game/:id', games.renderGame);


app.get('/animation-demo', function (req, res) {
  res.render('animation-demo');
});

app.use(express.static(path.join(__dirname, 'public')));

// development only
if (app.get('env') === 'development') {
  app.use(errorhandler());
}

if (require.main === module) {
  var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
  });

  socketServer(server);
}
else {
  exports.app = app;
  exports.socketServer = socketServer;
}
