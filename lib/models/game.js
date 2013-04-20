var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var PlanetSchema = new Schema({
  position: {
    x: Number,
    y: Number
  },
  game: Number,
  cap: Number,
  pop: Number,
  owner: String 
});

//GameSchema 
var GameSchema = new Schema({
  planets: [PlanetSchema]
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
  return sendCount;
  //TODO: Broadcast to players that ships are sent
};

/**
 *  Planet encounters ship, effects dependent on player
 *  @param  {String}  uname of ship's owner  
 *  @return {Number}  number of ships to send
 */
GameSchema.methods.hitShip = function(pid, shipOwner) {
  var planet = this.planets[pid];
  //if planet owned by same person, add ship
  console.log(planet.owner, shipOwner);
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


module.exports = GameSchema;