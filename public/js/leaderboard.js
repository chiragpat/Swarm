/* global Kinetic, window */
(function () {
  'use strict';
  function Leaderboard(options) {
    options = options || {};
    this.x = options.x || 15;
    this.y = options.y || 15;
    this.radius = options.radius || 30;
    this.stroke = options.color || 'black';
    this.strokeWidth = options.strokeWidth || 3;
    this.total = options.total || 0;
    this.owners = options.owners || [];
    this.stage = options.stage;
    this.adjust();
  }

  Leaderboard.prototype = {
    adjust: function () {
      var layer = new Kinetic.Layer();

      var circle = new Kinetic.Circle({
        x: 40,
        y: 40,
        radius: 40,
        fill: 'gray',
        stroke: 'white',
        strokeWidth: 3
      });
      layer.add(circle);

      var currRot = 0;
      for (var i in this.owners) {
        var ang = 360 * (this.owners[i].count / this.total);
        var wedge = new Kinetic.Wedge({
          x: 40,
          y: 40,
          radius: 40,
          angleDeg: 360 * ((this.owners[i].count - 1 < 0 ? 0 : this.owners[i].count - 1) / this.total),
          fill: this.owners[i].color,
          stroke: 'white',
          strokeWidth: 0,
          rotationDeg: currRot
        });
        this.owners[i].kineticShape = wedge;
        layer.add(wedge);
        wedge.transitionTo({
          angleDeg: ang,
          duration: 1
        });
        currRot += ang;
      }

      this.stage.add(layer);

    }
  };

  window.Leaderboard = Leaderboard;
})();
