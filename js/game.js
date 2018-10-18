game.init = function(){
  window.removeEventListener('load', game.init);
  board.create();
  ui.initialiseCodeUI();
  ui.startTimer();
  game.restart();
  game.passTurn();
}

game.restart = function(){
  game.turn = 0;
  game.turnSpeed = game.turnSpeedInitial;
  game.turnOwner = null;
  game.instantiateChaser();
  game.instantiatePlayers();
  game.onUnpause = [];
  game.isPaused = false;
  ui.cameraFollowChaser();
  logger.clearLog();
}

game.pause = function(){
	var btn = document.querySelector('button.pause');
  var backdrop = document.querySelector('.backdrop');
	if (game.isPaused){
    backdrop.classList.remove('active');
		btn.innerHTML = 'Pause';
    game.isPaused = false;
    game.runOnUnpause();
    game.passTurn();
  } else {
    backdrop.classList.add('active');
    btn.innerHTML = 'Unpause';
    game.isPaused = true;
    game.stopTurnPassing();
	}
}

game.runOnUnpause = function(){
  for (var i = 0; i < game.onUnpause.length; i++) {
    game.onUnpause[i].call(game.turnOwner);
    game.onUnpause.splice(i, 1); // remove fn
	}
}

game.passTurn = function(){
  game.stopTurnPassing();
  if (game.isPaused){ return; }
  game.turnInterval = setInterval(function(){
  	game.turn++;
  	game.onNewTurn();
    game.passTurn();
  }, game.turnSpeed);
}

game.stopTurnPassing = function(){
  clearInterval(game.turnInterval);
}

game.onNewTurn = function(){

  ui.updateTurn();
  game.checkTurnBasedConditions();
  game.setTurnOwner();
  game.turnOwner.onNewTurn();
  board.draw();

  chaser.checkHasEaten();  
  game.checkForDrownings();
  game.checkIfGameOver();
  // game.accelerateTurnSpeed();
}

game.setTurnOwner = function(){

	// On new game
	if (game.turnOwner == null){
		return game.turnOwner = players[0];
	}

	// Chaser to (Player or Chaser again if extra turn)
	var isCurrTurnOwnerTheChaser = (game.turnOwner instanceof Chaser);
	if (isCurrTurnOwnerTheChaser){
		var isChaserExtraTurn = chaser.isExtraTurnsRemainig();
		if (isChaserExtraTurn){
			return game.turnOwner = chaser;
		} else {
			game.onNewTurnCycle();
			return game.turnOwner = players[0];
		}
	}

	// Player to Chaser
	var isCurrTurnOwnerTheLastPlayer = ((helpers.getPlayerIndexInPlayersArr(game.turnOwner) + 1) >= players.length);
	if (isCurrTurnOwnerTheLastPlayer){
		return game.turnOwner = chaser;
	}

	// Player to Player
	var nextPlayerIndex = helpers.getPlayerIndexInPlayersArr(game.turnOwner) + 1;
	return game.turnOwner = players[nextPlayerIndex]; // set the turn owner as the next player
}

game.onNewTurnCycle = function(){
	ui.cameraFollowChaser();
  helpers.forAllPlayers(function(i, p){
    p.movesThisTurn = 1;
  });
}

game.instantiatePlayers = function(){
  var playersToSpawn = 1;
  for (var i = 0; i < playersToSpawn; i++) {
    var playerUid = i;
    var playerPosX = Math.floor((Math.random() * Math.floor(10) + 5));
    var playerPosY = 2 + i;
    players[i] = new Player(playerPosX, playerPosY, playerUid);
  }
}

game.instantiateChaser = function(){
  chaser = new Chaser(0, 0);
}

game.checkForDrownings = function(){
  helpers.forAllPlayers(function(i, player){
    var currPlayerTile = helpers.getPlayerBoardTile(player);
    var isPlayerInWater = (currPlayerTile == 0);
    if (isPlayerInWater){
      game.killPlayer(player, 'It drowned. ');
    }
  });
}

game.killPlayer = function(player, reason){
	var message = 'Player ' + player.number + ' has died. ';
	message += reason ? reason : '';
	message += 'It survived ' + game.turn + ' turns.';
    logger.log(message);

    var playerPosInArray = helpers.getPlayerIndexInPlayersArr(player);
    players.splice(playerPosInArray, 1);
}

game.checkTurnBasedConditions = function(){
  if (game.turn == 50){
  	logger.log('Game difficulty now MEDIUM. Chaser has 2 turns per cycle now.', 'attention-calling');
  }
}

game.checkIfGameOver = function(){
  if (players.length < 1){
    console.log('Game over. Your escapers survived: ' + game.turn + ' turns.');
    game.restart();
  }
}

game.accelerateTurnSpeed = function(){
	game.turnSpeed = game.turnSpeed * 0.98;
}

game.timeOver = function(){
  game.saveCode();
  game.pause();
  setTimeout(function(){
    menu.init();
  }, 2000);
}

game.saveCode = function(){
  download(ui.getPlayerInputCode(), 'player-code-' + Date.now() + '.js', 'text/plain');
}