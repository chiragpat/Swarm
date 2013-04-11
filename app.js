
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    players = require('./routes/players'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate'),
    MongoStore = require('connect-mongo')(express);

var app = express();

app.engine('dust', cons.dust);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'dust');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'shhitsasecret',
    store: new MongoStore({
      url: process.env.SWARM_DB_URL,
      clear_interval: 3600
    })
  }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/login', players.login);
app.post('/register', players.register);
app.get('/logout', players.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
