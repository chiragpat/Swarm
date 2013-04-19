function Planet(options) {
  options = options || {};
  this.x = options.x || 15;
  this.y = options.y || 15;
  this.radius = options.radius || 30;
  this.stroke = options.stroke || 'black';
  this.strokeWidth = options.strokeWidth || 3;
  this.angleBetweenShips = options.angleBetweenShips || Math.PI/9;
  this.angularSpeed = options.angularSpeed || Math.PI/12;
  this.kineticShape = this.generateKineticShape();
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

Planet.prototype = {
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
        rotationRadius: this.orbitRadius()
      });
      tempShip.kineticShape.rotate(i*this.angleBetweenShips);
      this.ships.push(tempShip);
    }
    this.__lastShipOrbitRotation = this.ships.length*this.angleBetweenShips;
  },

  addNewShip: function(ship, cb) {
    this.stopAnimation();

    ship = ship || new Ship({
      x: this.x,
      y: this.y,
      rotationRadius: 0
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
      velocity: 300,
      onFinish: function(){
        ship.kineticShape.destroy();
        ship.setRotationRadius(self.orbitRadius());
        ship.setX(self.x);
        ship.setY(self.y);
        ship.kineticShape = ship.generateKineticShape();
        ship.kineticShape.setRotation(shipOrbitRotation);
        self.layer.add(ship.kineticShape);
        self.layer.draw();
        self.startAnimation();
        self.__firstShipAdding = false;
        cb();
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
    if (planet) {
      if (this.ships.length === 0) {
        cb();
      }

      cb = cb || (function(){});
      while (this.ships.length !== 0) {
        var ship = this.ships[0];
        this.ships.splice(0,1);
        if (this.ships.length === 1){
          planet.addNewShip(new Ship({
            x: ship.x,
            y: ship.y,
            rotationRadius: 0
          }), cb);
        }
        else {
          planet.addNewShip(new Ship({
            x: ship.x,
            y: ship.y,
            rotationRadius: 0
          }));
        }
        ship.kineticShape.destroy();
      }
    }
  }
};