class Chaser {
  constructor(posx, posy){
    this.pos = {};
    this.pos.x = posx;
    this.pos.y = posy;
  }

  onNewTurn(){
    var turnsToTake = 1;

    if (game.turn >= 50){
      if (game.turn == 50){ logger.log('Game difficulty now MEDIUM. Chaser moves 2 squares.', 'attentionCalling'); };
      turnsToTake = 2;
    }
    
    if (game.turn >= 100){
      if (game.turn == 100){ logger.log('Game difficulty now HARD. Chaser moves 3 squares.', 'attentionCalling') };
      turnsToTake = 3;
    }

    this.takeTurn(turnsToTake);
  }

  takeTurn(quantity){
    for (var i = 0; i < quantity; i++) {
      this.move();
      this.checkHasEaten();
    }
  }

  move(){
    var closestPlayer = chaser.findClosestPlayer();

    var distanceXToClosestPlayer = Math.abs(chaser.pos.x - closestPlayer.pos.x);
    var distanceYToClosestPlayer = Math.abs(chaser.pos.y - closestPlayer.pos.y);
    var axis = (distanceXToClosestPlayer > distanceYToClosestPlayer) ? 'x' : 'y'; // axis most lagging
    var directionDiff = (chaser.pos[axis] > closestPlayer.pos[axis]) ? -1 : 1;
    
    chaser.pos[axis] = chaser.pos[axis] + directionDiff;
  }

  findClosestPlayer(){
    var playersSortedByDistance = _.sortBy(players, [function(p) { return p.distanceToChaser.total; }]);
    // console.log('closest: ' + playersSortedByDistance[0].uid + '(uid) / ' + playersSortedByDistance[0].number + '(number)');
    return playersSortedByDistance[0];
  }

  checkHasEaten(){
    setTimeout(function(){
      var playerOnChaserTile = _.find(players, function(player) { 
        if (player.pos.x === chaser.pos.x && player.pos.y === chaser.pos.y){
          return player;
        } else {
          return null;
        }
      });

      if (playerOnChaserTile){
        game.killPlayer(playerOnChaserTile);
      }
    }, 0);
  }
}