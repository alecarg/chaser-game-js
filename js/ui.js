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
	var windowHeight = $(window).height();
	var totalTilesH = board.tiles[0].length;
	var ratioWindowToTilesH = (windowHeight / totalTilesH);
	var cameraPositionH = (ratioWindowToTilesH * ((chaser.pos.y + chaser.pos.x) / 2));
	
	var animationSpeed = (game.turnSpeed * 0.95);

	$("html, body").animate({scrollTop: cameraPositionH }, animationSpeed, 'swing', function() {});
}

logger.log = function(message, attentionCalling){
  var log = document.querySelector('.log');
  var attentionCallingClass = attentionCalling ? 'attention-calling' : '';
  log.innerHTML += '<p class="' + attentionCallingClass + '">' + message + '</p>';
  log.scrollTop = log.scrollHeight;
}

logger.clearLog = function(){
  var log = document.querySelector('.log');
  log.innerHTML = '';
}
