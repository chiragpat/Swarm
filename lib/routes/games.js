var GameSchema = require('../models/game');
var mongoose = require('mongoose');
var _ = require('underscore');

exports.practice = function(req, res) {
  if (req.session.loggedin) {
    createGame([req.session.uname], function(err, game){
      if (err) throw err;
      res.redirect('/game/'+ game._id);
    });
  }
  else {
    res.redirect('/');
  }
};

exports.play = function(req, res) {
  res.redirect('/search');
};

exports.search = function(req, res) {
  if (req.session.loggedin) {
    res.render('search', {'uname': req.session.uname});
  }
  else {
    res.redirect('/');
  }
};

exports.renderGame = function(req, res, next) {
  var gameId = req.params.id;

  if (gameId && req.session.loggedin) {
    var uname   = req.session.uname,
        db = mongoose.createConnection(process.env.SWARM_DB_URL),
        collection_name = process.env.NODE_ENV === 'test' ? 'TestGame' : 'Game',
        Game = db.model(collection_name, GameSchema);

    Game.findOne({_id: gameId}, function (err, game) {
      if (!err) {
        if (game) {
          res.render('game', {
            "players": game.players,
            "planets": game.planets,
            "uname"  : req.session.uname
          });
        }
        else {
          next();
        }
      }
      else {
        if (err.name === 'CastError') {
          next();
        }
        else {
          throw err;
        }
      }
    });
  }
};

var createGame = exports.createGame = function(players, cb) {
  var db = mongoose.createConnection(process.env.SWARM_DB_URL),
      collection_name = process.env.NODE_ENV === 'test' ? 'TestGame' : 'Game',
      Game = db.model(collection_name, GameSchema);

  cb = cb || (function(){});
  Game.create(db, players, cb);
};