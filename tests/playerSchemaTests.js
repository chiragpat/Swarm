describe('PlayerSchema', function(){
  var chai       = require('chai'),
      mongoose   = require('mongoose'),
      assert     = chai.assert,
      should     = chai.should(),
      libpath    = process.env.SWARM_COV ? '../lib-cov' : '../models';
      PlayerSchema = require(libpath + '/player'),
      db         = mongoose.createConnection(process.env.SWARM_DB_URL),
      TestPlayers  = db.model('TestPlayer', PlayerSchema),
      player1      = new TestPlayers();

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

  describe('.findByUsername', function(){
    it('should return the user object if it exists', function(done){
      TestPlayers.findByUsername('test1', function(err, doc){
        if (err) {
          done(err);
        }
        else {
          should.exist(doc);
          doc.should.be.an('object');
          done();
        }
      });
    });

    it('should return nothing if user does no exist', function(done){
      TestPlayers.findByUsername('user111', function(err, doc){
        if (err) {
          done(err);
        }
        else {
          should.not.exist(doc);
          done();
        }
      });
    });
  });

  describe('.usernameExists', function(){
    it('should return true if username already exists', function(done){
      TestPlayers.usernameExists('test1', function(err, exists){
        if (err) {
          done(err);
        }
        else {
          exists.should.be.true;
          done();
        }
      });
    });

    it('should return false if username does not exist', function(done){
      TestPlayers.usernameExists('test111', function(err, exists){
        if (err) {
          done(err);
        }
        else {
          exists.should.be.false;
          done();
        }
      });
    });
  });

  describe('#authenticate', function(){
    it('should return true if the password matches the user password', function(done){
      (player1.authenticate('test11')).should.be.true;
      done();
    });

    it('should return false if the password does not match the user password', function(done){
      (player1.authenticate('test111')).should.be.false;
      done();
    });
  });

  after(function(done){
    TestPlayers.remove({}, function(err){
      db.close();
      done();
    });
  });

});