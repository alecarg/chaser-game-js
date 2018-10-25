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
    logger.log('Game over. Player ' + players[0].name + ' has won! (survived ' + game.turn + ' turns)', 'attention-calling');
    showdown.winner = players[0].name;
    showdown.showWinner();
  }
}

game.increaseDifficulty = function(){
  var message = 'Difficulty increase!';
  showdown.announce(message, 'temporary');
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
  game.pause();
  var message = 'Winner: ' + showdown.winner + '!';
  showdown.announce(message);
}

showdown.announce = function(message, temporary){
  
  game.pause();

  setTimeout(function(){

    $('.backdrop').animate({opacity: 0.5});
    var announceEl = $('.showdown-announcement');
    announceEl.html(message);
    announceEl.animate({'top': '50%', 'margin-left': -(announceEl[0].offsetWidth / 2)});

    if (!!temporary){
      setTimeout(function(){
        $('.backdrop').animate({opacity: 0});
        announceEl.animate({'top': '-50%'});
      }, 8000);
    }

  }, 500);
}