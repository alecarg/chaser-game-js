game.init = function(){
  ui.init();
  ui.showBackdrop();
  board.create();
  game.turnSpeed = game.turnSpeedInitial;
  game.restart();
  game.passTurn();
  menu.init();
}

game.start = function(){
  ui.hideBackdrop();
  ui.startTimer();
  game.setPlayerName();
  game.restart();
}

game.restart = function(){
  players = [];
  game.turn = 0;
  game.turnOwner = null;
  game.instantiateChaser();
  game.instantiatePlayers();
  game.onUnpause = [];
  game.isPaused = false;
  game.difficultyIncreaseTurn = players.length * 60; // after 60 turns each player
  ui.cameraFollowChaser();
  logger.logNewGameStarted();
}

game.pause = function(){
	var pauseCheckbox = $('.pause input')[0];
	if (game.isPaused){
    ui.hideBackdrop();
		pauseCheckbox.checked = false;
    game.isPaused = false;
    game.runOnUnpause();
    game.passTurn();
  } else {
    ui.showBackdrop();
    pauseCheckbox.checked = true;
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
  logger.curateLog();
  game.checkIfGameOver();
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
  chaser.setTurnsThisCycle();
}

game.instantiatePlayers = function(){
  var playersToSpawn = game.multiplePlayers ? 7 : 1;
  for (var i = 0; i < playersToSpawn; i++) {
    var playerUid = i;
    var playerPosX = Math.floor((Math.random() * Math.floor(10) + 5));
    var playerPosY = 2 + i;
    var playerName = game.playerName || 'Player';
    players[i] = new Player(playerPosX, playerPosY, playerUid, playerName);
  }
}

game.instantiateChaser = function(){
  chaser = new Chaser(0, 0);
}

game.killPlayer = function(player, reason){
	var message = player.name + ' has died. ';
	message += reason ? reason : '';
	message += '(survived ' + game.turn + ' turns)';
  logger.log(message);

  var playerIndexInArray = helpers.getPlayerIndexInPlayersArr(player);

  if (player === game.turnOwner){ // killing the turnOwner messes up the next game.setTurnOwner(); we keep a copy of this for it; TODO
    game.turnOwner.index = playerIndexInArray;
  }

  players.splice(playerIndexInArray, 1);
}

game.checkTurnBasedConditions = function(){
  if (game.turn == game.difficultyIncreaseTurn){
  	logger.log('Game difficulty now MEDIUM. Chaser has 2 turns per cycle now.', 'attention-calling');
  }
}

game.checkIfGameOver = function(){
  if (players.length < 1){
    board.draw();
    console.log('Game over. Your player/s survived: ' + game.turn + ' turns.');
    game.restart();
  }
}

game.accelerateTurnSpeed = function(){
	game.turnSpeed = game.turnSpeed * 0.98;
}

game.timeOver = function(){
  logger.log('Your time is up! Thanks for participating in the chase.', 'attention-calling');
  game.pause();
  game.saveCode();
  setTimeout(function(){
    document.location.reload();
  }, 5000);
}

game.saveCode = function(){
  var playerName = game.playerName
  var inputCode = ui.getPlayerInputCode();
  var gameReadyCode = `
      showdown.participants.push({
        name: '${playerName}',
        code: \`${inputCode}\`
      });`

  download(gameReadyCode, 'player-code-' + Date.now() + '.js', 'text/plain');
}

game.setPlayerName = function(){
  game.playerName = $('input[name="playerName"]')[0].value;
}