describe('UserSchema', function(){
  var chai       = require('chai'),
      mongoose   = require('mongoose'),
      assert     = chai.assert,
      should     = chai.should(),
      UserSchema = require('../models/user'),
      db         = mongoose.createConnection(process.env.SWARM_DB_URL),
      TestUsers  = db.model('TestUser', UserSchema),
      user1      = new TestUsers();

  before(function(done){
    TestUsers.remove({}, function(err){
      if (err) {
        return done(err);
      }

      user1.username = 'test1';
      user1.password = 'test11';
      user1.save(done);
    });
  });

  describe('.findByUsername', function(){
    it('should return the user object if it exists', function(done){
      TestUsers.findByUsername('test1', function(err, doc){
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
      TestUsers.findByUsername('user111', function(err, doc){
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
      TestUsers.usernameExists('test1', function(err, exists){
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
      TestUsers.usernameExists('test111', function(err, exists){
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
      (user1.authenticate('test11')).should.be.true;
      done();
    });

    it('should return false if the password does not match the user password', function(done){
      (user1.authenticate('test111')).should.be.false;
      done();
    });
  });

  after(function(done){
    TestUsers.remove({}, function(err){
      db.close();
      done();
    });
  });

});