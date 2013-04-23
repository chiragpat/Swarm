var GameSchema = require('../models/game');
var mongoose = require('mongoose');

exports.create = function(req, res) {
    var uname   = req.session.uname,
        db = mongoose.createConnection(process.env.SWARM_DB_URL),
        collection_name = process.env.NODE_ENV === 'test' ? 'TestGame' : 'Game',
        Game = db.model(collection_name, GameSchema);
    Game.create(db, [uname], function(err, game) {
        res.render('game', {
            "players": game.players,
            "planets": game.planets
        });
    });
};

exports.play = function(req, res) {
    res.redirect('/game/create');
};

exports.search = function(req, res) {
    res.render('search');
};