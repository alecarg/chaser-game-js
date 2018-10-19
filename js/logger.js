logger.log = function(message, elClass){
  var log = document.querySelector('.log');
  log.innerHTML += '<p class="' + elClass + '">' + message + '</p>';
  log.scrollTop = log.scrollHeight;
}

logger.clearLog = function(){
  var log = document.querySelector('.log');
  log.innerHTML = '';
}

logger.logNewGameStarted = function(){
  logger.log('A new game has started.', 'attention-calling')
}

logger.curateLog = function(){

  // Clear errors
  var errorInLogger = document.querySelectorAll('.log p.error');
  if (errorInLogger.length){
    for (var i = 0; i < errorInLogger.length; i++) { 
      errorInLogger[i].outerHTML = '';
    }
  }

  // Clear player log
  var playerLogInLogger = document.querySelectorAll('.log p.player-log');
  if (playerLogInLogger.length){
    for (var i = 0; i < playerLogInLogger.length; i++) { 
      playerLogInLogger[i].outerHTML = '';
    }
  }
}