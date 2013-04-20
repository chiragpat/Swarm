var PlayerSchema = require('../models/player');
var mongoose = require('mongoose');

exports.login = function (req, res) {
  var uname   = req.body.uname,
      pwd     = req.body.pwd,
      db      = mongoose.createConnection(process.env.SWARM_DB_URL),
      collection_name = process.env.NODE_ENV === 'test' ? 'TestPlayer' : 'Player',
      Player = db.model(collection_name, PlayerSchema);

  if (uname && pwd) {
    Player.findByUsername(uname, function(err, player){
      if (player) {
        if (player.authenticate(pwd)) {
          req.session.loggedin = true;
          req.session.uname = uname;
          req.session.stats = player.stats;
          req.session.stats.wins  = req.session.stats.wins  || 0;
          req.session.stats.loses = req.session.stats.loses || 0;
          success(res, {'uname': uname});
        }
        else {
          error(res, "Incorrect password");
        }
      }
      else {
        error(res, "No such username");
      }
      db.close();
    });
  }
  else {
    error(res, "Invalid params");
    db.close();
  }
};

exports.register = function (req, res) {
  var uname  = req.body.uname,
      pwd    = req.body.pwd,
      db     = mongoose.createConnection(process.env.SWARM_DB_URL),
      collection_name = process.env.NODE_ENV === 'test' ? 'TestPlayer' : 'Player',
      Player = db.model(collection_name, PlayerSchema);

  if (uname && pwd) {
    Player.usernameExists(uname, function(err, exists) {
      if (exists) {
        error(res, "Username already exists");
        db.close();
      }
      else {
        var player = new Player();
        player.username = uname;
        player.password = pwd;
        player.save(function(){
          req.session.loggedin = true;
          req.session.uname = uname;
          req.session.stats = {
            "wins": 0,
            "loses": 0
          };
          success(res, {'uname': uname});
          db.close();
        });
      }
    });
  }
  else {
    error(res, "Invalid params");
    db.close();
  }
};

exports.logout = function(req, res) {
  req.session.loggedin = false;
  req.session.uname = null;
  res.redirect('/');
};

exports.home = function(req, res) {
  if (!req.session.loggedin) {
    res.redirect('/');
  }
  else {
    res.render('home', {
      "uname": req.session.uname, 
      "stats": req.session.stats
    });
  }
};

/**
 * Standard success json response with the passed in object
 * @param  {Response Object} res   
 * @param  {String} uname 
 */
var success = function(res, obj){
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(obj));
  res.end();
};


/**
 * Standard error response with the passed in error string
 * @param  {Response Object} res              
 * @param  {String} errorString 
 */
var error = function(res, errorString){
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"error": "'+ errorString + '"}');
  res.end();
};