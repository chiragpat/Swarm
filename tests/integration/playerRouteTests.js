describe('Player Routes', function(){
  var chai          = require('chai'),
      mongoose      = require('mongoose'),
      assert        = chai.assert,
      should        = chai.should(),
      mock_request  = require('../../support/mock-request'),
      mock_response = require('../../support/mock-response'),
      libpath       = process.env.SWARM_COV ? '../../lib-cov' : '../../lib';
      playerRoutes  = require(libpath + '/routes/players'),
      PlayerSchema  = require(libpath + '/models/player'),
      db            = mongoose.createConnection(process.env.SWARM_DB_URL),
      TestPlayers   = db.model('TestPlayer', PlayerSchema),
      player1       = new TestPlayers();

  before(function(done){
    TestPlayers.remove({}, function(err){
      if (err) {
        return done(err);
      }

      player1.username = 'test1';
      player1.password = 'test11';
      player1.save(done);
    });
  });

  describe('POST /login', function(){
    it('should respond with an error for invalid parameters', function(done){
      var req = mock_request();

      var res = mock_response(function(){
        (res.body).should.have.property('error', 'Invalid params');
        done();
      });

      playerRoutes.login(req, res);
    });

    it('should respond with an error if user does not exist', function(done){
      var req = mock_request({uname: "test11", pwd: "test111"});

      var res = mock_response(function(){
        (res.body).should.have.property('error', 'No such username');
        done();
      });

      playerRoutes.login(req, res);
    });

    it('should respond with an error if password is incorrect', function(done){
      var req = mock_request({uname: "test1", pwd: "test111"});

      var res = mock_response(function(){
        (res.body).should.have.property('error', 'Incorrect password');
        done();
      });

      playerRoutes.login(req, res);
    });

    it('should respond with success if username and password are correct', function(done){
      var req = mock_request({uname: "test1", pwd: "test11"});

      var res = mock_response(function(){
        (req.session).should.have.property('loggedin', true);
        (req.session).should.have.property('uname', 'test1');
        (res.body).should.have.property('uname', 'test1');

        done();
      });

      playerRoutes.login(req, res);
    });
  });

  describe('POST /register', function(){
    it('should respond with an error for invalid parameters', function(done){
      var req = mock_request();

      var res = mock_response(function(){
        (res.body).should.have.property('error', 'Invalid params');
        done();
      });

      playerRoutes.register(req, res);
    });

    it('should respond with an error if username already exists', function(done){
      var req = mock_request({uname: "test1", pwd: "test111"});

      var res = mock_response(function(){
        (res.body).should.have.property('error', 'Username already exists');
        done();
      });

      playerRoutes.register(req, res);
    });

    it('should respond with success if player successfully added to db and registered', function(done){
      var req = mock_request({uname: "test2", pwd: "test222"});

      var res = mock_response(function(){
        (req.session).should.have.property('loggedin', true);
        (req.session).should.have.property('uname', 'test2');
        (res.body).should.have.property('uname', 'test2');

        TestPlayers.findByUsername('test2', function(err, user){
          if (err) {
            done(err);
          }
          else {
            should.exist(user);
            (user.authenticate('test222')).should.be.true;
            done();
          }
        });
      });

      playerRoutes.register(req, res);
    });
  });

  describe('GET /home', function(){
    it('should redirect to landing page if no user is loggedin', function(done){
      var req = mock_request();

      var res = mock_response(function(){
        (res.redirect_path).should.equal('/');
        done();
      });

      playerRoutes.home(req, res);
    });

    it('should render the homepage with the appropriate parameters if a user is loggedin', function(done){
      var req = mock_request(null, {
        loggedin: true,
        uname: 'test1',
        stats: {
          "wins": 11,
          "loses": 5
        }
      });

      var res = mock_response(function(){
        (res.view).should.equal('home');
        (res.render_params.uname).should.equal('test1');
        (res.render_params.stats.wins).should.equal(11);
        (res.render_params.stats.loses).should.equal(5);
        done();
      });

      playerRoutes.home(req, res);
    });
  });

  describe('GET /logout', function(){
    it('should reset the session object to logout player and redirects to root', function(done){
      var req = mock_request(null, {loggedin: true, uname: 'test1'});

      var res = mock_response(function(){
        (req.session).should.have.property('loggedin', false);
        (req.session).should.have.property('uname', null);
        (res.redirect_path).should.equal('/');

        done();
      });

      playerRoutes.logout(req, res);
    });
  });

  after(function(done){
    TestPlayers.remove({}, function(err){
      db.close();
      done();
    });
  });
});