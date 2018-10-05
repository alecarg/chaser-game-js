class Player {
  constructor(posx, posy, uid){
    this.uid = uid;
    this.number = uid + 1;
    this.pos = {};
    this.pos.x = posx;
    this.pos.y = posy;
    this.movesThisTurn = 1;
    this.distanceToChaser = {};
    this.setDistanceToChaser();
  }

  setDistanceToChaser(){
    this.distanceToChaser.x = Math.abs(chaser.pos.x - this.pos.x);
    this.distanceToChaser.y = Math.abs(chaser.pos.y - this.pos.y);
    this.distanceToChaser.total = this.distanceToChaser.x + this.distanceToChaser.y;
  }

  move(direction){

    var self = helpers.getPlayerByPlayerUid(this.uid); // elevates instance access from me.foo() when using this

    var targetPos;
    if (direction == 'left'){
      targetPos = { x: self.pos.x - 1, y: self.pos.y };
    } else
    if (direction == 'right'){
      targetPos = { x: self.pos.x + 1, y: self.pos.y };
    } else
    if (direction == 'up'){
      targetPos = { x: self.pos.x, y: self.pos.y - 1 };
    } else
    if (direction == 'down'){
      targetPos = { x: self.pos.x, y: self.pos.y + 1 };
    }

    var isMovementValid = (self.hasMovesThisTurn() && board.isTileSuitableForMovement(targetPos.x, targetPos.y));
    if (!isMovementValid){
      return logger.log('Player ' + self.number + ' has not moved this turn as the target tile was either occupied or outside the map boundaries.');
    }

    if (game.isPaused){
      return logger.log('Player ' + self.number + ' has not moved this turn as the game is paused.')
    }

    	self.pos = targetPos;
      self.movesThisTurn--;
  }

  onNewTurn(){
    logger.curateLog();
    this.setDistanceToChaser();
    this.runCodeFromInput();
  }

  hasMovesThisTurn(){
    return this.movesThisTurn > 0;
  }

  runCodeFromInput(){

    // Add helpers
    const me = {
      uid: _.clone(this.uid), // not for the player to query, but for us to identify and elevate access in move()
      pos: _.clone(this.pos),
      move: this.move,
      whereIsChaser: this.whereIsChaser
    };
    const log = function(toLog){
      window.logger.log('Log: ' + toLog, 'player-log')
    };
    const pause = function(){
      window.game.pause();
      window.game.onUnpause.push(function(){
        this.runCodeFromInput();
        board.draw(); // @todo: feels wrong, but otherwise the player moves and doesn't get shown until the next turn
      })
    }

    // Unexpose
    const Chaser = {};
    const players = {};
    const Player = {};
    const helpers = {};
    const game = {};
    const ui = {};

    // Half-expose
    const chaser = {
      pos: _.clone(window.chaser.pos)
    };

    var playerCode = window.ui.getPlayerInputCode();

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
      console.log('Player code error. '); console.log(e);
      window.logger.log('Your player code has thrown an error: ' + e, 'error');
    }
  }

  whereIsChaser(){
  	return 'right behind you';
  }
}