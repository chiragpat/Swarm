function Ship(options) {
  options = options || {};
  this.x = options.x || 15;
  this.y = options.y || 15;
  this.length = options.length || 3;
  this.width = options.width || 3;
  this.fill = options.color || 'black';
  this.stroke = options.color || 'black';
  this.strokeWidth = options.strokeWidth || 2;
  this.rotationRadius = options.rotationRadius || 0;
  this.velocity = options.velocity || 200;
  this.owner = options.owner || '';
  this.kineticShape = this.generateKineticShape();
}

Ship.prototype = {
  setRotationRadius: function(rotationRadius) {
    if (rotationRadius === null || rotationRadius === undefined) {
      rotationRadius = 0;
    }

    this.rotationRadius = rotationRadius;
    if (this.kineticShape) {
      this.kineticShape.attrs.rotationRadius = rotationRadius;
    }
  },

  setX: function(x) {
    this.x = x;
  },

  setY: function(y) {
    this.y = y;
  },

  generateKineticShape: function() {
    var self = this;
    return new Kinetic.Shape({
      drawFunc: function(canvas) {
        var context = canvas.getContext();
        var attrs = this.getAttrs();
        x = attrs.rotationRadius;
        y = -4*attrs.length/5;

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x-attrs.width/2, y+attrs.length);
        context.lineTo(x, y+4*attrs.length/5);
        context.lineTo(x+attrs.width/2, y+attrs.length);
        context.lineTo(x, y);
        context.closePath();
        canvas.fillStroke(this);
      },

      x: self.x,
      y: self.y,
      length: self.length,
      width: self.width,
      fill: self.fill,
      stroke: self.stroke,
      strokeWidth: self.strokeWidth,
      rotationRadius: self.rotationRadius
    });
  },

  moveTo: function(pt, options) {
    options = options || {};
    options.thetaDur = options.thetaDur || 1;
    options.onFinish = options.onFinish || (function(){});
    options.easing   = options.easing   || 'ease-out';

    var shape = this.kineticShape,
        shipVector = {x: 0, y: -1},
        ptVector   = {x: pt.x-shape.getX(), y: pt.y-shape.getY()},
        magPtVector = Math.sqrt(ptVector.x*ptVector.x+ptVector.y*ptVector.y);

    var theta = Math.acos(
                  (shipVector.x*ptVector.x+shipVector.y*ptVector.y)/
                  (Math.sqrt(ptVector.x*ptVector.x+ptVector.y*ptVector.y))
                );

    if (pt.x <= this.kineticShape.getX()) {
      theta = -theta;
    }

    var velocity = options.velocity || this.velocity;
    options.moveDur = magPtVector/velocity;

    var self = this;
    shape.transitionTo({
      rotation: theta,
      duration: options.thetaDur,

      callback: function(){
        shape.transitionTo({
          x: pt.x,
          y: pt.y,
          duration: options.moveDur,
          easing: options.easing,
          callback: function(){
            self.x = pt.x;
            self.y = pt.y;
            options.onFinish.call(self, options);
          }
        });
      }
    });
  },

  infiniteRandomMove: function(options) {
    options = options || {};
    var x = Math.floor(Math.random()*this.kineticShape.getStage().getWidth()),
        y = Math.floor(Math.random()*this.kineticShape.getStage().getHeight());

    options.onFinish = this.infiniteRandomMove;

    if (!this.stopInfiniteMove) {
      this.moveTo({x: x, y: y}, options);
    }
  },

  setStopInfiniteMove: function(){
    this.stopInfiniteMove = true;
  },

  attack: function(ship, cb) {
    if (!ship) return;
    cb = cb || (function(){});

    this.kineticShape.setPosition(this.x, this.y);
    this.setRotationRadius(0);

    ship.kineticShape.setPosition(ship.x, ship.y);
    ship.setRotationRadius(0);

    var ptToGo = {
      x: this.x + 0.75*(ship.x - this.x),
      y: this.y + 0.75*(ship.y - this.y)
    };

    var ptToGo2 = {
      x: this.x + 0.73*(ship.x - this.x),
      y: this.y + 0.73*(ship.y - this.y)
    };

    ship.moveTo(ptToGo);

    this.moveTo(ptToGo2, {
      onFinish: function(){
        this.explode();
        ship.explode(cb);
      }
    });
  },

  explode: function(cb) {
    var stage = this.kineticShape.getStage();
    this.explosionLayer = new Kinetic.Layer();
    cb = cb || (function(){});

    var circle = new Kinetic.Circle({
      x: this.x,
      y: this.y,
      radius: 1,
      fill: 'black',
    });

    var circle2 = new Kinetic.Circle({
      x: this.x,
      y: this.y,
      radius: 1,
      fill: 'white',
    });

    this.explosionLayer.add(circle);
    stage.add(this.explosionLayer);


    var period = 1500;

    var self = this;

    var anim = new Kinetic.Animation(function(frame) {
      var scale = Math.sin(frame.time * 2 * Math.PI / period) + 0.001;
      if(scale > 0.9) {
        anim.stop();
        self.explosionLayer.add(circle2);
        anim2.start();
      }
      circle.setScale(scale*7);
    }, this.explosionLayer);

    var anim2 = new Kinetic.Animation(function(frame) {
      var scale = Math.sin(frame.time * 2 * Math.PI / period) + 0.001;
      if(scale > 0.9) {
        anim2.stop();
        self.kineticShape.destroy();
        self.explosionLayer.destroy();
        cb.call(self);
      }
      circle2.setScale(scale*7);
    }, this.explosionLayer);

    anim.start();
  },
};