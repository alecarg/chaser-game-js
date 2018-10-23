var showdown = {
  participants: [],
  winner: null
};

/**
 *  Kill certain functionalities
 */
game.saveCode = function(){};
game.setPlayerName = function(){};
ui.startTimer = function(){};

/**
 *  Modify certain functionalities
 */
game.multiplePlayers = true;

game.instantiatePlayers = function(){
  for (var i = 0; i < showdown.participants.length; i++) {
    var playerUid = i;
    var playerPosX = Math.floor((Math.random() * Math.floor(10) + 5));
    var playerPosY = 2 + i;
    var playerName = showdown.participants[i].name;
    var playerCode = showdown.participants[i].code;
    players[i] = new Player(playerPosX, playerPosY, playerUid, playerName, playerCode);
  }
}

game.getPlayerName = function(player){
  return player.name;
}

game.checkIfGameOver = function(){
  if (players.length <= 1){
    board.draw();
    game.pause();
    logger.log('Game over. Player ' + players[0].name + ' has won! (survived ' + game.turn + ' turns)', 'attention-calling');
    showdown.winner = players[0].name;
    showdown.showWinner();
  }
}

/*
 *  Showdown specific functionality
 */
showdown.init = function(){
  menu.init();
  $('body').fadeIn();
  showdown.bindEventHandlers();
}

showdown.bindEventHandlers = function(){

  // Pause with spacebar
  $('body').on('keyup', function(e){
    if(e.keyCode == 32){
      game.pause();    
    }
  });

  // Start a fresh, paused game
  $('.start-showdown').on('click', function(e){
    game.init();
    logger.clearLog();
    menu.hide();
    game.start();
    game.pause();
  });
}

showdown.showWinner = function(){
  setTimeout(function(){
    $('.winner').html('Winner: ' + showdown.winner + '!');
    $('.backdrop').animate({opacity: 0.5});
    $('.winner').animate({top: '50%'});
  }, 1000)
}