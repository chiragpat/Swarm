var mongoose = require('mongoose'),
    _        = require('underscore'),
    Schema   = mongoose.Schema;

var PlanetSchema = new Schema({
  position: {
    x: Number,
    y: Number
  },
  cap: Number,
  population: Number,
  owner: String
});

var GameSchema = new Schema({
  planets: [PlanetSchema],
  players: [String]
});

/**
 *  Increments the population
 *  Does not change population if planet does not have a team
 */
GameSchema.methods.addShip = function(pid) {
  var planet = this.planets[pid];
  if(!planet.owner) { return; }
  if(planet.population < planet.cap) {
    planet.population++;
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
  var sendCount = from.population;
  from.population = 0;
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
    planet.population++;
  } else {
    //if empty, take over planet
    if(planet.population === 0) {
      planet.owner = shipOwner;
      planet.population++;
      return;
    }

    //else this is an attack
    planet.population--;
    if(planet.population <= 0) {
      planet.owner = "";
    }
  }
};

GameSchema.statics.create = function(db, players, cb) {
  var Games = db.model('Games', GameSchema);
  var game = new Games();
  game.players = players;
  var min_index = 0, max_index = 0;
  while (game.planets.length != 8) {
    var x, y, validPosition = true;
    x = Math.round(Math.random()*700)+50;
    y = Math.round(Math.random()*500)+50;

    for (var j = 0; j < game.planets.length; j++) {
      if ( x >= game.planets[j].position.x - 100 && x <= game.planets[j].position.x + 100 &&
           y >= game.planets[j].position.y - 100 && y <= game.planets[j].position.y + 100) {
        validPosition = false;
        break;
      }
    }

    if (validPosition) {
      game.planets.push({
        position: { x: x, y: y },
        cap: 15,
        population: 1,
        owner: ''
      });
    }
  }

  var maxPlanetX = _.max(game.planets, function(planet) { return planet.position.x; });
  var minPlanetX = _.min(game.planets, function(planet) { return planet.position.x; });

  players.push('AI');

  minPlanetX.owner = players[0];
  minPlanetX.population = 4;
  maxPlanetX.owner = players[1];

  game.save(function(err) {
    cb(err, game);
  });
};

module.exports = GameSchema;