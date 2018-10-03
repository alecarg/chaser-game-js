class Player {
  constructor(posx, posy, uid){
    this.uid = uid;
    this.number = uid + 1;

    this.pos = {};
    this.pos.x = posx;
    this.pos.y = posy;

    this.distanceToChaser = {};

    this.direction = null;
  }

  setCurrDistanceToChaser(){
    this.distanceToChaser.x = Math.abs(chaser.pos.x - this.pos.x);
    this.distanceToChaser.y = Math.abs(chaser.pos.y - this.pos.y);
    this.distanceToChaser.total = this.distanceToChaser.x + this.distanceToChaser.y;
  }

  move(direction){
    if (direction == 'left'){
      if (board.isTileSuitableForMovement(this.pos.x - 1, this.pos.y)){
      	return this.pos.x--;
      }
    } else
    if (direction == 'right'){
      if (board.isTileSuitableForMovement(this.pos.x + 1, this.pos.y)){
        return this.pos.x++;
      }
    } else
    if (direction == 'up'){
      if (board.isTileSuitableForMovement(this.pos.x, this.pos.y - 1)){
        return this.pos.y--;
      }
    } else
    if (direction == 'down'){
      if (board.isTileSuitableForMovement(this.pos.x, this.pos.y + 1)){
        return this.pos.y++;
      }
    }

    logger.log('Player ' + this.number + ' has not moved this turn as the target tile was either occupied or outside the map boundaries.');
  }

  onNewTurn(){
    logger.curateLog();
    this.runCodeFromInput();
  }

  runCodeFromInput(){

    // Add helpers
    const me = {
      number: this.number,
      pos: this.pos,
      move: this.move,
      whereIsChaser: this.whereIsChaser
    };
    const log = function(toLog){
      window.logger.log('Log: ' + toLog, 'player-log')
    };

    // Unexpose
    const Chaser = {};
    const players = {};
    const Player = {};
    const helpers = {};
    const game = {};

    // Half-expose
    const chaser = {
      pos: window.chaser.pos
    };
    const ui = {
      getPlayerInputCode: window.ui.getPlayerInputCode
    };

    // Blacklisted words in code
    var blacklistedWords = ['window', 'document', 'console', 'alert', 'debugger'];
    var isPlayerInputCodeSafe = _.every(blacklistedWords, function(word){ return (ui.getPlayerInputCode().indexOf(word) == -1) });
    if (!isPlayerInputCodeSafe){
      return window.logger.log('Your code will not execute if you try to use window, document, console, alert or debugger.', 'error');
    }

    // Run player's code
    try {
      (function(){
        eval(ui.getPlayerInputCode());
      })(); // self executing function removes the 'this' reference to the player instance
    } catch (e){
      window.logger.log('Your player code has thrown an error: ' + e, 'error');
    }
  }

  whereIsChaser(){
  	return 'right behind you';
  }
}