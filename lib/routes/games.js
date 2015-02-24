/*eslint no-underscore-dangle:0*/
'use strict';

var GameSchema = require('../../lib/models/game'),
    mongoose = require('mongoose');

var createGame = exports.createGame = function (players, cb) {
  var db = mongoose.createConnection(process.env.SWARM_DB_URL),
      collectionName = process.env.NODE_ENV === 'test' ? 'TestGame' : 'Game',
      Game = db.model(collectionName, GameSchema);

  cb = cb || function () {};
  Game.create(db, players, cb);
};

exports.practice = function (req, res) {
  if (req.session.loggedin) {
    createGame([req.session.uname], function (err, game) {
      if (err) {
        throw err;
      }
      res.redirect('/game/' + game._id);
    });
  }
  else {
    res.redirect('/');
  }
};

exports.play = function (req, res) {
  res.redirect('/search');
};

exports.search = function (req, res) {
  if (req.session.loggedin) {
    res.render('search', {'uname': req.session.uname});
  }
  else {
    res.redirect('/');
  }
};

exports.renderGame = function (req, res, next) {
  var gameId = req.params.id;

  if (gameId && req.session.loggedin) {
    var db = mongoose.createConnection(process.env.SWARM_DB_URL),
        collectionName = process.env.NODE_ENV === 'test' ? 'TestGame' : 'Game',
        Game = db.model(collectionName, GameSchema);

    Game.findOne({_id: gameId}, function (err, game) {
      if (!err) {
        if (game) {
          res.render(game, {
            players: game.players,
            planets: game.planets,
            uname: req.session.uname
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
      }
    });
  }
  else {
    res.redirect('/');
  }
};
