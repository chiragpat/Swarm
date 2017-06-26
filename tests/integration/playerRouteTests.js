'use strict';
var libpath = process.env.SWARM_COV ? '../../lib-cov' : '../../lib';
var chai = require('chai'),
    mongoose = require('mongoose'),
    mockRequest = require('../../support/mock-request'),
    mockResponse = require('../../support/mock-response'),
    playerRoutes = require(libpath + '/routes/players'),
    PlayerSchema = require(libpath + '/models/player');

var should = chai.should(),
    TestPlayers = mongoose.model('TestPlayer', PlayerSchema),
    player1 = new TestPlayers();

describe('Player Routes', function () {
  before(function (done) {
    mongoose.connect(process.env.SWARM_DB_URL);
    TestPlayers.remove({}, function (err) {
      if (err) {
        return done(err);
      }

      player1.username = 'test1';
      player1.password = 'test11';
      player1.save(done);
    });
  });

  describe('POST /login', function () {
    it('should respond with an error for invalid parameters', function (done) {
      var req = mockRequest();

      var res = mockResponse(function () {
        (res.body).should.have.property('error', 'Invalid params');
        done();
      });

      playerRoutes.login(req, res);
    });

    it('should respond with an error if user does not exist', function (done) {
      var req = mockRequest({uname: 'test11', pwd: 'test111'});

      var res = mockResponse(function () {
        (res.body).should.have.property('error', 'No such username');
        done();
      });

      playerRoutes.login(req, res);
    });

    it('should respond with an error if password is incorrect', function (done) {
      var req = mockRequest({uname: 'test1', pwd: 'test111'});

      var res = mockResponse(function () {
        (res.body).should.have.property('error', 'Incorrect password');
        done();
      });

      playerRoutes.login(req, res);
    });

    it('should respond with success if username and password are correct', function (done) {
      var req = mockRequest({uname: 'test1', pwd: 'test11'});

      var res = mockResponse(function () {
        (req.session).should.have.property('loggedin', true);
        (req.session).should.have.property('uname', 'test1');
        (res.body).should.have.property('uname', 'test1');

        done();
      });

      playerRoutes.login(req, res);
    });
  });

  describe('POST /register', function () {
    it('should respond with an error for invalid parameters', function (done) {
      var req = mockRequest();

      var res = mockResponse(function () {
        (res.body).should.have.property('error', 'Invalid params');
        done();
      });

      playerRoutes.register(req, res);
    });

    it('should respond with an error if username already exists', function (done) {
      var req = mockRequest({uname: 'test1', pwd: 'test111'});

      var res = mockResponse(function () {
        (res.body).should.have.property('error', 'Username already exists');
        done();
      });

      playerRoutes.register(req, res);
    });

    it('should respond with success if player successfully added to db and registered', function (done) {
      var req = mockRequest({uname: 'test2', pwd: 'test222'});

      var res = mockResponse(function () {
        (req.session).should.have.property('loggedin', true);
        (req.session).should.have.property('uname', 'test2');
        (res.body).should.have.property('uname', 'test2');

        TestPlayers.findByUsername('test2', function (err, user) {
          if (err) {
            done(err);
          }
          else {
            should.exist(user);
            var authenticated = user.authenticate('test222');
            authenticated.should.equal(true);
            done();
          }
        });
      });

      playerRoutes.register(req, res);
    });
  });

  describe('GET /home', function () {
    it('should redirect to landing page if no user is loggedin', function (done) {
      var req = mockRequest();

      var res = mockResponse(function () {
        (res.redirectPath).should.equal('/');
        done();
      });

      playerRoutes.home(req, res);
    });

    it('should render the homepage with the appropriate parameters if a user is loggedin', function (done) {
      var req = mockRequest(null, {
        loggedin: true,
        uname: 'test1',
        stats: {
          wins: 11,
          loses: 5
        }
      });

      var res = mockResponse(function () {
        (res.view).should.equal('home');
        (res.renderParams.uname).should.equal('test1');
        (res.renderParams.stats.wins).should.equal(11);
        (res.renderParams.stats.loses).should.equal(5);
        done();
      });

      playerRoutes.home(req, res);
    });
  });

  describe('GET /logout', function () {
    it('should reset the session object to logout player and redirects to root', function (done) {
      var req = mockRequest(null, {loggedin: true, uname: 'test1'});

      var res = mockResponse(function () {
        (req.session).should.have.property('loggedin', false);
        (req.session).should.have.property('uname', null);
        (res.redirectPath).should.equal('/');

        done();
      });

      playerRoutes.logout(req, res);
    });
  });

  after(function (done) {
    TestPlayers.remove({}, function (err) {
      if (err) {
        done(err);
      }
      mongoose.connection.close();
      done();
    });
  });
});
