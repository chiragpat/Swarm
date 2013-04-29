$$(document).ready(function(){
  var moveShip, env, stage, layer, shipLayer, planet, planet2, planet3, planet4, planets, layer2, layer3, layer4, leaderboard;
  env = $$.environment();

  window.__uname = '';

  stage = new Kinetic.Stage({
    container: 'container',
    width: env.screen.width-100,
    height: env.screen.height-100
  });

  layer = new Kinetic.Layer();
  layer2 = new Kinetic.Layer();
  layer3 = new Kinetic.Layer();
  layer4 = new Kinetic.Layer();
  shipLayer = new Kinetic.Layer();

  planet = new Planet({
    x: stage.getWidth()/2,
    y: stage.getHeight()/2,
    numShips: 5,
    layer: layer
  });

  planet2 = new Planet({
    x: 150,
    y: 150,
    numShips: 5,
    layer: layer2
  });

  planet3 = new Planet({
    x: 350,
    y: 350,
    numShips: 5,
    layer: layer3
  });

  planet4 = new Planet({
    x: 350,
    y: 100,
    numShips: 5,
    layer: layer4
  });
  planets = [planet,planet2,planet3,planet4];

  moveShip = new Ship();
  shipLayer.add(moveShip.kineticShape);
  stage.add(layer);
  stage.add(layer2);
  stage.add(layer3);
  stage.add(layer4);
  stage.add(shipLayer);

  moveShip.infiniteRandomMove();

  // setInterval(function(){
  //   planet.removeShip();
  // }, 1000);

  setTimeout(function(){
    var ship = planet3.ships.pop();
    var ship2 = planet4.ships.pop();
    ship.attack(ship2);
  }, 1000);

  // Creates the leaderboard
  // @param playerInfo = [player, player, .. , player]
  // where player.color = 'some-color' and
  //       player.domain = X, the number of planets they occupy
  createLeaderboard = function(playerInfo) {

    centerX = 90;
    centerY = 90;
    radius = 50;

    leaderboard = new Object();
    leaderboard.layer = new Kinetic.Layer();
    leaderboard.items = [];

    for (var i = 0; i < playerInfo.length; i++) {

      leaderboard.items[i] = new Object();
      leaderboard.items[i].color = playerInfo[i].color;
      leaderboard.items[i].domain = playerInfo[i].domain;

      if (i == 0) {
        leaderboard.items[i].start_angle = 0;
      }
      else {
        leaderboard.items[i].start_angle = leaderboard.items[i-1].end_angle;
      }

      leaderboard.items[i].end_angle = leaderboard.items[i].start_angle + domainToAngle(playerInfo[i].domain);

      var color = leaderboard.items[i].color;
      var start_angle = leaderboard.items[i].start_angle;
      var end_angle = leaderboard.items[i].end_angle;

      leaderboard.items[i].kineticShape = generateKineticShape(centerX,centerY,radius,start_angle,end_angle,color);

      leaderboard.layer.add(leaderboard.items[i].kineticShape);

    }

    stage.add(leaderboard.layer);

    return leaderboard
  }
  // Updates the leaderboard
  // @param newPlayerInfo = [player, player, .. , player]
  // where player.color = 'some-color' and
  //       player.domain = X, the number of planets they occupy
  updateLeaderboard = function(newPlayerInfo) {

    centerX = 190;
    centerY = 190;
    radius = 50;

    for (var i = 0; i < newPlayerInfo.length; i++) {

      leaderboard.items[i].kineticShape.destroy();
      leaderboard.items[i].color = newPlayerInfo[i].color;
      leaderboard.items[i].domain = newPlayerInfo[i].domain;

      if (i == 0) {
        leaderboard.items[i].start_angle = 0;
      }
      else {
        leaderboard.items[i].start_angle = leaderboard.items[i-1].end_angle;
      }

      leaderboard.items[i].end_angle = leaderboard.items[i].start_angle + domainToAngle(newPlayerInfo[i].domain);

      console.log(leaderboard.items[i]);
      var color = leaderboard.items[i].color;
      var start_angle = leaderboard.items[i].start_angle;
      var end_angle = leaderboard.items[i].end_angle;

      leaderboard.items[i].kineticShape = generateKineticShape(centerX,centerY,radius,start_angle,end_angle,color);

      leaderboard.layer.add(leaderboard.items[i].kineticShape);

    }

    stage.add(leaderboard.layer);
  }

  // Converts the portion of planets occupied to an equivalent portion of the circle
  // Returns the angle in radians
  domainToAngle = function(domain) {

    proportion = domain/planets.length;
    return proportion*2*Math.PI;

  }

  // Generates the kinetic shape for a "slice of the pie"
  generateKineticShape = function(centerX,centerY,radius,start_angle,end_angle,color) {

    return new Kinetic.Circle({

    drawFunc: function(canvas) {

      var context = canvas.getContext();

      context.beginPath();
      context.moveTo(centerX+(radius*Math.cos(end_angle)),centerY+(radius*Math.sin(end_angle)));
      context.lineTo(centerX,centerY);
      context.lineTo(centerX+(radius*Math.cos(start_angle)),centerY+(radius*Math.sin(start_angle)));
      context.arc(centerX,centerY,radius,start_angle,end_angle,false);
      canvas.fillStroke(this);

    },

    x: 0,
    y: 0,
    strokeWidth: 2,
    fill: color

    });

  }

  // Hardcoded data to test the leaderboard with
  player1 = new Object();
  player1.color = 'blue';
  player1.domain = 1;

  player2 = new Object();
  player2.color = 'red';
  player2.domain = 1;

  player3 = new Object();
  player3.color = 'white';
  player3.domain = 2;

  playerInfo = [player1,player2,player3];
  playerInfoUpdated = [player2,player3,player1];

  createLeaderboard(playerInfo);
  // updateLeaderboard(playerInfoUpdated);


  


});