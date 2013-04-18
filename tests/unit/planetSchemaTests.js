describe('Planet Schema', function(){
  var chai         = require('chai'),
      mongoose     = require('mongoose'),
      assert       = chai.assert,
      should       = chai.should(),
      libpath      = process.env.SWARM_COV ? '../../lib-cov' : '../../lib';
      PlanetSchema = require(libpath + '/models/planet'),
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
      planet1.cap = 5;
      planet1.pop = 3;
      planet1.owner = "";
      done();
    });
  });

  describe('#addShip', function(){
    it('should add ship if owned and cap off', function(done){
      planet1.addShip();
      (planet1.pop).should.equal(3);
      planet1.owner = "eric";
      planet1.addShip();
      (planet1.pop).should.equal(4);
      planet1.addShip();
      (planet1.pop).should.equal(5);
      planet1.addShip();
      (planet1.pop).should.equal(5);
      done();
    });
  });

  describe('#sendShips', function(){
    it('should not send ships if no owner', function(done){
      (planet1.sendShips(2)).should.equal(0);
      done();
    });

    it('should not send ships to same planet', function(done){
      planet1.owner = "eric";
      (planet1.sendShips(1)).should.equal(0);
      done();
    });

    it('should send all ships to target', function(done){
      planet1.owner = "eric";
      (planet1.sendShips(2)).should.equal(3);
      done();
    });

  });

  describe('#hitShip', function(){
    it('should increment population if same owner', function(done){
      planet1.owner = "eric";
      planet1.hitShip("eric");
      (planet1.pop).should.equal(4);
      done();
    });

    it('should take over planet if empty', function(done){
      planet1.owner = "eric";
      planet1.pop = 0;
      planet1.hitShip("bob");
      (planet1.pop).should.equal(1);
      (planet1.owner).should.equal("bob");
      done();
    });

    it('should decrement population as attack', function(done){
      planet1.owner = "eric";
      planet1.hitShip("bob");
      (planet1.pop).should.equal(2);
      (planet1.owner).should.equal("eric");
      planet1.hitShip("bob");
      planet1.hitShip("bob");
      (planet1.pop).should.equal(0);
      (planet1.owner).should.equal("");
      done();
    });
  });

  after(function(done){
    TestPlanets.remove({}, function(err){
      db.close();
      done();
    });
  });

});