var chai         = require('chai'),
    mongoose     = require('mongoose'),
    assert       = chai.assert,
    should       = chai.should(),
    libpath      = process.env.SWARM_COV ? '../../lib-cov' : '../../lib';
    GameSchema   = require(libpath + '/models/game'),
    TestGames    = mongoose.model('TestGame', GameSchema),
    game1        = new TestGames();

describe('Game Schema', function(){

  before(function(done){
    mongoose.connect(process.env.SWARM_DB_URL);
    TestGames.remove({}, function(err){
      if (err) {
        return done(err);
      }

      game1.planets.push({
        position: { x: 5, y: 8 },
        cap: 5,
        population: 3,
        owner: ""
      });

      game1.planets.push({
        position: { x: 2, y: 2 },
        cap: 5,
        population: 0,
        owner: ""
      });

      game1.save(done);
    });
  });

  describe('#addShip', function(){
    it('should add ship if owned and cap off', function(done){
      game1.addShip(0);
      (game1.planets[0].population).should.equal(3);
      game1.planets[0].owner = "eric";
      game1.addShip(0);
      (game1.planets[0].population).should.equal(4);
      game1.addShip(0);
      (game1.planets[0].population).should.equal(5);
      game1.addShip(0);
      (game1.planets[0].population).should.equal(5);
      done();
    });
  });

  describe('#sendShips', function(){
    it('should not send ships if no owner', function(done){
      game1.planets[0].owner = "";
      (game1.sendShips(0,1)).should.equal(0);
      done();
    });

    it('should not send ships to same planet', function(done){
      game1.owner = "eric";
      game1.planets[0].population = 3;
      (game1.sendShips(0,0)).should.equal(0);
      done();
    });

    it('should send all ships to target', function(done){
      game1.planets[0].owner = "eric";
      game1.planets[0].population = 3;
      (game1.sendShips(0,1)).should.equal(3);
      done();
    });

  });

  describe('#hitShip', function(){
    it('should increment population if same owner', function(done){
      game1.owner = "eric";
      game1.planets[0].population = 3;
      game1.hitShip(0, "eric");
      (game1.planets[0].population).should.equal(4);
      done();
    });

    it('should take over planet if empty', function(done){
      game1.planets[0].owner = "eric";
      game1.planets[0].population = 0;
      game1.hitShip(0, "bob");
      (game1.planets[0].population).should.equal(1);
      (game1.planets[0].owner).should.equal("bob");
      done();
    });

    it('should decrement populationulation as attack', function(done){
      game1.planets[0].owner = "eric";
      game1.planets[0].population = 3;
      game1.hitShip(0, "bob");
      (game1.planets[0].population).should.equal(2);
      (game1.planets[0].owner).should.equal("eric");
      game1.hitShip(0, "bob");
      game1.hitShip(0, "bob");
      (game1.planets[0].population).should.equal(0);
      (game1.planets[0].owner).should.equal("");
      done();
    });
  });

  describe('.create', function(){
    it('should create a 8 planet game with one player and AI with a single item player array', function(done) {
      var db = mongoose.createConnection(process.env.SWARM_DB_URL);
      TestGames.create(db, ['test'], function(err, game){
        db.close();
        if (err) {
          done(err);
        }
        else {
          game.planets.should.have.length(8);
          game.players.should.have.length(2);
          game.players[0].should.eql('test');
          game.players[1].should.eql('AI');
          done();
        }
      });
    });
  });

  after(function(done){
    TestGames.remove({}, function(err){
      mongoose.connection.close();
      done();
    });
  });

});