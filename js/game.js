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
   // chaser.onNewTurn();

   game.setTurnOwner();

   helpers.forAllPlayers(function(i, p){
     p.setCurrDistanceToChaser();
     // p.onNewTurnFromLiveCode(); // p.onNewTurn();
     board.draw();
   });
   game.checkForDrownings();

   // game.turnSpeed = game.turnSpeed * 0.98;
}

game.setTurnOwner = function(){

	debugger;

	if (game.turnOwner == null){
		return game.turnOwner = players[0]; // set the first player as the  initial turn owner
	}

	var isCurrTurnOwnerAPlayer = (game.turnOwner instanceof Player);
	if(!isCurrTurnOwnerAPlayer){ // then assume last turn was the chaser
		return game.turnOwner = players[0]; // set the first player as the turn owner again
	}

	var isCurrTurnOwnerTheLastPlayer = (game.turnOwner.number == players.length);
	if (isCurrTurnOwnerTheLastPlayer){
		return game.turnOwner = chaser;
	}

	var nextPlayerUid = game.turnOwner.uid + 1;
	game.turnOwner = players[nextPlayerUid]; // set the turn owner as the next player
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
        setTimeout(function(){
          logger.log(player.number + ' has drowned.');
          game.killPlayer(player, true);
        }, 0);
      }
  });
}

game.killPlayer = function(player){
    logger.log(player.number + ' has died. It survived ' + game.turn + ' turns.');
    var playerPosInArray = helpers.getPlayerIndexInPlayersArr(player);
    players.splice(playerPosInArray, 1);
}