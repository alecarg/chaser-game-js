game.init = function(){
  window.removeEventListener('load', game.init);

  game.turnSpeed = game.turnSpeedInitial;
  game.instantiatePlayers();
  game.instantiateChaser();
  board.create();
  game.passTurn();

  ui.initialiseCodeUI();
}

game.restart = function(){
  game.turn = 0;
  game.turnSpeed = game.turnSpeedInitial;
  game.instantiatePlayers();
  game.instantiateChaser();
  logger.clearLog();
}

game.passTurn = function(){
  game.turn++;
  document.querySelector('.turn-ui b').innerHTML = game.turn;

  if (players.length < 1){
    alert('Game over. Your escapers survived: ' + game.turn + ' turns.');
    game.restart();
  }

  if (game.turn > 1000){
    alert('Game timeout. 1000 turns are way too many.');
    game.restart(); 
  }

  setTimeout(function(){
    game.passTurn();
    game.onNewTurn();
  }, game.turnSpeed);
}

game.onNewTurn = function(){

   game.setTurnOwner();
   game.turnOwner.onNewTurn();
   board.draw();
   game.checkForDrownings();

   // Others
   helpers.forAllPlayers(function(i, p){
     p.setCurrDistanceToChaser();
   });
   // game.turnSpeed = game.turnSpeed * 0.98;
}

game.setTurnOwner = function(){

	if (game.turnOwner == null){
		return game.turnOwner = players[0]; // set the first player as the  initial turn owner
	}

	var isCurrTurnOwnerTheChaser = (game.turnOwner instanceof Chaser);
	if (isCurrTurnOwnerTheChaser){
		return game.turnOwner = players[0]; // set the first player as the turn owner again
	}

	var isCurrTurnOwnerTheLastPlayer = ((helpers.getPlayerIndexInPlayersArr(game.turnOwner) + 1) >= players.length);
	if (isCurrTurnOwnerTheLastPlayer){
		return game.turnOwner = chaser;
	}

	var nextPlayerIndex = helpers.getPlayerIndexInPlayersArr(game.turnOwner) + 1;
	game.turnOwner = players[nextPlayerIndex]; // set the turn owner as the next player
}

game.instantiatePlayers = function(){
  var playersToSpawn = 7;
  for (var i = 0; i < playersToSpawn; i++) {
    var playerUid = i;
    var playerPosX = Math.floor((Math.random() * Math.floor(10) + 5));
    var playerPosY = 2 + i;
    players[i] = new Player(playerPosX, playerPosY, playerUid);
  }
}

game.instantiateChaser = function(){
  chaser = new Chaser(1, 5);
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
	var message = player.number + ' has died. ';
	message += reason ? reason : '';
	message += 'It survived ' + game.turn + ' turns.';
    logger.log(message);

    var playerPosInArray = helpers.getPlayerIndexInPlayersArr(player);
    players.splice(playerPosInArray, 1);
}