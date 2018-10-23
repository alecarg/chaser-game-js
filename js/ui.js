ui.init = function(){
  $('body').fadeIn();
  window.removeEventListener('load', game.init);
  ui.bindEventHandlers();
  ui.initialiseCodeUI();
  ui.initialiseTurnSpeedSlider();
  ui.initialiseTooltips();
}

ui.bindEventHandlers = function(){
  $('.pause').off('click').on('click', ui.handlePauseClicked);
  $('.restart').off('click').on('click', ui.handleRestartClicked);
  $('.simulate-multiple').off('click').on('click', ui.handleSimulateMultipleClicked);
}

ui.handlePauseClicked = function(e){
  e.preventDefault();
  game.pause();
}

ui.handleRestartClicked = function(e){
  e.preventDefault();
  game.restart();
}

ui.handleSimulateMultipleClicked = function(e){
  e.preventDefault();

  var checkbox = $(e.target).find('input')[0];
  if (checkbox.checked){
    checkbox.checked = false;
    game.playersToSpawn = 1;
  } else {
    checkbox.checked = true;
    game.playersToSpawn = 7;
  }

  game.restart();
}

ui.initialiseCodeUI = function(){
  var textarea = document.querySelector('.code');
  window.codeMirror = CodeMirror(textarea, {
    value: ui.startingCode,
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

ui.getPlayerInputCode = function(){
  return codeMirror.getValue();
}

ui.initialiseTurnSpeedSlider = function(){
  $('[data-slider-id="slider-turn-speed"]').slider({
    ticks: [50, 1000],
    formatter: function(value) {
      return 'Turn time: ' + value;
    }
  }).on('slide', ui.handleTurnSpeedSlided);
}

ui.handleTurnSpeedSlided = function(e){
  game.turnSpeed = e.value;
  console.log(game.turnSpeed);
}

ui.initialiseTooltips = function(){
  $('[data-toggle="tooltip"]').tooltip();
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

ui.codeFullscreen = function(){
  var cm = window.codeMirror;
  cm.setOption("fullScreen", !cm.getOption("fullScreen"));
}

ui.showBackdrop = function(){
  document.querySelector('.backdrop').classList.add('active');
}

ui.hideBackdrop = function(){
  document.querySelector('.backdrop').classList.remove('active');
}

ui.startTimer = function() { // https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer

  clearInterval(ui.timer);

  var duration = game.timePerPlayer,
      display = document.querySelector('.timer'),
      start = Date.now(),
      diff,
      minutes,
      seconds;

  function timer() {
      // get the number of seconds that have elapsed since 
      // startTimer() was called
      diff = duration - (((Date.now() - start) / 1000) | 0);

      // does the same job as parseInt truncates the float
      minutes = (diff / 60) | 0;
      seconds = (diff % 60) | 0;

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      try {
        display.textContent = minutes + ":" + seconds; 
      } catch(e){
        console.debug('Can\'t update timer. Element might not have been found.')
      }

      if (diff <= 0) {
          // restart (and add one second so that the count down starts at 
          // the full duration example 05:00 not 04:59)
          // start = Date.now() + 1000;

          clearInterval(ui.timer);
          game.timeOver();
      }
  };

  timer(); // we don't want to wait a full second before the timer starts

  ui.timer = setInterval(timer, 1000);
}