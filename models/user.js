var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    crypto   = require('crypto');

//Userschema where the username always will match the given regexp
var UserSchema = new Schema({
  username: {type: String, match: /^[a-z0-9]([a-z0-9_-]{2,15})$/, index: true},
  hashed_password: String,
  salt: String
});

/**
 * Makes a random salt for safe encryption
 * @return {String} the generated salt
 */
UserSchema.methods.makeSalt = function() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
};

/**
 * Encrypts the passed in plaintext with the salt stored in the instance and check if they are the same
 * @param  {String} plainText 
 * @return {Boolean} true if the password was correct
 */
UserSchema.methods.authenticate = function(plainText) {
  return this.encryptPassword(plainText) === this.hashed_password;
};

/**
 * Encrypts the password with the salt that is in the instance
 * @param  {String} password 
 * @return {String} hashed_password
 */
UserSchema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

/**
 * Virtual attribute so that it is not saved on the database
 * also sets a salt and encrypts the plain text and puts it into the hashed_password    
 * @param  {String} password
 */
UserSchema.virtual('password').set(function(password) {
  this.salt = this.makeSalt();
  this.hashed_password = this.encryptPassword(password);
});

/**
 * Querying the db for the passed in username and calls the callback function
 * with the user instance if found and the error
 * @param  {String}   name 
 * @param  {Function} cb
 */
UserSchema.statics.findByUsername = function(name, cb){
  this.findOne({username: name}, cb);
};

/**
 * Querys the db for the passed in name and then calls the callback function with true or false
 * depending on if the name was found
 * @param  {String}   name 
 * @param  {Function} cb   
 */
UserSchema.statics.usernameExists = function(name, cb){
  this.findByUsername(name, function(err, user){
    if (err) {
      return cb(err, null);
    }
    else {
      if (user) {
        return cb(null, true);
      }
      else {
        return cb(null, false);
      }
    }
  });
};

module.exports = UserSchema;