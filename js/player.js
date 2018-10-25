class Player {
  constructor(posx, posy, uid, name, code){
    this.uid = uid;
    this.number = uid + 1;
    this.name = this.constructPlayerName(name);
    this.pos = {};
    this.pos.x = posx;
    this.pos.y = posy;
    this.code = code ? code : null;
    this.movesThisTurn = 1;
    this.distanceToChaser = {};
    this.setDistanceToChaser();
  }

  constructPlayerName(name){
    if (typeof showdown == 'undefined' && game.multiplePlayers){ // only when simulating in single player
      return name + ' ' + this.number;
    } else {
      return name;
    }
  }

  onNewTurn(){
    logger.curateLog();
    this.setDistanceToChaser();
    this.runCode();
    board.draw();
    this.checkHasDrowned();
  }

  setDistanceToChaser(){
    this.distanceToChaser.x = Math.abs(chaser.pos.x - this.pos.x);
    this.distanceToChaser.y = Math.abs(chaser.pos.y - this.pos.y);
    this.distanceToChaser.total = this.distanceToChaser.x + this.distanceToChaser.y;
  }

  hasMovesThisTurn(){
    return this.movesThisTurn > 0;
  }

  move(direction){

    var self = helpers.getPlayerByPlayerUid(this.uid); // *1

    var targetPos;
    if (direction == 'west'){
      targetPos = { x: self.pos.x - 1, y: self.pos.y };
    } else
    if (direction == 'east'){
      targetPos = { x: self.pos.x + 1, y: self.pos.y };
    } else
    if (direction == 'north'){
      targetPos = { x: self.pos.x, y: self.pos.y - 1 };
    } else
    if (direction == 'south'){
      targetPos = { x: self.pos.x, y: self.pos.y + 1 };
    } else {
      return logger.log(self.name + ' was prevented from moving as the direction provided was not valid.');
    }

    if (!self.hasMovesThisTurn()){
      return logger.log(self.name + ' was prevented from moving as it tried to move more than once in the same turn.');
    }

    if (!board.isTileSuitableForMovement(targetPos.x, targetPos.y)){
      return logger.log(self.name + ' has not moved this turn as the target tile was either occupied or outside the map boundaries.');
    }

    if (game.isPaused){
      return logger.log(self.name + ' has not moved this turn as the game is paused.')
    }

    self.pos = targetPos;
    self.movesThisTurn--;
  }

  runCode(){

    // Unexpose
    const Chaser = {};
    const players = {};
    const Player = {};
    const helpers = {};
    const game = {};
    const ui = {};

    // Half-expose
    const me = {
      uid: _.clone(this.uid), // not for the player to query, but for us to identify and elevate access in move()
      pos: _.clone(this.pos),
      move: this.move,
      whereIsChaser: this.whereIsChaser,
      whatIsInDirection: this.whatIsInDirection
    };
    const chaser = {
      pos: _.clone(window.chaser.pos)
    };

    // Add helpers
    const log = function(...toLog){
      for (var i = 0; i < toLog.length; i++) {
        window.logger.log('Log: ' + toLog[i], 'player-log')
      }
    };
    const pause = function(){
      window.game.pause();
      window.game.onUnpause.push(function(){
        this.runCode();
        board.draw(); // @todo: feels wrong, but otherwise the player moves and doesn't get shown until the next turn
      })
    }

    var playerCode = this.getPlayerCode();

    // Blacklisted words in code
    var blacklistedWords = ['eval', 'window', 'document', 'console', 'alert', 'debugger'];
    var isPlayerInputCodeSafe = _.every(blacklistedWords, function(word){ return (playerCode.indexOf(word) == -1) });
    if (!isPlayerInputCodeSafe){
      return window.logger.log('Your code will not execute if you try to use eval, window, document, console, alert or debugger.', 'error');
    }

    // Run player's code
    try {
      (function(){
        eval(playerCode);
      })(); // self executing function removes the 'this' reference to the player instance
    } catch (e){
      console.log('Player code error. Player name: ' + this.name);
      console.log(e);
      var errorLine = e.stack.match(/anonymous.*?\)/g)[1].replace('anonymous>', '').replace(')', '');
      window.logger.log('Your player code has thrown an error: ' + e + '. It is located in the following line and column: ' + errorLine + '.', 'error');
    }
  }

  getPlayerCode(){
    if (this.code != null){
      return this.code; // for showdown mode
    } else {
      return window.ui.getPlayerInputCode();
    }
  }

  checkHasDrowned(){
    var currPlayerTile = helpers.getBoardTileTypeByPlayer(this);
    var isPlayerInWater = (currPlayerTile == 0);
    if (isPlayerInWater){
      game.killPlayer(this, 'It drowned. ');
    }
  }

  whereIsChaser(){

    var self = helpers.getPlayerByPlayerUid(this.uid); // *1

    if (self.distanceToChaser.x > self.distanceToChaser.y){
      if ((self.pos.x - chaser.pos.x) > 0){
        return 'west';
      } else {
        return 'east';
      }
    } else
    if (self.distanceToChaser.x < self.distanceToChaser.y){
      if ((self.pos.y - chaser.pos.y) > 0){
        return 'north';
      } else {
        return 'south';
      }
    } else
    if (self.distanceToChaser.x == self.distanceToChaser.y){
      if (self.pos.x > chaser.pos.x && self.pos.y > chaser.pos.y){
        return 'north-west';
      }
      if (self.pos.x < chaser.pos.x && self.pos.y > chaser.pos.y){
        return 'south-west'; 
      }
      if (self.pos.x > chaser.pos.x && self.pos.y < chaser.pos.y){
        return 'north-east';
      }
      if (self.pos.x < chaser.pos.x && self.pos.y < chaser.pos.y){
        return 'south-east';
      }
    }
  }

  whatIsInDirection(direction){

    if (!direction){
      throw 'You need to specify a direction ie. \'north\'';
    }

    let targetPos;
    if (direction == 'north'){
      targetPos = { x: this.pos.x, y: this.pos.y - 1 }
    } else
    if (direction == 'south'){
      targetPos = { x: this.pos.x, y: this.pos.y + 1 }
    } else
    if (direction == 'west'){
      targetPos = { x: this.pos.x - 1, y: this.pos.y }
    } else
    if (direction == 'east'){
      targetPos = { x: this.pos.x + 1, y: this.pos.y }
    } else {
      throw 'The direction specified is not valid, try something like \'north\'';
    }

    if (!window.board.isTileEmptyOfCharacters(targetPos.x, targetPos.y)){
      return 'character';
    } else
    if (!window.board.isTileInMapBoundaries(targetPos.x, targetPos.y)){
      return 'boundary';
    }

    if (window.board.getTile(targetPos.x, targetPos.y) == 0){
      return 'water';
    } else {
      return 'land';
    }
  }
}

/*
 *  "Elevates the player's access" to be able to call it's own methods, as the me reference
 *  given to the player and evaluated through eval() is not the player instance itself but a
 *  copy only. This ultimately means the player can't directly do things like `me.pos.x=40`.
 */