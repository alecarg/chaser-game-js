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
    this.onNewTurnFromLiveCode();
    logger.curateLog();
  }

  onNewTurnFromLiveCode(){

  	// Keep a reference
  	const logger = window.logger;

	// Expose
  	const me = {
  		number: this.number,
  		pos: this.pos,
  		move: this.move,
  		whereIsChaser: this.whereIsChaser
  	};
  	const chaser = {
  		pos: window.chaser.pos
  	};
  	const log = function(toLog){
  		logger.log('Log: ' + toLog, 'player-log')
  	};

  	// Unexpose
  	const Chaser = {};
  	const players = {};
  	const Player = {};
	const helpers = {};
	const ui = {};
	const game = {};
	const alert = function(){};

  	// Clear errors
  	var errorInLogger = document.querySelector('.log p.error');
	if (errorInLogger){ errorInLogger.outerHTML = ''; }

	// Clear player log
  	var playerLogInLogger = document.querySelectorAll('.log p.player-log');
	if (playerLogInLogger.length){
		for (var i = 0; i < playerLogInLogger.length; i++) {
			playerLogInLogger[i].outerHTML = '';
		}
	}

	// Run player's code
	var windowObjectUsed = (codeMirror.getValue().indexOf('window') > -1);
  	if (windowObjectUsed){
  		return logger.log('Your code will not execute if you try to access the window object.', 'error');
  	} else {
	  	try {  		
	    	eval(codeMirror.getValue());
	  	} catch (e){
	  		logger.log('Your player code has thrown an error: ' + e, 'error');
	  	}
  	}
  }

  whereIsChaser(){
  	return 'right behind you';
  }
}