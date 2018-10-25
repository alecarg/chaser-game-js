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
    var playerPosX = Math.floor((Math.random() * Math.floor(5) + 10));
    var playerPosY = 13 + i;
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


/**
 *  Extend certain functionalities
 */

game.killPlayerCopy = game.killPlayer;
game.killPlayer = function(player, reason){
  var playerKilled = game.killPlayerCopy(player, reason).player;
  var playerKilledName = playerKilled.name;
  $('.participant[data-name="' + playerKilledName + '"]').removeClass('alive');
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
    showdown.start();
  });
}

showdown.start = function(){
  game.init();
  logger.clearLog();
  menu.hide();
  game.start();
  game.pause();
  showdown.constructParticipantsTracker();
}

showdown.constructParticipantsTracker = function(){
  var participantsEl = $('.participants-tracker');
  var participantsHTML = '';
  for (var i = 0; i < players.length; i++) {
    participantsHTML += `
      <li class="participant alive" data-name="${players[i].name}">
        ${players[i].name}
        <span class="badge-alive badge badge-primary badge-pill">alive</span>
        <span class="badge-dead badge badge-secondary badge-pill">dead</span>
      </li>`;
  }
  participantsEl.html(participantsHTML);
}

showdown.showWinner = function(){
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