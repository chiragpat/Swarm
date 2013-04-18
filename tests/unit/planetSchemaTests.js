describe('Planet Schema', function(){
  var chai         = require('chai'),
      mongoose     = require('mongoose'),
      assert       = chai.assert,
      should       = chai.should(),
      libpath      = process.env.SWARM_COV ? '../../lib-cov' : '../../lib';
      PlayerSchema = require(libpath + '/models/planet'),
      db           = mongoose.createConnection(process.env.SWARM_DB_URL),
      TestPlanets  = db.model('TestPlanet', PlanetSchema),
      planet1      = new TestPlanets();

  before(function(done){
    TestPlanets.remove({}, function(err){
      if (err) {
        return done(err);
      }

      planet1.pid = 1;
      planet1.position.x = 5;
      planet1.position.y = 8;
      planet1.cap = 10;
      planet1.pop = 0;
      planet1.owner = "";
  });

  describe('.addShip', function(){
    it('should add ship if owned', function(done){

    });
  });

  describe('.sendShips', function(){
    it('should', function(done){
      });
    });

  });

  describe('.hitShip', function(){
    it('should', function(done){
    });
  });

  after(function(done){
    TestPlanets.remove({}, function(err){
      db.close();
      done();
    });
  });

});