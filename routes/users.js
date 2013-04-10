var UserSchema = require('../models/user');
var mongoose = require('mongoose');

exports.login = function (req, res) {
  var uname = req.body.uname,
      pwd   = req.body.pwd,
      db    = mongoose.createConnection(process.env.SWARM_DB_URL),
      Users = db.model('User', UserSchema);

  if (uname && pwd) {
    Users.findByUsername(uname, function(err, user){
      if (user) {
        if (user.authenticate(pwd)) {
          req.session.loggedin = true;
          req.session.uname = uname;
          success(res, {'uname': uname});
        }
        else {
          error(res, "Invalid password");
        }
      }
      else {
        error(res, "No such username");
        db.close();
      }
    });
  }
  else {
    error(res, "Invalid params");
  }
};

exports.register = function (req, res) {
  var uname = req.body.uname,
      pwd   = req.body.pwd,
      db    = mongoose.createConnection(process.env.SWARM_DB_URL),
      Users = db.model('User', UserSchema);

  if (uname && pwd) {
    Users.usernameExists(uname, function(err, exists) {
      if (exists) {
        error(res, "Username already exists");
        db.close();
      }
      else {
        var user = new Users();
        user.username = uname;
        user.password = pwd;
        user.save(function(){
          req.session.loggedin = true;
          req.session.username = uname;
          success(res, {'uname': uname});
          db.close();
        });
      }
    });
  }
  else {
    error(res, "Invalid params");
  }
};

exports.logout = function(req, res){
  req.session.loggedin = false;
  req.session.uname = null;
  res.redirect('/');
};

/**
 * Standard success json response with the passed in object
 * @param  {Response Object} res   
 * @param  {String} uname 
 */
var success = function(res, obj){
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(obj));
  res.end();
};


/**
 * Standard error response with the passed in error string
 * @param  {Response Object} res              
 * @param  {String} errorString 
 */
var error = function(res, errorString){
  res.writeHead(200, { 'Content-Type': 'application/json' });
  if (errorString) {
    res.write('{"error": "'+ errorString + '"}');
  }
  else {
    res.write('{"error": true}');
  }
  res.end();
};