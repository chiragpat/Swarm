describe('Game Routes', function(){
  var chai          = require('chai'),
      mongoose      = require('mongoose'),
      assert        = chai.assert,
      should        = chai.should(),
      mock_request  = require('../../support/mock-request'),
      mock_response = require('../../support/mock-response'),
      libpath       = process.env.SWARM_COV ? '../../lib-cov' : '../../lib';
      gameRoutes  = require(libpath + '/routes/games'),
      GameSchema  = require(libpath + '/models/game'),
      db            = mongoose.createConnection(process.env.SWARM_DB_URL),
      TestGames   = db.model('TestGames', GameSchema),
      game1       = new TestGames();

  before(function(done){
    TestGames.remove({}, function(err){
      if (err) {
        return done(err);
      }


      done();
    });
  });


  describe('GET /game/create', function(){
    it('should pass back planets and players lists', function(done){
      var req = mock_request(null, {
        loggedin: true,
        uname: "tester"
      });

      var res = mock_response(function(){
        ( res.render_params.players[0] ).should.equal("tester");
        ( res.render_params.planets ).should.exist;
        done();
      });

      gameRoutes.create(req, res);
    });

    it('should redirect client if not logged in', function(done){
      var req = mock_request(null, {
        loggedin: false
      });

      var res = mock_response(function(){
        done();
      });

    });
  });

  after(function(done){
    TestPlayers.remove({}, function(err){
      db.close();
      done();
    });
  });
});