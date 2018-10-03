ui.initialiseCodeUI = function(){
  var textarea = document.querySelector('.code');
  window.codeMirror = CodeMirror(textarea, {
    value: startingCode,
    lineNumbers: true,
    mode: 'javascript',
    fullscreen: true,
    electricChars: true,
    extraKeys: {
      "F11": function(cm) {
        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
      },
      "Esc": function(cm) {
        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
      }
    }
  });
}

ui.cameraFollowChaser = function(){
	var tilesInOneRow = board.tiles[0].length;

  var docHeight = $(document).height();
	var stepWindowToTilesH = (docHeight / tilesInOneRow);
	var cameraPositionH = ((stepWindowToTilesH * 0.66) * ((chaser.pos.y + chaser.pos.x) / 2));

  var docWidth = $(document).width();
  var windowViewport = $(window).width();
  var stepWindowToTilesW = (docWidth / tilesInOneRow);
  var cameraPositionW = ((docWidth / 2) - (windowViewport / 2)) - (stepWindowToTilesW * ((chaser.pos.y - chaser.pos.x) / 2));
	
	var animationSpeed = (game.turnSpeed * 0.9);
	$("html, body").animate({ scrollTop: cameraPositionH, scrollLeft: cameraPositionW }, animationSpeed, 'swing', function(){});
}

ui.updateTurn = function(){
	document.querySelector('.turn-ui b').innerHTML = game.turn;
}

logger.log = function(message, elClass){
  var log = document.querySelector('.log');
  log.innerHTML += '<p class="' + elClass + '">' + message + '</p>';
  log.scrollTop = log.scrollHeight;
}

logger.clearLog = function(){
  var log = document.querySelector('.log');
  log.innerHTML = '';
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