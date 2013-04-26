function Planet(options) {
  options = options || {};
  this.x = options.x || 15;
  this.y = options.y || 15;
  this.cap = options.cap || 15;
  this.radius = options.radius || 30;
  this.stroke = options.color || 'black';
  this.strokeWidth = options.strokeWidth || 3;
  this.angleBetweenShips = options.angleBetweenShips || Math.PI/9;
  this.angularSpeed = options.angularSpeed || Math.PI/12;
  this.shipSize = options.shipSize || 3;
  this.owner = options.owner || "";
  this.kineticShape = this.generateKineticShape();
  this.movingHandler();
  this.ships = [];
  this.__lastShipOrbitRotation = 0,
  this.__stopAnim = 0,
  this.__firstShipAdding = false,
  this.addShips(options.numShips);


  if (options.layer) {
    this.addToLayer(options.layer);
    this.setAnimation();
    this.startAnimation();
  }
}

Planet.selected = null;
Planet.moving = null;
Planet.addingShip = false;

Planet.prototype = {
  selected: null,
  moving: null,

  movingHandler: function(){
    var self = this;
    this.kineticShape.on('tap click', function() {
      if (!Planet.moving && !Planet.addingShip) {
        if (!Planet.selected) {
          if (!__uname || __uname === self.owner) {
            Planet.selected = self;
            self.kineticShape.setStroke('#4eba53');
          }
        }
        else if(Planet.selected != self) {
          self.kineticShape.setStroke('#d80c0c');
          Planet.moving = self;
          Planet.selected.moveShipsTo(self, function(){
            Planet.selected.kineticShape.setStroke(Planet.selected.stroke);
            self.kineticShape.setStroke(self.stroke);
            Planet.selected = null;
            Planet.moving = null;
          });
        }
      }
    });
  },

  orbitRadius: function(){
    return 1.5 * this.radius;
  },

  generateKineticShape: function() {
    var self = this;
    return new Kinetic.Circle({
      x: self.x,
      y: self.y,
      radius: self.radius,
      stroke: self.stroke,
      strokeWidth: self.strokeWidth
    });
  },

  addShips: function(numShips) {
    for (var i = 0; i < numShips; i++) {
      var tempShip = new Ship({
        x: this.x,
        y: this.y,
        rotationRadius: this.orbitRadius(),
        color: this.stroke,
        length: this.shipSize,
        width: this.shipSize,
        owner: this.owner
      });
      tempShip.kineticShape.rotate(i*this.angleBetweenShips);
      this.ships.push(tempShip);
    }
    this.__lastShipOrbitRotation = this.ships.length*this.angleBetweenShips;
  },

  removeShip: function(cb) {
    if(this.ships.length) {
      var ship = this.ships.pop();
      ship.explode();
    }
  },

  addNewShip: function(ship, cb) {
    this.stopAnimation();

    Planet.addingShip = true;
    if (ship && ship.owner != this.owner) {
      this.owner = ship.owner;
      this.stroke = ship.stroke;
    }

    var thetaDur = null;
    if (!ship) thetaDur = 0.01;

    ship = ship || new Ship({
      x: this.x,
      y: this.y,
      rotationRadius: 0,
      owner: this.owner,
      color: this.stroke
    });

    cb = cb || (function(){});
    var shipOrbitRotation = 0;

    this.layer.add(ship.kineticShape);
    shipOrbitRotation = 0;
    if (this.__firstShipAdding) {
      shipOrbitRotation = this.ships.length*this.angleBetweenShips+0;
    }
    else {
      if (this.ships.length !== 0) {
        shipOrbitRotation = this.ships.length*this.angleBetweenShips+this.ships[0].kineticShape.getRotation();
      }
      else {
        this.__firstShipAdding = true;
      }
    }


    var orbitLocation = {
      x: this.x + (this.orbitRadius() * Math.cos(shipOrbitRotation)),
      y: this.y + (this.orbitRadius() * Math.sin(shipOrbitRotation))
    };

    this.ships.push(ship);
    var self = this;
    ship.moveTo({
      x: orbitLocation.x,
      y: orbitLocation.y
    }, {
      thetaDur: thetaDur,
      velocity: 300,
      onFinish: function(){
        ship.kineticShape.destroy();
        ship.setRotationRadius(self.orbitRadius());
        ship.setX(self.x);
        ship.setY(self.y);
        ship.kineticShape = ship.generateKineticShape();
        ship.kineticShape.setRotation(shipOrbitRotation);
        ship.setX(orbitLocation.x);
        ship.setY(orbitLocation.y);
        self.layer.add(ship.kineticShape);
        self.layer.draw();
        self.startAnimation();
        self.__firstShipAdding = false;
        Planet.addingShip = false;
        cb(ship);
      }
    });
  },

  addToLayer: function(layer) {
    for (var i = 0; i < this.ships.length; i++) {
      layer.add(this.ships[i].kineticShape);
    }
    layer.add(this.kineticShape);
    this.layer = layer;
  },

  setAnimation: function() {
    var self = this;
    var j = 0;
    this.anim = new Kinetic.Animation(function(frame) {
      var angleDiff = frame.timeDiff * self.angularSpeed / 1000;
      for (var i = 0; i < self.ships.length; i++) {
        var ship = self.ships[i];
        ship.kineticShape.rotate(-2*angleDiff);
        ship.setX(ship.kineticShape.getX() +
                  (ship.rotationRadius * Math.cos(ship.kineticShape.getRotation())));
        ship.setY(ship.kineticShape.getY() +
                  (ship.rotationRadius * Math.sin(ship.kineticShape.getRotation())));
      }

    }, this.layer);
  },

  startAnimation: function() {
    if (this.__stopAnim > 0) {
      this.__stopAnim--;
    }
    if (this.__stopAnim === 0 && this.anim) {
      this.kineticShape.setFill('');
      this.anim.start();
    }
  },

  stopAnimation: function() {
    this.__stopAnim++;
    if (this.anim) {
      this.anim.stop();
    }
  },

  moveShipsTo: function(planet, cb) {
    var temp_cb = null, attackingShip, shipToAttack, ship, move_cb = null;
    cb = cb || (function(){});
    if (!planet) return;
    if (!this.ships.length) return cb();

    if (this.owner == planet.owner) {
      this.__moveAllShipsTo(planet, cb);
    }
    else {
      if (!planet.ships.length) {
        move_cb = cb;
      }
      while (planet.ships.length > 0 && this.ships.length > 0) {
        attackingShip = this.ships.pop();
        shipToAttack  = planet.ships.pop();
        temp_cb = (!this.ships.length || !planet.ships.length) ? cb : null;
        attackingShip.attack(shipToAttack, temp_cb);
      }
      this.__moveAllShipsTo(planet, move_cb);
    }
  },

  __moveAllShipsTo: function(planet, cb) {
    cb = cb || (function(){});
    while (this.ships.length !== 0) {
      ship = this.ships[0];
      this.ships.splice(0, 1);
      temp_cb = (this.ships.length) ? null : cb;
      ship.__moveToPlanet(planet, temp_cb);
    }
  }
};