var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var PlanetSchema = new Schema({
  position: {
    x: Number,
    y: Number
  },
  cap: Number,
  pop: Number,
  owner: String 
});

var GameSchema = new Schema({
  planets: [PlanetSchema],
  players: [String],
  gid: {type: Number, index: true}
});

/**
 *  Increments the population
 *  Does not change population if planet does not have a team
 */
GameSchema.methods.addShip = function(pid) {
  var planet = this.planets[pid];
  if(!planet.owner) { return; }
  if(planet.pop < planet.cap) {
    planet.pop++;
  }
};

/**
 *  Sends a ship from this planet to the target
 *  @param  {Number}  target planet id
 *  @return {Number}  number of ships to send
 */
GameSchema.methods.sendShips = function(pid, tid) {
  var from = this.planets[pid];
  var to = this.planets[tid];
  // console.log(from, to, this.planets.length);
  if(from.owner === "") { return 0; }
  if(pid == tid) { return 0; }
  var sendCount = from.pop;
  from.pop = 0;
  //TODO: Broadcast to players that ships are sent
  return sendCount;
};

/**
 *  Planet encounters ship, effects dependent on player
 *  @param  {String}  uname of ship's owner  
 *  @return {Number}  number of ships to send
 */
GameSchema.methods.hitShip = function(pid, shipOwner) {
  var planet = this.planets[pid];
  //if planet owned by same person, add ship
  if(shipOwner == planet.owner) {
    planet.pop++;
  } else {
    //if empty, take over planet
    if(planet.pop === 0) {
      planet.owner = shipOwner;
      planet.pop++;
      return;
    }

    //else this is an attack
    planet.pop--;
    if(planet.pop <= 0) {
      planet.owner = "";
    }
    //TODO: Broadcast to players of planet changes
  }
};

GameSchema.statics.create = function(db, players, cb) {
  var Games = db.model("Games", GameSchema);
  var game = new Games();
  game.players = players;
  var hor = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  var vert = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  hor = hor.slice(0, 8);
  vert = vert.slice(0, 8);
  for(var i=0; i< 8; i++) {
    game.planets.push({
      position: { x: hor[i], y: vert[i] },
      cap: 15,
      pop: 1,
      owner: ""
    });
  }

  game.save(function(err){
    cb(err, game);
  });
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
var shuffle = function(o){
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

module.exports = GameSchema;