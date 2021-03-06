class Chaser {
  constructor(posx, posy){
    this.pos = {};
    this.pos.x = posx;
    this.pos.y = posy;
    this.turnsThisCycle = 1;
  }

  onNewTurn(){
    this.move();
    board.draw();
    this.checkHasEaten();
  }

  move(){
    var closestPlayer = chaser.findClosestPlayer();

    var distanceXToClosestPlayer = Math.abs(chaser.pos.x - closestPlayer.pos.x);
    var distanceYToClosestPlayer = Math.abs(chaser.pos.y - closestPlayer.pos.y);
    var axis = (distanceXToClosestPlayer > distanceYToClosestPlayer) ? 'x' : 'y'; // axis most lagging
    var directionDiff = (chaser.pos[axis] > closestPlayer.pos[axis]) ? -1 : 1;
    
    var targetTilePos = (axis == 'x') ? {'x': (chaser.pos.x + directionDiff), 'y': chaser.pos.y} : {'y': (chaser.pos.y + directionDiff), 'x': chaser.pos.x};

    if (board.isTileInMapBoundaries(targetTilePos.x, targetTilePos.y)){
      chaser.pos[axis] = chaser.pos[axis] + directionDiff;
    } else {
      logger.log('Chaser has not moved this turn as the target tile was outside the map boundaries.');
    }
  }

  findClosestPlayer(){
    var playersSortedByDistance = _.sortBy(players, [function(p) { return p.distanceToChaser.total; }]);
    return playersSortedByDistance[0];
  }

  checkHasEaten(){
    var playerOnChaserTile = _.find(players, function(player) { 
      if (player.pos.x === chaser.pos.x && player.pos.y === chaser.pos.y){
        return player;
      } else {
        return null;
      }
    });

    if (playerOnChaserTile){
      game.killPlayer(playerOnChaserTile, 'It was caught by the chaser. ');
    }
  }

  setTurnsThisCycle(){
    if (game.turn >= game.turnDifficultyIncrease){
      this.turnsThisCycle = 2;
    } else {
      this.turnsThisCycle = 1;
    }
  }

  isExtraTurnsRemainig(){
    if (this.turnsThisCycle > 1){
      this.turnsThisCycle--;
      return true;
    } else {
      return false;
    }
  }
}