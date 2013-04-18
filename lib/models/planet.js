var mongoose = require('mongoose'),
    Schema   = mongoose.Schema

//PlanetSchema 
var PlanetSchema = new Schema({
  position: {
    x: Number,
    y: Number
  }
  pid: {type: Number, index=true},
  game: Number,
  cap: Number,
  pop: Number,
  owner: String
});

/**
 *  Increments the population
 *  Does not change population if planet does not have a team
 */
PlanetSchema.methods.addShip = function() {
  if(!self.owner) { return; }
  if(self.pop < self.cap) { 
    self.pop++; 
  }
};

/**
 *  Sends a ship from this planet to the target
 *  @param  {Number}  target planet id
 *  @return {Number}  number of ships to send
 */
PlanetSchema.methods.sendShips = function(targetID) {
  if(!self.owner) { return 0; }
    this.findOne({username: name}, cb);

  PlanetSchema.findOne({ pid: targetID }, function(err, target){
    if(self == target) { return 0; }
    
    var sendCount = self.pop;
    self.pop = 0;
    //TODO: Broadcast to players that ships are sent
  });
};

/**
 *  Planet encounters ship, effects dependent on player
 *  @param  {String}  uname of ship's owner  
 *  @return {Number}  number of ships to send
 */
PlanetSchema.methods.hitShip = function(shipOwner) {
  //if planet owned by same person, add ship
  if(shipOwner == self.owner) {
    self.pop++;
  } else {
    //if empty, take over planet
    if(self.pop === 0) {
      self.owner = shipOwner;
      self.pop++;
      return;
    }

    //else this is an attack
    self.pop--;
    if(self.pop <== 0) {
      self.owner = "";
    }
    //TODO: Broadcast to players of planet changes
  }
};


module.exports = PlanetSchema;