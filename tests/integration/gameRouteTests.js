/*eslint no-underscore-dangle:0*/
'use strict';

var libpath = process.env.SWARM_COV ? '../../lib-cov' : '../../lib';
var chai = require('chai'),
    mongoose = require('mongoose'),
    mockRequest = require('../../support/mock-request'),
    mockResponse = require('../../support/mock-response'),
    gameRoutes = require(libpath + '/routes/games'),
    GameSchema = require('../../lib/models/game');

var TestGames = mongoose.model('TestGames', GameSchema),
    should = chai.should(),
    game1;

describe('Game Routes', function () {

  before(function (done) {
    mongoose.connect(process.env.SWARM_DB_URL);
    TestGames.remove({}, function (err) {
      if (err) {
        return done(err);
      }

      var db = mongoose.createConnection(process.env.SWARM_DB_URL);
      TestGames.create(db, ['test'], function (createErr, game) {
        db.close();
        if (createErr) {
          done(createErr);
        }
        else {
          game1 = game;
          done();
        }
      });
    });
  });

  describe('GET /practice', function () {
    it('should redirect to home page is user is not logged in', function (done) {
      var req = mockRequest();

      var res = mockResponse(function () {
        (res.redirectPath).should.eql('/');
        done();
      });

      gameRoutes.practice(req, res);
    });

    it('should redirect to a create new game and redirect to that game if user is logged in', function (done) {
      var req = mockRequest(null, {
        loggedin: true,
        uname: 'test1'
      });

      var res = mockResponse(function () {
        (res.redirectPath).should.match(/\/game\/.+/);
        var gameId = res.redirect_path.split('/')[2];
        TestGames.findOne({_id: gameId}, function (err, game) {
          if (err) {
            done(err);
          }
          else {
            should.exist(game);
            done();
          }
        });
      });

      gameRoutes.practice(req, res);
    });
  });

  describe('GET /play', function () {
    it('should redirect to search', function (done) {
      var req = mockRequest();

      var res = mockResponse(function () {
        res.redirectPath.should.eql('/search');
        done();
      });

      gameRoutes.play(req, res);
    });
  });

  describe('GET /search', function () {
    it('should redirect to home if user is not loggedin', function (done) {
      var req = mockRequest();

      var res = mockResponse(function () {
        res.redirect_path.should.eql('/');
        done();
      });

      gameRoutes.search(req, res);
    });

    it('should render the search view with the correct params on success', function (done) {
      var req = mockRequest(null, {
        loggedin: true,
        uname: 'test1'
      });

      var res = mockResponse(function () {
        res.view.should.eql('search');
        res.renderParams.should.eql({uname: 'test1'});
        done();
      });

      gameRoutes.search(req, res);
    });
  });

  describe('GET /game/:id', function () {
    it('should render the correct game on receiving a correct id', function (done) {
      var req = mockRequest(null, {
        loggedin: true,
        uname: 'test'
      }, {id: game1._id});

      var res = mockResponse(function () {
        res.view.should.eql('game');
        res.renderParams.should.have.property('players');
        res.renderParams.should.have.property('planets');
        res.renderParams.uname.should.eql('test');
        done();
      });

      gameRoutes.renderGame(req, res, function () {
        done(new Error('404 when it should not have been a 404'));
      });
    });

    it('should throw a 404 on an invalid id', function (done) {
      var req = mockRequest(null, {
        loggedin: true,
        uname: 'test'
      }, {id: '1231'});

      var res = mockResponse(function () {
        done(new Error('should have thrown a 404 but did not'));
      });

      gameRoutes.renderGame(req, res, function () {
        done();
      });
    });

    it('should redirect to root page if user is not logged in', function (done) {
      var req = mockRequest(null, null, {id: game1._id});

      var res = mockResponse(function () {
        res.redirectPath.should.eql('/');
        done();
      });

      gameRoutes.renderGame(req, res, function () {
        done(new Error('404 when it should not have been a 404'));
      });
    });

    it('should throw 404 for valid id but id does not exist in db', function (done) {
      var gameId = '518c0c76978dfc6f1b000055';
      var req = mockRequest(null, {
        loggedin: true,
        uname: 'test'
      }, {id: gameId});

      var res = mockResponse(function () {
        done(new Error('should have thrown a 404 but did not'));
      });

      gameRoutes.renderGame(req, res, function () {
        done();
      });
    });
  });

  after(function (done) {
    TestGames.remove({}, function (err) {
      if (err) {
        done(err);
      }
      mongoose.connection.close();
      done();
    });
  });
});
