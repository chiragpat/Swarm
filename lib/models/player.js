/*eslint no-underscore-dangle:0*/
'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//PlayerSchema where the username always will match the given regexp
var PlayerSchema = new Schema({
  username: {type: String, match: /^[a-z0-9]([a-z0-9_-]{2,15})$/, index: true},
  hashedPassword: String,
  salt: String,
  stats: {
    wins: Number,
    loses: Number
  }
});

/**
 * Makes a random salt for safe encryption
 * @return {String} the generated salt
 */
PlayerSchema.methods.makeSalt = function () {
  return Math.round((new Date().valueOf() * Math.random())) + '';
};

/**
 * Encrypts the passed in plaintext with the salt stored in the instance and check if they are the same
 * @param  {String} plainText
 * @return {Boolean} true if the password was correct
 */
PlayerSchema.methods.authenticate = function (plainText) {
  return this.encryptPassword(plainText) === this.hashedPassword;
};

/**
 * Encrypts the password with the salt that is in the instance
 * @param  {String} password
 * @return {String} hashedPassword
 */
PlayerSchema.methods.encryptPassword = function (password) {
  return require('crypto').createHmac('sha1', this.salt).update(password).digest('hex');
};

/**
 * Virtual attribute so that it is not saved on the database
 * also sets a salt and encrypts the plain text and puts it into the hashedPassword
 * @param  {String} password
 */
PlayerSchema.virtual('password').set(function (password) {
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
});

/**
 * Querying the db for the passed in username and calls the callback function
 * with the user instance if found and the error
 * @param  {String}   name
 * @param  {Function} cb
 */
PlayerSchema.statics.findByUsername = function (name, cb) {
  this.findOne({username: name}, cb);
};

/**
 * Querys the db for the passed in name and then calls the callback function with true or false
 * depending on if the name was found
 * @param  {String}   name
 * @param  {Function} cb
 */
PlayerSchema.statics.usernameExists = function (name, cb) {
  this.findByUsername(name, function (err, player) {
    if (player) {
      return cb(err, true);
    }
    else {
      return cb(err, false);
    }
  });
};

module.exports = PlayerSchema;
