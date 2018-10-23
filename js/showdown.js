var showdown = {
  participants: []
};

/**
 *  Kill certain functionalities
 */
game.saveCode = function(){};

/**
 *  Modify certain functionalities
 */
game.instantiatePlayers = function(){
  
  // var participantFiles = [
  //   'player-1.js',
  //   'player-2.js'
  // ];

  // for (var i = 0; i < participantFiles.length; i++) {
  //   $.getScript( 'participants-code/' + participantFiles[i], function( data, textStatus, jqxhr ) {
  //     console.log( data ); // Data returned
  //   });
  // }

  for (var i = 0; i < showdown.participants.length; i++) {
    var playerUid = i;
    var playerPosX = Math.floor((Math.random() * Math.floor(10) + 5));
    var playerPosY = 2 + i;
    players[i] = new Player(playerPosX, playerPosY, playerUid);
    players[i].name = showdown.participants[i].name;
    players[i].code = showdown.participants[i].code;
    players[i].getPlayerCode = function(){
      return this.code;
    }
  }
}

/*
 *  Showdown specific functionality
 */ 
$('body').on('keyup', function(e){
  if(e.keyCode == 32){
    game.pause();    
  }
});